"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const test = require("node:test");

test("raw tool calls collapse into a few user-facing phases", async () => {
  const { summarizeRunSteps } = await import(pathToFileURL(path.join(__dirname, "..", "src", "renderer", "run-presentation.mjs")).href);
  const phases = summarizeRunSteps({ status: "completed", steps: [
    { name: "commandExecution", detail: "forge3d models run triposplat", status: "completed" },
    { name: "fileChange", detail: "saved candidate.splat", status: "completed" },
    { name: "commandExecution", detail: "validation report", status: "failed" },
    { name: "commandExecution", detail: "validation report", status: "completed" },
  ] });
  assert.deepEqual(phases.map((phase) => phase.label), ["Generate asset", "Package deliverables", "Check quality"]);
  assert.match(phases[2].detail, /recovered from 1 internal retry/);
  assert.equal(phases.some((phase) => phase.detail.includes("forge3d models")), false);
});
