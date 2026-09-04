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

export function summarizeRunSteps(run) {
  const groups = new Map();
  for (const step of run?.steps || []) {
    const phase = phaseFor(step);
    if (!groups.has(phase)) groups.set(phase, []);
    groups.get(phase).push(step);
  }
  return PHASES
    .filter(([key]) => groups.has(key))
    .map(([key, label]) => {
      const steps = groups.get(key);
      const failed = steps.filter((step) => ["failed", "error"].includes(step.status)).length;
      const retries = failed && run?.status === "completed" ? ` · recovered from ${failed} internal ${failed === 1 ? "retry" : "retries"}` : "";
      return {
        key,
        label,
        status: aggregateStatus(steps, run?.status),
        detail: `${steps.length} local operation${steps.length === 1 ? "" : "s"}${retries}`,
      };
    });
}
