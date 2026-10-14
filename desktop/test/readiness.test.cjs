"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const test = require("node:test");

const load = (name) => import(pathToFileURL(path.join(__dirname, "..", "src", "renderer", name)).href);

function item(id, state, extra = {}) {
  return { id, label: extra.label || id, state, reason: state === "ready" ? "" : `${id} is ${state}`, fix: state === "ready" ? "" : `Fix ${id} with \`fix-${id}\``, version: extra.version ?? null, optional: Boolean(extra.optional), gates: [] };
}
function report(overrides = {}) {
  const capabilities = {
    agent: item("agent", "ready", { label: "Claude Code", version: "2.1.299" }),
    blender: item("blender", "ready", { label: "Blender", version: "5.0.1" }),
    godot: item("godot", "optional_missing", { label: "Godot", optional: true }),
    wsl: item("wsl", "ready", { label: "WSL", version: "Ubuntu-24.04" }),
    triposplat: item("triposplat", "missing", { label: "TripoSplat" }),
    ...(overrides.capabilities || {}),
  };
  return {
    ok: true, schema: 1, platform: { system: "windows" },
    capabilities,
    routes: {
      splat: { state: "blocked", reason: "TripoSplat is not installed in WSL.", blocked_by: ["triposplat"], degraded_by: [] },
      blender: { state: "ready", reason: "", blocked_by: [], degraded_by: [] },
      godot: { state: "blocked", optional: true, reason: "Godot is missing.", blocked_by: ["godot"], degraded_by: [] },
      ...(overrides.routes || {}),
    },
    agent: { id: "claude", name: "Claude Code" },
    versions: { agent: "2.1.299", blender: "5.0.1", godot: null, wsl_distro: "Ubuntu-24.04" },
  };
}

test("an explicit workflow or tool commits to a route; the default target and Auto do not", async () => {
  const { routeForSettings } = await load("readiness.mjs");
  assert.equal(routeForSettings({ workflow: "gaussian-splat" }), "splat");
  assert.equal(routeForSettings({ tool: "triposplat" }), "splat");
  assert.equal(routeForSettings({ workflow: "authored-blender" }), "blender");
  assert.equal(routeForSettings({ workflow: "auto", tool: "auto", target: "splat" }), null);
});

test("a blocked chosen route blocks Run and says why; the same machine on another route is fine", async () => {
  const { deriveReadiness, runGate } = await load("readiness.mjs");
  const blocked = deriveReadiness({ capabilities: report(), settings: { workflow: "gaussian-splat" } });
  assert.equal(blocked.phase, "blocked");
  const gate = runGate(blocked);
  assert.equal(gate.allowed, false);
  assert.match(gate.message, /TripoSplat is not installed in WSL/);
  assert.match(gate.message, /fix-triposplat/);
  assert.equal(gate.chip, "Needs TripoSplat");
  assert.equal(blocked.required.find((row) => row.id === "triposplat").blocksRoute, true);

  const fine = deriveReadiness({ capabilities: report(), settings: { workflow: "authored-blender" } });
  assert.equal(fine.phase, "ready");
  assert.equal(runGate(fine).allowed, true);
});

test("Auto is blocked only when the agent is unusable or no generating route works", async () => {
  const { deriveReadiness, runGate } = await load("readiness.mjs");
  const auto = deriveReadiness({ capabilities: report(), settings: {} });
  assert.equal(auto.phase, "ready");
  assert.deepEqual(auto.unavailableRoutes, ["Gaussian splat"]);

  const signedOut = deriveReadiness({ capabilities: report({ capabilities: { agent: item("agent", "signed_out", { label: "Claude Code" }) } }), settings: {} });
  assert.equal(signedOut.phase, "blocked");
  assert.deepEqual(signedOut.culpritIds, ["agent"]);
  assert.equal(runGate(signedOut).allowed, false);
  assert.equal(runGate(signedOut).chip, "Needs Claude Code");

  const none = deriveReadiness({ capabilities: report({ routes: { blender: { state: "blocked", reason: "x", blocked_by: ["blender"], degraded_by: [] } } }), settings: {} });
  assert.equal(none.phase, "blocked");
});

