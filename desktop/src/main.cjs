"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { spawn } = require("node:child_process");
const {
  app,
  BrowserWindow,
  clipboard,
  dialog,
  ipcMain,
  nativeTheme,
  net,
  protocol,
  session,
  shell,
} = require("electron");

const TITLE_BAR_HEIGHT = 72;
const { RunStore, agentSession } = require("./lib/run-store.cjs");
const {
  BUNDLE_VERSION,
  detectExternalTools,
  detectWslModelsDirectory,
  ensureRuntimeState,
  generatedMcpConfig,
  primeGodotProject,
  repairForgePlugin,
} = require("./lib/runtime.cjs");
const { agentInfo, createRegistry } = require("./lib/agents/index.cjs");
const { AgentSettings } = require("./lib/agents/settings.cjs");
const { VISIBLE_ITEM_TYPES, applyStep, describeItem } = require("./lib/agents/steps.cjs");
const { resolveContained } = require("./lib/path-policy.cjs");
const { automaticApproval } = require("./lib/approval-policy.cjs");
const { exportArtifact, exportFormatsForArtifact } = require("./lib/export-service.cjs");
const { createCapabilitiesService } = require("./lib/capabilities-service.cjs");
const { closeAction, stopRunQuestion } = require("./lib/close-guard.cjs");
const {
  PROJECT_EXTENSION,
  RecentProjects,
  UNTITLED_NAME,
  adoptLegacyLibrary,
  createScratch,
  hasRuns,
  layoutForSavePath,
  materializeProject,
  newManifest,
  projectFromArgv,
  projectName,
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
} = require("./lib/project-store.cjs");

// One Forge3D at a time. A second launch hands its command line to this one, which comes to the front and opens a
// project named there.
const singleInstance = app.requestSingleInstanceLock();
if (!singleInstance) app.quit();

protocol.registerSchemesAsPrivileged([
  {
    scheme: "forge3d-artifact",
    privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true },
  },
]);

let mainWindow = null;
let runStore = null; // the open project's runs; null while the start screen is showing
let project = null; // { file, folder, untitled, manifest, settings, view }; see project-store.cjs
let recentProjects = null;
let recoverable = [];
let allowWindowClose = false;
let runtimeState = null;
let agents = null; // one driver per agent (lib/agents); the chosen one is in agentSettings
let agentSettings = null;
let currentSkill = null;
let activeJob = null; // { runId, agent, sessionId, turnId }
let appServerError = null; // the agent's last error: it stopped, or could not start
let detectedTools = null;
let runEventTimer = null;
let godotPrimePromise = Promise.resolve();
let wslModelsDirectory;
const pendingRunEvents = new Map();

const repoRoot = path.resolve(__dirname, "..", "..");
const bundledPlugin = () => app.isPackaged
  ? path.join(process.resourcesPath, "forge3d-plugin")
  : path.join(repoRoot, "plugins", "forge3d");
const bundledToolkit = () => app.isPackaged
  ? path.join(process.resourcesPath, "forge3d-toolkit")
  : repoRoot;

function rendererUrlAllowed(url) {
  if (url.startsWith("file://")) return true;
  const dev = process.env.FORGE3D_DEV_SERVER_URL;
  return Boolean(dev && url.startsWith(dev));
}

function assertTrustedIpc(event) {
  const url = event.senderFrame?.url || event.sender?.getURL?.() || "";
  if (!rendererUrlAllowed(url)) throw new Error("Blocked IPC from an untrusted renderer");
}

function handle(channel, callback) {
  ipcMain.handle(channel, async (event, payload) => {
    assertTrustedIpc(event);
    return callback(payload, event);
  });
}

function send(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send(channel, payload);
}

function compact(value, depth = 0) {
  if (depth > 6) return "[nested data omitted]";
  if (typeof value === "string") return value.length > 20000 ? `${value.slice(0, 20000)}…` : value;
  if (Array.isArray(value)) return value.slice(0, 100).map((item) => compact(item, depth + 1));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).slice(0, 100).map(([key, item]) => [key, compact(item, depth + 1)]));
  }
  return value;
}

function externalTools(force = false) {
  if (force || !detectedTools) detectedTools = detectExternalTools(runtimeState.root);
  return detectedTools;
}

function currentState() {
  return {
    version: BUNDLE_VERSION,
    agent: agentSettings ? { id: agentSettings.agent(), name: agentInfo(agentSettings.agent()).name } : null,
    activeJob,
    appServerError,
    skill: currentSkill,
    tools: externalTools(),
    runs: runStore ? runStore.list() : [],
    project: projectSummary(),
    recent: recentProjects ? recentProjects.list() : [],
    recoverable: recoverable.map(({ id, modified_at }) => ({ id, modified_at })),
    preferences: recentProjects ? recentProjects.preferences() : { reopenLast: false },
  };
}

function sendState() {
  updateWindowTitle();
  send("forge3d:state", currentState());
}

/* ── projects ─────────────────────────────────────────────────── */

function store() {
  if (!runStore) throw new Error("Open or create a project first");
  return runStore;
}

function projectDirty() {
  if (!project) return false;
  if (project.untitled) return hasRuns(project.folder);
  return !sameSettings(project.settings, project.manifest.settings);
}

function projectSummary() {
  if (!project) return null;
  return {
    id: project.manifest.project_id,
    name: project.untitled ? UNTITLED_NAME : projectName(project.file),
    file: project.file,
    folder: project.folder,
    untitled: project.untitled,
    dirty: projectDirty(),
    settings: project.settings,
    view: project.view,
  };
}

