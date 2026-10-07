![Forge3D banner](docs/images/forge3d-banner.png)

<p align="center"><img src="docs/brand/forge3d-animated.svg" alt="Forge3D cube" width="96" /></p>

# Forge3D

Prompt-driven 3D modelling on the Codex App Server.

Forge3D turns a prompt, with optional reference images, into a versioned local 3D run. The Windows
desktop app starts your installed Codex CLI as an App Server, hands each job the Forge3D skill, streams
the transcript to disk and previews what comes out. Blender, Godot, WSL, CUDA and model weights are
separate installations that Forge3D detects but does not bundle.

Current version: **0.3.0** (Python CLI and desktop).

## Start here

The normal way to run Forge3D is its card in Instrumenta, which installs the release bundle, checks
its hash, keeps the previous version for rollback and opens `Forge3D.exe`.

From a source checkout on Windows:

```powershell
.\scripts\setup.ps1 -InstallModels -InstallPersonalPlugin
forge3d doctor
cd desktop
npm install
npm run build
npm start
```

`setup.ps1` installs the `forge3d` CLI as an editable `uv` tool, installs the pinned Blender MCP
add-on and warms the Blender and Godot MCP caches. `-InstallModels` installs TripoSplat in WSL and
`-InstallPersonalPlugin` registers the Forge3D Codex plugin; `-DryRun` prints the steps only. Restart
Codex after installing or repairing the plugin so it sees the skill.

## Requirements

The tested setup is Windows x64 with Blender 5.x, Godot 4.6, Python 3.11 or newer, Node.js 22 or
newer, `uv`, and the Codex CLI signed in. Godot is optional and only needed for engine review. The
Gaussian splat route also needs WSL2 Ubuntu with `uv` and `git`, NVIDIA CUDA visible inside WSL, and
a GPU with at least 8 GB of free VRAM. Exporting a splat to a `.blend` package needs the KIRI Engine
Blender extension.

## What it does

A job takes one of two main routes:

| Route | Good fit | Main output |
| --- | --- | --- |
| Authored Blender | Editable props, buildings, rigs, animation, collision, LODs | `.blend` source and a validated `.glb` |
| TripoSplat | Static props where the reference image matters more than mesh editing | Gaussian `.ply` and `.splat` with a collision proxy |

A splat is a Gaussian visual asset whose unseen sides are inferred from one image. It is not a
polygon mesh. The run settings also offer image-to-mesh (SPAR3D), mesh processing, rigging,
animation, retargeting and validation; the agent picks a route when the setting is left on auto.

The desktop is viewport-first: a prompt bar with attachments and run settings, a full-window viewport
with view tools on the left, run history and a Steps / Files / Checks / Logs inspector on the right,
and a Plan / Build / Check / Output dock with a filmstrip of outputs. One job runs at a time. You can
steer or cancel it, and an interrupted job keeps its Codex thread so it can be resumed.

The preview shows images, ordered image folders as 12 fps sequences, GLB and glTF through Three.js
(with animation playback), PLY, SPLAT and SOG splats through SparkJS, and validation JSON, text and
logs in the inspector. Other files show metadata with Reveal and Open. **Export** converts a finished
artifact through headless Blender into a new versioned folder under the run's `exports/`: polygon
models to eight formats, splats to a `.blend` package only. **Review in Godot** opens a model or splat
in the bundled Godot review project.

The desktop auto-approves contained local commands, file changes inside the run directory and local
Blender or Godot MCP calls. It is local-only: network access is off and the agent is told not to use
cloud providers. Anything outside the run directory still asks.

A Setup panel reports which routes this machine can run, why a route is blocked and how to fix it.
It does not install anything yet; installation is still done by `setup.ps1` and `forge3d models
install`. Details are in [docs/capabilities.md](docs/capabilities.md).

## Where data lives

Each job gets its own folder:

```text
%USERPROFILE%\Documents\Forge3D\runs\<timestamp>-<slug>-<id>
```

Attachments are copied into it before Codex starts. `run.json` records the prompt, route, settings,
steps, artifacts, validation, transcript and Codex thread and turn IDs. New runs use schema v2;
v1 runs stay readable. Archived runs move to `.archive` under the runs folder, and trash uses the
Recycle Bin. Logs, caches, configuration and the Godot review project live under
`%LOCALAPPDATA%\Instrumenta\Forge3D`. TripoSplat and other models install into the WSL model
directory, never into the repository.

Forge3D never overwrites an existing output. Every job gets a new run folder and every export a
new numbered version.

## Command line

The desktop is the normal interface. The `forge3d` CLI handles diagnostics and repeatable jobs:
`doctor`, `capabilities`, `make`, `process`, `rig`, `retarget`, `humanoid-retarget`, `animate`,
`validate`, `open`, and `models` (`list`, `info`, `status`, `install`, `run`, `cloud-estimate`,
`cloud-run`). Each has `--help`. A local TripoSplat run:

```powershell
forge3d models run triposplat C:\path\to\reference.png `
  --output-dir C:\path\to\output\prop-splat-v001 `
  --gaussians 262144
```

For an interactive Blender session through the MCP bridge, run `.\scripts\start-blender-mcp.ps1`,
optionally with `-BlendFile <path>`.

## Models and cloud providers

TripoSplat (MIT) is the accepted local route for image-faithful static props. TripoSG, PartCrafter
and SPAR3D carry non-commercial or conditional licence terms, so installing one requires
`--accept-license`, and `forge3d make` will not choose an image backend for you. `forge3d models info <name>` shows each
model's licence and VRAM needs; [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) has the full list.
Model weights are not committed or bundled.

Cloud generation exists only in the CLI. `forge3d models cloud-estimate` describes a job without
uploading anything, and `forge3d models cloud-run tripo` uploads only with `--approve-upload`.

## Verify a change

```powershell
uv run --with pytest pytest -q
npm --prefix desktop test
npm --prefix desktop run build
.\blender\tests\smoke.ps1
```

`smoke.ps1` needs Blender, and the Python suite skips its Godot check when Godot is missing.
Release packaging is `.\scripts\build_desktop.ps1`; see [docs/releasing.md](docs/releasing.md).

## Documentation

- [Desktop process, approvals, preview routing and export](docs/desktop-architecture.md)
- [Capabilities report and Setup panel](docs/capabilities.md)
- [Run schema and crash recovery](docs/run-schema-v2.md)
- [Humanoid retarget workflow](docs/humanoid-retarget.md)
- [Blender task scripts](blender/README.md)
- [Windows packaging and troubleshooting](docs/releasing.md)
- [Brand identity](docs/brand-identity.md)
- [Publication audit](docs/publication-audit.md)

Forge3D is MIT licensed ([LICENSE](LICENSE)). Bundled integrations keep their own notices.

## Family

Forge3D is part of [Instrumenta](https://github.com/George-Nizor/Instrumenta), a suite of local
learning and creative apps made by [Bonehead Labs](https://boneheadlabs.org)
([GitHub](https://github.com/Bonehead-Labs)). It follows the Instrumenta brand v2: an ember cube,
drawn as a freestanding object. The interface type (Fraunces, Commissioner, Spline Sans Mono) is SIL
OFL 1.1, vendored in `desktop/src/renderer/brand/fonts` with its licences.
[Brand v2 in Forge3D](docs/brand/README.md) describes what was taken from the brand and what was
kept. Licence: MIT.
