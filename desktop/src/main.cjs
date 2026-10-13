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
const { CodexAppServerClient } = require("./lib/codex-client.cjs");
const { RunStore } = require("./lib/run-store.cjs");
const {
  BUNDLE_VERSION,
  detectExternalTools,
  detectWslModelsDirectory,
  ensureRuntimeState,
  findCodexExecutable,
  inspectForgeSkill,
  primeGodotProject,
  repairForgePlugin,
} = require("./lib/runtime.cjs");
const { resolveContained } = require("./lib/path-policy.cjs");
const { automaticApproval } = require("./lib/approval-policy.cjs");
const { exportArtifact, exportFormatsForArtifact } = require("./lib/export-service.cjs");
const { createCapabilitiesService } = require("./lib/capabilities-service.cjs");
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
  readProject,
  recoverableScratch,
  runsRoot,
  sameSettings,
  samePath,
  sanitizeSettings,
  sanitizeView,
  scratchFolder,
  windowTitle,
  writeProject,
} = require("./lib/project-store.cjs");

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
let codexClient = null;
let currentSkill = null;
let activeJob = null;
let appServerError = null;
let detectedTools = null;
let runEventTimer = null;
let godotPrimePromise = Promise.resolve();
const pendingRunEvents = new Map();
const VISIBLE_ITEM_TYPES = new Set(["commandExecution", "mcpToolCall", "fileChange", "dynamicToolCall", "imageGeneration", "webSearch"]);
const APPROVAL_METHODS = new Set([
  "item/commandExecution/requestApproval",
  "item/fileChange/requestApproval",
  "mcpServer/elicitation/request",
]);

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
  if (source.untitled) {
    try { fs.rmSync(source.folder, { recursive: true, force: true }); } catch {}
  }
  openSession({ file: layout.file, folder: layout.folder, manifest });
  return true;
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

async function closeProject() {
  if (!project) return currentState();
  assertIdle("closing the project");
  const { proceed, discard } = await confirmLeave("closing it");
  if (!proceed) return { canceled: true, ...currentState() };
  await leaveSession({ discard });
  sendState();
  return currentState();
}

function onWindowClose(event) {
  if (allowWindowClose || !project) return;
  if (!projectDirty()) {
    if (project.untitled) leaveSession();
    return;
  }
  event.preventDefault();
  confirmLeave("closing Forge3D").then(async ({ proceed, discard }) => {
    if (!proceed) return;
    if (discard && activeJob) {
      codexClient?.close();
      activeJob = null;
    }
    await leaveSession({ discard });
    allowWindowClose = true;
    mainWindow.close();
  }).catch((error) => send("forge3d:error", error.message));
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
  const message = `Forge3D could not process Codex activity: ${error.message}`;
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
      env: { ...process.env, FORGE3D_TOOLKIT_ROOT: bundledToolkit(), FORGE3D_PLUGIN_ROOT: bundledPlugin() },
    });
  }
  return capabilitiesServiceInstance;
}

// Codex App Server runs inside the open project's runs folder (or the local state root on the start screen).
// Switching projects retires the old server; the next request starts one in the new place.
function codexWorkspace() {
  return runStore?.root || runtimeState.root;
}

