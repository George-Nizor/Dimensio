# Brand v2 in Forge3D

Aligned 2026-10-06 against Instrumenta `brand/` at commit `292a1dd` (`brand/ALIGNMENT.md`).
Instrumenta is the source; nothing copied here is edited by hand. To refresh, regenerate in
Instrumenta (`uv run brand/scripts/build-brand.py`) and copy again.

## Copied

| From `Instrumenta/brand/` | To | Used for |
| --- | --- | --- |
| `fonts/*.woff2`, `fonts.css`, `OFL-*.txt` | `desktop/src/renderer/brand/fonts/` | Fraunces, Commissioner, Spline Sans Mono (replace `@fontsource/space-grotesk`, which is removed from `package.json` and the lockfile). Bundled by Vite into `dist/assets`, so the packaged app loads them from `self` and nothing from a CDN. |
| `icons/instrumenta-icons.{js,css}` | `desktop/src/renderer/brand/` | `InstrumentaIcons.render('forge3d')` draws the cube in the title bar and the empty viewport. The lid lifts on hover of the wordmark and for about three seconds when a job starts; `prefers-reduced-motion` stops it (the icon CSS handles that). Imported as a module; the UMD file exports instead of setting a global once bundled. |
| (Forge3D's own, not copied) `desktop/src/renderer/brand-icons/` | in place | The interface icon set: 33 flat objects with ink outline and stepped extrusion in the suite's algorithm, plus 8 `currentColor` line utilities. `icons.mjs` is the renderer's single door to it. See "Interface icons" below. |
| `icons/svg/forge3d{,-24,-16}.svg`, `icons/png/forge3d-*.png`, `icons/ico/forge3d.ico`, `artwork/forge3d-app-art.png` | `desktop/assets/brand/` | reference set and launcher art; `instrumenta/product.json` `assets.mark` points at the app art |
| `icons/png/forge3d-512.png`, `icons/svg/forge3d.svg`, `icons/ico/forge3d.ico` | `desktop/assets/icon.{png,svg,ico}` | Windows executable icon: `build.win.icon` is now `assets/icon.ico` (16 to 256, each size drawn at that size); the PNG and SVG stay for tests and tooling |
| `icons/svg/forge3d-animated.svg` | `docs/brand/` | README only |
| `tokens.json` "forge3d" block | `desktop/src/renderer/style.css` `:root` | accent `#EE7752`, secondary `#FFBDA6` (`--accent-tint`), deep `#7D331B`, ink `#23100A`, surface `#31170F` |

`docs/images/forge3d-banner.png` (1600x500) was rendered from the brand files in headless Chromium:
surface field, accent glow at the edges, Fraunces name, the cube from `InstrumentaIcons.render`, and
the launcher's blurb.

## Surfaces and themes

Opaque objects with a 2px ink outline and a hard extrusion down and to the right (`--obj-border`,
`--obj-shadow`), flat fills, no glass, glow, gradient or ambient motion. Dark is the default and sits
on the family neutrals from `tokens.json` (`#0d0c0a`, `#141210`, `#1d1a17`, `#352f29`); light is
derived from them (warm paper `#faf7f2` bars, white panels, `#e6e1d9` stage). Every colour is a
token on `:root`, written as `light-dark()`, so the page follows the system until the person picks
System, Light or Dark with the top-bar toggle (`data-theme`; the choice persists, and the window
caption overlay follows via the `setTheme` IPC). A test fails on any colour literal outside `:root`.

## Roles

- Accent `#EE7752`: Run button, active tool, running stage, selection, focus ring, links. As text or
  ring it is `--accent-text` (the accent on dark, the deep `#7D331B` on light). Primary buttons are
  the accent with ink `#23100A` and a deep extrusion.
- Fraunces (`"SOFT" 100, "WONK" 1`, 650 to 700): the wordmark, panel and modal titles, pipeline stage
  names and big state headlines. Nothing else.
- Commissioner (`"FLAR" 40`): everything operated, sentence case. The `font` shorthand resets
  `font-variation-settings`, so the axes come from one custom property (`--fvs`) applied with
  `!important`; Fraunces elements override it.
- Spline Sans Mono: versions, sizes, elapsed time, logs, code.

## Interface icons

`desktop/src/renderer/brand-icons/` (`forge-icons.mjs`, `forge-icons.css`, `README.md`) is the
interface set; `desktop/src/renderer/icons.mjs` exposes `icon(name, size, { hue, playing, working,
label })` and imports the CSS, so it rides the Vite build. Output is presentation attributes and
classes only (no `style=`, no script), so the strict CSP is untouched. The README there holds the
old-glyph to new-icon table, which the renderer follows mechanically.

- Meaning hues, never decoration: ember is the default; green only for `done`; rose for stop, failed
  and trash; gold for `alert`; teal for hand-offs (open, export, Blender, Godot); stone for anything at
  rest or not started.
- Sizes: 24px for the top bar, rail, menus, inspector actions, run and file tiles; 32px in the
  pipeline dock; 48px on empty and blank states; 16px only for the line utilities (add, close,
  chevrons, more, search) and the copy chip. The set's weak spots at 16px (orbit, resume, anvil) are
  therefore never drawn that small.
- Rail: a tool is drawn in its own hue while on and in stone while at rest; the momentary actions
  (frame, capture) rest in stone. Pipeline: idle stages are stone, active ember, finished `done`,
  warning `alert`, failed `failed`.
- Motion, all off under `prefers-reduced-motion` and `html[data-motion="reduced"]` (every `m-*` part
  carries `animation: none !important`): hammer strike when Run is pressed (the button turns into
  Steer after the strike finishes); anvil bob while the Build stage is running (the only loop, and
  only while work is happening); tick pop when a stage finishes and a shake when it fails; the lid of
  the model teapot lifts on hover of a run, file or tile and the bin's lid in the menu; the hop on
  hover of a button.
- Icon-only buttons keep their `aria-label`; the icons themselves are `aria-hidden`.
- Still line icons: the theme toggle's sun, moon and monitor (the set has none), and the eight
  utilities, which are the set's own `currentColor` lines.

## Kept, and why

- The 3D viewport: scene colours, grid, materials, shading modes, wireframe orange
  (`0xe2571c` in `main.js`), the splat renderer, the empty-viewport grid. Content, not chrome; the
  stage behind it follows the theme but the model's lighting does not.
- Success green, warning amber and danger red as status colours (`--ok`, `--warn`, `--danger`),
  with per-theme values chosen for contrast.
- The window `backgroundColor` and title-bar overlay colours in `main.cjs`, which are set per theme.
- The Instrumenta cube (`InstrumentaIcons.render('forge3d')`) as the mark; it is not part of the
  interface set.

## Verification

- `npm --prefix desktop test` (74 pass), `uv run --with pytest pytest -q` (38 pass, 4 skipped),
  `vite build` succeeds.
- The renderer was screenshotted in Chromium before and after (harness: build, serve, mock
  `window.forge3d`), empty, running, settings popover and keyboard focus. Computed styles confirm
  the three faces and the `FLAR`/`SOFT`/`WONK` axes apply.

## Not verified / follow-ups

- The Windows package (`electron-builder` with the ICO, `Forge3D.exe` icon, the managed bundle and
  `--instrumenta-launch-check`) was not built here; the change is confined to the renderer, the icon
  files and `build.win.icon`.
- Icon motion was checked in headless Chromium (animation names with and without reduced motion) but
  not watched live; the hammer strike before the Run button turns into Steer is timed by eye only.
- Real Electron, the artifact preview modals, and the splat/model viewports with real artifacts
  were not seen; only the shell with mock runs.
- `docs/design-references/forge3d-ui-claude-alignment-reference.png` (in Instrumenta) still shows
  the old look.
