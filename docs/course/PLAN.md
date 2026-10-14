# Dimensio

Dimensio teaches Blender. It is a complete Blender course with a practice library beside it, a
record of the models you make, and a workshop that builds models from a prompt with Claude Code or
Codex. It is Forge3D renamed and rebuilt: the workshop is what Forge3D was.

This file is the contract every piece of the rebuild works to. Where code and this file disagree
during the rebuild, raise it rather than guess.

## Decisions

The owner made these on 2026-10-15.

- The name is Dimensio, Latin for "a measuring" and the root of "dimension".
- Dimensio teaches Blender. You work in Blender. Dimensio teaches, sets up exercises, measures what
  you made and keeps a record of it. It has no modeller of its own.
- The course is complete: every part of Blender a 3D artist uses, with no gaps. Its examples and
  projects lean toward low-poly game assets, and the export lessons end in Godot.
- The flow and the writing follow Delineare (`../Delineare`, see its `CLAUDE.md` and
  `docs/rebuild/`). Lessons point at free teachers' videos and pages and at free example models,
  with credit, beside our own material.
- Claude Code is the default agent and Codex is an option. A native Windows Claude Code install is
  acceptable. The owner no longer has a Codex subscription.
- The course is written for Blender 5.2 LTS. This machine has 5.2.2 (Steam,
  `C:\Program Files (x86)\Steam\steamapps\common\Blender\blender.exe`).

## Places

Dimensio has the same places as Delineare, plus the Workshop.

| Delineare | Dimensio |
| --- | --- |
| Welcome | Welcome. "I'm new to Blender" opens lesson 1, "I've used Blender" opens the Course with "I already know this" on each lesson, "Model now" opens Practice |
| Home | Home: continue, a review or warm-up, a free prompt (`engine/review.ts`, `suggest()`) |
| Course, Lesson, Exercise | The same. The Exercise screen adds "Open in Blender" (a starter scene, when the exercise has one) and "Add your model" (a `.blend`) |
| Practice | The same, with the kinds listed below |
| Library | The same: teachers' resources, plus the example models |
| Sketchbook | Models: every `.blend` you added, with its renders and measurements, first and latest attempts side by side |
| (none) | Workshop: Forge3D's projects and runs, where an agent builds a model from a prompt |
| Settings, Credits | The same. Settings adds the agent (Claude Code or Codex) and the Blender path |

The tabs are Home, Course, Practice, Library, Models and Workshop. Settings and Credits are reached
from the header.

## Rules carried over from Delineare

- Every word follows `docs/course/WRITING.md`.
- Every method, number, shortcut and check in a lesson comes from a source a learner can open. That
  is usually the Blender 5.2 manual. The source is named in the lesson's `sources:` and credited in
  the text. Never invent one.
- Only link a resource someone has opened and that teaches the lesson. A YouTube video is checked
  through oEmbed before it is linked. A resource line shows the Blender version the resource was
  made with when it is older than 5.0.
- No streaks, badges, levels, scores or praise. Nothing is shown as overdue or missed. Measurements
  are shown as plain facts and pictures, and only after you have ticked your own checks.
- No AI-generated pictures in the course. Reference pictures are renders of CC0 models (Kenney,
  Quaternius, Poly Haven and the like) made by our own Blender scripts, or images under a licence
  that allows it, credited. Generated models belong to the Workshop.

## Layout

```text
content/                       the course, as files a person can read
  course.yaml                  parts and lessons in order: slug, title, summary
  lessons/NN-slug/lesson.md    one lesson
  lessons/NN-slug/practice.yaml
  lessons/NN-slug/diagrams/*.mjs
  resources/*.yaml             teachers' videos and pages
  references/*.yaml            example models and pictures, with credit and licence
  prompts.yaml                 free modelling prompts
desktop/scripts/build-content.mjs   validates content/ and writes desktop/public/content.json
desktop/src/course/            the course app (React 19, TypeScript), ported from Delineare's src/
desktop/src/renderer/          the Workshop (Forge3D's renderer)
desktop/public/reference/      example model renders and files used by exercises
blender/dimensio_check.py      measures a .blend and renders it
blender/dimensio_starter.py    builds an exercise's starter scene
blender/starters/<id>.py       one starter scene each
docs/course/                   this plan, WRITING.md, COURSE.md, AGENT-BRIEF.md, research/, sources/
```

## The lesson format

It is Delineare's format (`../Delineare/docs/rebuild/AGENT-BRIEF.md`) with these changes.

