# Forge3D UI, UX and brand review (October 2026)

Reviewed 2026-10-06 on branch `feat/brand-v2` (commit `0b37252`, the first brand pass), read-only.
The companion review of architecture, functionality and deployment is `architecture.md` in this folder.

The question: the owner says the aligned Forge3D still looks like the old product. Its inner icons,
backgrounds and surfaces are not in line with the new brand. This review decides what a brand-v2
Forge3D should look like and what is wrong with the prompt-to-3D flow while we are in there.

Sources read: `Instrumenta/brand/ALIGNMENT.md`, `brand/README.md`, `brand/tokens.json`, the workspace
`CLAUDE.md`, Discere (`apps/web/src/brand/*`, `styles/brand.css`, `docs/brand/README.md`,
`docs/brand/alignment-preview.html`), Imago (`web/src/brand/imago-icons.ts`, `web/src/styles.css`, its
screenshots), Ludere and LearnChess `docs/brand/README.md`, the launcher's `electron/renderer/styles.css`,
and Forge3D's `desktop/src/renderer/{main.js,style.css,run-presentation.mjs,preview-routing.mjs}`,
`desktop/src/main.cjs`, `docs/brand/README.md` and `docs/brand-identity.md`.

## Summary

The first pass changed the fonts and the accent value. It left the old look in place: the surfaces, the
icons and the effects that make it look old. The current screen is still, nearly pixel for pixel, the
Aug 2026 reference image `Instrumenta/docs/design-references/forge3d-ui-claude-alignment-reference.png`:
cool graphite and blue-black, frosted glass panels, accent glows, a blue "sky" gradient, a perspective
blue grid, tracked uppercase micro-labels and a thin 1.6px stroke icon set. Brand v2 is the opposite.
It uses opaque objects with an ink outline and a hard extrusion down and to the right, flat fills,
sentence-case Commissioner, Fraunces for moments, and full-colour freestanding icons.

What I recommend, in one line: **keep the approved composition (viewport-first, omnibox bar, tool rail,
floating panels, pipeline dock, status bar), and replace its material.** That means:

- the chrome goes onto the Forge3D surface family, the way Imago does;
- the viewport becomes a neutral "stage" in the family ink;
- panels become opaque raised objects, not glass;
- every glow and gradient goes;
- the labels are sentence case;
- the buttons get Discere's pressable depth;
- and there is a 34-glyph interface icon set drawn with the brand renderer.

A working preview of this direction is in `ui-ux-images/proposal-*.png`, next to the same scenes as
they are today (`ui-ux-images/current-*.png`). It was made by injecting `ui-ux-mock/` into the built
renderer, and it changes no product code.

Separately, the flow has real UX problems. Ranked in section 3, the top four are:

1. The prompt cannot change the selected asset. Every Run starts a new run.
2. A broken toolchain is reported only in 10px status text.
3. A failed run shows "Nothing forged yet".
4. Flat previews and the empty state ignore the panels and end up underneath them.

### Before and after (same mock data, same 1540x900 window)

| State | Today | Proposal |
| --- | --- | --- |
| First run | `ui-ux-images/current-first.png` | `ui-ux-images/proposal-first.png` |
| Model output | `ui-ux-images/current-model.png` | `ui-ux-images/proposal-model.png` |
| Running | `ui-ux-images/current-running.png` | `ui-ux-images/proposal-running.png` |
| Failed run | `ui-ux-images/current-failed.png` | `ui-ux-images/proposal-failed.png` |
| Toolchain offline | `ui-ux-images/current-offline.png` | `ui-ux-images/proposal-offline.png` |
| Text/JSON preview (bug) | `ui-ux-images/current-text.png` | — |
| Run settings | `ui-ux-images/current-settings.png` | — |

---

## 1. Inventory: where the old look survives

All references are to `desktop/src/renderer/style.css` unless another file is named.

### 1.1 Surfaces and backgrounds