test("degraded warns without blocking, and an ended agent session warns without blocking", async () => {
  const { deriveReadiness, runGate } = await load("readiness.mjs");
  const degraded = deriveReadiness({ capabilities: report({ capabilities: { blender: item("blender", "degraded", { label: "Blender" }) }, routes: { blender: { state: "degraded", reason: "Blender is old.", blocked_by: [], degraded_by: ["blender"] } } }), settings: { workflow: "authored-blender" } });
  assert.equal(degraded.phase, "degraded");
  assert.equal(runGate(degraded).allowed, true);
  assert.equal(runGate(degraded).level, "warn");

  const offline = deriveReadiness({ capabilities: report(), settings: {}, appServerError: "Claude Code stopped before the run finished" });
  assert.equal(offline.phase, "degraded");
  assert.equal(offline.offline, true);
  assert.match(offline.reason, /^The last Claude Code session ended/);
  assert.equal(runGate(offline).allowed, true, "Run starts a new session, so blocking it would trap the person");
});

test("a failed capability check says so, with its fix, and is never read as ready", async () => {
  const { deriveReadiness, runGate } = await load("readiness.mjs");
  const view = deriveReadiness({ capabilities: { ok: false, error: "The capability check timed out.", fix: "Reinstall Dimensio." }, settings: {} });
  assert.equal(view.phase, "error");
  assert.equal(view.error, "The capability check timed out.");
  assert.equal(view.fix, "Reinstall Dimensio.");
  assert.notEqual(runGate(view).level, "ok");
  assert.equal(deriveReadiness({ capabilities: null }).phase, "checking");
});

test("Run stays off while the setup check runs and when it could not be done", async () => {
  const { deriveReadiness, runGate } = await load("readiness.mjs");
  const checking = runGate(deriveReadiness({ capabilities: null, agent: { id: "claude", name: "Claude Code" } }));
  assert.equal(checking.allowed, false);
  assert.match(checking.message, /until the setup check finishes/);
  assert.match(deriveReadiness({ capabilities: null, agent: { id: "codex", name: "Codex" } }).reason, /for Codex, Blender/);
  const failed = runGate(deriveReadiness({ capabilities: { ok: false, error: "The capability check timed out.", fix: "Reinstall Dimensio." } }));
  assert.equal(failed.allowed, false);
  assert.match(failed.message, /setup could not be checked\. The capability check timed out\. Reinstall Dimensio\./);
});

test("a splat with no image attached needs Codex, and says so; with an image it does not", async () => {
  const { deriveReadiness, runGate, setupHeadline } = await load("readiness.mjs");
  const reason = "Claude Code cannot make images, so a splat from words alone needs Codex.";
  const withText = report({
    capabilities: { image_generation: item("image_generation", "optional_missing", { label: "Reference image from words", optional: true }) },
    routes: {
      splat: { state: "ready", reason: "", blocked_by: [], degraded_by: [] },
      splat_text: { state: "blocked", reason, blocked_by: ["image_generation"], degraded_by: [] },
    },
  });
  const words = deriveReadiness({ capabilities: withText, settings: { workflow: "gaussian-splat" }, hasImage: false });
  assert.equal(words.route, "splat_text");
  assert.equal(words.phase, "blocked");
  assert.equal(runGate(words).allowed, false);
  assert.match(runGate(words).message, /needs Codex/);
  assert.equal(setupHeadline(words).title, "Gaussian splat from words isn't ready");
  const picture = deriveReadiness({ capabilities: withText, settings: { workflow: "gaussian-splat" }, hasImage: true });
  assert.equal(picture.route, "splat");
  assert.equal(picture.phase, "ready");
  const auto = deriveReadiness({ capabilities: withText, settings: {}, hasImage: false });
  assert.equal(auto.phase, "ready");
  assert.deepEqual(auto.unavailableRoutes, ["Gaussian splat from words"]);
  assert.deepEqual(deriveReadiness({ capabilities: withText, settings: {}, hasImage: true }).unavailableRoutes, []);
});

