# Dimensio desktop architecture

Dimensio 0.4.0 is a local Electron app with two pages in one window, both served from
`dimensio-app://app` (`src/lib/app-protocol.cjs`): the course app (`index.html`, `src/course/`) and
the Workshop (`workshop.html`, `src/renderer/`). This page is mostly about the Workshop. It runs one
agent job at a time, with Claude Code or Codex, and stores each complete job inside the open project,
under `<project folder>\runs`. The course app's bridge to Blender is described in
`docs/course/PLAN.md`, "The bridge between the app and Blender".

## Projects

`src/lib/project-store.cjs` holds the rules and `src/main.cjs` owns the session. A project is a
folder holding `<Name>.dimensio` (format `dimensio-project`, schema 1: project id, timestamps, app
version, `runs_directory: "runs"`, the run settings, and the selected run and artifact) and a
`runs/` directory that `RunStore` reads exactly as before. The project's name is the file's name.
A Forge3D project, `<Name>.forge3d` with format `forge3d-project`, opens the same way and keeps its
extension and format when it is saved or renamed; Save as makes a `.dimensio` project.

- **Launch.** The start screen is the default. A `.dimensio` (or `.forge3d`) path in `argv`, or the
  most recent project when "Reopen the last project" is on, opens straight away instead. Nothing is
  selected automatically until a project is open.
- **New.** Creates an untitled project in a scratch folder under
  `%LOCALAPPDATA%\Instrumenta\Dimensio\untitled`. It counts as unsaved once it holds a run.
- **Save / Save as.** The native Save dialog's choice `X\Name.dimensio` becomes `X\Name\Name.dimensio`,
  unless it already is an empty folder of that name. A non-empty folder is refused. An untitled
  project's `runs/` is moved (copied, then removed, across drives). The agent is stopped first: on
  Windows a folder a process is working in cannot be moved. A scratch folder that still cannot be
  removed is marked as saved (`.dimensio-saved.json`), cleared at a later start, and never offered as
  unsaved work. A saved project's Save as copies it and gets a new project id.
- **Unsaved changes.** An untitled project with runs, or changed run settings in a saved one. The
  selection is written to a saved project's file as it changes, and never makes it unsaved. New, Open, Close and closing the
  window ask Save / Don't save / Cancel through a native message box. Don't save on an untitled
  project moves its folder to the Recycle Bin. Closing the window during a run first asks whether to
  stop the run, even when nothing is unsaved; stopping keeps its files and the run can be resumed.
- **Rename and delete** (File menu, saved projects only). Rename renames the project file, and the
  folder too when it carries the project's name. Delete asks first, then moves the project to the
  Recycle Bin: the whole folder when it holds nothing but the project, otherwise only the file and
  `runs/`, so other files beside an adopted library stay put. Both stop the agent first.
- **Busy.** New, Open, Save as, Rename, Delete and Close are refused while a job is running, because
  the agent's writable root is inside the project.
- **One instance.** `app.requestSingleInstanceLock()`: a second launch brings the window forward and
  opens a project path from its command line.
- **Agent.** Claude Code runs in the run's own folder, one process per run. Codex's App Server is
  started in the open project's runs folder (the state root on the start screen). Switching projects
  retires the old server, and the next request starts a new one.
- **Recent projects** are kept per user in `%LOCALAPPDATA%\Instrumenta\Dimensio\config\recent-projects.json`
  (ten, newest first, missing ones flagged), along with the reopen preference.
- **Crash recovery.** Empty scratch folders are pruned at start. Ones holding runs are offered on
  the start screen under "Unsaved work".
- **Earlier runs.** On first start, Forge3D's `Documents\Forge3D\runs` library from before projects
  gains `Documents\Forge3D\Earlier runs.dimensio` and joins the recent list. An
  `Earlier runs.forge3d` Forge3D already wrote there is used instead. Nothing is moved.

The renderer draws the start screen and the File menu (`src/renderer/project-view.mjs` holds the
menu model, shortcuts and title rules). The window title, `● Name — Dimensio` while unsaved, is set
by the main process. The page's own `<title>` never replaces it.

The course app's Settings links to `workshop.html#setup`. The Workshop opens its setup card when it
loads with that hash, and the start screen stands aside while the card is open.

## Process boundary

The renderer uses `sandbox: true`, `contextIsolation: true`, and `nodeIntegration: false`. Its Content
Security Policy is restrictive. Window creation, navigation, and Electron permissions are denied by
default.