| Where | What it is | Why it reads as old |
| --- | --- | --- |
| `:root` 19-35 | `--bg #0a0a0c`, `--bg-bar #0f1013`, `--panel rgba(23,24,28,.9)`, text ramp `#f1f2f5…#5f656d` | Cool blue-grey graphite. Every finished app sits on its own product surface (Imago's chrome on `#002622`, Discere navy) or on the warm family neutrals (the launcher's `#0D0C0A/#141210/#1D1A17`). None of these values come from `tokens.json`. |
| `.panel` 327-333, `.toolrail` 293-299, `.popover` 546-553, `.edge-tab` 471-479, `.preview-status` 258-264, `.text-preview` 252-257, `.toast` 581, `.scrim` 568 | `backdrop-filter: blur(...) saturate(150-160%)`, translucent fills, 8 uses | Frosted glass is the signature of the old reference image. Brand objects are opaque. Blurring over a live WebGL canvas also costs GPU time on every frame (not measured). |
| `--panel-shadow` 60, `.modal` 569 | Soft 30-110px drop shadows | The brand's depth is a hard extrusion (`3px 4px 0` in Discere). It does not use a blur. |
| `.stage::before` 236-242 | Radial **blue** sky `rgba(122,152,188,.26)`, ember floor glow, blue-black linear gradient | A cinematic backdrop with a colour cast. It sits behind the asset, which is content, so it also tints how the asset reads. |
| `.stage::after` 243-246 | 180px inset vignette | The cinematic look again. |
| `.viewport-empty::before` 270-281 | Perspective grid in **blue** `rgba(158,190,222,.2)` | Sci-fi floor. |
| `.viewport-empty::after` 282-286, `@keyframes drift` 589 | Blue light that drifts across the stage forever | Ambient motion with no meaning, which the brand's motion rule rules out. It is also the only constant motion on screen. |
| `.empty-glow` 287 | Blue radial glow | Same. |
| `.topbar::after` 160-164 | Ember gradient hairline under the bar | A glow line. |
| `main.cjs:376,386` | `titleBarOverlay.color #0f1013`, `symbolColor #9aa1aa`, `backgroundColor #0a0a0c` | The Windows caption buttons and the first paint stay graphite whatever the CSS becomes. |
| `select option` 123, `select` arrow data-URI 117, checkbox tick data-URI 127, scrollbar 87-90 | Hard-coded graphite and grey | These are left behind when the tokens change. |

The root cause is that `style.css` has **107 `rgba()` and 54 hex literals in 633 lines**: 28 of
them are the accent written out by hand (`rgba(238,119,82,…)`). Changing `:root` cannot restyle the
app, which is why the first pass could only swap the accent value.

### 1.2 Glows, gradients and sweeps (none of these exist in the brand)

- `.btn.primary` 101 and `.run-button` 220/223: an ember glow (`0 8-14px 22-30px … rgba(238,119,82,.95)`)
  on top of the extrusion. The extrusion is straight down (`0 3px 0`). The brand's is down **and to the
  right**.
- `.run-button.steering` 226-227: a **steel blue-grey gradient** (`#3d4650 → #2a3138`) with an inset highlight.
  This is the most "old product" element on screen while a job runs (`current-running.png`).
- `.topbar-progress::after` 229-231: an ember sweep across the top bar.
- `.stage-node.active .stage-fill` 501-506: an animated gradient sweep. `.stage-fill::after` 509-510 adds a
  glowing bead at the head.
- `.run-state.running` 395, `.status-item.*` 535-537, `.step-dot.running` 426, `.film-tile.selected` 522:
  coloured glows around dots and tiles.
- `.shade-dot.matte/.rendered` 305-307: little radial-gradient "rendered spheres" used as icons.
- `.run-card.selected` 385: a horizontal gradient fill.

### 1.3 Icons

- `main.js:44-86`: **37 Lucide-style line glyphs** (`stroke-width 1.6`, `currentColor`, 18px) used everywhere:
  the top bar, the tool rail, the pipeline, the run tiles, the inspector, the menus and the empty
  states. This is the "old interface icon set" the owner means. Discere replaced 30 of its glyphs
  with brand objects, and so did Imago (16). Both kept only close, chevrons and arrows as lines.
- One glyph means three things. `cube` stands for Build, a model artifact, the wireframe shading
  mode, "Open in Blender" and the empty inspector (`main.js:289, 427, 522, 595, 662`, rail 134).
  `play` stands for both Run and "Review in Godot" (`main.js:664, 953`). `sparkle` (an Imago motif) stands
  for gaussian splats (`main.js:290`).
- The brand cube in the empty viewport is drawn at **20% opacity** (`.empty-icon` 631): a muddy brown
  watermark (`current-first.png`). The brand says icons stand free in full colour. The dead rule
  `.empty-body img { opacity:.17; filter: grayscale(.3) }` (289) is the v1 watermark treatment.
- `.loading-icon` (633) is defined but never used. Loading is a text pill (`main.js:790-793, 824-827`).

### 1.4 Typography details

- **15 uppercase, letter-spaced micro-label rules**: the field labels (112), Attach (205), Run (219), New run
  (359), group headings (377), tabs (408), pills (415), section labels (420), log meta (465), edge tabs
  (475), film glyph captions (523), the status bar (533), the popover title (557) and modal eyebrows (571).
  The pipeline labels are uppercased in JavaScript as well (`main.js:535`). The launcher uses uppercase
  in two places and Imago in none. Small, tracked capitals at 9-9.5px are the heads-up-display voice
  of the old design.
- Sizes are 9-10.5px for a lot of text that people read: the status bar, run meta, step details and
  log meta.
- Contrast: `--text-4 #5f656d` is **3.0-3.2:1** on the bar and the panels. It is used for body copy
  (the empty-state paragraph at 291, `.empty-list` 402, the run meta at 392 and the stage detail
  at 511). That is below 4.5:1.
- The edge tabs use `writing-mode: vertical-rl` with uppercase text (471-481), another sci-fi
  workstation trope.
- `.empty-body h2` and `.blank-state h2` declare `font: 500 15px var(--display)` (267, 290), which is then
  patched to 650 at 626. At 15px the "moment" headline is the size of the panel titles, so there is
  no moment.

