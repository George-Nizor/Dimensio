"use strict";

const assert = require("node:assert/strict");
const { EventEmitter } = require("node:events");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const {
  blenderComplaint,
  findBlender,
  makeStarter,
  measure,
  openInBlender,
  resolveToolkitDir,
} = require("../src/lib/blender-measure.cjs");

// ------------------------------------------------------------------ helpers

function fakeChild(pid = 4242) {
  const child = new EventEmitter();
  child.stdout = new EventEmitter();
  child.stderr = new EventEmitter();
  child.pid = pid;
  child.exitCode = null;
  child.signals = [];
  child.kill = (signal) => { child.signals.push(signal); };
  child.unref = () => { child.unrefed = true; };
  return child;
}

/** A spawn that records each call and lets `behave(child, command, args)` act. */
function fakeSpawn(behave = () => {}) {
  const calls = [];
  const spawn = (command, args, options) => {
    const child = fakeChild(4242 + calls.length);
    calls.push({ command, args, options, child });
    setImmediate(() => behave(child, command, args));
    return child;
  };
  spawn.calls = calls;
  return spawn;
}

function finish(child, code, output = "") {
  if (output) child.stdout.emit("data", Buffer.from(output));
  child.exitCode = code;
  child.emit("close", code);
}

/** An fs with a fixed set of files and folders, for findBlender. */
function fakeFs({ files = [], dirs = {}, contents = {} } = {}) {
  const existing = new Set(files.map((item) => item.toLowerCase()));
  return {
    existsSync: (target) => existing.has(String(target).toLowerCase()),
    readdirSync: (target) => {
      const key = Object.keys(dirs).find((item) => item.toLowerCase() === String(target).toLowerCase());
      if (!key) throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      return dirs[key];
    },
    readFileSync: (target) => {
      const key = Object.keys(contents).find((item) => item.toLowerCase() === String(target).toLowerCase());
      if (!key) throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      return contents[key];
    },
  };
}

function versions(map) {
  const calls = [];
  const spawnSync = (command, args) => {
    calls.push({ command, args });
    const version = map[command];
    return version ? { status: 0, stdout: `Blender ${version}\n\tbuild date: 2026-09-15\n`, stderr: "" } : { status: 1, stdout: "", stderr: "" };
  };
  spawnSync.calls = calls;
  return spawnSync;
}

function workspace(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dimensio measure "));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const toolkit = path.join(root, "tool kit", "blender");
  fs.mkdirSync(path.join(toolkit, "starters"), { recursive: true });
  fs.writeFileSync(path.join(toolkit, "dimensio_check.py"), "# check");
  fs.writeFileSync(path.join(toolkit, "dimensio_starter.py"), "# starter");
  fs.writeFileSync(path.join(toolkit, "starters", "fix-ngons.py"), "# fix");
  fs.writeFileSync(path.join(toolkit, "starters", "reference-images.py"), "# refs");
  const blend = path.join(root, "my models", "crate one.blend");
  fs.mkdirSync(path.dirname(blend), { recursive: true });
  fs.writeFileSync(blend, "BLENDER");
  return { root, toolkit, blend, out: path.join(root, "check out") };
}

const WIN = {
  ProgramFiles: "C:\\Program Files",
  "ProgramFiles(x86)": "C:\\Program Files (x86)",
  PATH: "C:\\Windows;C:\\Tools\\Blender",
};
const FOUNDATION = "C:\\Program Files\\Blender Foundation";
const STEAM = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Blender\\blender.exe";

// ------------------------------------------------------------------ findBlender

test("findBlender uses the path saved in settings before anything else", () => {
  const saved = "D:\\Apps\\Blender 5.2\\blender.exe";
  const result = findBlender({
    settingsPath: "C:\\settings.json",
    env: { ...WIN, DIMENSIO_BLENDER: STEAM },
    platform: "win32",
    fs: fakeFs({ files: [saved, STEAM], contents: { "C:\\settings.json": JSON.stringify({ blenderPath: saved }) } }),
    spawnSync: versions({ [saved]: "5.2.1", [STEAM]: "5.2.2" }),
  });
  assert.equal(result.ok, true);
  assert.equal(result.path, saved);
  assert.equal(result.version, "5.2.1");
  assert.equal(result.source, "settings");
});

