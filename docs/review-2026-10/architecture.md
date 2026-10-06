# Forge3D architecture, functionality and deployment review

Reviewed 2026-10-06 on branch `feat/brand-v2` (HEAD `0b37252`), read-only. Scope: architecture,
functionality, security and deployment. UI, UX and brand are covered by the companion review.

How this was checked: every file named below was read. The desktop unit tests (`node --test`,
43 pass) and the Python suite (`uv run --with pytest pytest`, 38 pass, 4 skipped: the Blender and
Godot headless checks) were run in WSL. The published GitHub release was inspected with `gh`.
Nothing was run on Windows, and no real Codex App Server, Blender, Godot, WSL CUDA or TripoSplat
run took place. Anything marked **unverified** is inferred from source.

---

## 1. Architecture as it stands

### Processes

```text
Instrumenta launcher (Windows Electron)
  └─ spawns Forge3D.exe (managed bundle, %LOCALAPPDATA%\Instrumenta\products\forge3d\versions\<v>)
       Electron main (desktop/src/main.cjs)
       ├─ renderer: sandboxed, Vite bundle, three.js + Spark splats (desktop/src/renderer/main.js)
       ├─ codex.exe app-server (JSONL over stdio)           desktop/src/lib/codex-client.cjs
       │    └─ agent turn: shell commands, file edits, MCP calls, image generation
       │         ├─ forge3d.exe (PyInstaller one-file CLI, resources\bin, put on PATH)
       │         │    ├─ blender.exe --background --python blender/forge3d_task.py (Windows)
       │         │    └─ wsl.exe … TripoSplat .venv python .forge3d_run.py (WSL2, CUDA)
       │         ├─ Blender MCP: uvx blender-mcp==1.6.5 → TCP 127.0.0.1:9876 → add-on in a running Blender
       │         └─ Godot MCP: cmd /c npx -y @npgamedev/godot-mcp-server@1.0.0
       ├─ blender.exe --background (export, desktop/src/lib/export-service.cjs)
       ├─ godot.exe --headless --import (project priming, runtime.cjs:79)
       └─ blender.exe / godot.exe --editor (detached, "Open in Blender", "Review in Godot")
```

Forge3D's desktop is a thin rich client (main 595 lines, renderer 1,339 lines, seven library
modules of about 1,100 lines). The work is done by the agent and by the toolkit: the Python CLI
(`src/forge3d`, about 3,300 lines, standard library only), the Blender task library
(`blender/forge3d_task.py`, 5,228 lines), the WSL inference worker (`scripts/wsl/`), and a Godot
review project with two vendored add-ons (`godot/addons/gdgs`, `godot_mcp_toolkit`, about 3 MB).

### IPC

The preload exposes 14 named invocations and 4 subscriptions (`desktop/src/preload.cjs:16-35`). Each
handler checks the sender origin (`main.cjs:69-85`, `file://` or the dev server). Run IDs are UUID-checked
and artifact paths are resolved against the run directory with symlinks refused
(`run-store.cjs:296-303`, `path-policy.cjs`). Artifacts reach the renderer through the privileged
`forge3d-artifact://<runId>/<path>` scheme (`main.cjs:569-575`). Main pushes `forge3d:state`
(the whole run list each time), `forge3d:event`, `forge3d:approval` and `forge3d:error`.

### State and versioning

