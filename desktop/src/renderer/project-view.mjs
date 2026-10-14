// The project workflow's presentation rules: the File menu, its shortcuts, and the title. Pure, so every case can
// be tested without a DOM or Electron. The main process owns the project itself (project-store.cjs).

export const SHORTCUTS = Object.freeze({
  new: "Ctrl+N",
  open: "Ctrl+O",
  save: "Ctrl+S",
  "save-as": "Ctrl+Shift+S",
});

const RECENT_IN_MENU = 6;

function switching(busy) {
  return busy ? "Wait for the active run to finish first" : "";
}

function sameProject(entry, project) {
  if (!entry || !project?.file) return false;
  return String(entry.path).toLowerCase() === String(project.file).toLowerCase();
}

/** Recent projects other than the one already open, newest first. */
export function recentEntries(recent = [], project = null, limit = RECENT_IN_MENU) {
  return (Array.isArray(recent) ? recent : []).filter((entry) => !sameProject(entry, project)).slice(0, limit);
}

/** The File menu as data: action items, "-" separators and { heading } labels. `busy` is a run in flight. */
export function fileMenuModel({ project = null, recent = [], busy = false } = {}) {
  const open = Boolean(project);
  const saved = open && !project.untitled;
  const savedOnly = !open ? "" : busy ? switching(busy) : !saved ? "Save the project first" : "";
  const switchingTitle = switching(busy);
  const recents = recentEntries(recent, project);
  return [
    { id: "new", icon: "add", label: "New project", hint: SHORTCUTS.new, disabled: busy, title: switchingTitle },
    { id: "open", icon: "folder", label: "Open project…", hint: SHORTCUTS.open, disabled: busy, title: switchingTitle },
    ...(recents.length ? [
      { heading: "Open recent" },
      ...recents.map((entry) => ({
        id: `recent:${entry.path}`,
        icon: "runs",
        label: entry.name,
        path: entry.path,
        disabled: busy || entry.missing,
        title: entry.missing ? `Not found: ${entry.path}` : entry.path,
      })),
      { id: "clear-recent", icon: "close", label: "Clear recent list" },
    ] : []),
    "-",
    { id: "save", icon: "export", label: "Save", hint: SHORTCUTS.save, disabled: !open },
    { id: "save-as", icon: "copy", label: "Save as…", hint: SHORTCUTS["save-as"], disabled: !open || busy, title: open && busy ? switchingTitle : "" },
    { id: "rename", icon: "page", label: "Rename project…", disabled: !saved || busy, title: savedOnly },
    "-",
    { id: "reveal", icon: "folder", label: "Show project folder", disabled: !open },
    { id: "close", icon: "close", label: "Close project", disabled: !open || busy, title: open && busy ? switchingTitle : "" },
    { id: "delete", icon: "trash", label: "Delete project…", disabled: !saved || busy, title: savedOnly },
  ];
}

/** Maps a keydown to a project command, or null. Ctrl (or Cmd) with N, O, S; Shift+S is Save as. */
export function shortcutCommand(event = {}) {
  if (!(event.ctrlKey || event.metaKey) || event.altKey) return null;
  const key = String(event.key || "").toLowerCase();
  if (key === "s") return event.shiftKey ? "save-as" : "save";
  if (event.shiftKey) return null;
  if (key === "n") return "new";
  if (key === "o") return "open";
  return null;
}

/** The window title: "● Name — Dimensio" while unsaved, the bare app name on the start screen. */
export function projectTitle(project) {
  if (!project) return "Dimensio";
  return `${project.dirty ? "● " : ""}${project.name} — Dimensio`;
}

/** A short location for a recent entry: the folder, with the user profile shortened to ~. */
export function displayFolder(folder = "") {
  return String(folder).replace(/^[A-Za-z]:\\Users\\[^\\]+/, "~").replace(/^\/(home|Users)\/[^/]+/, "~");
}
