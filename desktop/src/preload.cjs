"use strict";

const { contextBridge, ipcRenderer } = require("electron");

function invoke(channel) {
  return (payload) => ipcRenderer.invoke(channel, payload);
}

function subscribe(channel, listener) {
  if (typeof listener !== "function") throw new TypeError("Listener must be a function");
  const wrapped = (_event, payload) => listener(payload);
  ipcRenderer.on(channel, wrapped);
  return () => ipcRenderer.removeListener(channel, wrapped);
}

// The course app's bridge to Blender (docs/course/PLAN.md), answered by src/lib/course-ipc.cjs.
// A failure arrives as an Error whose message is the sentence the course app shows, without
// Electron's "Error invoking remote method" prefix.
function courseCall(channel, toPayload = () => undefined) {
  return async (...args) => {
    try {
      return await ipcRenderer.invoke(channel, toPayload(...args));
    } catch (error) {
      throw new Error(String(error?.message || error).replace(/^Error invoking remote method '[^']+': (?:Error: )?/, ""));
    }
  };
}

// Everything the window's two pages may ask of the main process, as one object. The Workshop (workshop.html,
// src/renderer/main.js) uses the top-level calls; the course app (index.html) uses `course`, and `setTheme` so the
// window's caption follows its theme too.
contextBridge.exposeInMainWorld("dimensio", Object.freeze({
  bootstrap: invoke("dimensio:bootstrap"),
  pickAttachments: invoke("dimensio:pick-attachments"),
  startRun: invoke("dimensio:start-run"),
  continueRun: invoke("dimensio:continue-run"),
  steer: invoke("dimensio:steer"),
  cancel: invoke("dimensio:cancel"),
  answerApproval: invoke("dimensio:approval"),
  duplicate: invoke("dimensio:duplicate"),
  archive: invoke("dimensio:archive"),
  trash: invoke("dimensio:trash"),
  artifactAction: invoke("dimensio:artifact-action"),
  exportArtifact: invoke("dimensio:export-artifact"),
  repairPlugin: invoke("dimensio:repair-plugin"),
  refreshTools: invoke("dimensio:refresh-tools"),
  setTheme: invoke("dimensio:set-theme"),
  capabilities: invoke("dimensio:capabilities"),
  getAgentSettings: invoke("dimensio:agent-settings"),
  setAgent: invoke("dimensio:set-agent"),
  agentStatus: invoke("dimensio:agent-status"),
  models: invoke("dimensio:models"),
  project: Object.freeze({
    create: invoke("dimensio:project-new"),
    open: invoke("dimensio:project-open"),
    openRecovered: invoke("dimensio:project-open-recovered"),
    save: invoke("dimensio:project-save"),
    saveAs: invoke("dimensio:project-save-as"),
    close: invoke("dimensio:project-close"),
    changeName: invoke("dimensio:project-rename"),
    trash: invoke("dimensio:project-delete"),
    reveal: invoke("dimensio:project-reveal"),
    setSettings: invoke("dimensio:project-settings"),
    setView: invoke("dimensio:project-view"),
    removeRecent: invoke("dimensio:recent-remove"),
    clearRecent: invoke("dimensio:recent-clear"),
    setPreferences: invoke("dimensio:project-preferences"),
  }),
  onState: (listener) => subscribe("dimensio:state", listener),
  onEvent: (listener) => subscribe("dimensio:event", listener),
  onApproval: (listener) => subscribe("dimensio:approval", listener),
  onError: (listener) => subscribe("dimensio:error", listener),
  course: Object.freeze({
    blenderStatus: courseCall("dimensio:course-blender-status"),
    chooseBlender: courseCall("dimensio:course-choose-blender"),
    pickBlend: courseCall("dimensio:course-pick-blend"),
    measure: courseCall("dimensio:course-measure", (path, options) => ({ path, options })),
    makeStarter: courseCall("dimensio:course-make-starter", (id, extra = {}) => ({ id, name: extra.name, overwrite: extra.overwrite, options: extra.options })),
    openInBlender: courseCall("dimensio:course-open-in-blender", (path) => ({ path })),
    reveal: courseCall("dimensio:course-reveal", (path) => ({ path })),
    courseFolder: courseCall("dimensio:course-folder"),
  }),
}));
