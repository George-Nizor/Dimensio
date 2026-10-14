import "./style.css";
import "./brand/fonts/fonts.css";
import "./brand/instrumenta-icons.css";
import InstrumentaIcons from "./brand/instrumenta-icons.js";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { SparkRenderer, SplatMesh } from "@sparkjsdev/spark";
import { filmstripArtifacts, selectedArtifactForRun } from "./preview-routing.mjs";
import { normalizeRunSettings, readRunSettings, writeRunSettings } from "./preferences.mjs";
import { displayFolder, fileMenuModel, projectTitle, shortcutCommand } from "./project-view.mjs";
import { summarizeRunSteps } from "./run-presentation.mjs";
import { agentChoices, deriveReadiness, isImagePath, runGate, setupHeadline, splitFix, statusEntries, toolVersionsFromReport, formatElapsed, sentenceCase } from "./readiness.mjs";
import { stageState } from "./stage-state.mjs";
import { icon, themeIcon } from "./icons.mjs";

// Brand v2 cube from Instrumenta's icon library (a UMD file; the bundler hands over its exports). Built from presentation
// attributes only, so it is safe under this window's Content-Security-Policy.
const brandIcon = (size, label = "") => InstrumentaIcons.render("forge3d", { size, label });

const api = window.forge3d;
const app = document.querySelector("#app");

// project: undefined until the main process has answered, then null (the start screen) or the open project.
let state = { runs: [], tools: {}, models: [], skill: null, activeJob: null, project: undefined, recent: [], recoverable: [], preferences: { reopenLast: false } };
let selectedRunId = null;
let selectedArtifactPath = null;
let attachments = [];
let approval = null;
let previewDispose = () => {};
let refreshTimer = null;
let viewportApi = null;
// The capability report (docs/capabilities.md): null until the first answer, then { ok: true, ...report } or
// { ok: false, error, fix }. capsChecking is true while a check is in flight; the last answer stays on screen meanwhile.
let capabilities = null;
let capsChecking = false;
// window.forge3d.agentStatus(): { agent, statuses: { claude: {...}, codex: {...} } }, for the agent choice on the setup card.
let agentStatuses = null;
let composing = false; // New run: no run is selected until one is picked or started
let showSetup = false; // the person opened the readiness card from the status bar or the Run chip
let previewKind = "";

const panels = { library: false, inspector: true };
const viewportTools = { transform: "orbit", shading: "rendered", grid: true };

function readPreference(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch { return fallback; }
}
function writePreference(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* preferences are optional */ }
}
Object.assign(panels, readPreference("forge3d.panels", panels));
Object.assign(viewportTools, readPreference("forge3d.viewport", viewportTools));

const selectOptions = {
  workflow: [["auto", "Auto route"], ["authored-blender", "Authored Blender"], ["image-to-mesh", "Image to mesh"], ["gaussian-splat", "Gaussian splat"], ["process", "Process existing"], ["rig", "Rig"], ["animate", "Animate"], ["retarget", "Retarget"], ["validate", "Validate"]],
  quality: [["production", "Production"], ["balanced", "Balanced"], ["draft", "Draft"]],
  target: [["splat", "Splat / PLY"], ["blend", "Blend"], ["glb", "GLB"], ["gif", "GIF / sequence"]],
  tool: [["auto", "Auto"], ["blender", "Blender"], ["triposplat", "TripoSplat"], ["spar3d", "SPAR3D"]],
  effort: [["auto", "Model default"], ["low", "Low"], ["medium", "Medium"], ["high", "High"], ["xhigh", "Extra high"]],
};
function optionMarkup(name) {
  return selectOptions[name].map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
}

app.innerHTML = `
  <header class="topbar">
    <div class="topbar-lead">
      <div class="brand ii-hover" id="brand" aria-label="Forge3D"><span class="brand-icon">${brandIcon(36)}</span><strong>Forge3D</strong></div>
      <button id="file-menu" class="ghost-action file-button" type="button" aria-haspopup="menu" aria-expanded="false" title="Projects: new, open, save">File${icon("chevronDown", 16)}</button>
      <span id="project-name" class="project-name hidden"></span>
    </div>

    <div class="omnibox">
      <div class="omnibox-field">
        <textarea id="prompt" rows="1" aria-label="Forge3D prompt" placeholder="Describe the asset or change…"></textarea>
        <button id="gate-chip" class="gate-chip hidden" type="button"></button>
        <kbd title="Ctrl + Enter runs the prompt">Ctrl ↵</kbd>
      </div>
      <div id="attachments" class="attachment-row"></div>
    </div>

    <div class="topbar-actions">
      <button id="attach" class="ghost-action" title="Attach source files">${icon("attach", 24)}<span>Attach</span></button>
      <span class="v-sep"></span>
      <button id="theme-toggle" class="icon-action"></button>
      <button id="settings-toggle" class="icon-action" aria-expanded="false" title="Run settings" aria-label="Run settings">${icon("gear", 24)}</button>
      <button id="cancel" class="icon-action danger hidden" title="Cancel the active run" aria-label="Cancel the active run">${icon("stop", 24)}</button>
      <button id="send" class="run-button" aria-disabled="false"></button>
    </div>

    <div id="topbar-progress" class="topbar-progress"></div>
  </header>

  <main class="stage">
    <div id="preview" class="viewport"></div>

    <nav class="toolrail" aria-label="Viewport tools">
      <button class="rail-button" data-transform="orbit" data-icon="orbit" title="Orbit" aria-label="Orbit"></button>
      <button class="rail-button" data-transform="pan" data-icon="pan" title="Pan" aria-label="Pan"></button>
      <button class="rail-button" data-action="frame" data-icon="frame" title="Frame the asset" aria-label="Frame the asset"></button>
      <div class="rail-sep"></div>
      <button class="rail-button" data-toggle="grid" data-icon="grid" title="Ground grid" aria-label="Ground grid"></button>
      <div class="rail-sep"></div>
      <button class="rail-button" data-shading="matte" data-icon="clay" title="Clay shading" aria-label="Clay shading"></button>
      <button class="rail-button" data-shading="rendered" data-icon="rendered" title="Rendered shading" aria-label="Rendered shading"></button>
      <button class="rail-button" data-shading="wireframe" data-icon="wire" title="Wireframe" aria-label="Wireframe"></button>
      <div class="rail-sep"></div>
      <button class="rail-button" data-action="capture" data-icon="capture" title="Capture the viewport" aria-label="Capture the viewport"></button>
      <button class="rail-button" data-action="fullscreen" data-icon="fullscreen" title="Fullscreen viewport" aria-label="Fullscreen viewport"></button>
    </nav>

    <div id="viewport-hud" class="viewport-hud"></div>

    <div class="dock-right">
      <aside id="library" class="panel library" aria-label="Run library">
        <header class="panel-head"><h2>Runs</h2><span id="run-count" class="head-count"></span></header>
        <div class="panel-tools">
          <button id="new-run" class="new-run">${icon("add", 16)}<span>New run</span></button>
          <label class="search-wrap">${icon("search", 16)}<input id="run-search" class="search" type="search" placeholder="Search runs" /></label>
        </div>
        <div id="run-list" class="panel-body"></div>
      </aside>

      <aside id="inspector" class="panel inspector" aria-label="Run inspector">
        <header class="panel-head">
          <h2>Inspector</h2>
          <button id="inspector-close" class="icon-action" title="Hide the inspector" aria-label="Hide the inspector">${icon("close", 16)}</button>
        </header>
        <div id="run-brief"></div>
        <div class="tabbar" role="tablist">
          <button class="tab active" role="tab" data-tab="steps">Steps</button>
          <button class="tab" role="tab" data-tab="artifacts">Files</button>
          <button class="tab" role="tab" data-tab="validation">Checks</button>
          <button class="tab" role="tab" data-tab="logs">Logs</button>
        </div>
        <div id="inspector-content" class="panel-body"></div>
        <footer id="inspector-actions" class="panel-foot"></footer>
      </aside>
    </div>

    <div class="edge-rail">
      <button id="library-toggle" class="edge-tab" aria-controls="library" aria-expanded="false" title="Run library (Ctrl+B)">Runs${icon("chevronLeft", 16)}</button>
      <button id="inspector-toggle" class="edge-tab" aria-controls="inspector" aria-expanded="true" title="Inspector (Ctrl+I)">Inspect${icon("chevronLeft", 16)}</button>
    </div>
  </main>

  <section class="dock" aria-label="Production pipeline">
    <div id="pipeline" class="pipeline"></div>
    <div id="filmstrip" class="filmstrip" aria-label="Run outputs"></div>
  </section>

  <footer class="statusbar">
    <button id="dependency-strip" class="dependency-strip" type="button" aria-controls="preview"></button>
    <div id="agent-state" class="agent-state"></div>
    <span class="spacer"></span>
    <time id="status-time"></time>
  </footer>

  <section id="settings-popover" class="popover hidden" aria-label="Run settings">
    <div class="popover-head">
      <h3>Run settings</h3>
      <button id="settings-close" class="icon-action" title="Close" aria-label="Close run settings">${icon("close", 16)}</button>
    </div>
    <div class="popover-grid">
      <label class="field"><span>Workflow</span><select id="workflow">${optionMarkup("workflow")}</select></label>
      <label class="field"><span>Quality</span><select id="quality">${optionMarkup("quality")}</select></label>
      <label class="field"><span>Target</span><select id="target">${optionMarkup("target")}</select></label>
      <label class="field"><span>Tool / model</span><select id="tool">${optionMarkup("tool")}</select></label>
      <label class="field"><span>Model</span><select id="model"><option value="auto">Default</option></select></label>
      <label class="field"><span>Reasoning</span><select id="effort">${optionMarkup("effort")}</select></label>
    </div>
  </section>

  <section id="start-screen" class="start-screen hidden" aria-label="Start"></section>

  <div id="approval-layer"></div>
  <div id="dialog-layer"></div>
  <div id="menu-layer"></div>
  <div id="toast-layer" aria-live="polite"></div>
`;

const elements = Object.fromEntries([
  "prompt", "gate-chip", "attachments", "attach", "send", "cancel", "theme-toggle", "settings-toggle", "settings-popover", "topbar-progress",
  "preview", "viewport-hud", "library", "inspector", "run-list", "run-search", "run-count", "run-brief",
  "inspector-content", "inspector-actions", "library-toggle", "inspector-toggle",
  "pipeline", "filmstrip", "dependency-strip", "agent-state", "status-time",
  "workflow", "quality", "target", "tool", "model", "effort",
  "approval-layer", "dialog-layer", "menu-layer", "toast-layer", "file-menu", "project-name", "start-screen",
].map((id) => [id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()), document.querySelector(`#${id}`)]));


/* ── theme ──────────────────────────────────────────────────── */

// Follows the system until the person picks one; the choice persists. The sheet itself switches on
// prefers-color-scheme (light-dark()), so "system" needs no script; data-theme pins light or dark.
const THEME_ORDER = ["system", "light", "dark"];
const THEME_NAMES = { system: "System", light: "Light", dark: "Dark" };
const THEME_GLYPHS = { system: "monitor", light: "sun", dark: "moon" };
let themeChoice = THEME_ORDER.includes(readPreference("forge3d.theme", "system")) ? readPreference("forge3d.theme", "system") : "system";
let viewportRefresh = null;

