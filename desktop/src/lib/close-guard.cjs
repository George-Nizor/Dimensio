"use strict";

// What closing the window asks. A run in progress is asked about first, whatever the project's state: the run is
// stopped, or the window stays open. Unsaved changes are asked about after that. Pure, so it is tested directly.

// "close": nothing to ask, the window closes. "ask": the close is held while the questions are asked.
function closeAction({ running = false, project = null, dirty = false } = {}) {
  if (running) return "ask";
  if (project && dirty) return "ask";
  return "close";
}

function shortName(text, limit = 60) {
  const value = String(text || "").replace(/\s+/g, " ").trim();
  return value.length > limit ? `${value.slice(0, limit - 1).trimEnd()}…` : value;
}

// The message box for a run in progress. Stopping keeps what the run wrote, and the run can be resumed.
function stopRunQuestion({ agentName = "The agent", runName = "", doing = "closing Dimensio" } = {}) {
  const name = shortName(runName);
  return {
    type: "warning",
    title: "A run is in progress",
    message: `Stop the run before ${doing}?`,
    detail: `${agentName} is still working${name ? ` on "${name}"` : ""}. Stopping it keeps the files it has written so far, and you can resume the run later.`,
    buttons: ["Stop the run", "Cancel"],
    defaultId: 1,
    cancelId: 1,
    noLink: true,
  };
}

module.exports = { closeAction, shortName, stopRunQuestion };
