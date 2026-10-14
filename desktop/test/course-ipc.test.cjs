"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { CHANNELS, UNAVAILABLE, atLeast, createCourseService, registerCourseIpc } = require("../src/lib/course-ipc.cjs");

function sandbox() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dimensio-course-ipc-"));
  const documents = path.join(root, "Documents");
  const renderer = path.join(root, "dist");
  fs.mkdirSync(path.join(renderer, "reference", "models", "stool"), { recursive: true });
  fs.writeFileSync(path.join(renderer, "reference", "models", "stool", "stool.blend"), "example");
  fs.writeFileSync(path.join(renderer, "reference", "models", "stool", "front.png"), "picture");
  const model = path.join(root, "work", "stool.blend");
  fs.mkdirSync(path.dirname(model), { recursive: true });
  fs.writeFileSync(model, "learner");
  const app = { getPath: (name) => (name === "documents" ? documents : path.join(root, "userData")) };
  return { root, documents, renderer, model, app };
}

// A stand-in for blender-measure.cjs with the interface feat/measure finished with: a synchronous
// findBlender that reads blenderPath from the settings file, and promises that reject with a plain
// message and a code.
function fakeMeasure(calls, version = "5.2.2") {
  return {
    findBlender: ({ settingsPath }) => {
      calls.push(["findBlender", settingsPath]);
      let saved = null;
      try { saved = JSON.parse(fs.readFileSync(settingsPath, "utf8")).blenderPath; } catch {}
      return { ok: true, path: saved || "C:/Blender/blender.exe", version, reason: null, fix: null };
    },
    measure: async (options) => {
      calls.push(["measure", options]);
      fs.writeFileSync(path.join(options.outDir, "persp.png"), Buffer.from([1, 2, 3]));
      fs.writeFileSync(path.join(options.outDir, "front-overlay.png"), Buffer.from([4, 5]));
      return {
        format: 1, objects: [], totals: { objects: 0 }, outDir: options.outDir,
        renders: { persp: path.join(options.outDir, "persp.png"), front: path.join(options.outDir, "missing.png") },
        silhouette: { front: { match: 0.9, overlay: path.join(options.outDir, "front-overlay.png") } },
      };
    },
    makeStarter: async (options) => {
      calls.push(["makeStarter", options]);
      if (!options.overwrite && fs.existsSync(options.outFile)) throw Object.assign(new Error(`${options.outFile} already exists.`), { code: "exists" });
      fs.writeFileSync(options.outFile, `starter ${calls.length}`);
      return options.outFile;
    },
    openInBlender: async (options) => { calls.push(["openInBlender", options]); },
  };
}

test("a missing measuring module is a sentence the course app can show", async () => {
  const box = sandbox();
  const missing = () => { throw new Error(UNAVAILABLE); };
  const service = createCourseService({ app: box.app, rendererRoots: [box.renderer], loadMeasure: missing });
  assert.deepEqual(await service.blenderStatus(), { ok: false, path: null, version: null, supported: false, reason: "Measuring isn't available in this build.", fix: "" });
  await assert.rejects(service.measure(box.model), { message: UNAVAILABLE });
  await assert.rejects(service.makeStarter("crooked-table"), { message: UNAVAILABLE });
  await assert.rejects(service.openInBlender(), { message: UNAVAILABLE });
});

test("the real loader reports the missing module the same way", async () => {
  if (fs.existsSync(path.join(__dirname, "..", "src", "lib", "blender-measure.cjs"))) return;
  const box = sandbox();
  const service = createCourseService({ app: box.app, rendererRoots: [box.renderer] });
  await assert.rejects(service.measure(box.model), { message: UNAVAILABLE });
});

test("Blender's status says whether it is 5.2 or later", async () => {
  const box = sandbox();
  const service = createCourseService({ app: box.app, rendererRoots: [box.renderer], loadMeasure: () => fakeMeasure([], "4.2.1") });
  const status = await service.blenderStatus();
  assert.equal(status.ok, true);
  assert.equal(status.supported, false);
  assert.equal(atLeast("5.2.2", 5, 2), true);
  assert.equal(atLeast("5.10", 5, 2), true);
  assert.equal(atLeast("6.0", 5, 2), true);
  assert.equal(atLeast("5.1.9", 5, 2), false);
  assert.equal(atLeast(null, 5, 2), false);
});

test("measuring returns the report with its pictures as bytes and removes Blender's folder", async () => {
  const box = sandbox();
  const calls = [];
  const service = createCourseService({ app: box.app, rendererRoots: [box.renderer], loadMeasure: () => fakeMeasure(calls) });
  const result = await service.measure(box.model, { reference: "reference/models/stool/stool.blend", views: ["front", "persp", "sideways"] });
  const [, options] = calls.find(([name]) => name === "measure");
  assert.equal(options.file, box.model);
  assert.deepEqual(options.views, ["front", "persp"]);
  assert.equal(options.reference, path.join(box.documents, "Dimensio", "Course", "Examples", "stool.blend"));
  assert.equal(fs.readFileSync(options.reference, "utf8"), "example");
  assert.ok(options.timeoutMs > 0);
  assert.deepEqual([...result.renders.persp], [1, 2, 3]);
  assert.equal(result.renders.front, undefined);
  assert.deepEqual([...result.overlays.front], [4, 5]);
  assert.equal(result.report.renders.persp, "persp.png");
  assert.equal(result.report.silhouette.front.overlay, "front-overlay.png");
  assert.equal(result.report.outDir, undefined);
  assert.equal(fs.existsSync(options.outDir), false);
});