// Resolves a colour token (which may be a light-dark() pair) to the colour in use right now, for three.js.
function tokenColor(name) {
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;visibility:hidden;color:var(${name})`;
  document.body.append(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  return value;
}

function applyTheme({ announce = true } = {}) {
  const root = document.documentElement;
  if (themeChoice === "system") delete root.dataset.theme; else root.dataset.theme = themeChoice;
  const next = THEME_ORDER[(THEME_ORDER.indexOf(themeChoice) + 1) % THEME_ORDER.length];
  const button = document.querySelector("#theme-toggle");
  button.innerHTML = themeIcon(THEME_GLYPHS[themeChoice]);
  button.title = `Theme: ${THEME_NAMES[themeChoice]}. Switch to ${THEME_NAMES[next].toLowerCase()}`;
  button.setAttribute("aria-label", button.title);
  if (announce) api.setTheme?.(themeChoice)?.catch?.(() => {});
  viewportRefresh?.();
}

document.querySelector("#theme-toggle").addEventListener("click", () => {
  themeChoice = THEME_ORDER[(THEME_ORDER.indexOf(themeChoice) + 1) % THEME_ORDER.length];
  writePreference("forge3d.theme", themeChoice);
  applyTheme();
});
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => viewportRefresh?.());
applyTheme();

let runSettings = readRunSettings(localStorage);
for (const key of ["workflow", "quality", "target", "tool", "effort"]) {
  if ([...elements[key].options].some((option) => option.value === runSettings[key])) elements[key].value = runSettings[key];
}

// The selects hold the open project's run settings. The last ones used are also kept per user, so a new project
// starts from them.
function persistRunSettings() {
  runSettings = writeRunSettings(localStorage, {
    workflow: elements.workflow.value,
    quality: elements.quality.value,
    target: elements.target.value,
    tool: elements.tool.value,
    model: elements.model.value,
    effort: elements.effort.value,
  });
  if (!state.project) return;
  api.project?.setSettings(runSettings).then((summary) => {
    if (summary && state.project) { state.project = summary; renderProjectChrome(); }
  }).catch((error) => toast(error.message, "error"));
}

function applyRunSettings(settings) {
  runSettings = normalizeRunSettings(settings);
  for (const key of ["workflow", "quality", "target", "tool", "effort"]) {
    if ([...elements[key].options].some((option) => option.value === runSettings[key])) elements[key].value = runSettings[key];
  }
  if ([...elements.model.options].some((option) => option.value === runSettings.model)) elements.model.value = runSettings.model;
}

/* ── helpers ────────────────────────────────────────────────── */

function artifactUrl(runId, relativePath) {
  return `forge3d-artifact://${runId}/${relativePath.split("/").map(encodeURIComponent).join("/")}`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function formatDate(value) {
  if (!value) return "Unknown time";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

function formatClock(value) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "" : new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KiB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MiB`;
  return `${(bytes / 1073741824).toFixed(2)} GiB`;
}

function basename(value) {
  return String(value).split(/[\\/]/).pop();
}

function statusLabel(status) {
  return sentenceCase(status || "unknown");
}

function selectedRun() {
  return state.runs.find((run) => run.run_id === selectedRunId) || null;
}

function selectedArtifact(run = selectedRun()) {
  return selectedArtifactForRun(run, selectedArtifactPath);
}

function isImageRole(role) {
  return ["primary-image", "image", "animation", "image-sequence"].includes(role);
}

function artifactIcon(artifact) {
  const role = artifact?.preview_role;
  if (role === "model") return "teapot";
  if (role === "gaussian-splat") return "splat";
  if (role === "validation") return "shield";
  if (role === "animation" || role === "image-sequence") return "film";
  if (isImageRole(role)) return "render";
  return "page";
}

// Errors stay until dismissed (a repeat of the same message counts up instead of stacking); everything else
// fades. kind: info, success (timed), warn (a mild nudge, timed), error (stays).
function toast(message, kind = "info", { sticky = kind === "error", action = null } = {}) {
  const key = `${kind}:${message}`;
  const existing = sticky ? [...elements.toastLayer.children].find((node) => node.dataset.key === key) : null;
  if (existing) {
    const count = Number(existing.dataset.count || 1) + 1;
    existing.dataset.count = String(count);
    existing.querySelector(".toast-count").textContent = `×${count}`;
    return;
  }
  const item = document.createElement("div");
  item.className = `toast ${kind}`;
  item.dataset.key = key;
  item.setAttribute("role", kind === "error" ? "alert" : "status");
  item.innerHTML = `<span class="toast-text">${escapeHtml(message)}</span><span class="toast-count mono"></span>`;
  if (action) {
    const button = document.createElement("button");
    button.className = "toast-action";
    button.textContent = action.label;
    button.addEventListener("click", () => { item.remove(); action.run(); });
    item.append(button);
  }
  if (sticky) {
    const dismiss = document.createElement("button");
    dismiss.className = "toast-dismiss";
    dismiss.title = "Dismiss";
    dismiss.setAttribute("aria-label", "Dismiss this message");
    dismiss.innerHTML = icon("close", 16);
    dismiss.addEventListener("click", () => item.remove());
    item.append(dismiss);
  }
  elements.toastLayer.append(item);
  if (!sticky) setTimeout(() => item.remove(), 4800);
}

/* ── overlay primitives ─────────────────────────────────────── */

function closeMenu() {
  for (const menu of elements.menuLayer.children) menu.onClose?.();
  elements.menuLayer.innerHTML = "";
}

// items: { id, icon, label, run, danger?, hint?, disabled?, title? }, "-" for a rule, { heading } for a label.
function openMenu(box, items, { align = "right", label = "", onClose = null } = {}) {
  closeMenu();
  const menu = document.createElement("div");
  menu.className = "menu";
  menu.setAttribute("role", "menu");
  if (label) menu.setAttribute("aria-label", label);
  menu.innerHTML = items.map((item) => item === "-" ? "<hr />"
    : item.heading ? `<div class="menu-heading">${escapeHtml(item.heading)}</div>`
    : `<button role="menuitem" data-menu-action="${escapeHtml(item.id)}" class="${item.danger ? "danger" : ""}" ${item.disabled ? "disabled" : ""} ${item.title ? `title="${escapeHtml(item.title)}"` : ""}>${icon(item.icon, 24, { hue: item.danger ? "rose" : item.disabled ? "stone" : undefined })}<span>${escapeHtml(item.label)}</span>${item.hint ? `<kbd>${escapeHtml(item.hint)}</kbd>` : ""}</button>`).join("");
  elements.menuLayer.append(menu);
  menu.onClose = onClose;
  const size = menu.getBoundingClientRect();
  menu.style.top = `${Math.min(box.bottom + 6, innerHeight - size.height - 12)}px`;
  const left = align === "left" ? box.left : box.right - size.width;
  menu.style.left = `${Math.max(12, Math.min(left, innerWidth - size.width - 12))}px`;
  menu.querySelectorAll("[data-menu-action]").forEach((button) => button.addEventListener("click", () => {
    const chosen = items.find((item) => item !== "-" && !item.heading && item.id === button.dataset.menuAction);
    closeMenu();
    chosen?.run?.();
  }));
  menu.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const buttons = [...menu.querySelectorAll("button:not(:disabled)")];
    const index = buttons.indexOf(document.activeElement);
    buttons[(index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length]?.focus();
  });
  setTimeout(() => document.addEventListener("pointerdown", function once(event) {
    if (!menu.isConnected) return;
    if (menu.contains(event.target)) return document.addEventListener("pointerdown", once, { once: true });
    closeMenu();
  }, { once: true }), 0);
  return menu;
}

function askDialog({ eyebrow = "Forge3D", title, body = "", detail = "", input = null, confirmLabel = "Continue", danger = false }) {
  return new Promise((resolve) => {
    const scrim = document.createElement("div");
    scrim.className = "scrim";
    scrim.innerHTML = `
      <section class="modal" role="dialog" aria-modal="true">
        <div class="modal-head">
          <small>${escapeHtml(eyebrow)}</small>
          <h2>${escapeHtml(title)}</h2>
          ${body ? `<p>${escapeHtml(body)}</p>` : ""}
        </div>
        <div class="modal-body">
          ${detail ? `<pre>${escapeHtml(detail)}</pre>` : ""}
          ${input ? `<textarea id="dialog-input">${escapeHtml(input.value || "")}</textarea>` : ""}
        </div>
        <div class="modal-foot">
          <button class="btn ghost" data-choice="cancel">Cancel</button>
          <button class="btn ${danger ? "danger" : "primary"}" data-choice="ok">${escapeHtml(confirmLabel)}</button>
        </div>
      </section>`;
    elements.dialogLayer.append(scrim);
    const field = scrim.querySelector("#dialog-input");
    field?.focus();
    field?.setSelectionRange(field.value.length, field.value.length);
    if (!field) scrim.querySelector(danger ? '[data-choice="cancel"]' : '[data-choice="ok"]').focus();
    const finish = (value) => { scrim.remove(); resolve(value); };
    scrim.querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => {
      finish(button.dataset.choice === "cancel" ? null : input ? (field?.value ?? "") : true);
    }));
    scrim.addEventListener("pointerdown", (event) => { if (event.target === scrim) finish(null); });
    scrim.addEventListener("keydown", (event) => {
      if (event.key === "Escape") finish(null);
      if (event.key === "Enter" && !danger && (event.ctrlKey || event.metaKey || !input)) { event.preventDefault(); finish(input ? (field?.value ?? "") : true); }
    });
  });
}

/* ── readiness and the status bar ──────────────────────────── */

function currentSettings() {
  return { workflow: elements.workflow.value, tool: elements.tool.value, target: elements.target.value };
}

function currentReadiness() {
  return deriveReadiness({ capabilities, settings: currentSettings(), appServerError: state.appServerError || "", agent: state.agent || undefined, hasImage: attachments.some(isImagePath) });
}

function agentName() {
  return state.agent?.name || "the agent";
}

// Tool versions are shown only when the capability report carries a real one (state.toolVersions.blender = "5.0.1").
// Until it does, the name stands alone; an older build printed made-up numbers.
function toolVersion(id) {
  const value = state.toolVersions?.[id];
  return typeof value === "string" ? value.trim() : "";
}

const OVERALL_LABELS = { checking: "Checking setup", error: "Setup unchecked", blocked: "Setup needed", degraded: "Needs a look", ready: "Ready" };
const OVERALL_DOTS = { checking: "checking", error: "attention", blocked: "offline", degraded: "attention", ready: "ready" };

function renderDependencies() {
  const readiness = currentReadiness();
  const overall = capsChecking && !capabilities ? "checking" : readiness.phase;
  const tools = statusEntries(readiness, state.tools);
  elements.dependencyStrip.title = "Show what Forge3D checked on this machine";
  elements.dependencyStrip.setAttribute("aria-pressed", String(showSetup));
  elements.dependencyStrip.innerHTML = `<span class="status-item ${OVERALL_DOTS[overall]}"><i></i>${OVERALL_LABELS[overall]}</span><span class="status-divider"></span>${
    tools.map(({ name, id, state: toolState }) => {
      const version = toolState === "checking" || toolState === "unset" ? "" : toolVersion(id);
      return `<span class="status-item ${toolState}"><i></i>${name}${version ? ` <span class="mono">${escapeHtml(version)}</span>` : ""}</span>`;
    }).join("")}`;

  const skill = state.skill;
  const needsRepair = skill && skill.state !== "ready";
  const failed = Boolean(state.appServerError);
  const message = failed ? state.appServerError
    : needsRepair ? (skill.state === "version-mismatch" ? `Plugin <span class="mono">${escapeHtml(skill.installedVersion)}</span> → <span class="mono">${escapeHtml(skill.bundledVersion)}</span>` : "Plugin repair available")
    : "";
  elements.agentState.classList.toggle("hidden", !message);
  elements.agentState.innerHTML = message ? `<span>${needsRepair && !failed ? message : escapeHtml(message)}</span>${needsRepair ? '<button id="repair-skill" class="link-button">Repair</button>' : ""}` : "";
  document.querySelector("#repair-skill")?.addEventListener("click", repairPlugin);
}

// Asks the main process for the capability report. `force` is Check again; the first call is the startup check.
// The main process never rejects, but a missing bridge or a thrown error is still reported, never read as ready.
async function checkCapabilities(force = false) {
  if (capsChecking) return;
  const keepFocus = document.activeElement?.hasAttribute?.("data-recheck");
  capsChecking = true;
  refreshReadiness();
  let result;
  try {
    if (typeof api.capabilities !== "function") throw new Error("This build of Forge3D has no capability check.");
    result = await api.capabilities({ force });
  } catch (error) {
    result = { ok: false, error: error.message, fix: "Update or reinstall Forge3D." };
  }
  capabilities = result && typeof result === "object" ? result : { ok: false, error: "The capability check returned nothing.", fix: "" };
  state.toolVersions = capabilities.ok ? toolVersionsFromReport(capabilities) : {};
  await loadAgentStatuses(force);
  capsChecking = false;
  refreshReadiness();
  if (keepFocus) elements.preview.querySelector("[data-recheck]")?.focus();
}

async function loadAgentStatuses(force = false) {
  try {
    if (typeof api.agentStatus === "function") agentStatuses = await api.agentStatus({ force });
  } catch { agentStatuses = null; }
}

// Choosing the agent on the setup card. The setup check, the models and the agent choices are read again for it.
async function chooseAgent(id) {
  try {
    const result = await api.setAgent(id);
    state.agent = { id: result.agent, name: result.name };
    await loadModels();
    renderAll({ preview: false });
    await checkCapabilities(true);
    toast(`Runs now use ${result.name}`, "success");
  } catch (error) {
    toast(error.message.replace(/^Error invoking remote method '[^']+': (Error: )?/, ""), "error");
  }
}

async function loadModels() {
  try {
    const result = await api.models?.({});
    if (result) {
      state.models = result.models || [];
      state.modelDefaults = { model: result.defaultModel || "", effort: result.defaultEffort || "" };
    }
  } catch { /* the picker keeps Default only */ }
  renderModelOptions();
}

// Everything that depends on the report or on the settings that choose the route.
function refreshReadiness() {
  renderDependencies();
  renderComposer();
  renderInspectorActions();
  if (previewKind !== "artifact") renderPreview();
}

function openSetup(open = true) {
  showSetup = open;
  renderDependencies();
  renderPreview();
  if (open) elements.preview.querySelector("[data-recheck]")?.focus();
}

// The chosen agent's models. "Default" names the agent's own default when it has one (Claude Code: Opus, medium).
function renderModelOptions() {
  const current = runSettings.model || elements.model.value;
  const models = state.models || [];
  const defaults = state.modelDefaults || {};
  const defaultModel = models.find((model) => model.id === defaults.model);
  elements.model.innerHTML = `<option value="auto">${defaultModel ? `Default (${escapeHtml(defaultModel.label)})` : "Default"}</option>` + models
    .map((model) => `<option value="${escapeHtml(model.id || model.model)}">${escapeHtml(model.label || model.displayName || model.id || model.model)}</option>`).join("");
  elements.model.value = [...elements.model.options].some((option) => option.value === current) ? current : "auto";
  const effortDefault = elements.effort.querySelector('option[value="auto"]');
  if (effortDefault) effortDefault.textContent = defaults.effort ? `Default (${sentenceCase(defaults.effort)})` : "Model default";
}

/* ── run library ────────────────────────────────────────────── */

function runGroups(runs) {
  const groups = new Map();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (left, right) => left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
  for (const run of runs) {
    const date = new Date(run.updated_at || run.created_at || Date.now());
    const label = sameDay(date, today) ? "Today"
      : sameDay(date, yesterday) ? "Yesterday"
      : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: date.getFullYear() === today.getFullYear() ? undefined : "numeric" }).format(date);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push({ run, date });
  }
  return groups;
}

function runThumb(run) {
  const artifact = run.artifacts?.find((item) => item.preview_role === "primary-image")
    || run.artifacts?.find((item) => isImageRole(item.preview_role));
  if (artifact) return `<img src="${artifactUrl(run.run_id, artifact.path)}" alt="" loading="lazy" />`;
  return icon(run.artifacts?.length ? artifactIcon(run.artifacts[0]) : "teapot", 24);
}

function renderRuns() {
  const query = elements.runSearch.value.trim().toLowerCase();
  const runs = state.runs.filter((run) => [run.prompt, run.workflow_route, run.status, run.name]
    .some((value) => String(value || "").toLowerCase().includes(query)));
  elements.runCount.textContent = state.runs.length ? String(state.runs.length) : "";
  const groups = runGroups(runs);
  elements.runList.innerHTML = groups.size ? [...groups.entries()].map(([label, entries]) => `
    <section class="run-group">
      <h3>${escapeHtml(label)}</h3>
      ${entries.map(({ run, date }) => `
        <div class="run-card ${run.run_id === selectedRunId ? "selected" : ""}" data-run-id="${escapeHtml(run.run_id)}" role="button" tabindex="0">
          <span class="run-tile">${runThumb(run)}</span>
          <span class="run-lines">
            <strong>${escapeHtml(run.prompt || run.name || "Untitled run")}</strong>
            <small><i class="run-state ${escapeHtml(run.status || "")}"></i><em>${escapeHtml(sentenceCase(run.workflow_route || run.status || "run"))}</em> · ${escapeHtml(formatClock(date))}</small>
          </span>
          <button class="run-more" data-run-menu="${escapeHtml(run.run_id)}" title="Run actions" aria-label="Run actions">${icon("more", 16)}</button>
        </div>`).join("")}
    </section>`).join("")
    : `<div class="empty-list">${icon("search", 48)}<span>${query ? "No runs match that search." : "No runs yet. Describe an asset to forge the first one."}</span></div>`;

  elements.runList.querySelectorAll("[data-run-id]").forEach((card) => {
    card.addEventListener("click", (event) => { if (!event.target.closest("[data-run-menu]")) selectRun(card.dataset.runId); });
    card.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectRun(card.dataset.runId); } });
  });
  elements.runList.querySelectorAll("[data-run-menu]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    const run = state.runs.find((item) => item.run_id === button.dataset.runMenu);
    if (!run) return;
    const box = button.getBoundingClientRect();
    selectRun(run.run_id);
    openMenu(box, [
      { id: "continue", icon: "resume", label: "Resume this run", run: () => runAction("continue") },
      { id: "duplicate", icon: "copy", label: "Duplicate", run: () => runAction("duplicate") },
      "-",
      { id: "archive", icon: "archive", label: "Archive", run: () => runAction("archive") },
      { id: "trash", icon: "trash", label: "Move to trash", danger: true, run: () => runAction("trash") },
    ]);
  }));
}

/* ── production pipeline ────────────────────────────────────── */

function summarizeValidation(validation) {
  const entries = Object.entries(validation || {});
  const flags = entries.filter(([, value]) => typeof value === "boolean");
  if (flags.length) return `${flags.filter(([, value]) => value).length}/${flags.length} checks passed`;
  if (typeof validation?.status === "string") return sentenceCase(validation.status);
  return `${entries.length} result${entries.length === 1 ? "" : "s"}`;
}

// Progress is shown only where it is real. A rail is "full" for a stage that finished, "unknown" (a dotted track) for
// work in flight whose length nobody knows, "ratio" where a true fraction exists (passed checks), and empty otherwise.
// Time is the run's own clock: `since` is a start time in ms, and the ticker renders the elapsed time from it.
function earliestStart(run) {
  const starts = (run?.steps || []).map((step) => Date.parse(step.started_at)).filter((value) => !Number.isNaN(value));
  if (starts.length) return Math.min(...starts);
  const created = Date.parse(run?.created_at);
  return Number.isNaN(created) ? null : created;
}

function pipelineStages(run) {
  const steps = run?.steps || [];
  const artifacts = run?.artifacts || [];
  const completed = steps.filter((step) => step.status === "completed").length;
  const running = steps.find((step) => step.status === "running" || step.status === "inProgress");
  const status = run?.status || null;
  const finished = status === "completed";
  const failed = status === "failed";
  const stopped = status === "interrupted" || status === "cancelled";
  const starting = status === "prepared" || status === "launching";
  const validation = run?.validation && Object.keys(run.validation).length ? run.validation : null;
  const reports = artifacts.filter((artifact) => artifact.preview_role === "validation");
  const checked = Boolean(validation) || reports.length > 0;
  const none = { kind: "empty" };
  const full = { kind: "full" };
  const unknown = { kind: "unknown" };

  const plan = !run ? { state: "idle", rail: none, detail: "Waiting for a prompt" }
    : starting ? { state: "active", rail: unknown, detail: "Routing the request" }
    : { state: "done", rail: full, detail: run.workflow_route ? sentenceCase(run.workflow_route) : "Request routed" };

  const currentActivity = running?.detail || running?.name;
  const working = !finished && !failed && !stopped;
  const build = !run || starting ? { state: "idle", rail: none, detail: "Not started" }
    : failed ? { state: "failed", rail: full, detail: run.failure || "The run failed" }
    : stopped ? { state: "failed", rail: full, detail: sentenceCase(status) }
    : finished ? { state: "done", rail: full, detail: `${completed} tool action${completed === 1 ? "" : "s"} complete` }
    : { state: "active", rail: unknown, since: working ? earliestStart(run) : null, detail: currentActivity ? sentenceCase(currentActivity) : completed ? `${completed} tool action${completed === 1 ? "" : "s"} complete · working` : "Starting local tools" };

  const flags = Object.values(validation || {}).filter((value) => typeof value === "boolean");
  const failedChecks = flags.some((value) => value === false);
  const ratio = flags.length ? { kind: failedChecks ? "ratio" : "full", value: flags.filter(Boolean).length / flags.length } : full;
  const check = !run ? { state: "idle", rail: none, detail: "Not started" }
    : checked ? { state: failed ? "failed" : failedChecks ? "warn" : "done", rail: ratio, detail: validation ? summarizeValidation(validation) : `${reports.length} report${reports.length === 1 ? "" : "s"}` }
    : finished ? { state: "idle", rail: none, detail: "No validation recorded" }
    : build.state === "active" ? { state: "idle", rail: none, detail: "Waiting for the build" }
    : { state: "idle", rail: none, detail: "Not started" };

  const output = !run ? { state: "idle", rail: none, detail: "No outputs yet" }
    : artifacts.length ? { state: finished ? "done" : "active", rail: finished ? full : unknown, detail: `${artifacts.length} artifact${artifacts.length === 1 ? "" : "s"}` }
    : failed ? { state: "failed", rail: none, detail: "Nothing produced" }
    : { state: "idle", rail: none, detail: "Preparing deliverables" };

  return [
    { key: "plan", label: "Plan", icon: "plan", ...plan },
    { key: "build", label: "Build", icon: "anvil", ...build },
    { key: "check", label: "Check", icon: "shield", ...check },
    { key: "output", label: "Output", icon: "crate", ...output },
  ];
}

function elapsedMarkup(since) {
  return `<span class="mono" data-elapsed-since="${since}">${escapeHtml(formatElapsed(Date.now() - since))}</span>`;
}

function railMarkup(rail) {
  if (rail.kind === "full") return '<i class="stage-fill"></i>';
  if (rail.kind === "ratio") return `<i class="stage-fill" style="width:${Math.round(rail.value * 100)}%"></i>`;
  return "";
}

// Which icon a stage shows for its state: the stage's own tool while it is waiting or running, then the state's mark.
const STAGE_MARKS = { done: "done", warn: "alert", failed: "failed" };
let pipelineRunId = null;
let pipelineStates = new Map();
let pipelineMarkup = "";
const stagePlaying = new Set(); // stages that just finished or failed: the tick pops, the mark shakes, once

function stageIcon(stage) {
  const mark = STAGE_MARKS[stage.state];
  const playing = stagePlaying.has(stage.key);
  if (mark) return icon(mark, 32, { playing });
  return icon(stage.icon, 32, { hue: stage.state === "idle" ? "stone" : undefined, working: stage.state === "active" && stage.key === "build" });
}

function renderPipeline() {
  const run = selectedRun();
  const stages = pipelineStages(run);
  const runId = run?.run_id || null;
  if (runId !== pipelineRunId) {
    pipelineRunId = runId;
    pipelineStates = new Map();
    stagePlaying.clear();
  }
  for (const stage of stages) {
    const before = pipelineStates.get(stage.key);
    if (before && before !== stage.state && (stage.state === "done" || stage.state === "failed")) {
      stagePlaying.add(stage.key);
      setTimeout(() => stagePlaying.delete(stage.key), 900);
    }
    pipelineStates.set(stage.key, stage.state);
  }
  const markup = stages.map((stage) => `
    <div class="stage-node ${stage.state}">
      <span class="stage-icon">${stageIcon(stage)}</span>
      <div class="stage-body">
        <div class="stage-top">
          <span class="stage-label">${stage.label}</span>
          <span class="stage-rail ${stage.rail.kind === "unknown" ? "unknown" : ""}" ${stage.rail.kind === "unknown" ? 'title="Length not known"' : ""}>${railMarkup(stage.rail)}</span>
        </div>
        <div class="stage-detail">${escapeHtml(stage.detail)}${stage.since ? ` · ${elapsedMarkup(stage.since)}` : ""}</div>
      </div>
    </div>`).join("");
  // Redrawing identical markup would restart the anvil's loop and any pop in flight.
  // The elapsed clocks tick on their own timer, so their text is left out of the comparison.
  const same = markup.replace(/(data-elapsed-since="\d+">)[^<]*/g, "$1");
  if (same !== pipelineMarkup) {
    pipelineMarkup = same;
    elements.pipeline.innerHTML = markup;
  }
}

function renderFilmstrip() {
  const run = selectedRun();
  const artifacts = filmstripArtifacts(run, selectedArtifactPath, 16);
  if (!artifacts.length) {
    elements.filmstrip.innerHTML = Array.from({ length: 4 }, () => '<div class="film-tile film-ghost"></div>').join("");
    return;
  }
  const active = selectedArtifact(run);
  elements.filmstrip.innerHTML = artifacts.map((artifact) => `
    <button class="film-tile ${artifact.path === active?.path ? "selected" : ""}" data-film-path="${escapeHtml(artifact.path)}" title="${escapeHtml(artifact.name)}">
      ${isImageRole(artifact.preview_role)
        ? `<img src="${artifactUrl(run.run_id, (artifact.frames && artifact.frames[0]) || artifact.path)}" alt="${escapeHtml(artifact.name)}" loading="lazy" />`
        : `<span class="film-glyph">${icon(artifactIcon(artifact), 24)}<span>${escapeHtml(sentenceCase(String(artifact.preview_role || "file").split("-")[0]))}</span></span>`}
    </button>`).join("");
  elements.filmstrip.querySelectorAll("[data-film-path]").forEach((tile) => tile.addEventListener("click", () => selectArtifact(tile.dataset.filmPath)));
}

function renderHud() {
  const run = selectedRun();
  const artifact = selectedArtifact(run);
  if (!run) { elements.viewportHud.innerHTML = ""; return; }
  const status = String(run.status || "");
  elements.viewportHud.innerHTML = `
    <strong>${escapeHtml(run.prompt || run.name || "Untitled run")}</strong>
    ${artifact ? `<span class="hud-dot"></span><strong>${escapeHtml(artifact.name)}</strong>` : ""}
    <span class="hud-tag ${escapeHtml(status)}">${escapeHtml(statusLabel(status))}</span>`;
}

/* ── inspector ──────────────────────────────────────────────── */

function activeTab() {
  return document.querySelector(".tab.active")?.dataset.tab || "steps";
}

function renderRunBrief() {
  const run = selectedRun();
  if (!run) { document.querySelector("#run-brief").innerHTML = ""; return; }
  document.querySelector("#run-brief").innerHTML = `
    <div class="run-brief">
      <p>${escapeHtml(run.prompt || run.name || "Untitled run")}</p>
      <div class="run-brief-meta">
        <span class="pill ${escapeHtml(String(run.status || ""))}">${escapeHtml(statusLabel(run.status))}</span>
        ${run.workflow_route ? `<span>${escapeHtml(sentenceCase(run.workflow_route))}</span>` : ""}
        <span>${escapeHtml(formatDate(run.updated_at || run.created_at))}</span>
      </div>
    </div>`;
}

function renderInspector() {
  const run = selectedRun();
  const tab = activeTab();
  if (!run) {
    elements.inspectorContent.innerHTML = `<div class="empty-list">${icon("teapot", 48)}<span>Select a run to inspect its steps, files, and logs.</span></div>`;
    renderInspectorActions();
    return;
  }
  if (tab === "steps") {
    const phases = summarizeRunSteps(run);
    const timing = (phase) => phase.live ? ` · ${elapsedMarkup(phase.startedAt)}` : phase.elapsedMs !== null ? ` · <span class="mono">${escapeHtml(formatElapsed(phase.elapsedMs))}</span>` : "";
    elements.inspectorContent.innerHTML = phases.length
      ? `<ol class="step-list">${phases.map((phase) => `
          <li>
            <i class="step-dot ${escapeHtml(phase.status)}"></i>
            <div class="step-text"><strong>${escapeHtml(phase.label)}</strong><small>${escapeHtml(statusLabel(phase.status))} · ${escapeHtml(phase.detail)}${timing(phase)}</small></div>
          </li>`).join("")}</ol>`
      : `<div class="empty-list">${icon("plan", 48)}<span>Progress appears as soon as local production starts.</span></div>`;
  } else if (tab === "artifacts") {
    elements.inspectorContent.innerHTML = run.artifacts?.length
      ? `<div class="artifact-list">${run.artifacts.map((artifact) => `
          <button class="artifact-card ${artifact.path === selectedArtifact(run)?.path ? "selected" : ""}" data-artifact-path="${escapeHtml(artifact.path)}">
            <span class="artifact-thumb">${isImageRole(artifact.preview_role)
              ? `<img src="${artifactUrl(run.run_id, (artifact.frames && artifact.frames[0]) || artifact.path)}" alt="" loading="lazy" />`
              : icon(artifactIcon(artifact), 24)}</span>
            <span class="artifact-lines"><strong>${escapeHtml(artifact.name)}</strong><small>${escapeHtml(sentenceCase(artifact.preview_role))} · <span class="mono">${escapeHtml(formatBytes(artifact.size_bytes))}</span></small></span>
          </button>`).join("")}</div>`
      : `<div class="empty-list">${icon("folder", 48)}<span>Files are discovered inside this run directory only.</span></div>`;
    elements.inspectorContent.querySelectorAll("[data-artifact-path]").forEach((button) => button.addEventListener("click", () => selectArtifact(button.dataset.artifactPath)));
  } else if (tab === "validation") {
    const validation = run.validation && Object.keys(run.validation).length ? run.validation : null;
    const reports = (run.artifacts || []).filter((artifact) => artifact.preview_role === "validation");
    const rows = validation ? Object.entries(validation).map(([key, value]) => `
      <div><span>${escapeHtml(sentenceCase(key))}</span><strong class="${value === true ? "ok" : value === false ? "bad" : ""}">${escapeHtml(typeof value === "object" ? JSON.stringify(value) : String(value))}</strong></div>`).join("") : "";
    elements.inspectorContent.innerHTML = `${validation ? `<div class="kv">${rows}</div>` : `<div class="empty-list">${icon("shield", 48)}<span>No inline validation result yet.</span></div>`}
      ${reports.length ? `<div class="section-label">Reports</div>${reports.map((report) => `<button class="report-link" data-artifact-path="${escapeHtml(report.path)}">${icon("page", 24)}<span>${escapeHtml(report.name)}</span></button>`).join("")}` : ""}`;
    elements.inspectorContent.querySelectorAll("[data-artifact-path]").forEach((button) => button.addEventListener("click", () => selectArtifact(button.dataset.artifactPath)));
  } else {
    const entries = run.transcript || [];
    const labels = {
      agent: "Assistant",
      log: "Tool output",
      activity: "Tool activity",
      event: "Forge3D",
      "approval-request": "Approval needed",
      "approval-decision": "Approval",
      "app-server-stderr": "App Server",
      "agent-stderr": "Agent log",
      error: "Error",
      user: "Prompt",
      "user-steer": "Steering note",
    };
    elements.inspectorContent.innerHTML = entries.length
      ? `<div class="log-list">${entries.slice(-200).map((entry) => `
          <article class="log-entry ${escapeHtml(entry.kind)}">
            <small>${escapeHtml(labels[entry.kind] || sentenceCase(entry.kind))} · ${escapeHtml(formatDate(entry.at))}</small>
            <pre>${escapeHtml(entry.text || entry.method || JSON.stringify(entry.params || {}))}</pre>
          </article>`).join("")}</div>`
      : `<div class="empty-list">${icon("page", 48)}<span>Assistant messages and useful tool output appear here.</span></div>`;
    elements.inspectorContent.scrollTop = elements.inspectorContent.scrollHeight;
  }
  renderInspectorActions();
}

function renderInspectorActions() {
  const run = selectedRun();
  const artifact = selectedArtifact(run);
  const lower = String(artifact?.path || "").toLowerCase();
  const rows = (({ required, optional }) => [...required, ...optional])(currentReadiness());
  const item = (id) => rows.find((row) => row.id === id);
  const missing = (id, name) => capabilities?.ok && item(id) && !["ready", "degraded"].includes(item(id).state) ? `${name} is not set up on this machine` : "";
  const actions = [
    { id: "reveal", icon: "folder", label: "Reveal", title: "Reveal this file in Explorer" },
    { id: "copy", icon: "copy", label: "Copy path", title: "Copy this file's path" },
    { id: "open", icon: "open", label: "Open", title: "Open this file with its default app" },
  ];
  if ([".blend", ".glb", ".gltf", ".fbx", ".obj"].some((extension) => lower.endsWith(extension))) actions.push({ id: "blender", icon: "blender", label: "Open in Blender", title: "Open this file in Blender", unavailable: missing("blender", "Blender") });
  if ([".blend", ".glb", ".gltf", ".fbx", ".obj", ".ply", ".splat", ".stl", ".usd", ".usda", ".usdc"].some((extension) => lower.endsWith(extension))) actions.push({ id: "export", icon: "export", label: "Export…", title: "Export to another format" });
  if ([".glb", ".gltf", ".splat", ".ply", ".sog"].some((extension) => lower.endsWith(extension))) actions.push({ id: "godot", icon: "gamepad", label: "Review in Godot", title: "Review this file in a Godot scene", unavailable: missing("godot", "Godot") });
  elements.inspectorActions.innerHTML = artifact ? actions.map((action) => `
    <button data-artifact-action="${action.id}" title="${escapeHtml(action.unavailable || action.title)}" ${action.unavailable ? "disabled" : ""}>${icon(action.icon, 24)}<span>${escapeHtml(action.label)}</span></button>`).join("")
    : '<p class="foot-hint">Select a file to open, reveal or export it.</p>';
  elements.inspectorActions.querySelectorAll("[data-artifact-action]").forEach((button) => button.addEventListener("click", () => artifactAction(button.dataset.artifactAction)));
}

/* ── viewport ───────────────────────────────────────────────── */

const clayMaterial = new THREE.MeshStandardMaterial({ color: 0x9ba1a8, roughness: 0.74, metalness: 0.02 });
const wireMaterial = new THREE.MeshBasicMaterial({ color: 0xee7752, wireframe: true });

function disposeThree(scene, renderer, animationId, observer) {
  cancelAnimationFrame(animationId.value);
  observer.disconnect();
  scene.traverse((object) => {
    object.geometry?.dispose?.();
    const materials = [object.material, object.userData?.originalMaterial]
      .flatMap((value) => Array.isArray(value) ? value : value ? [value] : [])
      .filter((material) => material !== clayMaterial && material !== wireMaterial);
    for (const material of materials) {
      for (const value of Object.values(material)) if (value?.isTexture) value.dispose();
      material.dispose?.();
    }
    if (object instanceof SplatMesh) object.dispose();
  });
  renderer.dispose();
}

function applyShading(root, mode) {
  root?.traverse((object) => {
    if (!object.isMesh) return;
    if (!object.userData.originalMaterial) object.userData.originalMaterial = object.material;
    object.material = mode === "matte" ? clayMaterial : mode === "wireframe" ? wireMaterial : object.userData.originalMaterial;
  });
}

function applyTransformTool(controls) {
  controls.mouseButtons = {
    LEFT: viewportTools.transform === "pan" ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };
}

function threeBase(container, withSpark = false) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 1000);
  camera.position.set(2.5, 1.8, 3.2);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // The Khronos PBR Neutral operator keeps base colours as authored; ACES would shift hue and saturation.
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  container.append(renderer.domElement);

  let grid = null;
  let base = null;
  if (withSpark) scene.add(new SparkRenderer({ renderer }));
  else {
    // Neutral studio lighting: white key, white fill, neutral sky and ground, so a material reads as authored.
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8a8a, 1.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(3, 6, 4);
    const fill = new THREE.DirectionalLight(0xffffff, 0.9);
    fill.position.set(-4, 2.5, -3.5);
    scene.add(key, fill);
    const buildGrid = () => {
      const made = new THREE.GridHelper(14, 28, tokenColor("--grid-major"), tokenColor("--grid-minor"));
      made.material.transparent = true;
      made.material.opacity = 0.6;
      made.visible = viewportTools.grid;
      return made;
    };
    grid = buildGrid();
    scene.add(grid);
    viewportRefresh = () => {
      const visible = grid.visible;
      scene.remove(grid);
      grid.geometry.dispose();
      grid.material.dispose();
      grid = buildGrid();
      grid.visible = visible;
      scene.add(grid);
      base.grid = grid;
    };
  }

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  applyTransformTool(controls);

  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(Math.max(width, 1), Math.max(height, 1), false);
    camera.aspect = Math.max(width, 1) / Math.max(height, 1);
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();
  base = { scene, camera, renderer, controls, observer, grid };
  return base;
}

// A SplatMesh carries no mesh geometry, so Box3.setFromObject cannot see its extents.
// Spark reports them itself; everything else measures normally.
function objectBounds(object) {
  if (object instanceof SplatMesh && typeof object.getBoundingBox === "function") {
    const local = object.getBoundingBox();
    if (local && !local.isEmpty()) {
      object.updateMatrixWorld(true);
      return local.clone().applyMatrix4(object.matrixWorld);
    }
  }
  return new THREE.Box3().setFromObject(object);
}

function frameObject(object, camera, controls) {
  const box = objectBounds(object);
  if (box.isEmpty()) return;
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const radius = Math.max(sphere.radius, 0.1);
  const distance = (radius / Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5))) * 1.45;
  controls.target.copy(sphere.center);
  camera.position.copy(sphere.center).addScaledVector(new THREE.Vector3(1, 0.72, 1.25).normalize(), distance);
  camera.near = Math.max(distance / 100, 0.001);
  camera.far = Math.max(distance * 40, 100);
  camera.updateProjectionMatrix();
  controls.update();
}

function publishViewportApi(base, root, { shading = true } = {}) {
  viewportApi = {
    frame: () => root && frameObject(root, base.camera, base.controls),
    setGrid: (visible) => { if (base.grid) base.grid.visible = visible; },
    setShading: (mode) => { if (shading) applyShading(root, mode); },
    setTransform: () => applyTransformTool(base.controls),
  };
  if (shading) applyShading(root, viewportTools.shading);
}

async function renderModel(container, run, artifact) {
  const status = document.createElement("div");
  status.className = "preview-status";
  status.textContent = "Loading model…";
  container.append(status);
  const base = threeBase(container);
  const animationId = { value: 0 };
  const clock = new THREE.Clock();
  let mixer = null;
  const animate = () => {
    animationId.value = requestAnimationFrame(animate);
    mixer?.update(clock.getDelta());
    base.controls.update();
    base.renderer.render(base.scene, base.camera);
  };
  animate();
  try {
    const gltf = await new GLTFLoader().loadAsync(artifactUrl(run.run_id, artifact.path));
    base.scene.add(gltf.scene);
    if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(gltf.scene);
      mixer.clipAction(gltf.animations[0]).play();
    }
    frameObject(gltf.scene, base.camera, base.controls);
    publishViewportApi(base, gltf.scene);
    status.textContent = gltf.animations.length
      ? `${gltf.animations.length} animation clip${gltf.animations.length === 1 ? "" : "s"} · first clip playing`
      : "Drag to orbit · scroll to zoom";
  } catch (error) {
    status.textContent = `Could not load model: ${error.message}`;
  }
  return () => disposeThree(base.scene, base.renderer, animationId, base.observer);
}

async function renderSplat(container, run, artifact) {
  const status = document.createElement("div");
  status.className = "preview-status";
  status.textContent = "Reading splat…";
  container.append(status);
  const base = threeBase(container, true);
  const animationId = { value: 0 };
  const animate = () => {
    animationId.value = requestAnimationFrame(animate);
    base.controls.update();
    base.renderer.render(base.scene, base.camera);
  };
  animate();
  try {
    const response = await fetch(artifactUrl(run.run_id, artifact.path));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const fileBytes = new Uint8Array(await response.arrayBuffer());
    const splat = new SplatMesh({ fileBytes, fileName: basename(artifact.path), onProgress: (event) => {
      const progress = event.lengthComputable ? ` ${Math.round((event.loaded / event.total) * 100)}%` : "";
      status.textContent = `Decoding splat${progress}…`;
    } });
    splat.quaternion.set(1, 0, 0, 0);
    base.scene.add(splat);
    await splat.initialized;
    frameObject(splat, base.camera, base.controls);
    publishViewportApi(base, splat, { shading: false });
    status.textContent = `${splat.numSplats.toLocaleString()} splats · drag to orbit`;
  } catch (error) {
    status.textContent = `Could not load splat: ${error.message}`;
  }
  return () => disposeThree(base.scene, base.renderer, animationId, base.observer);
}

function emptyViewport() {
  return `<div class="viewport-empty" aria-label="Empty viewport">
    <div class="empty-body">
      <span class="empty-icon">${brandIcon(108)}</span>
      <h2>What shall we forge?</h2>
      <p>Describe an asset in the prompt bar. Forge3D routes it, builds it locally, and shows the result here.</p>
    </div>
  </div>`;
}

/* ── state cards: what the viewport says when there is no file to show ── */

function commandMarkup(code) {
  return `<span class="cmd"><code>${escapeHtml(code)}</code><button class="cmd-copy" data-copy="${escapeHtml(code)}" title="Copy this command" aria-label="Copy the command ${escapeHtml(code)}">${icon("copy", 16)}<span>Copy</span></button></span>`;
}

function fixMarkup(fix) {
  return splitFix(fix).map((part) => part.code !== undefined ? commandMarkup(part.code) : escapeHtml(part.text)).join("");
}

function setupRow(row) {
  const problem = row.state !== "ready";
  return `<li class="setup-row ${escapeHtml(row.state)}">
    <i class="setup-dot" aria-hidden="true"></i>
    <div class="setup-text">
      <div class="setup-line"><strong>${escapeHtml(row.label)}</strong>${row.version ? `<span class="mono">${escapeHtml(row.version)}</span>` : ""}<span class="setup-state">${escapeHtml(row.stateWord)}</span>${row.blocksRoute ? '<span class="setup-tag">Blocks this run</span>' : ""}</div>
      ${problem && row.reason ? `<p class="setup-reason">${escapeHtml(row.reason)}</p>` : ""}
      ${problem && row.fix ? `<p class="setup-fix">${fixMarkup(row.fix)}</p>` : ""}
    </div>
  </li>`;
}

function setupGroup(title, rows) {
  if (!rows.length) return "";
  const ready = rows.filter((row) => row.state === "ready");
  const problems = rows.filter((row) => row.state !== "ready");
  // Problems get the full row (reason, fix, copyable command); what works is one compact line, so the fixes stay in view.
  return `<section class="setup-group"><h3>${title}<span class="mono">${ready.length} of ${rows.length} ready</span></h3>
    ${problems.length ? `<ul class="setup-rows">${problems.map(setupRow).join("")}</ul>` : ""}
    ${ready.length ? `<ul class="setup-ready">${ready.map((row) => `<li><i class="setup-dot" aria-hidden="true"></i>${escapeHtml(row.label)}${row.version ? ` <span class="mono">${escapeHtml(row.version)}</span>` : ""}<span class="sr-only"> ready</span></li>`).join("")}</ul>` : ""}
  </section>`;
}

function agentChoiceRow(choice) {
  const problem = choice.state !== "ready";
  return `<li class="setup-row ${escapeHtml(choice.state)}">
    <i class="setup-dot" aria-hidden="true"></i>
    <div class="setup-text">
      <div class="setup-line"><strong>${escapeHtml(choice.name)}</strong>${choice.version ? `<span class="mono">${escapeHtml(choice.version)}</span>` : ""}<span class="setup-state">${escapeHtml(choice.stateWord)}</span>${choice.chosen ? '<span class="setup-tag">In use</span>' : ""}</div>
      <p class="setup-reason">${escapeHtml(choice.images)}</p>
      ${problem && choice.reason ? `<p class="setup-reason">${escapeHtml(choice.reason)}</p>` : ""}
      ${problem && choice.fix ? `<p class="setup-fix">${fixMarkup(choice.fix)}</p>` : ""}
      ${choice.chosen ? "" : `<p><button class="btn ghost" data-use-agent="${escapeHtml(choice.id)}" ${state.activeJob ? "disabled" : ""}>Use ${escapeHtml(choice.name)}</button></p>`}
    </div>
  </li>`;
}

function agentChoiceGroup() {
  const choices = agentChoices(agentStatuses);
  if (!choices.length) return "";
  return `<section class="setup-group"><h3>Agent<span class="mono">${escapeHtml(agentName())}</span></h3>
    <ul class="setup-rows">${choices.map(agentChoiceRow).join("")}</ul>
  </section>`;
}

function setupCard(forced) {
  const readiness = currentReadiness();
  const firstRun = !state.runs.length;
  const head = setupHeadline(readiness, { firstRun });
  const tone = readiness.phase === "blocked" ? "blocked" : readiness.phase === "ready" ? "ready" : readiness.phase === "checking" ? "checking" : "warn";
  const checking = capsChecking;
  const reportError = readiness.phase === "error";
  return `<div class="viewport-empty state-wrap"><section class="state-card setup-card ${tone}" aria-label="Setup" aria-busy="${checking}">
    <header class="state-head">
      ${tone === "ready" || tone === "checking" ? `<span class="empty-icon small">${brandIcon(64)}</span>` : ""}
      <h2>${escapeHtml(head.title)}</h2>
      <p>${escapeHtml(head.lead)}</p>
    </header>
    ${reportError ? `<pre class="state-error">${escapeHtml(readiness.error)}</pre>` : ""}
    ${reportError && readiness.fix ? `<p class="setup-fix lead-fix">${fixMarkup(readiness.fix)}</p>` : ""}
    ${readiness.unavailableRoutes.length && readiness.phase === "ready" ? `<p class="state-note">Not available on this machine: ${escapeHtml(readiness.unavailableRoutes.join(", "))}. Auto routes around it.</p>` : ""}
    <div class="state-actions">
      <button class="btn ${tone === "blocked" || reportError ? "primary" : ""}" data-recheck ${checking ? "disabled" : ""}>${checking ? "Checking…" : "Check again"}</button>
      ${forced || state.runs.length ? '<button class="btn ghost" data-close-setup>Close</button>' : ""}
    </div>
    ${readiness.checked || agentStatuses ? `<div class="setup-groups">${agentChoiceGroup()}${readiness.checked ? `${setupGroup("Required", readiness.required)}${setupGroup("Optional", readiness.optional)}` : ""}</div>` : ""}
  </section></div>`;
}

function failedCard(stateInfo, run) {
  return `<div class="viewport-empty state-wrap"><section class="state-card failed" aria-label="Run failed">
    <header class="state-head">
      <h2>The build stopped</h2>
      <p>${escapeHtml(run.prompt || run.name || "This run")} did not produce a file.</p>
    </header>
    <pre class="state-error">${escapeHtml(stateInfo.message)}</pre>
    ${stateInfo.hint ? `<p class="state-note">${escapeHtml(stateInfo.hint)}</p>` : ""}
    <div class="state-actions">
      <button class="btn primary" data-state-action="retry">Try again</button>
      <button class="btn" data-state-action="edit">Edit the prompt</button>
      <button class="btn ghost" data-state-action="logs">Open logs</button>
    </div>
  </section></div>`;
}

function stoppedCard(stateInfo, run) {
  return `<div class="viewport-empty state-wrap"><section class="state-card stopped" aria-label="Run stopped">
    <header class="state-head">
      <h2>The run was ${stateInfo.status === "cancelled" ? "cancelled" : "interrupted"}</h2>
      <p>${escapeHtml(run.prompt || run.name || "This run")} stopped before it made a file. Anything it already wrote is kept.</p>
    </header>
    <div class="state-actions">
      <button class="btn primary" data-state-action="resume">Resume</button>
      <button class="btn" data-state-action="edit">Edit the prompt</button>
      <button class="btn ghost" data-state-action="logs">Open logs</button>
    </div>
  </section></div>`;
}

function runningCard(stateInfo, run) {
  const detail = stateInfo.starting ? `Starting ${agentName()} and routing the request` : stateInfo.activity ? sentenceCase(stateInfo.activity) : "Waiting for the next step";
  return `<div class="viewport-empty state-wrap"><section class="state-card running" aria-label="Run in progress" aria-busy="true">
    <header class="state-head">
      <span class="empty-icon small">${brandIcon(64)}</span>
      <h2>Working on it</h2>
      <p>${escapeHtml(run.prompt || run.name || "")}</p>
    </header>
    <div class="state-rail unknown" title="Length not known"></div>
    <p class="state-progress"><strong>${escapeHtml(detail)}</strong>
      <span>${stateInfo.done} action${stateInfo.done === 1 ? "" : "s"} done${stateInfo.startedAt ? ` · ${elapsedMarkup(stateInfo.startedAt)}` : ""}</span></p>
    <p class="state-note">Forge3D cannot tell how far along a build is, so it shows the step and the time instead of a percentage.</p>
    <div class="state-actions"><button class="btn ghost" data-state-action="logs">Open logs</button></div>
  </section></div>`;
}

function finishedCard() {
  return `<div class="blank-state"><h2>Finished, with nothing to preview</h2><p>This run produced no file the viewport can show. Check Files or Logs in the inspector.</p></div>`;
}

function editPrompt(run) {
  elements.prompt.value = run.prompt || "";
  autoGrowPrompt();
  elements.prompt.focus();
}

async function onStateAction(action) {
  const run = selectedRun();
  if (!run) return;
  if (action === "logs") {
    setPanel("inspector", true);
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === "logs"));
    renderInspector();
  } else if (action === "edit") {
    editPrompt(run);
  } else if (action === "resume") {
    runAction("continue");
  } else if (action === "retry") {
    editPrompt(run);
    startOrSteer();
  }
}

function bindStateCard() {
  elements.preview.querySelector("[data-recheck]")?.addEventListener("click", () => checkCapabilities(true));
  elements.preview.querySelector("[data-close-setup]")?.addEventListener("click", () => openSetup(false));
  elements.preview.querySelectorAll("[data-use-agent]").forEach((button) => button.addEventListener("click", () => chooseAgent(button.dataset.useAgent)));
  elements.preview.querySelectorAll("[data-state-action]").forEach((button) => button.addEventListener("click", () => onStateAction(button.dataset.stateAction)));
  elements.preview.querySelectorAll("[data-copy]").forEach((button) => button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      toast("Command copied", "success");
    } catch (error) {
      toast(`Could not copy: ${error.message}`, "error");
    }
  }));
}

async function renderPreview() {
  previewDispose();
  previewDispose = () => {};
  viewportApi = null;
  viewportRefresh = null;
  const run = selectedRun();
  const artifact = selectedArtifact(run);
  renderHud();
  const view = stageState({
    run, hasArtifact: Boolean(artifact), forceSetup: showSetup, hasRuns: state.runs.length > 0,
    live: Boolean(state.activeJob && run && state.activeJob.runId === run.run_id), readiness: currentReadiness(),
  });
  previewKind = view.kind;
  if (view.kind !== "artifact") {
    elements.preview.classList.add("inset-panels");
    elements.preview.innerHTML = view.kind === "setup" ? setupCard(view.forced)
      : view.kind === "failed" ? failedCard(view, run)
      : view.kind === "stopped" ? stoppedCard(view, run)
      : view.kind === "running" ? runningCard(view, run)
      : view.kind === "finished" ? finishedCard()
      : emptyViewport();
    bindStateCard();
    return;
  }
  selectedArtifactPath = artifact.path;
  elements.preview.innerHTML = "";
  const role = artifact.preview_role;
  elements.preview.classList.toggle("inset-panels", role !== "model" && role !== "gaussian-splat");
  if (["primary-image", "image", "animation"].includes(role)) {
    const image = new Image();
    image.className = "media-preview";
    image.alt = artifact.name;
    image.src = artifactUrl(run.run_id, artifact.path);
    elements.preview.append(image);
  } else if (role === "image-sequence") {
    const image = new Image();
    image.className = "media-preview";
    elements.preview.append(image);
    let index = 0;
    const frames = artifact.frames || [artifact.path];
    const draw = () => { image.src = artifactUrl(run.run_id, frames[index % frames.length]); index += 1; };
    draw();
    const timer = setInterval(draw, 1000 / 12);
    previewDispose = () => clearInterval(timer);
  } else if (role === "model") {
    previewDispose = await renderModel(elements.preview, run, artifact);
  } else if (role === "gaussian-splat") {
    previewDispose = await renderSplat(elements.preview, run, artifact);
  } else if (["validation", "text"].includes(role)) {
    const pre = document.createElement("pre");
    pre.className = "text-preview";
    pre.textContent = "Loading…";
    elements.preview.append(pre);
    try {
      const response = await fetch(artifactUrl(run.run_id, artifact.path));
      const text = await response.text();
      pre.textContent = artifact.media_type === "application/json" ? JSON.stringify(JSON.parse(text), null, 2) : text;
    } catch (error) {
      pre.textContent = `Could not load ${artifact.name}: ${error.message}`;
    }
  } else {
    elements.preview.innerHTML = `<div class="blank-state">${icon(artifactIcon(artifact), 48)}<h2>${escapeHtml(artifact.name)}</h2><p>${escapeHtml(artifact.media_type)} · <span class="mono">${escapeHtml(formatBytes(artifact.size_bytes))}</span></p><p>This file has no embedded preview. Use Reveal or Open in the inspector.</p></div>`;
  }
}

function captureViewport() {
  const canvas = elements.preview.querySelector("canvas");
  if (!canvas) return toast("The viewport has no rendered 3D output to capture", "warn");
  try {
    canvas.toBlob((blob) => {
      if (!blob) return toast("The viewport could not be captured", "error");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `forge3d-viewport-${Date.now()}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      toast("Viewport captured");
    }, "image/png");
  } catch (error) {
    toast(error.message, "error");
  }
}