- The last section is `## Checking your model` instead of `## Checking your page`.
- Keys are written as code spans, `Ctrl+R`, `Tab`, `Shift+A`, and the app shows them as key caps.
  Menu paths are plain text with `>`: Add > Mesh > Cube.
- Practice kinds are drill, warm-up, timed, copy (model something from a reference), fix (repair a
  model you are given), project, imagination and retest.
- A practice item may name a `starter:`, the id of a script in `blender/starters/`. Dimensio runs it
  in Blender to make the exercise's starting file, then opens that file in Blender.
- `reference:` may be `{ model: <id> }`, an example model from `content/references/`, shown as its
  renders and opened in Blender on request.
- A practice item may have `measure:`, a list of measurements to run on your model after you tick
  your own checks. Each one names a metric from the report below and a limit, with a plain label:
  `{ metric: ngons, max: 0, label: "No n-gons" }`.

## Measurement

```text
blender.exe -b <model.blend> --python blender/dimensio_check.py -- --out <dir> [--reference <file>] [--views front,right,top,persp]
```

This writes `<dir>/report.json`:

```json
{
  "format": 1,
  "blender": "5.2.2",
  "file": "C:/Users/.../crate.blend",
  "units": { "system": "METRIC", "scaleLength": 1.0 },
  "objects": [
    {
      "name": "Crate", "type": "MESH",
      "verts": 8, "edges": 12, "faces": 6, "tris": 12, "quads": 6, "ngons": 0,
      "nonManifoldEdges": 0, "looseVerts": 0, "looseEdges": 0, "doubles": 0, "flippedFaces": 0,
      "scaleApplied": true, "rotationApplied": true,
      "dimensions": [1.0, 1.0, 1.0], "modifiers": ["MIRROR"], "materials": 1, "uvLayers": 1,
      "shading": "flat"
    }
  ],
  "totals": { "objects": 1, "meshes": 1, "tris": 12, "ngons": 0, "nonManifoldEdges": 0 },
  "renders": { "persp": "persp.png", "front": "front.png", "right": "right.png", "top": "top.png" },
  "silhouette": { "front": { "match": 0.91, "overlay": "front-overlay.png" } }
}
```

`silhouette` is present only with `--reference`. The overlay shows the reference outline over your
model's outline. The app shows the overlay picture and plain facts. It never shows the match figure
as a score.

Starter scenes:

```text
blender.exe -b --python blender/dimensio_starter.py -- --starter <id> --out <file.blend>
```

Dimensio then opens `<file.blend>` in Blender's normal window.

## The bridge between the app and Blender

The preload exposes `window.dimensio.course`:

- `blenderStatus()`: the Blender path, its version, and whether it's 5.2 or later.
- `pickBlend()`: a file picker for `.blend` files.
- `measure(path, { reference?, views? })`: runs the check and returns the report, with renders as
  data the course app can store.
- `makeStarter(id)`: builds a starter scene in the course folder and returns its path.
- `openInBlender(path)`: opens a file in Blender's window.
- `reveal(path)`: shows a file in Explorer.
- `courseFolder()`: where starter files and copies live (`Documents\Dimensio\Course` by default).

The Workshop keeps `window.forge3d` until the rename step.

## Agents in the Workshop

`desktop/src/lib/agents/` holds one driver per agent behind one interface: `codex.cjs` (the Codex
App Server client as it is) and `claude.cjs` (Claude Code through `claude -p` with stream-json, a
per-session MCP config and plugin directory, an allowlist and no permission prompts). Settings
chooses the agent. Claude Code is the default. Readiness asks for "an agent": ready when the chosen
one is installed and signed in. A splat made from words alone needs Codex's image generation. With
Claude Code, a splat needs an attached image.

## Branches

- `feat/dimensio`: integration. Everything merges here.
- `feat/agents`: the driver interface, Claude Code, and the project fixes.
- `feat/course-app`: the course app and the content pipeline.
- `feat/measure`: measurement and starter scenes in Blender.
- In Instrumenta, `feat/dimensio`: the catalog entry and the brand.

The rename from Forge3D to Dimensio (IDs, folders, the Python package, the CLI and user data) is
the last step, made on `feat/dimensio` after the merges.

## Later

- An AI critique of a model, parked as Delineare's is: only when asked, after your own checks.
- Practice targets generated in the Workshop.
- Worked examples replayed step by step from a recipe.