function updateWindowTitle() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  const summary = projectSummary();
  mainWindow.setTitle(windowTitle(summary));
  if (process.platform === "darwin") {
    mainWindow.setDocumentEdited(Boolean(summary?.dirty));
    mainWindow.setRepresentedFilename(summary?.file || "");
  }
}

function refreshRecoverable() {
  recoverable = recoverableScratch(runtimeState.root, { exclude: project?.untitled ? project.folder : null });
}

function assertIdle(doing) {
  if (activeJob) throw new Error(`Wait for the active run to finish, or cancel it, before ${doing}`);
}

function openSession({ file = null, folder, untitled = false, manifest }) {
  try { flushRunEvents(); } catch {}
  const nextStore = new RunStore(runsRoot(folder));
  nextStore.recoverInterrupted();
  runStore = nextStore;
  project = { file, folder, untitled, manifest, settings: { ...manifest.settings }, view: { ...manifest.view } };
  if (file) recentProjects.add(file);
  refreshRecoverable();
  sendState();
  return currentState();
}

// Leaves the current project. An untitled project that is discarded goes to the Recycle Bin when it holds runs
// (so a mistaken "Don't save" is recoverable) and is simply removed when it is empty.
async function leaveSession({ discard = false } = {}) {
  if (!project) return;
  try { flushRunEvents(); } catch {}
  const leaving = project;
  project = null;
  runStore = null;
  if (leaving.untitled && (discard || !hasRuns(leaving.folder))) {
    try {
      if (hasRuns(leaving.folder)) await shell.trashItem(leaving.folder);
      else fs.rmSync(leaving.folder, { recursive: true, force: true });
    } catch (error) {
      send("forge3d:error", `Forge3D could not remove the unsaved project folder: ${error.message}`);
    }
  }
  refreshRecoverable();
}

// The "save changes?" question. Resolves true when it is fine to leave the current project.
async function confirmLeave(doing) {
  if (!project || !projectDirty()) return { proceed: true, discard: false };
  const name = project.untitled ? UNTITLED_NAME : projectName(project.file);
  const { response } = await dialog.showMessageBox(mainWindow, {
    type: "warning",
    title: "Unsaved changes",
    message: `Save changes to “${name}” before ${doing}?`,
    detail: project.untitled
      ? "Its runs are kept in a temporary folder until the project is saved. If you don't save, that folder is moved to the Recycle Bin."
      : "The project's run settings changed since it was last saved. Runs and their files are already on disk.",
    buttons: ["Save", "Don't save", "Cancel"],
    defaultId: 0,
    cancelId: 2,
    noLink: true,
  });
  if (response === 2) return { proceed: false, discard: false };
  if (response === 1) return { proceed: true, discard: true };
  return { proceed: await saveProject(), discard: false };
}

function projectsDirectory() {
  return path.join(app.getPath("documents"), "Forge3D", "Projects");
}

async function saveProject() {
  if (!project) throw new Error("No project is open");
  if (project.untitled) return saveProjectAs();
  project.manifest = writeProject(project.file, { ...project.manifest, settings: project.settings, view: project.view, app_version: BUNDLE_VERSION });
  project.settings = { ...project.manifest.settings };
  recentProjects.add(project.file);
  sendState();
  return true;
}

async function saveProjectAs() {
  if (!project) throw new Error("No project is open");
  assertIdle("saving the project to a new location");
  const suggested = project.untitled ? UNTITLED_NAME : `${projectName(project.file)} copy`;
  const defaultDirectory = project.untitled ? projectsDirectory() : path.dirname(project.folder);
  fs.mkdirSync(defaultDirectory, { recursive: true });
  const result = await dialog.showSaveDialog(mainWindow, {
    title: project.untitled ? "Save Forge3D project" : "Save Forge3D project as",
    defaultPath: path.join(defaultDirectory, `${suggested}${PROJECT_EXTENSION}`),
    buttonLabel: "Save project",
    filters: [{ name: "Forge3D project", extensions: [PROJECT_EXTENSION.slice(1)] }],
    properties: ["createDirectory", "showOverwriteConfirmation"],
  });
  if (result.canceled || !result.filePath) return false;
  if (!project.untitled && samePath(result.filePath, project.file)) return saveProject();
  const layout = layoutForSavePath(result.filePath);
  const source = project;
  flushRunEvents();
  if (source.untitled) await releaseProjectFolder();
  const manifest = materializeProject(layout, {
    sourceFolder: source.folder,
    move: source.untitled,
    manifest: {
      ...(source.untitled ? source.manifest : newManifest()),
      settings: source.settings,
      view: source.view,
      app_version: BUNDLE_VERSION,
    },
  });
  if (source.untitled) retireScratch(source.folder, layout.file);
  openSession({ file: layout.file, folder: layout.folder, manifest });
  return true;
}

// Stops every agent process before the project's folder is moved or renamed. Codex's App Server works in the
// runs folder, and on Windows a folder a process is using cannot be moved (EBUSY), which used to leave a copy
// behind under "Unsaved work". The next run starts the agent again in the new place.
async function releaseProjectFolder() {
  if (agents) await agents.closeAll();
  currentSkill = null;
}

async function newProject(payload = {}) {
  assertIdle("starting a new project");
  const { proceed, discard } = await confirmLeave("creating a new project");
  if (!proceed) return { canceled: true, ...currentState() };
  await leaveSession({ discard });
  const folder = createScratch(runtimeState.root);
  return openSession({ folder, untitled: true, manifest: newManifest({ settings: sanitizeSettings(payload.settings), appVersion: BUNDLE_VERSION }) });
}

