"use strict";

// The course app's bridge to Blender, answered here and exposed by the preload as
// window.dimensio.course (docs/course/PLAN.md, "The bridge between the app and Blender").
//
// The work in Blender is done by ./blender-measure.cjs, which is written on its own branch. It is
// required lazily inside each call, so this build runs without it and the course app says
// "Measuring isn't available in this build." where a measurement would go. Its findBlender is
// synchronous and reads `blenderPath` from the settings file it is given (course.json here); its
// measure, makeStarter and openInBlender reject with an Error whose message is a plain sentence.
//
// Files: an exercise's starter scene is <course folder>\<practice id>.blend, and copies of the
// example models and pictures go in <course folder>\Examples. The course folder is
// Documents\Dimensio\Course unless course.json in the app's user data says otherwise. Renders come
// back from Blender as files in a temporary folder; they are read into bytes the course app can
// store, and the folder is removed.

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const VIEWS = ["persp", "front", "right", "top"];
const UNAVAILABLE = "Measuring isn't available in this build.";
const MEASURE_TIMEOUT_MS = 180000;
const STARTER_ID = /^[a-z0-9-]+$/;
// App-relative files the course app may hand over: the example models and pictures in
// public/reference/.
const APP_RELATIVE = /^reference\/[A-Za-z0-9._\-/]+$/;
const EXAMPLE_FILE = /\.(blend|glb|gltf|fbx|obj|png|jpe?g|webp)$/i;
// Starter options are flags for blender/dimensio_starter.py: camelCase names, plain values.
const OPTION_NAME = /^[a-z][A-Za-z0-9]{0,40}$/;

const CHANNELS = Object.freeze({
  blenderStatus: "dimensio:course-blender-status",
  chooseBlender: "dimensio:course-choose-blender",
  pickBlend: "dimensio:course-pick-blend",
  measure: "dimensio:course-measure",
  makeStarter: "dimensio:course-make-starter",
  openInBlender: "dimensio:course-open-in-blender",
  reveal: "dimensio:course-reveal",
  courseFolder: "dimensio:course-folder",
});

function defaultLoadMeasure() {
  try {
    return require("./blender-measure.cjs");
  } catch (error) {
    if (error && error.code === "MODULE_NOT_FOUND" && !fs.existsSync(path.join(__dirname, "blender-measure.cjs"))) throw new Error(UNAVAILABLE);
    throw error;
  }
}

// "5.2.2" is at least 5.2; an unknown version is not.
function atLeast(version, major, minor) {
  const match = /^(\d+)\.(\d+)/.exec(String(version || ""));
  if (!match) return false;
  const [a, b] = [Number(match[1]), Number(match[2])];
  return a > major || (a === major && b >= minor);
}

