"use strict";

// The Claude Code driver. One run is one `claude -p` process with stream-json on stdin and stdout, started in the
// run folder, so a session never outlives its run. Every flag below was checked against Claude Code 2.1.299
// (`claude --help`) and the event shapes against three recorded sessions (test/fixtures/claude):
//
//   -p --input-format stream-json --output-format stream-json --verbose --replay-user-messages
//   --model <alias> --effort <level>
//   --restricted                     drops code-running tools unless --tools names them, ignores user, project and
//                                    local settings files (no personal hooks or permission rules), confines the
//                                    file tools to the working directories
//   --strict-mcp-config --mcp-config <file>   only Forge3D's Blender and Godot MCP servers (the plugin's own
//                                    .mcp.json is ignored: observed, its servers do not appear in system/init)
//   --plugin-dir <plugin>            the bundled Forge3D plugin; its skill is forge3d:forge3d
//   --tools ... --allowedTools ...   see allowedTools() below
//   --permission-mode dontAsk --permission-prompts none   nothing waits for a person; anything not allowed is refused
//   --session-id <uuid> | --resume <uuid>
//
// Steering writes another user message to stdin. Observed: a note written during a tool call is echoed back
// (isReplay) at the next tool boundary and the same turn answers it, with one result event. If a turn ends first,
// Claude Code runs the note as a new turn (result.queued_turn_count says so). Both cases are recorded in the
// transcript when the echo arrives. Interrupting kills the process tree; the session stays resumable.

const crypto = require("node:crypto");
const { EventEmitter } = require("node:events");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const readline = require("node:readline");
const { execFile, spawn } = require("node:child_process");
const { BUNDLE_VERSION } = require("../runtime.cjs");
const { killTree, killTreeSync, running } = require("./process-tree.cjs");
const { SIGNED_OUT, interpretLine, toolItem } = require("./stream-json.cjs");

const CLAUDE_MODELS = Object.freeze([
  Object.freeze({ id: "opus", label: "Opus" }),
  Object.freeze({ id: "sonnet", label: "Sonnet" }),
  Object.freeze({ id: "haiku", label: "Haiku" }),
]);
const DEFAULT_MODEL = "opus";
const DEFAULT_EFFORT = "medium";
const EFFORTS = Object.freeze(["low", "medium", "high", "xhigh", "max"]);
const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function fixMissing(platform) {
  return platform === "win32"
    ? "Install Claude Code: in PowerShell run `irm https://claude.ai/install.ps1 | iex`, then run `claude` once to sign in. Press Check again when it is done."
    : "Install Claude Code: run `curl -fsSL https://claude.ai/install.sh | bash`, then run `claude` once to sign in. Press Check again when it is done.";
}
const FIX_SIGNED_OUT = "Run `claude` in a terminal and sign in with your Claude account, then press Check again.";
const FIX_GIT_BASH = "Claude Code runs commands in PowerShell, which Forge3D supports. Install Git for Windows (https://git-scm.com/download/win) only if you want it to use Bash.";

const SYSTEM_PROMPT = [
  "You are working for the Forge3D Workshop. Your working directory is this run's folder.",
  "Load the forge3d skill (forge3d:forge3d) before anything else and follow it.",
  "Run Forge3D's command-line tool as `forge3d ...` in the shell. Other shell commands are refused, so read and search files with Read, Glob and Grep, and write files with Write and Edit inside the run folder.",
  "You cannot make images. A Gaussian splat needs a reference image that is already in the run folder (attachments/). Without one, build the asset in Blender.",
  "Nobody can answer questions during a run. Make sensible choices, write them down in the run folder, and finish.",
].join("\n");

/* ── finding Claude Code ──────────────────────────────────────── */

function pathModule(platform) {
  return platform === "win32" ? path.win32 : path.posix;
}

function fileExists(candidate) {
  try { return fs.statSync(candidate).isFile(); } catch { return false; }
}

// Every directory on PATH that holds `name`, in PATH order.
function searchPath(name, { env = process.env, platform = process.platform, exists = fileExists } = {}) {
  const value = env.PATH || env.Path || "";
  const separator = platform === "win32" ? ";" : ":";
  const join = pathModule(platform).join;
  return value.split(separator).map((entry) => entry.trim().replace(/^"|"$/g, "")).filter(Boolean)
    .map((directory) => join(directory, name)).filter((candidate) => exists(candidate));
}

