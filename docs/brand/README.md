# Brand v2 in Forge3D

Aligned 2026-10-06 against Instrumenta `brand/` at commit `292a1dd` (`brand/ALIGNMENT.md`).
Instrumenta is the source; nothing copied here is edited by hand. To refresh, regenerate in
Instrumenta (`uv run brand/scripts/build-brand.py`) and copy again.

## Copied

| From `Instrumenta/brand/` | To | Used for |
| --- | --- | --- |
| `fonts/*.woff2`, `fonts.css`, `OFL-*.txt` | `desktop/src/renderer/brand/fonts/` | Fraunces, Commissioner, Spline Sans Mono (replace `@fontsource/space-grotesk`, which is removed from `package.json` and the lockfile). Bundled by Vite into `dist/assets`, so the packaged app loads them from `self` and nothing from a CDN. |
| `icons/instrumenta-icons.{js,css}` | `desktop/src/renderer/brand/` | `InstrumentaIcons.render('forge3d')` draws the cube in the title bar and the empty viewport. The lid lifts on hover of the wordmark and for about three seconds when a job starts; `prefers-reduced-motion` stops it (the icon CSS handles that). Imported as a module; the UMD file exports instead of setting a global once bundled. |
| `icons/svg/forge3d{,-24,-16}.svg`, `icons/png/forge3d-*.png`, `icons/ico/forge3d.ico`, `artwork/forge3d-app-art.png` | `desktop/assets/brand/` | reference set and launcher art; `instrumenta/product.json` `assets.mark` points at the app art |
| `icons/png/forge3d-512.png`, `icons/svg/forge3d.svg`, `icons/ico/forge3d.ico` | `desktop/assets/icon.{png,svg,ico}` | Windows executable icon: `build.win.icon` is now `assets/icon.ico` (16 to 256, each size drawn at that size); the PNG and SVG stay for tests and tooling |
| `icons/svg/forge3d-animated.svg` | `docs/brand/` | README only |
| `tokens.json` "forge3d" block | `desktop/src/renderer/style.css` `:root` | accent `#EE7752`, secondary `#FFBDA6` (`--accent-tint`), deep `#7D331B`, ink `#23100A`, surface `#31170F` |

`docs/images/forge3d-banner.png` (1600x500) was rendered from the brand files in headless Chromium:
surface field, accent glow at the edges, Fraunces name, the cube from `InstrumentaIcons.render`, and
the launcher's blurb.

## Roles

- Accent `#EE7752`: Run button, active tool, running stage, selection, focus ring, links. On the
  dark UI the accent as text or ring is about 6.6:1, so no separate "strong" variant is needed
  (`--accent-hot` now simply equals `--accent`). The primary buttons use the accent as a fill with
  the brand ink `#23100A` on it (about 8:1) and a deep `#7D331B` extrusion beneath; hover uses the
  tint.
- Fraunces (`"SOFT" 100, "WONK" 1`, weight 650 to 700): the Forge3D wordmark, panel titles
  (Inspector, Runs), modal titles and the empty-viewport headline. Nothing else.
- Commissioner (`"FLAR" 40`): everything operated, including the small uppercase labels, tabs,
  pills, status bar and the Run button label, which used Space Grotesk before. The `font`
  shorthand used all over `style.css` resets `font-variation-settings`, so the axes are applied
  from one custom property (`--fvs`) with `!important` on `*`; Fraunces elements override `--fvs`.
- Spline Sans Mono: key-value readouts, logs, code blocks and the status-bar clock (previously
  Cascadia).

## Kept, and why

- The 3D viewport: scene colours, grid, materials, shading modes, wireframe orange
  (`0xe2571c` in `main.js`), the splat renderer, the empty-viewport blue-grey grid and glow. Content.
- Neutral graphite and blue-black ramps for surfaces. The brand `surface` (`#31170F`, a deep
  brown) would tint every panel floating over the viewport, so it is used only in the banner.
  Dark only: Forge3D has no light theme.
- Success green, warning amber and danger red.
- The window `backgroundColor` and title-bar overlay colours in `main.cjs` (they match the neutral
  UI bar).

## Verification

- `npm --prefix desktop test` (43 pass), `uv run --with pytest pytest -q` (38 pass, 4 skipped),
  `vite build` succeeds.
- The renderer was screenshotted in Chromium before and after (harness: build, serve, mock
  `window.forge3d`), empty, running, settings popover and keyboard focus. Computed styles confirm
  the three faces and the `FLAR`/`SOFT`/`WONK` axes apply.

## Not verified / follow-ups

- The Windows package (`electron-builder` with the ICO, `Forge3D.exe` icon, the managed bundle and
  `--instrumenta-launch-check`) was not built here; the change is confined to the renderer, the icon
  files and `build.win.icon`.
- Real Electron, the artifact preview modals, and the splat/model viewports with real artifacts
  were not seen; only the shell with mock runs.
- `docs/design-references/forge3d-ui-claude-alignment-reference.png` (in Instrumenta) still shows
  the old look.
