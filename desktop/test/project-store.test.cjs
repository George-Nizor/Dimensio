"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { RunStore } = require("../src/lib/run-store.cjs");
const {
  PROJECT_FORMAT,
  RecentProjects,
  adoptLegacyLibrary,
  createScratch,
  hasRuns,
  layoutForSavePath,
  materializeProject,
  newManifest,
  projectFromArgv,
  readProject,
  recoverableScratch,
  retireScratch,
  runsRoot,
  SAVED_MARKER,
  sameSettings,
  sanitizeView,
  scratchFolder,
  windowTitle,
  writeProject,
  writeProjectView,
} = require("../src/lib/project-store.cjs");

const main = fs.readFileSync(path.join(__dirname, "..", "src", "main.cjs"), "utf8");
const body = (name) => {
  const start = main.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `main.cjs has ${name}`);
  return main.slice(start, main.indexOf("\n}\n", start));
};

function temporaryDirectory(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "forge3d-project-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

async function addRun(folder, prompt = "A water bottle") {
  const store = new RunStore(runsRoot(folder));
  return store.create({ prompt });
}

test("a project manifest round-trips its settings and view and rejects foreign JSON", (t) => {
  const root = temporaryDirectory(t);
  const file = path.join(root, "Bottle.forge3d");
  const manifest = newManifest({ settings: { workflow: "gaussian-splat", quality: "draft", bogus: "x" }, appVersion: "0.3.0" });
  writeProject(file, { ...manifest, view: { selected_run_id: "11111111-2222-3333-4444-555555555555", selected_artifact: "out/model.glb" } });
  const read = readProject(file);
  assert.equal(read.format, PROJECT_FORMAT);
  assert.equal(read.project_id, manifest.project_id);
  assert.deepEqual(read.settings, { workflow: "gaussian-splat", quality: "draft" });
  assert.equal(read.view.selected_artifact, "out/model.glb");
  assert.equal(read.runs_directory, "runs");

  fs.writeFileSync(path.join(root, "other.forge3d"), JSON.stringify({ hello: "world" }));
  assert.throws(() => readProject(path.join(root, "other.forge3d")), /Not a Forge3D project/);
  fs.writeFileSync(path.join(root, "escape.forge3d"), JSON.stringify({ ...manifest, runs_directory: "../elsewhere" }));
  assert.throws(() => readProject(path.join(root, "escape.forge3d")), /Unsupported runs directory/);
  fs.writeFileSync(path.join(root, "notes.json"), "{}");
  assert.throws(() => readProject(path.join(root, "notes.json")), /end in \.forge3d/);
});

test("the view keeps only a run id and a relative artifact path", () => {
  assert.deepEqual(sanitizeView({ selected_run_id: "../../etc", selected_artifact: "/abs/file.glb" }), { selected_run_id: null, selected_artifact: null });
});

test("settings compare by value, ignoring unknown keys", () => {
  assert.equal(sameSettings({ workflow: "auto", extra: 1 }, { workflow: "auto" }), true);
  assert.equal(sameSettings({ workflow: "auto" }, { workflow: "rig" }), false);
});

test("a save path becomes its own project folder unless it already is one", (t) => {
  const root = temporaryDirectory(t);
  assert.deepEqual(layoutForSavePath(path.join(root, "Bottle.forge3d")), {
    folder: path.join(root, "Bottle"), file: path.join(root, "Bottle", "Bottle.forge3d"), name: "Bottle",
  });
  // The extension is added when the dialog returns a bare name.
  assert.equal(layoutForSavePath(path.join(root, "Spoon")).file, path.join(root, "Spoon", "Spoon.forge3d"));
  // Saving into an empty folder of the same name uses that folder.
  fs.mkdirSync(path.join(root, "Pod"));
  assert.equal(layoutForSavePath(path.join(root, "Pod", "Pod.forge3d")).folder, path.join(root, "Pod"));
  // A non-empty folder of that name is never mixed into.
  fs.mkdirSync(path.join(root, "Taken"));
  fs.writeFileSync(path.join(root, "Taken", "readme.txt"), "mine");
  assert.throws(() => layoutForSavePath(path.join(root, "Taken.forge3d")), /already exists/);
  assert.throws(() => layoutForSavePath("relative.forge3d"), /absolute/);
});

test("saving an untitled project moves its runs into place and leaves the scratch folder empty", async (t) => {
  const root = temporaryDirectory(t);
  const scratch = createScratch(path.join(root, "state"));
  const run = await addRun(scratch);
  assert.equal(hasRuns(scratch), true);
  const layout = layoutForSavePath(path.join(root, "Projects", "Bottle.forge3d"));
  const manifest = materializeProject(layout, { sourceFolder: scratch, move: true, manifest: newManifest({ settings: { quality: "draft" } }) });
  assert.equal(manifest.settings.quality, "draft");
  assert.equal(hasRuns(scratch), false);
  const moved = new RunStore(runsRoot(layout.folder));
  assert.equal(moved.find(run.run_id).manifest.prompt, "A water bottle");
  assert.equal(readProject(layout.file).project_id, manifest.project_id);
});

test("Save As of a saved project copies it and keeps the original", async (t) => {
  const root = temporaryDirectory(t);
  const original = layoutForSavePath(path.join(root, "Bottle.forge3d"));
  materializeProject(original, { manifest: newManifest() });
  const run = await addRun(original.folder);
  const copy = layoutForSavePath(path.join(root, "Bottle copy.forge3d"));
  materializeProject(copy, { sourceFolder: original.folder, move: false, manifest: newManifest() });
  assert.equal(new RunStore(runsRoot(original.folder)).find(run.run_id).manifest.run_id, run.run_id);
  assert.equal(new RunStore(runsRoot(copy.folder)).find(run.run_id).manifest.run_id, run.run_id);
});

test("crash leftovers: empty untitled folders are pruned and ones with runs are offered back", async (t) => {
  const state = path.join(temporaryDirectory(t), "state");
  const empty = createScratch(state);
  const kept = createScratch(state);
  const current = createScratch(state);
  await addRun(kept);
  await addRun(current);
  const found = recoverableScratch(state, { exclude: current });
  assert.deepEqual(found.map((item) => item.folder), [kept]);
  assert.equal(fs.existsSync(empty), false);
  assert.equal(fs.existsSync(current), true);
  assert.equal(scratchFolder(state, found[0].id), kept);
  assert.throws(() => scratchFolder(state, "../../escape"), /Invalid/);
});

test("the earlier run library becomes a project once, in place", async (t) => {
  const library = path.join(temporaryDirectory(t), "Forge3D");
  assert.equal(adoptLegacyLibrary(library), null);
  await addRun(library, "Water bottle");
  const file = adoptLegacyLibrary(library, { appVersion: "0.3.0" });
  assert.equal(path.basename(file), "Earlier runs.forge3d");
  assert.equal(readProject(file).runs_directory, "runs");
  assert.equal(new RunStore(runsRoot(library)).list()[0].prompt, "Water bottle");
  assert.equal(adoptLegacyLibrary(library), file, "a second call finds the same manifest instead of writing another");
});

test("recent projects are per user, newest first, capped, and report missing files", (t) => {
  const root = temporaryDirectory(t);
  const recent = new RecentProjects(path.join(root, "config", "recent-projects.json"), { limit: 3 });
  assert.deepEqual(recent.list(), []);
  const files = ["A", "B", "C", "D"].map((name) => {
    const file = path.join(root, name, `${name}.forge3d`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, "{}");
    return file;
  });
  for (const file of files) recent.add(file);
  recent.add(files[1]);
  assert.deepEqual(recent.list().map((item) => item.name), ["B", "D", "C"]);
  fs.rmSync(files[3]);
  assert.equal(recent.list().find((item) => item.name === "D").missing, true);
  recent.remove(files[1]);
  assert.deepEqual(recent.list().map((item) => item.name), ["D", "C"]);
  recent.clear();
  assert.deepEqual(recent.list(), []);
});

test("launch opens the start screen unless the person asked to reopen the last project", (t) => {
  const root = temporaryDirectory(t);
  const recent = new RecentProjects(path.join(root, "recent.json"));
  const file = path.join(root, "Bottle.forge3d");
  fs.writeFileSync(file, "{}");
  recent.add(file);
  assert.equal(recent.launchProject(), null);
  assert.deepEqual(recent.setPreferences({ reopenLast: true }), { reopenLast: true });
  assert.equal(recent.launchProject(), file);
  fs.rmSync(file);
  assert.equal(recent.launchProject(), null, "a vanished project falls back to the start screen");
  assert.equal(recent.legacyAdopted(), false);
  recent.markLegacyAdopted();
  assert.equal(recent.legacyAdopted(), true);
});

test("the window title names the project and marks unsaved changes", () => {
  assert.equal(windowTitle(null), "Forge3D");
  assert.equal(windowTitle({ name: "Bottle", dirty: false }), "Bottle — Forge3D");
  assert.equal(windowTitle({ name: "Bottle", dirty: true }), "● Bottle — Forge3D");
});

test("a .forge3d path on the command line is the project to open", (t) => {
  const root = temporaryDirectory(t);
  const file = path.join(root, "Bottle.forge3d");
  fs.writeFileSync(file, "{}");
  assert.equal(projectFromArgv([".", "--inspect", file]), file);
  assert.equal(projectFromArgv(["relative.forge3d", path.join(root, "missing.forge3d")]), null);
});

/* ── project fixes ─────────────────────────────────────────────── */

test("fix 1: the selection is written to a saved project as it changes, without its unsaved settings", (t) => {
  const root = temporaryDirectory(t);
  const file = path.join(root, "Bottle", "Bottle.forge3d");
  fs.mkdirSync(path.dirname(file));
  const saved = writeProject(file, newManifest({ settings: { quality: "draft" } }));
  const runId = "0d8a7c2e-3f4b-4c5d-8e9f-0a1b2c3d4e5f";
  const next = writeProjectView(file, saved, { selected_run_id: runId, selected_artifact: "out/a.glb" });
  const disk = readProject(file);
  assert.deepEqual(disk.view, { selected_run_id: runId, selected_artifact: "out/a.glb" });
  assert.deepEqual(disk.settings, { quality: "draft" }, "the saved settings, not whatever is unsaved");
  assert.equal(next.project_id, saved.project_id);
  // main.cjs writes it from the project-view handler for saved projects.
  assert.match(main, /handle\("forge3d:project-view"[^]*?writeProjectView\(project\.file, project\.manifest, project\.view\)/);
});

test("fix 2: saving an untitled project stops the agent before moving its folder", () => {
  const save = body("saveProjectAs");
  const release = save.indexOf("await releaseProjectFolder()");
  assert.ok(release > 0, "the agent is stopped");
  assert.ok(release < save.indexOf("materializeProject("), "before the folder moves");
  assert.match(body("releaseProjectFolder"), /agents\.closeAll\(\)/);
  assert.match(save, /retireScratch\(source\.folder, layout\.file\)/);
});

test("fix 2: a scratch folder that could not be removed after saving is never offered as unsaved work", async (t) => {
  const state = temporaryDirectory(t);
  const scratch = createScratch(state);
  await addRun(scratch);
  // Simulate the Windows case: the copy is in place but the scratch folder stays (a file in it was in use).
  fs.writeFileSync(path.join(scratch, SAVED_MARKER), JSON.stringify({ saved_to: "D:\\Art\\Bottle\\Bottle.forge3d" }));
  assert.deepEqual(recoverableScratch(state), []);
  assert.equal(fs.existsSync(scratch), false, "and it is cleared once it can be");

  const removable = createScratch(state);
  await addRun(removable);
  assert.equal(retireScratch(removable, "D:\\x.forge3d"), true);
  assert.equal(fs.existsSync(removable), false);
});
