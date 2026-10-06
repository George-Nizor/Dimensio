const PHASES = [
  ["reference", "Prepare reference"],
  ["generate", "Generate asset"],
  ["package", "Package deliverables"],
  ["validate", "Check quality"],
  ["local", "Local processing"],
];

function phaseFor(step) {
  if (step?.phase) return step.phase;
  const text = `${step?.name || ""} ${step?.detail || ""}`.toLowerCase();
  if (String(step?.name || "").toLowerCase() === "filechange") return "package";
  if (/image.?generation|reference|source image/.test(text)) return "reference";
  if (/triposplat|gaussian|splat|models run|generat/.test(text)) return "generate";
  if (/export|package|proxy|collision|save|file change/.test(text)) return "package";
  if (/validat|check|report|doctor|inspect/.test(text)) return "validate";
  return "local";
}

function aggregateStatus(steps, runStatus) {
  if (steps.some((step) => ["running", "inProgress"].includes(step.status))) return "running";
  if (steps.some((step) => ["failed", "error"].includes(step.status))) return runStatus === "completed" ? "completed" : "failed";
  if (steps.every((step) => ["completed", "success"].includes(step.status))) return "completed";
  return steps.at(-1)?.status || "pending";
}

function time(value) {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

// Phases come out in the order they began (by their first step's start time; steps without timestamps keep the order
// they arrived in). Each carries real timing where the run recorded it, and nothing is invented where it did not:
// elapsedMs is null when no start time is known. `now` is injected so this stays pure.
export function summarizeRunSteps(run, now = Date.now()) {
  const groups = new Map();
  (run?.steps || []).forEach((step, index) => {
    const phase = phaseFor(step);
    if (!groups.has(phase)) groups.set(phase, []);
    groups.get(phase).push({ step, index });
  });
  const labels = new Map(PHASES);
  return [...groups.entries()]
    .map(([key, entries]) => {
      const steps = entries.map((entry) => entry.step);
      const starts = steps.map((step) => time(step.started_at)).filter((value) => value !== null);
      const startedAt = starts.length ? Math.min(...starts) : null;
      return { key, entries, steps, startedAt, firstIndex: entries[0].index };
    })
    .sort((a, b) => (a.startedAt !== null && b.startedAt !== null && a.startedAt !== b.startedAt ? a.startedAt - b.startedAt : a.firstIndex - b.firstIndex))
    .map(({ key, steps, startedAt }) => {
      const status = aggregateStatus(steps, run?.status);
      const failed = steps.filter((step) => ["failed", "error"].includes(step.status)).length;
      const retries = failed && run?.status === "completed" ? ` · recovered from ${failed} internal ${failed === 1 ? "retry" : "retries"}` : "";
      const ends = steps.map((step) => time(step.completed_at)).filter((value) => value !== null);
      const running = status === "running";
      const endedAt = !running && ends.length ? Math.max(...ends) : null;
      const elapsedMs = startedAt === null ? null : running ? Math.max(0, now - startedAt) : endedAt !== null ? Math.max(0, endedAt - startedAt) : null;
      return {
        key,
        label: labels.get(key) || key,
        status,
        detail: `${steps.length} local operation${steps.length === 1 ? "" : "s"}${retries}`,
        startedAt,
        elapsedMs,
        live: running && startedAt !== null,
      };
    });
}