test("findBlender reads DIMENSIO_BLENDER, then BLENDER_EXECUTABLE", () => {
  const dimensio = "E:\\Blender\\blender.exe";
  const forge = "F:\\Blender\\blender.exe";
  const both = findBlender({
    env: { ...WIN, DIMENSIO_BLENDER: dimensio, BLENDER_EXECUTABLE: forge },
    platform: "win32",
    fs: fakeFs({ files: [dimensio, forge] }),
    spawnSync: versions({ [dimensio]: "5.2.0", [forge]: "5.2.0" }),
  });
  assert.equal(both.path, dimensio);
  const forgeOnly = findBlender({
    env: { ...WIN, BLENDER_EXECUTABLE: forge },
    platform: "win32",
    fs: fakeFs({ files: [forge] }),
    spawnSync: versions({ [forge]: "5.3.0" }),
  });
  assert.equal(forgeOnly.path, forge);
  assert.equal(forgeOnly.source, "BLENDER_EXECUTABLE");
});

test("findBlender prefers the newest Program Files install, then Steam, then PATH", () => {
  const b51 = `${FOUNDATION}\\Blender 5.1\\blender.exe`;
  const b52 = `${FOUNDATION}\\Blender 5.2\\blender.exe`;
  const onPath = "C:\\Tools\\Blender\\blender.exe";
  const options = (files, map) => ({
    env: WIN,
    platform: "win32",
    fs: fakeFs({ files, dirs: { [FOUNDATION]: ["Blender 4.5", "Blender 5.1", "Blender 5.2"] } }),
    spawnSync: versions(map),
  });
  assert.equal(findBlender(options([b51, b52, STEAM, onPath], { [b51]: "5.1.0", [b52]: "5.2.2", [STEAM]: "5.2.2", [onPath]: "5.2.0" })).path, b52);
  const steam = findBlender(options([STEAM, onPath], { [STEAM]: "5.2.2", [onPath]: "5.2.0" }));
  assert.equal(steam.path, STEAM);
  assert.equal(steam.source, "steam");
  const path = findBlender(options([onPath], { [onPath]: "5.2.0" }));
  assert.equal(path.path, onPath);
  assert.equal(path.source, "path");
});

test("findBlender passes over an old install it found by looking when a newer one exists", () => {
  const b51 = `${FOUNDATION}\\Blender 5.1\\blender.exe`;
  const result = findBlender({
    env: WIN,
    platform: "win32",
    fs: fakeFs({ files: [b51, STEAM], dirs: { [FOUNDATION]: ["Blender 5.1"] } }),
    spawnSync: versions({ [b51]: "5.1.1", [STEAM]: "5.2.2" }),
  });
  assert.equal(result.ok, true);
  assert.equal(result.path, STEAM);
});

test("findBlender reports Blender older than 5.2 with a plain fix", () => {
  const b51 = `${FOUNDATION}\\Blender 5.1\\blender.exe`;
  const result = findBlender({
    env: WIN,
    platform: "win32",
    fs: fakeFs({ files: [b51], dirs: { [FOUNDATION]: ["Blender 5.1"] } }),
    spawnSync: versions({ [b51]: "5.1.1" }),
  });
  assert.equal(result.ok, false);
  assert.equal(result.path, b51);
  assert.equal(result.version, "5.1.1");
  assert.match(result.reason, /5\.1\.1 is older than 5\.2/);
  assert.match(result.fix, /Install Blender 5\.2 LTS/);
});

test("findBlender keeps a Blender you chose even when it is too old", () => {
  const chosen = "D:\\Old\\blender.exe";
  const result = findBlender({
    env: { ...WIN, DIMENSIO_BLENDER: chosen },
    platform: "win32",
    fs: fakeFs({ files: [chosen, STEAM] }),
    spawnSync: versions({ [chosen]: "4.2.3", [STEAM]: "5.2.2" }),
  });
  assert.equal(result.ok, false);
  assert.equal(result.path, chosen);
});

