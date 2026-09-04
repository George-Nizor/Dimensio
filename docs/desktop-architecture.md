# Forge3D desktop architecture

Forge3D 0.2.2 wraps the prompt-first toolkit in a local Electron client. It runs one Codex job at a
time and stores the complete job under `%USERPROFILE%\Documents\Forge3D\runs`.

## Process boundary

The renderer uses `sandbox: true`, `contextIsolation: true`, and `nodeIntegration: false`. Its Content
Security Policy is restrictive. Window creation, navigation, and Electron permissions are denied by
default.

The preload bridge exposes named operations only. Before an operation reaches the filesystem, the
main process checks the renderer origin, run ID, relative artifact path, resolved path, file type, and
symlink state.

Artifacts are served through `forge3d-artifact:`. Reveal, default open, Blender open, Godot review,
copy path, duplicate, archive, and Recycle Bin actions each have their own handler. The renderer never
receives a general filesystem API.

## Workstation layout

The shipped UI uses the viewport-first workstation recorded in
[the brand guide](brand-identity.md):

- One application bar contains the approved mark, prompt omnibox, attachment action, settings, and
  the primary Run control.
- The viewport fills the workspace below it and shows a studio field when no artifact is selected.
- A compact icon rail on the left controls the view.
- Run history and the inspector float on the right. Either panel can collapse into an edge tab.
- The production dock maps real run state onto Plan, Build, Check, and Output.
- The filmstrip opens outputs without replacing the run context.
- A hairline status bar reports the local toolchain.

The app uses the approved Topology Loop mark. Space Grotesk handles the name and display labels; Segoe
UI Variable handles controls.

## Codex App Server

Forge3D starts the user's installed Codex CLI as `codex app-server` over stdio JSONL.

The client initializes the server, lists skills, finds `forge3d`, and starts or resumes a persistent
thread. A turn receives the Forge3D skill, copied attachments, selected workflow settings, the run
directory, and a contained workspace-write sandbox. Streamed items become transcript and progress
events in `run.json`.

Steering uses `turn/steer`. Cancellation uses `turn/interrupt`. When the app restarts, transient jobs
become interrupted while their thread and turn identifiers remain available for continuation.

## Approval policy

Attachments are copied into `attachments/` before the job starts. The agent's writable root is the
run directory.

Forge3D accepts these requests automatically for the current session:

- local commands whose working directory and requested write paths stay inside the run;
- file changes contained by the run; and
- local Blender or Godot MCP calls without remote intent.

Network access is disabled unconditionally: the desktop is local-only, cloud tool selections are
scrubbed from persisted preferences, and the agent prompt forbids cloud providers. A network
request, remote provider action, or write outside the run stays interactive. This removes the
pointless approval drumbeat from local asset work while keeping surprising operations visible.

## Plugin repair

`skills/list` is authoritative. Forge3D compares the discovered plugin with the bundled copy, whose
version is read from the desktop `package.json`.
The Repair action backs up the personal plugin, installs the bundled files, writes machine-specific
Blender/Godot MCP configuration, updates the personal marketplace entry, and registers the plugin.
A failure restores the backup.

## External tools and local state

The bundle contains the Electron app, `forge3d.exe`, reviewed Blender tasks, the Codex plugin, and a
Godot review template. Blender, Godot, WSL, CUDA, Codex authentication, and model payloads are
detected separately.

Generated review material and caches live under `%LOCALAPPDATA%\Instrumenta\Forge3D`. The Godot
template is synchronized there by Forge3D version. Runtime configuration contains no path to the
former repository name.

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

`run.json` is written atomically. On startup, launching, running, and cancelling states recover as
interrupted. Duplicate copies the prompt and declared attachments into a new run. Archive moves a run
into the hidden archive below the run root. Trash uses the Windows Recycle Bin.

Every action remains run-scoped. Arbitrary filesystem moves are outside the desktop contract.