// Where Claude Code may be, in the order Forge3D tries: DIMENSIO_CLAUDE_EXE, the native installer's
// %USERPROFILE%\.local\bin\claude.exe, claude.exe or claude.cmd on PATH, then npm's global claude.cmd.
function claudeCandidates({ env = process.env, platform = process.platform, homedir = os.homedir(), exists = fileExists } = {}) {
  const list = [];
  if (env.DIMENSIO_CLAUDE_EXE) list.push({ path: env.DIMENSIO_CLAUDE_EXE, source: "DIMENSIO_CLAUDE_EXE" });
  if (platform === "win32") {
    const profile = env.USERPROFILE || homedir;
    list.push({ path: path.win32.join(profile, ".local", "bin", "claude.exe"), source: "native installer" });
    for (const name of ["claude.exe", "claude.cmd"]) {
      for (const found of searchPath(name, { env, platform, exists })) list.push({ path: found, source: "PATH" });
    }
    if (env.APPDATA) list.push({ path: path.win32.join(env.APPDATA, "npm", "claude.cmd"), source: "npm" });
  } else {
    list.push({ path: path.posix.join(homedir, ".local", "bin", "claude"), source: "native installer" });
    for (const found of searchPath("claude", { env, platform, exists })) list.push({ path: found, source: "PATH" });
  }
  return list;
}

function findClaude(options = {}) {
  const exists = options.exists || fileExists;
  return claudeCandidates(options).find((candidate) => exists(candidate.path)) || null;
}

// How to start what was found. Node will not spawn a .cmd without a shell, so npm's claude.cmd is resolved to the
// program it wraps: the package's own claude.exe, or node with the package's cli.js. Only when neither is there
// does it go through cmd.exe.
function launchFor(found, { env = process.env, platform = process.platform, exists = fileExists } = {}) {
  if (!found) return null;
  if (platform !== "win32" || !/\.cmd$/i.test(found.path)) return { command: found.path, args: [] };
  const packageRoot = path.win32.join(path.win32.dirname(found.path), "node_modules", "@anthropic-ai", "claude-code");
  const nativeExe = path.win32.join(packageRoot, "bin", "claude.exe");
  if (exists(nativeExe)) return { command: nativeExe, args: [] };
  const cli = path.win32.join(packageRoot, "cli.js");
  const node = searchPath("node.exe", { env, platform, exists })[0];
  if (exists(cli) && node) return { command: node, args: [cli] };
  return { command: env.ComSpec || "cmd.exe", args: ["/d", "/s", "/c", found.path], viaShell: true };
}

// Claude Code's Bash tool on Windows needs Git Bash. Without it Claude Code runs commands through its PowerShell
// tool instead, which Forge3D allows too, so a missing Git Bash is a note and never blocks a run.
function findGitBash({ env = process.env, platform = process.platform, exists = fileExists } = {}) {
  if (platform !== "win32") return null;
  const configured = env.CLAUDE_CODE_GIT_BASH_PATH;
  if (configured && /^(bash|sh)(\.exe)?$/i.test(path.win32.basename(configured)) && exists(configured)) return configured;
  const roots = [env.ProgramFiles || "C:\\Program Files", env["ProgramFiles(x86)"] || "C:\\Program Files (x86)"];
  for (const root of roots) {
    const candidate = path.win32.join(root, "Git", "bin", "bash.exe");
    if (exists(candidate)) return candidate;
  }
  for (const git of searchPath("git.exe", { env, platform, exists })) {
    const candidate = path.win32.join(path.win32.dirname(path.win32.dirname(git)), "bin", "bash.exe");
    if (exists(candidate)) return candidate;
  }
  return null;
}

