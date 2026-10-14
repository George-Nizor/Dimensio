"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { CodexAppServerClient } = require("../src/lib/agents/codex.cjs");

function connectedClient() {
  const writes = [];
  const client = new CodexAppServerClient();
  client.process = {
    stdin: {
      writable: true,
      write(line) { writes.push(JSON.parse(line)); },
    },
  };
  return { client, writes };
}

test("matches JSONL responses to requests", async () => {
  const { client, writes } = connectedClient();
  const pending = client.request("thread/start", { cwd: "C:\\run" });
  assert.equal(writes[0].method, "thread/start");
  client.ingestLine(JSON.stringify({ id: writes[0].id, result: { thread: { id: "thr-1" } } }));
  assert.equal((await pending).thread.id, "thr-1");
});

test("thread and turn requests use the current interactive approval policy", async () => {
  const client = new CodexAppServerClient();
  const calls = [];
  client.request = async (method, params) => {
    calls.push({ method, params });
    return method === "thread/start"
      ? { thread: { id: "thr-1" } }
      : { turn: { id: "turn-1" } };
  };

  await client.startThread({ cwd: "C:\\runs\\bookshelf", model: "auto" });
  await client.startTurn({
    threadId: "thr-1",
    prompt: "Make a bookshelf",
    cwd: "C:\\runs\\bookshelf",
  });

  assert.equal(calls[0].params.approvalPolicy, "on-request");
  assert.equal(calls[1].params.approvalPolicy, "on-request");
  assert.doesNotMatch(JSON.stringify(calls), /unlessTrusted/);
});
test("surfaces server approval requests and returns a scoped decision", () => {
  const { client, writes } = connectedClient();
  let received = null;
  client.on("request", (request) => { received = request; });
  client.ingestLine(JSON.stringify({
    id: 91,
    method: "item/commandExecution/requestApproval",
    params: { threadId: "thr-1", turnId: "turn-1", command: "blender --background" },
  }));
  assert.equal(received.id, 91);
  client.decide(91, "decline");
  assert.deepEqual(writes[0], { id: 91, result: { decision: "decline" } });
});

test("answers MCP tool approval elicitations with the App Server wire schema", () => {
  const { client, writes } = connectedClient();
  client.ingestLine(JSON.stringify({
    id: 92,
    method: "mcpServer/elicitation/request",
    params: {
      threadId: "thr-1",
      turnId: "turn-1",
      serverName: "blender",
      request: {
        mode: "form",
        message: "Allow the blender MCP server to run tool get_scene_info?",
        requestedSchema: {},
        _meta: { codex_approval_kind: "mcp_tool_call", persist: ["session", "always"] },
      },
    },
  }));
  client.decide(92, "acceptForSession");
  assert.deepEqual(writes[0], {
    id: 92,
    result: { action: "accept", content: {}, _meta: { persist: "session" } },
  });
});

test("declines MCP tool approval elicitations with null content and metadata", () => {
  const { client, writes } = connectedClient();
  client.ingestLine(JSON.stringify({ id: 93, method: "mcpServer/elicitation/request", params: {} }));
  client.decide(93, "decline");
  assert.deepEqual(writes[0], {
    id: 93,
    result: { action: "decline", content: null, _meta: null },
  });
});

test("rejects unsupported server requests with a JSON-RPC method error", () => {
  const { client, writes } = connectedClient();
  client.ingestLine(JSON.stringify({ id: 94, method: "tool/requestUserInput", params: {} }));
  client.reject(94);
  assert.deepEqual(writes[0], {
    id: 94,
    error: { code: -32601, message: "Unsupported App Server request" },
  });
});

test("turn input invokes Forge3D skill, attaches local images, and disables network by default", async () => {
  const client = new CodexAppServerClient();
  let request = null;
  client.request = async (method, params) => {
    request = { method, params };
    return { turn: { id: "turn-1", status: "inProgress" } };
  };
  await client.startTurn({
    threadId: "thr-1",
    prompt: "Make a lantern",
    cwd: "C:\\runs\\lantern",
    skill: { path: "C:\\plugin\\skills\\forge3d\\SKILL.md" },
    images: ["C:\\runs\\lantern\\attachments\\reference.png"],
  });
  assert.equal(request.method, "turn/start");
  assert.equal(request.params.input[0].text, "$forge3d Make a lantern");
  assert.equal(request.params.input[1].type, "skill");
  assert.equal(request.params.input[2].type, "localImage");
  assert.equal(request.params.sandboxPolicy.networkAccess, false);
  assert.deepEqual(request.params.sandboxPolicy.writableRoots, ["C:\\runs\\lantern"]);
});

