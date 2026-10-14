"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const test = require("node:test");

async function preferences() {
  return import(pathToFileURL(path.join(__dirname, "..", "src", "renderer", "preferences.mjs")).href);
}

test("run settings default to a production splat and reject a cloud tool", async () => {
  const { DEFAULT_RUN_SETTINGS, normalizeRunSettings } = await preferences();
  assert.equal(DEFAULT_RUN_SETTINGS.quality, "production");
  assert.equal(DEFAULT_RUN_SETTINGS.target, "splat");
  assert.equal(normalizeRunSettings({ tool: "tripo-cloud" }).tool, "auto");
});

test("run settings persist valid selections and recover from corrupt storage", async () => {
  const { readRunSettings, writeRunSettings } = await preferences();
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  writeRunSettings(storage, { quality: "balanced", target: "blend", model: "gpt-test" });
  assert.deepEqual(readRunSettings(storage), {
    workflow: "auto", quality: "balanced", target: "blend", tool: "auto", model: "gpt-test", effort: "auto",
  });
  values.set("dimensio.runSettings.v1", "not json");
  assert.equal(readRunSettings(storage).target, "splat");
});
