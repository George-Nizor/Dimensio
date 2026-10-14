"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { createCapabilitiesService } = require("../src/lib/capabilities-service.cjs");

const report = { schema: 1, capabilities: { blender: { state: "ready" } }, routes: { splat: { state: "ready" } } };

function fake(outcomes) {
  const calls = [];
  const impl = (command, args, options, callback) => {
    calls.push({ command, args, options });
    const next = outcomes.shift();
    setImmediate(() => callback(next.error || null, next.stdout || "", next.stderr || ""));
  };
  return { impl, calls };
}

test("caches a good report and refetches on force", async () => {
  const { impl, calls } = fake([{ stdout: JSON.stringify(report) }, { stdout: JSON.stringify(report) }]);
  const service = createCapabilitiesService({ command: "dimensio", execFileImpl: impl });
  assert.equal((await service.get()).ok, true);
  await service.get();
  assert.equal(calls.length, 1);
  await service.get({ force: true });
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[0].args, ["capabilities", "--json"]);
});

test("concurrent calls share one probe", async () => {
  const { impl, calls } = fake([{ stdout: JSON.stringify(report) }]);
  const service = createCapabilitiesService({ command: "dimensio", execFileImpl: impl });
  await Promise.all([service.get(), service.get()]);
  assert.equal(calls.length, 1);
});

test("failures resolve to ok:false and are not cached", async () => {
  const { impl, calls } = fake([{ error: new Error("spawn ENOENT"), stderr: "not found" }, { stdout: "not json" }, { stdout: JSON.stringify(report) }]);
  const service = createCapabilitiesService({ command: "dimensio", execFileImpl: impl });
  const first = await service.get();
  assert.equal(first.ok, false);
  assert.match(first.error, /not found/);
  assert.equal((await service.get()).ok, false);
  assert.equal((await service.get()).ok, true);
  assert.equal(calls.length, 3);
});

test("rejects an unknown schema or state", async () => {
  const bad = { schema: 1, capabilities: { x: { state: "great" } }, routes: {} };
  const { impl } = fake([{ stdout: JSON.stringify(bad) }]);
  const result = await createCapabilitiesService({ command: "f", execFileImpl: impl }).get();
  assert.equal(result.ok, false);
});

test("the probe asks about the agent chosen at the time, and invalidate drops the old answer", async () => {
  const { impl, calls } = fake([{ stdout: JSON.stringify(report) }, { stdout: JSON.stringify(report) }]);
  let agent = "claude";
  const service = createCapabilitiesService({ command: "dimensio", execFileImpl: impl, args: () => ["capabilities", "--json", "--agent", agent] });
  await service.get();
  agent = "codex";
  service.invalidate();
  await service.get();
  assert.deepEqual(calls.map((call) => call.args.at(-1)), ["claude", "codex"]);
});
