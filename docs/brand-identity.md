# Forge3D brand identity

## Brand v2 cube

Forge3D's mark is the cube from the Instrumenta brand v2 icon family: a freestanding object with
depth (flat drawing, dark ink outline, deep-shaded extrusion down and to the right), ember
`#EE7752`. It replaces the Topology Loop (the earlier "approved Logo A"), which was retired on
2026-10-06 when the whole suite moved to brand v2. See `docs/brand/README.md` for what was copied
from Instrumenta and what is deliberately kept.

The icon is drawn by `desktop/src/renderer/brand/instrumenta-icons.js`; never edit the copied
files, regenerate them in Instrumenta and copy again. The cube's lid lifts on hover and when a job
starts, and `prefers-reduced-motion` stops it.

## Colour and type

The desktop palette is cool graphite, blue-black viewport space, restrained neutral separators, and
ember `#EE7752` for focus and the primary action. Green is reserved for ready/success states and
red for failures or destructive actions.

Fraunces (soft, wonky, weight 650 to 700) is the wordmark and panel/modal title face only.
Commissioner with `"FLAR" 40` is the interface face, including the small uppercase labels that used
Space Grotesk. Spline Sans Mono is for code, versions, sizes and IDs. All three are SIL OFL 1.1,
vendored under `desktop/src/renderer/brand/fonts/`.

## Interface expression — approved UI B

Forge3D follows the **viewport-first workstation** composition captured in
the approved alignment reference
(`Instrumenta/docs/design-references/forge3d-ui-claude-alignment-reference.png`):

- One application bar holding the Forge3D wordmark, a wide prompt omnibox, Attach, run settings,
  and a single ember Run action. On Windows the native caption is hidden and the system window
  controls are drawn over the reserved inset at the right of that bar.
- A full-bleed viewport underneath it. With no output it shows a studio backdrop with a receding
  ground grid and the mark as a watermark.
- A floating viewport tool rail on the left: orbit, pan, frame, ground grid, the three shading
  modes, capture, and fullscreen.
- Floating dark panels on the right for the run library and the Steps / Files / Checks / Logs
  inspector. Both collapse to vertical edge tabs so the viewport can run edge to edge.
- A production dock across the bottom: the Plan, Build, Check, Output pipeline derived from real
  run state, and a filmstrip of the run's outputs.
- One hairline status bar for toolchain, Codex, Blender, Godot, and WSL readiness.
- Rounded but restrained corners, hairline borders, compact uppercase display labels, and copper
  orange reserved for the primary action, the active tool, and the running stage. No dashboard
  cards, numbered stages, marketing subtitle, or explanatory copy beneath every control.