function createCourseService(deps) {
  const { app, dialog, shell } = deps;
  const getWindow = deps.getWindow || (() => null);
  const loadMeasure = deps.loadMeasure || defaultLoadMeasure;
  const spawnProcess = deps.spawn || spawn;
  const rendererRoots = deps.rendererRoots || [path.join(__dirname, "..", "..", "dist"), path.join(__dirname, "..", "..", "public")];
  const configFile = deps.configFile || path.join(app.getPath("userData"), "course.json");

  const readConfig = () => {
    try { return JSON.parse(fs.readFileSync(configFile, "utf8")) || {}; } catch { return {}; }
  };
  const writeConfig = (patch) => {
    const next = { ...readConfig(), ...patch };
    fs.mkdirSync(path.dirname(configFile), { recursive: true });
    fs.writeFileSync(configFile, `${JSON.stringify(next, null, 2)}\n`, "utf8");
    return next;
  };

  function courseFolder() {
    const configured = readConfig().courseFolder;
    const folder = typeof configured === "string" && path.isAbsolute(configured) ? configured : path.join(app.getPath("documents"), "Dimensio", "Course");
    fs.mkdirSync(folder, { recursive: true });
    return folder;
  }

  async function findBlender() {
    const measure = loadMeasure();
    const found = (await measure.findBlender({ settingsPath: configFile })) || {};
    return {
      ok: Boolean(found.ok),
      path: found.path || null,
      version: found.version || null,
      supported: atLeast(found.version, 5, 2),
      reason: found.reason || "",
      fix: found.fix || "",
    };
  }

  async function blenderPath() {
    const status = await findBlender();
    if (!status.ok || !status.path) throw new Error([status.reason || "Blender wasn't found.", status.fix].filter(Boolean).join(" "));
    return status.path;
  }

  // A .blend on this computer, given by its full path.
  function blendFile(file) {
    if (typeof file !== "string" || !path.isAbsolute(file) || !/\.blend$/i.test(file)) throw new Error("That isn't a .blend file.");
    const resolved = path.resolve(file);
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) throw new Error(`${path.basename(resolved)} isn't there any more. It may have been moved or renamed.`);
    return resolved;
  }

  // An example model or picture the course app names by its app-relative path
  // ("reference/models/stool/stool.blend"), copied out of the app into the course folder so
  // Blender can read it and the learner can save changes without touching the app's copy.
  function exampleFile(relative, pattern = /\.blend$/i) {
    if (typeof relative !== "string" || !APP_RELATIVE.test(relative) || relative.split("/").includes("..") || !pattern.test(relative)) {
      throw new Error("That example model isn't part of the course.");
    }
    const source = rendererRoots.map((root) => path.join(root, ...relative.split("/"))).find((candidate) => fs.existsSync(candidate));
    if (!source) throw new Error("That example model is missing from this build.");
    const folder = path.join(courseFolder(), "Examples");
    fs.mkdirSync(folder, { recursive: true });
    const destination = path.join(folder, path.basename(source));
    if (!fs.existsSync(destination)) fs.copyFileSync(source, destination);
    return destination;
  }

  const modelFile = (file) => (typeof file === "string" && path.isAbsolute(file) ? blendFile(file) : exampleFile(file));

  // Options for a starter: plain values, with the course's own example files copied out to real
  // paths ({ reference: "reference/models/stool/stool.blend" } for the copy-reference starter).
  function starterOptions(options) {
    if (options === undefined || options === null) return {};
    if (typeof options !== "object" || Array.isArray(options)) throw new Error("Those starter options aren't valid.");
    const out = {};
    for (const [name, value] of Object.entries(options)) {
      if (!OPTION_NAME.test(name)) throw new Error("Those starter options aren't valid.");
      if (typeof value === "number" || typeof value === "boolean") out[name] = value;
      else if (typeof value === "string" && APP_RELATIVE.test(value)) out[name] = exampleFile(value, EXAMPLE_FILE);
      else if (typeof value === "string" && /^[A-Za-z0-9][A-Za-z0-9 _.,]{0,79}$/.test(value)) out[name] = value;
      else throw new Error("Those starter options aren't valid.");
    }
    return out;
  }

  return {
    courseFolder,

    async blenderStatus() {
      try {
        return await findBlender();
      } catch (error) {
        return { ok: false, path: null, version: null, supported: false, reason: error.message, fix: "" };
      }
    },

    async chooseBlender() {
      const result = await dialog.showOpenDialog(getWindow(), {
        title: "Choose blender.exe",
        properties: ["openFile"],
        filters: process.platform === "win32" ? [{ name: "Blender", extensions: ["exe"] }] : [],
      });
      if (result.canceled || !result.filePaths[0]) return null;
      writeConfig({ blenderPath: result.filePaths[0] });
      return this.blenderStatus();
    },

    async pickBlend() {
      const result = await dialog.showOpenDialog(getWindow(), {
        title: "Add your model",
        defaultPath: courseFolder(),
        properties: ["openFile"],
        filters: [{ name: "Blender files", extensions: ["blend"] }],
      });
      return result.canceled || !result.filePaths[0] ? null : result.filePaths[0];
    },

    async measure(file, options = {}) {
      const blend = blendFile(file);
      const measure = loadMeasure();
      const blender = await blenderPath();
      const reference = options.reference ? modelFile(options.reference) : undefined;
      const asked = Array.isArray(options.views) ? options.views.filter((view) => VIEWS.includes(view)) : [];
      const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "dimensio-measure-"));
      try {
        const report = await measure.measure({ blenderPath: blender, file: blend, outDir, reference, views: asked.length ? asked : VIEWS, timeoutMs: MEASURE_TIMEOUT_MS });
        if (!report || typeof report !== "object") throw new Error("Blender finished without a report.");
        const read = (file) => {
          if (typeof file !== "string" || !file) return null;
          const absolute = path.isAbsolute(file) ? file : path.join(outDir, file);
          return fs.existsSync(absolute) ? new Uint8Array(fs.readFileSync(absolute)) : null;
        };
        // The report keeps file names only; the pictures travel as bytes.
        const clean = JSON.parse(JSON.stringify(report));
        delete clean.outDir;
        const renders = {};
        const overlays = {};
        for (const [view, file] of Object.entries(report.renders || {})) {
          if (!VIEWS.includes(view)) continue;
          const bytes = read(file);
          if (bytes) renders[view] = bytes;
          if (typeof file === "string") clean.renders[view] = path.basename(file);
        }
        for (const [view, entry] of Object.entries(report.silhouette || {})) {
          if (!VIEWS.includes(view) || !entry) continue;
          const bytes = read(entry.overlay);
          if (bytes) overlays[view] = bytes;
          if (typeof entry.overlay === "string") clean.silhouette[view].overlay = path.basename(entry.overlay);
        }
        return { report: clean, renders, overlays };
      } finally {
        fs.rmSync(outDir, { recursive: true, force: true });
      }
    },

    // The exercise's file, <course folder>\<name>.blend. When it is already there the learner has
    // worked in it, so it is returned as it is; `overwrite` builds the starter again over it.
    async makeStarter(id, { name, overwrite = false, options } = {}) {
      if (typeof id !== "string" || !STARTER_ID.test(id)) throw new Error("That starter scene isn't part of the course.");
      const stem = name === undefined ? id : name;
      if (typeof stem !== "string" || !STARTER_ID.test(stem)) throw new Error("That starter scene isn't part of the course.");
      const flags = starterOptions(options);
      const outFile = path.join(courseFolder(), `${stem}.blend`);
      if (!overwrite && fs.existsSync(outFile)) return outFile;
      const measure = loadMeasure();
      const blender = await blenderPath();
      try {
        const made = await measure.makeStarter({ blenderPath: blender, starterId: id, outFile, options: flags, overwrite: Boolean(overwrite) });
        return typeof made === "string" && made ? made : outFile;
      } catch (error) {
        if (error && error.code === "exists") return outFile;
        throw error;
      }
    },

    async openInBlender(file) {
      const measure = loadMeasure();
      const blender = await blenderPath();
      if (file === undefined || file === null || file === "") {
        // A new scene: Blender opens with its default startup file.
        const child = spawnProcess(blender, [], { detached: true, stdio: "ignore", windowsHide: false });
        child.on?.("error", () => {});
        child.unref?.();
        return null;
      }
      await measure.openInBlender({ blenderPath: blender, file: modelFile(file) });
      return null;
    },

    async reveal(file) {
      const target = blendFile(file);
      shell.showItemInFolder(target);
      return null;
    },
  };
}

// Registers the channels through main.cjs's handle(), which refuses calls from any page but the
// app's own.
function registerCourseIpc({ handle, getWindow, ...deps }) {
  const electron = deps.app ? {} : require("electron");
  const service = createCourseService({ app: electron.app, dialog: electron.dialog, shell: electron.shell, getWindow, ...deps });
  handle(CHANNELS.blenderStatus, () => service.blenderStatus());
  handle(CHANNELS.chooseBlender, () => service.chooseBlender());
  handle(CHANNELS.pickBlend, () => service.pickBlend());
  handle(CHANNELS.measure, (payload = {}) => service.measure(payload.path, payload.options || {}));
  handle(CHANNELS.makeStarter, (payload = {}) => service.makeStarter(payload.id, { name: payload.name, overwrite: payload.overwrite === true, options: payload.options }));
  handle(CHANNELS.openInBlender, (payload = {}) => service.openInBlender(payload.path));
  handle(CHANNELS.reveal, (payload = {}) => service.reveal(payload.path));
  handle(CHANNELS.courseFolder, () => service.courseFolder());
  return service;
}

module.exports = { CHANNELS, UNAVAILABLE, VIEWS, atLeast, createCourseService, registerCourseIpc };
