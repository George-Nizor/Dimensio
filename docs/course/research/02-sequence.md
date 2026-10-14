# How Blender courses are ordered, and the order Dimensio uses

> Lesson numbers in this file come from the first outline. Spin and Screw was added afterwards as
> lesson 45, so from 45 on the current number is one higher. `docs/course/COURSE.md` has the current numbers.

This file compares seven published Blender curricula, lists where beginners get stuck, and explains
the order of `COURSE.md` with its prerequisites.

**How this was checked.** A research pass on 2026-10-15 opened each course page. Some sites block
automated reading: cgcookie.com, Udemy and Reddit returned 403, so CG Cookie was read through
Wayback Machine snapshots from December 2025 and October 2026. Blender Stack Exchange was read
through its public API (question titles, view counts and top answers). Anything seen only in a
search snippet is marked **(snippet only)**.

---

## 1. The curricula

### Blender Studio: Blender Fundamentals 4.5 LTS

https://studio.blender.org/training/blender-fundamentals-45-lts/. Free since February 2026
(https://cgworld.jp/flashnews/01-202602-BlenderFundamentals.html); the page says it is still being
built. Blender 4.5.

1. First Steps: launching, navigation, interface, select and transform, add, duplicate and delete,
   saving, the 3D cursor, collections, workspaces.
2. Modeling: file recovery, modes, mesh selection, extrude, loop cut, knife, bevel, merge and
   separate, curves, modifiers, ending with a watering can.
3. Sculpting, with vertex painting.
4. UV Unwrapping.
5. Rigging: skeleton, weight painting, constraints, drivers.
6. 3D Animation.
7. Geometry Nodes.
8. Shading.
9. Lighting and Rendering: Cycles and EEVEE, lights, HDRI, camera, colour management.
10. Project Workflow: linking and appending, the Asset Browser, import and export.
11. Grease Pencil (no lessons yet).
12. Compositing.
13. Video Editing.

One project, the watering can, runs through every chapter. It is the only course here that puts
UVs, rigging, animation and nodes before materials.

**Taken:** file recovery taught early; import and export as a topic of its own; compositing,
Grease Pencil and video editing as short closing chapters.

### CG Cookie: Blender Basics 4.5, CORE and the learning paths

- **Blender Basics 4.5 LTS** (Paul Caggegi, free, 30 lessons), from a Wayback snapshot of 6 October
  2026:
  1. "A word about Blender Versions".
  2. Intro to 3D Space: navigation, select, transform, add and delete, the 3D cursor, orientations
     and parenting, mesh components and object origins, a quiz.
  3. Editing Objects: duplicating, pivots, snapping, proportional editing, collections, normals and
     smoothing, extrude, inset, knife, bevel, loop cut, subdivide, fill, merge, modifiers.
  4. The Blender Way: editors, files, cameras and rendering, materials and textures, lighting,
     keyframes, Grease Pencil, sculpting, a quiz.
  5. Next steps: "20 Simple Blender Modeling Projects".
  The older Basics 4.x (Jonathan Lampel) had the same chapters; a review on that page says its
  first model is an apple.
- **CORE V2 5.2 LTS**, eleven courses in order (https://superhivemarket.com/products/core-lts/docs,
  paid): Modeling, Sculpting, Lighting, Materials, Texturing (UV, painting, baking), Animation,
  Rigging, Physics, Compositing, Geometry Nodes, Grease Pencil.
- **Learning paths**: "Build Game-Ready Assets" runs high-poly, retopology, UVs, baking, and
  teaches how to diagnose bad bakes (cage, ray distance, seams).

**Taken:** a lesson about versions up front (lesson 1 says which older tutorials no longer match);
origins, orientations and normals in the first two parts; the high-poly to low-poly bake order in
part 10.

### GameDev.tv and Grant Abbitt

- **Complete Blender Creator 3** (https://gamedev.tv/courses/complete-blender-creator; "Fully
  compatible with Blender 4.3, first section updated to 4.4.2"; 102 lectures, 14 hours, paid):
  1. Intro and Setup: navigation, adding objects, rendering, material colours, lighting, simple
     houses, a lighthouse on a sculpted rock, decimate, snapping, linked duplicates, material
     slots, compositing glow. First project: the lighthouse scene.
  2. Modular Dungeon: barrel, crate, pillar, bevel, knife and bisect, materials, mirrored walls,
     door, floor modules, torch, lighting, assembly.
  3. Low-Poly Dinosaur: reference images, body, legs, face, landscape, an introduction to nodes.
  4. UV Mapping: seams and islands, barrels, a textured plane, the first animation, HDRIs.
  5. Rigging and Animation: keyframes, the Graph Editor, bones, a rig-ready mesh, IK, weight
     painting, a walk cycle.
  6. Sculpting a cartoon head.
  It added patch lectures for version changes ("Bloom in Blender 4.2", "New Sculpting workspace
  4.3").
- **Blender Pathway** (https://gamedev.tv/bundles/blender-pathway): Creator, Low Poly Characters
  (https://gamedev.tv/courses/blender-low-poly-characters: Block Man, full character with a colour
  palette and UV editing, basic rigging with Mixamo) and Low Poly Landscapes.
- **Character Creator for Video Games** ("Compatible with Blender 5",
  https://gamedev.tv/courses/blender4-character-creator): block-out, sculpt, clothing,
  retopology, detailed sculpt, unwrap and bake, texture painting, posing.
- **Grant Abbitt's free "Learn Blender 5"** series (8 parts, about 1 hour 44 minutes, November
  2025, https://www.youtube.com/playlist?list=PLn3ukorJv4vv9_e-htADGsPX9TMaQpHV8): interface and
  G, R, S with axis locks; materials, camera, lights and a first render; an old man scaled from the
  default cube; a monster; a street; lights and compositing. No UVs, rigging or animation.
- His skill-building exercises (https://www.youtube.com/playlist?list=PLn3ukorJv4vuchEeJ3a6tIAVlWZZ_5fi0)
  grade practice in five levels: a tankard, an axe, topology flow, edge loops, boolean clean-up.

**Taken:** a finished thing in the first session (the potion bottle); props then a modular kit as
the backbone of the game projects (crate, barrel, chest, then a building kit); a rig-ready mesh
before the armature; graded drills for the practice library.

### Blender Guru: the donut

- **4.0 series** (free, 14 parts, about 5 hours,
  https://www.blenderguru.com/posts/blender-4-beginner-donut-tutorial): a first render, basic
  modelling, icing (Solidify, snapping), sculpting, shading with texture painting and UVs,
  Geometry Nodes sprinkles, rendering, layout, lighting, compositing (AgX, Glare), animation
  (keyframes, Dope Sheet, Graph Editor), the final render, the Sequencer.
- **5.0 series** (8 parts, about 4 hours 20 minutes, November and December 2025,
  https://www.blenderguru.com/posts/blender-donut-v5-tutorial,
  https://www.youtube.com/playlist?list=PLjEaoINr3zgGUwGwXlj9kBe7TrVWNjkyv): navigation, Edit Mode
  and modifiers on a mug; a mug from a reference image with a section on fixing shading artifacts;
  icing with Shrinkwrap and sculpting, with an "Unstuck Yourself Guide"; a plate, a lattice, a
  first render and materials; PBR texturing; UV unwrapping and texel density; the new Scatter on
  Surface modifier in place of hand-built Geometry Nodes; lighting and rendering in EEVEE and
  Cycles. Animation and compositing were dropped. Every part ends with homework.

**Taken:** reference images before a modelled object; a lesson on shading artifacts (lessons 31
and 32); homework after every lesson (each lesson's practice file); the Scatter on Surface
modifier as the ready-made version of instancing (lesson 85).

### Imphenzia: low-poly with a palette

- **"Learn Low Poly Modeling in Blender 2.9/2.8"** (Blender 2.83, 1 hour 23 minutes, 2020,
  https://www.youtube.com/watch?v=1jHUY3qoBu8): navigation, then the UV colouring technique at
  02:12, before any modelling; Object and Edit Mode; transform, extrude, inset; a crate, a tree, a
  rock; merge by distance, fill, triangulate, recalculate normals; mirror, displace and skin
  modifiers. It ends with a "fixing problems" section: duplicate vertices, faces the wrong way,
  uneven inset.
- **Low Poly Character course** (Blender 3.5, 2 hours, 2023,
  https://www.youtube.com/watch?v=PTWV67qUX2k): a palette material and backface culling in the
  first minutes, numpad emulation, the model, the character's origin, colour by UV, an armature
  with IK, weights, actions (idle, walk), and export to Unity. Includes "Why is my color a
  gradient across the character?".
- **Crash Course: Low Poly Fantasy Props in Blender 5** (February 2026, 20 minutes,
  https://www.youtube.com/watch?v=M_cGaqzAIAc): a sign post, crates, a coin, a chest, physics, a
  barrel, a lantern with emission, baking to standard textures.

**Taken:** the palette texture as the low-poly colouring method (lesson 56); backface culling
turned on before export (lessons 31 and 35); a fixing-problems lesson (lesson 34); numpad
emulation in the first part (lesson 4); the character's origin and actions named for export
(lessons 96 and 104).

### Polygon Runway

https://polygonrunway.teachable.com: paid courses with no public outline and no Blender version.
Its "Fixing Blender Beginner Mistakes" (19 August 2025,
https://bazaar.blendernation.com/listing/fixing-blender-beginner-mistakes-polygon-runway/) lists
Object versus Edit Mode, uneven transforms, double geometry, normals and misplaced origins.

**Taken:** that list as the checks every project ends with (lesson 34 and the `measure` lists).

### The Blender manual

https://docs.blender.org/manual/en/5.2/ starts with Getting Started (installing, configuring,
help), then User Interface, Editors, Scenes and Objects, Modeling, Sculpting and Painting, Grease
Pencil, Animation and Rigging, Physics, Rendering, Compositing, Motion Tracking, Video Editing,
Files and Assets, Add-ons, Advanced and Troubleshooting. It is a reference, not a course, but its
first five sections are the order every course above opens with.

## 2. Where learners get stuck

| Problem | Evidence | What the course does |
| --- | --- | --- |
| No numpad or middle mouse button | "How to use numpad / on a keyboard without a numpad?", 153,763 views (https://blender.stackexchange.com/questions/16308); "middle mouse key alternative", 28,750 (https://blender.stackexchange.com/questions/119784) | Lesson 4, Navigating on a laptop |
| In the wrong mode | "Can't see vertices, edges or faces in Edit Mode", 114,209 views (https://blender.stackexchange.com/questions/136154); "Can't select any vertex", 23,931 (https://blender.stackexchange.com/questions/50735) | Lesson 19, and its common mistake |
| Unapplied scale | "Bevel is not symmetrical": the accepted answer blames non-uniform scale (https://blender.stackexchange.com/questions/23149); "How to set the current scale to 1?", 173,530 views (https://blender.stackexchange.com/questions/31769); "Non-Uniform Scaling during UV unwrap", 56,573 (https://blender.stackexchange.com/questions/14524) | Lesson 15 before any bevel; `scaleApplied` measured on every project |
| Flipped normals | "Why are some faces in my mesh darker?", 100,325 views (https://blender.stackexchange.com/questions/3606); "How to make all faces flip to the right direction", 229,764 (https://blender.stackexchange.com/questions/12165) | Lesson 31; `flippedFaces` measured |
| N-gons and topology | "Technical difference between an Ngon and triangles", 20,181 views (https://blender.stackexchange.com/questions/1684); "Loop-cut won't go all the way around", 35,733 (https://blender.stackexchange.com/questions/17870) | Lesson 33 |
| Remove Doubles renamed | "2.8 remove doubles has changed to Merge by Distance", 116,090 views (https://blender.stackexchange.com/questions/123185) | Lesson 25 names both |
| Origins and pivots | "Change pivot or local origin", 665,548 views (https://blender.stackexchange.com/questions/1291); "How to recenter an object's origin?", 448,016 (https://blender.stackexchange.com/questions/14294); "Mirror modifier is not working", 101,349, because it mirrors about the origin (https://blender.stackexchange.com/questions/10882) | Lessons 13 and 14 early; lesson 38 starts from the origin |
| Auto Smooth removed in 4.1 | "Where is the Auto Smooth Option in Blender 4.1+?", 31,585 views (https://blender.stackexchange.com/questions/318674); https://blenderartists.org/t/blender-4-1-auto-smooth-is-now-a-modifier-only/1488922; a GameDev.tv TA promising re-edited lectures (https://community.gamedev.tv/t/auto-smooth-in-blender-4-1/244962) | Lesson 32 teaches the 5.2 way |
| UVs that don't appear | "Why doesn't my unwrapped model appear in the UV Editor?", 111,510 views (https://blender.stackexchange.com/questions/7889) | Lesson 53; Sync Selection is on by default since 5.0 |
| Wrong scale or orientation in a game engine | Props tiny with stretched UVs in Godot (https://forum.godotengine.org/t/import-process-ignores-scales-and-uvs/109528); a huge bounding box from an off-origin object (https://forum.godotengine.org/t/noob-needs-help-huge-bounding-box/110399); a mesh lying flat while its armature stood (https://forum.godotengine.org/t/problem-with-importing-mixamo-animations-to-godot-chatgpt-cant-find-a-solution/131344) | Lessons 35 and 60; `dimensions` and `scaleApplied` measured |
| Tutorial hell | Ranked the top mistake by BlenderVitals (https://blendervitals.beehiiv.com/p/5-blender-mistakes-i-d-never-make-if-i-started-in-2026); GameDev.tv's Pathway page pitches against it; Blender Guru ships an "Unstuck Yourself Guide" | Every lesson ends in an exercise the learner does alone, with checks; copy exercises from a reference, not a video |
| Keys that changed between versions | Students on GameDev.tv listing the 4.0 sculpt and paint key changes (https://community.gamedev.tv/t/blender-4-changes/235802); the 4.0 keymap notes (https://developer.blender.org/docs/release_notes/4.0/keymap/) | Every key checked against 5.2 (`research/03-blender-5.md`) |

## 3. What the curricula agree on, and where they differ

**Agreement.** Interface and navigation, then Object Mode (select, transform, add, delete, with
origins and the 3D cursor early), then Edit Mode tools (extrude, inset, loop cut, bevel, knife,
merge), then modifiers (mirror, subdivision, bevel, solidify, array), then materials, camera,
lights and rendering, then UVs and textures, sculpting, rigging and weights, animation, and
Geometry Nodes and compositing late. Every one gets the learner to a finished render or model in
the first unit.

**Differences.**

- **Materials early or late.** Grant Abbitt and Imphenzia put colour on the first model. The donut,
  CG Cookie Basics and CORE put materials after modelling. Blender Studio puts shading eighth.
  Dimensio does both: a flat colour in lesson 9, so the first project has colour, and the full
  material part after modifiers.
- **Materials or UVs first.** Most teach materials first (the donut, Creator 3). Blender Studio
  teaches UVs first. Imphenzia uses UVs as a colouring tool from the start. Dimensio teaches
  materials (part 6), then UVs with the palette method (part 7), so the learner has a material to
  put a palette in.
- **Sculpting early or late.** Early in Blender Studio and CORE, last in Creator 3, missing from
  Grant's free series. Dimensio puts it after rendering (part 10), because a low-poly course needs
  it mainly for rocks and baking, and baking needs UVs and materials first.
- **Geometry Nodes.** Seventh in Blender Studio, mid-course in the 4.0 donut, replaced by a
  ready-made modifier in the 5.0 donut, tenth of eleven in CORE. Dimensio puts it in part 11,
  after modifiers and materials, and teaches the ready-made Scatter on Surface beside it.
- **Animation before or after rigging.** CORE animates first; Blender Studio rigs first. Dimensio
  animates objects first (part 12), then rigs and animates a character (part 13), so the learner
  meets keyframes and actions on a chest lid before bones.
- **Export to a game engine.** Almost absent: Blender Studio has one lesson, Imphenzia exports to
  Unity, and only PixPal ships a Godot project. Dimensio's main departure is here (below).

## 4. The order Dimensio uses

| Part | Lessons | Needs parts | Why it sits here |
| --- | --- | --- | --- |
| 1. Getting started | 1 to 10 | none | Install, interface, navigation (including laptops), selecting, transforming, adding, saving, a first colour. Ends with a whole object in the first session, as every curriculum does. |
| 2. Working precisely | 11 to 18 | 1 | Units, snapping, pivots, origins, applied transforms and parenting before Edit Mode, because the most-viewed beginner problems are origins and unapplied scale (section 2). |
| 3. Edit Mode | 19 to 27 | 1, 2 | The core modelling tools in the agreed order, ending with the crate. |
| 4. Clean meshes and export | 28 to 36 | 3 | More tools, then normals, shading, topology and a checking lesson, so the first export to Godot (lesson 35) goes out clean. |
| 5. Modifiers | 37 to 46 | 3, 4 | The agreed next step. Reference images come here because the sword is the first model built from one. |
| 6. Materials | 47 to 52 | 1 (lesson 9), 3 | Full materials once there are models worth colouring. |
| 7. UVs and painting | 53 to 59 | 6 | UVs need a material to show a texture in. The palette method is the low-poly payoff. |
| 8. Game assets in Godot | 60 to 66 | 4, 7 | Collision, levels of detail, Godot materials and modular kits, once the learner can model and colour props. |
| 9. Lighting and rendering | 67 to 73 | 6 | Rendering is for portfolio images; the game assets already work in Godot without it. |
| 10. Sculpting | 74 to 78 | 3, 6, 7 | Sculpting serves the low-poly rock through retopology and baking, which need UVs and materials. |
| 11. Curves and Geometry Nodes | 79 to 86 | 5, 6 | Curves first, because the fence generator follows a curve; nodes after modifiers and the Shader Editor, so node editing is familiar. |
| 12. Animation | 87 to 95 | 2, 6 | Keyframes, editors, constraints, drivers, shape keys, actions and the NLA on objects, ending with the chest lid in Godot. |
| 13. Characters | 96 to 105 | 5, 7, 12 | Modelling, rigging, weights, IK, Rigify and a walk, ending with the character in Godot. |
| 14. Physics | 106 to 113 | 12 | Simulations need the timeline and baking; the project bakes rigid bodies to keyframes for Godot. |
| 15. Grease Pencil, compositing and video | 114 to 118 | 9, 12 | Drawing and 2D animation reuse the timeline; compositing and the Sequencer finish renders. |
| 16. Files, add-ons and scripting | 119 to 126 | 1, 4 | Asset libraries, formats, extensions, preferences and Python, once there are files and exports worth organising and automating. |

**Lesson-level prerequisites** are in `COURSE.md` ("Needs"). Every "Needs" points to an earlier
lesson. The longest chain is install → interface → navigation → selecting → transform → Edit Mode
→ loop cuts → modifiers → Mirror → character modelling → armatures → skinning → posing → IK → walk
cycle → animations in Godot → an animated character. Nothing is locked; a learner can open any
lesson, as in Delineare.

**Where Dimensio departs from the consensus.**

1. **Godot at lesson 35, not at the end.** The research found no curriculum that exports to Godot
   early, and the three Godot forum threads in section 2 are all scale or orientation problems
   that a beginner meets on the first export. Exporting right after the first clean prop, and
   again at the end of every later project, makes those checks a habit.
2. **Precision before Edit Mode.** Origins and applied scale get a part of their own (part 2),
   because their Stack Exchange questions have more views than any other beginner topic found.
3. **A review lesson where Delineare has one.** Lesson 34, "Checking your model", plays the part of
   Delineare's "Checking your drawing" (lesson 7): it teaches the learner to find their own
   errors. Retests and the baseline model are practice items, not lessons, as in Delineare.
4. **Rendering after Godot.** Most courses render in the first hour. Dimensio gives a Material
   Preview in lesson 9 and leaves rendering to part 9, because a game asset's real test is the
   engine, and Godot lights the scene itself.
