"use strict";

// Finds Blender and runs Dimensio's Blender scripts headless: the check that
// measures and renders a learner's .blend (blender/dimensio_check.py), the
// starter scenes (blender/dimensio_starter.py), and opening a file in
// Blender's normal window.
//
// No electron import: the main process passes in what it knows, and the
// tests inject spawn and fs. `measure` and `makeStarter` reject with an Error
// whose message can be shown to the learner as it is; `error.code` says what
// kind of failure it was and `error.output` holds the end of Blender's log.

const nodeFs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");

const MIN_VERSION = Object.freeze([5, 2]);
const VIEWS = Object.freeze(["front", "right", "top", "persp"]);
const DEFAULT_TIMEOUT_MS = 120 * 1000;
const VERSION_TIMEOUT_MS = 15 * 1000;
const OUTPUT_LIMIT = 256 * 1024;
const STARTER_ID = /^[a-z0-9][a-z0-9-]{0,63}$/;
const CHECK_PREFIX = "DIMENSIO_CHECK=";
const STARTER_PREFIX = "DIMENSIO_STARTER=";
const STEAM_BLENDER = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Blender\\blender.exe";

const INSTALL_FIX = "Install Blender 5.2 LTS from blender.org or Steam. If it is installed somewhere else, choose its blender.exe in Settings.";

function pathFor(platform) {
  return platform === "win32" ? path.win32 : path.posix;
}

function failure(message, code, extra = {}) {
  return Object.assign(new Error(message), { code }, extra);
}

// ------------------------------------------------------------------- finding

function savedBlenderPath(settingsPath, fs) {
  if (!settingsPath) return null;
  let settings;
  try {
    settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
  } catch {
    return null;
  }
  const value = settings?.blenderPath ?? settings?.blender?.path ?? (typeof settings?.blender === "string" ? settings.blender : null);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function envValue(env, name) {
  if (env[name] !== undefined) return env[name];
  const key = Object.keys(env).find((item) => item.toLowerCase() === name.toLowerCase());
  return key ? env[key] : undefined;
}

function compareVersions(left, right) {
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const difference = (left[index] || 0) - (right[index] || 0);
    if (difference) return difference;
  }
  return 0;
}

function programFilesCandidates(env, fs, p) {
  const roots = [envValue(env, "ProgramFiles") || "C:\\Program Files", envValue(env, "ProgramW6432")].filter(Boolean);
  const found = [];
  for (const root of [...new Set(roots)]) {
    const foundation = p.join(root, "Blender Foundation");
    let entries = [];
    try {
      entries = fs.readdirSync(foundation);
    } catch {
      continue;
    }
    for (const entry of entries) {
      const match = /^Blender (\d+)\.(\d+)$/i.exec(String(entry));
      if (match && Number(match[1]) >= 5) {
        found.push({ path: p.join(foundation, entry, "blender.exe"), version: [Number(match[1]), Number(match[2])] });
      }
    }
    found.push({ path: p.join(foundation, "Blender", "blender.exe"), version: [0, 0] });
  }
  return found.sort((left, right) => compareVersions(right.version, left.version)).map((item) => item.path);
}

function steamCandidates(env, fs, p) {
  const roots = [
    p.join(envValue(env, "ProgramFiles(x86)") || "C:\\Program Files (x86)", "Steam"),
    p.join(envValue(env, "ProgramFiles") || "C:\\Program Files", "Steam"),
  ];
  const libraries = [...roots];
  for (const root of roots) {
    try {
      const text = fs.readFileSync(p.join(root, "steamapps", "libraryfolders.vdf"), "utf8");
      for (const match of text.matchAll(/^\s*"path"\s+"([^"]+)"/gm)) libraries.push(match[1].replace(/\\\\/g, "\\"));
    } catch {
      // no Steam here
    }
  }
  const candidates = [STEAM_BLENDER, ...libraries.map((library) => p.join(library, "steamapps", "common", "Blender", "blender.exe"))];
  return [...new Set(candidates)];
}