/* ── projects: the start screen, the File menu, and the title ── */

// The open project's identity. When it changes, the composer, selection and run settings are taken from the
// project instead of carrying over from the one before.
let projectKey;
let sentView = "";

function syncProject() {
  const project = state.project;
  const key = project === undefined ? undefined : project ? project.id : null;
  if (key === projectKey) return;
  projectKey = key;
  if (key === undefined) return;
  composing = false;
  attachments = [];
  elements.prompt.value = "";
  autoGrowPrompt();
  renderAttachments();
  selectedRunId = project?.view?.selected_run_id || null;
  selectedArtifactPath = project?.view?.selected_artifact || null;
  sentView = JSON.stringify({ selected_run_id: selectedRunId, selected_artifact: selectedArtifactPath });
  if (project && Object.keys(project.settings || {}).length) applyRunSettings({ ...runSettings, ...project.settings });
  showSetup = false;
}

// Where the person is in the project travels with it (saved with the project, never making it unsaved).
function syncView() {
  if (!state.project) return;
  const view = JSON.stringify({ selected_run_id: selectedRunId, selected_artifact: selectedArtifactPath });
  if (view === sentView) return;
  sentView = view;
  api.project?.setView(JSON.parse(view)).catch(() => {});
}

function renderProjectChrome() {
  const project = state.project;
  const noProject = project === null;
  app.classList.toggle("no-project", noProject);
  document.title = projectTitle(project);
  elements.projectName.classList.toggle("hidden", !project);
  if (project) {
    elements.projectName.innerHTML = `<span class="project-label">${escapeHtml(project.name)}</span>${project.dirty ? '<i class="dirty-dot" aria-label="Unsaved changes"></i>' : ""}`;
    elements.projectName.title = project.untitled
      ? "Not saved yet. Its runs are kept in a temporary folder until you save (Ctrl+S)."
      : `${project.file}${project.dirty ? " · unsaved changes" : ""}`;
  }
  renderStartScreen();
}

