// Pure readiness logic: turns a capabilities report (docs/capabilities.md, schema 1) plus the run settings into what
// the renderer shows (a verdict, rows grouped required / optional, the status-bar versions) and whether Run is allowed.
// The renderer only draws what comes out of here.

export const ROUTE_LABELS = { splat: "Gaussian splat", blender: "Blender", export: "Export", godot: "Godot" };

const PROBLEM_STATES = new Set(["missing", "signed_out", "degraded"]);
const STATE_WORDS = { ready: "Ready", missing: "Missing", signed_out: "Signed out", degraded: "Needs attention", optional_missing: "Not set up" };
const STATE_ORDER = { missing: 0, signed_out: 1, degraded: 2, optional_missing: 3, ready: 4 };

export function stateWord(state) {
  return STATE_WORDS[state] || "Unknown";
}

// Which route the run settings commit to. Only an explicit choice commits: the default Target is a file format
// and says nothing about the route, and Auto lets Codex choose, so those return null.
export function routeForSettings(settings = {}) {
  const { workflow = "auto", tool = "auto" } = settings;
  if (workflow === "gaussian-splat" || tool === "triposplat") return "splat";
  if (workflow === "authored-blender" || tool === "blender") return "blender";
  return null;
}

// "Run `uv sync` first" -> [{ text: "Run " }, { code: "uv sync" }, { text: " first" }]. Backticked spans are commands.
export function splitFix(text) {
  const parts = [];
  String(text || "").split(/`([^`]+)`/).forEach((piece, index) => {
    if (!piece) return;
    parts.push(index % 2 ? { code: piece } : { text: piece });
  });
  return parts;
}

export function toolVersionsFromReport(report) {
  const versions = report?.versions || {};
  const pick = (value) => (typeof value === "string" && value.trim() ? value.trim() : undefined);
  const result = {
    codex: pick(versions.codex),
    blender: pick(versions.blender),
    godot: pick(versions.godot),
    wsl: pick(versions.wsl_distro),
  };
  return Object.fromEntries(Object.entries(result).filter(([, value]) => value !== undefined));
}

function row(item, route) {
  return {
    id: item.id,
    label: item.label || item.id,
    state: item.state,
    stateWord: stateWord(item.state),
    version: typeof item.version === "string" ? item.version : "",
    reason: item.state === "ready" ? "" : String(item.reason || ""),
    fix: item.state === "ready" ? "" : String(item.fix || ""),
    optional: Boolean(item.optional),
    blocksRoute: Boolean(route && route.blocked_by?.includes(item.id)),
  };
}

function culpritLabels(report, ids) {
  return (ids || []).map((id) => report.capabilities[id]?.label || id);
}

function verdictForRoute(report, routeId) {
  const route = report.routes?.[routeId];
  if (!route) return null;
  if (route.state === "blocked") {
    const first = route.blocked_by?.[0];
    const item = first ? report.capabilities[first] : null;
    return { phase: "blocked", route: routeId, reason: route.reason || item?.reason || `${ROUTE_LABELS[routeId] || routeId} is not ready.`, fix: item?.fix || "", culprits: culpritLabels(report, route.blocked_by), culpritIds: route.blocked_by || [] };
  }
  if (route.state === "degraded") {
    const first = route.degraded_by?.[0];
    const item = first ? report.capabilities[first] : null;
    return { phase: "degraded", route: routeId, reason: route.reason || item?.reason || `${ROUTE_LABELS[routeId] || routeId} has a caveat.`, fix: item?.fix || "", culprits: culpritLabels(report, route.degraded_by), culpritIds: route.degraded_by || [] };
  }
  return { phase: "ready", route: routeId, reason: "", fix: "", culprits: [], culpritIds: [] };
}

// capabilities: null while the first check runs, { ok: true, ...report } or { ok: false, error, fix }.
export function deriveReadiness({ capabilities = null, settings = {}, appServerError = "" } = {}) {
  const route = routeForSettings(settings);
  const base = { route, routeLabel: route ? ROUTE_LABELS[route] : "", required: [], optional: [], versions: {}, unavailableRoutes: [], culprits: [], culpritIds: [], reason: "", fix: "", error: "", checked: false };

  if (!capabilities) return { ...base, phase: "checking", reason: "Checking this machine for Codex, Blender and the splat stack." };
  if (!capabilities.ok) {
    return { ...base, phase: "error", error: capabilities.error || "The capability check did not run.", fix: capabilities.fix || "", reason: "Forge3D could not check this machine, so it cannot say whether a run will work." };
  }

  const report = capabilities;
  const rows = Object.values(report.capabilities || {}).map((item) => row(item, route ? report.routes?.[route] : null));
  const sortRows = (list) => list.sort((a, b) => (STATE_ORDER[a.state] ?? 9) - (STATE_ORDER[b.state] ?? 9));
  const result = {
    ...base,
    checked: true,
    required: sortRows(rows.filter((item) => !item.optional)),
    optional: sortRows(rows.filter((item) => item.optional)),
    versions: toolVersionsFromReport(report),
    platform: report.platform?.system || "",
    generatedAt: report.generated_at || "",
  };

  let verdict;
  if (route) {
    verdict = verdictForRoute(report, route);
  } else {
    // Auto (or a tool with no route of its own): Codex drives every route, and at least one generating route must work.
    const codex = report.capabilities?.codex;
    const generating = ["splat", "blender"].filter((id) => report.routes?.[id]);
    const blocked = generating.filter((id) => report.routes[id].state === "blocked");
    result.unavailableRoutes = blocked.map((id) => ROUTE_LABELS[id]);
    if (codex && (codex.state === "missing" || codex.state === "signed_out")) {
      verdict = { phase: "blocked", reason: codex.reason || "Codex is not ready.", fix: codex.fix || "", culprits: [codex.label || "Codex"], culpritIds: ["codex"] };
    } else if (generating.length && blocked.length === generating.length) {
      const first = report.routes[blocked[0]];
      const item = report.capabilities[first.blocked_by?.[0]];
      verdict = { phase: "blocked", reason: "No generating route is ready on this machine.", fix: item?.fix || "", culprits: culpritLabels(report, generating.flatMap((id) => report.routes[id].blocked_by || [])), culpritIds: generating.flatMap((id) => report.routes[id].blocked_by || []) };
    } else if (codex?.state === "degraded") {
      verdict = { phase: "degraded", reason: codex.reason || "Codex needs attention.", fix: codex.fix || "", culprits: [codex.label || "Codex"], culpritIds: ["codex"] };
    } else {
      verdict = { phase: "ready", reason: "", fix: "", culprits: [], culpritIds: [] };
    }
  }

  const merged = { ...result, ...verdict };
  // A Codex session that ended is not a verdict on the machine, and Run starts a new one, so it warns and never blocks.
  if (appServerError && merged.phase !== "blocked") {
    return { ...merged, phase: "degraded", offline: true, reason: `The last Codex session ended: ${appServerError}`, fix: "Run starts a new session. If it fails again, use Check again after fixing Codex." };
  }
  return merged;
}

// What the Run button may do. blocked disables it (steering a live job is never gated); degraded and error only warn.
export function runGate(readiness) {
  switch (readiness.phase) {
    case "blocked": return { allowed: false, level: "blocked", chip: readiness.culprits.length === 1 ? `Needs ${readiness.culprits[0]}` : "Setup needed", message: `Run is off: ${readiness.reason}${readiness.fix ? ` ${readiness.fix.replaceAll("`", "")}` : ""}` };
    case "degraded": return { allowed: true, level: "warn", chip: "Check setup", message: readiness.reason };
    case "error": return { allowed: true, level: "warn", chip: "Setup unchecked", message: `Setup could not be checked. ${readiness.error}` };
    case "checking": return { allowed: true, level: "info", chip: "Checking setup", message: readiness.reason };
    default: return { allowed: true, level: "ok", chip: "", message: "" };
  }
}

