"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const {
  ClaudeDriver,
  allowedTools,
  buildClaudeArgs,
  claudeCandidates,
  claudeMcpConfig,
  findClaude,
  findGitBash,
  launchFor,
  messageContent,
  parseAuthStatus,
  permissionPath,
  sanitizeModel,
} = require("../src/lib/agents/claude.cjs");
const { interpretLine, toolItem } = require("../src/lib/agents/stream-json.cjs");

const FIXTURES = path.join(__dirname, "fixtures", "claude");
const FAKE = path.join(__dirname, "fixtures", "fake-claude.cjs");
const fixture = (name) => JSON.parse(fs.readFileSync(path.join(FIXTURES, name), "utf8"));
const emitted = (name) => fixture(name).steps.filter((step) => step.emit).map((step) => JSON.stringify(step.emit));

function workspace() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "forge3d-claude-"));
  const run = path.join(root, "run");
  fs.mkdirSync(run);
  return { root, run, log: path.join(root, "fake.log") };
}

function scenarioFile(root, scenario) {
  const file = path.join(root, `scenario-${Math.random().toString(16).slice(2)}.json`);
  fs.writeFileSync(file, JSON.stringify(scenario));
  return file;
}

function fakeDriver({ root, log, scenario, signedIn = true }) {
  return new ClaudeDriver({
    platform: process.platform === "win32" ? "win32" : "linux",
    stateRoot: root,
    find: () => ({ path: FAKE, source: "test" }),
    launcher: () => ({ command: process.execPath, args: [FAKE] }),
    env: { ...process.env, FAKE_CLAUDE_SCENARIO: scenario, FAKE_CLAUDE_LOG: log, FAKE_CLAUDE_SIGNED_IN: signedIn ? "1" : "0" },
  });
}

function collect(driver) {
  const events = [];
  for (const type of ["step", "message", "tool", "log", "stderr", "usage", "session", "done", "error"]) {
    driver.on(type, (payload) => events.push({ type, ...payload }));
  }
  return events;
}

const waitFor = (driver, type) => new Promise((resolve) => driver.once(type, resolve));
const logLines = (log) => fs.readFileSync(log, "utf8").trim().split("\n").map((line) => JSON.parse(line));

/* ── the stream-json reader, on the recorded shapes ───────────── */

test("the reader turns recorded Claude Code lines into init, echo, tool and result events", () => {
  const kinds = emitted("steer-mid-turn.json").flatMap((line) => interpretLine(line).map((event) => event.kind));
  assert.deepEqual(kinds, ["init", "echo", "tool_use", "tool_result", "tool_use", "rate_limit", "tool_result", "echo", "text", "result"]);
  const init = interpretLine(emitted("steer-mid-turn.json")[0])[0];
  assert.equal(init.sessionId, "687a3f4b-bfd4-42e9-a3ae-a1d30caa56b7");
  assert.deepEqual(init.tools, ["Bash", "Edit", "Glob", "Grep", "Read", "Skill", "Write"]);
  assert.deepEqual(init.mcpServers, [{ name: "blender", status: "failed", source: "dynamic" }]);
  assert.ok(init.plugins.includes("forge3d"));
  assert.ok(init.skills.includes("forge3d:forge3d"));
  const result = emitted("steer-mid-turn.json").flatMap(interpretLine).find((event) => event.kind === "result");
  assert.equal(result.isError, false);
  assert.equal(result.queued, 0);
  assert.equal(result.text, "0.3.0\n\nbanana");
  assert.ok(result.costUsd > 0);
});

