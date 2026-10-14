"use strict";

// The Codex driver: Codex App Server (`codex app-server`, JSONL over stdio) behind the common agent interface in
// index.cjs. The client below speaks the protocol; CodexDriver maps threads, turns, approvals and item
// notifications onto the driver events main.cjs turns into run steps.

const { EventEmitter } = require("node:events");
const { execFile, spawn } = require("node:child_process");
const path = require("node:path");
const readline = require("node:readline");
const { findCodexExecutable, inspectForgeSkill } = require("../runtime.cjs");

class CodexAppServerClient extends EventEmitter {
  constructor({ command = "codex", args = ["app-server"], cwd, env = process.env, spawnProcess = spawn } = {}) {
    super();
    this.command = command;
    this.args = args;
    this.cwd = cwd;
    this.env = env;
    this.spawnProcess = spawnProcess;
    this.process = null;
    this.reader = null;
    this.pending = new Map();
    this.serverRequests = new Map();
    this.nextId = 1;
    this.started = false;
    this.stderr = "";
  }

  async start() {
    if (this.started) return;
    if (this.process) throw new Error("Codex App Server is already starting");
    this.process = this.spawnProcess(this.command, this.args, {
      cwd: this.cwd,
      env: this.env,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    });
    this.process.once("error", (error) => this._failAll(error));
    this.process.once("exit", (code, signal) => {
      const detail = this.stderr.trim().slice(-2000);
      this._failAll(new Error(`Codex App Server exited (${code ?? signal ?? "unknown"})${detail ? `: ${detail}` : ""}`));
      this.emit("exit", { code, signal, detail });
      this.started = false;
      this.process = null;
    });
    this.process.stderr.on("data", (chunk) => {
      this.stderr = `${this.stderr}${chunk.toString("utf8")}`.slice(-8000);
      this.emit("stderr", chunk.toString("utf8"));
    });
    this.reader = readline.createInterface({ input: this.process.stdout });
    this.reader.on("line", (line) => this.ingestLine(line));

    await this.request("initialize", {
      clientInfo: { name: "forge3d_desktop", title: "Forge3D", version: require("../../../package.json").version },
    });
    this.notify("initialized", {});
    this.started = true;
  }

  _write(message) {
    if (!this.process?.stdin?.writable) throw new Error("Codex App Server is not connected");
    this.process.stdin.write(`${JSON.stringify(message)}\n`);
  }

