"use strict";

// Workshop projects. A project is a folder holding one `<Name>.dimensio` manifest and a `runs/` directory of
// ordinary run folders (run-store.cjs). Runs keep writing to disk as they go, exactly as before; the manifest holds
// what belongs to the project as a whole: its identity, its default run settings and where the person left off.
//
//   My bottle/
//     My bottle.dimensio    this file (format "dimensio-project", schema 1)
//     runs/<run folders>    run.json + artifacts, written live by the agent and the local tools
//
// A project made by Forge3D, Dimensio's earlier name, is `<Name>.forge3d` with format "forge3d-project". It opens
// as it is, and saving it keeps that name and format, so nothing about it changes but what the person changed.
//
// A new project starts untitled in a scratch folder under the local state root and is moved into place by its first
// Save. Nothing here touches Electron, so every rule can be tested with plain Node.

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { atomicWriteJson, renameWithRetry } = require("./run-store.cjs");
const { resolveContained } = require("./path-policy.cjs");

const PROJECT_FORMAT = "dimensio-project";
const PROJECT_SCHEMA = 1;
const PROJECT_EXTENSION = ".dimensio";
// Forge3D's project files, read and written in their own format.
const LEGACY_PROJECT_FORMAT = "forge3d-project";
const LEGACY_PROJECT_EXTENSION = ".forge3d";
const PROJECT_EXTENSIONS = [PROJECT_EXTENSION, LEGACY_PROJECT_EXTENSION];
const RUNS_DIRECTORY = "runs";
const UNTITLED_NAME = "Untitled project";
const LEGACY_PROJECT_NAME = "Earlier runs";
const RECENT_LIMIT = 10;
const SETTING_KEYS = ["workflow", "quality", "target", "tool", "model", "effort"];
const RUN_ID = /^[0-9a-f-]{36}$/i;
// Left in an untitled project's scratch folder that was saved but could not be removed (a file in it was still
// open). Such a folder is a stale copy, never "Unsaved work".
const SAVED_MARKER = ".dimensio-saved.json";

function timestamp() {
  return new Date().toISOString();
}

function isProjectFile(file) {
  return PROJECT_EXTENSIONS.includes(path.extname(String(file)).toLowerCase());
}

// The format a project file is written in: Forge3D's for a .forge3d file, Dimensio's otherwise.
function formatFor(file) {
  return path.extname(String(file)).toLowerCase() === LEGACY_PROJECT_EXTENSION ? LEGACY_PROJECT_FORMAT : PROJECT_FORMAT;
}

function samePath(left, right) {
  if (!left || !right) return false;
  const a = path.resolve(left);
  const b = path.resolve(right);
  return process.platform === "win32" ? a.toLowerCase() === b.toLowerCase() : a === b;
}

function projectName(file) {
  return path.basename(file, path.extname(file)) || UNTITLED_NAME;
}

function sanitizeSettings(value) {
  const result = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return result;
  for (const key of SETTING_KEYS) {
    const item = value[key];
    if (typeof item === "string" && item.trim() && item.length <= 160) result[key] = item.trim();
  }
  return result;
}

function sanitizeView(value) {
  const view = { selected_run_id: null, selected_artifact: null };
  if (!value || typeof value !== "object" || Array.isArray(value)) return view;
  if (typeof value.selected_run_id === "string" && RUN_ID.test(value.selected_run_id)) view.selected_run_id = value.selected_run_id;
  if (typeof value.selected_artifact === "string" && value.selected_artifact.length <= 1024 && !path.isAbsolute(value.selected_artifact)) {
    view.selected_artifact = value.selected_artifact;
  }
  return view;
}

function sameSettings(left, right) {
  const a = sanitizeSettings(left);
  const b = sanitizeSettings(right);
  return SETTING_KEYS.every((key) => a[key] === b[key]);
}

function newManifest({ settings = {}, view = {}, appVersion = "" } = {}) {
  const now = timestamp();
  return {
    format: PROJECT_FORMAT,
    schema_version: PROJECT_SCHEMA,
    project_id: crypto.randomUUID(),
    created_at: now,
    updated_at: now,
    app_version: appVersion,
    runs_directory: RUNS_DIRECTORY,
    settings: sanitizeSettings(settings),
    view: sanitizeView(view),
  };
}