function pathCandidates(env, platform, p) {
  const value = envValue(env, "PATH") || "";
  const names = platform === "win32" ? ["blender.exe"] : ["blender"];
  return value.split(platform === "win32" ? ";" : ":").filter(Boolean)
    .flatMap((directory) => names.map((name) => p.join(directory.replace(/^"|"$/g, ""), name)));
}

function readVersion(executable, spawnSync) {
  let result;
  try {
    result = spawnSync(executable, ["--version"], { encoding: "utf8", windowsHide: true, timeout: VERSION_TIMEOUT_MS });
  } catch {
    return null;
  }
  const text = `${result?.stdout || ""}\n${result?.stderr || ""}`;
  const match = /Blender\s+(\d+)\.(\d+)(?:\.(\d+))?/.exec(text);
  return match ? `${match[1]}.${match[2]}.${match[3] || 0}` : null;
}

function judge(executable, source, version) {
  if (!version) {
    return {
      ok: false, path: executable, source, version: null,
      reason: `Blender was found at ${executable}, but it did not report its version.`,
      fix: INSTALL_FIX,
    };
  }
  const parts = version.split(".").map(Number);
  if (compareVersions(parts, MIN_VERSION) < 0) {
    return {
      ok: false, path: executable, source, version,
      reason: `Blender ${version} is older than 5.2, the version the course is written for.`,
      fix: "Install Blender 5.2 LTS from blender.org or Steam, then choose its blender.exe in Settings.",
    };
  }
  return { ok: true, path: executable, source, version, reason: null, fix: null };
}

/**
 * Find Blender and read its version.
 *
 * Looks in this order: the path saved in the settings JSON (`blenderPath`),
 * DIMENSIO_BLENDER, BLENDER_EXECUTABLE (the variable Forge3D used), Program
 * Files\Blender Foundation\Blender 5.x newest first, Steam, then PATH. A path
 * you chose (settings or a variable) is used whatever its version; among the
 * ones found by looking, the first that is 5.2 or later wins.
 *
 * Returns { ok, path, version, reason, fix, source }. `ok` is false when
 * Blender is missing or older than 5.2, with a reason and a fix in plain
 * words.
 */
function findBlender({
  settingsPath,
  env = process.env,
  platform = process.platform,
  fs = nodeFs,
  spawnSync = childProcess.spawnSync,
} = {}) {
  const p = pathFor(platform);
  const exists = (candidate) => {
    try {
      return Boolean(candidate) && fs.existsSync(candidate);
    } catch {
      return false;
    }
  };
  const chosen = [
    { path: savedBlenderPath(settingsPath, fs), source: "settings" },
    { path: envValue(env, "DIMENSIO_BLENDER"), source: "DIMENSIO_BLENDER" },
    { path: envValue(env, "BLENDER_EXECUTABLE"), source: "BLENDER_EXECUTABLE" },
  ];
  const missing = chosen.filter((item) => item.path && !exists(item.path));
  for (const item of chosen) {
    if (item.path && exists(item.path)) return judge(item.path, item.source, readVersion(item.path, spawnSync));
  }

  const looked = platform === "win32"
    ? [
      ...programFilesCandidates(env, fs, p).map((candidate) => ({ path: candidate, source: "program-files" })),
      ...steamCandidates(env, fs, p).map((candidate) => ({ path: candidate, source: "steam" })),
    ]
    : [];
  looked.push(...pathCandidates(env, platform, p).map((candidate) => ({ path: candidate, source: "path" })));

  let first = null;
  const seen = new Set();
  for (const item of looked) {
    const key = platform === "win32" ? item.path.toLowerCase() : item.path;
    if (seen.has(key) || !exists(item.path)) continue;
    seen.add(key);
    const verdict = judge(item.path, item.source, readVersion(item.path, spawnSync));
    if (verdict.ok) return verdict;
    first ||= verdict;
  }
  if (first) return first;
  const reason = missing.length
    ? `Blender was not found. The path in ${missing[0].source === "settings" ? "Settings" : missing[0].source} does not exist: ${missing[0].path}`
    : "Blender was not found.";
  return { ok: false, path: null, source: null, version: null, reason, fix: INSTALL_FIX };
}