async function openProject(payload = {}) {
  let file = typeof payload.path === "string" ? payload.path : null;
  if (!file) {
    fs.mkdirSync(projectsDirectory(), { recursive: true });
    const result = await dialog.showOpenDialog(mainWindow, {
      title: "Open Forge3D project",
      defaultPath: project?.folder ? path.dirname(project.folder) : projectsDirectory(),
      buttonLabel: "Open project",
      filters: [{ name: "Forge3D project", extensions: [PROJECT_EXTENSION.slice(1)] }],
      properties: ["openFile"],
    });
    if (result.canceled || !result.filePaths.length) return { canceled: true, ...currentState() };
    file = result.filePaths[0];
  }
  if (!path.isAbsolute(file)) throw new Error("Project paths must be absolute");
  if (project && !project.untitled && samePath(file, project.file)) return currentState();
  if (!fs.existsSync(file)) {
    recentProjects.remove(file);
    sendState();
    throw new Error(`The project is no longer at ${file}. It was removed from the recent list.`);
  }
  const manifest = readProject(file); // validated before the current project is left
  assertIdle("opening another project");
  const { proceed, discard } = await confirmLeave("opening another project");
  if (!proceed) return { canceled: true, ...currentState() };
  await leaveSession({ discard });
  return openSession({ file, folder: path.dirname(file), manifest });
}

async function openRecovered(payload = {}) {
  const folder = scratchFolder(runtimeState.root, payload.id);
  assertIdle("opening another project");
  const { proceed, discard } = await confirmLeave("opening another project");
  if (!proceed) return { canceled: true, ...currentState() };
  await leaveSession({ discard });
  return openSession({ folder, untitled: true, manifest: newManifest({ appVersion: BUNDLE_VERSION }) });
}

// Renames the open, saved project (its file, and its folder when the folder carries its name). The agent is
// stopped first, as for Save, because the runs folder moves with it.
async function renameOpenProject(payload = {}) {
  if (!project) throw new Error("No project is open");
  if (project.untitled) throw new Error("Save the project first. You name it when you save it.");
  assertIdle("renaming the project");
  flushRunEvents();
  await releaseProjectFolder();
  const previous = project.file;
  const renamed = renameProject(previous, payload.name);
  if (renamed.file === previous) return currentState();
  recentProjects.remove(previous);
  recentProjects.add(renamed.file);
  project = { ...project, file: renamed.file, folder: renamed.folder };
  runStore = new RunStore(runsRoot(renamed.folder));
  sendState();
  return currentState();
}

// Moves the open, saved project to the Recycle Bin after asking, and returns to the start screen.
async function deleteOpenProject() {
  if (!project) throw new Error("No project is open");
  if (project.untitled) throw new Error("This project is not saved. Close it and choose Don't save to discard it.");
  assertIdle("deleting the project");
  const file = project.file;
  const name = projectName(file);
  const { whole, targets } = projectTrashTargets(file);
  const { response } = await dialog.showMessageBox(mainWindow, {
    type: "warning",
    title: "Delete project",
    message: `Move "${name}" to the Recycle Bin?`,
    detail: whole
      ? "Its folder goes to the Recycle Bin with every run and file in it. You can restore it from there."
      : "The project file and its runs folder go to the Recycle Bin. Other files in the folder stay where they are.",
    buttons: ["Move to Recycle Bin", "Cancel"],
    defaultId: 1,
    cancelId: 1,
    noLink: true,
  });
  if (response !== 0) return { canceled: true, ...currentState() };
  flushRunEvents();
  await releaseProjectFolder();
  project = null;
  runStore = null;
  for (const target of targets) {
    try {
      await shell.trashItem(target);
    } catch (error) {
      sendState();
      throw new Error(`Forge3D could not move ${target} to the Recycle Bin: ${error.message}`);
    }
  }
  recentProjects.remove(file);
  refreshRecoverable();
  sendState();
  return currentState();
}

// A second launch: bring this window forward and open the project it named, if any.
function onSecondInstance(argv = []) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
  const file = projectFromArgv(argv.slice(1));
  if (file) openProject({ path: file }).catch((error) => send("forge3d:error", `Forge3D could not open ${path.basename(file)}: ${error.message}`));
}

async function closeProject() {
  if (!project) return currentState();
  assertIdle("closing the project");
  const { proceed, discard } = await confirmLeave("closing it");
  if (!proceed) return { canceled: true, ...currentState() };
  await leaveSession({ discard });
  sendState();
  return currentState();
}

// Closing the window. A run in progress is asked about first, even when the project has nothing unsaved: closing
// used to end the agent with no warning. Then the usual save question.
function onWindowClose(event) {
  if (allowWindowClose) return;
  const running = Boolean(activeJob);
  if (closeAction({ running, project, dirty: projectDirty() }) === "close") {
    if (project?.untitled) leaveSession();
    return;
  }
  event.preventDefault();
  (async () => {
    if (running) {
      if (!(await confirmStopRun("closing Forge3D"))) return;
      await stopActiveRun("Stopped because Forge3D was closed during the run.");
    }
    const { proceed, discard } = await confirmLeave("closing Forge3D");
    if (!proceed) return;
    await leaveSession({ discard });
    allowWindowClose = true;
    mainWindow.close();
  })().catch((error) => send("forge3d:error", error.message));
}

async function confirmStopRun(doing) {
  if (!activeJob) return true;
  let runName = "";
  try { runName = store().find(activeJob.runId, false).manifest.prompt; } catch { /* the question still works */ }
  const { response } = await dialog.showMessageBox(mainWindow, stopRunQuestion({ agentName: agentInfo(activeJob.agent).name, runName, doing }));
  return response === 0;
}

