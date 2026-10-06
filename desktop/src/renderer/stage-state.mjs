// What the viewport shows when there is no file to show. Pure, so every case can be tested without a DOM. The
// renderer draws the result; it never decides this itself.

const STOPPED = new Set(["interrupted", "cancelled"]);
const STARTING = new Set(["prepared", "launching"]);

function startMs(run) {
  const parsed = Date.parse(run?.created_at);
  return Number.isNaN(parsed) ? null : parsed;
}

function failureHint(message) {
  return /out of memory|cuda|vram/i.test(String(message || ""))
    ? "This looks like the GPU ran out of memory. Close other GPU apps or choose the Draft quality in Run settings, then try again."
    : "";
}

// Returns { kind } plus the fields that kind needs:
//   setup    the readiness card (forced from the status bar, first run, or a blocked / unchecked setup)
//   artifact the selected run has a file to preview (the renderer shows it)
//   failed   the run failed: message, hint
//   stopped  the run was interrupted or cancelled
//   running  the run is working and has produced nothing to preview yet: activity, done, startedAt
//   finished the run completed but nothing in it can be previewed
//   empty    nothing selected, nothing wrong
export function stageState({ run = null, hasArtifact = false, live = false, readiness = { phase: "ready" }, forceSetup = false, hasRuns = false } = {}) {
  if (forceSetup) return { kind: "setup", forced: true };
  if (!run) {
    return readiness.phase === "blocked" || readiness.phase === "error" || !hasRuns ? { kind: "setup", forced: false } : { kind: "empty" };
  }
  if (hasArtifact) return { kind: "artifact" };
  const status = String(run.status || "");
  if (status === "failed") {
    const message = run.failure || "The run failed and recorded no reason.";
    return { kind: "failed", message, hint: failureHint(message) };
  }
  if (STOPPED.has(status)) return { kind: "stopped", status };
  if (live || status === "running" || STARTING.has(status)) {
    const steps = run.steps || [];
    const current = [...steps].reverse().find((step) => step.status === "running" || step.status === "inProgress");
    const done = steps.filter((step) => step.status === "completed").length;
    return {
      kind: "running",
      starting: STARTING.has(status) && !steps.length,
      activity: current ? (current.detail || current.name || "") : "",
      done,
      startedAt: startMs(run),
    };
  }
  if (status === "completed") return { kind: "finished" };
  return { kind: "empty" };
}