  request(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { method, resolve, reject });
      try {
        this._write({ method, id, params });
      } catch (error) {
        this.pending.delete(id);
        reject(error);
      }
    });
  }

  notify(method, params = {}) {
    this._write({ method, params });
  }

  ingestLine(line) {
    if (!line.trim()) return;
    let message;
    try {
      message = JSON.parse(line);
    } catch (error) {
      this.emit("protocolError", new Error(`Invalid App Server JSONL: ${error.message}`));
      return;
    }
    if (Object.hasOwn(message, "id") && message.method) {
      this.serverRequests.set(message.id, message);
      this.emit("request", message);
      return;
    }
    if (Object.hasOwn(message, "id")) {
      const pending = this.pending.get(message.id);
      if (!pending) {
        this.emit("protocolError", new Error(`Unexpected App Server response id ${message.id}`));
        return;
      }
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message || JSON.stringify(message.error)));
      else pending.resolve(message.result);
      return;
    }
    if (message.method) this.emit("notification", message);
  }

  respond(requestId, result) {
    if (!this.serverRequests.has(requestId)) throw new Error(`Unknown App Server request ${requestId}`);
    this.serverRequests.delete(requestId);
    this._write({ id: requestId, result });
  }

  reject(requestId, message = "Unsupported App Server request") {
    if (!this.serverRequests.has(requestId)) throw new Error(`Unknown App Server request ${requestId}`);
    this.serverRequests.delete(requestId);
    this._write({ id: requestId, error: { code: -32601, message } });
  }

  async listSkills(cwd, forceReload = false) {
    const result = await this.request("skills/list", { cwds: [cwd], forceReload });
    return result?.data?.flatMap((entry) => entry.skills || []) || [];
  }

  async startThread({ cwd, model }) {
    const params = { cwd, approvalPolicy: "on-request" };
    if (model && model !== "auto") params.model = model;
    const result = await this.request("thread/start", params);
    return result.thread;
  }

  async resumeThread(threadId) {
    const result = await this.request("thread/resume", { threadId });
    return result.thread;
  }

  async startTurn({ threadId, prompt, cwd, skill, images = [], model, effort, allowNetwork = false }) {
    const input = [{ type: "text", text: `$forge3d ${prompt}` }];
    if (skill?.path) input.push({ type: "skill", name: "forge3d", path: skill.path });
    for (const imagePath of images) input.push({ type: "localImage", path: imagePath });
    const params = {
      threadId,
      input,
      cwd,
      approvalPolicy: "on-request",
      sandboxPolicy: {
        type: "workspaceWrite",
        writableRoots: [cwd],
        networkAccess: Boolean(allowNetwork),
      },
    };
    if (model && model !== "auto") params.model = model;
    if (effort && effort !== "auto") params.effort = effort;
    const result = await this.request("turn/start", params);
    return result.turn;
  }

  steer(threadId, turnId, text) {
    return this.request("turn/steer", {
      threadId,
      expectedTurnId: turnId,
      input: [{ type: "text", text }],
    });
  }

  interrupt(threadId, turnId) {
    return this.request("turn/interrupt", { threadId, turnId });
  }

  decide(requestId, decision) {
    const allowed = new Set(["accept", "acceptForSession", "decline", "cancel"]);
    if (!allowed.has(decision)) throw new Error("Invalid approval decision");
    const request = this.serverRequests.get(requestId);
    if (!request) throw new Error(`Unknown App Server request ${requestId}`);
    if (request.method === "mcpServer/elicitation/request") {
      const action = decision === "accept" || decision === "acceptForSession" ? "accept" : decision;
      this.respond(requestId, {
        action,
        content: action === "accept" ? {} : null,
        _meta: decision === "acceptForSession" ? { persist: "session" } : null,
      });
      return;
    }
    this.respond(requestId, { decision });
  }

  close() {
    this.reader?.close();
    if (this.process && !this.process.killed) this.process.kill();
    this._failAll(new Error("Codex App Server was closed"));
    this.started = false;
    this.process = null;
  }

  _failAll(error) {
    for (const pending of this.pending.values()) pending.reject(error);
    this.pending.clear();
  }
}

const APPROVAL_METHODS = new Set([
  "item/commandExecution/requestApproval",
  "item/fileChange/requestApproval",
  "mcpServer/elicitation/request",
]);
const CODEX_FIX_MISSING = "Install the Codex app or CLI (https://developers.openai.com/codex) and sign in, then press Check again.";
const CODEX_FIX_SIGNED_OUT = "Run `codex login` in a terminal (or open the Codex app) and sign in, then press Check again.";

function capture(execFileImpl, command, args, timeout = 15000) {
  return new Promise((resolve) => {
    execFileImpl(command, args, { windowsHide: true, timeout, encoding: "utf8" }, (error, stdout, stderr) => {
      resolve({ code: error ? (typeof error.code === "number" ? error.code : 1) : 0, timedOut: Boolean(error?.killed), failed: Boolean(error && typeof error.code !== "number" && !error.killed), stdout: String(stdout || ""), stderr: String(stderr || "") });
    });
  });
}

function parseVersion(text) {
  return /(\d+\.\d+(?:\.\d+)?)/.exec(String(text || ""))?.[1] || "";
}

class CodexDriver extends EventEmitter {
  constructor({
    findExecutable = findCodexExecutable,
    createClient = (options) => new CodexAppServerClient(options),
    execFileImpl = execFile,
    now = Date.now,
  } = {}) {
    super();
    this.id = "codex";
    this.name = "Codex";
    this.findExecutable = findExecutable;
    this.createClient = createClient;
    this.execFileImpl = execFileImpl;
    this.now = now;
    this.client = null;
    this.threadId = null;
    this.turnId = null;
    this.turnActive = false;
    this.session = null;
    this.statusCache = null;
  }