// `claude auth status` prints JSON ({"loggedIn": true, "authMethod": ...}) and exits 0 when signed in, 1 when not.
// Only loggedIn and the exit code are read; the rest (email, organisation) is personal and never kept.
function parseAuthStatus(stdout, code) {
  let loggedIn = null;
  try {
    const data = JSON.parse(String(stdout || ""));
    if (typeof data?.loggedIn === "boolean") loggedIn = data.loggedIn;
  } catch {
    const match = /"loggedIn"\s*:\s*(true|false)/.exec(String(stdout || ""));
    if (match) loggedIn = match[1] === "true";
  }
  return { signedIn: code === 0 && loggedIn !== false };
}

function parseVersion(text) {
  return /(\d+\.\d+\.\d+)/.exec(String(text || ""))?.[1] || "";
}

/* ── the command line ─────────────────────────────────────────── */

// A permission-rule path. Rules use POSIX paths, and "//" marks an absolute one, so C:\Users\x\run becomes
// //c/Users/x/run/** and /home/x/run becomes //home/x/run/**.
function permissionPath(directory, platform = process.platform) {
  let posix;
  if (platform === "win32") {
    const resolved = path.win32.resolve(directory);
    const drive = /^([A-Za-z]):\\/.exec(resolved);
    posix = drive ? `/${drive[1].toLowerCase()}/${resolved.slice(3).split("\\").join("/")}` : resolved.split("\\").join("/");
  } else {
    posix = path.posix.resolve(directory);
  }
  return `/${posix.replace(/\/+$/, "")}/**`;
}

// What the agent may do without asking (nobody is there to ask): the forge3d CLI in the shell, the Blender and
// Godot MCP tools, reading and searching the folders it was given, writing inside the run folder only (an Edit rule
// covers Write too), and loading the forge3d skill. Anything else is refused by dontAsk.
function allowedTools({ runDir, platform = process.platform }) {
  const shells = platform === "win32" ? ["Bash", "PowerShell"] : ["Bash"];
  return [
    ...shells.flatMap((shell) => [`${shell}(forge3d *)`, ...(platform === "win32" ? [`${shell}(forge3d.exe *)`] : [])]),
    "mcp__blender",
    "mcp__godot",
    "Read",
    "Glob",
    "Grep",
    `Edit(${permissionPath(runDir, platform)})`,
    "Skill(forge3d:forge3d)",
  ];
}

function sanitizeModel(model) {
  if (typeof model !== "string") return DEFAULT_MODEL;
  const value = model.trim();
  if (CLAUDE_MODELS.some((item) => item.id === value)) return value;
  return /^claude-[a-z0-9.-]+$/i.test(value) ? value : DEFAULT_MODEL;
}

function sanitizeEffort(effort) {
  return EFFORTS.includes(effort) ? effort : DEFAULT_EFFORT;
}

function buildClaudeArgs({ model, effort, mcpConfigFile, pluginDir, runDir, sessionId, resume = null, platform = process.platform, systemPrompt = SYSTEM_PROMPT }) {
  const shells = platform === "win32" ? ["Bash", "PowerShell"] : ["Bash"];
  const args = [
    "-p",
    "--input-format", "stream-json",
    "--output-format", "stream-json",
    "--verbose",
    "--replay-user-messages",
    "--model", sanitizeModel(model),
    "--effort", sanitizeEffort(effort),
    "--restricted",
    "--strict-mcp-config",
    "--mcp-config", mcpConfigFile,
    "--plugin-dir", pluginDir,
    "--tools", [...shells, "Read", "Edit", "Write", "Glob", "Grep", "Skill"].join(","),
    "--permission-mode", "dontAsk",
    "--permission-prompts", "none",
    "--allowedTools", allowedTools({ runDir, platform }).join(","),
    "--add-dir", runDir,
    "--add-dir", pluginDir,
    "--append-system-prompt", systemPrompt,
  ];
  if (resume) args.push("--resume", resume);
  else args.push("--session-id", sessionId);
  return args;
}

// The MCP servers runtime.cjs configures for Codex, in Claude Code's --mcp-config form (stdio servers; Claude Code
// has no per-server working directory, and the Godot server reads its project from GODOT_MCP_PROJECT_PATH).
function claudeMcpConfig(config = {}) {
  const servers = {};
  for (const [name, server] of Object.entries(config.mcpServers || {})) {
    if (!server?.command) continue;
    servers[name] = { type: "stdio", command: server.command, args: Array.isArray(server.args) ? server.args : [], env: server.env || {} };
  }
  return { mcpServers: servers };
}