| What | Where | Notes |
| --- | --- | --- |
| Runs | `%USERPROFILE%\Documents\Forge3D\runs\<stamp>-<slug>-<id8>\` | `run.json` schema v2, atomic writes (`run-store.cjs:42-51`); attachments copied with SHA-256; archive is `.archive/` below the root |
| Transcript | inside `run.json` | up to 1,200 entries, merged deltas up to 50 KB each (`run-store.cjs:226-250`); rewritten in full on every 220 ms flush |
| Codex thread | `run.json.codex.thread_id` | resume uses `thread/resume` (`main.cjs:238`) |
| Local state | `%LOCALAPPDATA%\Instrumenta\Forge3D\{cache,config,logs,plugin,godot}` | Godot template re-copied when the bundle version changes (`runtime.cjs:65-77`) |
| Codex plugin | `%USERPROFILE%\plugins\forge3d`, `%USERPROFILE%\.agents\plugins\marketplace.json` | written by Repair (`runtime.cjs:181-217`), outside Forge3D's own folders |
| Models | WSL `$HOME/.local/share/forge3d/models/<Model>` | git checkout + `.venv` + weights, written by `forge3d models install` |
| Installed app | `%LOCALAPPDATA%\Instrumenta\products\forge3d\versions\<v>` | Instrumenta's managed install with current/previous pointer |

"Never overwrite an output" is real in the host code: attachments get `-v002` names, exports reserve
`exports/<stem>-<fmt>-v001` with `mkdir` (`export-service.cjs:36-50`), and the import script refuses
an existing output. For agent-written outputs it is an instruction in the prompt only.

### What runs where

| Piece | Runs on | Required for |
| --- | --- | --- |
| Electron desktop, `forge3d.exe` | Windows | everything |
| Codex CLI + sign-in | Windows | every generation |
| Blender 5.x | Windows | procedural route, export, splat-to-Blend packaging |
| KIRI Engine Blender extension | inside Blender | splat-to-Blend export (`blender/import_gaussian_splat.py:16,80-86`) |
| Blender MCP add-on + a Blender running its bridge | Windows | the skill's "inspect in Blender" step |
| `uv`/`uvx` | Windows | Blender MCP server |
| Node.js (`npx`) | Windows | Godot MCP server |
| Godot 4.x | Windows | Godot review, MCP validation |
| WSL2 + Ubuntu + NVIDIA WSL CUDA + 8 GB VRAM + `uv` and `git` inside WSL | WSL | TripoSplat (the splat route) |
| TripoSplat checkout, torch cu128, weights (DINOv3 ViT-H, FLUX.2 VAE, BiRefNet, TripoSplat) | WSL | splat route; several GB, size not measured |

### When something is missing

| Missing | What Forge3D does today |
| --- | --- |
| Codex CLI | `findCodexExecutable` throws (`runtime.cjs:56-63`); the status line shows "Toolchain offline" with the message. Clear enough. |
| Codex signed out | Not checked. The App Server starts, and the first turn fails with whatever Codex says. |
| Forge3D plugin | Bootstrap marks the skill `missing` and passes the bundled `SKILL.md` by path (`main.cjs:206-209`); MCP servers are then not configured. "Repair" offered. |
| Blender | Status light off; export and "Open in Blender" refuse. A Blender prompt still starts a Codex turn, which fails partway through. |
| Godot | Status light off; review refuses. The skill's Godot step degrades to "report the constraint". |
| WSL | Detected as `where wsl.exe` (`runtime.cjs:126`), which is present on almost every Windows 10/11 machine with or without a distro, so it reads "ready" when it is not. |
| CUDA, VRAM, TripoSplat install | Not checked by the desktop at all. A splat prompt runs Codex, generates a reference image, then fails inside `forge3d models run` (`models.py:610-633`). |
| KIRI extension | Splat export fails inside headless Blender with a RuntimeError in `export.log`. |
| Blender MCP bridge | Never started by the desktop. The skill says to report the absence. |

The status bar also labels any detected Blender as "4.5" and any Godot as "4.4"
(`renderer/main.js:385`), while the README says Blender 5.x and Godot 4.6. Those are invented
numbers, not detected ones.

---

## 2. Functionality assessment

### What is solid

- **Run store and path policy.** Containment checks, UUID run IDs, symlink refusal, atomic writes
  with retry for Windows file locks, crash recovery to `interrupted` on start
  (`run-store.cjs:263-271`), schema v1 still readable. Unit-tested.
- **Electron hardening.** `contextIsolation`, `sandbox`, no `nodeIntegration`, `webSecurity`, window
  opens denied, navigation restricted, all permission requests denied (`main.cjs:390-402, 576-577`).
  The preload has no generic file API. Renderer HTML is built with `innerHTML` but every interpolated
  value I checked goes through `escapeHtml`.
- **CSP** is strict apart from `style-src 'unsafe-inline'` and the `wasm-unsafe-eval` + `connect-src
  data:` pair Spark needs (`desktop/index.html:8`).
- **Codex client.** Small, correct JSON-RPC framing, server requests tracked and answered once,
  unsupported server requests rejected with -32601 (`codex-client.cjs`).
- **Export pipeline.** Versioned output folder, 15-minute timeout, success only when Blender's own
  report says `completed` (`export-service.cjs:94-125`).
- **Toolkit.** The Python CLI is dependency-free, guards git revisions, and refuses to overwrite.
  The Blender task library is large and has headless smoke tests (`blender/tests/smoke.ps1`).

### What is fragile

1. **Codex App Server protocol is unpinned.** Forge3D uses whichever `codex.exe` is newest under
   `%LOCALAPPDATA%\OpenAI\Codex\bin` (`runtime.cjs:18-33`), then speaks `thread/start`,
   `turn/start` with `sandboxPolicy`, `turn/steer`, `skills/list`, `model/list` and the
   elicitation schema. That protocol is still moving, and nothing checks the server version.
   A Codex update can break Forge3D without any Forge3D change. **Unverified** against the current
   Codex release.
2. **The agent prompt and the skill contradict each other.** The host prompt says not to rerun
   `forge3d doctor` and never use cloud (`main.cjs:219-221`); the skill's step 2 says to run
   `forge3d doctor --json` first and describes a Tripo cloud fallback with approval
   (`SKILL.md` "Required workflow" step 2, "Safety and external services"). The skill also says "this
   16 GB GPU". The model must resolve this on every turn.
3. **Progress is guessed from command text.** `presentItem` maps regexes over command lines to
   phases (`main.cjs:304-314`). The pipeline dock shows what the regex thinks, not what happened.
4. **Synchronous work on the main process.** `detectExternalTools` runs up to five `where.exe`
   calls and recursive directory walks (`runtime.cjs:112-130`), and `ensureCodex` runs
   `wsl --exec sh` synchronously with a 10 s timeout (`runtime.cjs:132-142`, called at
   `main.cjs:158`). A cold WSL VM boot freezes the window for several seconds.
5. **Run store reads every manifest for every lookup.** `find()` walks all run folders and parses
   each `run.json` until it matches (`run-store.cjs:136-143`); `update()` calls it; every event flush
   calls `update()`; every `sendState` calls `list()`, which parses all of them. With transcripts in
   `run.json` this grows with history size times transcript size. Fine at 20 runs, slow at 500.
6. **The WSL distro can disagree.** The desktop resolves the models directory in the *default*
   distro (`runtime.cjs:134`); the CLI prefers a distro named Ubuntu (`process.py:103-120`). If the
   default is not that Ubuntu, `FORGE3D_WSL_MODELS_DIR` points at the wrong home.
7. **No single-instance lock.** A second `Forge3D.exe` starts a second App Server and writes the
   same `run.json` files. "One job at a time" is per process only.
8. **Cancel and quit may orphan work.** `close()` kills `codex.exe` only (`codex-client.cjs`
   `close`); on Windows that does not kill its tree, so a TripoSplat process in WSL or a headless
   Blender may keep running. **Unverified.**
9. **TripoSplat installs are not reproducible.** `models install` tracks `main` of the upstream repo
   and an unpinned Hugging Face snapshot (`models.py:319-352, 870-880`). Two installs a month apart
   can differ.
10. **Machine-specific paths.** `scripts/setup.ps1:12` hard-codes
    `C:\Users\George\Godot Projects\…\Godot_v4.6.2-stable_mono_win64_console.exe`; Godot detection
    walks `~/Godot Projects` (`runtime.cjs:37`, `doctor.py:24`).

### Unverified (could not be exercised here)

- A real Codex turn end to end on Windows, including whether `workspaceWrite` is actually
  enforced by Codex's Windows sandbox, and how WSL calls behave under it.
- The KIRI export, Godot priming, and "Review in Godot".
- The `feat/brand-v2` package with the new ICO (`docs/brand/README.md` says this was not
  built). The ICO itself is well-formed: seven 32-bit PNG-compressed entries, 16 to 256 px,
  identical to `assets/brand/forge3d.ico`. electron-builder and rcedit accept PNG entries and the 256
  entry it requires is present. The small risk is PNG-compressed sizes of 48 px and below, which
  some older shell paths render poorly; Windows 10/11 handle them. Low risk, but check it on the PC.
- Whether GitHub keeps `+` in an asset name like `Forge3D-0.2.2+codex.20260822.desktop1-windows-x64.zip`.
  The published v0.2.2 used a plain version, so this has never been tried.

### Technical debt

- `run.json` holds the transcript; it should be `transcript.jsonl`, append-only.
- `renderer/main.js` is one 1,339-line file of template strings and listeners. Workable, but the UI
  review will want it split.
- Unused breadth in the product: the model catalog carries TripoSG, SPAR3D, PartCrafter, SkinTokens
  and UniRig with licence caveats (`models.py:53-185`), plus a Tripo cloud path, none of which the
  desktop offers.
- `experiments/` (three.js houses, a benchmark, a TripoSplat comparison) ships in the repository but
  not the bundle. It is unrelated to the product.
- The renderer build ships its 8.5 MB source map inside the bundle (`vite.config.mjs`
  `sourcemap: true`, `files: dist/**/*`).
- `docs/releasing.md` still talks about a per-job "cloud checkbox"; the desktop no longer has one.
- The repo `.venv` is a Linux venv (`.venv/bin`); `main.cjs:156` expects `.venv\Scripts` in a
  Windows source run. A Windows source run from this checkout does not put `forge3d` on PATH.

### Test coverage gaps

43 desktop tests and 38 Python tests pass. What they leave out:

- About a third of the desktop tests read source as text and match regexes (`security.test.cjs`,
  `identity.test.cjs`). They prove a string exists, not that the behaviour holds.
- Nothing tests `main.cjs`: IPC handlers, `onCodexRequest`, `onCodexNotification`, the
  turn-completed path, recovery.
- No test against a real or recorded App Server session. The client tests use a fake that agrees
  with the code by construction. Imago's `tests/fixtures/fake-claude.mjs` is the pattern to copy.
- No Electron smoke run, no `--instrumenta-launch-check`, no packaged-bundle test.
- No CI at all: there is no `.github/` directory. Every release has been built by hand.
- The Blender and Godot headless tests skip unless the tools are installed, so they never ran here.

### Security posture

The Electron side is good. The agent side is where the risk sits.

1. **Auto-approval grants escalations on a regex.** With `approvalPolicy: "on-request"`
   (`codex-client.cjs`, `startThread`/`startTurn`), an approval request *is* the agent asking to run
   something outside the sandbox. `automaticApproval` answers `acceptForSession` for any command
   whose `cwd` is inside the run directory and whose text does not match
   `https?://|curl|wget|invoke-webrequest|cloud-run|approve-upload|upload|provider action`
   (`approval-policy.cjs:5, 41-46`). That pattern misses `iwr`, `Invoke-RestMethod`,
   `python -c "import urllib…"`, `git clone`, `uv pip install`, `npx`, `Start-BitsTransfer`, and any
   command that deletes or writes outside the run without declaring it in `additionalPermissions`.
   The approval also holds for the rest of the session. In practice "local-only" depends on the
   prompt and on Codex's own sandbox, not on Forge3D.
