# Writing for Dimensio

Every word in Dimensio is either teaching someone Blender or getting out of their way. This guide
says how to write both. It applies to lessons, practice cards, buttons, empty states and resource
lines. It is Delineare's guide (`../Delineare/docs/rebuild/WRITING.md`) adapted for Blender, and
it is just as strict. A learner reads a lesson with Blender open beside it, and they stop reading
the moment the text stops helping.

The `humanizer` skill (`~/.claude/skills/humanizer/SKILL.md`) lists the patterns of
machine-sounding prose, ranked by how strongly they give text away. `stop-slop` is a shorter
checklist of the same habits. Run `humanizer` on every lesson draft (embedded mode). Where this
guide and a skill disagree, this guide wins.

## Who you are writing for

One person at a computer with Blender open. They may never have opened Blender, or they may have
used it for years and want to fill one gap. They want to know what to press, see what happens, and
try it. They do not want to know how the app was built, how the research was done, or how careful
we are being.

Write as a good teacher talks sitting beside them: directly, to "you", about what is on their
screen.

## The rules

1. **Steps are instructions.** Start each step with a verb: "Press `Tab` to enter Edit Mode." Not
   "The first step is to switch into Edit Mode."
2. **Show before you explain.** A step comes with its diagram, placed beside it. The rule behind a
   step comes after the learner has seen it work, in one sentence.
3. **Say the number and the key.** "Press `Ctrl+R`, then scroll to add 3 loops." "A crate under 200
   triangles." "Ten minutes." A learner can act on a number and a key. They cannot act on "a few"
   or "the loop cut tool".
4. **Name where things are.** Menu paths in full, as plain text with `>`: Add > Mesh > Cylinder. Say
   which editor and which panel: "In the Properties editor, open the Modifier tab."
5. **Checks are things you can see in Blender.** "Every face has four corners in the Statistics
   overlay." "The bevel is 2 cm wide." Never "you feel confident" or "it looks right".
6. **Name the teacher whose method it is.** "Grant Abbitt blocks out with cubes first." Credit is one
   short clause or one resource line, never a paragraph.
7. **One idea per sentence.** Aim for 8 to 20 words. Anything over 28 words gets split.
8. **Cut anything the learner cannot use right now.** History, theory beyond one sentence, and
   alternatives they will not try all go. Mention a second way to do something only when the lesson
   uses it.
9. **Introduce a lesson the way a teacher would.** One to three plain sentences saying what the
   lesson is and why it matters: "Almost every model starts as a simple shape pulled into a new one.
   In this lesson you'll learn to extrude faces and edges to build a shape out of a cube." Never
   write about how the text was made.
10. **Never reassure or praise.** No "don't worry", "great job", "it's easy", "simply", "just".
    "Just" and "simply" tell a struggling learner they are failing at something trivial.
11. **No hedging the learner has to carry.** If we are unsure a resource is free, or that a
    shortcut is right in 5.2, we check it before it ships. A lesson never shows "unverified",
    "estimate" or a licence note in running text.

## Keys, menus and names

- Keys are code spans: `Tab`, `G`, `Ctrl+R`, `Shift+A`, `Alt+M`. Mouse buttons are words: "left
  click", "right click", "scroll", "middle mouse drag". The app shows code spans as key caps.
- Write the Blender name of a thing exactly as the 5.2 interface shows it, with its capitals: Edit
  Mode, Object Mode, the Outliner, the Properties editor, the Subdivision Surface modifier.
- Shortcuts follow the default keymap with "Emulate 3 Button Mouse" off. When a laptop without a
  numpad or middle button needs another way, give it once, in the lesson that first needs it.
- When the manual and a video disagree for 5.2, the manual wins, and the lesson says what to press
  in 5.2.

## Headings and labels

The owner's rules, after Delineare's first redesign got them wrong:

- **A heading names what is there.** "Lesson 1: The interface", "Practice", "Where to start",
  "Steps", "Common mistake". Never a slogan or a line written to sound good.