// Interrupts the active run and waits up to five seconds for the agent to report it stopped. An agent that does
// not answer is closed, and the run is marked interrupted with the reason, so it can be resumed later.
async function stopActiveRun(reason) {
  if (!activeJob) return;
  const job = activeJob;
  const driver = jobAgent();
  try {
    queueRunEvent(job.runId, { kind: "event", text: reason });
    store().setStatus(job.runId, "cancelling");
  } catch { /* the run folder may be gone */ }
  try { await driver.interrupt(); } catch { /* closed below */ }
  const deadline = Date.now() + 5000;
  while (activeJob === job && Date.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 100));
  if (activeJob !== job) return;
  activeJob = null;
  await driver.close().catch(() => {});
  try {
    flushRunEvents();
    store().setStatus(job.runId, "interrupted", reason);
  } catch { /* the run folder may be gone */ }
  sendState();
}

function queueRunEvent(runId, event) {
  const queued = pendingRunEvents.get(runId) || [];
  queued.push(event);
  pendingRunEvents.set(runId, queued);
  if (!runEventTimer) runEventTimer = setTimeout(flushRunEvents, 220);
}

function flushRunEvents() {
  if (runEventTimer) clearTimeout(runEventTimer);
  runEventTimer = null;
  let count = 0;
  for (const [runId, events] of pendingRunEvents) {
    pendingRunEvents.delete(runId);
    if (!events.length) continue;
    store().appendEvents(runId, events);
    count += events.length;
  }
  if (count) send("forge3d:event", { refresh: true, count });
}

function failActiveJob(error) {
  const message = `Forge3D could not process the agent's activity: ${error.message}`;
  appServerError = message;
  send("forge3d:error", message);
  try { flushRunEvents(); } catch {}
  if (activeJob) {
    try { store().setStatus(activeJob.runId, "failed", message); } catch {}
    activeJob = null;
  }
  try { sendState(); } catch {}
}

let capabilitiesServiceInstance = null;
function capabilitiesService() {
  if (!capabilitiesServiceInstance) {
    const binDirectory = app.isPackaged ? path.join(process.resourcesPath, "bin") : path.join(repoRoot, ".venv", "Scripts");
    capabilitiesServiceInstance = createCapabilitiesService({
      command: path.join(binDirectory, process.platform === "win32" ? "forge3d.exe" : "forge3d"),
      args: () => ["capabilities", "--json", "--agent", agentSettings.agent()],
      env: { ...process.env, FORGE3D_TOOLKIT_ROOT: bundledToolkit(), FORGE3D_PLUGIN_ROOT: bundledPlugin() },
    });
  }
  return capabilitiesServiceInstance;
}

/* ── agents ─────────────────────────────────────────────────── */

// The agent runs inside the open project's runs folder (or the local state root on the start screen).
function agentWorkspace() {
  return runStore?.root || runtimeState.root;
}

// What every agent process gets: forge3d.exe on PATH, the toolkit and plugin roots, where runs go, and the tools
// the host already found, so the agent never has to look for them.
function agentEnvironment() {
  const binDirectory = app.isPackaged ? path.join(process.resourcesPath, "bin") : path.join(repoRoot, ".venv", "Scripts");
  const tools = externalTools();
  if (wslModelsDirectory === undefined) wslModelsDirectory = process.env.FORGE3D_WSL_MODELS_DIR || detectWslModelsDirectory(tools.wsl);
  return {
    ...process.env,
    PATH: `${binDirectory}${path.delimiter}${process.env.PATH || ""}`,
    ...(runStore ? { FORGE3D_OUTPUT: runStore.root } : {}),
    FORGE3D_TOOLKIT_ROOT: bundledToolkit(),
    FORGE3D_PLUGIN_ROOT: bundledPlugin(),
    FORGE3D_STATE_ROOT: runtimeState.root,
    ...(tools.blender ? { BLENDER_EXECUTABLE: tools.blender } : {}),
    ...(tools.godot ? { GODOT_EXECUTABLE: tools.godot } : {}),
    ...(wslModelsDirectory ? { FORGE3D_WSL_MODELS_DIR: wslModelsDirectory } : {}),
  };
}

function agentContext() {
  return { workspace: agentWorkspace(), env: agentEnvironment(), bundledPlugin: bundledPlugin() };
}

function agentRegistry() {
  if (!agents) agents = createRegistry({ claude: { stateRoot: runtimeState.root }, codex: {}, onCreate: wireAgent });
  return agents;
}

function currentAgent() {
  return agentRegistry().get(agentSettings.agent());
}

function jobAgent() {
  if (!activeJob) throw new Error("This run is not active");
  return agentRegistry().get(activeJob.agent);
}

// Whatever must be running before a session starts (Codex: its App Server), and installed and signed in.
async function ensureAgentReady(driver = currentAgent()) {
  try {
    await driver.prepare(agentContext());
    appServerError = null;
  } catch (error) {
    appServerError = error.message;
    throw error;
  }
}

async function refreshSkill(forceReload = false) {
  currentSkill = await currentAgent().skill({ ...agentContext(), force: forceReload });
  appServerError = null;
  return currentSkill;
}

async function agentModels(id) {
  const driver = id ? agentRegistry().get(id) : currentAgent();
  try {
    return { agent: driver.id, ...(await driver.models(agentContext())) };
  } catch {
    return { agent: driver.id, models: [], defaultModel: "", defaultEffort: "", efforts: [] };
  }
}

