"use strict";

const assert = require("node:assert/strict");
const { EventEmitter } = require("node:events");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { WSL_MODELS_ROOT, detectWslModelsDirectory, findCodexExecutable, primeGodotProject } = require("../src/lib/runtime.cjs");

test("primes a fresh Godot project class cache once", async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dimensio-godot-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const godot = path.join(root, "godot.exe");
  const project = path.join(root, "project");
  fs.writeFileSync(godot, "test");
  fs.mkdirSync(project);
  fs.writeFileSync(path.join(project, "project.godot"), "[application]\n");
  let spawns = 0;
  const spawnProcess = (_executable, args) => {
    spawns += 1;
    assert.deepEqual(args, ["--headless", "--editor", "--path", project, "--import", "--quit"]);
    const child = new EventEmitter();
    child.kill = () => {};
    setImmediate(() => {
      const cache = path.join(project, ".godot", "global_script_class_cache.cfg");
      fs.mkdirSync(path.dirname(cache), { recursive: true });
      fs.writeFileSync(cache, "classes");
      child.emit("exit", 0);
    });
    return child;
  };
  const runtimeState = { godot: project };
  const first = await primeGodotProject(runtimeState, godot, { spawnProcess, timeoutMs: 1000 });
  const second = await primeGodotProject(runtimeState, godot, { spawnProcess, timeoutMs: 1000 });
  assert.equal(first.ready, true);
  assert.equal(first.cached, false);
  assert.equal(second.cached, true);
  assert.equal(spawns, 1);
});

test("resolves the default local model directory once for child tool calls", () => {
  const spawnProcess = (_command, args) => {
    assert.deepEqual(args, ["--exec", "sh", "-lc", WSL_MODELS_ROOT]);
    return { status: 0, stdout: "/home/george/.local/share/dimensio/models" };
  };
  assert.equal(detectWslModelsDirectory("wsl.exe", { spawnProcess }), "/home/george/.local/share/dimensio/models");
  // Models Forge3D installed are used where they are when Dimensio's folder is not there.
  assert.match(WSL_MODELS_ROOT, /\[ -d "\$root" \] \|\| \[ ! -d "\$HOME\/\.local\/share\/forge3d\/models" \] \|\| root="\$HOME\/\.local\/share\/forge3d\/models"/);
});

test("Codex discovery prefers the spawnable local app binary over WindowsApps PATH entries", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dimensio-codex-"));
  const localAppData = path.join(root, "LocalAppData");
  const executable = path.join(localAppData, "OpenAI", "Codex", "bin", "current", "codex.exe");
  fs.mkdirSync(path.dirname(executable), { recursive: true });
  fs.writeFileSync(executable, "test");
  const originalLocalAppData = process.env.LOCALAPPDATA;
  const overrides = ["DIMENSIO_CODEX_EXE", "FORGE3D_CODEX_EXE"];
  const original = Object.fromEntries(overrides.map((name) => [name, process.env[name]]));
  try {
    process.env.LOCALAPPDATA = localAppData;
    for (const name of overrides) delete process.env[name];
    assert.equal(findCodexExecutable(), executable);
  } finally {
    if (originalLocalAppData === undefined) delete process.env.LOCALAPPDATA;
    else process.env.LOCALAPPDATA = originalLocalAppData;
    for (const name of overrides) {
      if (original[name] === undefined) delete process.env[name];
      else process.env[name] = original[name];
    }
    fs.rmSync(root, { recursive: true, force: true });
  }
});