test("a refused command is a permission_denied event and an is_error tool result", () => {
  const events = emitted("denied-then-killed.json").flatMap(interpretLine);
  const denied = events.find((event) => event.kind === "denied");
  assert.equal(denied.tool, "Bash");
  assert.match(denied.text, /don't ask mode/);
  const refused = events.find((event) => event.kind === "tool_result" && event.toolUseId === denied.toolUseId);
  assert.equal(refused.isError, true);
});

test("tool calls map onto the step vocabulary the run view draws", () => {
  assert.deepEqual(toolItem("Bash", { command: "forge3d --version" }, "t1"), { id: "t1", name: "Bash", type: "commandExecution", command: "forge3d --version" });
  assert.deepEqual(toolItem("PowerShell", { command: "forge3d make x" }, "t2").type, "commandExecution");
  assert.deepEqual(toolItem("mcp__blender__get_scene_info", {}, "t3"), { id: "t3", name: "mcp__blender__get_scene_info", type: "mcpToolCall", server: "blender", tool: "get_scene_info" });
  assert.deepEqual(toolItem("Write", { file_path: "/run/a.py" }, "t4").changes, [{ path: "/run/a.py" }]);
  assert.equal(toolItem("Read", { file_path: "x" }, "t5").type, "agentTool");
  assert.equal(toolItem("Skill", {}, "t6").type, "agentTool");
  assert.deepEqual(interpretLine("not json"), []);
});

/* ── finding Claude Code ──────────────────────────────────────── */

test("Claude Code is looked for in the agreed order on Windows", () => {
  const env = { DIMENSIO_CLAUDE_EXE: "D:\\tools\\claude.exe", USERPROFILE: "C:\\Users\\Ann", APPDATA: "C:\\Users\\Ann\\AppData\\Roaming", PATH: "C:\\bin;C:\\npm" };
  const present = new Set(["C:\\bin\\claude.exe", "C:\\npm\\claude.cmd"]);
  const list = claudeCandidates({ env, platform: "win32", exists: (file) => present.has(file) }).map((item) => item.path);
  assert.deepEqual(list, [
    "D:\\tools\\claude.exe",
    "C:\\Users\\Ann\\.local\\bin\\claude.exe",
    "C:\\bin\\claude.exe",
    "C:\\npm\\claude.cmd",
    "C:\\Users\\Ann\\AppData\\Roaming\\npm\\claude.cmd",
  ]);
  const nativeOnly = new Set(["C:\\Users\\Ann\\.local\\bin\\claude.exe", "C:\\bin\\claude.exe"]);
  assert.equal(findClaude({ env: { ...env, DIMENSIO_CLAUDE_EXE: "" }, platform: "win32", exists: (file) => nativeOnly.has(file) }).path, "C:\\Users\\Ann\\.local\\bin\\claude.exe");
  assert.equal(findClaude({ env: {}, platform: "win32", exists: () => false }), null);
});

test("npm's claude.cmd is started through the program it wraps, never through a shell when avoidable", () => {
  const env = { PATH: "C:\\node" };
  const cmd = { path: "C:\\Users\\Ann\\AppData\\Roaming\\npm\\claude.cmd" };
  const root = "C:\\Users\\Ann\\AppData\\Roaming\\npm\\node_modules\\@anthropic-ai\\claude-code";
  assert.deepEqual(launchFor(cmd, { env, platform: "win32", exists: (file) => file === `${root}\\bin\\claude.exe` }), { command: `${root}\\bin\\claude.exe`, args: [] });
  assert.deepEqual(launchFor(cmd, { env, platform: "win32", exists: (file) => [`${root}\\cli.js`, "C:\\node\\node.exe"].includes(file) }), { command: "C:\\node\\node.exe", args: [`${root}\\cli.js`] });
  assert.equal(launchFor(cmd, { env, platform: "win32", exists: () => false }).viaShell, true);
  assert.deepEqual(launchFor({ path: "C:\\x\\claude.exe" }, { platform: "win32" }), { command: "C:\\x\\claude.exe", args: [] });
});

test("Git Bash is found where Claude Code looks for it, and its absence means PowerShell", () => {
  const env = { ProgramFiles: "C:\\Program Files", PATH: "D:\\Git\\cmd" };
  assert.equal(findGitBash({ env, platform: "win32", exists: (file) => file === "C:\\Program Files\\Git\\bin\\bash.exe" }), "C:\\Program Files\\Git\\bin\\bash.exe");
  assert.equal(findGitBash({ env, platform: "win32", exists: (file) => ["D:\\Git\\cmd\\git.exe", "D:\\Git\\bin\\bash.exe"].includes(file) }), "D:\\Git\\bin\\bash.exe");
  assert.equal(findGitBash({ env: { CLAUDE_CODE_GIT_BASH_PATH: "E:\\g\\bash.exe" }, platform: "win32", exists: (file) => file === "E:\\g\\bash.exe" }), "E:\\g\\bash.exe");
  assert.equal(findGitBash({ env, platform: "win32", exists: () => false }), null);
  assert.equal(findGitBash({ env, platform: "linux", exists: () => true }), null);
});

test("sign-in is read from claude auth status: loggedIn and the exit code", () => {
  assert.equal(parseAuthStatus('{"loggedIn": true, "authMethod": "claude.ai"}', 0).signedIn, true);
  assert.equal(parseAuthStatus('{"loggedIn": false, "authMethod": "none"}', 1).signedIn, false);
  assert.equal(parseAuthStatus('{"loggedIn": false}', 0).signedIn, false);
  assert.equal(parseAuthStatus("", 1).signedIn, false);
});

/* ── the command line ─────────────────────────────────────────── */

test("the command line uses only flags Claude Code 2.1.299 accepts, with no permission prompts", () => {
  const args = buildClaudeArgs({ model: "opus", effort: "medium", mcpConfigFile: "/s/claude-mcp.json", pluginDir: "/app/forge3d-plugin", runDir: "/p/runs/r1", sessionId: "s-1", platform: "linux" });
  const value = (flag) => args[args.indexOf(flag) + 1];
  assert.deepEqual(args.slice(0, 6), ["-p", "--input-format", "stream-json", "--output-format", "stream-json", "--verbose"]);
  assert.ok(args.includes("--replay-user-messages"));
  assert.ok(args.includes("--restricted"));
  assert.ok(args.includes("--strict-mcp-config"));
  assert.equal(value("--mcp-config"), "/s/claude-mcp.json");
  assert.equal(value("--plugin-dir"), "/app/forge3d-plugin");
  assert.equal(value("--permission-mode"), "dontAsk");
  assert.equal(value("--permission-prompts"), "none");
  assert.equal(value("--model"), "opus");
  assert.equal(value("--effort"), "medium");
  assert.equal(value("--session-id"), "s-1");
  assert.equal(value("--tools"), "Bash,Read,Edit,Write,Glob,Grep,Skill");
  assert.deepEqual(args.filter((_, index) => args[index - 1] === "--add-dir"), ["/p/runs/r1", "/app/forge3d-plugin"]);
  assert.equal(value("--allowedTools"), "Bash(forge3d *),mcp__blender,mcp__godot,Read,Glob,Grep,Edit(//p/runs/r1/**),Skill(forge3d:forge3d)");
  assert.doesNotMatch(args.join(" "), /dangerously|bypassPermissions/);
  const resumed = buildClaudeArgs({ model: "sonnet", effort: "high", mcpConfigFile: "m", pluginDir: "p", runDir: "/r", sessionId: "s-1", resume: "s-0", platform: "linux" });
  assert.equal(resumed[resumed.indexOf("--resume") + 1], "s-0");
  assert.equal(resumed.includes("--session-id"), false);
});

test("on Windows the allowlist covers PowerShell too and writes are scoped to the run folder", () => {
  const rules = allowedTools({ runDir: "C:\\Users\\Ann\\Documents\\Forge3D\\Projects\\My bottle\\runs\\r1", platform: "win32" });
  assert.ok(rules.includes("Bash(forge3d *)"));
  assert.ok(rules.includes("PowerShell(forge3d *)"));
  assert.ok(rules.includes("PowerShell(forge3d.exe *)"));
  assert.ok(rules.includes("Edit(//c/Users/Ann/Documents/Forge3D/Projects/My bottle/runs/r1/**)"));
  assert.equal(permissionPath("/home/ann/run/", "linux"), "//home/ann/run/**");
  const args = buildClaudeArgs({ model: "opus", effort: "low", mcpConfigFile: "m", pluginDir: "p", runDir: "C:\\r", sessionId: "s", platform: "win32" });
  assert.equal(args[args.indexOf("--tools") + 1], "Bash,PowerShell,Read,Edit,Write,Glob,Grep,Skill");
});

test("models are Opus, Sonnet and Haiku by alias, and anything else falls back to Opus", async () => {
  const driver = new ClaudeDriver({ find: () => null });
  const { models, defaultModel, defaultEffort, efforts } = await driver.models();
  assert.deepEqual(models.map((model) => model.id), ["opus", "sonnet", "haiku"]);
  assert.equal(defaultModel, "opus");
  assert.equal(defaultEffort, "medium");
  assert.deepEqual(efforts, ["low", "medium", "high", "xhigh", "max"]);
  assert.equal(sanitizeModel("gpt-5.3-codex"), "opus"); // a Codex model saved by an earlier version is not passed on
  assert.equal(sanitizeModel("claude-opus-5-5"), "claude-opus-5-5");
});

test("the MCP config is the Blender and Godot servers as stdio entries", () => {
  const config = claudeMcpConfig({ mcpServers: {
    blender: { command: "C:\\uv\\uvx.exe", args: ["blender-mcp"], env: { BLENDER_PORT: "9876" } },
    godot: { command: "cmd.exe", args: ["/c", "npx"], cwd: "C:\\godot", env: { GODOT_MCP_PROJECT_PATH: "C:\\godot" } },
  } });
  assert.deepEqual(config.mcpServers.blender, { type: "stdio", command: "C:\\uv\\uvx.exe", args: ["blender-mcp"], env: { BLENDER_PORT: "9876" } });
  assert.equal(config.mcpServers.godot.cwd, undefined);
  assert.equal(config.mcpServers.godot.env.GODOT_MCP_PROJECT_PATH, "C:\\godot");
});

test("an image attachment goes in as a base64 block, and every attachment is named", () => {
  const { root } = workspace();
  const image = path.join(root, "ref.png");
  fs.writeFileSync(image, Buffer.from([137, 80, 78, 71]));
  const content = messageContent("Make a lantern", [{ path: image, relative: "attachments/ref.png", mediaType: "image/png" }, { path: path.join(root, "x.glb"), relative: "attachments/x.glb", mediaType: "model/gltf-binary" }]);
  assert.match(content[0].text, /attachments\/ref\.png, attachments\/x\.glb/);
  assert.deepEqual(content[1], { type: "image", source: { type: "base64", media_type: "image/png", data: Buffer.from([137, 80, 78, 71]).toString("base64") } });
  assert.equal(content.length, 2);
  assert.equal(messageContent("plain"), "plain");
});

/* ── a fake claude replaying recorded sessions ────────────────── */

test("status reports installed, signed in and the version, and a signed-out account with its fix", async () => {
  const { root, log } = workspace();
  const scenario = scenarioFile(root, { steps: [] });
  const ready = await fakeDriver({ root, log, scenario }).status();
  assert.equal(ready.installed, true);
  assert.equal(ready.signedIn, true);
  assert.equal(ready.version, "2.1.299");
  const out = await fakeDriver({ root, log, scenario, signedIn: false }).status();
  assert.equal(out.signedIn, false);
  assert.match(out.fix, /run `claude`/i);
  await assert.rejects(fakeDriver({ root, log, scenario, signedIn: false }).prepare(), /not signed in/);
  const missing = await new ClaudeDriver({ find: () => null, platform: "win32", env: {}, exists: () => false }).status();
  assert.equal(missing.installed, false);
  assert.match(missing.fix, /install\.ps1/);
  assert.equal(missing.shell, "powershell");
  assert.match(missing.shellNote, /Git for Windows/);
});

test("a steering note written during a tool call lands mid-turn, and the run finishes with one result", async () => {
  const { root, run, log } = workspace();
  const driver = fakeDriver({ root, log, scenario: path.join(FIXTURES, "steer-mid-turn.json") });
  const events = collect(driver);
  const session = await driver.startSession({ cwd: run, mcp: { mcpServers: { blender: { command: "uvx", args: [] } } }, skillDir: path.join(root, "plugin"), model: "auto", effort: "auto" });
  assert.match(session.sessionId, /^[0-9a-f-]{36}$/);
  const done = waitFor(driver, "done");
  driver.once("tool", () => assert.deepEqual(driver.steer("Also end your final reply with the word banana."), { mode: "mid-turn" }));
  driver.send("Use the Bash tool to run `ls`, then use the Bash tool to run `forge3d --version`. Then reply with the version number.");
  const finished = await done;
  assert.equal(finished.status, "completed");
  assert.equal(finished.error, null);
  assert.equal(finished.sessionId, "687a3f4b-bfd4-42e9-a3ae-a1d30caa56b7");
  const steer = events.find((event) => event.method === "claude/steer");
  assert.equal(steer.mode, "mid-turn");
  assert.deepEqual(events.filter((event) => event.type === "tool").map((event) => [event.phase, event.item.type, event.item.command]), [
    ["started", "commandExecution", "ls"], ["completed", "commandExecution", "ls"],
    ["started", "commandExecution", "forge3d --version"], ["completed", "commandExecution", "forge3d --version"],
  ]);
  assert.ok(events.some((event) => event.type === "message" && /banana/.test(event.text)));
  assert.ok(events.some((event) => event.type === "error" && event.method === "claude/mcp" && /blender MCP server did not start, so steps/.test(event.message)));
  assert.equal(events.filter((event) => event.type === "usage").length, 1);
  const lines = logLines(log);
  assert.equal(lines[0].cwd, fs.realpathSync(run));
  assert.equal(lines[0].argv[lines[0].argv.indexOf("--session-id") + 1], session.sessionId);
  assert.deepEqual(lines.filter((line) => line.stdin).map((line) => line.stdin.type), ["user", "user"]);
  assert.equal(lines[1].stdin.parent_tool_use_id, null);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, "config", "claude-mcp.json"), "utf8")).mcpServers.blender.type, "stdio");
});