// ------------------------------------------------------------------- running

/**
 * Where dimensio_check.py and dimensio_starter.py live: the `toolkitDir`
 * option, then the packaged copy (resources/forge3d-toolkit/blender, which
 * desktop/package.json's extraResources fills from ../blender), then the
 * repository's blender/ folder.
 */
function resolveToolkitDir({ toolkitDir, resourcesPath = process.resourcesPath, fs = nodeFs } = {}) {
  if (toolkitDir) return toolkitDir;
  if (resourcesPath) {
    const packaged = path.join(resourcesPath, "forge3d-toolkit", "blender");
    if (fs.existsSync(path.join(packaged, "dimensio_check.py"))) return packaged;
  }
  return path.resolve(__dirname, "..", "..", "..", "blender");
}

function stopProcessTree(child, { platform, spawn }) {
  if (!child || (child.exitCode !== null && child.exitCode !== undefined)) return;
  if (platform === "win32" && child.pid) {
    try {
      const killer = spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], { windowsHide: true, stdio: "ignore" });
      killer.on?.("error", () => child.kill?.());
      return;
    } catch {
      // fall through to a plain kill
    }
  }
  try {
    child.kill?.("SIGKILL");
  } catch {
    // already gone
  }
}

/** Run Blender with `args` and resolve with { code, output }; reject on timeout or spawn failure. */
function runBlender(blenderPath, args, { spawn, platform, timeoutMs, what }) {
  return new Promise((resolve, reject) => {
    let output = "";
    let settled = false;
    let child;
    try {
      child = spawn(blenderPath, args, { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
    } catch (error) {
      reject(failure(`Blender could not be started: ${error.message}`, "spawn-failed"));
      return;
    }
    const append = (chunk) => {
      output = `${output}${String(chunk)}`;
      if (output.length > OUTPUT_LIMIT) output = output.slice(-OUTPUT_LIMIT);
    };
    child.stdout?.on("data", append);
    child.stderr?.on("data", append);
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      stopProcessTree(child, { platform, spawn });
      const seconds = Math.max(1, Math.round(timeoutMs / 1000));
      reject(failure(`${what} took longer than ${seconds} second${seconds === 1 ? "" : "s"}, so Blender was stopped.`, "timeout", { output }));
    }, timeoutMs);
    child.once("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(failure(`Blender could not be started: ${error.message}`, "spawn-failed", { output }));
    });
    child.once("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ code, output });
    });
  });
}

function prefixedJson(output, prefix) {
  const line = String(output).split(/\r?\n/).reverse().find((item) => item.startsWith(prefix));
  if (!line) return null;
  try {
    return JSON.parse(line.slice(prefix.length));
  } catch {
    return null;
  }
}

/** The most useful line of a Blender log that ended without a result. */
function blenderComplaint(output) {
  const lines = String(output).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const error = lines.reverse().find((line) => /\bERROR\b|^Error:|Traceback|Exception/i.test(line));
  if (!error) return null;
  return error.replace(/^\d{2}:\d{2}\.\d{3}\s+\S+\s+\|\s*/, "").replace(/^ERROR\s+/, "");
}

function makeAbsolute(report, outDir) {
  const absolute = (name) => (typeof name === "string" && name && !path.isAbsolute(name) ? path.join(outDir, name) : name);
  if (report.renders && typeof report.renders === "object") {
    for (const view of Object.keys(report.renders)) report.renders[view] = absolute(report.renders[view]);
  }
  if (report.silhouette && typeof report.silhouette === "object") {
    for (const view of Object.keys(report.silhouette)) {
      const entry = report.silhouette[view];
      if (entry && typeof entry === "object") entry.overlay = absolute(entry.overlay);
    }
  }
  report.outDir = outDir;
  return report;
}

function checkArguments({ script, file, outDir, reference, views, size, translatePath }) {
  const args = ["-b", "--factory-startup", "--disable-autoexec", translatePath(file), "--python", translatePath(script), "--", "--out", translatePath(outDir)];
  if (reference) args.push("--reference", translatePath(reference));
  if (views) args.push("--views", views.join(","));
  if (size) args.push("--size", String(size));
  return args;
}