  // { installed, signedIn, version, path, reason, fix }. `codex login status` exits 0 when signed in.
  async status({ force = false, maxAgeMs = 60_000 } = {}) {
    if (!force && this.statusCache && this.now() - this.statusCache.at < maxAgeMs) return this.statusCache.value;
    let executable = null;
    try { executable = this.findExecutable(); } catch { executable = null; }
    let value;
    if (!executable) {
      value = { installed: false, signedIn: false, version: "", path: "", reason: "Codex was not found.", fix: CODEX_FIX_MISSING };
    } else {
      const version = await capture(this.execFileImpl, executable, ["--version"]);
      if (version.code !== 0 && !version.stdout) {
        value = { installed: false, signedIn: false, version: "", path: executable, reason: "Codex was found but did not start.", fix: CODEX_FIX_MISSING };
      } else {
        const login = await capture(this.execFileImpl, executable, ["login", "status"]);
        const signedIn = login.code === 0;
        value = {
          installed: true,
          signedIn,
          version: parseVersion(version.stdout),
          path: executable,
          reason: signedIn ? "" : login.timedOut ? "Codex did not answer the sign-in check in time." : "Codex is installed but not signed in.",
          fix: signedIn ? "" : CODEX_FIX_SIGNED_OUT,
        };
      }
    }
    this.statusCache = { at: this.now(), value };
    return value;
  }

  // Codex lists the models an account can use (`model/list`), so this starts the App Server.
  async models({ workspace, env } = {}) {
    let list = [];
    try {
      const client = await this.prepare({ workspace, env });
      const result = await client.request("model/list", { limit: 50, includeHidden: false });
      list = (result?.data || []).map((model) => ({ id: model.id || model.model, label: model.displayName || model.id || model.model })).filter((model) => model.id);
    } catch { /* no list: the picker offers the default only */ }
    return { models: list, defaultModel: "", defaultEffort: "", efforts: ["low", "medium", "high", "xhigh"] };
  }

  // The App Server runs inside the open project's runs folder (or the local state root on the start screen).
  // Switching projects retires the old server; the next request starts one in the new place.
  async prepare({ workspace, env = process.env } = {}) {
    if (this.client?.started && this.client.cwd === workspace) return this.client;
    if (this.client?.started && !this.turnActive) {
      const retired = this.client;
      this.client = null;
      this.skillState = null;
      retired.close();
    } else if (this.client?.started) return this.client;
    const executable = this.findExecutable();
    const client = this.createClient({ command: executable, cwd: workspace, env });
    this.client = client;
    client.on("notification", (message) => this._guard(() => this._onNotification(message)));
    client.on("request", (message) => this._guard(() => this._onRequest(message)));
    client.on("protocolError", (error) => this._report({ message: error.message, notify: true }));
    client.on("stderr", (text) => { if (this.turnActive) this.emit("stderr", { kind: "app-server-stderr", text: String(text) }); });
    client.on("exit", ({ detail }) => {
      if (client !== this.client) return; // a retired server from an earlier project
      const message = detail || "Codex App Server stopped unexpectedly";
      this.client = null;
      this.turnActive = false;
      this._report({ message, fatal: true });
    });
    try {
      await client.start();
    } catch (error) {
      this.client = null;
      throw error;
    }
    return client;
  }

  // The forge3d skill as Codex sees it, or the bundled SKILL.md passed by path when the plugin is not installed.
  async skill({ workspace, env, bundledPlugin, force = false } = {}) {
    const client = await this.prepare({ workspace, env });
    const skills = await client.listSkills(workspace, force);
    const installed = skills.find((skill) => skill.name === "forge3d" && skill.enabled !== false) || null;
    let state = inspectForgeSkill(installed);
    if (!installed && bundledPlugin) {
      state = { ...state, path: path.join(bundledPlugin, "skills", "forge3d", "SKILL.md"), state: "missing", usingBundledFallback: true };
    }
    this.skillState = state;
    return state;
  }

  async startSession({ cwd, workspace, env, model = "auto", effort = "auto", resume = null, skill = null } = {}) {
    const client = await this.prepare({ workspace, env });
    const thread = resume ? await client.resumeThread(resume) : await client.startThread({ cwd, model });
    this.threadId = thread.id;
    this.turnId = null;
    this.session = { cwd, model, effort, skill: skill || this.skillState || null };
    return { sessionId: thread.id, resumed: Boolean(resume) };
  }