// A stream-json user message. Images go in as base64 blocks so Claude sees them at once; every attachment is also
// named by its path in the run folder.
function messageContent(text, attachments = [], { readFile = fs.readFileSync, stat = fs.statSync } = {}) {
  if (!attachments.length) return text;
  const listed = attachments.map((item) => item.relative || path.basename(item.path)).join(", ");
  const blocks = [{ type: "text", text: `${text}\n\nAttached files, in this run folder: ${listed}` }];
  for (const item of attachments) {
    if (!IMAGE_TYPES.has(item.mediaType)) continue;
    try {
      if (stat(item.path).size > MAX_IMAGE_BYTES) continue;
      blocks.push({ type: "image", source: { type: "base64", media_type: item.mediaType, data: readFile(item.path).toString("base64") } });
    } catch { /* named above; Claude can still Read it */ }
  }
  return blocks;
}

function failureText(result) {
  const text = String(result.text || "").trim();
  if (SIGNED_OUT.test(text)) return `Claude Code is not signed in. ${FIX_SIGNED_OUT}`;
  if (result.subtype === "error_max_turns") return "Claude Code stopped at its turn limit.";
  return text ? `Claude Code stopped: ${text.slice(0, 2000)}` : "Claude Code stopped with an error and gave no reason.";
}

/* ── the driver ───────────────────────────────────────────────── */

async function capture(execFileImpl, command, args, { env = process.env, timeout = 20000 } = {}) {
  return new Promise((resolve) => {
    execFileImpl(command, args, { env, windowsHide: true, timeout, encoding: "utf8" }, (error, stdout, stderr) => {
      resolve({ code: error ? (typeof error.code === "number" ? error.code : -1) : 0, timedOut: Boolean(error?.killed), stdout: String(stdout || ""), stderr: String(stderr || ""), error });
    });
  });
}

class ClaudeDriver extends EventEmitter {
  constructor({
    env = process.env,
    platform = process.platform,
    homedir = os.homedir(),
    exists = fileExists,
    find = null,
    launcher = null,
    spawnProcess = spawn,
    execFileImpl = execFile,
    killTreeImpl = killTree,
    stateRoot = os.tmpdir(),
    now = Date.now,
    newId = () => crypto.randomUUID(),
  } = {}) {
    super();
    this.id = "claude";
    this.name = "Claude Code";
    this.env = env;
    this.platform = platform;
    this.homedir = homedir;
    this.exists = exists;
    this.findImpl = find;
    this.launcher = launcher;
    this.spawnProcess = spawnProcess;
    this.execFileImpl = execFileImpl;
    this.killTreeImpl = killTreeImpl;
    this.stateRoot = stateRoot;
    this.now = now;
    this.newId = newId;
    this.statusCache = null;
    this.child = null;
    this.session = null;
  }

  // "error" events never throw here: Node's EventEmitter throws on an "error" nobody listens to.
  _report(payload) {
    if (this.listenerCount("error")) this.emit("error", payload);
  }

  find() {
    const options = { env: this.env, platform: this.platform, homedir: this.homedir, exists: this.exists };
    return this.findImpl ? this.findImpl(options) : findClaude(options);
  }

  launch(found) {
    if (this.launcher) return this.launcher(found);
    return launchFor(found, { env: this.env, platform: this.platform, exists: this.exists });
  }