function recentRow(entry) {
  return `<li class="recent-row ${entry.missing ? "missing" : ""}">
    <button class="recent-open" data-open-recent="${escapeHtml(entry.path)}" ${entry.missing ? "disabled" : ""} title="${escapeHtml(entry.missing ? `Not found: ${entry.path}` : entry.path)}">
      <span class="recent-icon">${icon("runs", 24, { hue: entry.missing ? "stone" : undefined })}</span>
      <span class="recent-lines"><strong>${escapeHtml(entry.name)}</strong><small class="mono">${escapeHtml(displayFolder(entry.folder))}</small></span>
      <span class="recent-when">${entry.missing ? "Not found" : escapeHtml(entry.opened_at ? formatDate(entry.opened_at) : "")}</span>
    </button>
    <button class="icon-action recent-remove" data-remove-recent="${escapeHtml(entry.path)}" title="Remove from the list" aria-label="Remove ${escapeHtml(entry.name)} from the recent list">${icon("close", 16)}</button>
  </li>`;
}

function renderStartScreen() {
  const visible = state.project === null;
  elements.startScreen.classList.toggle("hidden", !visible);
  if (!visible) { elements.startScreen.innerHTML = ""; return; }
  const recent = state.recent || [];
  const recoverable = state.recoverable || [];
  elements.startScreen.innerHTML = `
    <div class="start-body">
      <header class="start-head">
        <span class="empty-icon">${brandIcon(84)}</span>
        <div>
          <h1>Forge3D</h1>
          <p>Each project keeps its own runs, files and run settings in one folder.</p>
        </div>
      </header>
      <div class="start-actions">
        <button class="btn primary start-action" data-start="new">${icon("add", 16)}<span>New project</span><kbd>Ctrl N</kbd></button>
        <button class="btn start-action" data-start="open">${icon("folder", 24)}<span>Open project…</span><kbd>Ctrl O</kbd></button>
      </div>
      ${recoverable.length ? `<section class="start-section recovered">
        <h2>Unsaved work</h2>
        <p class="start-note">Forge3D closed before these untitled projects were saved. Recover one, then save it.</p>
        <ul class="recent-list">${recoverable.map((item) => `<li class="recent-row"><button class="recent-open" data-recover="${escapeHtml(item.id)}">
          <span class="recent-icon">${icon("resume", 24)}</span>
          <span class="recent-lines"><strong>Untitled project</strong><small>Last changed ${escapeHtml(formatDate(item.modified_at))}</small></span>
          <span class="recent-when">Recover</span></button></li>`).join("")}</ul>
      </section>` : ""}
      <section class="start-section">
        <div class="start-section-head"><h2>Recent projects</h2>${recent.length ? '<button class="link-button" data-start="clear-recent">Clear</button>' : ""}</div>
        ${recent.length ? `<ul class="recent-list">${recent.map(recentRow).join("")}</ul>`
          : '<p class="start-note">Projects you open or save appear here.</p>'}
      </section>
      <label class="check start-reopen"><input type="checkbox" id="reopen-last" ${state.preferences?.reopenLast ? "checked" : ""} /> Reopen the last project when Forge3D starts</label>
    </div>`;
  elements.startScreen.querySelectorAll("[data-start]").forEach((button) => button.addEventListener("click", () => projectCommand(button.dataset.start)));
  elements.startScreen.querySelectorAll("[data-open-recent]").forEach((button) => button.addEventListener("click", () => projectCommand("open", { path: button.dataset.openRecent })));
  elements.startScreen.querySelectorAll("[data-remove-recent]").forEach((button) => button.addEventListener("click", () => projectCommand("remove-recent", { path: button.dataset.removeRecent })));
  elements.startScreen.querySelectorAll("[data-recover]").forEach((button) => button.addEventListener("click", () => projectCommand("recover", { id: button.dataset.recover })));
  elements.startScreen.querySelector("#reopen-last")?.addEventListener("change", (event) => projectCommand("preferences", { reopenLast: event.target.checked }));
}