2. **WSL is outside any Windows sandbox.** Whatever the agent sends through `wsl.exe` runs as the
   user in Linux with full network, and can write to `/mnt/c`. The splat route depends on it.
3. **Repair writes the user's global Codex setup.** It renames `~/plugins/forge3d`, rewrites
   `~/.agents/plugins/marketplace.json`, and runs `codex plugin add` (`runtime.cjs:181-210`). This
   is guarded with a backup, but it reaches outside Forge3D's own folders and affects every Codex
   session, not only Forge3D's.
4. **The MCP servers are fetched at run time** with `uvx --from blender-mcp==1.6.5` and
   `npx -y @npgamedev/godot-mcp-server@1.0.0`. They are version-pinned but not hash-pinned, and they
   need the network the job supposedly lacks.
5. Minor: the production CSP still allows `ws://127.0.0.1:5173` (the Vite dev server);
   `forge3d:start-run` copies any absolute path the renderer names (acceptable, since the renderer
   is trusted and sandboxed).

---

## 3. Deployment assessment

### From the Instrumenta tile to a first generation on a clean Windows PC

1. **Install.** Instrumenta fetches `instrumenta-release.json` from the latest GitHub release,
   downloads the 176 MB ZIP (436 MB unpacked, Electron 43 plus `forge3d.exe`, toolkit, plugin, Godot
   template), verifies size and SHA-256, and activates it. This part works and matches the suite.
