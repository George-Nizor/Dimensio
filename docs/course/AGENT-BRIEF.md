# Brief for writing Dimensio lessons

You are writing lessons for Dimensio, an app that teaches Blender 5.2. The owner reads every word.
They rejected two drafts of the sister app, Delineare, for sounding like marketing copy. Plain,
clear writing is the whole job. Each lesson you hand in is finished: text, diagrams, exercise,
sources and resources, in one pass.

## Read first

- `docs/course/PLAN.md`: what Dimensio is, and the lesson format changes.
- `docs/course/WRITING.md`: the rules and word budgets. It wins over everything else here.
- `docs/course/COURSE.md`: each lesson's skill, exercise, measurements and manual pages.
- `content/lessons/001-install-blender`, `002-interface` and `003-navigation`: the standard. Match their tone, length, diagrams and practice.
- Delineare's model lesson, `../Delineare/content/lessons/01-confident-lines/`. The owner approved
  its tone.
- `docs/course/sources/videos.md` and `written.md`: resources already checked. Also
  `content/resources/catalogue.yaml` and `content/references/models.yaml`.
- `blender/starters/README.md`: how to add a starter scene.
- `~/.claude/skills/humanizer/SKILL.md` and `~/.claude/skills/stop-slop/SKILL.md`. Apply both to
  every draft before you finish.

## The lesson format

It is checked by `node desktop/scripts/build-content.mjs --check`.

```
content/lessons/NNN-slug/lesson.md     NNN is the lesson number from course.yaml in three digits (007), slug its slug
content/lessons/NNN-slug/practice.yaml the main exercise (main: true) plus one or two more
content/lessons/NNN-slug/diagrams/*.mjs one script per picture
```

`lesson.md`:

1. **Front matter:**
   - `needs`: earlier slugs only.
   - `exercise`: the id of the main practice item.
   - `watch`: one or two resource ids.
   - `sources`: where every method, key, number and check comes from, with the URL and "read
     2026-10-15". The Blender 5.2 manual is the first source for any key or menu path.
2. **`# Title`**, exactly as in `course.yaml`.
3. **The introduction:** one short paragraph, at most 70 words, as a teacher speaking to one
   student. Say what the lesson teaches and why it's useful. Then the example picture:
   `![what it shows](example)`.
4. **`## Steps`:** 3 to 6 numbered steps.
   - Each starts with a bold title ("**Select the loop.**") and has at most 45 words.
   - Each step has a diagram when a picture helps, which is normally three or more per lesson:
     `![what it shows](name)` on its own line, indented under the step.
   - Keys are code spans (`Ctrl+R`). Menu paths are plain text: Add > Mesh > Cube.
   - Define a new word in the step that uses it.
   - One short note after the list may credit the teacher whose method this is.
5. **`## Common mistake`:** the most common mistake, why it happens and what to do instead, in at
   most 50 words, with a wrong-and-right diagram pair.
6. **`## Checking your model`:** one line of introduction, then 3 to 5 things to look for (at most 15
   words each) that a learner can see in Blender, then at most one short note. A lesson whose
   exercise makes no model (installing, the interface, preferences, the Video Sequencer) calls it
   `## Checking your work` instead, as lessons 1 to 3 do.

No other sections.

`practice.yaml`: copy the shape of lessons 1 to 3.
- Kinds: drill, warm-up, timed, copy, fix, project, imagination, retest.
- Every item needs `timer`. Non-main items need one to three `check` lines.
- `reference:` is one of:
  - `{ prompt: "..." }`
  - `{ diagram: name, alt: "..." }`
  - `{ model: <id from content/references/models.yaml> }`
  - `{ images: [...] }`
  Leave it out when there's nothing to show.
- `starter: <id>` names a starter scene, when the exercise begins from a prepared file.
- `measure:` lists checks Dimensio runs on the learner's `.blend` after they've ticked their own.
  Each one is `{ metric, max | min | equals, label }`, using the metrics in PLAN.md. Use them
  wherever COURSE.md names them and they test what the lesson teaches.
- Quote any value that has a comma or colon.

## Diagrams

Each diagram is a script in `diagrams/<name>.mjs` that returns SVG. It gets the drawing kit
(`content/diagrams/lib.mjs`) as its argument and imports the mesh kit:

```js
// The cube after one extrusion: the top face moved up 1 m along its normal, still selected.
import { cube, facesWhere, extrude, view, drawMesh, arrow } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const start = cube();
  const top = facesWhere(start, (centre, normal) => normal[2] > 0.9);
  const { mesh } = extrude(start, top, 1);
  const v = view({ at: [180, 150], scale: 45 });
  return kit.svg({ width: 360, height: 260 }, drawMesh(kit, mesh, v, { select: { faces: top } }), arrow(kit, v, [0, 0, 1], [0, 0, 2]));
};
```