### 1.5 Buttons, tabs and inputs

- Radii are 4-10px (`--r-*` 49-52). The suite uses 10-16px: Discere's buttons 13px and cards 14px,
  Imago 10-16px, the launcher 10-14px.
- Secondary buttons (`.btn` 92-99) are a hairline over 3.5% white. There is no ink outline and no
  depth, so they read as "ghost" in any theme.
- `.new-run` 355-362 is a dashed ember box. The dashed "drop zone" style says "placeholder", not "action".
- The tabs (407-410) are a segmented control on 4% white, with a drop shadow on the active tab.
- The omnibox (172-188) is a hairline box with an ember focus halo. The `kbd` hint (129-134) is a
  tracked 10px label.

### 1.6 Empty states, loading, modals

- The empty viewport (`main.js:856-865`) has a ghost cube, a 15px headline and grey copy over a blue grid.
- The empty lists (`main.js:449, 595, 607, 617, 624, 647`) use a 26px grey line glyph and 11.5px grey text.
- Loading is a status pill in the bottom-left corner: "Loading model…", "Decoding splat 42%…"
  (`main.js:790-819, 823-853`). The brand's motion moment (the cube's lid) plays only for 3.3
  seconds when a job starts (`main.js:959-963`).
- Modals (`main.js:332-367, 968-1003`) are a graphite card with an ember tracked eyebrow, a soft shadow and
  a blurred scrim. The copy is fine, but the visual language is the old one.

### 1.7 Viewport content (decide, do not restyle blindly)

These are content. The first pass was right not to brand them, but they carry the old palette and
one of them is a correctness issue:

- `main.js:723-728`: a cool sky hemisphere `0xd7e1ea`, a **warm key `0xffb27a`** and a **blue rim `0x89b4e8`**.
  A review viewport that lights every asset orange-and-blue changes how its materials read. The pod
  in `current-model.png` is tinted salmon and lilac. I recommend neutral studio lighting (a white key
  and a neutral fill), with "cinematic" kept as an optional look if wanted. **Owner decision.**
- `main.js:728`: the grid is `0x46586a / 0x22303c`, blue-grey. Make it a neutral warm grey that matches the stage.
- `main.js:673`: the wireframe is `0xe2571c`, close to the accent but not equal to it. Either take
  `#EE7752` or keep it, but on purpose.

---

## 2. Redesign proposal

### 2.1 Principles

1. **The stage is content; everything else is an object on it.** The viewport is a neutral stage. The
   tool rail, the HUD, the panels, the film tiles and the dialogs are freestanding brand objects: opaque,
   with a 2px ink outline and a hard `3px 4px 0` extrusion. This is the icon style applied to the
   surfaces. Discere does the same with its raised answer cards.
2. **No glass, glow, gradient or ambient motion.** Depth comes only from extrusion. Motion only
   marks a meaningful moment.
3. **Keep the approved composition.** `docs/brand-identity.md` ("approved UI B") fixes the layout, and
   the owner's notes there ("no dashboard cards, numbered stages, marketing subtitle") still hold.
   This is a change of material, not of layout.

### 2.2 Surface system

Everything below is derived from `tokens.json` with `color-mix`, as Imago does (`Imago/web/src/styles.css:3-24`).

| Token | Value | Used for |
| --- | --- | --- |
| `--stage` | family `ink` `#0D0C0A` | Viewport background, input wells (omnibox, search, tabbar track, code blocks, film-tile insides). Neutral, so assets read true. |
| `--stage-sweep` | radial `#1D1A17` (family `surfaceRaised`) → `--stage` | One soft, neutral studio sweep under the asset. It replaces the blue sky, the ember floor glow and the vignette. |
| `--chrome` | `color-mix(in oklab, forge3d.surface 72%, family.surface)` ≈ `#28160f` | Top bar, dock, status bar, panels, rail, HUD, popover, menus, modals: the "Forge3D surface". |
| `--chrome-raised` / `-2` | `color-mix(--chrome 88% / 80%, white)` | Rows, selected rows, active tab, secondary buttons. |
| `--line` | `color-mix(--chrome 72%, forge3d.secondary)` | Hairlines inside panels. |
| `--object-ink` / `--object-deep` | `#120805` / `#0b0504` | The 2px outline and the extrusion of every raised object. |
| `--text` / `--muted` | family `text` `#F2EDE6` / `textMuted` `#A39A90` (6.1:1 on chrome) | No text below about 4.5:1. The current `--text-4` is retired for body copy. |
| `--accent`, `-tint`, `-deep`, `-ink` | forge3d tokens as now | As in 2.5. |
| status | done `#4FBF6C` (green 150), warn `#E0A43A` (gold 85), fail `#EF7D8C` (rose 5) | Derived at the brand's L/C so they sit with the accent. The launcher uses the same pattern. |

