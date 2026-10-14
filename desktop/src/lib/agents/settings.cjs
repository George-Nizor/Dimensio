"use strict";

// Which agent the Workshop drives, kept in the app's settings file (<local state>\config\settings.json):
//
//   { "schema_version": 1, "agent": "claude" }
//
// Claude Code is the default. Versions before this one never wrote an agent: they used Codex without saving
// that choice, so nothing they left behind (no file, a project's Codex model, a run's Codex thread) turns
// Codex back on. Only choosing Codex in the Workshop does, and that choice is then kept as it is.

const fs = require("node:fs");
const path = require("node:path");
const { atomicWriteJson } = require("../run-store.cjs");
const { DEFAULT_AGENT, agentInfo, isAgentId, listAgents } = require("./index.cjs");

class AgentSettings {
  constructor(file) {
    this.file = file;
  }

  _read() {
    try {
      const data = JSON.parse(fs.readFileSync(this.file, "utf8"));
      return data && typeof data === "object" && !Array.isArray(data) ? data : {};
    } catch {
      return {};
    }
  }

  agent() {
    const saved = this._read().agent;
    return isAgentId(saved) ? saved : DEFAULT_AGENT;
  }

  // What the renderer shows: the chosen agent and the ones it can choose from.
  get() {
    const agent = this.agent();
    return { agent, name: agentInfo(agent).name, agents: listAgents() };
  }

  setAgent(id) {
    if (!isAgentId(id)) throw new Error(`Unknown agent: ${id}`);
    const data = this._read();
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    atomicWriteJson(this.file, { ...data, schema_version: 1, agent: id });
    return this.get();
  }
}

module.exports = { AgentSettings };