The preload exposes one object, `window.dimensio`: the Workshop's named operations, and the course
bridge as `window.dimensio.course`. It has no raw IPC. Its channels are `dimensio:*`. Before an
operation reaches the filesystem, the main process checks the renderer origin, run ID, relative
artifact path, resolved path, file type, and symlink state.

Artifacts are served through `dimensio-artifact:`. Reveal, default open, Blender open, Godot review,
copy path, duplicate, archive, and Recycle Bin actions each have their own handler. The renderer never
receives a general filesystem API.

## Workstation layout

The shipped UI uses the viewport-first workstation recorded in
[the brand guide](brand-identity.md):

- One application bar contains the approved mark, the File menu and project name, the prompt omnibox,
  the attachment action, settings, and the primary Run control. With no project open, only the
  mark, File and the theme remain, above the start screen.
- The viewport fills the workspace below it and shows a studio field when no artifact is selected.
- A compact icon rail on the left controls the view.
- Run history and the inspector float on the right. Either panel can collapse into an edge tab.
- The production dock maps real run state onto Plan, Build, Check, and Output.
- The filmstrip opens outputs without replacing the run context.
- A hairline status bar reports the local toolchain.

The app uses the Instrumenta brand v2 cube. Fraunces handles the name and panel titles, Commissioner
the interface, and Spline Sans Mono code, versions, sizes and IDs (see `docs/brand/README.md`).

## Agents

