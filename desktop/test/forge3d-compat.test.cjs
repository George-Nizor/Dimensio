"use strict";

// What a machine set up for Forge3D, Dimensio's earlier name, keeps.

const assert = require("node:assert/strict");
const test = require("node:test");
const { envSetting } = require("../src/lib/forge3d-compat.cjs");

test("a setting is read under the new name, then under Forge3D's", () => {
  assert.equal(envSetting("CODEX_EXE", { DIMENSIO_CODEX_EXE: "D:/new.exe", FORGE3D_CODEX_EXE: "D:/old.exe" }), "D:/new.exe");
  assert.equal(envSetting("CODEX_EXE", { FORGE3D_CODEX_EXE: "D:/old.exe" }), "D:/old.exe");
  assert.equal(envSetting("CODEX_EXE", { DIMENSIO_CODEX_EXE: "", FORGE3D_CODEX_EXE: "D:/old.exe" }), "D:/old.exe");
  assert.equal(envSetting("CODEX_EXE", {}), undefined);
});