  async status({ force = false, maxAgeMs = 60_000 } = {}) {
    if (!force && this.statusCache && this.now() - this.statusCache.at < maxAgeMs) return this.statusCache.value;
    const gitBash = findGitBash({ env: this.env, platform: this.platform, exists: this.exists });
    const shell = this.platform !== "win32" || gitBash ? "bash" : "powershell";
    const shellNote = shell === "powershell" ? FIX_GIT_BASH : "";
    const found = this.find();
    let value;
    if (!found) {
      value = { installed: false, signedIn: false, version: "", path: "", reason: "Claude Code was not found.", fix: fixMissing(this.platform), shell, shellNote };
    } else {
      const launch = this.launch(found);
      const version = await capture(this.execFileImpl, launch.command, [...launch.args, "--version"], { env: this.env });
      if (version.code !== 0) {
        value = { installed: false, signedIn: false, version: "", path: found.path, reason: `Claude Code was found at ${found.path} but did not start.`, fix: fixMissing(this.platform), shell, shellNote };
      } else {
        const auth = await capture(this.execFileImpl, launch.command, [...launch.args, "auth", "status"], { env: this.env });
        const { signedIn } = parseAuthStatus(auth.stdout, auth.code);
        value = {
          installed: true,
          signedIn,
          version: parseVersion(version.stdout),
          path: found.path,
          reason: signedIn ? "" : auth.timedOut ? "Claude Code did not answer the sign-in check in time." : "Claude Code is installed but not signed in.",
          fix: signedIn ? "" : FIX_SIGNED_OUT,
          shell,
          shellNote,
        };
      }
    }
    this.statusCache = { at: this.now(), value };
    return value;
  }

  async models() {
    return { models: CLAUDE_MODELS.map((model) => ({ ...model })), defaultModel: DEFAULT_MODEL, defaultEffort: DEFAULT_EFFORT, efforts: [...EFFORTS] };
  }

  // Run checks the agent before it makes a run folder: installed and signed in, or a plain error with the fix.
  async prepare() {
    const status = await this.status({ maxAgeMs: 30_000 });
    if (!status.installed || !status.signedIn) {
      this.statusCache = null;
      throw new Error(`${status.reason} ${status.fix}`.trim());
    }
    return status;
  }

  // The plugin is loaded per session with --plugin-dir, so it is ready whenever the bundle carries it.
  async skill({ bundledPlugin } = {}) {
    const manifest = bundledPlugin ? path.join(bundledPlugin, ".claude-plugin", "plugin.json") : "";
    const skillPath = bundledPlugin ? path.join(bundledPlugin, "skills", "forge3d", "SKILL.md") : "";
    try {
      const installedVersion = JSON.parse(fs.readFileSync(manifest, "utf8")).version || null;
      if (!fs.existsSync(skillPath)) throw new Error("no SKILL.md");
      return { state: "ready", path: skillPath, installedVersion, bundledVersion: BUNDLE_VERSION };
    } catch {
      return { state: "missing", path: skillPath, bundledVersion: BUNDLE_VERSION };
    }
  }

  async startSession({ cwd, env = this.env, mcp = {}, skillDir, model, effort, resume = null } = {}) {
    if (running(this.child)) {
      if (!this.finished) throw new Error("Claude Code is already running a session");
      // The last run's process is still exiting after its result. Let it, and make sure it does.
      const previous = this.child;
      this.child = null;
      setTimeout(() => { if (running(previous)) this.killTreeImpl(previous, { platform: this.platform }); }, 10_000).unref?.();
    }
    const found = this.find();
    if (!found) throw new Error(`Claude Code was not found. ${fixMissing(this.platform)}`);
    const configDir = path.join(this.stateRoot, "config");
    fs.mkdirSync(configDir, { recursive: true });
    const mcpConfigFile = path.join(configDir, "claude-mcp.json");
    fs.writeFileSync(mcpConfigFile, `${JSON.stringify(claudeMcpConfig(mcp), null, 2)}\n`, "utf8");
    this.session = {
      cwd,
      env,
      mcpConfigFile,
      skillDir,
      model: sanitizeModel(model === "auto" ? DEFAULT_MODEL : model),
      effort: sanitizeEffort(effort === "auto" ? DEFAULT_EFFORT : effort),
      launch: this.launch(found),
      sessionId: resume || this.newId(),
      resumed: Boolean(resume),
      retriedFresh: false,
    };
    this._spawn();
    return { sessionId: this.session.sessionId, resumed: this.session.resumed };
  }