test("a note that arrives after the turn ended queues a second turn before the run is done", async () => {
  const { root, run, log } = workspace();
  const init = { type: "system", subtype: "init", session_id: "s", tools: [], mcp_servers: [] };
  const result = (queued, text) => ({ type: "result", subtype: "success", is_error: false, result: text, session_id: "s", uuid: `r-${text}`, queued_turn_count: queued, num_turns: 1, total_cost_usd: 0.001, usage: {} });
  const scenario = scenarioFile(root, { steps: [
    { await: "user" }, { emit: init }, { emit: { type: "assistant", message: { content: [{ type: "text", text: "First." }] } } },
    { await: "user" }, { emit: result(1, "first") },
    { emit: { type: "user", isReplay: true, message: { content: "Make it blue." } } },
    { emit: { type: "assistant", message: { content: [{ type: "text", text: "Blue." }] } } }, { emit: result(0, "second") },
    { await: "eof" }, { exit: 0 },
  ] });
  const driver = fakeDriver({ root, log, scenario });
  const events = collect(driver);
  await driver.startSession({ cwd: run, skillDir: root });
  const done = waitFor(driver, "done");
  driver.once("message", () => driver.steer("Make it blue."));
  driver.send("Make a cube.");
  const finished = await done;
  assert.equal(finished.turnId, "r-second");
  assert.equal(events.find((event) => event.method === "claude/steer").mode, "queued");
  assert.equal(events.filter((event) => event.type === "usage").length, 2);
});

