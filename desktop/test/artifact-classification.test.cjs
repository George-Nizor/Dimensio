"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { scanArtifacts } = require("../src/lib/artifacts.cjs");

test("artifact scanning distinguishes Gaussian and polygon PLY files", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "forge3d-artifacts-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, "gaussian.ply"), [
    "ply", "format binary_little_endian 1.0", "element vertex 0",
    "property float f_dc_0", "property float opacity", "property float scale_0", "property float rot_0", "end_header", "",
  ].join("\n"));
  fs.writeFileSync(path.join(root, "mesh.ply"), [
    "ply", "format ascii 1.0", "element vertex 0",
    "property float x", "property float y", "property float z", "end_header", "",
  ].join("\n"));
  const artifacts = scanArtifacts(root);
  assert.equal(artifacts.find((item) => item.name === "gaussian.ply").preview_role, "gaussian-splat");
  assert.equal(artifacts.find((item) => item.name === "mesh.ply").preview_role, "model");
});