  _spawn() {
    const session = this.session;
    const args = [...session.launch.args, ...buildClaudeArgs({
      model: session.model,
      effort: session.effort,
      mcpConfigFile: session.mcpConfigFile,
      pluginDir: session.skillDir,
      runDir: session.cwd,
      sessionId: session.sessionId,
      resume: session.resumed ? session.sessionId : null,
      platform: this.platform,
    })];
    const child = this.spawnProcess(session.launch.command, args, {
      cwd: session.cwd,
      env: session.env,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
      detached: this.platform !== "win32", // its own process group, so interrupt can end everything it started
    });
    this.child = child;
    this.stderr = "";
    this.sawInit = false;
    this.results = 0;
    this.pendingSteers = [];
    this.tools = new Map();
    this.turnActive = false;
    this.finished = false;
    this.interrupting = false;
    this.closing = false;
    child.stdin.on("error", () => { /* the process went away; its exit is reported below */ });
    readline.createInterface({ input: child.stdout }).on("line", (line) => {
      if (child !== this.child) return;
      try { this._onLine(line); } catch (error) { this._report({ message: `Forge3D could not read Claude Code's output: ${error.message}`, method: "claude/output" }); }
    });
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString("utf8");
      this.stderr = `${this.stderr}${text}`.slice(-8000);
      if (child === this.child) this.emit("stderr", { kind: "agent-stderr", text });
    });
    child.once("error", (error) => this._onExit(child, null, null, error));
    child.once("exit", (code, signal) => this._onExit(child, code, signal, null));
  }

  _write(content) {
    if (!running(this.child) || !this.child.stdin.writable) throw new Error("Claude Code has no open session");
    this.child.stdin.write(`${JSON.stringify({ type: "user", message: { role: "user", content }, parent_tool_use_id: null, session_id: "" })}\n`);
  }

  // fresh: what to send instead if a resumed session turns out to be gone (Claude Code keeps sessions on disk, but
  // they can be deleted). Forge3D then starts a new session with the run's whole brief.
  send(text, attachments = [], { fresh = null } = {}) {
    const content = messageContent(text, attachments);
    this.lastSend = { text, attachments, fresh };
    this.turnActive = true;
    this._write(content);
    return { turnId: null };
  }

  steer(text) {
    if (!running(this.child) || !this.turnActive) throw new Error("This run is not active");
    this.pendingSteers.push({ text: String(text).trim(), resultsAtWrite: this.results });
    this._write(text);
    return { mode: "mid-turn" };
  }

  async interrupt() {
    if (!running(this.child)) return;
    this.interrupting = true;
    await this.killTreeImpl(this.child, { platform: this.platform });
  }

  async close() {
    const child = this.child;
    if (!running(child)) {
      this.child = null;
      return;
    }
    this.closing = true;
    await this.killTreeImpl(child, { platform: this.platform });
    this.child = null;
  }

  closeNow() {
    if (!running(this.child)) return;
    this.closing = true;
    killTreeSync(this.child, { platform: this.platform });
    this.child = null;
  }

  // After a run: a process that finished exits by itself once stdin closes; one that did not is stopped.
  endSession() {
    if (running(this.child) && !this.finished) this.close().catch(() => {});
    this.session = null;
  }

  _onLine(line) {
    for (const event of interpretLine(line)) {
      if (event.kind === "init") {
        this.sawInit = true;
        this.emit("step", { method: "claude/init", text: `Claude Code ${event.version || ""} started with ${event.model || "its default model"}.`.replace(/\s+/g, " ") });
        for (const server of event.mcpServers) {
          if (server?.status === "failed" || server?.status === "needs-auth") {
            this._report({ method: "claude/mcp", message: `The ${server.name} MCP server did not start (${server.status}). Steps that need it cannot run.` });
          }
        }
      } else if (event.kind === "echo") {
        const index = this.pendingSteers.findIndex((steer) => steer.text === event.text.trim());
        if (index >= 0) {
          const [steer] = this.pendingSteers.splice(index, 1);
          const queued = this.results > steer.resultsAtWrite;
          this.emit("step", { method: "claude/steer", mode: queued ? "queued" : "mid-turn", text: queued ? "The steering note arrived after the turn ended, so Claude Code started a new turn for it." : "The steering note reached Claude Code during the turn." });
        }
      } else if (event.kind === "text") {
        this.emit("message", { method: "claude/assistant", text: `${event.text}\n\n` });
      } else if (event.kind === "tool_use") {
        const item = toolItem(event.name, event.input, event.id);
        this.tools.set(event.id, item);
        this.emit("tool", { phase: "started", method: "item/started", item: { ...item, status: "running" } });
      } else if (event.kind === "tool_result") {
        const item = this.tools.get(event.toolUseId) || toolItem("tool", {}, event.toolUseId);
        this.emit("tool", { phase: "completed", method: "item/completed", item: { ...item, status: event.isError ? "failed" : "completed" } });
        if (item.type === "commandExecution" && event.text) this.emit("log", { method: "claude/commandOutput", text: `${event.text.slice(-20000)}\n` });
      } else if (event.kind === "denied") {
        this._report({ method: "claude/permission", message: `Forge3D does not allow ${event.tool} here, so Claude Code was refused.` });
      } else if (event.kind === "rate_limit" && event.status === "rejected") {
        const when = event.resetsAt ? ` It resets at ${new Date(event.resetsAt * 1000).toLocaleString()}.` : "";
        this._report({ method: "claude/limit", message: `Claude Code reached its usage limit.${when}` });
      } else if (event.kind === "result") {
        this._onResult(event);
      }
    }
  }

  _onResult(result) {
    this.results += 1;
    this.emit("usage", { costUsd: result.costUsd, durationMs: result.durationMs, turns: result.turns, inputTokens: result.usage.inputTokens, outputTokens: result.usage.outputTokens });
    if (result.queued > 0 || this.pendingSteers.length) {
      this.emit("step", { method: "claude/result", text: "Claude Code finished a turn. A steering note runs next." });
      return;
    }
    this.turnActive = false;
    this.finished = true;
    this.emit("done", {
      status: result.isError ? "failed" : "completed",
      error: result.isError ? failureText(result) : null,
      sessionId: result.sessionId || this.session?.sessionId || null,
      turnId: result.uuid,
    });
    try { this.child?.stdin.end(); } catch { /* already closed */ }
  }

  _onExit(child, code, signal, error) {
    if (child !== this.child) return;
    this.child = null;
    if (this.closing || this.finished) return;
    if (this.interrupting) {
      this.turnActive = false;
      this.finished = true;
      this.emit("done", { status: "interrupted", error: null, sessionId: this.session?.sessionId || null, turnId: null });
      return;
    }
    const session = this.session;
    const tail = this.stderr.trim().split(/\r?\n/).slice(-3).join(" ").slice(0, 1500);
    if (session?.resumed && !this.sawInit && !session.retriedFresh && /no conversation found/i.test(this.stderr) && this.lastSend) {
      // The run's earlier session is gone. Start a new one and give it the whole brief.
      session.retriedFresh = true;
      session.resumed = false;
      session.sessionId = this.newId();
      const { text, attachments, fresh } = this.lastSend;
      this._spawn();
      this.emit("session", { sessionId: session.sessionId });
      this.emit("step", { method: "claude/session", text: "The earlier Claude Code session for this run was not found, so a new session started." });
      this.send(fresh || text, attachments);
      return;
    }
    const message = error
      ? `Claude Code could not start: ${error.message}`
      : SIGNED_OUT.test(this.stderr)
        ? `Claude Code is not signed in. ${FIX_SIGNED_OUT}`
        : `Claude Code stopped before the run finished (exit ${code ?? signal ?? "unknown"})${tail ? `: ${tail}` : "."}`;
    this.turnActive = false;
    this.finished = true;
    this.emit("done", { status: "failed", error: message, sessionId: session?.sessionId || null, turnId: null });
  }
}

module.exports = {
  CLAUDE_MODELS,
  ClaudeDriver,
  DEFAULT_EFFORT,
  DEFAULT_MODEL,
  EFFORTS,
  FIX_GIT_BASH,
  FIX_SIGNED_OUT,
  SYSTEM_PROMPT,
  allowedTools,
  buildClaudeArgs,
  claudeCandidates,
  claudeMcpConfig,
  findClaude,
  findGitBash,
  fixMissing,
  launchFor,
  messageContent,
  parseAuthStatus,
  parseVersion,
  permissionPath,
  sanitizeEffort,
  sanitizeModel,
  searchPath,
};
