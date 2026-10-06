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

## Colour, themes and type

The desktop has two themes built from one set of tokens: dark (the default) on the Instrumenta family
neutrals, and a derived warm-paper light. The page follows the system until the person chooses
System, Light or Dark. The 3D viewport's scene colours are content and are not themed. Ember
`#EE7752` is for focus and the primary action; green is only success, amber only a warning, red only
failure or a destructive action.

Fraunces (soft, wonky, 650 to 700) is the wordmark, panel and modal title and stage-name face.
Commissioner with `"FLAR" 40` is the interface face, in sentence case. Spline Sans Mono is for code,
versions, sizes and IDs. All three are SIL OFL 1.1, vendored under
`desktop/src/renderer/brand/fonts/`.

## Icons

Interface icons are Forge3D's own brand-v2 set (`desktop/src/renderer/brand-icons/`): flat objects
with an ink outline and a stepped extrusion, drawn at 16, 24 and 48 tiers, with meaning hues (ember
default, green done, rose stop/failed/trash, gold alert, teal hand-offs, stone at rest). A few
motion moments (hammer on Run, anvil while building, tick pop, lid lift, shake) stop under reduced
motion. The sun, moon and monitor of the theme toggle and eight small utilities stay plain lines.
`docs/brand/README.md` has the details.

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
- Floating panels on the right for the run library and the Steps / Files / Checks / Logs
  inspector. Both collapse to vertical edge tabs so the viewport can run edge to edge.
- A production dock across the bottom: the Plan, Build, Check, Output pipeline derived from real
  run state, and a filmstrip of the run's outputs.
- One status bar for toolchain, Codex, Blender, Godot, and WSL readiness.
- Opaque objects with an ink outline and a hard extrusion, sentence-case labels, and ember
  reserved for the primary action, the active tool, and the running stage. No dashboard
  cards, numbered stages, marketing subtitle, or explanatory copy beneath every control.