// Driver events become run steps and transcript entries, for the driver whose run is active.
function wireAgent(driver) {
  const forActive = (handler) => (payload = {}) => {
    if (!activeJob || activeJob.agent !== driver.id) return;
    try { handler(payload); } catch (error) { failActiveJob(error); }
  };
  driver.on("tool", forActive(({ phase, method, item }) => {
    if (updateSteps(activeJob.runId, phase, item)) queueRunEvent(activeJob.runId, { kind: "activity", method, text: describeItem(item) });
  }));
  driver.on("message", forActive(({ method, text }) => queueRunEvent(activeJob.runId, { kind: "agent", method, text: String(text).slice(0, 20000) })));
  driver.on("log", forActive(({ method, text }) => queueRunEvent(activeJob.runId, { kind: "log", method, text: String(text).slice(0, 20000) })));
  driver.on("stderr", forActive(({ kind, text }) => queueRunEvent(activeJob.runId, { kind: kind || "agent-stderr", text: String(text).slice(-4000) })));
  driver.on("step", forActive(({ method, text }) => queueRunEvent(activeJob.runId, { kind: "event", method, text })));
  driver.on("usage", forActive((usage) => store().addUsage(activeJob.runId, usage)));
  driver.on("session", forActive(({ sessionId }) => {
    activeJob.sessionId = sessionId;
    store().setAgent(activeJob.runId, { id: driver.id, sessionId });
  }));
  driver.on("approval", forActive((request) => onAgentApproval(driver, request)));
  driver.on("done", forActive((done) => finishActiveJob(driver, done)));
  driver.on("error", (payload = {}) => onAgentError(driver, payload));
}

function onAgentApproval(driver, { requestId, method, params, message }) {
  const automatic = automaticApproval(message, store().runDirectory(activeJob.runId));
  if (automatic) {
    driver.decide(requestId, automatic.decision);
    queueRunEvent(activeJob.runId, { kind: "approval-decision", requestId, method, decision: automatic.decision, text: automatic.label });
    return;
  }
  queueRunEvent(activeJob.runId, { kind: "approval-request", requestId, method, params: compact(params) });
  send("forge3d:approval", { requestId, method, params: compact(params) });
  sendState();
}

function finishActiveJob(driver, { status, error = null, turnId = null }) {
  const runId = activeJob.runId;
  flushRunEvents();
  if (turnId) store().setAgent(runId, { id: driver.id, turnId });
  store().setStatus(runId, status, error);
  store().refreshArtifacts(runId);
  activeJob = null;
  driver.endSession();
  sendState();
}

// fatal: the agent stopped (its process exited or its output could not be read). method: a line for the run's log.
// notify: a protocol problem worth a toast.
function onAgentError(driver, { message, fatal = false, method = null, notify = false, internal = false }) {
  const ours = activeJob && activeJob.agent === driver.id;
  if (notify || internal) send("forge3d:error", message);
  if (fatal) {
    if (!ours && driver.id !== agentSettings.agent()) return; // an agent no longer in use
    try { flushRunEvents(); } catch {}
    appServerError = message;
    if (ours) {
      try { store().setStatus(activeJob.runId, "failed", message); } catch {}
      activeJob = null;
    }
    try { sendState(); } catch {}
    return;
  }
  if (ours && method) queueRunEvent(activeJob.runId, { kind: "error", method, text: message });
}

function promptWithPolicy(manifest) {
  const quality = manifest.settings?.quality || "production";
  const gaussianDensity = quality === "draft" ? 65536 : quality === "balanced" ? 131072 : 262144;
  return [
    manifest.prompt,
    "Work only inside this Forge3D run directory. Never overwrite an existing artifact; create a numbered version.",
    "This desktop is local-only. Never use a cloud provider, upload a user file, or request cloud approval.",
    `Workflow: ${manifest.workflow_route}; quality: ${quality}; target: ${manifest.settings?.target_format}; tool/model: ${manifest.settings?.tool}.`,
    "The desktop host has already detected local Blender, Godot, WSL, and the model directory and provided their paths in environment variables. Start production immediately. Do not rerun forge3d doctor, inspect CLI help, rediscover tools, reinstall packages, inspect plugin source, or launch review applications unless the first production command fails.",
    `Use one production pass and at most one targeted correction. For a splat, create one clean reference, then invoke exactly: forge3d models run triposplat <reference-image> --output-dir <versioned-output> --gaussians ${gaussianDensity} --json. Do not try local-run or alternate model commands. Preserve the PLY and SPLAT outputs and create only the minimum interaction proxy.`,
    "Perform one consolidated validation pass. Do not make redundant screenshots, orbit renders, duplicate reports, or optional integration probes.",
    "The Forge3D host exclusively owns run.json. Do not create, edit, replace, rename, or delete it. Write validation evidence to separate files and return artifact paths relative to this run directory.",
  ].join("\n\n");
}

function runAttachments(manifest, directory) {
  return (manifest.inputs || []).map((item) => ({
    path: resolveContained(directory, item.path),
    relative: item.path,
    mediaType: String(item.media_type || ""),
  }));
}

