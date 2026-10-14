"use strict";

// The agents the Workshop can drive, behind one interface. main.cjs talks to a driver and never to an agent's own
// protocol. Every driver is an EventEmitter with:
//
//   status({ force })      -> { installed, signedIn, version, path, reason, fix }
//   models()               -> { models: [{ id, label }], defaultModel, defaultEffort, efforts }
//   prepare(context)       -> starts whatever must run before a session (Codex: the App Server); throws if it cannot
//   skill(context)         -> the dimensio skill's state ({ state: "ready" | "missing" | ..., path })
//   startSession({ cwd, workspace, env, project, mcp, skillDir, model, effort, resume }) -> { sessionId, resumed }
//   send(text, attachments) -> { turnId }       attachments: [{ path, relative, mediaType }]
//   steer(text)            -> { mode }           "mid-turn": the note joins the running turn
//   interrupt()            stops the running turn
//   close()                ends the session and anything it started; resolves once it has gone
//   closeNow()             the same, synchronously, for quitting
//   endSession()           forgets the finished session (a Claude Code process still running is stopped)
//
// and these events, which main.cjs maps onto the run's steps and transcript:
//
//   step     { method, text }                   a milestone (turn started or finished, a steering note landed)
//   message  { method, text }                   the agent's own words
//   tool     { phase, method, item }            a tool call started or completed (item: Codex item vocabulary)
//   log      { method, text }                   tool output
//   stderr   { kind, text }                     the agent process's stderr
//   usage    { costUsd, durationMs, turns, inputTokens, outputTokens }
//   session  { sessionId, turnId }              the session id changed (a lost session was replaced)
//   approval { requestId, method, params, message }   Codex only: a request the host must decide
//   done     { status, error, sessionId, turnId }     status: completed | interrupted | failed
//   error    { message, fatal, method, notify }      fatal: the agent stopped; method: goes to the transcript

const { ClaudeDriver } = require("./claude.cjs");
const { CodexDriver } = require("./codex.cjs");

const DEFAULT_AGENT = "claude";

// imageGeneration: the agent can make a reference image from words, which a splat without an attached image needs.
const AGENTS = Object.freeze([
  Object.freeze({ id: "claude", name: "Claude Code", imageGeneration: false }),
  Object.freeze({ id: "codex", name: "Codex", imageGeneration: true }),
]);

function listAgents() {
  return AGENTS.map((agent) => ({ ...agent, default: agent.id === DEFAULT_AGENT }));
}

function isAgentId(id) {
  return AGENTS.some((agent) => agent.id === id);
}

function agentInfo(id) {
  return AGENTS.find((agent) => agent.id === id) || AGENTS.find((agent) => agent.id === DEFAULT_AGENT);
}

// A new driver for `id`. options go to the driver's constructor (tests pass fakes for processes and lookups).
function getDriver(id, options = {}) {
  if (id === "claude") return new ClaudeDriver(options.claude || options);
  if (id === "codex") return new CodexDriver(options.codex || options);
  throw new Error(`Unknown agent: ${id}`);
}

// One driver per agent for the life of the app, created when first asked for. onCreate wires a new driver's events.
function createRegistry({ onCreate = null, ...options } = {}) {
  const drivers = new Map();
  return {
    listAgents,
    get(id) {
      if (!isAgentId(id)) throw new Error(`Unknown agent: ${id}`);
      if (!drivers.has(id)) {
        const driver = getDriver(id, options);
        drivers.set(id, driver);
        onCreate?.(driver);
      }
      return drivers.get(id);
    },
    existing() {
      return [...drivers.values()];
    },
    async closeAll() {
      await Promise.all([...drivers.values()].map((driver) => driver.close().catch(() => {})));
    },
    // For quitting: stops every agent process now, without waiting.
    closeAllNow() {
      for (const driver of drivers.values()) {
        try { driver.closeNow(); } catch { /* already gone */ }
      }
    },
  };
}

module.exports = { AGENTS, DEFAULT_AGENT, agentInfo, createRegistry, getDriver, isAgentId, listAgents };