**What may sit over the viewport:** only opaque objects. These are the rail, the HUD chip, the panels,
the edge tabs, the preview status chip and the state cards. Nothing translucent, so no tint or blur
ever mixes into the asset. **What the viewport keeps as content:** the asset, the three.js grid, the
clear colour (transparent over `--stage`), the shading materials and the image previews. The stage
around them stays neutral.

Option B, if the owner finds the rust chrome too warm next to assets: use the launcher's family
neutrals (`#141210 / #1D1A17 / #352F29`) for the chrome and keep everything else here. That is still
on brand, and it is how LearnChess kept the board the only warm element. I recommend A because it is
what makes Forge3D look like Forge3D, in the way the teal makes Imago look like Imago. The stage stays
neutral either way, and the ink-outlined panels keep the chrome visibly separate from the content.

Also: set `main.cjs:376,386` (`titleBarOverlay.color`, `symbolColor`, `backgroundColor`) to `--chrome`,
`--muted` and `--stage`, so the Windows caption buttons and the first paint match.

### 2.3 Objects: buttons, inputs, panels

Copied from Discere (`styles/brand.css`, "Buttons: pressable depth") so the suite has one button:

- **Primary** (Run, dialog confirm): accent fill, ink `#23100A` text and 2px ink border, radius 12px,
  `box-shadow: 3px 4px 0 var(--accent-deep)`, Commissioner 750 15px in sentence case. Hover is
  `filter: brightness(1.07)`. Active is `translate(3px,4px)` with the shadow at 0, so it presses into
  its own edge. **No glow.**
- **Steer** (while a job runs) is the same button in `--accent-tint`, with the send glyph. The steel
  gradient goes. **Stop** is a raised rose icon button next to it.
- **Secondary** (Attach in a dialog, Open logs, starter prompts): `--chrome-raised` fill, 2px ink border and
  the same extrusion in `--object-deep`.
- **Danger** (Move to trash, Deny): rose fill with rose-ink text and a rose-deep extrusion.
- **Ghost** stays for Cancel and tertiary actions.
- **Panels, rail, popover, menus, modals, toasts and the HUD**: opaque `--chrome`, 2px `--object-ink` border,
  radius 14px, `3px 4px 0 --object-deep`. Panel heads keep Fraunces, larger (19px).
- **Inputs** (omnibox, search, selects, textarea): wells in `--stage` with a 2px ink border, radius 12px,
  and an accent border on focus (no halo).
- **Tabs**: a `--stage` track with the active tab on `--chrome-raised-2`, sentence case 12.5px 600.
- **Pills** (status): sentence case 11px 650 with a tinted border. Ditch the tracking.
- **Film tiles and run and artifact thumbs**: raised objects, `--stage` inside. The selected tile takes an
  accent border and an accent-deep extrusion.
- **Edge tabs**: horizontal, an icon above a short label ("Runs", "Inspect"), raised.
- **Scrim**: flat `rgba(13,12,10,.72)`, no blur.

### 2.4 Interface icon set

**Approach.** Follow Discere and Imago exactly. Add `desktop/src/renderer/brand/forge3d-icons.js`, a copy of
the brand renderer (the 48-unit grid, `f` / `f2` / `s` / `thin` / `solid` / `flat` / `dt` classes, the
three detail tiers and a stepped extrusion) with Forge3D's own glyph table. Each glyph gets a
*meaning hue*:

| Hue | Meaning |
| --- | --- |
| ember (exact forge3d tokens) | Forge3D actions and objects |
| green 150 | Done and passed, only |
| gold 85 | Warnings and checks with problems |
| rose 5 | Stop, fail and delete |
| teal 195 | Handing off to another tool: Blender, Godot, export, open |
| stone | Inactive and idle |

**Stone** is the same glyph drawn neutral. The tool rail shows inactive tools in stone and the active
tool in colour, which reads at a glance. Close, chevrons, more (…), search, fullscreen and the
select arrow stay as lines, redrawn at 2-2.2px with round caps, as Discere and Imago did. Output
must be presentation attributes only, with no `style=""`. The mock uses an inline style for size;
the real one must use classes.

A first draft of every glyph below is in `ui-ux-mock/forge-icons.js`, and is rendered in
`proposal-*.png`. Treat them as sketches to refine at 16, 24 and 48px, not as final art.