test("interrupt and steer use the active thread and turn", async () => {
  const client = new CodexAppServerClient();
  const calls = [];
  client.request = async (method, params) => { calls.push({ method, params }); return {}; };
  await client.steer("thr-1", "turn-1", "Use lower topology");
  await client.interrupt("thr-1", "turn-1");
  assert.equal(calls[0].method, "turn/steer");
  assert.equal(calls[0].params.expectedTurnId, "turn-1");
  assert.equal(calls[1].method, "turn/interrupt");
});
/* ── the Codex driver behind the common interface ─────────────── */

const { EventEmitter } = require("node:events");
const { CodexDriver } = require("../src/lib/agents/codex.cjs");

function fakeClient({ cwd }) {
  const client = new EventEmitter();
  Object.assign(client, {
    cwd,
    started: false,
    calls: [],
    decisions: [],
    rejected: [],
    closed: false,
    async start() { this.started = true; },
    async request(method, params) { this.calls.push({ method, params }); return method === "model/list" ? { data: [{ id: "gpt-x", displayName: "GPT X" }] } : {}; },
    async listSkills() { return []; },
    async startThread(params) { this.calls.push({ method: "thread/start", params }); return { id: "thr-1" }; },
    async resumeThread(threadId) { this.calls.push({ method: "thread/resume", params: { threadId } }); return { id: threadId }; },
    async startTurn(params) { this.calls.push({ method: "turn/start", params }); return { id: "turn-1" }; },
    async steer(threadId, turnId, text) { this.calls.push({ method: "turn/steer", params: { threadId, turnId, text } }); },
    async interrupt(threadId, turnId) { this.calls.push({ method: "turn/interrupt", params: { threadId, turnId } }); },
    decide(id, decision) { this.decisions.push({ id, decision }); },
    reject(id) { this.rejected.push(id); },
    close() { this.closed = true; this.started = false; },
  });
  return client;
}

function codexDriver() {
  const clients = [];
  const driver = new CodexDriver({ findExecutable: () => "C:\\codex.exe", createClient: (options) => { const client = fakeClient(options); clients.push(client); return client; } });
  const events = [];
  for (const type of ["step", "message", "tool", "log", "stderr", "approval", "done", "error"]) driver.on(type, (payload) => events.push({ type, ...payload }));
  return { driver, clients, events };
}

test("a Codex session is a thread and a turn, with images passed as local images and the skill by path", async () => {
  const { driver, clients } = codexDriver();
  const session = await driver.startSession({ cwd: "C:\\runs\\r1", workspace: "C:\\runs", model: "gpt-x", effort: "high", skill: { path: "C:\\plugin\\SKILL.md" } });
  assert.deepEqual(session, { sessionId: "thr-1", resumed: false });
  const turn = await driver.send("Make a lantern", [{ path: "C:\\runs\\r1\\attachments\\a.png", mediaType: "image/png" }, { path: "C:\\runs\\r1\\attachments\\a.glb", mediaType: "model/gltf-binary" }]);
  assert.deepEqual(turn, { turnId: "turn-1" });
  const start = clients[0].calls.find((call) => call.method === "turn/start").params;
  assert.equal(start.prompt, "Make a lantern");
  assert.deepEqual(start.images, ["C:\\runs\\r1\\attachments\\a.png"]);
  assert.equal(start.skill.path, "C:\\plugin\\SKILL.md");
  assert.equal(start.allowNetwork, false);
  assert.deepEqual(await driver.steer("Lower topology"), { mode: "mid-turn" });
  await driver.interrupt();
  assert.deepEqual(clients[0].calls.slice(-2).map((call) => call.method), ["turn/steer", "turn/interrupt"]);
  await driver.startSession({ cwd: "C:\\runs\\r1", workspace: "C:\\runs", resume: "thr-0" });
  assert.equal(clients[0].calls.at(-1).method, "thread/resume");
});