function normaliseViews(views) {
  if (views === undefined || views === null) return null;
  const list = (Array.isArray(views) ? views : String(views).split(",")).map((item) => String(item).trim().toLowerCase()).filter(Boolean);
  const unknown = list.filter((item) => !VIEWS.includes(item));
  if (unknown.length) throw failure(`Unknown view ${unknown[0]}. The views are ${VIEWS.join(", ")}.`, "bad-input");
  if (!list.length) throw failure("No view was asked for.", "bad-input");
  return [...new Set(list)];
}

/**
 * Measure and render a .blend with blender/dimensio_check.py.
 *
 * Resolves with the report (docs/course/PLAN.md, "Measurement") with every
 * render and overlay path made absolute, plus `outDir`. Rejects when Blender
 * cannot open the file, the check reports an error (`error.report` holds it),
 * no report appears, or Blender runs past `timeoutMs` (it is then killed with
 * its child processes).
 */
async function measure({
  blenderPath,
  file,
  outDir,
  reference,
  views,
  size,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  toolkitDir,
  spawn = childProcess.spawn,
  fs = nodeFs,
  platform = process.platform,
  translatePath = (value) => value,
} = {}) {
  if (!blenderPath) throw failure("Blender was not found. Choose blender.exe in Settings.", "no-blender");
  if (!file || !fs.existsSync(file)) throw failure(`The file to measure was not found: ${file || "(none)"}`, "bad-input");
  if (path.extname(file).toLowerCase() !== ".blend") throw failure("Only .blend files can be measured.", "bad-input");
  if (!outDir) throw failure("measure needs an outDir for the report and renders.", "bad-input");
  if (reference && !fs.existsSync(reference)) throw failure(`The reference file was not found: ${reference}`, "bad-input");
  const viewList = normaliseViews(views);
  const scripts = resolveToolkitDir({ toolkitDir, fs });
  const script = path.join(scripts, "dimensio_check.py");
  if (!fs.existsSync(script)) throw failure(`Dimensio's Blender check is missing: ${script}`, "missing-script");

  fs.mkdirSync(outDir, { recursive: true });
  const reportPath = path.join(outDir, "report.json");
  fs.rmSync(reportPath, { force: true });
  const args = checkArguments({ script, file, outDir, reference, views: viewList, size, translatePath });
  const { code, output } = await runBlender(blenderPath, args, { spawn, platform, timeoutMs, what: "Measuring the model" });

  let report = null;
  if (fs.existsSync(reportPath)) {
    try {
      report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    } catch (error) {
      throw failure(`Blender wrote a report Dimensio could not read: ${error.message}`, "bad-report", { output });
    }
  } else {
    report = prefixedJson(output, CHECK_PREFIX);
  }
  if (!report) {
    const complaint = blenderComplaint(output);
    const message = complaint
      ? `Blender could not measure the file: ${complaint}`
      : `Blender stopped without measuring the file (exit code ${code}).`;
    throw failure(message, "no-report", { output, exitCode: code });
  }
  if (typeof report !== "object" || report.format !== 1) {
    throw failure("Blender wrote a report in a format Dimensio does not know.", "bad-report", { output, report });
  }
  if (report.error) throw failure(report.error, "check-error", { output, report, exitCode: code });
  if (code !== 0) throw failure(`Blender exited with code ${code} after measuring.`, "blender-error", { output, report, exitCode: code });
  return makeAbsolute(report, outDir);
}

function kebab(name) {
  return String(name).replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}

function starterArguments({ script, starterId, outFile, options, overwrite, translatePath, fs }) {
  const args = ["-b", "--factory-startup", "--disable-autoexec", "--python", translatePath(script), "--", "--starter", starterId, "--out", translatePath(outFile)];
  if (overwrite) args.push("--force");
  for (const [key, value] of Object.entries(options || {})) {
    if (value === undefined || value === null || value === false) continue;
    const flag = `--${kebab(key)}`;
    if (!/^--[a-z0-9][a-z0-9-]*$/.test(flag) || ["--starter", "--out", "--force"].includes(flag)) {
      throw failure(`${key} cannot be passed to a starter.`, "bad-input");
    }
    if (value === true) {
      args.push(flag);
      continue;
    }
    const text = String(value);
    if (text.startsWith("--")) throw failure(`The value of ${key} cannot start with --.`, "bad-input");
    const isFile = path.isAbsolute(text) && fs.existsSync(text);
    args.push(flag, isFile ? translatePath(text) : text);
  }
  return args;
}