// Starts or continues a run with the chosen agent. A run continues in its own session when that session belongs to
// the chosen agent; otherwise (a run from the other agent, or a copy that never ran) a new session gets the whole
// brief followed by the note.
async function beginRun(manifest, { model = "auto", effort = "auto", continuation = null } = {}) {
  if (activeJob) throw new Error("Forge3D already has an active job");
  const driver = currentAgent();
  await ensureAgentReady(driver);
  if (!currentSkill) await refreshSkill(false);
  const directory = store().runDirectory(manifest.run_id);
  store().setStatus(manifest.run_id, "launching");
  activeJob = { runId: manifest.run_id, agent: driver.id, sessionId: null, turnId: null };
  sendState();
  try {
    const previous = agentSession(manifest);
    const resume = previous.id === driver.id ? previous.sessionId : null;
    const brief = promptWithPolicy(manifest);
    const fresh = continuation ? `${brief}\n\n${continuation}` : brief;
    const session = await driver.startSession({
      cwd: directory,
      workspace: agentWorkspace(),
      env: agentEnvironment(),
      project: projectSummary(),
      mcp: generatedMcpConfig(runtimeState),
      skillDir: bundledPlugin(),
      skill: currentSkill,
      model,
      effort,
      resume,
    });
    activeJob.sessionId = session.sessionId;
    const turn = await driver.send(resume ? continuation : fresh, resume ? [] : runAttachments(manifest, directory), { fresh });
    activeJob.turnId = turn.turnId;
    store().setAgent(manifest.run_id, { id: driver.id, sessionId: session.sessionId, turnId: turn.turnId });
    store().setStatus(manifest.run_id, "running");
    store().appendEvent(manifest.run_id, { kind: "user", text: continuation || manifest.prompt });
    sendState();
    return currentState();
  } catch (error) {
    store().setStatus(manifest.run_id, "failed", error.message);
    activeJob = null;
    driver.endSession();
    sendState();
    throw error;
  }
}

function updateSteps(runId, phase, item) {
  if (!item?.id || !VISIBLE_ITEM_TYPES.has(item.type)) return false;
  store().update(runId, (manifest) => applyStep(manifest, phase, item));
  return true;
}

// Choosing the agent. A Codex App Server left running is stopped, and the setup check runs again for the new one.
async function setAgent(id) {
  if (activeJob) throw new Error("Wait for the active run to finish, or cancel it, before changing the agent");
  const previous = agentSettings.agent();
  const result = agentSettings.setAgent(id);
  if (previous !== result.agent) {
    currentSkill = null;
    appServerError = null;
    if (agents) await agentRegistry().get(previous).close().catch(() => {});
    capabilitiesService().invalidate();
    sendState();
  }
  return result;
}

// { agent, statuses: { claude: {...}, codex: {...} } }: what the setup card shows for each choice.
async function agentStatus({ force = false } = {}) {
  const registry = agentRegistry();
  const entries = await Promise.all(registry.listAgents().map(async (agent) => {
    try {
      return [agent.id, { ...agent, ...(await registry.get(agent.id).status({ force })) }];
    } catch (error) {
      return [agent.id, { ...agent, installed: false, signedIn: false, version: "", path: "", reason: error.message, fix: "" }];
    }
  }));
  return { agent: agentSettings.agent(), statuses: Object.fromEntries(entries) };
}

// The renderer paints its own application bar, so on Windows the native caption is
// hidden and only the system window controls are drawn over the reserved inset.
// The colours follow the theme (renderer style.css: --bar and --muted, dark and light).
const CHROME_COLORS = {
  dark: { bar: "#141210", symbol: "#a39a90" },
  light: { bar: "#faf7f2", symbol: "#5c544c" },
};

function chromeColors() {
  return nativeTheme.shouldUseDarkColors ? CHROME_COLORS.dark : CHROME_COLORS.light;
}

function titleBarOptions() {
  if (process.platform !== "win32") return {};
  const colors = chromeColors();
  return {
    titleBarStyle: "hidden",
    titleBarOverlay: { color: colors.bar, symbolColor: colors.symbol, height: TITLE_BAR_HEIGHT },
  };
}

function applyChromeColors() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  const colors = chromeColors();
  mainWindow.setBackgroundColor(colors.bar);
  if (process.platform === "win32") mainWindow.setTitleBarOverlay({ color: colors.bar, symbolColor: colors.symbol, height: TITLE_BAR_HEIGHT });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1540,
    height: 980,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: chromeColors().bar,
    title: "Forge3D",
    show: false,
    ...titleBarOptions(),
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      webSecurity: true,
      spellcheck: true,
    },
  });
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!rendererUrlAllowed(url)) event.preventDefault();
  });
  mainWindow.once("ready-to-show", () => mainWindow.show());
  // The window title belongs to the project ("● Name — Forge3D"), so the page's own <title> never replaces it.
  mainWindow.on("page-title-updated", (event) => event.preventDefault());
  mainWindow.on("close", onWindowClose);
  updateWindowTitle();
  const dev = process.env.FORGE3D_DEV_SERVER_URL;
  if (dev) mainWindow.loadURL(dev);
  else mainWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));
}