test("Codex notifications become tool, message, step and done events for the active thread only", async () => {
  const { driver, clients, events } = codexDriver();
  await driver.startSession({ cwd: "C:\\r", workspace: "C:\\w" });
  await driver.send("go");
  const notify = (method, params) => clients[0].emit("notification", { method, params: { threadId: "thr-1", ...params } });
  notify("turn/started", {});
  notify("item/started", { item: { id: "i1", type: "commandExecution", command: "forge3d make crate" } });
  notify("item/agentMessage/delta", { delta: "Building." });
  notify("item/commandExecution/outputDelta", { delta: "ok" });
  clients[0].emit("notification", { method: "item/started", params: { threadId: "other", item: { id: "x", type: "commandExecution" } } });
  notify("item/completed", { item: { id: "i1", type: "commandExecution", command: "forge3d make crate", status: "completed" } });
  notify("turn/completed", { turn: { status: "completed" } });
  assert.deepEqual(events.map((event) => [event.type, event.method]), [
    ["step", "turn/started"], ["tool", "item/started"], ["message", "item/agentMessage/delta"], ["log", "item/commandExecution/outputDelta"],
    ["tool", "item/completed"], ["step", "turn/completed"], ["done", undefined],
  ]);
  assert.equal(events[0].text, "Codex turn started.");
  assert.deepEqual(events.at(-1), { type: "done", status: "completed", error: null, sessionId: "thr-1", turnId: "turn-1" });
});

test("a failed Codex turn reports its error, and approvals reach the host only for the running turn", async () => {
  const { driver, clients, events } = codexDriver();
  await driver.startSession({ cwd: "C:\\r", workspace: "C:\\w" });
  await driver.send("go");
  clients[0].emit("request", { id: 7, method: "item/commandExecution/requestApproval", params: { threadId: "thr-1", turnId: "turn-1", command: "blender" } });
  clients[0].emit("request", { id: 8, method: "item/commandExecution/requestApproval", params: { threadId: "thr-9", turnId: "turn-1" } });
  clients[0].emit("request", { id: 9, method: "tool/requestUserInput", params: {} });
  assert.equal(events.find((event) => event.type === "approval").requestId, 7);
  assert.deepEqual(clients[0].decisions, [{ id: 8, decision: "cancel" }]);
  assert.deepEqual(clients[0].rejected, [9]);
  assert.equal(events.find((event) => event.type === "error").method, "tool/requestUserInput");
  clients[0].emit("notification", { method: "turn/completed", params: { threadId: "thr-1", turn: { status: "failed" } } });
  assert.equal(events.at(-1).error, "The Codex turn failed");
});

test("the App Server is retired when the workspace changes between runs, and its exit is reported", async () => {
  const { driver, clients, events } = codexDriver();
  await driver.prepare({ workspace: "C:\\a" });
  await driver.prepare({ workspace: "C:\\a" });
  assert.equal(clients.length, 1);
  await driver.prepare({ workspace: "C:\\b" });
  assert.equal(clients.length, 2);
  assert.equal(clients[0].closed, true);
  clients[0].emit("exit", { detail: "old server" });
  assert.equal(events.length, 0, "a retired server's exit is not news");
  clients[1].emit("exit", { detail: "" });
  assert.deepEqual(events.at(-1), { type: "error", message: "Codex App Server stopped unexpectedly", fatal: true });
  const { models } = await driver.models({ workspace: "C:\\b" });
  assert.deepEqual(models, [{ id: "gpt-x", label: "GPT X" }]);
});

test("Codex status reads the version and the login exit code", async () => {
  const run = (answers) => (command, args, options, callback) => {
    const answer = answers[args.join(" ")];
    callback(answer.code ? Object.assign(new Error("x"), { code: answer.code }) : null, answer.stdout || "", "");
  };
  const ready = await new CodexDriver({ findExecutable: () => "codex", execFileImpl: run({ "--version": { stdout: "codex-cli 0.159.2" }, "login status": { stdout: "Logged in" } }) }).status();
  assert.deepEqual([ready.installed, ready.signedIn, ready.version], [true, true, "0.159.2"]);
  const out = await new CodexDriver({ findExecutable: () => "codex", execFileImpl: run({ "--version": { stdout: "codex-cli 0.159.2" }, "login status": { code: 1 } }) }).status();
  assert.equal(out.signedIn, false);
  assert.match(out.fix, /codex login/);
  const missing = await new CodexDriver({ findExecutable: () => { throw new Error("no"); } }).status();
  assert.equal(missing.installed, false);
});