test("a resumed session keeps its id and sends text and an image", async () => {
  const { root, run, log } = workspace();
  const image = path.join(run, "red.png");
  fs.writeFileSync(image, Buffer.from("png"));
  const driver = fakeDriver({ root, log, scenario: path.join(FIXTURES, "resume-with-image.json") });
  const session = await driver.startSession({ cwd: run, skillDir: root, resume: "687a3f4b-bfd4-42e9-a3ae-a1d30caa56b7" });
  assert.equal(session.resumed, true);
  const done = waitFor(driver, "done");
  driver.send("What colour is this image?", [{ path: image, relative: "red.png", mediaType: "image/png" }]);
  assert.equal((await done).status, "completed");
  const lines = logLines(log);
  assert.equal(lines[0].argv[lines[0].argv.indexOf("--resume") + 1], "687a3f4b-bfd4-42e9-a3ae-a1d30caa56b7");
  assert.deepEqual(lines[1].stdin.message.content.map((block) => block.type), ["text", "image"]);
});

test("interrupt kills the process tree during a tool call and the run ends interrupted", async () => {
  const { root, run, log } = workspace();
  const driver = fakeDriver({ root, log, scenario: path.join(FIXTURES, "denied-then-killed.json") });
  const events = collect(driver);
  await driver.startSession({ cwd: run, skillDir: root });
  const done = waitFor(driver, "done");
  driver.on("tool", (event) => { if (event.phase === "started" && /capabilities/.test(event.item.command)) driver.interrupt(); });
  driver.send("Use the Bash tool to run `touch probe.txt`.");
  const finished = await done;
  assert.equal(finished.status, "interrupted");
  assert.ok(events.some((event) => event.type === "error" && event.method === "claude/permission" && /refused a Bash call/.test(event.message)));
  assert.equal(events.find((event) => event.type === "tool" && event.phase === "completed").item.status, "failed");
});