`src/lib/agents/` holds one driver per agent behind one interface (`index.cjs`): `status`, `models`,
`startSession`, `send`, `steer`, `interrupt` and `close`, and the `step`, `message`, `tool`, `usage`,
`done` and `error` events that `main.cjs` turns into run steps and transcript entries. The chosen
agent is kept in `%LOCALAPPDATA%\Instrumenta\Dimensio\config\settings.json` (`agent`). Claude Code is
the default, and the setup card offers the other. Readiness asks for "an agent": ready when the
chosen one is installed and signed in (the capability report's `agent` item). Run checks the agent
before it makes a run folder.

`run.json` records `agent: { id, session_id, turn_ids }` (and Claude Code's `usage`). A run continues
in its own session when that belongs to the chosen agent; otherwise a new session gets the run's
whole brief. Runs from before 0.4 hold `codex.thread_id`, which is still read.

### Claude Code

`claude.cjs` runs `claude -p` with stream-json in and out, one process per run, in the run folder:
`--restricted` (no personal settings, hooks or permission rules; file tools confined to the folders
given), `--strict-mcp-config --mcp-config` with the Blender and Godot MCP servers, `--plugin-dir` for
the bundled plugin, `--permission-mode dontAsk --permission-prompts none`, and an allowlist: the
`dimensio` CLI in Bash or PowerShell, `mcp__blender` and `mcp__godot`, Read, Glob and Grep, Edit (and
so Write) inside the run folder, and the `dimensio:dimensio` skill. Anything else is refused, and the
refusal is logged. Models are Opus, Sonnet and Haiku by alias; the default is Opus at medium effort.

On Windows it is found at `DIMENSIO_CLAUDE_EXE`, `%USERPROFILE%\.local\bin\claude.exe` (the native
installer), `claude.exe` or `claude.cmd` on PATH, then npm's `claude.cmd`. Sign-in is
`claude auth status`. Without Git for Windows Claude Code runs commands in PowerShell, which the
allowlist covers.

Steering writes another user message. A note written during a tool call joins the running turn at
the next tool boundary; one that arrives after the turn ended starts a new turn. The transcript
records which. Interrupt kills the process tree (`taskkill /T /F` on Windows). Claude Code cannot make
images, so a splat with no attached image needs Codex.

### Codex

`codex.cjs` starts the user's installed Codex CLI as `codex app-server` over stdio JSONL. The client
initializes the server, lists skills, finds `dimensio`, and starts or resumes a persistent thread. A
turn is sent as `$dimensio <prompt>` and receives the Dimensio skill, copied attachments, selected workflow settings, the run directory,
and a contained workspace-write sandbox. Steering uses `turn/steer`. Cancellation uses
`turn/interrupt`.

When the app restarts, transient jobs become interrupted while their session identifiers remain
available for continuation.

## Approval policy

Attachments are copied into `attachments/` before the job starts. The agent's writable root is the
run directory. Claude Code never asks (see its allowlist above). For Codex, Dimensio accepts these
requests automatically for the current session:

- local commands whose working directory and requested write paths stay inside the run;
- file changes contained by the run; and
- local Blender or Godot MCP calls without remote intent.

Network access is disabled unconditionally: the desktop is local-only, cloud tool selections are
scrubbed from persisted preferences, and the agent prompt forbids cloud providers. A network
request, remote provider action, or write outside the run stays interactive. This removes the
pointless approval drumbeat from local asset work while keeping surprising operations visible.

## Plugin repair

Codex only: Claude Code loads the bundled plugin with `--plugin-dir` on every run. For Codex,
`skills/list` is authoritative. Dimensio compares the discovered plugin with the bundled copy, whose
version is read from the desktop `package.json`.
The Repair action backs up the personal plugin, installs the bundled files, writes machine-specific
Blender/Godot MCP configuration, updates the personal marketplace entry, and registers the plugin
as `dimensio@personal` in `~/plugins/dimensio`. A failure restores the backup. A Forge3D-era
`~/plugins/forge3d` is left alone.

## External tools and local state

The bundle (`Dimensio.exe`) contains the Electron app, `resources\bin\dimensio.exe`, the reviewed
Blender tasks and scripts under `resources\dimensio-toolkit`, the Dimensio plugin (for Claude Code
and Codex) under `resources\dimensio-plugin`, and a Godot review template. Blender, Godot, WSL,
CUDA, the agent and its sign-in, and model payloads are detected separately. Agents get
`DIMENSIO_OUTPUT`, `DIMENSIO_TOOLKIT_ROOT`, `DIMENSIO_PLUGIN_ROOT`, `DIMENSIO_STATE_ROOT` and
`DIMENSIO_WSL_MODELS_DIR`.

Generated review material and caches live under `%LOCALAPPDATA%\Instrumenta\Dimensio`. The Godot
template is synchronized there by Dimensio version. Electron's own user data, named after the app,
is `%APPDATA%\Dimensio`: the course app's `course.json` (Blender path, course folder) and the
pages' storage.

## Coming from Forge3D

Dimensio was Forge3D, and `src/lib/forge3d-compat.cjs` holds what it keeps from it:

- On the first start it copies Forge3D's `config\settings.json` (the agent) and
  `config\recent-projects.json` from `%LOCALAPPDATA%\Instrumenta\Forge3D`, and `course.json` from
  `%APPDATA%\Forge3D`, each only when Dimensio has none of its own.
- Forge3D's run library is adopted as Earlier runs (above), and `.forge3d` projects open.
- Every variable the app reads as `DIMENSIO_<NAME>` falls back to `FORGE3D_<NAME>`.
- Models Forge3D installed in WSL under `~/.local/share/forge3d/models` are used there when
  `~/.local/share/dimensio/models` does not exist.

Nothing of Forge3D's is moved, renamed or deleted. The pages' storage under `%APPDATA%\Forge3D`
(course progress from a development build) is not carried over; no released Forge3D had the course.

## Preview routing

- PNG, JPEG, WebP, and GIF use native image playback.
- Ordered raster directories play as 12 fps image sequences.
- GLB and glTF use bundled Three.js, OrbitControls, animation mixers, and bounding-sphere framing.
- SPLAT, SOG, and header-verified Gaussian PLY use bundled SparkJS plus the tested TripoSplat
  coordinate conversion; polygon PLY routes to Three.js as an ordinary model.
- Validation JSON and text/log artifacts render through contained readers.
- Unsupported files show metadata and keep their named open actions.

## Export

The inspector's "Export to another format" action converts a finished artifact through headless
Blender (`blender/export_asset.py`). Polygon artifacts offer eight interchange formats; a Gaussian
splat offers only `blend`, because pretending a splat is a polygon mesh helps nobody. Each export
writes a fresh versioned folder under the run's `exports/` and succeeds only when Blender's own
`export-report.json` reports completion.

## Recovery and file actions

`run.json` is written atomically. On opening a project, launching, running, and cancelling states
recover as interrupted, and a run still `prepared` (it never started) becomes failed with that reason.
Run checks the agent before it makes a run folder, and stays off until the setup check has answered. Duplicate copies the prompt and declared attachments into a new run. Archive moves a run
into the hidden archive below the run root. Trash uses the Windows Recycle Bin.

Every action remains run-scoped. Arbitrary filesystem moves are outside the desktop contract.