test("only .blend files on this computer and the course's own examples are accepted", async () => {
  const box = sandbox();
  const service = createCourseService({ app: box.app, rendererRoots: [box.renderer], loadMeasure: () => fakeMeasure([]) });
  await assert.rejects(service.measure("relative/stool.blend"), /isn't a \.blend file/);
  await assert.rejects(service.measure(path.join(box.root, "notes.txt")), /isn't a \.blend file/);
  await assert.rejects(service.measure(path.join(box.root, "gone.blend")), /isn't there any more/);
  await assert.rejects(service.openInBlender("reference/../../secret.blend"), /isn't part of the course/);
  await assert.rejects(service.openInBlender("reference/models/none.blend"), /missing from this build/);
  await assert.rejects(service.makeStarter("../evil"), /isn't part of the course/);
  await assert.rejects(service.reveal(path.join(box.root, "work")), /isn't a \.blend file/);
});

test("an exercise's starter file is reused until the learner starts over", async () => {
  const box = sandbox();
  const calls = [];
  const service = createCourseService({ app: box.app, rendererRoots: [box.renderer], loadMeasure: () => fakeMeasure(calls) });
  const folder = path.join(box.documents, "Dimensio", "Course");
  const first = await service.makeStarter("unapplied-scale", { name: "apply-the-scale" });
  assert.equal(first, path.join(folder, "apply-the-scale.blend"));
  fs.writeFileSync(first, "the learner's work");
  const again = await service.makeStarter("unapplied-scale", { name: "apply-the-scale" });
  assert.equal(again, first);
  assert.equal(fs.readFileSync(first, "utf8"), "the learner's work");
  await service.makeStarter("unapplied-scale", { name: "apply-the-scale", overwrite: true });
  assert.match(fs.readFileSync(first, "utf8"), /^starter/);
  assert.deepEqual(calls.filter(([name]) => name === "makeStarter").map(([, options]) => options.overwrite), [false, true]);
  assert.equal(service.courseFolder(), folder);
});

test("starter options name the course's examples by path and are copied out for Blender", async () => {
  const box = sandbox();
  const calls = [];
  const service = createCourseService({ app: box.app, rendererRoots: [box.renderer], loadMeasure: () => fakeMeasure(calls) });
  await service.makeStarter("copy-reference", { name: "cube-stool", options: { reference: "reference/models/stool/stool.blend", height: 0.47 } });
  await service.makeStarter("reference-images", { name: "block-out", options: { imageFront: "reference/models/stool/front.png" } });
  const examples = path.join(box.documents, "Dimensio", "Course", "Examples");
  const options = calls.filter(([name]) => name === "makeStarter").map(([, o]) => o.options);
  assert.deepEqual(options, [{ reference: path.join(examples, "stool.blend"), height: 0.47 }, { imageFront: path.join(examples, "front.png") }]);
  await assert.rejects(service.makeStarter("copy-reference", { name: "x", options: { reference: "C:/Windows/win.ini" } }), /aren't valid/);
  await assert.rejects(service.makeStarter("copy-reference", { name: "x", options: { "--force": true } }), /aren't valid/);
  await assert.rejects(service.makeStarter("copy-reference", { name: "../x" }), /isn't part of the course/);
});

test("the Blender chosen in Settings is read from the course settings file", async () => {
  const box = sandbox();
  const calls = [];
  const dialog = { showOpenDialog: async () => ({ canceled: false, filePaths: ["D:/Apps/Blender 5.2/blender.exe"] }) };
  const service = createCourseService({ app: box.app, dialog, rendererRoots: [box.renderer], loadMeasure: () => fakeMeasure(calls) });
  const status = await service.chooseBlender();
  assert.equal(status.path, "D:/Apps/Blender 5.2/blender.exe");
  assert.equal(status.supported, true);
  assert.equal(calls[0][1], path.join(box.root, "userData", "course.json"));
});

test("opening Blender: a file through the measuring module, a new scene directly", async () => {
  const box = sandbox();
  const calls = [];
  const spawned = [];
  const spawn = (command, args, options) => { spawned.push([command, args, options.detached]); return { on() {}, unref() {} }; };
  const service = createCourseService({ app: box.app, rendererRoots: [box.renderer], loadMeasure: () => fakeMeasure(calls), spawn });
  await service.openInBlender(box.model);
  await service.openInBlender("reference/models/stool/stool.blend");
  await service.openInBlender();
  const opened = calls.filter(([name]) => name === "openInBlender").map(([, options]) => options.file);
  assert.deepEqual(opened, [box.model, path.join(box.documents, "Dimensio", "Course", "Examples", "stool.blend")]);
  assert.deepEqual(spawned, [["C:/Blender/blender.exe", [], true]]);
});

test("every channel goes through main's trusted handle()", () => {
  const box = sandbox();
  const registered = [];
  registerCourseIpc({ handle: (channel) => registered.push(channel), app: box.app, dialog: {}, shell: {}, rendererRoots: [box.renderer] });
  assert.deepEqual(registered.sort(), Object.values(CHANNELS).sort());
});