2. **Open.** Instrumenta spawns `Forge3D.exe`. The version is confirmed on the process `spawn`
   event (`Instrumenta/electron/main.cjs:921-923`).
3. **Codex.** The user must already have the Codex app or CLI installed and signed in with a plan
   that allows App Server use. Forge3D does not offer to install it or check sign-in.
4. **Plugin.** The status line says "Plugin repair available". Repair writes into the user profile
   and runs `codex plugin add`. The docs say to restart Codex afterwards.
5. **Blender route.** Install Blender 5.x in one of the detected locations (or set
   `BLENDER_EXECUTABLE`). For the skill's live-inspection step the user also needs `uv` on
   Windows, the Blender MCP add-on, and a running Blender with its bridge started. The add-on is in
   `vendor/blender-mcp/addon.py`, which is **not** in `extraResources` (`desktop/package.json`), and
   the only installer is `scripts/setup.ps1` in a source checkout. A user of the installed bundle
   cannot get it from Forge3D.
6. **Godot review.** Godot 4.x in `Program Files\Godot`, `~/Godot Projects`, PATH, or
   `GODOT_EXECUTABLE`; Node.js for the Godot MCP.
7. **Splat route.** WSL2 with an Ubuntu distro, the NVIDIA Windows driver with WSL CUDA, a GPU with
   at least 8 GB, `uv` and `git` inside WSL, then `forge3d models install triposplat` from a
   terminal, using `forge3d.exe` from inside the versioned install folder because it is not on
   PATH. Then several GB of downloads. None of this is in the desktop.