let fileMenuClosedAt = 0;
function openFileMenu() {
  // A click on File while its menu is open closes it: the pointerdown already did, so the click must not reopen it.
  if (Date.now() - fileMenuClosedAt < 300) return;
  const items = fileMenuModel({ project: state.project, recent: state.recent, busy: Boolean(state.activeJob) }).map((item) => {
    if (item === "-" || item.heading) return item;
    if (item.path) return { ...item, run: () => projectCommand("open", { path: item.path }) };
    return { ...item, run: () => projectCommand(item.id) };
  });
  elements.fileMenu.setAttribute("aria-expanded", "true");
  const menu = openMenu(elements.fileMenu.getBoundingClientRect(), items, {
    align: "left",
    label: "File",
    onClose: () => { elements.fileMenu.setAttribute("aria-expanded", "false"); fileMenuClosedAt = Date.now(); },
  });
  menu.classList.add("file-menu");
  menu.querySelector("button:not(:disabled)")?.focus();
}

let projectBusy = false;
async function projectCommand(command, payload = {}) {
  if (projectBusy) return;
  const project = api.project;
  if (!project) return toast("This build of Forge3D has no project support", "error");
  projectBusy = true;
  try {
    let result = null;
    if (command === "new") result = await project.create({ settings: runSettings });
    else if (command === "open") result = await project.open(payload);
    else if (command === "recover") result = await project.openRecovered(payload);
    else if (command === "save") result = await project.save();
    else if (command === "save-as") result = await project.saveAs();
    else if (command === "close") result = await project.close();
    else if (command === "rename") {
      const name = await askDialog({ eyebrow: "Project", title: "Rename project", body: "The project file gets the new name, and so does its folder when the folder has the project's name.", input: { value: state.project?.name || "" }, confirmLabel: "Rename" });
      if (name === null || !name.trim() || name.trim() === state.project?.name) return;
      result = await project.changeName({ name });
      toast(`Renamed to ${result.project?.name || name.trim()}`, "success");
    } else if (command === "delete") result = await project.trash();
    else if (command === "reveal") await project.reveal();
    else if (command === "remove-recent") result = await project.removeRecent(payload);
    else if (command === "clear-recent") result = await project.clearRecent();
    else if (command === "preferences") result = await project.setPreferences(payload);
    if (result) {
      const { canceled, saved, ...next } = result;
      state = { ...state, ...next };
      renderAll();
      if (saved) toast(`Saved ${state.project?.name || "the project"}`, "success");
      if (command === "new" && !canceled) elements.prompt.focus();
    }
  } catch (error) {
    toast(error.message.replace(/^Error invoking remote method '[^']+': (Error: )?/, ""), "error");
  } finally {
    projectBusy = false;
  }
}

/* ── composer, approvals, and orchestration ─────────────────── */

function renderAttachments() {
  elements.attachments.innerHTML = attachments.map((item, index) => `
    <span class="attachment-chip">${escapeHtml(basename(item))}<button data-remove-attachment="${index}" aria-label="Remove ${escapeHtml(basename(item))}">×</button></span>`).join("");
  elements.attachments.querySelectorAll("[data-remove-attachment]").forEach((button) => button.addEventListener("click", () => {
    attachments.splice(Number(button.dataset.removeAttachment), 1);
    renderAttachments();
    refreshReadiness();
  }));
}

let wasActive = false;
let strikeUntil = 0; // the hammer finishes its strike on the Run button before it turns into Steer
function strikeHammer() {
  const hammer = elements.send.querySelector(".fi");
  if (!hammer || elements.send.dataset.mode !== "run") return;
  hammer.classList.add("is-playing");
  strikeUntil = Date.now() + 550;
  setTimeout(renderComposer, 560);
}
function renderComposer() {
  const active = state.activeJob;
  const gate = runGate(currentReadiness());
  const blocked = !active && !gate.allowed;
  const sendMode = active ? "steer" : "run";
  if (elements.send.dataset.mode !== sendMode && Date.now() >= strikeUntil) { // not redrawn every render, so a strike in flight is not cut off
    elements.send.dataset.mode = sendMode;
    elements.send.innerHTML = active ? `${icon("send", 24)}<span>Steer</span>` : `${icon("hammer", 24)}<span>Run</span>`;
  }
  elements.send.classList.toggle("steering", Boolean(active));
  // aria-disabled rather than disabled: the button stays focusable and pressing it opens the setup card that says why.
  elements.send.classList.toggle("blocked", blocked);
  elements.send.setAttribute("aria-disabled", String(blocked));
  elements.send.title = active ? "Send a steering note to the running job"
    : blocked ? gate.message
    : gate.level === "warn" ? `Run the prompt. Warning: ${gate.message}`
    : "Run the prompt";
  const showChip = !active && Boolean(gate.chip);
  elements.gateChip.classList.toggle("hidden", !showChip);
  elements.gateChip.className = `gate-chip ${gate.level}${showChip ? "" : " hidden"}`;
  elements.gateChip.textContent = gate.chip;
  elements.gateChip.title = `${gate.message} Click to see what Forge3D checked.`;
  elements.cancel.classList.toggle("hidden", !active);
  elements.topbarProgress.classList.toggle("on", Boolean(active));
  // The cube lifts its lid for a few seconds when a job starts, then rests again.
  if (active && !wasActive) {
    const brand = document.getElementById("brand");
    brand.classList.add("ii-play");
    setTimeout(() => brand.classList.remove("ii-play"), 3300);
  }
  wasActive = Boolean(active);
  elements.prompt.placeholder = active ? "Steer the running job…" : "Describe the asset or change…";
}

function renderApproval() {
  if (!approval) {
    elements.approvalLayer.innerHTML = "";
    return;
  }
  const params = approval.params || {};
  const request = params.request || {};
  const network = params.networkApprovalContext;
  const isMcp = approval.method === "mcpServer/elicitation/request";
  const persistence = request._meta?.persist;
  const canPersistSession = persistence === "session" || persistence === "always" || (Array.isArray(persistence) && persistence.includes("session"));
  const title = network ? `Network access to ${network.host || "an external host"}`
    : isMcp ? `${sentenceCase(params.serverName || "Local")} tool approval`
      : approval.method.includes("fileChange") ? "Approve file changes" : "Approve command";
  const detail = network ? `${network.protocol || "network"} access${network.port ? ` on port ${network.port}` : ""}`
    : request.message || params.command || params.reason || JSON.stringify(params, null, 2);
  const explanation = isMcp ? "A local Forge3D tool is ready to perform this action." : params.reason || "Forge3D needs your decision before continuing.";
  elements.approvalLayer.innerHTML = `
    <div class="scrim">
      <section class="modal" role="dialog" aria-modal="true">
        <div class="modal-head">
          <small>${escapeHtml(agentName())} approval</small>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(explanation)}</p>
        </div>
        <div class="modal-body"><pre>${escapeHtml(detail)}</pre></div>
        <div class="modal-foot">
          <button class="btn ghost" data-decision="cancel">Cancel job action</button>
          <button class="btn danger" data-decision="decline">Deny</button>
          ${canPersistSession ? '<button class="btn" data-decision="acceptForSession">Approve for session</button>' : ""}
          <button class="btn primary" data-decision="accept">Approve once</button>
        </div>
      </section>
    </div>`;
  elements.approvalLayer.querySelectorAll("[data-decision]").forEach((button) => button.addEventListener("click", () => decideApproval(button.dataset.decision)));
}

function renderAll({ preview = true } = {}) {
  syncProject();
  if (!selectedRunId && state.runs.length && !composing) selectedRunId = state.runs[0].run_id;
  if (selectedRunId && !state.runs.some((run) => run.run_id === selectedRunId)) selectedRunId = state.runs[0]?.run_id || null;
  renderDependencies();
  renderModelOptions();
  renderRuns();
  renderRunBrief();
  renderInspector();
  renderPipeline();
  renderFilmstrip();
  renderComposer();
  renderApproval();
  renderHud();
  renderProjectChrome();
  syncView();
  if (preview || previewKind === "running") renderPreview();
}

function selectRun(runId) {
  if (runId === selectedRunId) return;
  composing = false;
  selectedRunId = runId;
  selectedArtifactPath = null;
  renderAll();
}

function selectArtifact(path) {
  selectedArtifactPath = path;
  syncView();
  renderInspector();
  renderFilmstrip();
  renderPreview();
}

function setPanel(name, open) {
  panels[name] = open;
  elements[name].dataset.open = String(open);
  elements[`${name}Toggle`].setAttribute("aria-expanded", String(open));
  writePreference("forge3d.panels", panels);
  updateDockOffset();
}

// Keeps flat previews and the empty state centred in the space the panels leave free.
function updateDockOffset() {
  const styles = getComputedStyle(document.documentElement);
  const width = (name) => parseFloat(styles.getPropertyValue(name)) || 0;
  const open = (panels.library ? width("--lib-w") + 12 : 0) + (panels.inspector ? width("--insp-w") + 12 : 0);
  document.querySelector(".stage").style.setProperty("--dock-offset", `${open + 88}px`);
}

// Rail icons: the glyph's own colour while its tool is on, stone while it rests. Momentary actions rest in stone.
function paintRail() {
  document.querySelectorAll(".rail-button[data-icon]").forEach((button) => {
    const on = button.classList.contains("active");
    const paint = on ? "on" : "off";
    if (button.dataset.painted === paint) return;
    button.dataset.painted = paint;
    button.innerHTML = icon(button.dataset.icon, 24, { hue: on ? undefined : "stone" });
  });
}

function setViewportTool(key, value) {
  viewportTools[key] = value;
  writePreference("forge3d.viewport", viewportTools);
  document.querySelectorAll(`[data-${key === "transform" ? "transform" : key === "shading" ? "shading" : "toggle"}]`).forEach((button) => {
    if (key === "grid") button.classList.toggle("active", Boolean(value));
    else button.classList.toggle("active", button.dataset[key] === value);
  });
  paintRail();
  if (key === "grid") viewportApi?.setGrid(Boolean(value));
  if (key === "shading") viewportApi?.setShading(value);
  if (key === "transform") viewportApi?.setTransform();
}

async function refreshState(preview = false) {
  try {
    const refreshed = await api.refreshTools({});
    state = { ...state, ...refreshed };
    renderAll({ preview });
  } catch (error) {
    toast(error.message, "error");
  }
}

function scheduleRefresh() {
  if (refreshTimer) return;
  refreshTimer = setTimeout(async () => {
    refreshTimer = null;
    await refreshState(false);
  }, 280);
}

async function startOrSteer() {
  const text = elements.prompt.value.trim();
  if (!state.activeJob) {
    const gate = runGate(currentReadiness());
    if (!gate.allowed) {
      openSetup(true);
      return toast(gate.message, "warn");
    }
  }
  if (!text) {
    elements.prompt.focus();
    return toast("Write a prompt first", "warn");
  }
  if (!state.activeJob) strikeHammer();
  elements.send.disabled = true;
  try {
    if (state.activeJob) {
      await api.steer({ runId: state.activeJob.runId, text });
      elements.prompt.value = "";
      autoGrowPrompt();
      toast("Steering note sent", "success");
    } else {
      const result = await api.startRun({
        prompt: text,
        attachments,
        workflow: elements.workflow.value,
        quality: elements.quality.value,
        targetFormat: elements.target.value,
        tool: elements.tool.value,
        model: elements.model.value,
        effort: elements.effort.value,
        outputSettings: {},
      });
      state = { ...state, ...result };
      composing = false;
      selectedRunId = state.activeJob?.runId || state.runs[0]?.run_id;
      selectedArtifactPath = null;
      attachments = [];
      elements.prompt.value = "";
      autoGrowPrompt();
      renderAttachments();
      renderAll();
    }
  } catch (error) {
    toast(error.message, "error");
  } finally {
    elements.send.disabled = false;
  }
}

async function cancelActive() {
  if (!state.activeJob) return toast("No run is active");
  try {
    state = { ...state, ...(await api.cancel({ runId: state.activeJob.runId })) };
    renderAll({ preview: false });
  } catch (error) {
    toast(error.message, "error");
  }
}

async function decideApproval(decision) {
  try {
    await api.answerApproval({ requestId: approval.requestId, decision });
    approval = null;
    renderApproval();
  } catch (error) {
    toast(error.message, "error");
  }
}

async function repairPlugin() {
  const agreed = await askDialog({
    eyebrow: `${agentName()} plugin`,
    title: `Repair the Forge3D plugin for ${agentName()}?`,
    body: "The plugin is reinstalled from this application bundle. The current plugin directory is preserved as a timestamped backup.",
    confirmLabel: "Repair plugin",
  });
  if (!agreed) return;
  try {
    const result = await api.repairPlugin();
    state.skill = result.skill;
    renderDependencies();
    toast(`Forge3D plugin ${result.version} is ready`, "success");
  } catch (error) {
    toast(error.message, "error");
  }
}

async function runAction(action) {
  const run = selectedRun();
  if (!run) return toast("Select a run first", "warn");
  try {
    if (action === "continue") {
      const ownSession = (run.agent?.session_id ? run.agent.id : run.codex?.thread_id ? "codex" : null) === state.agent?.id;
      const text = await askDialog({
        eyebrow: "Resume run",
        title: "Continue this run",
        body: ownSession
          ? `${agentName()} continues in this run's session, with the files already on disk.`
          : `${agentName()} starts a new session with this run's prompt and the files already on disk.`,
        input: { value: "Continue from the saved state, inspect existing artifacts, and finish the run." },
        confirmLabel: "Resume",
      });
      if (text === null) return;
      state = { ...state, ...(await api.continueRun({ runId: run.run_id, text, model: elements.model.value, effort: elements.effort.value })) };
      renderAll({ preview: false });
    } else if (action === "duplicate") {
      const duplicate = await api.duplicate({ runId: run.run_id });
      composing = false;
      selectedRunId = duplicate.run_id;
      await refreshState(true);
      toast("Run duplicated", "success");
    } else if (action === "archive") {
      const agreed = await askDialog({ eyebrow: "Archive", title: "Archive this run?", body: "It stays browsable and recoverable inside the archive.", confirmLabel: "Archive" });
      if (!agreed) return;
      await api.archive({ runId: run.run_id });
      await refreshState(true);
      toast("Run archived", "success");
    } else if (action === "trash") {
      const agreed = await askDialog({ eyebrow: "Delete", title: "Move this run to the Recycle Bin?", body: `The whole run directory for “${run.prompt || run.name}” is moved to the Windows Recycle Bin.`, confirmLabel: "Move to trash", danger: true });
      if (!agreed) return;
      await api.trash({ runId: run.run_id });
      await refreshState(true);
      toast("Run moved to the Recycle Bin", "success");
    }
  } catch (error) {
    toast(error.message, "error");
  }
}

async function artifactAction(action) {
  const run = selectedRun();
  const artifact = selectedArtifact(run);
  if (!run || !artifact) return toast("Select an output first", "warn");
  try {
    if (action === "export") {
      const result = await api.exportArtifact({ runId: run.run_id, path: artifact.path });
      if (!result.canceled) toast("Exported " + artifact.name + " as " + result.format.toUpperCase(), "success");
      return;
    }
    await api.artifactAction({ runId: run.run_id, path: artifact.path, action });
    toast(action === "copy" ? "Artifact path copied" : `${artifact.name}: ${action}`, "success");
  } catch (error) {
    toast(error.message, "error");
  }
}

function resetForNewRun() {
  composing = true;
  selectedRunId = null;
  selectedArtifactPath = null;
  elements.prompt.focus();
  renderAll();
}

/* ── events ─────────────────────────────────────────────────── */

function autoGrowPrompt() {
  elements.prompt.style.height = "20px";
  elements.prompt.style.height = `${Math.min(elements.prompt.scrollHeight, 116)}px`;
}

function toggleSettings(force) {
  const open = force ?? elements.settingsPopover.classList.contains("hidden");
  elements.settingsPopover.classList.toggle("hidden", !open);
  elements.settingsToggle.setAttribute("aria-expanded", String(open));
  if (open) elements.workflow.focus();
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.querySelector(".stage").requestFullscreen();
  } catch (error) {
    toast(error.message, "error");
  }
}