| New icon | Replaces (`main.js` glyph) | Where | Hue | Drawing (48 grid) | Motion |
| --- | --- | --- | --- | --- | --- |
| hammer | play (Run) | Run button | ember | Sledge head on a diagonal handle, with a band detail | Strikes once on press and on job start |
| send | steer | Steer button | ember | Paper plane (Imago's) | Hop |
| stop | stop | Cancel job | rose | Rounded square with an inner square (Imago's) | — |
| attach | attach | Attach | ember | Photo print with a paperclip | Hop |
| gear | settings | Run settings | ember | Discere's gear | Turns 30° on open |
| plan | clipboard, nodes | Plan stage, empty Steps | ember | Clipboard with a clip and lines | Lines type in (`m-type`) while routing |
| anvil | cube (Build) | Build stage | ember | Anvil with a horn and a stepped foot | Hammer-strike bob while building |
| shield | shield | Check stage, validation files | ember (gold with issues) | Shield with a tick (Discere's level shape) | Tick draws on pass (`m-tick`) |
| crate | output | Output stage, export | ember | Crate with a lid and an up-arrow on the front | Lid lifts when outputs land |
| done | check, checkCircle | Finished stages, readiness | green | Discere's done | Tick pops |
| alert | — | Check with issues, readiness | gold | Imago's alert | — |
| failed | — | Failed stage, failed run card | rose | Circle with a cross | One shake |
| teapot | cube (model) | Model artifacts, run tiles | ember | Utah teapot (body, lid, knob, spout, handle) | Lid lifts on hover |
| splat | sparkle | Gaussian splats | ember | Three overlapping tilted ellipses and dots | Ellipses breathe |
| render | image | Image renders | ember | Tilted photo print with a sun and hills. Not Imago's framed picture | — |
| film | film | Animations, sequences | ember | Film frame with sprocket holes | Frame advances |
| page | file, text, logs | Text, logs, reports | ember | Page with a folded corner and lines | Lines type |
| folder | folder | Reveal in Explorer | ember | Folder with a front flap | Flap opens |
| copy | copy, duplicate | Copy path, Duplicate | ember | Imago's copy | — |
| archive | archive | Archive | ember | Box with a lid and a slot | Lid drops |
| trash | trash | Move to trash | rose | Bin with a lid and ribs | Lid lifts |
| resume | resume | Resume run | ember | Discere's swap arrows | Spins once |
| open | open | Open | teal | Imago's upload (arrow out of a tray) | Hop |
| export | output (export) | Export to format | teal | Imago's export | Hop |
| blender | cube (Open in Blender) | Inspector action | teal | Generic app window with an arrow. **Do not draw the Blender logo.** | Hop |
| gamepad | play (Review in Godot) | Inspector action | teal | Game controller. **Do not draw the Godot logo.** | Hop |
| runs | (edge tab text) | Runs edge tab, library title | ember | Three stacked slabs (Discere's courses) | Top slab slides |
| inspect | (edge tab text) | Inspect edge tab | ember | Magnifier with a small cube in the lens | Lens sweeps |
| orbit | orbit | Rail: orbit | ember / stone | Sphere with a tilted ring and a moon | Moon orbits once |
| pan | hand | Rail: pan | ember / stone | Four-way arrow cross | Arrows nudge out |
| frame | frame | Rail: frame asset | ember / stone | Corner brackets around a small cube | Brackets close in |
| grid | grid | Rail: ground grid | ember / stone | Perspective floor tile with lines | — |
| clay | shade-dot.matte | Rail: clay shading | stone | Sphere with a highlight | — |
| rendered | shade-dot.rendered | Rail: rendered shading | ember | Same sphere in ember | — |
| wire | cube (wireframe) | Rail: wireframe | ember / stone | Hollow cube edges and diagonals | — |
| capture | camera | Rail: capture | ember / stone | Camera body with a lens | Shutter blink on capture |
| (line) | add, close, chevronDown, chevronLeft, more, search, fullscreen | Utilities | currentColor | Redraw at 2.2px | — |

Sizes: 24px (medium tier) in the rail, the top bar and the inspector footer; 34-44px (full tier)
in the pipeline and run tiles; 64px in state cards; 16px (small tier) inline in readiness and status
rows. Hop on hover or focus of the holding button, using Imago's `ii-hop` rule
(`Imago/web/src/styles.css:103-109`). Respect `prefers-reduced-motion`.

### 2.5 Accent use

The accent is used for:

- the Run/Steer button fill;
- the active rail tool's icon colour;
- the running stage's rail fill and detail text;
- the selected run (a 3px left bar) and the selected artifact or film tile (border and extrusion);
- the focus ring (2px solid, `--accent`);
- links.

It is never used for fills behind text (the dashed `new-run` box, `attachment-chip`, `.consent`), for
glows, or for gradients. The attachment chips become neutral raised chips with an attach icon.

### 2.6 Typography

| Face | Where |
| --- | --- |
| Fraunces 650-700, SOFT 100, WONK 1, opsz matched | The wordmark; panel titles 19px; modal titles 24px; the **pipeline stage names** (Plan, Build, Check, Output) at 17px, which act as the dock's headings; the empty/failed/offline state headline at 34px ("What shall we forge?", "The build stopped", "Codex isn't reachable"); the popover title |
| Commissioner FLAR 40 | Everything else. Sentence case, at least 11px, with labels at 12px 600 |
| Spline Sans Mono | Versions (`v1`, `Blender 4.5.3`), sizes, elapsed time (`02:41`), counts, the clock, paths, logs and JSON |

Remove `text-transform: uppercase` from all 15 rules and the `toUpperCase()` at `main.js:535`.

### 2.7 Motion moments

All are driven by the existing `ii-play`/hover mechanism, and all are stopped by reduced motion:

| Moment | Motion |
| --- | --- |
| Job starts | The Run hammer strikes once. The title-bar cube lifts its lid (exists). The Plan icon types. |
| Building | The Build anvil bobs on a slow loop, the **only** looping motion, and only while work is really happening. It replaces the gradient sweep, the head bead and the top-bar sweep. |
| Stage completes | Its icon swaps to `done` with Discere's `di-tick` pop. |
| Run finishes | The Output crate's lid lifts, the new film tile rises in (exists as `rise`), and the cube lifts once. |
| Failure | The failed icon shakes once (rose). |
| Approval needed | The modal's shield bobs. |
| Loading a model or splat | The cube's lid loops in the centre of the stage, with the mono percentage under it, instead of the corner pill. |
| Hover or focus on any icon button | Hop. |
| Removed | `drift` (589) and the infinite empty-state glow. |

---

## 3. UX problems in the prompt-to-3D flow (ranked)

1. **You cannot change the selected asset from the prompt.** The placeholder says "Describe the asset
   or change…" (`main.js:105, 965`). But `startOrSteer` always calls `api.startRun` with no run
   (`main.js:1095-1105`), so "make the legs shorter" starts an unrelated new run. Iterating needs the ⋯
   menu, then "Resume this run", then a dialog prefilled with boilerplate (`main.js:1164-1174`).
   **Fix:** when a finished run is selected, the omnibox shows a scope chip, "Changing **Medical pod**
   `v1` ×" (see `proposal-model.png`), and Run calls `continueRun` on it. The × or "New run" clears the
   scope, and the placeholder follows it ("Describe a change to the medical pod…" or "Describe a new
   asset…"). This is the core loop of a prompt-driven tool.
2. **A broken toolchain looks ready.** When Codex is unreachable, the only sign is the 10px status
   text (`main.js:371-395`). Run is still a glowing primary, and the empty state invites you to type
   (`current-offline.png`). Pressing Run then fails as a toast that vanishes. **Fix:** a state card on
   the stage ("Codex isn't reachable", the actual error in mono, **Check again**, **Open setup
   guide**, and per-tool readiness with real versions). Run is disabled, with the reason as a
   tooltip. The status-bar items become one button that opens the same readiness popover
   (`proposal-offline.png`).
3. **A failed run says "Nothing forged yet".** `renderPreview` falls back to `emptyViewport()` for any
   run without artifacts (`main.js:874-878`), so a run that died of CUDA out-of-memory tells you to
   "Describe an asset in the prompt bar" (`current-failed.png`). **Fix:** viewport states keyed on run
   status:
   - **failed**: icon, "The build stopped", `run.failure` in mono, and **Try again** (with a
     suggested cheaper setting when it is out of memory) plus **Open logs** (`proposal-failed.png`);
   - **running with no output yet**: the anvil, the current step and the elapsed time;
   - **cancelled/interrupted**: say so, with Resume;
   - **completed with no previewable file**: the existing blank-state.
4. **Flat content renders under the panels.** `.viewport-empty` and `.text-preview` are
   `position:absolute; inset:0/28px` (270, 252-257). Absolute positioning ignores the viewport's padding,
   which is the only thing `updateDockOffset` sets (`main.js:1044-1049`). So the empty state and
   JSON/log previews are centred on the whole window and run under the rail, the HUD and the panels.
   In `current-text.png` the first line `{` is hidden under the HUD and the text runs under the rail.
   **Fix:** inset those boxes by `--dock-offset` (the mock does this in one rule), or make them grid
   children of the padded viewport.
5. **3D framing ignores the panels.** Models and splats are excluded from `inset-panels`
   (`main.js:882`), and `frameObject` centres on the full canvas (`main.js:765-777`). With both panels
   open, the asset sits half behind the Runs panel (`current-model.png`). **Fix:**
   `camera.setViewOffset` with the panel-occupied width, so the optical centre is the free area,
   while the canvas still spans edge to edge.
6. **The progress is invented.** Build fills to a fixed 62% while live and 45% otherwise. Output fills
   to 60% (`main.js:500, 516`). The top-bar sweep never ends. Phases are ordered by a fixed list, not
   by time, so "Generate asset (running)" shows above "Local processing (completed)"
   (`run-presentation.mjs:1-7`, `current-running.png`). **Fix:** honest, indeterminate progress. Show
   the current activity, the elapsed time in mono (`SPAR3D inference 02:41`) and the step count. Use a
   determinate bar only where a real percentage exists (splat decode, downloads). Order phases by
   their first step's time.
7. **The status bar shows invented versions.** "Blender 4.5" and "Godot 4.4" are string literals
   whenever the tool is present (`main.js:385`). **Fix:** show the probed version, or none.
8. **Errors disappear.** Every toast is removed after 4.8s (`main.js:297-303`), including start failures,
   export failures and IPC errors. **Fix:** error toasts persist until dismissed and carry an action
   where one exists (Retry, Open logs). Success toasts can stay timed.
9. **The inspector actions are unlabeled icons.** There are up to six (`main.js:653-668`, the footer in
   `current-model.png`). "Open in Blender" was a cube and "Review in Godot" a play triangle. When no
   artifact is selected they are all disabled with no explanation. **Fix:** one labelled primary
   action for the artifact type ("Open in Blender", "Review in Godot", "Open"), "Export…" as a
   labelled secondary, and the rest in a ⋯ menu. When nothing is selected, show "Select a file".
10. **The preview hero for a mesh run is the PNG render, not the model.** `selectedArtifactForRun`
    prefers `primary-image` (`preview-routing.mjs:68-71`), so a 3D tool opens on a flat picture and the
    model is a generic tile (`current-settings.png`). **Owner decision:** I would open the model and keep
    the render as a tile labelled "Render".
11. **The most important outputs have no thumbnails, and the strip disappears.** Models and splats get a
    grey glyph tile, while images get real thumbnails (`main.js:553-555`). Below 1320px the whole
    filmstrip is hidden (`style.css:613-616`), so at common laptop widths the outputs can only be reached
    through the Files tab. **Fix:** capture a thumbnail from the viewport canvas the first time a model
    or splat loads (`preserveDrawingBuffer` is already on, `main.js:712`) and cache it per artifact. Keep a
    compact strip (3 tiles and "+n") at narrow widths.
12. **There are no versions.** The runs list is flat. "Duplicate" and "Resume" create no visible
    lineage. `versionNumber()` already parses `v001` in paths (`preview-routing.mjs`) but nothing shows it.
    **Fix:** a run carries versions. Each change from item 1 is `v2`, `v3`. Show it in the scope chip,
    the HUD and the film tiles (mono `v2`), and in the runs list as a stacked card with a count. A
    later A/B toggle in the HUD would let you compare two versions.
13. **Run settings are hidden.** Workflow, target and tool sit behind the gear (`main.js:187-200`) and
    persist silently (`preferences.mjs`). Someone who once picked "Gaussian splat" gets splats from
    every later prompt with no visible hint. The popover also covers the Runs panel
    (`current-settings.png`). **Fix:** show non-default settings as small chips under the omnibox
    ("Splat · Draft"). Clicking a chip opens the popover.
14. **The first run is cold.** The library is hidden by default (`main.js:29`). The empty state is a
    15px line of grey text, and there is no example. **Fix:** "What shall we forge?" in Fraunces, a
    sentence, and three starter prompts as raised buttons (a mesh, photo to model, a splat), as in
    `proposal-first.png`. No drag-and-drop exists for attachments (there are no `drop` listeners in
    `main.js`). Dropping a photo on the stage should attach it.
15. **The approval dialog is ambiguous.** It offers "Cancel job action", "Deny", "Approve for session"
    and "Approve once" (`main.js:994-999`), and "Cancel job action" and "Deny" read the same. **Fix:**
    "Deny", "Allow once" (primary) and "Allow for this session", with "Stop the run" as a separate
    rose link. Title it by what will happen ("Run Blender headless?").
16. **Contrast and size.** There is 3.0-3.2:1 body text (`--text-4`) and 9-9.5px labels (section 1.4).
    **Fix:** as in 2.2 and 2.6.
17. **Smaller items:**
    - the HUD prompt text overlaps the top edge of image previews (`current-settings.png`); a chip
      background fixes it;
    - `role="tab"` buttons have no `aria-selected` or `aria-controls` (`main.js:158-163`);
    - run cards are `div role=button` with a nested button (`main.js:440-447`), so keyboard users
      tab into "…" inside "card";
    - the `kbd` hint says `Ctrl ↵` but Enter alone inserts a newline, so mention it in the placeholder
      on first use.

---

## 4. Implementation plan (sized for sub-agents)

Each phase is one branch-sized task with screenshots before and after. Use the harness in
`ui-ux-mock/harness.cjs`; it needs its paths adjusted. It builds a mock `window.forge3d` bridge,
serves `/artifacts/*`, generates a GLB and shoots 16 scenes. Commit a cleaned copy of it into
`desktop/` as part of phase 0, so every later phase is checked the same way.

**Phase 0: make the sheet restylable (no visual change).**

- Replace the 161 colour literals in `style.css` with tokens: `--accent-a10/16/28/55` via
  `color-mix(in oklab, var(--accent) N%, transparent)`, and status tints the same way.
- Move the shade-dot gradients and the data-URI colours onto tokens.
- Add the screenshot harness and a `npm run shots` script.

Verify: pixel-identical screenshots. Size: about half a day.

**Phase 1: surfaces, objects and type.**

- Section 2.2 tokens, 2.3 objects and 2.6 type.
- Remove glass, glows, gradients, the vignette, the drift and uppercase.
- New radii. Window colours in `main.cjs:376,386`.
- Fix the absolute-inset bug (item 4) while you are in those rules.

Verify: all 16 scenes, focus visible on every control, `prefers-reduced-motion`, 1280x760 and
1920x1080. Size: 1 day. Risk: the `font` shorthand resets `font-variation-settings`. Keep the
`--fvs` mechanism (`style.css:75-77`) and set `--fvs` on every new Fraunces rule.

**Phase 2: the icon set.**

- Add `brand/forge3d-icons.js`: the renderer copied from Discere's `discere-icons.ts`, with the glyph
  table refined from `ui-ux-mock/forge-icons.js`.
- Add `icon(name, size, hue?)` beside `glyph()`. Switch call sites by meaning, not by the old glyph
  name (section 2.4's "Replaces" column), and keep `glyph()` for the 7 utility lines.
- Rail stone/active states. Edge tabs with icons.
- Record it in `docs/brand/README.md` as Discere did.
- Tests: every name renders at 16, 24 and 48 with no `style=` attribute (CSP), and there is no
  unknown name at any call site.

Size: 1-1.5 days, mostly drawing. Risk: glyph quality at 16px. Review a contact sheet like Discere's
`alignment-preview.html` with the owner before wiring.

**Phase 3: stage states and honest progress.**

- Items 2, 3, 6, 7 and 8, plus the loading moment (2.7).
- A `stageState(run, tools)` pure function in a new `.mjs` with unit tests, as `run-presentation.mjs`
  has. The renderer only draws it.

Size: 1 day. Risk: the shape of `run.failure` and of the step timestamps for real runs. Check against
real run directories, not only the mock.

**Phase 4: the iteration loop and versions.**

- Items 1, 12 and 13: the scope chip, Run → `continueRun` on the selected run, version labels.
- This touches IPC (`continueRun` takes `runId`, `text`, `model` and `effort` today). Agree it with the
  architecture review first, because "change" may need to be a new run that is linked to its parent
  rather than a resume of the old thread.

Size: 1-2 days.

**Phase 5: the viewport.**

- Items 5, 9, 10 and 11: view-offset framing, labelled actions, model-first hero (if the owner
  agrees), canvas thumbnails, a narrow filmstrip.
- Neutral lighting and grid (1.7), behind an owner decision.

Size: 1-1.5 days. Risk: thumbnails need `preserveDrawingBuffer` (already on) and a cache location
inside the run directory or app data. Coordinate with the run-store owner.

**Phase 6: record.**

- README screenshots in v2.
- `docs/brand/README.md` "Kept" section rewritten: graphite is no longer kept, and the brand surface is
  now used.
- A new row in `Instrumenta/brand/ALIGNMENT.md`'s review log, and a line in `docs/suite/decisions.md`
  for the departures (the chrome on the product surface over a 3D stage, and the stone hue for
  inactive tools).

**Ordering and conflict risk.** `main.js` is one 1,340-line file. Phases 2-5 all edit it, so run them in
sequence, not in parallel, unless the architecture review splits it first. Phase 1 (CSS only) can run
in parallel with drawing glyphs for phase 2.

**Other risks.**

- The rust chrome next to warm assets is an aesthetic risk. It is mitigated by the neutral stage and
  ink outlines, and option B is a single token change.
- Dropping `backdrop-filter` changes how panels feel over a moving model. It is opaque by design, and
  probably faster.
- Changing the lighting changes how every past asset looks. It needs owner sign-off.
- The owner's "approved UI B" composition must survive. Check each phase against
  `docs/brand-identity.md`.

---

## 5. What I could not verify

- **Real Electron on Windows.** All screenshots are headless Chromium (playwright-core,
  `chromium_headless_shell-1243`, SwiftShader WebGL) serving the built `desktop/dist` with a mocked
  `window.forge3d` and invented run data, so the data shapes are my guesses from `main.js`. Not
  checked: the title-bar overlay, ClearType font rendering, real IPC timing, and how often real runs
  emit events.
- **The splat path.** I did not render a splat. The GLB in the screenshots is a generated test mesh,
  and the images are the repository's reference PNGs.
- **Whether `run.failure`, step timestamps and tool versions are populated for real runs.** Items 3, 6
  and 7 assume they can be.
- **The GPU cost of `backdrop-filter` over the WebGL canvas.** It is not measured; that point is
  reasoning, not evidence.
- **The proposal mock is a sketch.** It swaps icons at runtime with a MutationObserver and overrides CSS
  with `!important`. It was not checked for keyboard focus, reduced motion, 16px icon legibility, or
  the light/dark question. Forge3D has no light theme, and I do not propose one: a 3D workstation is
  dark-first, and ALIGNMENT allows the choice.
- **The Discere comparison** is its `docs/brand/alignment-preview.html` rendered here. Imago's is its
  committed screenshots. I did not run either app live.

## Files in this review

- `ui-ux.md`: this report.
- `ui-ux-images/current-*.png`, `proposal-*.png`: screenshots, downscaled to 2/3 size.
- `ui-ux-mock/forge-icons.js`: the draft glyph table and renderer, a port of Discere's.
- `ui-ux-mock/proposal.css`: the surface/object/type overrides used for the preview.
- `ui-ux-mock/proposal.js`: the runtime icon swap and state cards (mock only).
- `ui-ux-mock/harness.cjs`: the screenshot harness. Its paths point at the reviewer's scratch folder.

None of this is wired into the app, and none of it is committed.