test("findBlender says what is missing when nothing is installed", () => {
  const result = findBlender({
    settingsPath: "C:\\settings.json",
    env: WIN,
    platform: "win32",
    fs: fakeFs({ contents: { "C:\\settings.json": JSON.stringify({ blenderPath: "D:\\Gone\\blender.exe" }) } }),
    spawnSync: versions({}),
  });
  assert.equal(result.ok, false);
  assert.equal(result.path, null);
  assert.match(result.reason, /not found/);
  assert.match(result.reason, /D:\\Gone\\blender\.exe/);
  assert.match(result.fix, /blender\.org or Steam/);
});

test("findBlender reports a Blender that does not give its version", () => {
  const result = findBlender({
    env: { ...WIN, DIMENSIO_BLENDER: STEAM },
    platform: "win32",
    fs: fakeFs({ files: [STEAM] }),
    spawnSync: () => ({ status: 1, stdout: "", stderr: "crash" }),
  });
  assert.equal(result.ok, false);
  assert.equal(result.version, null);
  assert.match(result.reason, /did not report its version/);
});

test("findBlender finds Blender in another Steam library", () => {
  const library = "G:\\SteamLibrary\\steamapps\\common\\Blender\\blender.exe";
  const vdf = '"libraryfolders"\n{\n\t"1"\n\t{\n\t\t"path"\t\t"G:\\\\SteamLibrary"\n\t}\n}\n';
  const result = findBlender({
    env: WIN,
    platform: "win32",
    fs: fakeFs({ files: [library], contents: { "C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf": vdf } }),
    spawnSync: versions({ [library]: "5.2.2" }),
  });
  assert.equal(result.path, library);
});

// ------------------------------------------------------------------ toolkit

test("resolveToolkitDir prefers the option, then the packaged copy, then the repository", (t) => {
  const { root, toolkit } = workspace(t);
  assert.equal(resolveToolkitDir({ toolkitDir: toolkit }), toolkit);
  const resources = path.join(root, "resources");
  const packaged = path.join(resources, "dimensio-toolkit", "blender");
  fs.mkdirSync(packaged, { recursive: true });
  fs.writeFileSync(path.join(packaged, "dimensio_check.py"), "#");
  assert.equal(resolveToolkitDir({ resourcesPath: resources }), packaged);
  const repo = resolveToolkitDir({ resourcesPath: path.join(root, "electron-resources") });
  assert.equal(repo, path.resolve(__dirname, "..", "..", "blender"));
  assert.ok(fs.existsSync(path.join(repo, "dimensio_check.py")));
  assert.ok(fs.existsSync(path.join(repo, "dimensio_starter.py")));
});

// ------------------------------------------------------------------ measure

test("measure passes paths with spaces as whole arguments and returns absolute renders", async (t) => {
  const { toolkit, blend, out } = workspace(t);
  const reference = path.join(path.dirname(blend), "the reference.glb");
  fs.writeFileSync(reference, "glTF");
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, "report.json"), JSON.stringify({ format: 1, stale: true }));
  const spawn = fakeSpawn((child, _command, args) => {
    // The stale report must be gone before Blender runs.
    assert.equal(fs.existsSync(path.join(out, "report.json")), false);
    const report = {
      format: 1,
      blender: "5.2.2",
      objects: [],
      totals: { objects: 0, meshes: 0 },
      renders: { front: "front.png", persp: "persp.png" },
      silhouette: { front: { match: 0.91, overlay: "front-overlay.png" } },
    };
    fs.writeFileSync(path.join(args[args.indexOf("--out") + 1], "report.json"), JSON.stringify(report));
    finish(child, 0);
  });
  const report = await measure({
    blenderPath: "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Blender\\blender.exe",
    file: blend,
    outDir: out,
    reference,
    views: ["front", "persp", "front"],
    toolkitDir: toolkit,
    spawn,
    platform: "linux",
  });
  const call = spawn.calls[0];
  assert.equal(call.command, "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Blender\\blender.exe");
  assert.deepEqual(call.args, [
    "-b", "--factory-startup", "--disable-autoexec", blend,
    "--python", path.join(toolkit, "dimensio_check.py"),
    "--", "--out", out, "--reference", reference, "--views", "front,persp",
  ]);
  assert.equal(call.options.windowsHide, true);
  assert.equal(call.options.shell, undefined);
  assert.equal(report.renders.front, path.join(out, "front.png"));
  assert.equal(report.renders.persp, path.join(out, "persp.png"));
  assert.equal(report.silhouette.front.overlay, path.join(out, "front-overlay.png"));
  assert.equal(report.silhouette.front.match, 0.91);
  assert.equal(report.outDir, out);
});