8. **Splat export.** The KIRI Engine Blender extension, installed by hand.

Failure modes the user meets mid-run, after Codex has already spent time and quota: TripoSplat
not installed, no CUDA in WSL, too little free VRAM, wrong distro, KIRI missing, Blender MCP not
listening, plugin MCP config pointing at `uvx`/`npx` that do not exist.

### First-run setup UX

There isn't one. The only setup affordance in the app is the plugin Repair button. Compare Imago,
whose `GET /api/capabilities` reports `claude` and `renderer` as ready, missing or signed out, each
with a reason and a fix, shown on the start screen (`Imago/server/capabilities.mjs`), and Discere,
which reports `tutor_generation`, `illustrations` and `authoring` with what still works and
removes controls it cannot honour. Forge3D shows five status dots, one of them (WSL) almost always
falsely green and two with invented version numbers.

### Update and rollback

- **The unreleased work cannot ship as an update.** The published release is `0.2.2`
  (2026-08-21). The source is now `0.2.2+codex.20260822.desktop1`. Instrumenta ignores build
  metadata in precedence (`Instrumenta/electron/update-check.cjs:19-31`), so publishing that version
  would never be offered to a machine on 0.2.2. The next release needs a real bump (0.3.0).
- `main` is one commit ahead of `origin/main` (`4fd94d7`, export pipeline and local-only
  enforcement); `feat/brand-v2` adds three more. The `win-unpacked` build on disk is from
  2026-08-22, older than both.