test("a process that dies without a result fails the run with its stderr, and a lost session is replaced", async () => {
  const { root, run, log } = workspace();
  const crash = scenarioFile(root, { steps: [{ await: "user" }, { stderr: "Error: something broke\n" }, { exit: 3 }] });
  const failing = fakeDriver({ root, log, scenario: crash });
  await failing.startSession({ cwd: run, skillDir: root });
  const failed = waitFor(failing, "done");
  failing.send("go");
  const result = await failed;
  assert.equal(result.status, "failed");
  assert.match(result.error, /exit 3.*something broke/);

  const lost = scenarioFile(root, {
    whenResume: [{ await: "user" }, { stderr: "No conversation found with session ID: old\n" }, { exit: 1 }],
    steps: [{ await: "user" }, { emit: { type: "result", subtype: "success", is_error: false, result: "ok", session_id: "new", uuid: "r1" } }, { await: "eof" }, { exit: 0 }],
  });
  const driver = fakeDriver({ root, log, scenario: lost });
  const events = collect(driver);
  await driver.startSession({ cwd: run, skillDir: root, resume: "old" });
  const done = waitFor(driver, "done");
  driver.send("Continue.", [], { fresh: "The whole brief. Continue." });
  assert.equal((await done).status, "completed");
  const replaced = events.find((event) => event.type === "session");
  assert.ok(replaced && replaced.sessionId !== "old");
  const stdin = logLines(log).filter((line) => line.stdin).map((line) => line.stdin.message.content);
  assert.equal(stdin.at(-1), "The whole brief. Continue.");
});

test("a new run can start while the last run's process is still exiting", async () => {
  const { root, run, log } = workspace();
  const scenario = scenarioFile(root, { steps: [
    { await: "user" },
    { emit: { type: "result", subtype: "success", is_error: false, result: "ok", session_id: "s", uuid: "r" } },
    { await: "eof" }, { exit: 0 },
  ] });
  const driver = fakeDriver({ root, log, scenario });
  await driver.startSession({ cwd: run, skillDir: root });
  const first = waitFor(driver, "done");
  driver.send("one");
  await first;
  const second = await driver.startSession({ cwd: run, skillDir: root }); // before the first process has exited
  assert.match(second.sessionId, /^[0-9a-f-]{36}$/);
  const done = waitFor(driver, "done");
  driver.send("two");
  assert.equal((await done).status, "completed");
});