What the mesh kit has:
- **Meshes:** `cube`, `box` (with `segments` for loop cuts), `plane`, `cylinder`, `uvSphere` and
  `bevelledBox`.
- **Operations:** `extrude`, `inset`, `mirror`, `join`, `translate`, `scale` and `rotate`.
- **Choosing parts:** `facesWhere`, `edgesWhere` and `vertsWhere`.
- **Views:** `view` (Blender's opening view by default) and `views.front`, `views.right`,
  `views.top`.
- **Drawing:** `drawMesh` (modes solid, wire and xray, with `select` for faces, edges and verts),
  `arrow`, `axes` (in Blender's red, green and blue), `dimension` (a measurement line), `keycap`,
  and `blenderWindow` (a schematic of the Layout workspace with areas highlighted).

Read the comments in `content/diagrams/mesh.mjs`; it also has `mouse`, `numpad`, `navGizmo` and
`cursor`, and `view({ distance })` for a perspective view. Colours come from
`content/diagrams/theme.css`; use only the classes it styles. Look at lessons 1 to 3's diagrams for
how the window schematic, keys and wrong-and-right pairs are drawn. Build everything from real geometry: a loop cut
diagram shows a box that really has that loop. Keep labels short and lower case. Use only the theme
classes. Put any helper you need in your own lesson's `diagrams/` folder; don't edit `lib.mjs` or
`mesh.mjs`. Render a lesson's diagrams with
`LD_LIBRARY_PATH=/tmp/claude-1000/-workspace-dev-projects-master--PersonalProjects-Instrumenta/54c3a000-a42b-4363-95b0-474b4d41f231/scratchpad/libs/usr/lib/x86_64-linux-gnu node desktop/scripts/diagram-sheet.mjs <lesson folder>`
and open the light and dark PNGs it writes to `desktop/test-results/diagrams/` with the Read tool. Fix anything wrong, cramped or unclear. A diagram that
teaches nothing is worse than none, so cut it. Every image line needs alt text that says what the
picture shows.

## Starter scenes

When an exercise starts from a prepared file, write a starter: `blender/starters/<id>.py`, following
`blender/starters/README.md` and `navigation-letters.py` (lesson 3) as the model. Build it and look at
it in Blender 5.2 before you use it: render the views that matter, as lesson 3's letters were
checked. Only add new files. Do not edit the README's table or the integration test; list each
starter you add, with its docstring's numbers, in your report, and they will be added after.

## Example models and reference pictures

A copy exercise shows its model: `reference: { model: <id> }`, with its renders and credit coming
from `content/references/models.yaml`. Only add a model you have confirmed is CC0, listed with its
author, source and licence. Never use AI-generated pictures.

## Resources

- Add new resources to your own file, `content/resources/<your file>.yaml`. Never edit
  `catalogue.yaml` or anyone else's file. The format is in `catalogue.yaml`.
- Only add a resource you have opened and that teaches this lesson.
- For a YouTube video:
  - fetch `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json`;
  - confirm the title and channel match the lesson's subject;
  - record the id in `youtube`, the length in `minutes`, and `blender: "x.y"` if it was made before
    5.0.
  Never guess an id.
- Prefer resources already in the catalogue.

## Sources

Every method, key, menu path, number and check comes from a source you opened. Name it in `sources:`
and credit it in the text where it's a teacher's method ("Imphenzia keeps a whole model on one
palette texture"). The course sets its own exercise lengths and quantities, and those need no
source. When a video and the 5.2 manual disagree, the manual wins and the lesson says what to press
in 5.2. Check every key against the manual's page for that tool.

## Checking your work

- Run `node desktop/scripts/build-content.mjs --check` and `node desktop/scripts/lint-copy.mjs`.
  Fix everything they report in your own folders. Others are writing at the same time, so ignore
  their folders.
- Do not edit files outside your folders and your resources file. Do not run git.
- Run the `humanizer` skill on each lesson's prose and practice text, then `stop-slop`, and apply
  what they find. Then reread every heading, title and step title on its own. If one sounds like an
  advert or a slogan, rewrite it.
- Where you can, do the exercise in Blender 5.2 as written. Blender is at
  `/mnt/c/Program Files (x86)/Steam/steamapps/common/Blender/blender.exe`, and it runs headless
  from WSL with Windows paths. Rewrite any step you had to guess at.

When you finish, report:
- the lessons written;
- the diagrams per lesson;
- each resource added and how you verified it;
- any lesson where a good source or video was missing.
