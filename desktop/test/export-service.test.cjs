"use strict";

const assert = require("node:assert/strict");
const { EventEmitter } = require("node:events");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { exportArtifact, exportFormatsForArtifact } = require("../src/lib/export-service.cjs");

test("Gaussian artifacts offer a truthful Blender package instead of mesh formats", () => {
  const formats = exportFormatsForArtifact({ path: "candidate.splat", preview_role: "gaussian-splat" });
  assert.deepEqual(formats.map((item) => item.id), ["blend"]);
  assert.match(formats[0].label, /splat package/i);
});

test("mesh artifacts offer common interchange formats", () => {
  const formats = exportFormatsForArtifact({ path: "proxy.glb", preview_role: "model" });
  assert.deepEqual(formats.map((item) => item.id), ["blend", "glb", "gltf", "fbx", "obj", "ply", "stl", "usd"]);
});

test("exports use a new versioned directory and preserve prior output", async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "forge3d-export-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const blender = path.join(root, "blender.exe");
  const source = path.join(root, "proxy.glb");
  const toolkit = path.join(root, "toolkit");
  fs.writeFileSync(blender, "test");
  fs.writeFileSync(source, "model");
  fs.mkdirSync(path.join(toolkit, "blender"), { recursive: true });
  fs.writeFileSync(path.join(toolkit, "blender", "export_asset.py"), "# test");
  const spawnProcess = (_command, args) => {
    const child = new EventEmitter();
    child.stdout = new EventEmitter();
    child.stderr = new EventEmitter();
    child.kill = () => {};
    setImmediate(() => {
      const separator = args.indexOf("--");
      fs.writeFileSync(args[separator + 2], "exported");
      fs.writeFileSync(args[separator + 3], JSON.stringify({ status: "completed" }));
      child.emit("exit", 0);
    });
    return child;
  };
  const request = {
    source,
    artifact: { name: "proxy.glb", path: "proxy.glb", preview_role: "model" },
    runDirectory: root,
    format: "obj",
    blender,
    toolkitRoot: toolkit,
    spawnProcess,
  };
  const first = await exportArtifact(request);
  const second = await exportArtifact(request);
  assert.match(first.relativePath, /proxy-obj-v001\/proxy\.obj$/);
  assert.match(second.relativePath, /proxy-obj-v002\/proxy\.obj$/);
  assert.equal(fs.readFileSync(first.path, "utf8"), "exported");
});