// The status bar: one entry per tool the person cares about, with a real version or none.
export function statusEntries(readiness, tools = {}) {
  const ids = [["Codex", "codex"], ["Blender", "blender"], ["Godot", "godot"], ["WSL", "wsl"]];
  return ids.map(([name, id]) => {
    const item = [...readiness.required, ...readiness.optional].find((candidate) => candidate.id === id);
    let state;
    if (item) state = item.state === "ready" ? "ready" : item.state === "optional_missing" ? "unset" : item.state === "degraded" ? "attention" : "offline";
    else if (tools[id] === undefined) state = "checking";
    else state = tools[id] ? "ready" : "offline";
    return { name, id, state };
  });
}

export function formatElapsed(ms) {
  if (!Number.isFinite(ms) || ms < 0) return "";
  const total = Math.floor(ms / 1000);
  const seconds = String(total % 60).padStart(2, "0");
  const minutes = Math.floor(total / 60) % 60;
  const hours = Math.floor(total / 3600);
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}` : `${String(minutes).padStart(2, "0")}:${seconds}`;
}

export function sentenceCase(value) {
  const text = String(value ?? "").replaceAll("-", " ").replaceAll("_", " ").trim();
  return text ? text[0].toUpperCase() + text.slice(1) : "";
}

// The headline and lead line of the setup card.
export function setupHeadline(readiness, { firstRun = false } = {}) {
  switch (readiness.phase) {
    case "checking":
      return { title: "Checking this machine", lead: readiness.reason };
    case "error":
      return { title: "Setup could not be checked", lead: readiness.reason };
    case "blocked": {
      const codex = readiness.culpritIds?.includes("codex") ? readiness.required.find((row) => row.id === "codex") : null;
      const title = codex ? (codex.state === "signed_out" ? "Codex isn't signed in" : "Codex isn't reachable")
        : readiness.routeLabel ? `${readiness.routeLabel} isn't ready` : "No route is ready yet";
      return { title, lead: `${readiness.reason} Run stays off until this is fixed.` };
    }
    case "degraded":
      return readiness.offline
        ? { title: "The Codex session ended", lead: readiness.reason }
        : { title: "Ready, with a caveat", lead: `${readiness.reason} Run is still available.` };
    default:
      return firstRun
        ? { title: "What shall we forge?", lead: "Everything Forge3D needs is ready. Describe an asset in the prompt bar." }
        : { title: "Everything is ready", lead: "Every dependency Forge3D checked is in place." };
  }
}