test("measure hands Blender translated paths when it runs elsewhere", async (t) => {
  const { toolkit, blend, out } = workspace(t);
  const translate = (value) => `W:${value.replaceAll("/", "\\")}`;
  const spawn = fakeSpawn((child) => {
    fs.writeFileSync(path.join(out, "report.json"), JSON.stringify({ format: 1, renders: {} }));
    finish(child, 0);
  });
  await measure({ blenderPath: "blender", file: blend, outDir: out, toolkitDir: toolkit, spawn, translatePath: translate, size: 256 });
  const { args } = spawn.calls[0];
  assert.equal(args[3], translate(blend));
  assert.equal(args[5], translate(path.join(toolkit, "dimensio_check.py")));
  assert.equal(args[args.indexOf("--out") + 1], translate(out));
  assert.deepEqual(args.slice(-2), ["--size", "256"]);
});

test("measure stops Blender and its children with taskkill when it runs too long", async (t) => {
  const { toolkit, blend, out } = workspace(t);
  const spawn = fakeSpawn(() => {}); // Blender never finishes
  const started = Date.now();
  await assert.rejects(
    measure({ blenderPath: "blender.exe", file: blend, outDir: out, toolkitDir: toolkit, spawn, platform: "win32", timeoutMs: 40 }),
    (error) => error.code === "timeout" && /took longer than 1 second, so Blender was stopped/.test(error.message),
  );
  assert.ok(Date.now() - started < 2000);
  const killer = spawn.calls[1];
  assert.equal(killer.command, "taskkill");
  assert.deepEqual(killer.args, ["/PID", String(spawn.calls[0].child.pid), "/T", "/F"]);
});

test("measure kills Blender directly off Windows when it runs too long", async (t) => {
  const { toolkit, blend, out } = workspace(t);
  const spawn = fakeSpawn(() => {});
  await assert.rejects(
    measure({ blenderPath: "blender", file: blend, outDir: out, toolkitDir: toolkit, spawn, platform: "linux", timeoutMs: 30 }),
    { code: "timeout" },
  );
  assert.equal(spawn.calls.length, 1);
  assert.deepEqual(spawn.calls[0].child.signals, ["SIGKILL"]);
});

test("measure turns a report with an error into a rejection that carries the report", async (t) => {
  const { toolkit, blend, out } = workspace(t);
  const spawn = fakeSpawn((child) => {
    fs.writeFileSync(path.join(out, "report.json"), JSON.stringify({ format: 1, error: "The reference file was not found: x.glb" }));
    finish(child, 2);
  });
  await assert.rejects(
    measure({ blenderPath: "blender", file: blend, outDir: out, toolkitDir: toolkit, spawn }),
    (error) => error.code === "check-error" && error.message === "The reference file was not found: x.glb" && error.report.format === 1,
  );
});

test("measure explains an unreadable report", async (t) => {
  const { toolkit, blend, out } = workspace(t);
  const spawn = fakeSpawn((child) => {
    fs.writeFileSync(path.join(out, "report.json"), "{ not json");
    finish(child, 0);
  });
  await assert.rejects(
    measure({ blenderPath: "blender", file: blend, outDir: out, toolkitDir: toolkit, spawn }),
    { code: "bad-report" },
  );
});

test("measure rejects a report in an unknown format", async (t) => {
  const { toolkit, blend, out } = workspace(t);
  const spawn = fakeSpawn((child) => {
    fs.writeFileSync(path.join(out, "report.json"), JSON.stringify({ format: 7 }));
    finish(child, 0);
  });
  await assert.rejects(measure({ blenderPath: "blender", file: blend, outDir: out, toolkitDir: toolkit, spawn }), { code: "bad-report" });
});

