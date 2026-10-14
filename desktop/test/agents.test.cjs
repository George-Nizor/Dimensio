"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { DEFAULT_AGENT, createRegistry, getDriver, listAgents } = require("../src/lib/agents/index.cjs");
const { AgentSettings } = require("../src/lib/agents/settings.cjs");
const { applyStep, describeItem, presentItem } = require("../src/lib/agents/steps.cjs");
const { RunStore, agentSession } = require("../src/lib/run-store.cjs");

const temp = (prefix) => fs.mkdtempSync(path.join(os.tmpdir(), prefix));

test("Claude Code is the default agent and Codex is the other choice; only Codex makes images", () => {
  assert.equal(DEFAULT_AGENT, "claude");
  assert.deepEqual(listAgents().map((agent) => [agent.id, agent.name, agent.default, agent.imageGeneration]), [
    ["claude", "Claude Code", true, false],
    ["codex", "Codex", false, true],
  ]);
  assert.equal(getDriver("claude").name, "Claude Code");
  assert.equal(getDriver("codex").name, "Codex");
  assert.throws(() => getDriver("gemini"), /Unknown agent/);
});

test("every driver has the same interface", () => {
  for (const id of ["claude", "codex"]) {
    const driver = getDriver(id);
    for (const method of ["status", "models", "prepare", "skill", "startSession", "send", "steer", "interrupt", "close", "closeNow", "endSession"]) {
      assert.equal(typeof driver[method], "function", `${id}.${method}`);
    }
    assert.equal(typeof driver.on, "function");
  }
});

test("the registry makes one driver per agent and wires it once", () => {
  const wired = [];
  const registry = createRegistry({ onCreate: (driver) => wired.push(driver.id) });
  assert.equal(registry.get("claude"), registry.get("claude"));
  registry.get("codex");
  assert.deepEqual(wired, ["claude", "codex"]);
  assert.throws(() => registry.get("other"), /Unknown agent/);
});

test("the agent setting defaults to Claude Code and keeps an explicit choice", () => {
  const file = path.join(temp("forge3d-settings-"), "config", "settings.json");
  const settings = new AgentSettings(file);
  assert.equal(settings.agent(), "claude");
  assert.equal(fs.existsSync(file), false, "reading never writes");
  assert.equal(settings.setAgent("codex").agent, "codex");
  assert.equal(new AgentSettings(file).agent(), "codex", "a chosen Codex stays chosen");
  assert.deepEqual(JSON.parse(fs.readFileSync(file, "utf8")), { schema_version: 1, agent: "codex" });
  settings.setAgent("claude");
  assert.equal(settings.get().name, "Claude Code");
  assert.throws(() => settings.setAgent("gpt"), /Unknown agent/);
  fs.writeFileSync(file, JSON.stringify({ agent: "something-old" }));
  assert.equal(settings.agent(), "claude");
  fs.writeFileSync(file, "not json");
  assert.equal(settings.agent(), "claude");
});

test("tool calls from either agent become the same run steps", () => {
  assert.equal(describeItem({ type: "commandExecution", command: ["forge3d", "make"] }), "forge3d make");
  assert.equal(describeItem({ type: "mcpToolCall", server: "blender", tool: "get_scene_info" }), "blender · get_scene_info");
  assert.equal(presentItem({ type: "commandExecution", command: "forge3d models run triposplat ref.png" }).phase, "generate");
  assert.equal(presentItem({ type: "imageGeneration" }).name, "Prepare reference");
  const manifest = { steps: [] };
  assert.equal(applyStep(manifest, "started", { id: "t1", type: "commandExecution", command: "forge3d validate x.glb" }, "T0"), true);
  assert.equal(applyStep(manifest, "completed", { id: "t1", type: "commandExecution", command: "forge3d validate x.glb", status: "completed" }, "T1"), true);
  assert.deepEqual(manifest.steps, [{ item_id: "t1", name: "Check quality", status: "completed", started_at: "T0", phase: "validate", detail: "Checking output quality", completed_at: "T1" }]);
  assert.equal(applyStep(manifest, "started", { id: "t2", type: "agentTool", name: "Read" }), false, "reading a file is not a step");
  assert.equal(manifest.steps.length, 1);
});

test("run.json keeps the agent, its session and turns; old runs' Codex threads are still read", async () => {
  const store = new RunStore(temp("forge3d-agent-runs-"));
  const run = await store.create({ prompt: "Make a crate" });
  assert.deepEqual(run.agent, { id: null, session_id: null, turn_ids: [] });
  assert.equal(run.codex, undefined);
  store.setAgent(run.run_id, { id: "claude", sessionId: "s-1", turnId: null });
  store.setAgent(run.run_id, { id: "claude", turnId: "r-1" });
  store.setAgent(run.run_id, { id: "claude", turnId: "r-1" });
  store.addUsage(run.run_id, { costUsd: 0.25, inputTokens: 10, outputTokens: 5, turns: 2 });
  const saved = store.addUsage(run.run_id, { costUsd: 0.5, inputTokens: 1, outputTokens: 1, turns: 1 });
  assert.deepEqual(saved.agent, { id: "claude", session_id: "s-1", turn_ids: ["r-1"], usage: { cost_usd: 0.75, input_tokens: 11, output_tokens: 6, turns: 3 } });
  assert.deepEqual(agentSession(saved), { id: "claude", sessionId: "s-1" });
  const switched = store.setAgent(run.run_id, { id: "codex", sessionId: "thr-2", turnId: "turn-2" });
  assert.deepEqual(switched.agent, { id: "codex", session_id: "thr-2", turn_ids: ["turn-2"] });
  assert.deepEqual(agentSession({ codex: { thread_id: "thr-old", turn_ids: ["t"] } }), { id: "codex", sessionId: "thr-old" });
  assert.deepEqual(agentSession({ agent: { id: null, session_id: null }, codex: { thread_id: null } }), { id: null, sessionId: null });
});