function registerIpc() {
  handle("forge3d:bootstrap", async () => {
    try {
      await refreshSkill(false);
    } catch (error) {
      appServerError = error.message;
    }
    const info = await agentModels();
    return { ...currentState(), models: info.models, modelDefaults: { model: info.defaultModel || "", effort: info.defaultEffort || "" } };
  });

  handle("forge3d:pick-attachments", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: "Add Forge3D attachments",
      properties: ["openFile", "multiSelections"],
      filters: [
        { name: "Forge3D inputs", extensions: ["png", "jpg", "jpeg", "webp", "gif", "glb", "gltf", "blend", "fbx", "obj", "ply", "splat", "sog", "spz", "ksplat", "json", "txt", "md"] },
        { name: "All files", extensions: ["*"] },
      ],
    });
    return result.canceled ? [] : result.filePaths.slice(0, 12);
  });

  // The agent is checked (installed, signed in, started) before the run folder is made, so a missing agent leaves
  // no run behind that never started.
  handle("forge3d:start-run", async (payload = {}) => {
    store();
    if (activeJob) throw new Error("Forge3D already has an active job");
    await ensureAgentReady();
    const manifest = await store().create(payload);
    return beginRun(manifest, payload);
  });

  handle("forge3d:continue-run", async (payload = {}) => {
    const loaded = store().find(payload.runId, false).manifest;
    const text = typeof payload.text === "string" && payload.text.trim() ? payload.text.trim() : "Continue this Forge3D run from its saved state, verify existing artifacts, and finish the requested result.";
    return beginRun(loaded, { ...payload, continuation: text });
  });

  handle("forge3d:steer", async (payload = {}) => {
    if (!activeJob || payload.runId !== activeJob.runId) throw new Error("This run is not active");
    if (typeof payload.text !== "string" || !payload.text.trim()) throw new Error("Steering text is required");
    await jobAgent().steer(payload.text.trim());
    store().appendEvent(activeJob.runId, { kind: "user-steer", text: payload.text.trim() });
    return currentState();
  });

  handle("forge3d:cancel", async (payload = {}) => {
    if (!activeJob || payload.runId !== activeJob.runId) throw new Error("This run is not active");
    store().setStatus(activeJob.runId, "cancelling");
    await jobAgent().interrupt();
    sendState();
    return currentState();
  });

  handle("forge3d:approval", async (payload = {}) => {
    if (!activeJob) throw new Error("No active job is awaiting approval");
    jobAgent().decide(payload.requestId, payload.decision);
    store().appendEvent(activeJob.runId, { kind: "approval-decision", requestId: payload.requestId, decision: payload.decision });
    return currentState();
  });

  handle("forge3d:duplicate", async (payload = {}) => store().duplicate(payload.runId));
  handle("forge3d:archive", async (payload = {}) => {
    if (activeJob?.runId === payload.runId) throw new Error("Cancel the active job before archiving it");
    return store().archive(payload.runId);
  });
  handle("forge3d:trash", async (payload = {}) => {
    if (activeJob?.runId === payload.runId) throw new Error("Cancel the active job before moving it to trash");
    const directory = store().runDirectory(payload.runId);
    await shell.trashItem(directory);
    sendState();
    return { recoverable: true };
  });

  handle("forge3d:artifact-action", async (payload = {}) => {
    const absolute = store().resolveArtifact(payload.runId, payload.path);
    if (payload.action === "reveal") shell.showItemInFolder(absolute);
    else if (payload.action === "copy") clipboard.writeText(absolute);
    else if (payload.action === "open") {
      const error = await shell.openPath(absolute);
      if (error) throw new Error(error);
    } else if (payload.action === "blender") {
      const blender = externalTools(true).blender;
      if (!blender) throw new Error("Blender was not detected");
      spawn(blender, [absolute], { detached: true, windowsHide: true, stdio: "ignore" }).unref();
    } else if (payload.action === "godot") {
      await godotPrimePromise;
      const godot = externalTools(true).godot;
      if (!godot) throw new Error("Godot was not detected");
      const reviewRoot = resolveContained(runtimeState.godot, "imports");
      const destinationRoot = resolveContained(reviewRoot, payload.runId);
      fs.mkdirSync(destinationRoot, { recursive: true });
      const destination = resolveContained(destinationRoot, path.basename(absolute));
      fs.copyFileSync(absolute, destination);
      spawn(godot, ["--editor", "--path", runtimeState.godot], { detached: true, windowsHide: true, stdio: "ignore" }).unref();
    } else throw new Error("Unsupported artifact action");
    return { path: absolute };
  });

  handle("forge3d:export-artifact", async (payload = {}) => {
    if (activeJob) throw new Error("Wait for the active run to finish before exporting");
    const manifest = store().find(payload.runId, false).manifest;
    const artifact = (manifest.artifacts || []).find((item) => item.path === payload.path);
    if (!artifact) throw new Error("The selected artifact is no longer available");
    const formats = exportFormatsForArtifact(artifact);
    if (!formats.length) throw new Error("This file is not a supported 3D export source");
    const buttons = [...formats.map((item) => item.label), "Cancel"];
    const choice = await dialog.showMessageBox(mainWindow, {
      type: "question",
      title: "Export asset",
      message: artifact.preview_role === "gaussian-splat" ? "Create a Blender package for this Gaussian splat" : "Choose an export format",
      detail: artifact.preview_role === "gaussian-splat"
        ? "The Blend file preserves the Gaussian representation through KIRI Engine. It does not pretend the splat is a polygon mesh."
        : "Forge3D creates a new versioned export inside this run. Existing files are never overwritten.",
      buttons,
      cancelId: buttons.length - 1,
      defaultId: 0,
      noLink: true,
    });
    if (choice.response >= formats.length) return { canceled: true };
    const absolute = store().resolveArtifact(payload.runId, payload.path);
    const result = await exportArtifact({
      source: absolute,
      artifact,
      runDirectory: store().runDirectory(payload.runId),
      format: formats[choice.response].id,
      blender: externalTools(true).blender,
      toolkitRoot: bundledToolkit(),
    });
    store().refreshArtifacts(payload.runId);
    sendState();
    return result;
  });

  handle("forge3d:repair-plugin", async () => {
    if (agentSettings.agent() !== "codex") throw new Error("Claude Code loads the Forge3D plugin from this app each run, so there is nothing to repair.");
    const result = repairForgePlugin({ bundledPlugin: bundledPlugin(), runtimeState });
    await refreshSkill(true);
    sendState();
    return { ...result, skill: currentSkill };
  });
  handle("forge3d:set-theme", async (payload) => {
    if (!["system", "light", "dark"].includes(payload)) throw new Error("Unknown theme");
    nativeTheme.themeSource = payload;
    return payload;
  });
  nativeTheme.on("updated", applyChromeColors);
  handle("forge3d:capabilities", (payload = {}) => capabilitiesService().get({ force: Boolean(payload?.force) }));
  handle("forge3d:agent-settings", () => agentSettings.get());
  handle("forge3d:set-agent", (payload) => setAgent(typeof payload === "string" ? payload : payload?.agent));
  handle("forge3d:agent-status", (payload = {}) => agentStatus(payload));
  handle("forge3d:models", (payload = {}) => agentModels(payload?.agent));
  handle("forge3d:project-new", (payload = {}) => newProject(payload));
  handle("forge3d:project-open", (payload = {}) => openProject(payload));
  handle("forge3d:project-open-recovered", (payload = {}) => openRecovered(payload));
  handle("forge3d:project-save", async () => ({ saved: await saveProject(), ...currentState() }));
  handle("forge3d:project-save-as", async () => ({ saved: await saveProjectAs(), ...currentState() }));
  handle("forge3d:project-close", () => closeProject());
  handle("forge3d:project-rename", (payload = {}) => renameOpenProject(payload));
  handle("forge3d:project-delete", () => deleteOpenProject());
  handle("forge3d:project-reveal", async () => {
    if (!project) throw new Error("No project is open");
    if (project.file) shell.showItemInFolder(project.file);
    else await shell.openPath(project.folder);
    return { path: project.file || project.folder };
  });
  // Run settings belong to the project and make it unsaved. The selection is written to a saved project's file as
  // it changes, without asking and without making the project unsaved.
  handle("forge3d:project-settings", (payload = {}) => {
    if (!project) return null;
    project.settings = sanitizeSettings(payload);
    updateWindowTitle();
    return projectSummary();
  });
  handle("forge3d:project-view", (payload = {}) => {
    if (!project) return null;
    project.view = sanitizeView(payload);
    if (!project.untitled) {
      try {
        project.manifest = writeProjectView(project.file, project.manifest, project.view);
      } catch (error) {
        send("forge3d:error", `Forge3D could not keep the selection in the project file: ${error.message}`);
      }
    }
    return null;
  });
  handle("forge3d:recent-remove", (payload = {}) => {
    if (typeof payload.path !== "string") throw new Error("A project path is required");
    recentProjects.remove(payload.path);
    sendState();
    return currentState();
  });
  handle("forge3d:recent-clear", () => {
    recentProjects.clear();
    sendState();
    return currentState();
  });
  handle("forge3d:project-preferences", (payload = {}) => {
    recentProjects.setPreferences({ reopenLast: payload.reopenLast });
    return currentState();
  });
  handle("forge3d:refresh-tools", async (payload = {}) => {
    if (payload.force) externalTools(true);
    updateWindowTitle();
    return currentState();
  });
}

