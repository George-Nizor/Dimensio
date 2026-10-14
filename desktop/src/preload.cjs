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

contextBridge.exposeInMainWorld("forge3d", Object.freeze({
  bootstrap: invoke("forge3d:bootstrap"),
  pickAttachments: invoke("forge3d:pick-attachments"),
  startRun: invoke("forge3d:start-run"),
  continueRun: invoke("forge3d:continue-run"),
  steer: invoke("forge3d:steer"),
  cancel: invoke("forge3d:cancel"),
  answerApproval: invoke("forge3d:approval"),
  duplicate: invoke("forge3d:duplicate"),
  archive: invoke("forge3d:archive"),
  trash: invoke("forge3d:trash"),
  artifactAction: invoke("forge3d:artifact-action"),
  exportArtifact: invoke("forge3d:export-artifact"),
  repairPlugin: invoke("forge3d:repair-plugin"),
  refreshTools: invoke("forge3d:refresh-tools"),
  setTheme: invoke("forge3d:set-theme"),
  capabilities: invoke("forge3d:capabilities"),
  getAgentSettings: invoke("forge3d:agent-settings"),
  setAgent: invoke("forge3d:set-agent"),
  agentStatus: invoke("forge3d:agent-status"),
  models: invoke("forge3d:models"),
  project: Object.freeze({
    create: invoke("forge3d:project-new"),
    open: invoke("forge3d:project-open"),
    openRecovered: invoke("forge3d:project-open-recovered"),
    save: invoke("forge3d:project-save"),
    saveAs: invoke("forge3d:project-save-as"),
    close: invoke("forge3d:project-close"),
    changeName: invoke("forge3d:project-rename"),
    trash: invoke("forge3d:project-delete"),
    reveal: invoke("forge3d:project-reveal"),
    setSettings: invoke("forge3d:project-settings"),
    setView: invoke("forge3d:project-view"),
    removeRecent: invoke("forge3d:recent-remove"),
    clearRecent: invoke("forge3d:recent-clear"),
    setPreferences: invoke("forge3d:project-preferences"),
  }),
  onState: (listener) => subscribe("forge3d:state", listener),
  onEvent: (listener) => subscribe("forge3d:event", listener),
  onApproval: (listener) => subscribe("forge3d:approval", listener),
  onError: (listener) => subscribe("forge3d:error", listener),
}));