elements.prompt.addEventListener("input", autoGrowPrompt);
elements.prompt.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    startOrSteer();
  }
});
elements.send.addEventListener("click", startOrSteer);
elements.cancel.addEventListener("click", cancelActive);
elements.attach.addEventListener("click", async () => {
  try {
    const picked = await api.pickAttachments();
    attachments = [...new Set([...attachments, ...picked])].slice(0, 12);
    renderAttachments();
    refreshReadiness();
  } catch (error) {
    toast(error.message, "error");
  }
});

for (const key of ["workflow", "quality", "target", "tool", "model", "effort"]) {
  elements[key].addEventListener("change", () => { persistRunSettings(); refreshReadiness(); });
}
elements.settingsToggle.addEventListener("click", () => toggleSettings());
document.querySelector("#settings-close").addEventListener("click", () => toggleSettings(false));
document.addEventListener("pointerdown", (event) => {
  if (elements.settingsPopover.classList.contains("hidden")) return;
  if (elements.settingsPopover.contains(event.target) || elements.settingsToggle.contains(event.target)) return;
  toggleSettings(false);
});

document.querySelector("#new-run").addEventListener("click", () => { setPanel("library", true); resetForNewRun(); });
elements.runSearch.addEventListener("input", renderRuns);
document.querySelector("#inspector-close").addEventListener("click", () => setPanel("inspector", false));
elements.libraryToggle.addEventListener("click", () => setPanel("library", !panels.library));
elements.inspectorToggle.addEventListener("click", () => setPanel("inspector", !panels.inspector));
document.querySelectorAll(".tab").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab === button));
  renderInspector();
}));