app.whenReady().then(async () => {
  if (!singleInstance) return;
  const legacyLibrary = path.join(app.getPath("documents"), "Forge3D");
  const localStateRoot = path.join(process.env.LOCALAPPDATA || app.getPath("appData"), "Instrumenta", "Forge3D");
  const resourceBase = app.isPackaged ? process.resourcesPath : path.join(repoRoot, "desktop");
  runtimeState = ensureRuntimeState(localStateRoot, resourceBase);
  if (!app.isPackaged && !fs.existsSync(path.join(runtimeState.godot, ".forge3d-template-version"))) {
    fs.cpSync(path.join(repoRoot, "godot"), runtimeState.godot, { recursive: true, force: true, filter: (item) => !item.includes(`${path.sep}.godot${path.sep}`) });
    fs.writeFileSync(path.join(runtimeState.godot, ".forge3d-template-version"), `${BUNDLE_VERSION}\n`, "utf8");
  }
  recentProjects = new RecentProjects(path.join(runtimeState.root, "config", "recent-projects.json"));
  agentSettings = new AgentSettings(path.join(runtimeState.root, "config", "settings.json"));
  if (!recentProjects.legacyAdopted()) {
    try {
      const adopted = adoptLegacyLibrary(legacyLibrary, { appVersion: BUNDLE_VERSION });
      if (adopted) recentProjects.add(adopted);
      recentProjects.markLegacyAdopted();
    } catch (error) {
      console.error(`Forge3D could not adopt the earlier run library: ${error.message}`);
    }
  }
  refreshRecoverable();
  // The start screen is the default. A project named on the command line, or the last one when the person turned
  // "Reopen the last project" on, opens straight away instead.
  const launchFile = projectFromArgv(process.argv.slice(1)) || recentProjects.launchProject();
  let launchError = null;
  if (launchFile) {
    try { openSession({ file: launchFile, folder: path.dirname(launchFile), manifest: readProject(launchFile) }); } catch (error) { launchError = error.message; }
  }

  protocol.handle("forge3d-artifact", (request) => {
    if (!runStore) return new Response("No project is open", { status: 404 });
    const url = new URL(request.url);
    const runId = url.hostname;
    const relative = decodeURIComponent(url.pathname.replace(/^\//, ""));
    const absolute = runStore.resolveArtifact(runId, relative);
    return net.fetch(pathToFileURL(absolute).toString());
  });
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  session.defaultSession.setPermissionCheckHandler(() => false);
  registerIpc();
  createWindow();
  if (launchError) mainWindow.webContents.once("did-finish-load", () => send("forge3d:error", `Forge3D could not reopen the project: ${launchError}`));
  const godot = externalTools(true).godot;
  if (godot) {
    godotPrimePromise = primeGodotProject(runtimeState, godot);
    godotPrimePromise.catch((error) => send("forge3d:error", `Godot project setup failed: ${error.message}`));
  }
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("second-instance", (_event, argv) => onSecondInstance(argv));
app.on("before-quit", () => {
  try { flushRunEvents(); } catch {}
  agents?.closeAllNow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});