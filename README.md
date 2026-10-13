![Forge3D banner](docs/images/forge3d-banner.png)

<p align="center"><img src="docs/brand/forge3d-animated.svg" alt="Forge3D cube" width="96" /></p>

# Forge3D

Prompt-driven 3D modelling on the Codex App Server.

Forge3D turns a prompt into a versioned local 3D run. The Windows desktop drives your own Codex App
Server, calls the Forge3D skill, keeps the transcript, and previews the result. Blender, Godot, WSL,
CUDA, and large models stay separate installations. Version 0.3.0, Windows x64.

## Start here

The usual route is the Forge3D card in Instrumenta, which installs the managed bundle, checks its
hash, keeps the previous version for rollback, and opens `Forge3D.exe`.

From a source checkout:

```powershell
.\scripts\setup.ps1 -InstallModels -InstallPersonalPlugin
forge3d doctor --json
cd desktop
npm install
npm start
```

`setup.ps1` also takes `-DryRun`. Restart Codex after installing or repairing the personal plugin so
it refreshes its skill list.

## Requirements

Blender 5.x, Godot 4.6, Python 3.11 or newer, Node.js 22 or newer (for the Godot MCP server), `uv`,
and the Codex CLI. Godot is optional. The TripoSplat route also needs WSL2 Ubuntu with CUDA access
and an NVIDIA GPU with about 8 GB of VRAM. `forge3d doctor` reports what is missing.

## Asset routes

| Route | Good fit | Main output |
| --- | --- | --- |
| Authored Blender | Editable props, buildings, rigs, animation, collision, LODs | `.blend` source and a validated `.glb` |
| TripoSplat | Static props where the reference image matters more than mesh editing | Gaussian `.splat` or `.ply` data with a collision proxy |

The Blender route makes conventional geometry. TripoSplat makes a Gaussian visual asset whose unseen
surfaces are inferred from one image. A splat is not a polygon mesh, and renaming the file will not
persuade Blender otherwise. Model weights are not committed or bundled.

Example prompts:

> Build an industrial generator in Blender. Keep the `.blend`, add collision and two LODs, export a
> GLB, then validate the import in Godot.

> Turn this isolated prop image into a TripoSplat asset. Add a simple collision proxy and verify the
> splat in the interactive preview.

A good source image has one complete subject, a little margin, diffuse light, and nothing in front of
it. Check `prepared-input.webp` before blaming the model for a crop it was given.

## The desktop

Forge3D opens on a start screen: **New project**, **Open project…**, your recent projects, and any
untitled work a crash left behind. The **File** menu beside the name has New (Ctrl+N), Open (Ctrl+O),
the recent list, Save (Ctrl+S), Save as (Ctrl+Shift+S), Show project folder and Close project. The
window title carries the project name, with `●` while it has unsaved changes, and closing, opening
or starting another project asks whether to save first. Tick "Reopen the last project when Forge3D
starts" on the start screen to skip it; passing a `.forge3d` path on the command line opens that
project directly.

Inside a project it is a viewport-first workstation: prompt, attachments, run settings and Run in the top bar; a full-bleed
viewport with orbit, pan, framing, shading, capture and fullscreen tools on the left; run history and
a Steps / Files / Checks / Logs inspector on the right; a Plan, Build, Check, Output dock with a
filmstrip of artifacts at the bottom; one status bar for Codex and tool readiness.

One job runs at a time. You can steer or cancel it, and the streamed transcript and workflow state
are written to disk as it goes. Interrupted jobs stay in the library with their Codex thread IDs for
an explicit continuation.

Contained local commands, run-file edits and local Blender or Godot tool calls are approved
automatically for the session. Network requests, writes outside the run directory and remote provider
actions still ask. The desktop is local-only: it does not use cloud providers.

Previews by type:

- PNG, JPEG, WebP and GIF render directly; ordered image folders play as 12 fps sequences.
- GLB and glTF use Three.js with animation playback and automatic framing.
- SPLAT, SOG and Gaussian PLY use SparkJS, so a splat can be orbited and inspected in place.
- Validation JSON, text and logs render in the inspector. Unsupported files show metadata and keep
  their Reveal and Open actions.