function validateProject(data, file) {
  if (!data || typeof data !== "object" || Array.isArray(data) || ![PROJECT_FORMAT, LEGACY_PROJECT_FORMAT].includes(data.format)) {
    throw new Error(`Not a Dimensio project: ${file}`);
  }
  if (data.schema_version !== PROJECT_SCHEMA) throw new Error(`Unsupported project schema ${data.schema_version}: ${file}`);
  if (data.runs_directory !== undefined && data.runs_directory !== RUNS_DIRECTORY) throw new Error(`Unsupported runs directory in ${file}`);
  return {
    format: formatFor(file),
    schema_version: PROJECT_SCHEMA,
    project_id: typeof data.project_id === "string" ? data.project_id : crypto.randomUUID(),
    created_at: typeof data.created_at === "string" ? data.created_at : timestamp(),
    updated_at: typeof data.updated_at === "string" ? data.updated_at : timestamp(),
    app_version: typeof data.app_version === "string" ? data.app_version : "",
    runs_directory: RUNS_DIRECTORY,
    settings: sanitizeSettings(data.settings),
    view: sanitizeView(data.view),
  };
}

function readProject(file) {
  if (!isProjectFile(file)) throw new Error(`Dimensio projects end in ${PROJECT_EXTENSION}: ${file}`);
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Not a regular project file: ${file}`);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    throw new Error(`Could not read ${path.basename(file)}: ${error.message}`);
  }
  return validateProject(data, file);
}

function writeProject(file, manifest) {
  const next = { ...validateProject({ ...manifest, format: formatFor(file), schema_version: PROJECT_SCHEMA }, file), updated_at: timestamp() };
  if (manifest.app_version) next.app_version = manifest.app_version;
  atomicWriteJson(file, next);
  return next;
}

// Keeps the selection on disk as it changes. It writes the manifest as last saved with only the view replaced, so
// unsaved run settings stay unsaved and the project never looks changed because of it.
function writeProjectView(file, manifest, view) {
  return writeProject(file, { ...manifest, view: sanitizeView(view) });
}

function runsRoot(folder) {
  return resolveContained(folder, RUNS_DIRECTORY);
}

function hasRuns(folder) {
  const root = path.join(folder, RUNS_DIRECTORY);
  const scan = (directory) => fs.existsSync(directory) && fs.readdirSync(directory, { withFileTypes: true })
    .some((entry) => entry.isDirectory() && !entry.name.startsWith(".") && fs.existsSync(path.join(directory, entry.name, "run.json")));
  return scan(root) || scan(path.join(root, ".archive"));
}

function projectFilesIn(folder) {
  if (!fs.existsSync(folder)) return [];
  return fs.readdirSync(folder, { withFileTypes: true })
    .filter((entry) => entry.isFile() && isProjectFile(entry.name))
    .map((entry) => path.join(folder, entry.name));
}

function isEmptyDirectory(folder) {
  return fs.existsSync(folder) && fs.statSync(folder).isDirectory() && fs.readdirSync(folder).length === 0;
}

// A project name as typed: trimmed, without a trailing .dimensio (or Forge3D's .forge3d), and usable as a Windows
// file and folder name.
function projectStem(name) {
  let stem = String(name ?? "").trim();
  const extension = PROJECT_EXTENSIONS.find((item) => stem.toLowerCase().endsWith(item));
  if (extension) stem = stem.slice(0, -extension.length).trim();
  if (!stem || stem === "." || stem === ".." || /[<>:"/\\|?*\u0000-\u001f]/.test(stem)) throw new Error("Choose a project name without path characters");
  if (/[. ]$/.test(stem)) throw new Error("A project name cannot end with a dot or a space");
  if (stem.length > 120) throw new Error("Choose a project name of 120 characters or fewer");
  return stem;
}

// Turns what a Save dialog returned into the folder and manifest the project will use. "D:\Art\Bottle.dimensio"
// becomes "D:\Art\Bottle\Bottle.dimensio", so a project never spills its runs/ beside unrelated files. Picking a
// file inside an empty folder of the same name ("D:\Art\Bottle\Bottle.dimensio") uses that folder as it is. A
// project saved anywhere is a .dimensio project, whatever it was before.
function layoutForSavePath(chosen) {
  if (typeof chosen !== "string" || !path.isAbsolute(chosen)) throw new Error("A project location must be an absolute path");
  const extension = path.extname(chosen);
  const stem = projectStem(isProjectFile(chosen) ? path.basename(chosen, extension) : path.basename(chosen));
  const parent = path.dirname(path.resolve(chosen));
  const parentNamed = path.basename(parent).toLowerCase() === stem.toLowerCase();
  const reuseParent = parentNamed && !projectFilesIn(parent).length && !fs.existsSync(path.join(parent, RUNS_DIRECTORY));
  const folder = reuseParent ? parent : path.join(parent, stem);
  if (!reuseParent && fs.existsSync(folder) && !isEmptyDirectory(folder)) {
    throw new Error(`A folder named “${stem}” already exists there and is not empty. Choose another name or location.`);
  }
  return { folder, file: path.join(folder, `${stem}${PROJECT_EXTENSION}`), name: stem };
}

function moveDirectory(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  try {
    renameWithRetry(source, target); // Windows: a brief lock (an indexer, a virus scan) usually clears in a moment
    return;
  } catch (error) {
    if (!["EXDEV", "EPERM", "EACCES", "EBUSY", "ENOTEMPTY", "EEXIST"].includes(error.code)) throw error;
  }
  fs.cpSync(source, target, { recursive: true, errorOnExist: true, force: false, verbatimSymlinks: true });
  try { fs.rmSync(source, { recursive: true, force: true }); } catch { /* the copy is complete; a stale source is harmless */ }
}

// Writes a project at `layout` whose runs come from `sourceFolder`. move: true (an untitled scratch project) moves
// them; otherwise (Save As of a saved project) the runs are copied and the original project is left as it was.
function materializeProject(layout, { sourceFolder = null, move = false, manifest }) {
  fs.mkdirSync(layout.folder, { recursive: true });
  const target = runsRoot(layout.folder);
  const source = sourceFolder ? path.join(sourceFolder, RUNS_DIRECTORY) : null;
  if (source && fs.existsSync(source)) {
    if (move) moveDirectory(source, target);
    else fs.cpSync(source, target, { recursive: true, errorOnExist: true, force: false, verbatimSymlinks: true });
  }
  fs.mkdirSync(target, { recursive: true });
  return writeProject(layout.file, manifest);
}

/* ── renaming and deleting a saved project ─────────────────── */

// Renames a saved project: its project file, and its folder too when the folder carries the project's name (the
// layout Save makes). An adopted library such as Documents\Forge3D keeps its folder name, and a Forge3D project
// keeps its .forge3d extension. Returns the new { file, folder, name }. Nothing is left half-renamed: a folder that
// cannot be renamed puts the file back.
function renameProject(file, name) {
  const stem = projectStem(name);
  const folder = path.dirname(file);
  const oldStem = projectName(file);
  if (stem === oldStem) return { file, folder, name: stem };
  const extension = path.extname(file);
  const ownsFolder = path.basename(folder).toLowerCase() === oldStem.toLowerCase();
  const nextFolder = ownsFolder ? path.join(path.dirname(folder), stem) : folder;
  if (ownsFolder && !samePath(nextFolder, folder) && fs.existsSync(nextFolder)) {
    throw new Error(`A folder named "${stem}" already exists beside this project. Choose another name.`);
  }
  const renamedFile = path.join(folder, `${stem}${extension}`);
  if (!samePath(renamedFile, file) && fs.existsSync(renamedFile)) throw new Error(`"${stem}${extension}" already exists in the project folder. Choose another name.`);
  renameWithRetry(file, renamedFile);
  if (nextFolder !== folder) {
    try {
      renameWithRetry(folder, nextFolder);
    } catch (error) {
      try { renameWithRetry(renamedFile, file); } catch { /* reported below */ }
      throw new Error(`Dimensio could not rename the project folder: ${error.message}`);
    }
  }
  return { file: path.join(nextFolder, `${stem}${extension}`), folder: nextFolder, name: stem };
}

const IGNORABLE_FILES = new Set(["desktop.ini", "thumbs.db", ".ds_store"]);

// What deleting a project moves to the Recycle Bin: the whole folder when it holds nothing but the project (its
// project file and runs/), so it comes back in one piece; otherwise only those two, so other files in the folder
// (Documents\Forge3D, an adopted library, also holds Projects\) stay where they are.
function projectTrashTargets(file) {
  const folder = path.dirname(file);
  const runs = path.join(folder, RUNS_DIRECTORY);
  const own = new Set([path.basename(file).toLowerCase(), RUNS_DIRECTORY]);
  const entries = fs.readdirSync(folder).map((entry) => entry.toLowerCase()).filter((entry) => !IGNORABLE_FILES.has(entry));
  if (entries.every((entry) => own.has(entry))) return { whole: true, targets: [folder] };
  return { whole: false, targets: [file, ...(fs.existsSync(runs) ? [runs] : [])] };
}

/* ── untitled scratch projects ─────────────────────────────── */

function scratchRoot(stateRoot) {
  return path.join(stateRoot, "untitled");
}

function createScratch(stateRoot) {
  const stamp = timestamp().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const folder = path.join(scratchRoot(stateRoot), `${stamp}-${crypto.randomUUID().slice(0, 8)}`);
  fs.mkdirSync(path.join(folder, RUNS_DIRECTORY), { recursive: true });
  return folder;
}

// After an untitled project was saved: removes its scratch folder, or, when something in it is still in use and
// it cannot be removed yet, marks it as saved so it is cleared later and never offered as unsaved work.
function retireScratch(folder, savedTo) {
  try { fs.rmSync(folder, { recursive: true, force: true }); } catch { /* marked below */ }
  if (!fs.existsSync(folder)) return true;
  try { fs.writeFileSync(path.join(folder, SAVED_MARKER), `${JSON.stringify({ saved_to: savedTo, at: timestamp() })}\n`, "utf8"); } catch { /* best effort */ }
  return false;
}

// Untitled projects left behind by a crash. Empty ones are removed; ones holding runs are offered back. Folders
// already saved elsewhere (retireScratch) are removed again and never offered.
function recoverableScratch(stateRoot, { exclude = null } = {}) {
  const root = scratchRoot(stateRoot);
  if (!fs.existsSync(root)) return [];
  const found = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const folder = path.join(root, entry.name);
    if (exclude && samePath(folder, exclude)) continue;
    if (fs.existsSync(path.join(folder, SAVED_MARKER)) || !hasRuns(folder)) {
      try { fs.rmSync(folder, { recursive: true, force: true }); } catch { /* in use; try again next start */ }
      continue;
    }
    const stat = fs.statSync(folder);
    found.push({ id: entry.name, folder, modified_at: stat.mtime.toISOString() });
  }
  return found.sort((left, right) => right.modified_at.localeCompare(left.modified_at));
}

function scratchFolder(stateRoot, id) {
  if (typeof id !== "string" || !/^[0-9A-Za-z-]{8,80}$/.test(id)) throw new Error("Invalid unsaved project id");
  const folder = resolveContained(scratchRoot(stateRoot), id);
  if (!fs.existsSync(folder)) throw new Error("That unsaved project no longer exists");
  return folder;
}

/* ── the first start after projects arrived ────────────────── */

// Before projects, Forge3D kept every run in Documents\Forge3D\runs. That folder already has the project layout, so
// it becomes a project, "Earlier runs", by gaining a manifest beside it; a manifest already there (Forge3D's own
// Earlier runs.forge3d) is used as it is. Nothing is moved, and it happens once.
function adoptLegacyLibrary(libraryFolder, { appVersion = "" } = {}) {
  if (!fs.existsSync(path.join(libraryFolder, RUNS_DIRECTORY)) || !hasRuns(libraryFolder)) return null;
  const existing = projectFilesIn(libraryFolder);
  if (existing.length) return existing[0];
  const file = path.join(libraryFolder, `${LEGACY_PROJECT_NAME}${PROJECT_EXTENSION}`);
  writeProject(file, newManifest({ appVersion }));
  return file;
}

/* ── recent projects, per user ─────────────────────────────── */

class RecentProjects {
  constructor(file, { limit = RECENT_LIMIT } = {}) {
    this.file = file;
    this.limit = limit;
  }

  _read() {
    try {
      const data = JSON.parse(fs.readFileSync(this.file, "utf8"));
      return {
        projects: Array.isArray(data.projects) ? data.projects.filter((item) => item && typeof item.path === "string" && path.isAbsolute(item.path)) : [],
        reopen_last: data.reopen_last === true,
        legacy_adopted: data.legacy_adopted === true,
      };
    } catch {
      return { projects: [], reopen_last: false, legacy_adopted: false };
    }
  }

  _write(data) {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    atomicWriteJson(this.file, { schema_version: 1, ...data });
  }

  list() {
    return this._read().projects.slice(0, this.limit).map((item) => ({
      path: item.path,
      name: projectName(item.path),
      folder: path.dirname(item.path),
      opened_at: typeof item.opened_at === "string" ? item.opened_at : null,
      missing: !fs.existsSync(item.path),
    }));
  }

  add(file) {
    const data = this._read();
    data.projects = [{ path: path.resolve(file), opened_at: timestamp() }, ...data.projects.filter((item) => !samePath(item.path, file))].slice(0, this.limit);
    this._write(data);
  }

  remove(file) {
    const data = this._read();
    data.projects = data.projects.filter((item) => !samePath(item.path, file));
    this._write(data);
  }

  clear() {
    const data = this._read();
    data.projects = [];
    this._write(data);
  }

  preferences() {
    const data = this._read();
    return { reopenLast: data.reopen_last };
  }

  setPreferences({ reopenLast } = {}) {
    const data = this._read();
    if (typeof reopenLast === "boolean") data.reopen_last = reopenLast;
    this._write(data);
    return { reopenLast: data.reopen_last };
  }

  // The project to open at launch: the most recent existing one, and only when the person asked for that.
  launchProject() {
    const data = this._read();
    if (!data.reopen_last) return null;
    return data.projects.find((item) => fs.existsSync(item.path))?.path || null;
  }

  legacyAdopted() {
    return this._read().legacy_adopted;
  }

  markLegacyAdopted() {
    const data = this._read();
    data.legacy_adopted = true;
    this._write(data);
  }
}

/* ── presentation ──────────────────────────────────────────── */

function windowTitle(project) {
  if (!project) return "Dimensio";
  return `${project.dirty ? "● " : ""}${project.name} — Dimensio`;
}

// Command-line arguments that name a project file (a double-clicked .dimensio or .forge3d, or
// `Dimensio.exe path\to\x.dimensio`).
function projectFromArgv(argv = []) {
  return argv.find((item) => typeof item === "string" && isProjectFile(item) && path.isAbsolute(item) && fs.existsSync(item)) || null;
}

module.exports = {
  LEGACY_PROJECT_EXTENSION,
  LEGACY_PROJECT_FORMAT,
  LEGACY_PROJECT_NAME,
  PROJECT_EXTENSION,
  PROJECT_EXTENSIONS,
  PROJECT_FORMAT,
  PROJECT_SCHEMA,
  RUNS_DIRECTORY,
  RecentProjects,
  SAVED_MARKER,
  UNTITLED_NAME,
  adoptLegacyLibrary,
  createScratch,
  hasRuns,
  isProjectFile,
  layoutForSavePath,
  materializeProject,
  newManifest,
  projectFromArgv,
  projectName,
  projectStem,
  projectTrashTargets,
  readProject,
  recoverableScratch,
  renameProject,
  retireScratch,
  runsRoot,
  sameSettings,
  samePath,
  sanitizeSettings,
  sanitizeView,
  scratchFolder,
  windowTitle,
  writeProject,
  writeProjectView,
};
