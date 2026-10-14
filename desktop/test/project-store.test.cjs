"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { RunStore } = require("../src/lib/run-store.cjs");
const {
  LEGACY_PROJECT_FORMAT,
  PROJECT_FORMAT,
  RecentProjects,
  adoptLegacyLibrary,
  createScratch,
  hasRuns,
  layoutForSavePath,
  materializeProject,
  newManifest,
  projectFromArgv,
  projectStem,
  projectTrashTargets,
  readProject,
  recoverableScratch,
  renameProject,
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
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dimensio-project-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

async function addRun(folder, prompt = "A water bottle") {
  const store = new RunStore(runsRoot(folder));
  return store.create({ prompt });
}

test("a project manifest round-trips its settings and view and rejects foreign JSON", (t) => {
  const root = temporaryDirectory(t);
  const file = path.join(root, "Bottle.dimensio");
  const manifest = newManifest({ settings: { workflow: "gaussian-splat", quality: "draft", bogus: "x" }, appVersion: "0.4.0" });
  writeProject(file, { ...manifest, view: { selected_run_id: "11111111-2222-3333-4444-555555555555", selected_artifact: "out/model.glb" } });
  const read = readProject(file);
  assert.equal(read.format, PROJECT_FORMAT);
  assert.equal(read.project_id, manifest.project_id);
  assert.deepEqual(read.settings, { workflow: "gaussian-splat", quality: "draft" });
  assert.equal(read.view.selected_artifact, "out/model.glb");
  assert.equal(read.runs_directory, "runs");

  fs.writeFileSync(path.join(root, "other.dimensio"), JSON.stringify({ hello: "world" }));
  assert.throws(() => readProject(path.join(root, "other.dimensio")), /Not a Dimensio project/);
  fs.writeFileSync(path.join(root, "escape.dimensio"), JSON.stringify({ ...manifest, runs_directory: "../elsewhere" }));
  assert.throws(() => readProject(path.join(root, "escape.dimensio")), /Unsupported runs directory/);
  fs.writeFileSync(path.join(root, "notes.json"), "{}");
  assert.throws(() => readProject(path.join(root, "notes.json")), /end in \.dimensio/);
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
  assert.deepEqual(layoutForSavePath(path.join(root, "Bottle.dimensio")), {
    folder: path.join(root, "Bottle"), file: path.join(root, "Bottle", "Bottle.dimensio"), name: "Bottle",
  });
  // The extension is added when the dialog returns a bare name.
  assert.equal(layoutForSavePath(path.join(root, "Spoon")).file, path.join(root, "Spoon", "Spoon.dimensio"));
  // Saving into an empty folder of the same name uses that folder.
  fs.mkdirSync(path.join(root, "Pod"));
  assert.equal(layoutForSavePath(path.join(root, "Pod", "Pod.dimensio")).folder, path.join(root, "Pod"));
  // A non-empty folder of that name is never mixed into.
  fs.mkdirSync(path.join(root, "Taken"));
  fs.writeFileSync(path.join(root, "Taken", "readme.txt"), "mine");
  assert.throws(() => layoutForSavePath(path.join(root, "Taken.dimensio")), /already exists/);
  assert.throws(() => layoutForSavePath("relative.dimensio"), /absolute/);
});

test("saving an untitled project moves its runs into place and leaves the scratch folder empty", async (t) => {
  const root = temporaryDirectory(t);
  const scratch = createScratch(path.join(root, "state"));
  const run = await addRun(scratch);
  assert.equal(hasRuns(scratch), true);
  const layout = layoutForSavePath(path.join(root, "Projects", "Bottle.dimensio"));
  const manifest = materializeProject(layout, { sourceFolder: scratch, move: true, manifest: newManifest({ settings: { quality: "draft" } }) });
  assert.equal(manifest.settings.quality, "draft");
  assert.equal(hasRuns(scratch), false);
  const moved = new RunStore(runsRoot(layout.folder));
  assert.equal(moved.find(run.run_id).manifest.prompt, "A water bottle");
  assert.equal(readProject(layout.file).project_id, manifest.project_id);
});

test("Save As of a saved project copies it and keeps the original", async (t) => {
  const root = temporaryDirectory(t);
  const original = layoutForSavePath(path.join(root, "Bottle.dimensio"));
  materializeProject(original, { manifest: newManifest() });
  const run = await addRun(original.folder);
  const copy = layoutForSavePath(path.join(root, "Bottle copy.dimensio"));
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
  const file = adoptLegacyLibrary(library, { appVersion: "0.4.0" });
  assert.equal(path.basename(file), "Earlier runs.dimensio");
  assert.equal(readProject(file).runs_directory, "runs");
  assert.equal(new RunStore(runsRoot(library)).list()[0].prompt, "Water bottle");
  assert.equal(adoptLegacyLibrary(library), file, "a second call finds the same manifest instead of writing another");
});

test("recent projects are per user, newest first, capped, and report missing files", (t) => {
  const root = temporaryDirectory(t);
  const recent = new RecentProjects(path.join(root, "config", "recent-projects.json"), { limit: 3 });
  assert.deepEqual(recent.list(), []);
  const files = ["A", "B", "C", "D"].map((name) => {
    const file = path.join(root, name, `${name}.dimensio`);
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
  const file = path.join(root, "Bottle.dimensio");
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
  assert.equal(windowTitle(null), "Dimensio");
  assert.equal(windowTitle({ name: "Bottle", dirty: false }), "Bottle — Dimensio");
  assert.equal(windowTitle({ name: "Bottle", dirty: true }), "● Bottle — Dimensio");
});

test("a .dimensio path on the command line is the project to open", (t) => {
  const root = temporaryDirectory(t);
  const file = path.join(root, "Bottle.dimensio");
  fs.writeFileSync(file, "{}");
  assert.equal(projectFromArgv([".", "--inspect", file]), file);
  assert.equal(projectFromArgv(["relative.dimensio", path.join(root, "missing.dimensio")]), null);
});

/* ── project fixes ─────────────────────────────────────────────── */

test("fix 1: the selection is written to a saved project as it changes, without its unsaved settings", (t) => {
  const root = temporaryDirectory(t);
  const file = path.join(root, "Bottle", "Bottle.dimensio");
  fs.mkdirSync(path.dirname(file));
  const saved = writeProject(file, newManifest({ settings: { quality: "draft" } }));
  const runId = "0d8a7c2e-3f4b-4c5d-8e9f-0a1b2c3d4e5f";
  const next = writeProjectView(file, saved, { selected_run_id: runId, selected_artifact: "out/a.glb" });
  const disk = readProject(file);
  assert.deepEqual(disk.view, { selected_run_id: runId, selected_artifact: "out/a.glb" });
  assert.deepEqual(disk.settings, { quality: "draft" }, "the saved settings, not whatever is unsaved");
  assert.equal(next.project_id, saved.project_id);
  // main.cjs writes it from the project-view handler for saved projects.
  assert.match(main, /handle\("dimensio:project-view"[^]*?writeProjectView\(project\.file, project\.manifest, project\.view\)/);
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
  fs.writeFileSync(path.join(scratch, SAVED_MARKER), JSON.stringify({ saved_to: "D:\\Art\\Bottle\\Bottle.dimensio" }));
  assert.deepEqual(recoverableScratch(state), []);
  assert.equal(fs.existsSync(scratch), false, "and it is cleared once it can be");

  const removable = createScratch(state);
  await addRun(removable);
  assert.equal(retireScratch(removable, "D:\\x.dimensio"), true);
  assert.equal(fs.existsSync(removable), false);
});

test("fix 3: closing the window during a run always asks, even with nothing unsaved", () => {
  const { closeAction, stopRunQuestion } = require("../src/lib/close-guard.cjs");
  assert.equal(closeAction({ running: true, project: { untitled: false }, dirty: false }), "ask");
  assert.equal(closeAction({ running: false, project: { untitled: false }, dirty: false }), "close");
  assert.equal(closeAction({ running: false, project: { untitled: true }, dirty: true }), "ask");
  assert.equal(closeAction({ running: false, project: null }), "close");
  const question = stopRunQuestion({ agentName: "Claude Code", runName: "A brass lantern with a glass chimney and a handle on top that swings", doing: "closing Dimensio" });
  assert.equal(question.message, "Stop the run before closing Dimensio?");
  assert.match(question.detail, /^Claude Code is still working on "A brass lantern .*…"\. Stopping it keeps the files/);
  assert.deepEqual(question.buttons, ["Stop the run", "Cancel"]);
  assert.equal(question.cancelId, 1);
  assert.equal(question.defaultId, 1, "Enter does not stop a run");
  assert.doesNotMatch(JSON.stringify(question), /[“”—–]/);
  const close = body("onWindowClose");
  assert.match(close, /closeAction\(\{ running, project, dirty: projectDirty\(\) \}\)/);
  assert.ok(close.indexOf("confirmStopRun") < close.indexOf("confirmLeave"), "the run is asked about before saving");
  assert.match(body("stopActiveRun"), /setStatus\(job\.runId, "interrupted", reason\)/);
});

test("fix 4: renaming a project renames its file, and its folder when the folder has its name", (t) => {
  const root = temporaryDirectory(t);
  const file = path.join(root, "Bottle", "Bottle.dimensio");
  fs.mkdirSync(path.join(root, "Bottle", "runs"), { recursive: true });
  writeProject(file, newManifest());
  const renamed = renameProject(file, "  Glass bottle.dimensio ");
  assert.deepEqual(renamed, { file: path.join(root, "Glass bottle", "Glass bottle.dimensio"), folder: path.join(root, "Glass bottle"), name: "Glass bottle" });
  assert.equal(fs.existsSync(renamed.file), true);
  assert.equal(fs.existsSync(path.join(renamed.folder, "runs")), true);
  assert.equal(fs.existsSync(path.join(root, "Bottle")), false);
  assert.deepEqual(renameProject(renamed.file, "Glass bottle"), { file: renamed.file, folder: renamed.folder, name: "Glass bottle" });

  // A folder that does not carry the project's name (the adopted library) keeps its name.
  const library = path.join(root, "Forge3D");
  fs.mkdirSync(path.join(library, "Projects"), { recursive: true });
  const earlier = path.join(library, "Earlier runs.dimensio");
  writeProject(earlier, newManifest());
  assert.deepEqual(renameProject(earlier, "Old work"), { file: path.join(library, "Old work.dimensio"), folder: library, name: "Old work" });

  fs.mkdirSync(path.join(root, "Taken"));
  assert.throws(() => renameProject(renamed.file, "Taken"), /already exists/);
  assert.equal(fs.existsSync(renamed.file), true, "nothing moved");
  for (const bad of ["", "a/b", "x:y", "dots.", "..", " "]) assert.throws(() => projectStem(bad), /project name/);
});

test("fix 4: deleting a project trashes its folder when it holds only the project, else only the project's parts", (t) => {
  const root = temporaryDirectory(t);
  const file = path.join(root, "Bottle", "Bottle.dimensio");
  fs.mkdirSync(path.join(root, "Bottle", "runs"), { recursive: true });
  writeProject(file, newManifest());
  fs.writeFileSync(path.join(root, "Bottle", "desktop.ini"), "");
  assert.deepEqual(projectTrashTargets(file), { whole: true, targets: [path.join(root, "Bottle")] });

  const library = path.join(root, "Forge3D");
  fs.mkdirSync(path.join(library, "runs"), { recursive: true });
  fs.mkdirSync(path.join(library, "Projects"));
  const earlier = path.join(library, "Earlier runs.dimensio");
  writeProject(earlier, newManifest());
  assert.deepEqual(projectTrashTargets(earlier), { whole: false, targets: [earlier, path.join(library, "runs")] }, "Projects\\ beside it is never touched");

  const remove = body("deleteOpenProject");
  assert.match(remove, /showMessageBox/);
  assert.ok(remove.indexOf("showMessageBox") < remove.indexOf("shell.trashItem"), "asks before anything moves");
  assert.ok(remove.indexOf("releaseProjectFolder") < remove.indexOf("shell.trashItem"), "the agent is stopped first");
  assert.match(remove, /recentProjects\.remove\(file\)/);
  assert.match(body("renameOpenProject"), /releaseProjectFolder\(\)[^]*renameProject\(previous, payload\.name\)/);
});

test("fix 4: one Dimensio at a time; a second launch focuses the window and opens the project it names", (t) => {
  assert.match(main, /const singleInstance = app\.requestSingleInstanceLock\(\);\nif \(!singleInstance\) app\.quit\(\);/);
  assert.match(main, /app\.whenReady\(\)\.then\(async \(\) => \{\n  if \(!singleInstance\) return;/);
  assert.match(main, /app\.on\("second-instance", \(_event, argv\) => onSecondInstance\(argv\)\)/);
  const second = body("onSecondInstance");
  assert.match(second, /mainWindow\.focus\(\)/);
  assert.match(second, /projectFromArgv\(argv\.slice\(1\)\)[^]*openProject\(\{ path: file \}\)/);
  // The argv a second instance hands over carries Chromium switches; only an existing .dimensio path counts.
  const root = temporaryDirectory(t);
  const file = path.join(root, "Pod.dimensio");
  writeProject(file, newManifest());
  assert.equal(projectFromArgv(["--allow-file-access-from-files", "--original-process-start-time=1", file]), file);
  assert.equal(projectFromArgv(["--flag", path.join(root, "Gone.dimensio")]), null);
});

test("fix 5: Run checks the agent before it makes a run folder", () => {
  const handler = main.slice(main.indexOf('handle("dimensio:start-run"'), main.indexOf('handle("dimensio:continue-run"'));
  assert.ok(handler.indexOf("await ensureAgentReady()") > 0, "the agent is checked");
  assert.ok(handler.indexOf("await ensureAgentReady()") < handler.indexOf("store().create("), "before the run folder exists");
  assert.match(body("ensureAgentReady"), /driver\.prepare\(agentContext\(\)\)/);
});

test("fix 5: on opening a project, a run that never started fails with a reason and a live one is interrupted", async (t) => {
  const { NEVER_STARTED } = require("../src/lib/run-store.cjs");
  const root = temporaryDirectory(t);
  const store = new RunStore(path.join(root, "runs"));
  const stale = await store.create({ prompt: "A lantern" });
  const live = await store.create({ prompt: "A crate" });
  store.setStatus(live.run_id, "running");
  const done = await store.create({ prompt: "A barrel" });
  store.setStatus(done.run_id, "completed");
  const recovered = Object.fromEntries(store.recoverInterrupted().map((run) => [run.run_id, run]));
  assert.equal(recovered[stale.run_id].status, "failed");
  assert.equal(recovered[stale.run_id].failure, NEVER_STARTED);
  assert.match(NEVER_STARTED, /never started/);
  assert.equal(recovered[live.run_id].status, "interrupted");
  assert.equal(recovered[done.run_id], undefined);
  assert.equal(store.find(done.run_id).manifest.status, "completed");
});

/* ── projects Forge3D made ─────────────────────────────────── */

test("a Forge3D project opens as it is and keeps its .forge3d name and format when saved or renamed", (t) => {
  const root = temporaryDirectory(t);
  const file = path.join(root, "Lamp", "Lamp.forge3d");
  fs.mkdirSync(path.join(root, "Lamp", "runs"), { recursive: true });
  const manifest = { ...newManifest({ settings: { quality: "draft" } }), format: LEGACY_PROJECT_FORMAT };
  fs.writeFileSync(file, JSON.stringify(manifest));
  assert.equal(readProject(file).format, LEGACY_PROJECT_FORMAT);
  assert.equal(readProject(file).settings.quality, "draft");
  assert.equal(projectFromArgv([file]), file, "a double-clicked .forge3d opens");

  writeProject(file, { ...readProject(file), settings: { quality: "production" } });
  assert.equal(JSON.parse(fs.readFileSync(file, "utf8")).format, LEGACY_PROJECT_FORMAT, "Forge3D could still read it");
  writeProjectView(file, readProject(file), { selected_run_id: null, selected_artifact: "out/lamp.glb" });
  assert.equal(JSON.parse(fs.readFileSync(file, "utf8")).format, LEGACY_PROJECT_FORMAT);

  const renamed = renameProject(file, "Desk lamp");
  assert.deepEqual(renamed, { file: path.join(root, "Desk lamp", "Desk lamp.forge3d"), folder: path.join(root, "Desk lamp"), name: "Desk lamp" });

  // Save As makes a Dimensio project, whatever the name typed.
  assert.equal(layoutForSavePath(path.join(root, "Copy.forge3d")).file, path.join(root, "Copy", "Copy.dimensio"));
  assert.equal(projectStem("Copy.forge3d"), "Copy");
});

test("Forge3D's Earlier runs project is used as it is, not written again", async (t) => {
  const library = path.join(temporaryDirectory(t), "Forge3D");
  await addRun(library, "Water bottle");
  const forge3dManifest = path.join(library, "Earlier runs.forge3d");
  fs.writeFileSync(forge3dManifest, JSON.stringify({ ...newManifest(), format: LEGACY_PROJECT_FORMAT }));
  assert.equal(adoptLegacyLibrary(library), forge3dManifest);
  assert.deepEqual(fs.readdirSync(library).sort(), ["Earlier runs.forge3d", "runs"]);
});
