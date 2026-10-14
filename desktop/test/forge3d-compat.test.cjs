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

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { carryForge3DSettings, legacyFolders } = require("../src/lib/forge3d-compat.cjs");

function machine(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dimensio-compat-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const local = path.join(root, "AppData", "Local");
  const roaming = path.join(root, "AppData", "Roaming");
  const documents = path.join(root, "Documents");
  const write = (file, value) => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, typeof value === "string" ? value : JSON.stringify(value));
  };
  return {
    from: legacyFolders({ localAppData: local, appData: roaming, documents }),
    to: { stateRoot: path.join(local, "Instrumenta", "Dimensio"), userData: path.join(roaming, "Dimensio") },
    write,
  };
}

test("Forge3D's folders are the ones it used", () => {
  const folders = legacyFolders({ localAppData: "L", appData: "R", documents: "D" });
  assert.deepEqual(folders, { stateRoot: path.join("L", "Instrumenta", "Forge3D"), userData: path.join("R", "Forge3D"), library: path.join("D", "Forge3D") });
});

test("the first start copies the agent choice, the recent list and the course settings, and leaves Forge3D's as they were", (t) => {
  const { from, to, write } = machine(t);
  const settings = { schema_version: 1, agent: "codex" };
  const recent = { schema_version: 1, projects: [{ path: "C:\\Users\\G\\Documents\\Forge3D\\Projects\\Lamp\\Lamp.forge3d" }], reopen_last: true, legacy_adopted: true };
  const course = { blenderPath: "C:\\Blender\\blender.exe" };
  write(path.join(from.stateRoot, "config", "settings.json"), settings);
  write(path.join(from.stateRoot, "config", "recent-projects.json"), recent);
  write(path.join(from.userData, "course.json"), course);

  const carried = carryForge3DSettings({ from, to });
  assert.equal(carried.length, 3);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(to.stateRoot, "config", "settings.json"), "utf8")), settings);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(to.stateRoot, "config", "recent-projects.json"), "utf8")), recent);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(to.userData, "course.json"), "utf8")), course);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(from.stateRoot, "config", "settings.json"), "utf8")), settings, "the original stays");
  assert.ok(fs.existsSync(path.join(from.userData, "course.json")));
});

test("later starts keep Dimensio's own settings, and damaged or missing files are skipped", (t) => {
  const { from, to, write } = machine(t);
  write(path.join(from.stateRoot, "config", "settings.json"), { agent: "codex" });
  write(path.join(to.stateRoot, "config", "settings.json"), { agent: "claude" });
  write(path.join(from.stateRoot, "config", "recent-projects.json"), "{ not json");
  assert.deepEqual(carryForge3DSettings({ from, to }), []);
  assert.equal(JSON.parse(fs.readFileSync(path.join(to.stateRoot, "config", "settings.json"), "utf8")).agent, "claude");
  assert.equal(fs.existsSync(path.join(to.stateRoot, "config", "recent-projects.json")), false);
  assert.deepEqual(carryForge3DSettings({ from: legacyFolders({ localAppData: "/nowhere", appData: "/nowhere", documents: "/nowhere" }), to }), []);
});

test("main.cjs carries the settings across before it reads them, and adopts Forge3D's run library", () => {
  const main = fs.readFileSync(path.join(__dirname, "..", "src", "main.cjs"), "utf8");
  const ready = main.slice(main.indexOf("app.whenReady()"));
  assert.match(ready, /path\.join\(localAppData, "Instrumenta", "Dimensio"\)/);
  assert.ok(ready.indexOf("carryForge3DSettings(") < ready.indexOf("new RecentProjects("));
  assert.ok(ready.indexOf("carryForge3DSettings(") < ready.indexOf("new AgentSettings("));
  assert.match(ready, /adoptLegacyLibrary\(forge3d\.library/);
  assert.match(main, /path\.join\(app\.getPath\("documents"\), "Dimensio", "Projects"\)/);
});