document.querySelectorAll("[data-transform]").forEach((button) => button.addEventListener("click", () => setViewportTool("transform", button.dataset.transform)));
document.querySelectorAll("[data-shading]").forEach((button) => button.addEventListener("click", () => setViewportTool("shading", button.dataset.shading)));
document.querySelector('[data-toggle="grid"]').addEventListener("click", () => setViewportTool("grid", !viewportTools.grid));
document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => {
  const action = button.dataset.action;
  if (action === "frame") viewportApi ? viewportApi.frame() : toast("Load a 3D output to frame it");
  else if (action === "capture") captureViewport();
  else if (action === "fullscreen") toggleFullscreen();
}));

document.addEventListener("keydown", (event) => {
  const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
  if (event.key === "Escape") {
    closeMenu();
    toggleSettings(false);
    if (showSetup && !document.querySelector(".scrim")) openSetup(false);
    return;
  }
  const command = shortcutCommand(event);
  if (command) {
    event.preventDefault();
    if (document.querySelector(".scrim")) return; // a Forge3D dialog is open
    closeMenu();
    if ((command === "save" || command === "save-as") && !state.project) return;
    projectCommand(command);
    return;
  }
  if (!(event.ctrlKey || event.metaKey) || event.shiftKey || event.altKey) return;
  if (!state.project) return; // the start screen has no workstation to drive
  const key = event.key.toLowerCase();
  if (key === "k") { event.preventDefault(); elements.prompt.focus(); elements.prompt.select(); }
  else if (key === "b") { event.preventDefault(); setPanel("library", !panels.library); }
  else if (key === "i" && !typing) { event.preventDefault(); setPanel("inspector", !panels.inspector); }
});