- **Rollback is weaker than the docs suggest.** For `managed-bundle`, Instrumenta rolls back only
  when `spawn` itself errors (`Instrumenta/electron/main.cjs:924-929`); the version is confirmed
  on `spawn`. An Electron app that starts and then crashes (bad `ensureRuntimeState`, missing
  resource) is confirmed and kept. `--instrumenta-launch-check` is probed only for
  `native-bundle` products (`main.cjs:859`). Forge3D does not implement it either.
- **The developer-checkout route looks broken (by reading).** With no managed install, the tile uses
  `../Forge3D/desktop/dist-package/win-unpacked/Forge3D.exe` and says "Developer bundle is ready"
  (`Instrumenta/electron/workspace.cjs:163-189`). `openDesktopProduct` then asserts the
  executable is inside `managedInstallRoot()/forge3d` (`main.cjs:912-915`) and refuses it.
  `instrumenta/product.json` also has no `build.command`, so Prepare is not offered. **Unverified
  at runtime.**
- Releases are built by hand with `scripts/build_desktop.ps1`. It writes a schema-1 manifest
  compatible with the launcher but does not run the launcher's `validateReleaseManifest`, unlike the
  suite's shared `scripts/instrumenta-release.cjs`.

### Against "installer-and-done" and the other products

| Product | Install | Prerequisites the user sets up |
| --- | --- | --- |
| Ludere, LearnChess | baked in, `managed-web` releases | none |
| Luna | its own installer | none beyond a GPU for speed |
| Fabula | release + engine set up in WSL by itself | WSL + a distro; Claude Code or Codex for the assistant |
| Imago, Discere | source checkout, `web-service` | Node/pnpm, Claude Code or Codex; honest capability reports |
| **Forge3D** | managed bundle, verified | Codex + sign-in, plugin repair, Blender, KIRI, Blender MCP add-on, `uv`, Node, Godot, WSL + Ubuntu + CUDA + `uv`/`git` in WSL, a terminal model install |

The bundle install is as good as Luna's. Everything after it is the furthest from installer-and-done
in the suite. Fabula is the useful contrast: it also needs WSL, but its first start sets up its own
engine (`Fabula/scripts/setup-engine.sh`) with progress, no sudo, and one known size.

On "launched in WSL": `main.cjs` and `runtime.cjs` assume Windows throughout (`where.exe`,
`LOCALAPPDATA`, `.venv\Scripts`, `titleBarOverlay`, Program Files paths). A Linux Electron run in WSL
exercises none of the real paths, so its results say nothing about the product. Since the workspace
lives on the WSL disk, a Windows source run would also read the checkout over `\\wsl.localhost`;
the packaged bundle is the only honest test target.

---

## 4. Recommendation: keep and restructure the agent and setup layers; do not rebuild

### Why not rebuild

- The valuable parts are already separable and mostly sound: the Python CLI, the 5,000-line Blender
  task library, the WSL TripoSplat worker, the export path, the Godot review project, the run store
  and the splat/model previews. None of them depend on Electron or on Codex.
- The Electron client is small and well hardened. Rewriting it buys nothing the users would notice.
- The problems are in three specific places, and each has a contained fix: the agent boundary
  (shell plus regex approvals), setup and capability reporting (none), and release plumbing (manual,
  unversioned, no launch check).