/**
 * Build a starter scene with blender/dimensio_starter.py and resolve with
 * `outFile`. `options` become flags: { imageFront: "a.png" } is
 * --image-front a.png. An existing outFile is refused unless `overwrite` is
 * true.
 */
async function makeStarter({
  blenderPath,
  starterId,
  outFile,
  options = {},
  overwrite = false,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  toolkitDir,
  spawn = childProcess.spawn,
  fs = nodeFs,
  platform = process.platform,
  translatePath = (value) => value,
} = {}) {
  if (!blenderPath) throw failure("Blender was not found. Choose blender.exe in Settings.", "no-blender");
  if (!STARTER_ID.test(String(starterId || ""))) throw failure(`${starterId} is not a starter id.`, "bad-input");
  if (!outFile || path.extname(outFile).toLowerCase() !== ".blend") throw failure("A starter is saved as a .blend file.", "bad-input");
  if (!overwrite && fs.existsSync(outFile)) throw failure(`${outFile} already exists.`, "exists");
  const scripts = resolveToolkitDir({ toolkitDir, fs });
  const script = path.join(scripts, "dimensio_starter.py");
  if (!fs.existsSync(script)) throw failure(`Dimensio's starter script is missing: ${script}`, "missing-script");
  if (!fs.existsSync(path.join(scripts, "starters", `${starterId}.py`))) throw failure(`There is no starter called ${starterId}.`, "bad-input");

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const args = starterArguments({ script, starterId, outFile, options, overwrite, translatePath, fs });
  const { code, output } = await runBlender(blenderPath, args, { spawn, platform, timeoutMs, what: "Building the starter scene" });
  const result = prefixedJson(output, STARTER_PREFIX);
  if (result?.error) throw failure(result.error, "starter-error", { output, exitCode: code });
  if (!result) {
    const complaint = blenderComplaint(output);
    throw failure(complaint ? `Blender could not build the starter: ${complaint}` : `Blender stopped without building the starter (exit code ${code}).`, "no-report", { output, exitCode: code });
  }
  if (code !== 0 || !fs.existsSync(outFile)) {
    throw failure(`Blender did not save the starter scene (exit code ${code}).`, "blender-error", { output, exitCode: code });
  }
  return outFile;
}

/**
 * Open `file` in Blender's normal window, detached so it outlives Dimensio.
 * Resolves with { pid } once Blender has started.
 */
function openInBlender({
  blenderPath,
  file,
  spawn = childProcess.spawn,
  fs = nodeFs,
  translatePath = (value) => value,
} = {}) {
  if (!blenderPath) return Promise.reject(failure("Blender was not found. Choose blender.exe in Settings.", "no-blender"));
  if (!file || !fs.existsSync(file)) return Promise.reject(failure(`The file was not found: ${file || "(none)"}`, "bad-input"));
  return new Promise((resolve, reject) => {
    let child;
    try {
      child = spawn(blenderPath, [translatePath(file)], { detached: true, stdio: "ignore", windowsHide: false });
    } catch (error) {
      reject(failure(`Blender could not be started: ${error.message}`, "spawn-failed"));
      return;
    }
    child.once("error", (error) => reject(failure(`Blender could not be started: ${error.message}`, "spawn-failed")));
    child.once("spawn", () => {
      child.unref?.();
      resolve({ pid: child.pid });
    });
  });
}

module.exports = {
  MIN_VERSION,
  VIEWS,
  findBlender,
  measure,
  makeStarter,
  openInBlender,
  resolveToolkitDir,
  // exported for tests
  checkArguments,
  starterArguments,
  blenderComplaint,
};