elements.gateChip.addEventListener("click", () => openSetup(true));
elements.fileMenu.addEventListener("click", openFileMenu);
elements.dependencyStrip.addEventListener("click", () => openSetup(!showSetup));

addEventListener("resize", updateDockOffset);

// Elapsed times are drawn from a start time and kept current here; nothing else moves on a timer.
setInterval(() => {
  document.querySelectorAll("[data-elapsed-since]").forEach((node) => {
    node.textContent = formatElapsed(Date.now() - Number(node.dataset.elapsedSince));
  });
}, 1000);

function updateStatusTime() {
  elements.statusTime.textContent = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date());
}

/* ── boot ───────────────────────────────────────────────────── */

setPanel("library", panels.library);
setPanel("inspector", panels.inspector);
setViewportTool("transform", viewportTools.transform);
setViewportTool("shading", viewportTools.shading);
setViewportTool("grid", viewportTools.grid);
autoGrowPrompt();
updateStatusTime();
setInterval(updateStatusTime, 30000);
renderAll();
checkCapabilities(false); // not awaited: a cold WSL can take seconds, and the window must not wait for it

api.onState((next) => { state = { ...state, ...next }; renderAll({ preview: !state.activeJob }); });
api.onEvent(() => scheduleRefresh());
api.onApproval((request) => { approval = request; renderApproval(); });
api.onError((message) => toast(message, "error"));

try {
  // The project and the recent list come back at once; bootstrap may wait for the agent (Codex starts its App Server).
  state = { ...state, ...(await api.refreshTools({})) };
  renderAll();
} catch { /* bootstrap below reports a failure */ }

try {
  state = { ...state, ...(await api.bootstrap()) };
  renderAll();
} catch (error) {
  state.appServerError = error.message;
  renderAll();
  toast(error.message, "error");
}