### Alternatives considered

1. **Imago-style `web-service` run from source.** Rejected for Forge3D. Imago works as a web service
   because its whole runtime is Node plus Claude Code in one place. Forge3D drives Windows-native
   Blender and Godot plus CUDA in WSL. A service run from a checkout moves it *away* from
   installer-and-done (Imago and Discere are the two products that are not installer-and-done), and
   Electron's file dialogs, Recycle Bin and "open in Blender" would have to be rebuilt over HTTP. What
   to take from Imago is its **patterns**, not its adapter:
   - a capability report with state, reason and fix for every dependency, shown before a run;
   - the agent restricted to a dedicated MCP server with typed tools and no shell
     (`--tools`, `--strict-mcp-config`, `dontAsk`), so the host, not a regex, decides what can happen;
   - a recorded fake agent for tests.
2. **Codex vs Claude Code.** Codex is the right default *today* for one concrete reason: the splat
   route from a text prompt depends on Codex's built-in image generation to make the reference image
   (`main.cjs:307`, the `imageGeneration` item). Claude Code has no image generation, so with Claude
   Code the user would attach a reference or Forge3D would need a separate generator. Codex's
   weaknesses are an unpinned, evolving App Server protocol and a subscription the suite already
   treats as possibly lapsing (see Discere's capability gating). Recommendation: put a small driver
   interface between `main.cjs` and the agent (start, steer, cancel, events). Ship Codex first and add
   a Claude Code driver (Imago's `claude -p --output-format stream-json` with Forge3D's MCP) only if
   the owner wants it. With a typed Forge3D MCP, the driver is the thin part.
3. **No agent at all for the common paths.** Worth having as a fallback, not a replacement: once the
   operations are MCP tools, the same tools can sit behind ordinary buttons ("Make splat from this
   image", "Export", "Validate in Godot"). That keeps the app useful when no subscription is current.

### What to drop or move out of the product path

- The cloud path (Tripo cloud-estimate, cloud-run, `TRIPO_API_KEY` guidance in the skill). The
  desktop is local-only; the skill should say the same.
- The licence-encumbered or unused model entries (TripoSG, SPAR3D, PartCrafter, SkinTokens, UniRig)
  from the product surface. Keep them in the CLI behind a flag if the owner still uses them.
- The Godot MCP over `npx` (and with it the Node prerequisite). Headless Godot validation through
  `forge3d` is enough for automated runs; "Review in Godot" can stay a button.
- The live Blender MCP bridge as a *required* step of an automated run. Replace "inspect in Blender"
  with a headless Blender render returned to the agent as an image (as Imago's `render` tool does).
  Keep the Blender MCP for supervised interactive sessions only.
- Writes to the user's global Codex plugin setup, if the App Server can take the skill path and MCP
  config per thread (Forge3D already passes the skill by path; per-thread MCP config is
  **unverified** and must be checked against the current App Server).
- `experiments/` from the repository, or move it to an archive branch.

---

## 5. Phased plan

Each phase is sized for one or two sub-agents, with an owner check at the end. Order matters:
phases 1 and 2 make the current app honest and installable without touching the agent boundary.

| Phase | Work | Size | Depends on |
| --- | --- | --- | --- |
| 0 | Housekeeping: push or merge `4fd94d7`, decide whether `feat/brand-v2` merges first, adopt plain semver (next release 0.3.0, drop `+codex…`), remove `C:\Users\George` and `~/Godot Projects` assumptions, delete the dev-server `ws:` from the production CSP, stop shipping the source map | S | owner decisions 5, 6 |
| 1 | **Capabilities.** `forge3d capabilities --json` in the CLI (Codex present and signed in, plugin state, Blender version, KIRI, Godot version, WSL distro, `nvidia-smi` inside WSL, free VRAM, `uv`/`git` in WSL, TripoSplat installed and ready, free disk). Main calls it asynchronously and caches it; the renderer shows a Setup panel with state, reason and fix per item, and gates each route before a turn starts. Replace the hard-coded "4.5"/"4.4". Fake-tool tests. | M | 0 |
| 2 | **In-app setup.** One-click, idempotent, resumable actions with progress: install TripoSplat in WSL (pinned upstream commit and Hugging Face revision, disk check first, Fabula's `setup-engine.sh` as the model), install the Blender MCP add-on from a bundled copy (add `vendor/blender-mcp` to `extraResources`), point at KIRI's download page, plugin repair. Bundle `forge3d.exe` on a path the user can find. | M | 1 |
| 3 | **Release plumbing.** GitHub Actions on `windows-latest` (as Instrumenta's own release workflow does), build with `build_desktop.ps1`, write the manifest with Instrumenta's `scripts/instrumenta-release.cjs` so `validateReleaseManifest` runs. Add `--instrumenta-launch-check` to `main.cjs` (open the window hidden, check resources, write `FORGE3D_LAUNCH_OK <v>`), `app.requestSingleInstanceLock()`. Instrumenta side: probe managed-bundle products before the first open of a pending version, and fix the developer-checkout trust root and `build.command`. | M | 0 |
| 4 | **Forge3D MCP.** `forge3d mcp` (stdio, in `forge3d.exe`) with typed tools: `make_procedural`, `generate_splat`, `process_mesh`, `rig`, `animate`, `validate`, `export`, `render_preview` (returns an image), `godot_validate`. Each writes only into the run directory it is given. Run the agent with no shell and only these tools; delete `approval-policy.cjs` auto-approval. Reconcile the skill with the host prompt. Recorded fake App Server for tests. | L | 1 |
| 5 | **Driver interface.** Extract the Codex driver; optional Claude Code driver using Imago's flags. Capability-gated choice. Buttons for the agent-free paths. | M | 4, decision 1 |
| 6 | **Run store.** Index runs by ID in memory, transcript to `transcript.jsonl`, send per-run deltas instead of the whole list, kill the process tree on cancel and quit. | S–M | none |
| 7 | **Windows acceptance** on the owner's PC with a fresh Windows user profile: install from the tile, Setup panel to green, one Blender prop, one splat, export, restart and recover, a deliberately broken release to prove rollback. Use the screenshot and input techniques in the `windows-gui-driving` memory note. | M | 1–3 at least |

### Risks

- **App Server drift.** Forge3D talks to an unpinned, evolving protocol. Mitigate with a version
  check at start, a recorded-session test, and the driver interface.
- **Codex's Windows sandbox semantics.** Not confirmed. Phase 4 removes the dependence on it.
- **WSL CUDA variance.** Driver versions, distro names, a default distro that is Docker's. The
  setup has to report these honestly; it cannot fix them all.
- **Model availability and licences.** TripoSplat weights pull DINOv3 and FLUX.2 VAE components,
  whose terms can change. Record the pinned revisions and their licences in
  `THIRD_PARTY_NOTICES.md`.
- **Scope creep.** The Blender task library is large. Phase 4 should wrap it, not refactor it.

### What the owner must decide

1. **Agent:** Codex only, Claude Code only, or both behind a driver interface. Is text-to-splat
   (which needs Codex image generation) a must, or is "attach a reference image" acceptable?
2. **Scope:** keep only the splat and procedural-Blender routes in the product and drop the other
   model backends and the cloud path from the UI and skill?
3. **Godot:** is Godot validation part of every run, an optional button, or out?
4. **Prerequisites the owner accepts:** WSL + NVIDIA is unavoidable for TripoSplat. Is Blender
   acceptable as a separate install? Is KIRI?
5. **Version and branch:** release the current work as 0.3.0, and merge `feat/brand-v2` before or
   after the restructure?
6. **Global Codex setup:** may Forge3D keep writing `~/plugins` and the personal marketplace, or
   must it stay self-contained?