test("the agent choice lists each agent with its state and fix, and what it can do with images", async () => {
  const { agentChoices, isImagePath } = await load("readiness.mjs");
  const choices = agentChoices({ agent: "claude", statuses: {
    claude: { id: "claude", name: "Claude Code", imageGeneration: false, installed: true, signedIn: false, version: "2.1.299", reason: "Claude Code is installed but not signed in.", fix: "Run `claude` in a terminal and sign in." },
    codex: { id: "codex", name: "Codex", imageGeneration: true, installed: false, signedIn: false, version: "", reason: "Codex was not found.", fix: "Install Codex." },
  } });
  assert.deepEqual(choices.map((choice) => [choice.id, choice.chosen, choice.state, choice.stateWord]), [
    ["claude", true, "signed_out", "Signed out"],
    ["codex", false, "missing", "Not installed"],
  ]);
  assert.match(choices[0].fix, /`claude`/);
  assert.match(choices[0].images, /attached reference image/);
  assert.match(choices[1].images, /from words/);
  const ready = agentChoices({ agent: "codex", statuses: { codex: { id: "codex", name: "Codex", installed: true, signedIn: true, reason: "x", fix: "y" } } })[0];
  assert.deepEqual([ready.state, ready.reason, ready.fix], ["ready", "", ""]);
  assert.deepEqual(agentChoices(null), []);
  assert.equal(isImagePath("C:\\refs\\Lamp.JPG"), true);
  assert.equal(isImagePath("model.glb"), false);
});

test("rows split into required and optional, problems first, ready rows carry no reason or fix", async () => {
  const { deriveReadiness } = await load("readiness.mjs");
  const view = deriveReadiness({ capabilities: report(), settings: {} });
  assert.deepEqual(view.optional.map((row) => row.id), ["godot"]);
  assert.equal(view.required[0].state, "missing");
  const agent = view.required.find((row) => row.id === "agent");
  assert.equal(agent.reason, "");
  assert.equal(agent.fix, "");
  assert.equal(agent.version, "2.1.299");
});

test("versions come from the report and absent ones stay absent", async () => {
  const { toolVersionsFromReport, deriveReadiness, statusEntries } = await load("readiness.mjs");
  assert.deepEqual(toolVersionsFromReport(report()), { agent: "2.1.299", blender: "5.0.1", wsl: "Ubuntu-24.04" });
  const entries = statusEntries(deriveReadiness({ capabilities: report(), settings: {} }), {});
  assert.deepEqual(entries.map((entry) => [entry.id, entry.state]), [["agent", "ready"], ["blender", "ready"], ["godot", "unset"], ["wsl", "ready"]]);
  assert.equal(entries[0].name, "Claude Code");
});

test("fix text splits backticked commands out for copying", async () => {
  const { splitFix } = await load("readiness.mjs");
  assert.deepEqual(splitFix("Install it with `winget install Foo` then restart."), [{ text: "Install it with " }, { code: "winget install Foo" }, { text: " then restart." }]);
  assert.deepEqual(splitFix("Sign in."), [{ text: "Sign in." }]);
});

test("elapsed time and sentence case", async () => {
  const { formatElapsed, sentenceCase } = await load("readiness.mjs");
  assert.equal(formatElapsed(161000), "02:41");
  assert.equal(formatElapsed(3725000), "1:02:05");
  assert.equal(formatElapsed(NaN), "");
  assert.equal(sentenceCase("authored-blender"), "Authored blender");
  assert.equal(sentenceCase("image_to_mesh"), "Image to mesh");
  assert.equal(sentenceCase("GLB"), "GLB");
});