test("measure falls back to the report line Blender printed", async (t) => {
  const { toolkit, blend, out } = workspace(t);
  const line = `DIMENSIO_CHECK=${JSON.stringify({ format: 1, renders: { top: "top.png" } })}`;
  const spawn = fakeSpawn((child) => finish(child, 0, `Blender 5.2.2\n${line}\nBlender quit\n`));
  const report = await measure({ blenderPath: "blender", file: blend, outDir: out, toolkitDir: toolkit, spawn });
  assert.equal(report.renders.top, path.join(out, "top.png"));
});

test("measure passes on Blender's own complaint when it cannot open the file", async (t) => {
  const { toolkit, blend, out } = workspace(t);
  const log = [
    "Blender 5.2.2 LTS (hash d13f752e3b9c built 2026-09-15 01:37:04)",
    `00:00.437  reports          | ERROR File format is not supported in file "${blend}"`,
    "Blender quit",
  ].join("\r\n");
  const spawn = fakeSpawn((child) => finish(child, 1, log));
  await assert.rejects(
    measure({ blenderPath: "blender", file: blend, outDir: out, toolkitDir: toolkit, spawn }),
    (error) => error.code === "no-report" && error.message.startsWith("Blender could not measure the file: File format is not supported") && error.exitCode === 1,
  );
});

test("measure refuses what it cannot run before starting Blender", async (t) => {
  const { toolkit, blend, out, root } = workspace(t);
  const spawn = fakeSpawn();
  const base = { blenderPath: "blender", outDir: out, toolkitDir: toolkit, spawn };
  await assert.rejects(measure({ ...base, file: path.join(root, "missing.blend") }), /not found/);
  const glb = path.join(root, "model.glb");
  fs.writeFileSync(glb, "x");
  await assert.rejects(measure({ ...base, file: glb }), /Only \.blend files/);
  await assert.rejects(measure({ ...base, file: blend, views: ["side"] }), /Unknown view side/);
  await assert.rejects(measure({ ...base, file: blend, reference: path.join(root, "nope.fbx") }), /reference file was not found/);
  await assert.rejects(measure({ ...base, blenderPath: null, file: blend }), { code: "no-blender" });
  await assert.rejects(measure({ ...base, file: blend, toolkitDir: root }), { code: "missing-script" });
  assert.equal(spawn.calls.length, 0);
});

test("blenderComplaint picks the error line out of a log", () => {
  assert.equal(blenderComplaint("Blender 5.2.2\n00:00.422  reports          | ERROR Cannot read file \"C:/a b.blend\": No such file or directory\nBlender quit\n"), 'Cannot read file "C:/a b.blend": No such file or directory');
  assert.equal(blenderComplaint("all fine\n"), null);
});

// ------------------------------------------------------------------ makeStarter

test("makeStarter turns options into flags and resolves with the saved file", async (t) => {
  const { toolkit, root } = workspace(t);
  const outFile = path.join(root, "Course", "lesson 3", "reference-images.blend");
  const picture = path.join(root, "front view.png");
  fs.writeFileSync(picture, "png");
  const spawn = fakeSpawn((child, _command, args) => {
    const target = args[args.indexOf("--out") + 1];
    fs.writeFileSync(target, "BLENDER");
    finish(child, 0, `DIMENSIO_STARTER=${JSON.stringify({ format: 1, starter: "reference-images", out: target })}\n`);
  });
  const saved = await makeStarter({
    blenderPath: "blender",
    starterId: "reference-images",
    outFile,
    options: { imageFront: picture, height: 1.8, unused: null, flat: true, skip: false },
    toolkitDir: toolkit,
    spawn,
  });
  assert.equal(saved, outFile);
  assert.deepEqual(spawn.calls[0].args, [
    "-b", "--factory-startup", "--disable-autoexec",
    "--python", path.join(toolkit, "dimensio_starter.py"),
    "--", "--starter", "reference-images", "--out", outFile,
    "--image-front", picture, "--height", "1.8", "--flat",
  ]);
});