  async send(text, attachments = []) {
    if (!this.client || !this.threadId) throw new Error("Codex has no open session");
    const images = attachments.filter((item) => String(item.mediaType || "").startsWith("image/")).map((item) => item.path);
    this.turnActive = true;
    try {
      const turn = await this.client.startTurn({
        threadId: this.threadId,
        prompt: text,
        cwd: this.session.cwd,
        skill: this.session.skill,
        images,
        model: this.session.model,
        effort: this.session.effort,
        allowNetwork: false,
      });
      this.turnId = turn.id;
      return { turnId: turn.id };
    } catch (error) {
      this.turnActive = false;
      throw error;
    }
  }

  // turn/steer lands in the running turn.
  async steer(text) {
    if (!this.client || !this.turnActive) throw new Error("This run is not active");
    await this.client.steer(this.threadId, this.turnId, text);
    return { mode: "mid-turn" };
  }

  async interrupt() {
    if (!this.client || !this.turnActive) return;
    await this.client.interrupt(this.threadId, this.turnId);
  }

  decide(requestId, decision) {
    if (!this.client) throw new Error("Codex is not running");
    this.client.decide(requestId, decision);
  }

  endSession() {
    this.threadId = null;
    this.turnId = null;
    this.turnActive = false;
    this.session = null;
  }

  // Stops the App Server. Resolves once the process has gone, so a folder it was working in can be moved.
  async close() {
    const client = this.client;
    this.client = null;
    this.skillState = null;
    this.endSession();
    if (!client) return;
    const child = client.process;
    const exited = child && child.exitCode === null ? new Promise((resolve) => {
      child.once("exit", resolve);
      setTimeout(resolve, 5000).unref?.();
    }) : Promise.resolve();
    client.close();
    await exited;
  }

  closeNow() {
    const client = this.client;
    this.client = null;
    this.skillState = null;
    this.endSession();
    client?.close();
  }

  _report(payload) {
    if (this.listenerCount("error")) this.emit("error", payload);
  }

  _guard(callback) {
    try { callback(); } catch (error) { this._report({ message: `Forge3D could not process Codex activity: ${error.message}`, fatal: true, internal: true }); }
  }

  _onRequest(message) {
    const params = message.params || {};
    if (!APPROVAL_METHODS.has(message.method)) {
      this.client.reject(message.id, `Forge3D does not support App Server request ${message.method}`);
      if (this.turnActive) this._report({ message: "Unsupported App Server request was rejected safely.", method: message.method });
      return;
    }
    if (!this.turnActive || params.threadId !== this.threadId || (params.turnId && params.turnId !== this.turnId)) {
      this.client.decide(message.id, "cancel");
      return;
    }
    this.emit("approval", { requestId: message.id, method: message.method, params, message });
  }

  _onNotification(message) {
    if (!this.turnActive) return;
    const params = message.params || {};
    const scopedThread = params.threadId || params.thread?.id;
    if (scopedThread && scopedThread !== this.threadId) return;

    if ((message.method === "item/started" || message.method === "item/completed") && params.item?.id) {
      this.emit("tool", { phase: message.method === "item/completed" ? "completed" : "started", method: message.method, item: params.item });
    }
    const delta = params.delta;
    if (typeof delta === "string") {
      if (message.method.includes("agentMessage")) this.emit("message", { method: message.method, text: delta });
      else if (message.method.includes("outputDelta")) this.emit("log", { method: message.method, text: delta });
    } else if (message.method === "turn/started" || message.method === "turn/completed") {
      this.emit("step", { method: message.method, text: message.method === "turn/started" ? "Codex turn started." : "Codex turn finished." });
    }

    if (message.method === "turn/completed") {
      const turn = params.turn || {};
      const rawStatus = turn.status || "failed";
      const status = rawStatus === "completed" ? "completed" : rawStatus === "interrupted" ? "interrupted" : "failed";
      const error = turn.error?.message || (status === "failed" ? "The Codex turn failed" : null);
      const done = { status, error, sessionId: this.threadId, turnId: this.turnId };
      this.turnActive = false;
      this.emit("done", done);
    }
  }
}

module.exports = { APPROVAL_METHODS, CodexAppServerClient, CodexDriver, parseVersion };