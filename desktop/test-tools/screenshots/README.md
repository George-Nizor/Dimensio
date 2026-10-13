# Renderer screenshot harness

A visual check for the Forge3D renderer, not a unit test. `harness.cjs` serves a built renderer, injects a
mocked `window.forge3d` bridge with invented runs, and shoots named scenes in headless Chromium
(SwiftShader WebGL). The run data shapes are guesses taken from `main.js`; the real Electron shell,
title-bar overlay, ClearType and real IPC timing are not covered.

```bash
cd desktop
npm i --no-save --no-package-lock playwright-core      # once; not a project dependency
npm run build                                          # or: npx vite build --outDir /tmp/f3d-dist
npm run shots                                          # all scenes, dark, into test-tools/screenshots/shots/
```

Scenes: `first checking offline plugin done image model checks text logs running failed menu dialog
approval settings focus`, plus the readiness scenes `blocked signedout degraded ready capserror stopped blockedrun checkingcaps`
(the mocked `capabilities()` answers with a report in the schema of `docs/capabilities.md`; `capserror` answers `{ ok: false }`).
Project scenes: `start` (start screen with recent projects and unsaved work), `startempty`, `untitled` (an unsaved new
project) and `filemenu` (the File menu open). Every other scene runs inside a saved project.
Both themes: `THEME=light P=light- npm run shots`. Pick some with `node test-tools/screenshots/harness.cjs first,model,failed`.

Environment variables:

| Variable | Default | Meaning |
| --- | --- | --- |
| `SITE` | `desktop/dist` | built renderer to serve (match `--outDir` if you built elsewhere) |
| `OUT` | `test-tools/screenshots/shots` | where the PNGs go (git-ignored) |
| `THEME` | `dark` | `light` or `dark`; sets the emulated system colour scheme |
| `W`, `H` | `1540`, `900` | window size |
| `P` | empty | file-name prefix |
| `REDUCED` | unset | set to `1` to emulate `prefers-reduced-motion: reduce` |
| `CHROMIUM` | newest `chromium_headless_shell-*` in `~/.cache/ms-playwright` | browser executable |
| `PLAYWRIGHT_CORE` | `playwright-core` | module path, if it is installed elsewhere |

## Chromium on WSL without sudo

The headless shell needs `libnspr4`, `libnss3` and `libasound2t64`. Without root, fetch the packages and
unpack them into a folder of your own:

```bash
mkdir -p ~/chromium-libs && cd ~/chromium-libs
apt-get download libnspr4 libnss3 libasound2t64
for f in *.deb; do dpkg -x "$f" ext; done
export LD_LIBRARY_PATH=$HOME/chromium-libs/ext/usr/lib/x86_64-linux-gnu
```

(`sudo apt-get install -y libnspr4 libnss3 libasound2t64` is the permanent fix.) If the browser is
missing, `npx playwright-core install chromium-headless-shell` puts `chromium_headless_shell-<n>` under
`~/.cache/ms-playwright`.

The harness reads the reference images for thumbnails from `references/` at the repository root and
builds a small grey GLB on the fly, so the viewport lighting is judged on a material with no colour of its own.