Per-file actions: reveal, open, open in Blender, review in Godot, copy path, and export to another
format through headless Blender. Per-run actions: duplicate, archive, and trash to the Recycle Bin.
Paths are checked against the run root first.

## Projects, runs and files

A project is a folder with one manifest and its runs:

```text
%USERPROFILE%\Documents\Forge3D\Projects\Bottle\     (the default location; any folder works)
  Bottle.forge3d                                     project manifest: id, run settings, last selection
  runs\<timestamp>-<slug>-<id>\                     one self-contained folder per job
```

Runs are written as they happen, so a Save only has the project's own state to write: its run
settings and where you left off. A new project is untitled, and its runs are kept under
`%LOCALAPPDATA%\Instrumenta\Forge3D\untitled` until the first Save moves them into the chosen
folder. Discarding an untitled project sends that folder to the Recycle Bin. Save as on a saved
project copies it, runs and all, and leaves the original where it was.

Runs made before projects existed (`Documents\Forge3D\runs`) became a
project called **Earlier runs** the first time this version started. A manifest was added beside
the folder and nothing was moved. It shows in the recent list.

Attachments are copied in before Codex starts. `run.json` records the prompt, route, settings,
steps, relative artifacts, validation, timestamps, transcript, and Codex thread and turn IDs. New
runs use schema v2; v1 stays readable. Forge3D never overwrites an existing asset output, so each
version gets a new folder.

Review assets, logs, configuration and caches live in `%LOCALAPPDATA%\Instrumenta\Forge3D`.

## Command line

The desktop is the normal interface. The CLI is for diagnostics and repeatable jobs:

```powershell
forge3d doctor
forge3d models list
forge3d models status
forge3d process --help
forge3d rig --help
forge3d animate --help
forge3d retarget --help
forge3d humanoid-retarget --help
forge3d validate --help
```

A local TripoSplat run:

```powershell
forge3d models run triposplat C:\path\to\reference.png `
  --output-dir C:\path\to\output\prop-splat-v001 `
  --gaussians 262144
```

For interactive scene review, start Blender with its MCP bridge:

```powershell
.\scripts\start-blender-mcp.ps1
.\scripts\start-blender-mcp.ps1 -BlendFile C:\path\to\asset-v001.blend
```

The CLI also has an opt-in Tripo cloud fallback (`forge3d models cloud-run`). It uploads nothing
without `--approve-upload` for that job, and provider charges stay visible.

## Repository map

```text
blender/       reviewed Blender tasks and asset builders
desktop/       Electron client, previews, tests, and Windows package
docs/          architecture, schema, brand, release, and workflow notes
godot/         GLB and Gaussian review project
plugins/       Forge3D Codex plugin and skill
scripts/       setup, packaging, launchers, and WSL workers
src/forge3d/   dependency-light host CLI
tests/         Python integration and policy tests
```

Further reading:

- [Desktop process, security, approvals, and preview routing](docs/desktop-architecture.md)
- [Run schema and crash recovery](docs/run-schema-v2.md)
- [Humanoid retarget workflow](docs/humanoid-retarget.md)
- [Windows packaging and troubleshooting](docs/releasing.md)
- [Brand identity](docs/brand-identity.md) and [brand v2 alignment](docs/brand/README.md)
- [Publication audit](docs/publication-audit.md)

## Verify a change

```powershell
uv run --with pytest pytest -q
npm --prefix desktop test
npm --prefix desktop run build
.\blender\tests\smoke.ps1
```

The Blender and Godot headless checks need those applications installed. Game-facing assets should
finish with an engine import and runtime review.

## Licence

Forge3D is MIT licensed. Bundled integrations keep their own notices, listed in
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md); other providers' licences and limits are in
`forge3d models info <name>`.

---

<sub>Part of [Instrumenta](https://github.com/George-Nizor/Instrumenta), made by [Bonehead Labs](https://boneheadlabs.org). Brand v2: ember cube, interface type Fraunces, Commissioner and Spline Sans Mono (SIL OFL 1.1, vendored in `desktop/src/renderer/brand/fonts` with its licences). Licence: MIT.</sub>