test("makeStarter refuses to replace a file unless asked to", async (t) => {
  const { toolkit, root } = workspace(t);
  const outFile = path.join(root, "fix-ngons.blend");
  fs.writeFileSync(outFile, "learner work");
  const spawn = fakeSpawn((child, _command, args) => {
    fs.writeFileSync(args[args.indexOf("--out") + 1], "new");
    finish(child, 0, `DIMENSIO_STARTER=${JSON.stringify({ format: 1, starter: "fix-ngons", out: outFile })}\n`);
  });
  await assert.rejects(makeStarter({ blenderPath: "blender", starterId: "fix-ngons", outFile, toolkitDir: toolkit, spawn }), { code: "exists" });
  assert.equal(spawn.calls.length, 0);
  await makeStarter({ blenderPath: "blender", starterId: "fix-ngons", outFile, overwrite: true, toolkitDir: toolkit, spawn });
  assert.ok(spawn.calls[0].args.includes("--force"));
});

test("makeStarter reports the starter's own error", async (t) => {
  const { toolkit, root } = workspace(t);
  const spawn = fakeSpawn((child) => finish(child, 2, `DIMENSIO_STARTER=${JSON.stringify({ format: 1, starter: "reference-images", error: "The reference-images starter needs --image-front, --image-side or both." })}\n`));
  await assert.rejects(
    makeStarter({ blenderPath: "blender", starterId: "reference-images", outFile: path.join(root, "r.blend"), toolkitDir: toolkit, spawn }),
    (error) => error.code === "starter-error" && /needs --image-front/.test(error.message),
  );
});

test("makeStarter checks the id and the starter before starting Blender", async (t) => {
  const { toolkit, root } = workspace(t);
  const spawn = fakeSpawn();
  const base = { blenderPath: "blender", toolkitDir: toolkit, spawn };
  await assert.rejects(makeStarter({ ...base, starterId: "../evil", outFile: path.join(root, "a.blend") }), /not a starter id/);
  await assert.rejects(makeStarter({ ...base, starterId: "no-such-starter", outFile: path.join(root, "a.blend") }), /no starter called/);
  await assert.rejects(makeStarter({ ...base, starterId: "fix-ngons", outFile: path.join(root, "a.txt") }), /\.blend/);
  await assert.rejects(makeStarter({ ...base, starterId: "fix-ngons", outFile: path.join(root, "a.blend"), options: { out: "x" } }), /cannot be passed/);
  assert.equal(spawn.calls.length, 0);
});

test("makeStarter times out like measure", async (t) => {
  const { toolkit, root } = workspace(t);
  const spawn = fakeSpawn(() => {});
  await assert.rejects(
    makeStarter({ blenderPath: "blender.exe", starterId: "fix-ngons", outFile: path.join(root, "s.blend"), toolkitDir: toolkit, spawn, platform: "win32", timeoutMs: 30 }),
    { code: "timeout" },
  );
  assert.equal(spawn.calls[1].command, "taskkill");
});

// ------------------------------------------------------------------ openInBlender

test("openInBlender starts a detached Blender window on the file", async (t) => {
  const { blend } = workspace(t);
  const spawn = fakeSpawn((child) => child.emit("spawn"));
  const result = await openInBlender({ blenderPath: "C:\\Blender 5.2\\blender.exe", file: blend, spawn });
  const call = spawn.calls[0];
  assert.deepEqual(call.args, [blend]);
  assert.equal(call.options.detached, true);
  assert.equal(call.options.stdio, "ignore");
  assert.equal(result.pid, call.child.pid);
  assert.equal(call.child.unrefed, true);
});

test("openInBlender rejects a missing file or a failed start", async (t) => {
  const { blend, root } = workspace(t);
  await assert.rejects(openInBlender({ blenderPath: "blender", file: path.join(root, "none.blend"), spawn: fakeSpawn() }), /not found/);
  const failing = fakeSpawn((child) => child.emit("error", new Error("ENOENT")));
  await assert.rejects(openInBlender({ blenderPath: "blender", file: blend, spawn: failing }), { code: "spawn-failed" });
});