test("the viewport state follows the run status, not just whether there is a file", async () => {
  const { stageState } = await load("stage-state.mjs");
  const ready = { phase: "ready" };
  assert.equal(stageState({ hasRuns: false, readiness: ready }).kind, "setup", "first run shows the setup card");
  assert.equal(stageState({ hasRuns: true, readiness: ready }).kind, "empty");
  assert.equal(stageState({ hasRuns: true, readiness: { phase: "blocked" } }).kind, "setup");
  assert.equal(stageState({ hasRuns: true, readiness: { phase: "error" } }).kind, "setup");
  assert.equal(stageState({ run: { status: "completed" }, hasArtifact: true, readiness: { phase: "blocked" } }).kind, "artifact", "a blocked setup never covers an asset");
  assert.equal(stageState({ run: { status: "completed" }, hasArtifact: true, forceSetup: true }).kind, "setup");

  const failed = stageState({ run: { status: "failed", failure: "TripoSplat exited (CUDA out of memory)" } });
  assert.equal(failed.kind, "failed");
  assert.match(failed.message, /CUDA/);
  assert.match(failed.hint, /Draft/);
  assert.match(stageState({ run: { status: "failed" } }).message, /no reason/);
  assert.equal(stageState({ run: { status: "interrupted" } }).kind, "stopped");
  assert.equal(stageState({ run: { status: "completed" } }).kind, "finished");

  const running = stageState({ run: { status: "running", created_at: "2026-10-06T10:00:00Z", steps: [{ status: "completed" }, { status: "running", detail: "spar3d inference" }] } });
  assert.equal(running.kind, "running");
  assert.equal(running.activity, "spar3d inference");
  assert.equal(running.done, 1);
  assert.equal(running.startedAt, Date.parse("2026-10-06T10:00:00Z"));
  assert.equal(stageState({ run: { status: "prepared", steps: [] } }).starting, true);
});

test("phases are ordered by when they began and carry real timing only", async () => {
  const { summarizeRunSteps } = await load("run-presentation.mjs");
  const now = Date.parse("2026-10-06T10:10:00Z");
  const run = { status: "running", steps: [
    { name: "x", phase: "local", status: "completed", started_at: "2026-10-06T10:05:00Z", completed_at: "2026-10-06T10:06:00Z" },
    { name: "y", phase: "generate", status: "running", started_at: "2026-10-06T10:07:00Z" },
    { name: "z", phase: "reference", status: "completed", started_at: "2026-10-06T10:01:00Z", completed_at: "2026-10-06T10:02:30Z" },
  ] };
  const phases = summarizeRunSteps(run, now);
  assert.deepEqual(phases.map((phase) => phase.key), ["reference", "local", "generate"]);
  assert.equal(phases[0].elapsedMs, 90000);
  assert.equal(phases[2].live, true);
  assert.equal(phases[2].elapsedMs, 180000);
  const untimed = summarizeRunSteps({ status: "running", steps: [{ name: "a", phase: "generate", status: "running" }] }, now)[0];
  assert.equal(untimed.elapsedMs, null);
  assert.equal(untimed.live, false);
});

test("the setup headline names the real problem", async () => {
  const { deriveReadiness, setupHeadline } = await load("readiness.mjs");
  const signedOut = deriveReadiness({ capabilities: report({ capabilities: { agent: item("agent", "signed_out", { label: "Claude Code" }) } }), settings: {} });
  assert.equal(setupHeadline(signedOut).title, "Claude Code isn't signed in");
  const missing = deriveReadiness({ capabilities: report({ capabilities: { agent: item("agent", "missing", { label: "Codex" }) } }), settings: {} });
  assert.equal(setupHeadline(missing).title, "Codex isn't installed");
  const offline = deriveReadiness({ capabilities: report(), settings: {}, appServerError: "stopped" });
  assert.equal(setupHeadline(offline).title, "The Claude Code session ended");
  const splat = deriveReadiness({ capabilities: report(), settings: { workflow: "gaussian-splat" } });
  assert.equal(setupHeadline(splat).title, "Gaussian splat isn't ready");
  assert.equal(setupHeadline(deriveReadiness({ capabilities: report(), settings: {} }), { firstRun: true }).lead, "Describe a model in the prompt bar to start the first run.");
  // Opened from the course app's Settings (workshop.html#setup) before any project is open.
  assert.equal(setupHeadline(deriveReadiness({ capabilities: report(), settings: {} }), { firstRun: true, noProject: true }).lead, "Create or open a project, then describe a model in the prompt bar.");
});