- **No kicker labels.** Never a small, uppercase, mono or coloured line above a heading ("WELCOME
  TO DIMENSIO" over a headline, "CONTINUE" over a lesson name, "DRILL" over a card title). The real
  title is the heading. Anything else that matters goes in the heading ("Continue: lesson 5,
  Extrude") or in an ordinary line after it ("Drill · 15 min").
- **No marketing shapes.** No hero headline with a subhead and a picture, no row of three feature
  cards, no "how it works" triad. A screen says what it is for, then shows it.
- **No "why this comes first".** A lesson opens with its title and a short introduction, not with
  an argument for its place in the course.

## Shapes and word budgets for a lesson

| Part | Shape | Budget |
| --- | --- | --- |
| Title | The skill's name: "Extrude", "Loop cuts", "Weight painting". No colon, no brackets, no sentence. Shown as "Lesson 5: Extrude" | 1 to 5 words |
| Summary (`course.yaml`) | One plain sentence for the course page: what you learn to do | 15 words |
| Introduction | What the lesson is and why it matters, as a teacher would say it | 70 words |
| Steps | 3 to 6 numbered steps, each with a bold title. A diagram per step when one exists. Define a new word in the step that uses it ("This is called an edge loop.") | 45 words each |
| Common mistake | Optional. The most common mistake, why it happens and what to do instead | 50 words |
| Exercise (`practice.yaml`, main) | What to model, from what, how long, and what to hand in | 60 words |
| Checking your model | 3 to 5 things to look for after the model is done | 15 words each |
| Watch | One or two resources, one line each | Title, teacher, length |

Steps get 45 words rather than Delineare's 40, because a menu path takes words. A lesson's own
prose stays under 500 words. If a skill needs more, it is two lessons.

## UI copy

- Buttons are verbs: "Start", "Open in Blender", "Add your model". Not "Begin session flow".
- Sentence case everywhere. Straight quotes. No exclamation marks.
- An empty state says what to do: "No models yet. Add a .blend file after your next exercise."
- A resource line is one line: `Extrude · Blender Studio · video, 6 min · free`. Add the Blender
  version when the resource was made with a version older than 5.0:
  `Low Poly Crate · Grant Abbitt · video, 14 min · Blender 3.6 · free`.
- A measurement is a plain fact: "No n-gons (0 found)", "212 triangles". Never a mark, a grade, a
  percentage shown as a score, or praise.

## Banned outright

These are checked by `npm run lint:copy`, and a hit blocks the build.

- **Dashes.** No em dashes or en dashes in prose. Use a period, comma, colon or parentheses.
- **Contrast staging.** "not just X but Y", "it's not X, it's Y", "X isn't the problem, Y is".
- **Puffed-up words.** delve, crucial, key (as an adjective), essential, robust, journey, unlock,
  master (as a verb), elevate, seamless, vibrant, testament, landscape (meaning context), navigate
  (meaning cope with), dive into, powerful, game-changer.
- **Filler.** simply, just, easily, obviously, of course, basically, essentially, actually, really,
  "it's important to", "note that", "remember to", "don't worry", "let's".
- **Talking about the text.** "this section", "as we'll see", "below you'll find". ("In this lesson
  you'll..." is fine in an introduction.)
- **Slogans.** Anything that reads like a tagline.
- **Typography.** Curly quotes, exclamation marks, emoji.

These are flagged for a human to judge, not blocked:

- Sentences over 28 words.
- Three-item lists, which are often padding.
- Passive voice.
- A paragraph that ends on a short line restating the paragraph.

## How a lesson gets written

1. **Gather the method from its sources.** Read the Blender 5.2 manual page and watch or read the
   resources the lesson will link. Take the steps, keys, numbers and checks from them. Never invent
   a shortcut or a measurement.
2. **Draft into the template**, inside the word budgets.
3. **Run `npm run lint:copy`** in `desktop/` and fix every hit.
4. **Run the `humanizer` skill on the draft** and apply what it finds.
5. **Do the exercise in Blender 5.2.** Someone does the exercise as written, with no other help. Any
   step they had to guess at gets rewritten.
6. **The owner reads it in the app.** Nothing ships on the strength of a review in a text editor.
