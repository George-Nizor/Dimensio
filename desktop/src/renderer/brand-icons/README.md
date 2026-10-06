# Forge3D brand-v2 interface icons

Wired into the renderer through `../icons.mjs`. Spec: `docs/review-2026-10/ui-ux.md` section 2.4. Contact sheet:
`docs/review-2026-10/icon-contact-sheet.png` (regenerate with `node test-tools/icon-contact-sheet.mjs`).

```js
import { render, names } from "./brand-icons/forge-icons.mjs";
import "./brand-icons/forge-icons.css";
el.innerHTML = render("hammer", { size: 24 });             // SVG string, aria-hidden
render("wire", { size: 24, hue: "stone" });                 // inactive rail tool
render("done", { size: 16, label: "Done" });                // standalone, with an accessible name
```

Options: `size` (default 24; 16 and below uses the small tier, up to 24 medium, above full), `hue`
(ember, green, gold, rose, teal, stone; overrides the glyph's meaning hue), `label`, `tier`.
Output uses presentation attributes and classes only (no `style=`, no script), so it is CSP-safe.

Motion (CSS, all off under `prefers-reduced-motion` and `html[data-motion="reduced"]`). Put the class
on the icon or an ancestor:

| Class | Effect |
| --- | --- |
| `is-playing` | one-shot: hammer strike (Run), tick pop (`done`, `shield`), lid lift (`crate`, `teapot`, `trash`), shake (`failed`) |
| `is-working` | anvil bob loop, only while building |
| hover/focus of a `button`/`a` parent | hop |

Sizes: 24 in rail, top bar, inspector footer; 34-44 in pipeline and run tiles; 16 inline in status rows.
Utilities (`add close chevronDown chevronLeft more search fullscreen select`) are `currentColor` lines.

## Old glyph to new icon

| Name | Replaces (`main.js` glyph) | Hue |
| --- | --- | --- |
| `hammer` | `play` (Run) | ember |
| `send` | `steer` | ember |
| `stop` | `stop` | rose |
| `attach` | `attach` | ember |
| `gear` | `settings` | ember |
| `plan` | `clipboard`, `nodes` | ember |
| `anvil` | `cube` (Build stage) | ember |
| `shield` | `shield` (gold via `hue:"gold"` with issues) | ember |
| `crate` | `output` (Output stage) | ember |
| `done` | `check`, `checkCircle` | green |
| `alert` | new | gold |
| `failed` | new | rose |
| `teapot` | `cube` (model artifact) | ember |
| `splat` | `sparkle` | ember |
| `render` | `image` | ember |
| `film` | `film` | ember |
| `page` | `file`, `text`, `logs` | ember |
| `folder` | `folder` | ember |
| `copy` | `copy`, `duplicate` | ember |
| `archive` | `archive` | ember |
| `trash` | `trash` | rose |
| `resume` | `resume` | ember |
| `open` | `open` | teal |
| `export` | `output` (export action) | teal |
| `blender` | `cube` (Open in Blender) | teal |
| `gamepad` | `play` (Review in Godot) | teal |
| `runs` | edge tab text | ember |
| `inspect` | edge tab text | ember |
| `orbit` | `orbit` | ember/stone |
| `pan` | `hand` | ember/stone |
| `frame` | `frame` | ember/stone |
| `grid` | `grid` | ember/stone |
| `clay` | `shade-dot.matte` | stone |
| `rendered` | `shade-dot.rendered` | ember |
| `wire` | `cube` (wireframe) | ember/stone |
| `capture` | `camera` | ember/stone |
| `add` | `add` | line |
| `close` | `close` | line |
| `chevronDown` | `chevronDown` | line |
| `chevronLeft` | `chevronLeft` | line |
| `more` | `more` | line |
| `search` | `search` | line |
| `fullscreen` | `fullscreen` | line |
| `select` | new (select arrow) | line |

Not covered: `moon`, `sun`, `monitor` (theme toggle) and `sparkle` uses other than splats stay as the
old lines until decided. Not drawn on purpose: the Blender and Godot logos.

Motion not built (specified in the review, deferred): gear turn, plan/page line typing, splat breathe,
film advance, folder flap, archive lid, resume spin, orbit moon, pan nudge, frame close-in, capture blink.
