"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const test = require("node:test");

async function routing() {
  return import(pathToFileURL(path.join(__dirname, "..", "src", "renderer", "preview-routing.mjs")).href);
}

function splatRun() {
  return {
    workflow_route: "auto",
    settings: { target_format: "splat" },
    artifacts: [
      { path: "wooden_spoon_v002/previews/hero.png", preview_role: "primary-image" },
      { path: "wooden_spoon_v004/proxy.glb", preview_role: "model" },
      { path: "wooden_spoon_v004/splat/candidate.ply", preview_role: "gaussian-splat" },
      { path: "wooden_spoon_v004/splat/candidate.splat", preview_role: "gaussian-splat" },
      { path: "wooden_spoon_v004/previews/hero.png", preview_role: "primary-image" },
      { path: "wooden_spoon_v004/build.py", preview_role: "metadata" },
      { path: "wooden_spoon_v004/validation.json", preview_role: "validation" },
      { path: "wooden_spoon_v004/notes.txt", preview_role: "text" },
    ],
  };
}

test("splat targets open the native splat rather than a still image", async () => {
  const { selectedArtifactForRun } = await routing();
  assert.equal(selectedArtifactForRun(splatRun()).path, "wooden_spoon_v004/splat/candidate.splat");
});

test("an explicit artifact selection still overrides the target default", async () => {
  const { selectedArtifactForRun } = await routing();
  assert.equal(selectedArtifactForRun(splatRun(), "wooden_spoon_v004/proxy.glb").preview_role, "model");
});

test("the filmstrip shows one interactive splat and excludes implementation files", async () => {
  const { filmstripArtifacts } = await routing();
  const artifacts = filmstripArtifacts(splatRun(), null, 8);
  assert.equal(artifacts[0].path, "wooden_spoon_v004/splat/candidate.splat");
  assert.equal(artifacts.filter((artifact) => artifact.preview_role === "gaussian-splat").length, 1);
  assert.equal(artifacts.some((artifact) => ["metadata", "validation", "text"].includes(artifact.preview_role)), false);
});

test("non-splat runs retain their rendered-image default", async () => {
  const { selectedArtifactForRun } = await routing();
  const run = splatRun();
  run.settings.target_format = "glb";
  assert.equal(selectedArtifactForRun(run).preview_role, "primary-image");
});