async function ensureCodex() {
  if (codexClient?.started && codexClient.cwd === codexWorkspace()) return codexClient;
  if (codexClient?.started && !activeJob) {
    const retired = codexClient;
    codexClient = null;
    currentSkill = null;
    retired.close();
  } else if (codexClient?.started) return codexClient;
  const executable = findCodexExecutable();
  const binDirectory = app.isPackaged ? path.join(process.resourcesPath, "bin") : path.join(repoRoot, ".venv", "Scripts");
  const tools = externalTools();
  const wslModelsDirectory = process.env.FORGE3D_WSL_MODELS_DIR || detectWslModelsDirectory(tools.wsl);
  const env = {
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
  const client = new CodexAppServerClient({ command: executable, cwd: codexWorkspace(), env });
  codexClient = client;
  codexClient.on("notification", (message) => {
    try { onCodexNotification(message); } catch (error) { failActiveJob(error); }
  });
  codexClient.on("request", (message) => {
    try { onCodexRequest(message); } catch (error) { failActiveJob(error); }
  });
  codexClient.on("protocolError", (error) => send("forge3d:error", error.message));
  codexClient.on("stderr", (text) => {
    if (activeJob) queueRunEvent(activeJob.runId, { kind: "app-server-stderr", text: String(text).slice(-4000) });
  });
  codexClient.on("exit", ({ detail }) => {
    if (client !== codexClient) return; // a retired server from an earlier project
    try { flushRunEvents(); } catch {}
    appServerError = detail || "Codex App Server stopped unexpectedly";
    if (activeJob) {
      store().setStatus(activeJob.runId, "failed", appServerError);
      activeJob = null;
    }
    sendState();
  });
  try {
    await codexClient.start();
    appServerError = null;
  } catch (error) {
    appServerError = error.message;
    codexClient = null;
    throw error;
  }
  return codexClient;
}

async function refreshSkill(forceReload = false) {
  const client = await ensureCodex();
  const skills = await client.listSkills(codexWorkspace(), forceReload);
  const installed = skills.find((skill) => skill.name === "forge3d" && skill.enabled !== false) || null;
  currentSkill = inspectForgeSkill(installed);
  if (!installed) {
    const fallback = path.join(bundledPlugin(), "skills", "forge3d", "SKILL.md");
    currentSkill = { ...currentSkill, path: fallback, state: "missing", usingBundledFallback: true };
  }
  return currentSkill;
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

async function beginRun(manifest, { model = "auto", effort = "auto", continuation = null } = {}) {
  if (activeJob) throw new Error("Forge3D already has an active job");
  const client = await ensureCodex();
  if (!currentSkill) await refreshSkill(false);
  const directory = store().runDirectory(manifest.run_id);
  store().setStatus(manifest.run_id, "launching");
  activeJob = { runId: manifest.run_id, threadId: null, turnId: null };
  sendState();
  try {
    let thread;
    if (manifest.codex?.thread_id) thread = await client.resumeThread(manifest.codex.thread_id);
    else thread = await client.startThread({ cwd: directory, model });
    const copiedImages = (manifest.inputs || [])
      .filter((item) => String(item.media_type || "").startsWith("image/"))
      .map((item) => resolveContained(directory, item.path));
    const turn = await client.startTurn({
      threadId: thread.id,
      prompt: continuation || promptWithPolicy(manifest),
      cwd: directory,
      skill: currentSkill,
      images: continuation ? [] : copiedImages,
      model,
      effort,
      allowNetwork: false,
    });
    activeJob = { runId: manifest.run_id, threadId: thread.id, turnId: turn.id };
    store().setCodex(manifest.run_id, thread.id, turn.id);
    store().setStatus(manifest.run_id, "running");
    store().appendEvent(manifest.run_id, { kind: "user", text: continuation || manifest.prompt });
    sendState();
    return currentState();
  } catch (error) {
    store().setStatus(manifest.run_id, "failed", error.message);
    activeJob = null;
    sendState();
    throw error;
  }
}

function onCodexRequest(message) {
  const params = message.params || {};
  const supported = APPROVAL_METHODS.has(message.method);
  if (!supported) {
    codexClient.reject(message.id, `Forge3D does not support App Server request ${message.method}`);
    if (activeJob) queueRunEvent(activeJob.runId, { kind: "error", method: message.method, text: "Unsupported App Server request was rejected safely." });
    return;
  }
  if (!activeJob || params.threadId !== activeJob.threadId || (params.turnId && params.turnId !== activeJob.turnId)) {
    codexClient.decide(message.id, "cancel");
    return;
  }
  const automatic = automaticApproval(message, store().runDirectory(activeJob.runId));
  if (automatic) {
    codexClient.decide(message.id, automatic.decision);
    queueRunEvent(activeJob.runId, {
      kind: "approval-decision",
      requestId: message.id,
      method: message.method,
      decision: automatic.decision,
      text: automatic.label,
    });
    return;
  }
  queueRunEvent(activeJob.runId, { kind: "approval-request", requestId: message.id, method: message.method, params: compact(params) });
  send("forge3d:approval", { requestId: message.id, method: message.method, params: compact(params) });
  sendState();
}

function describeItem(item) {
  if (Array.isArray(item.command)) return item.command.join(" ");
  if (typeof item.command === "string") return item.command;
  if (item.type === "mcpToolCall") return [item.server, item.tool].filter(Boolean).join(" · ") || "MCP tool";
  if (item.type === "fileChange") return `${item.changes?.length || 0} file change${item.changes?.length === 1 ? "" : "s"}`;
  return item.name || item.type || "Work";
}

function presentItem(item) {
  const raw = describeItem(item);
  const lower = raw.toLowerCase();
  if (item.type === "imageGeneration") return { phase: "reference", name: "Prepare reference", detail: "Creating the source image" };
  if (item.type === "fileChange") return { phase: "package", name: "Package deliverables", detail: "Saving generated files" };
  if (/triposplat|models run|gaussian|candidate\.(splat|ply)/.test(lower)) return { phase: "generate", name: "Generate asset", detail: "Generating the Gaussian splat locally" };
  if (/validat|report|quality check|doctor/.test(lower)) return { phase: "validate", name: "Check quality", detail: "Checking output quality" };
  if (/export|proxy|collision|save|convert/.test(lower)) return { phase: "package", name: "Package deliverables", detail: "Preparing reusable output files" };
  if (/blender|procedural|forge3d_task/.test(lower)) return { phase: "generate", name: "Generate asset", detail: "Building the asset in Blender" };
  return { phase: "local", name: "Local processing", detail: item.type === "mcpToolCall" ? "Using a local 3D tool" : "Running a local production task" };
}

function updateSteps(runId, method, params) {
  const item = params.item;
  if (!item?.id || !VISIBLE_ITEM_TYPES.has(item.type)) return false;
  store().update(runId, (manifest) => {
    manifest.steps ||= [];
    let step = manifest.steps.find((candidate) => candidate.item_id === item.id);
    if (!step) {
      step = { item_id: item.id, name: item.type || "work", status: "running", started_at: new Date().toISOString() };
      manifest.steps.push(step);
    }
    const presented = presentItem(item);
    step.status = method === "item/completed" ? (item.status || "completed") : (item.status || "running");
    step.phase = presented.phase;
    step.name = presented.name;
    step.detail = presented.detail;
    if (method === "item/completed") step.completed_at = new Date().toISOString();
  });
  return true;
}

function onCodexNotification(message) {
  if (!activeJob) return;
  const params = message.params || {};
  const scopedThread = params.threadId || params.thread?.id;
  if (scopedThread && scopedThread !== activeJob.threadId) return;

  const itemLifecycle = message.method === "item/started" || message.method === "item/completed";
  const visibleItem = itemLifecycle && updateSteps(activeJob.runId, message.method, params);
  const delta = params.delta;
  if (typeof delta === "string") {
    if (message.method.includes("agentMessage")) {
      queueRunEvent(activeJob.runId, { kind: "agent", method: message.method, text: delta.slice(0, 20000) });
    } else if (message.method.includes("outputDelta")) {
      queueRunEvent(activeJob.runId, { kind: "log", method: message.method, text: delta.slice(0, 20000) });
    }
  } else if (visibleItem) {
    queueRunEvent(activeJob.runId, { kind: "activity", method: message.method, text: describeItem(params.item) });
  } else if (message.method === "turn/started" || message.method === "turn/completed") {
    queueRunEvent(activeJob.runId, { kind: "event", method: message.method, text: message.method === "turn/started" ? "Codex turn started." : "Codex turn finished." });
  }

  if (message.method === "turn/completed") {
    flushRunEvents();
    const turn = params.turn || {};
    const rawStatus = turn.status || "failed";
    const status = rawStatus === "completed" ? "completed" : rawStatus === "interrupted" ? "interrupted" : "failed";
    const failure = turn.error?.message || (status === "failed" ? "The Codex turn failed" : null);
    store().setStatus(activeJob.runId, status, failure);
    store().refreshArtifacts(activeJob.runId);
    activeJob = null;
    sendState();
  }
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
    let models = [];
    if (codexClient?.started) {
      try {
        const result = await codexClient.request("model/list", { limit: 50, includeHidden: false });
        models = result?.data || [];
      } catch {}
    }
    return { ...currentState(), models };
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

  handle("forge3d:start-run", async (payload = {}) => {
    store();
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
    await codexClient.steer(activeJob.threadId, activeJob.turnId, payload.text.trim());
    store().appendEvent(activeJob.runId, { kind: "user-steer", text: payload.text.trim() });
    return currentState();
  });

  handle("forge3d:cancel", async (payload = {}) => {
    if (!activeJob || payload.runId !== activeJob.runId) throw new Error("This run is not active");
    store().setStatus(activeJob.runId, "cancelling");
    await codexClient.interrupt(activeJob.threadId, activeJob.turnId);
    sendState();
    return currentState();
  });

  handle("forge3d:approval", async (payload = {}) => {
    if (!activeJob) throw new Error("No active job is awaiting approval");
    codexClient.decide(payload.requestId, payload.decision);
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
  handle("forge3d:project-new", (payload = {}) => newProject(payload));
  handle("forge3d:project-open", (payload = {}) => openProject(payload));
  handle("forge3d:project-open-recovered", (payload = {}) => openRecovered(payload));
  handle("forge3d:project-save", async () => ({ saved: await saveProject(), ...currentState() }));
  handle("forge3d:project-save-as", async () => ({ saved: await saveProjectAs(), ...currentState() }));
  handle("forge3d:project-close", () => closeProject());
  handle("forge3d:project-reveal", async () => {
    if (!project) throw new Error("No project is open");
    if (project.file) shell.showItemInFolder(project.file);
    else await shell.openPath(project.folder);
    return { path: project.file || project.folder };
  });
  // Run settings belong to the project and make it unsaved; the selection is remembered without asking.
  handle("forge3d:project-settings", (payload = {}) => {
    if (!project) return null;
    project.settings = sanitizeSettings(payload);
    updateWindowTitle();
    return projectSummary();
  });
  handle("forge3d:project-view", (payload = {}) => {
    if (!project) return null;
    project.view = sanitizeView(payload);
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
  const legacyLibrary = path.join(app.getPath("documents"), "Forge3D");
  const localStateRoot = path.join(process.env.LOCALAPPDATA || app.getPath("appData"), "Instrumenta", "Forge3D");
  const resourceBase = app.isPackaged ? process.resourcesPath : path.join(repoRoot, "desktop");
  runtimeState = ensureRuntimeState(localStateRoot, resourceBase);
  if (!app.isPackaged && !fs.existsSync(path.join(runtimeState.godot, ".forge3d-template-version"))) {
    fs.cpSync(path.join(repoRoot, "godot"), runtimeState.godot, { recursive: true, force: true, filter: (item) => !item.includes(`${path.sep}.godot${path.sep}`) });
    fs.writeFileSync(path.join(runtimeState.godot, ".forge3d-template-version"), `${BUNDLE_VERSION}\n`, "utf8");
  }
  recentProjects = new RecentProjects(path.join(runtimeState.root, "config", "recent-projects.json"));
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

app.on("before-quit", () => {
  try { flushRunEvents(); } catch {}
  codexClient?.close();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});