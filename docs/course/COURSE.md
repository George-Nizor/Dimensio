# The course

126 lessons in 16 parts, from installing Blender 5.2 to a rigged, animated character walking in
Godot 4. Every part of Blender a 3D artist uses gets at least one lesson; the corners left to the
manual, and why, are in `research/01-scope.md`.

The order follows what the published Blender courses agree on (`research/02-sequence.md`):
the interface and navigation, Object Mode, Edit Mode, modifiers, materials, UVs, rendering,
sculpting, nodes, animation, rigging, then the specialist areas. It differs from them in two ways:

- **Game assets.** Most parts end with a low-poly game asset built with that
  part's skills: a potion bottle, a house block-out, a crate, a barrel, a sword, a chest, furniture,
  a building kit, a rock and a tree, a fence, an animated chest, a character, a stack of falling
  crates.
- **Godot.** The first export comes at lesson 35, right after the learner
  has a clean crate. From then on every project ends with the asset working in Godot 4, and part 8
  covers collision, levels of detail, materials and modular kits there.

Each lesson below gives:

- its number, slug, title and summary (the title and summary are in `content/course.yaml`);
- the lessons it needs;
- what it teaches, naming the tools, menus and keys;
- the main exercise: kind, minutes, what to make, the starter scene, the example model and the
  measurements Dimensio runs afterwards (metric names from `PLAN.md`, "Measurement");
- the manual pages it rests on.

Keys were checked against the Blender 5.2 manual and against the default keymap shipped with
Blender 5.2.2 (`5.2/scripts/presets/keyconfig/keymap_data/blender_default.py`). A lesson writer
still checks every key against the manual page for that tool (`WRITING.md`, "How a lesson gets
written"). Example model ids are from `content/references/models.yaml`. Starter ids are proposals
for scripts in `blender/starters/`. Triangle limits are the course's own, set at about twice the
Kenney reference model (`research/04-game-assets.md`, section 10).

Lesson numbers go past 99, so lesson folders need three digits (`001-install-blender`) if they are
to sort in order. That is a change to the `NN-slug` layout in `PLAN.md` and `AGENT-BRIEF.md`.

Not counted as lessons:

- **"I already know this"** on every lesson, as `PLAN.md` describes, instead of a placement test.
- **The baseline model**, as Delineare's baseline drawings: model the crate reference
  (`kenney-platformer-crate`) in 30 minutes, before lesson 19 for someone who has used Blender, and
  again after parts 5, 10 and 16. Models puts the attempts side by side with their measurements.
- **Retests:** each project's practice file has a retest item (the same asset from memory, days
  later). They live in Practice, not in the course list.

## Part 1. Getting started

**1. Installing Blender** (`install-blender`). Installing Blender 5.2 LTS, opening it and choosing
your first settings.
- Needs: nothing.
- Teaches:
  - Download 5.2 LTS from blender.org (installer or portable) or Steam; LTS means two years of fixes.
  - The Quick Setup on the splash screen: language, theme, keymap (Blender), Mouse Select: Left,
    Spacebar Action: Play; or importing preferences from an older version.
  - Help > Manual, Help > About (checking the version), Edit > Preferences.
  - Tutorials made with 4.x or older show some menus and keys that have moved (`research/03`).
- Exercise: drill, 10 min. Install 5.2, finish the Quick Setup, open a General file and point
  Dimensio at `blender.exe` in Settings. No starter. No example model. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/getting_started/installing/index.html,
  https://docs.blender.org/manual/en/5.2/getting_started/installing/windows.html,
  https://docs.blender.org/manual/en/5.2/getting_started/installing/steam.html,
  https://docs.blender.org/manual/en/5.2/interface/window_system/splash.html,
  https://docs.blender.org/manual/en/5.2/getting_started/configuration/defaults.html,
  https://docs.blender.org/manual/en/5.2/troubleshooting/gpu/index.html

**2. The interface** (`interface`). Finding your way around editors, workspaces, menus, toolbars and
the Properties editor.
- Needs: 1.
- Teaches:
  - Areas and editors: the editor type menu, resizing, splitting and joining areas.
  - Workspaces tabs (Layout, Modeling, Shading); the Topbar menus; the Status Bar showing what each
    mouse button does.
  - Regions: the Toolbar (`T`), the Sidebar (`N`), headers; Focus Mode (`Ctrl+Space`, renamed in 5.0).
  - The Properties editor and its tabs; menu search with `F3`.
- Exercise: drill, 15 min. Rearrange the Layout workspace: split an area, turn it into a Shader
  Editor, maximise it with Focus Mode, put it back; find five named settings with `F3`. No starter.
  Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/interface/window_system/introduction.html,
  https://docs.blender.org/manual/en/5.2/interface/window_system/areas.html,
  https://docs.blender.org/manual/en/5.2/interface/window_system/workspaces.html,
  https://docs.blender.org/manual/en/5.2/interface/window_system/regions.html,
  https://docs.blender.org/manual/en/5.2/interface/window_system/status_bar.html,
  https://docs.blender.org/manual/en/5.2/editors/properties_editor.html

**3. Viewport navigation** (`navigation`). Orbiting, panning and zooming the 3D Viewport, and
jumping to front, side and top views.
- Needs: 2.
- Teaches:
  - Orbit with middle mouse drag, pan with `Shift`+middle mouse drag, zoom with scroll or
    `Ctrl`+middle mouse drag.
  - `Numpad 1`, `Numpad 3`, `Numpad 7` for front, right and top (`Ctrl` for the opposite side);
    `Numpad 5` for perspective and orthographic.
  - Frame the selection with `Numpad .` (or Mouse Button 4, new in 5.2); `Home` to see everything.
  - The navigation gizmo: click an axis, drag to orbit; `Alt`+middle mouse drag snaps to an axis.
- Exercise: drill, 10 min. A starter scene of props with a letter painted on a hidden face of each:
  find each letter using only the views and framing keys. Starter `navigation-letters`: six Kenney
  props spread over a 20 m floor, each with one lettered face. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/navigation.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/viewpoint.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/projections.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/views.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/display/gizmo.html

**4. Navigating on a laptop** (`laptop-navigation`). Getting around the viewport with a touchpad and
no numpad or middle mouse button.
- Needs: 3.
- Teaches:
  - Preferences > Input > Emulate 3 Button Mouse (`Alt`+left drag orbits) and what it costs.
  - Emulate Numpad: the number row becomes the numpad views; Edit Mode select modes move to the
    header buttons.
  - Touchpad gestures: two fingers to orbit, `Shift` to pan, `Ctrl` to zoom, two-finger tap for
    right click (Windows, macOS, Linux with Wayland).
  - The `` ` `` View pie, the gizmo's hand and magnifier, and Fly/Walk with `Shift+`` `.
- Exercise: drill, 10 min. The same starter, done with the touchpad and number row only.
  Starter `navigation-letters`. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/editors/preferences/input.html,
  https://docs.blender.org/manual/en/5.2/getting_started/configuration/hardware.html,
  https://docs.blender.org/manual/en/5.2/editors/preferences/navigation.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/walk_fly.html

**5. Selecting objects** (`selecting`). Selecting objects by clicking, with a box or a lasso, and
choosing the active one.
- Needs: 3.
- Teaches:
  - Left click to select, `Shift`+click to add or remove; the active object (lighter outline).
  - Box select by dragging, `B` box, `C` circle, `Ctrl`+right drag lasso.
  - `A` all, `Alt+A` none, `Ctrl+I` invert; selecting in the Outliner.
  - Select > Select Grouped and Select All by Type.
- Exercise: drill, 10 min. Select set groups from a crowded scene (all barrels, every crate but one,
  the active one last). Starter `selection-yard`: 30 props of five kinds in a yard. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/editors/3dview/selecting.html,
  https://docs.blender.org/manual/en/5.2/interface/selecting.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/selecting.html

**6. Move, rotate and scale** (`transform`). Moving, rotating and scaling objects along one axis
and by exact amounts.
- Needs: 5.
- Teaches:
  - `G`, `R`, `S`; then `X`, `Y`, `Z` to lock an axis, `Shift+Z` to exclude one.
  - Typing a number while transforming; `Ctrl` for increments, `Shift` for precision; right click
    or `Esc` to cancel.
  - The Move, Rotate and Scale tools and their gizmos; the Sidebar's Item tab for exact values.
  - `Alt+G`, `Alt+R`, `Alt+S` to clear.
- Exercise: drill, 15 min. Match each cube to its wireframe target by location, rotation and scale.
  Starter `transform-targets`: eight cubes and eight wire targets at set offsets. Measure:
  `dimensions`.
- Manual: https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/move.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/rotate.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/scale.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/control/index.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/clear.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/sidebar.html

**7. Adding and duplicating** (`adding-objects`). Adding primitive shapes, adjusting them after the
fact, and duplicating and deleting them.
- Needs: 6.
- Teaches:
  - Add (`Shift+A`) > Mesh: cube, cylinder, cone, UV sphere, ico sphere, plane, torus.
  - The Adjust Last Operation panel (bottom left, or `F9`): vertices, radius, depth.
  - The 3D cursor: `Shift`+right click to place it, `Shift+C` to reset it and the view.
  - `Shift+D` duplicate, `Alt+D` linked duplicate, `X` or `Delete` to delete.
- Exercise: drill, 10 min. A row of five primitives with set sizes and vertex counts (an 8-sided
  cylinder 1 m tall, a 6-sided cone). No starter. Measure: `tris`, `dimensions`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/primitives.html,
  https://docs.blender.org/manual/en/5.2/interface/undo_redo.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/3d_cursor.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/duplicate.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/duplicate_linked.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/delete.html

**8. Saving and undo** (`saving`). Saving and recovering your work, and stepping back through the
undo history.
- Needs: 2.
- Teaches:
  - `Ctrl+S`, File > Save As, `Ctrl+O`, File > Open Recent; the `.blend1` backup.
  - File > Recover > Auto Save and Last Session.
  - `Ctrl+Z`, `Shift+Ctrl+Z`, Edit > Undo History.
  - Preferences > Save & Load: auto save interval and undo steps.
- Exercise: drill, 10 min. Save a file, change it, close Blender without saving, and get the change
  back with Recover. No starter. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/files/blend/open_save.html,
  https://docs.blender.org/manual/en/5.2/interface/undo_redo.html,
  https://docs.blender.org/manual/en/5.2/troubleshooting/recover.html,
  https://docs.blender.org/manual/en/5.2/editors/preferences/save_load.html

**9. Colour with materials** (`first-material`). Giving an object a flat colour and seeing it in
Material Preview.
- Needs: 7.
- Teaches:
  - Properties > Material tab > New; Base Color in the Principled BSDF (no "Use Nodes" since 5.0).
  - Viewport Shading: Solid, Material Preview, Rendered; the `Z` pie.
  - Reusing a material on another object from the material browse menu.
- Exercise: drill, 10 min. Give five primitives five materials, then reuse two of them. No starter.
  Measure: `materials`.
- Manual: https://docs.blender.org/manual/en/5.2/render/materials/introduction.html,
  https://docs.blender.org/manual/en/5.2/render/materials/assignment.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/display/shading.html

**10. A potion bottle** (`potion-bottle`). Building a low-poly potion bottle from primitives without
leaving Object Mode.
- Needs: 6, 7, 9.
- Teaches: putting lessons 5 to 9 together: low vertex counts in the Adjust Last Operation panel,
  scaling along one axis, stacking parts, a colour each.
- Exercise: copy, 25 min. A bottle from a cylinder body, a sphere or cone shoulder and a small
  cylinder cork. No starter. Example model: `kenney-dungeon-potion` (Kenney, 120 triangles).
  Measure: `tris` max 250, `materials`, `dimensions` (about 0.3 m tall), `silhouette` front.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/primitives.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/scale.html

## Part 2. Working precisely

**11. Units and dimensions** (`units`). Building objects to real sizes in metres and measuring them.
- Needs: 6.
- Teaches:
  - Scene Properties > Units: Metric, Unit Scale 1.0, metres (Blender's default; Godot's 1 unit is
    1 m too).
  - The Sidebar's Dimensions; typing `2m` or `50cm` into a field.
  - The Measure tool in the Toolbar.
- Exercise: drill, 10 min. A door 0.9 by 0.1 by 2.1 m, a 1 m crate and a 1.8 m person-sized box.
  No starter. Measure: `dimensions`.
- Manual: https://docs.blender.org/manual/en/5.2/scene_layout/scene/properties.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/sidebar.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/toolbar/measure.html

**12. Snapping** (`snapping`). Snapping objects and points to the grid, to each other and to
surfaces.
- Needs: 6.
- Teaches:
  - The magnet (`Shift+Tab`) and the snapping popover (`Shift+Ctrl+Tab`).
  - Snap To: Increment, Grid (replaced Absolute Grid Snap in 4.2), Vertex, Edge, Face Project,
    Face Center (5.1); Snap Base and `B` while moving to choose it.
  - Holding `Ctrl` while transforming to snap without the magnet.
  - The `Shift+S` pie: Selection to Cursor, Cursor to Selected.
- Exercise: drill, 15 min. Stack blocks edge to edge and place fence posts exactly 2 m apart.
  Starter `snapping-blocks`: loose blocks and a 10 m strip of ground. Measure: `dimensions`.
- Manual: https://docs.blender.org/manual/en/5.2/editors/3dview/controls/snapping.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/snap.html

**13. Pivot points and orientations** (`pivot-orientation`). Choosing the point objects turn around
and the axes they move along.
- Needs: 6.
- Teaches:
  - The pivot pie (`.`): Median Point, Individual Origins, 3D Cursor, Active Element, Bounding Box.
  - The orientation pie (`,`): Global, Local, Normal, View, Cursor; pressing an axis key twice for
    the other orientation.
- Exercise: drill, 10 min. Rotate twelve planks around the 3D cursor into a ring, then slide a
  tilted signboard along its own axis. Starter `pivot-planks`. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/editors/3dview/controls/pivot_point/index.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/controls/orientation.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/3d_cursor.html

**14. Origins** (`origins`). Putting an object's origin where it should pivot and stand, such as its
base.
- Needs: 13.
- Teaches:
  - What the origin is and why a game engine places and turns an object by it.
  - Object > Set Origin > Origin to Geometry, Origin to 3D Cursor, Geometry to Origin.
  - Options > Transform > Affect Only Origins.
  - Props stand on their origin; doors turn on their hinge.
- Exercise: fix, 10 min. A crate, a door and a lamp with their origins in the wrong places: put the
  crate's at its base centre, the door's on its hinge. Starter `origins-wrong`. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/scene_layout/object/origin.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/tools/tool_settings.html

**15. Applying transforms** (`apply-transforms`). Applying rotation and scale so modifiers and game
engines see true sizes.
- Needs: 14.
- Teaches:
  - `Ctrl+A` > Rotation & Scale, All Transforms; the Sidebar showing scale 1.0 afterwards.
  - Why an unapplied scale makes bevels uneven and exports the wrong size.
  - Negative scale and inside-out faces; 5.1 flips the normals back when you apply.
- Exercise: fix, 10 min. Three stretched boxes with uneven bevels: apply their scale and watch the
  bevels even out. Starter `apply-stretched`. Measure: `scaleApplied`, `flippedFaces`,
  `dimensions`.
- Manual: https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/apply.html

**16. Parenting and empties** (`parenting`). Parenting objects to each other and to empties so they
move together.
- Needs: 14.
- Teaches:
  - `Ctrl+P` > Object (Keep Transform), `Alt+P` to clear; dragging in the Outliner.
  - Add > Empty and its display types; an empty as a handle for a group of parts.
  - Child objects follow; children keep their own origins.
- Exercise: drill, 10 min. Parent a car's four wheels to its body, then the car to an empty, and
  drive it along. Starter `parent-car`: the parts of `kenney-car-sedan` loose in the scene.
  Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/parent.html,
  https://docs.blender.org/manual/en/5.2/modeling/empties.html,
  https://docs.blender.org/manual/en/5.2/editors/outliner/editing.html

**17. Collections and the Outliner** (`collections`). Naming, grouping, hiding and isolating objects
with collections and the Outliner.
- Needs: 5.
- Teaches:
  - Renaming with `F2` or a double click; new collections; `M` to move to a collection.
  - The eye (hide), the checkbox (exclude); `H`, `Alt+H`, `Shift+H`; collection number keys over the
    Outliner (moved there in 5.0).
  - Local view (`Numpad /`) to work on one object alone.
- Exercise: drill, 10 min. Rename and sort a messy scene into Props, Lights and Reference.
  Starter `messy-scene`: 30 objects named Cube.001 to Cube.030. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/editors/outliner/introduction.html,
  https://docs.blender.org/manual/en/5.2/editors/outliner/interface.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/collections/collections.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/show_hide.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/local_view.html

**18. A house block-out** (`house-blockout`). Blocking out a small house at real size with snapping
and measured dimensions.
- Needs: 11, 12, 14, 15, 17.
- Teaches: putting the part together: a footprint to size, walls 2.5 m high, a door 2.1 m high,
  pieces snapped edge to edge, origins at the base, scale applied, everything in one collection.
- Exercise: project, 30 min. A one-room house from boxes: walls, a door gap, a roof. Starter
  `house-plot`: a 6 by 6 m plot and a 1.8 m figure for scale. Example model: `kenney-suburban-house`.
  Measure: `dimensions`, `scaleApplied`, `tris`.
- Manual: https://docs.blender.org/manual/en/5.2/editors/3dview/controls/snapping.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/origin.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/apply.html

## Part 3. Edit Mode

**19. Edit Mode** (`edit-mode`). Switching to Edit Mode and moving vertices, edges and faces.
- Needs: 6.
- Teaches:
  - `Tab` between Object Mode and Edit Mode; the mode menu.
  - Vertex, edge and face select with `1`, `2`, `3` or the header buttons.
  - `G`, `R`, `S` on parts of a mesh; X-ray (`Alt+Z`) to select through.
  - Overlays > Statistics to count vertices, edges, faces and triangles.
- Exercise: drill, 10 min. Turn a cube into a wedge, a house shape and a step by moving vertices
  and edges. No starter. Measure: `tris`, `ngons`.
- Manual: https://docs.blender.org/manual/en/5.2/editors/3dview/modes.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/structure.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/introduction.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/display/overlays.html

**20. Selecting loops** (`selecting-loops`). Selecting edge loops, rings, linked parts and shortest
paths in a few clicks.
- Needs: 19.
- Teaches:
  - `Alt`+click for a loop, `Ctrl+Alt`+click for a ring; delimiters in the redo panel (5.1).
  - `Ctrl`+click for the shortest path; `L` for linked under the cursor, `Ctrl+L` for linked to
    the selection.
  - `Ctrl+Numpad +` and `Ctrl+Numpad -` to grow and shrink; `Shift+G` Select Similar.
- Exercise: drill, 10 min. Select named loops and rings on a cylinder, a torus and a sphere.
  Starter `loop-shapes`. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/loops.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/linked.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/more_less.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/similar.html

**21. Extrude** (`extrude`). Extruding faces and edges to build a shape out of a cube.
- Needs: 19.
- Teaches:
  - `E` to extrude a region along its normal; `E` then `Z` along an axis.
  - `Alt+E`: Extrude Individual Faces, Extrude Along Normals.
  - Cancelling an extrude with right click leaves doubled geometry behind.
- Exercise: drill, 15 min. A set of steps and an L-shaped wall from one cube. No starter.
  Measure: `doubles` 0, `ngons`, `tris`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/extrude_faces.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/tools/extrude_region.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/extrude_individual_faces.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/extrude_edges.html

**22. Inset** (`inset`). Insetting faces to make borders, panels and frames.
- Needs: 21.
- Teaches:
  - `I` to inset, `I` again for individual faces; Thickness and Depth in the redo panel.
  - Inset then extrude inwards for a recessed panel.
- Exercise: drill, 10 min. Panelled sides on a box and a window frame in a wall. No starter.
  Measure: `ngons` 0, `tris`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/inset_faces.html

**23. Loop cuts** (`loop-cuts`). Adding edge loops with a loop cut and sliding edges into place.
- Needs: 20.
- Teaches:
  - `Ctrl+R`, scroll for the number of cuts, click, then slide or right click to centre.
  - Edge slide with `G` `G`; Even (`E`) and Flip (`F`) while sliding.
  - The Loop Cut tool in the Toolbar.
- Exercise: drill, 10 min. Cut a box into three planks per side with even gaps. No starter.
  Measure: `ngons` 0.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/loopcut_slide.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/tools/loop.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/edge_slide.html

**24. Bevel** (`bevel`). Bevelling edges to round off corners and catch the light.
- Needs: 20, 15.
- Teaches:
  - `Ctrl+B` on edges, scroll for segments; `Shift+Ctrl+B` on vertices.
  - Width, Segments, Clamp Overlap and Profile in the redo panel.
  - One segment for a low-poly chamfer; why unapplied scale makes it uneven.
- Exercise: drill, 10 min. Chamfer the edges of a 1 m crate by 2 cm with one segment. No starter.
  Measure: `scaleApplied`, `ngons`, `tris`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/bevel.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/vertex/bevel_vertices.html

**25. Delete, dissolve and merge** (`delete-merge`). Removing and combining vertices, edges and
faces without leaving holes.
- Needs: 19.
- Teaches:
  - The `X` menu: Delete Vertices, Edges, Faces, Only Faces; Dissolve and Limited Dissolve;
    `Ctrl+X` to dissolve.
  - `M`: At Center, At Cursor, Collapse, By Distance (the old Remove Doubles; Centroid since 5.0).
  - Auto Merge Vertices in the tool settings; the Weld modifier does the same merge without
    changing the mesh.
- Exercise: fix, 10 min. A mesh with stray loops and doubled vertices, cleaned to a given face
  count. Starter `cleanup-mess`. Measure: `doubles` 0, `looseVerts` 0, `ngons`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/delete.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/merge.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/tools/tool_settings.html

**26. Filling faces** (`filling-faces`). Closing holes and joining edges with new faces, grid fill
and bridge.
- Needs: 25.
- Teaches:
  - `F` to make an edge or face; `J` to connect a vertex path.
  - `Alt+F` Fill and Face > Grid Fill.
  - Edge > Bridge Edge Loops to join two openings.
- Exercise: fix, 10 min. Close the holes in a box missing a side and join two pipe ends.
  Starter `holes-to-fill`. Measure: `nonManifoldEdges` 0, `ngons`, `tris`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/vertex/make_face_edge.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/fill.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/grid_fill.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/bridge_edge_loops.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/vertex/connect_vertex_path.html

**27. A low-poly crate** (`crate`). Modelling a wooden crate under 300 triangles with insets,
extrusions and bevels.
- Needs: 21, 22, 23, 24.
- Teaches: a 1 m cube, scale applied, inset and extruded panels, a chamfer, a diagonal brace, one
  material.
- Exercise: copy, 30 min. Copy the reference crate. No starter. Example model:
  `kenney-platformer-crate` (Kenney, 156 triangles). Measure: `tris` max 300, `ngons`,
  `nonManifoldEdges` 0, `doubles` 0, `scaleApplied`, `dimensions` (1 m cube), `silhouette` front.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/inset_faces.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/extrude_faces.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/bevel.html

## Part 4. Clean meshes and export

**28. The knife tool** (`knife`). Cutting new edges across faces exactly where you want them.
- Needs: 19.
- Teaches:
  - `K`, click to cut, `Enter` to confirm; `C` to constrain angles, `Z` to cut through.
  - Knife Project from another object's outline.
  - Mesh > Bisect to slice straight across.
- Exercise: drill, 10 min. Cut a door outline and a diagonal crack into a wall. No starter.
  Measure: `ngons`, `looseVerts` 0.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/knife_topology_tool.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/knife_project.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/bisect.html

**29. Proportional editing** (`proportional-editing`). Moving part of a mesh and letting the area
around it follow smoothly.
- Needs: 19.
- Teaches:
  - `O` to toggle, scroll to change the radius while moving.
  - Falloff types from the `Shift+O` pie; Connected Only.
  - Uses: a bulging barrel, lumpy rocks, hills.
- Exercise: drill, 10 min. Raise a hill and dig a pond in a subdivided plane. Starter
  `grid-ground`: a 20 m plane with 40 cuts. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/editors/3dview/controls/proportional_editing.html

**30. Separate and join** (`separate-join`). Splitting parts of a mesh into objects and joining
objects into one.
- Needs: 19.
- Teaches:
  - `P` > Selection, By Material, By Loose Parts; `Y` to split; `Shift+D` in Edit Mode.
  - `Ctrl+J` to join objects (the active object keeps its name and origin).
  - One object per prop keeps a game scene simple.
- Exercise: drill, 10 min. Separate a lamp into its parts, then join a set of rocks into one.
  Starter `separate-lamp`. Measure: `materials`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/separate.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/split.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/join.html

**31. Normals** (`normals`). Finding faces that point the wrong way and turning them outwards.
- Needs: 19.
- Teaches:
  - Overlays > Face Orientation: blue outside, red inside.
  - `Shift+N` Recalculate Outside, `Alt+N` > Flip.
  - Viewport Shading > Backface Culling, and the material's Backface Culling, to see what Godot
    will show.
- Exercise: fix, 10 min. A barrel and a crate with flipped faces, fixed until no red shows.
  Starter `flipped-faces`. Measure: `flippedFaces` 0.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/normals.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/display/overlays.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/display/shading.html,
  https://docs.blender.org/manual/en/5.2/render/materials/settings.html

**32. Flat and smooth shading** (`shading`). Choosing flat, smooth or auto smooth shading and
marking sharp edges.
- Needs: 31.
- Teaches:
  - Object > Shade Flat, Shade Smooth, Shade Auto Smooth (adds a Smooth by Angle modifier; the
    Auto Smooth checkbox went in 4.1).
  - Edge > Mark Sharp and Set Sharpness by Angle.
  - Low-poly props are usually flat; a modifier only reaches Godot if Apply Modifiers is on.
- Exercise: drill, 10 min. Shade a barrel smooth on its sides and sharp on its rims, two ways.
  Starter `shading-barrel`. Measure: `shading`, `modifiers`.
- Manual: https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/shading.html,
  https://docs.blender.org/manual/en/5.2/modeling/modifiers/normals/smooth_by_angle.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/edge_data.html

**33. Quads, triangles and n-gons** (`topology`). Telling quads, triangles and n-gons apart and
knowing which a model needs.
- Needs: 19.
- Teaches:
  - Select > Select All by Trait > Faces by Sides to find n-gons.
  - `Ctrl+T` Triangulate and `Alt+J` Tris to Quads.
  - Game engines draw triangles; quads matter for loop cuts, subdivision and bending.
- Exercise: fix, 10 min. Rebuild the n-gons on a model's curved parts into quads, leaving flat
  ones. Starter `ngon-lamp`. Measure: `ngons`, `tris`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/structure.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/all_by_trait.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/triangulate_faces.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/triangles_quads.html

**34. Checking your model** (`checking-model`). Finding doubled vertices, loose parts, holes and
flipped faces before a model is done. This is the course's review lesson, as Delineare's
"Checking your drawing" is.
- Needs: 25, 31, 33.
- Teaches:
  - Select All by Trait: Non Manifold, Loose Geometry, Interior Faces.
  - Mesh > Clean Up: Merge by Distance, Delete Loose, Degenerate Dissolve, Fill Holes.
  - Overlays > Statistics and Mesh Analysis.
  - Dimensio's own measurements as the last check.
- Exercise: fix, 15 min. A crate with every common fault planted in it. Starter `broken-crate`.
  Measure: `nonManifoldEdges` 0, `looseVerts` 0, `doubles` 0, `flippedFaces` 0, `ngons`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/all_by_trait.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/cleanup.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/mesh_analysis.html

**35. Exporting to Godot** (`first-export`). Exporting a model as a .glb file and placing it in a
Godot 4 scene.
- Needs: 15, 27, 34.
- Teaches:
  - Before export: origin at the base, front facing -Y, scale applied, Backface Culling on.
  - File > Export > glTF 2.0: glTF Binary, Include > Selected Objects, Mesh > Apply Modifiers (off by
    default), +Y Up.
  - In Godot 4: drop the .glb into the FileSystem dock, drag it into a 3D scene, check it is 1 m.
- Exercise: project, 20 min. Export your crate and place three of it in a Godot scene. No starter.
  Measure: `scaleApplied`, `dimensions`, `flippedFaces` 0.
- Manual: https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html,
  https://docs.blender.org/manual/en/5.2/files/import_export/index.html
- Godot: https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/model_export_considerations.html,
  https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/available_formats.html

**36. A low-poly barrel** (`barrel`). Modelling a barrel from a 12-sided cylinder and opening it in
Godot.
- Needs: 23, 29, 32, 35.
- Teaches: a 12-sided cylinder, loop cuts scaled into a bulge, inset and extruded metal bands,
  shaded flat or by angle, checked and exported.
- Exercise: copy, 30 min. Copy the reference barrel and place it beside your crate in Godot. No
  starter. Example model: `kenney-pirate-barrel` (Kenney, 148 triangles). Measure: `tris` max 300,
  `ngons`, `nonManifoldEdges` 0, `flippedFaces` 0, `shading`, `scaleApplied`, `dimensions`,
  `silhouette` front.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/primitives.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/loopcut_slide.html,
  https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html

## Part 5. Modifiers

**37. Modifiers** (`modifiers`). Adding, ordering, hiding and applying modifiers without changing
the mesh underneath.
- Needs: 19.
- Teaches:
  - Properties > Modifier tab > Add Modifier: Edit, Generate, Deform, Normals, Physics, and node
    based ones from the Essentials library.
  - Order matters; the viewport, render and Edit Mode toggles; Apply (`Ctrl+A` over the panel).
  - The stack is not exported unless applied or Apply Modifiers is on.
- Exercise: drill, 10 min. Stack three modifiers on a cube, reorder them, compare, apply one.
  No starter. Measure: `modifiers`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/modifiers/introduction.html,
  https://docs.blender.org/manual/en/5.2/modeling/modifiers/common_options.html

**38. The Mirror modifier** (`mirror`). Modelling one half of a shape and letting the Mirror
modifier make the other.
- Needs: 37, 14.
- Teaches:
  - Delete half the mesh; Mirror on X about the origin; Clipping and Merge.
  - Mirror Object for mirroring about another point; Bisect.
  - Mesh > Symmetrize to make a mesh symmetric without the modifier.
- Exercise: drill, 15 min. Half a shield shape mirrored into a whole one. No starter.
  Measure: `modifiers`, `nonManifoldEdges` 0.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/mirror.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/symmetrize.html

**39. The Bevel modifier** (`bevel-modifier`). Bevelling every hard edge at once with the Bevel
modifier and an angle limit.
- Needs: 37, 24.
- Teaches: Amount, Segments, Limit Method Angle and Weight, Clamp Overlap, Harden Normals; why
  scale must be applied first.
- Exercise: drill, 10 min. Bevel a table top and its legs at 1 cm with an angle limit. No starter.
  Measure: `scaleApplied`, `modifiers`, `tris`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/bevel.html

**40. Subdivision Surface** (`subdivision`). Smoothing a mesh with the Subdivision Surface modifier
and holding edges sharp.
- Needs: 37, 23.
- Teaches:
  - `Ctrl+1` to `Ctrl+3` to add it; Levels Viewport and Render.
  - Support loops and edge crease (`Shift+E`) to keep edges sharp.
  - In games it makes a high-poly source for baking, not the final mesh.
- Exercise: drill, 15 min. A rounded cushion and a sharp-edged box from the same cube. No starter.
  Measure: `modifiers`, `tris`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/subdivision_surface.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/edge_data.html

**41. Solidify** (`solidify`). Giving thin surfaces such as cloth, leaves and walls a real
thickness.
- Needs: 37.
- Teaches: Thickness, Offset, Even Thickness, Fill Rim; normals decide which side grows.
- Exercise: drill, 10 min. A banner, a bowl and a wall from planes. No starter.
  Measure: `nonManifoldEdges` 0, `modifiers`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/solidify.html

**42. Array** (`array`). Repeating an object in a line or a circle with the Array modifier.
- Needs: 37.
- Teaches:
  - Add Modifier > Generate > Array is the node-based Array (5.0): Shape Line, Circle, Curve or
    Transform; Count; Offset Method; Merge.
  - Array (Legacy) for relative offset and start and end caps.
  - Both export as real geometry once applied or with Apply Modifiers on.
- Exercise: drill, 15 min. A fence of ten planks and a ring of twelve stones. No starter.
  Measure: `modifiers`, `tris`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/array.html,
  https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/array_legacy.html

**43. Boolean** (`boolean`). Cutting holes and joining shapes with the Boolean modifier, then
tidying the result.
- Needs: 37, 33.
- Teaches:
  - Difference, Union, Intersect; solvers Float (called Fast before 5.0), Exact and Manifold.
  - Showing the cutter as Wire or Bounds and hiding it.
  - Applying, then cleaning up the n-gons the cut leaves.
- Exercise: drill, 15 min. A window cut through a wall and a keyhole through a lock. No starter.
  Measure: `nonManifoldEdges` 0, `ngons`, `modifiers`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/booleans.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/intersect_boolean.html

**44. Deform modifiers** (`deform-modifiers`). Bending, twisting and reshaping a mesh with Simple
Deform, Lattice and Curve.
- Needs: 37, 23.
- Teaches:
  - Simple Deform: Twist, Bend, Taper, Stretch, with an empty as the axis.
  - Lattice: Add > Lattice (Lattice Deform Selected since 5.0) and editing its points.
  - Curve: bending a mesh along a curve.
- Exercise: drill, 15 min. A twisted column, a bent sign and a sagging rope bridge plank row.
  No starter. Measure: `modifiers`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/modifiers/deform/simple_deform.html,
  https://docs.blender.org/manual/en/5.2/modeling/modifiers/deform/lattice.html,
  https://docs.blender.org/manual/en/5.2/modeling/modifiers/deform/curve.html,
  https://docs.blender.org/manual/en/5.2/animation/lattice.html

**45. Spin and Screw** (`spin-screw`). Turning a profile into a round shape with the Spin tool and
the Screw modifier.
- Needs: 37, 21.
- Teaches:
  - Drawing half a profile as a line of vertices in the front view, extruding vertex by vertex.
  - The Spin tool in Edit Mode: steps, angle, axis and centre, and merging the seam where the ends meet.
  - The Screw modifier: the same lathe kept editable, with Steps, Render Steps, Merge and Axis, and
    Screw (offset) for springs and threads.
  - Choosing a low step count (8 to 12) so a round low-poly prop stays inside its triangle budget.
- Exercise: drill, 15 min. A goblet from a profile with the Screw modifier at 12 steps, then a spring
  from a small circle with a Screw offset. Starter `empty-scene`. Measure: `nonManifoldEdges` max 0
  and `doubles` max 0 on the goblet once the modifier is applied.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/tools/spin.html,
  https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/screw.html

**46. Reference images** (`reference-images`). Setting up front and side reference pictures to
model from.
- Needs: 3, 16.
- Teaches:
  - Dragging an image into an orthographic view, or Add > Image > Reference and Background.
  - The image empty's Opacity, Depth and "Only Axis Aligned" settings.
  - Add > Image > Mesh Plane for an image on a real plane.
- Exercise: drill, 10 min. Set up front and side references for a sword and line them up.
  Starter `sword-sheet`: a front and side sheet rendered from `kenney-dungeon-sword`.
  Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/empties.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/import_images_as_planes.html

**47. A low-poly sword** (`sword`). Modelling a sword from reference with the Mirror, Bevel and
Solidify modifiers.
- Needs: 38, 39, 41, 46.
- Teaches: a blade, guard and grip from reference, built in half with Mirror, a bevel on the edge,
  modifiers applied before export, exported to Godot.
- Exercise: copy, 35 min. Starter `sword-sheet`. Example model: `kenney-dungeon-sword` (Kenney,
  80 triangles). Measure: `tris` max 200, `ngons`, `nonManifoldEdges` 0, `modifiers`,
  `scaleApplied`, `dimensions` (about 1 m), `silhouette` front.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/mirror.html,
  https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/bevel.html,
  https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/solidify.html,
  https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html

## Part 6. Materials

**48. The Principled BSDF** (`principled-bsdf`). Setting a material's colour, roughness, metallic,
emission and transparency.
- Needs: 9.
- Teaches:
  - Base Color, Roughness, Metallic, Emission Color and Strength, Alpha.
  - Material > Settings > Render Method: Dithered or Blended (replaced Blend Mode in 4.2).
  - What glTF carries to Godot: base colour, metallic, roughness, emission, alpha.
- Exercise: drill, 15 min. Six spheres: painted wood, rough stone, gold, glowing crystal, glass,
  rubber. Starter `material-spheres`. Measure: `materials`.
- Manual: https://docs.blender.org/manual/en/5.2/render/shader_nodes/shader/principled.html,
  https://docs.blender.org/manual/en/5.2/render/materials/settings.html,
  https://docs.blender.org/manual/en/5.2/render/eevee/material_settings.html

**49. Material slots** (`material-slots`). Giving different faces of one object different
materials.
- Needs: 48, 19.
- Teaches: + to add a slot, Assign, Select and Deselect in Edit Mode; `Ctrl+L` > Link Materials;
  few materials per prop.
- Exercise: drill, 10 min. A house block with walls, roof and door in three slots. No starter.
  Measure: `materials` max 3.
- Manual: https://docs.blender.org/manual/en/5.2/render/materials/assignment.html

**50. The Shader Editor** (`shader-editor`). Building a material from connected nodes in the Shader
Editor.
- Needs: 48.
- Teaches:
  - The Shading workspace; `Shift+A` to add nodes; dragging links; `Ctrl`+right drag to cut.
  - `M` to mute, `Ctrl+G` to group; Mix and Color Ramp nodes.
  - Node Wrangler (bundled): `Ctrl+Shift`+click to preview a node.
- Exercise: drill, 15 min. A two-colour material mixed by a gradient. No starter.
  Measure: `materials`.
- Manual: https://docs.blender.org/manual/en/5.2/editors/shader_editor.html,
  https://docs.blender.org/manual/en/5.2/interface/controls/nodes/parts.html,
  https://docs.blender.org/manual/en/5.2/interface/controls/nodes/editing.html,
  https://docs.blender.org/manual/en/5.2/addons/node_wrangler.html

**51. Image textures** (`image-textures`). Putting an image on a material and choosing its colour
space.
- Needs: 50.
- Teaches:
  - Image Texture node, Open; sRGB for colour, Non-Color for roughness and normal maps.
  - Normal Map node; Interpolation Closest for pixel and palette images.
  - File > External Data > Pack Resources.
- Exercise: drill, 15 min. A wall with a colour, roughness and normal map from a CC0 texture set.
  Starter `textured-wall` with the images beside it. Measure: `materials`, `uvLayers`.
- Manual: https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/image.html,
  https://docs.blender.org/manual/en/5.2/render/shader_nodes/displacement/normal_map.html,
  https://docs.blender.org/manual/en/5.2/render/color_management/color_spaces.html,
  https://docs.blender.org/manual/en/5.2/files/blend/packed_data.html

**52. Procedural textures** (`procedural-textures`). Making noise, wood grain and brick patterns
from texture nodes.
- Needs: 50.
- Teaches:
  - Noise, Voronoi, Wave, Brick and Gradient textures; Texture Coordinate and Mapping.
  - Color Ramp to pick the colours.
  - Procedural materials don't export to glTF; lesson 78 bakes them.
- Exercise: drill, 15 min. Wood planks and a stone floor without an image. No starter.
  Measure: `materials`.
- Manual: https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/noise.html,
  https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/voronoi.html,
  https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/wave.html,
  https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/brick.html,
  https://docs.blender.org/manual/en/5.2/render/shader_nodes/input/texture_coordinate.html,
  https://docs.blender.org/manual/en/5.2/render/shader_nodes/utilities/vector/mapping.html,
  https://docs.blender.org/manual/en/5.2/render/shader_nodes/color/color_ramp.html

**53. A low-poly chest** (`chest`). Modelling a treasure chest and colouring it with material
slots.
- Needs: 27, 38, 49.
- Teaches: a box body and a separate lid with its origin on the hinge, metal bands and a lock,
  coloured with three or four material slots, exported to Godot.
- Exercise: copy, 40 min. No starter. Example model: `kenney-pirate-chest` (Kenney, 232 triangles,
  body and lid as two objects). Measure: `tris` max 500, `materials` max 4, `ngons`,
  `nonManifoldEdges` 0, `scaleApplied`, `dimensions`, `silhouette` front.
- Manual: https://docs.blender.org/manual/en/5.2/render/materials/assignment.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/origin.html

## Part 7. UVs and painting

**54. UV maps** (`uv-maps`). Reading a model's UV map in the UV Editor with a checker texture.
- Needs: 51.
- Teaches:
  - The UV Editing workspace; Object Data > UV Maps.
  - Sync Selection, on by default since 5.0.
  - A generated UV Grid or Color Grid image to see stretching; the Stretching overlay.
- Exercise: drill, 10 min. Read three ready-made UV maps and say which faces stretch. Starter
  `uv-three-props`. Measure: `uvLayers`.
- Manual: https://docs.blender.org/manual/en/5.2/editors/uv/introduction.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/uv/uv_texture_spaces.html,
  https://docs.blender.org/manual/en/5.2/editors/uv/overlays.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/uv/applying_image.html

**55. Seams and unwrapping** (`unwrapping`). Marking seams and unwrapping a model so its texture
lies flat without stretching.
- Needs: 54.
- Teaches:
  - Edge > Mark Seam (also in the `U` menu); where to hide seams.
  - `U` > Unwrap (Angle Based, Conformal, Minimum Stretch); Live Unwrap.
  - Smart UV Project and Cube Projection for boxy props.
- Exercise: drill, 20 min. Unwrap a crate and a barrel with seams, and a rock with Smart UV
  Project. Starter `unwrap-props`. Measure: `uvLayers` 1.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/uv/unwrapping/seams.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/uv.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/uv/unwrapping/introduction.html

**56. Arranging UV islands** (`uv-islands`). Moving, straightening, scaling and packing UV islands
to use the texture well.
- Needs: 55.
- Teaches:
  - `G`, `R`, `S` in the UV Editor; `L` to pick an island; `P` to pin.
  - Average Islands Scale, Pack Islands with a margin; Follow Active Quads to straighten.
  - Texel density: islands sized to match their size on the model.
- Exercise: drill, 15 min. Pack a chest's islands into one square with even density. Starter
  `chest-unwrapped`. Measure: `uvLayers` 1.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/uv/editing.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/uv/workflows/layout.html,
  https://docs.blender.org/manual/en/5.2/editors/uv/selecting.html

**57. Palette textures** (`palette-texture`). Colouring a low-poly model by placing its UVs on a
small palette image.
- Needs: 55, 51.
- Teaches:
  - A small palette image (a 128 by 128 CC0 palette such as Imphenzia's PixPal, or your own).
  - One material, Image Texture set to Closest.
  - Select faces, unwrap, scale the island down and move it onto a swatch (Imphenzia's method;
    Kenney's kits do the same with one shared colormap).
- Exercise: drill, 20 min. Recolour your barrel from lesson 36 with one palette material.
  No starter. Measure: `materials` 1, `uvLayers` 1.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/uv/editing.html,
  https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/image.html

**58. Texture painting** (`texture-paint`). Painting colour straight onto a model in Texture Paint
mode.
- Needs: 55.
- Teaches:
  - The Texture Paint workspace; a new image for the material.
  - Brushes from the asset shelf; `F` for size, `Shift+F` for strength; symmetry.
  - Saving the image (Image > Save; 5.2 offers to save modified images with the file).
- Exercise: drill, 20 min. Paint dirt and wear onto your crate. No starter. Measure: `uvLayers`.
- Manual: https://docs.blender.org/manual/en/5.2/sculpt_paint/texture_paint/introduction.html,
  https://docs.blender.org/manual/en/5.2/sculpt_paint/texture_paint/tool_settings/index.html,
  https://docs.blender.org/manual/en/5.2/sculpt_paint/brush/brush_management.html,
  https://docs.blender.org/manual/en/5.2/editors/image/editing.html

**59. Vertex painting** (`vertex-paint`). Colouring a model's vertices so it needs no texture at
all.
- Needs: 48.
- Teaches:
  - Vertex Paint mode; a Color Attribute; face selection masking.
  - Filling selected faces with a colour (Paint > Set Vertex Colors).
  - The Color Attribute node into Base Color, so glTF exports it and Godot shows it.
- Exercise: drill, 15 min. Colour a tree's trunk and leaves with vertex colours only. Starter
  `tree-grey`. Measure: `materials` 1, `uvLayers`.
- Manual: https://docs.blender.org/manual/en/5.2/sculpt_paint/vertex_paint/introduction.html,
  https://docs.blender.org/manual/en/5.2/sculpt_paint/vertex_paint/tools.html,
  https://docs.blender.org/manual/en/5.2/sculpt_paint/vertex_paint/editing.html,
  https://docs.blender.org/manual/en/5.2/render/shader_nodes/input/vertex_color.html

**60. Low-poly furniture** (`furniture`). Modelling a table and a chair that share one palette
texture.
- Needs: 39, 42, 57.
- Teaches: a table and chair to real sizes (seat 0.45 m, table 0.75 m), legs by Mirror or Array,
  one shared palette material, both exported in one .glb.
- Exercise: copy, 40 min. No starter. Example models: `kenney-furniture-table` (120 triangles) and
  `kenney-furniture-chair` (170 triangles). Measure: `tris` max 300 each, `materials` 1,
  `uvLayers` 1, `scaleApplied`, `dimensions`, `ngons`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/mirror.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/uv/editing.html

## Part 8. Game assets in Godot

**61. Game-ready models** (`game-ready`). Checking triangle count, scale, origin, facing and
normals against a game's needs.
- Needs: 34, 35.
- Teaches:
  - A triangle budget and how to read it in Statistics.
  - Origin at the base centre, facing -Y (Godot's front is +Z), transforms applied.
  - Backface Culling on, normals outward, few materials, clear names.
- Exercise: fix, 15 min. Three props that break five rules between them; make each game-ready.
  Starter `not-game-ready`. Measure: `tris`, `scaleApplied`, `flippedFaces` 0, `materials`,
  `dimensions`, `ngons`.
- Manual: https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/apply.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/origin.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/display/overlays.html
- Godot: https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/model_export_considerations.html

**62. Godot import settings** (`godot-import`). Importing a model into Godot with the right scale,
root node and options.
- Needs: 35.
- Teaches:
  - The Import dock and the Advanced Import Settings dialog: Root Type, Root Scale, meshes,
    materials.
  - New Inherited Scene to add nodes without touching the import.
  - Importing a .blend directly (Blender Path in Editor Settings) and when to prefer a .glb.
- Exercise: drill, 15 min. Import your crate, barrel and chest, make an inherited scene for each.
  No starter. Measure: none (checked in Godot).
- Manual: https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html
- Godot: https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/import_configuration.html,
  https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/advanced_import_settings.html,
  https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/available_formats.html,
  https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/import_process.html

**63. Materials in Godot** (`godot-materials`). Making Blender materials, palette textures and
vertex colours look right in Godot.
- Needs: 57, 59, 62.
- Teaches:
  - What becomes a StandardMaterial3D and what doesn't (procedural nodes have to be baked).
  - Closest interpolation exporting as Nearest filtering; a blurred palette and how to fix it.
  - Vertex colours turning on albedo from vertex colour; Backface Culling and double-sided faces.
  - Extracting materials so a re-import keeps your Godot changes.
- Exercise: fix, 15 min. Fix a blurred palette prop and a see-through crate in Godot. Starter
  `godot-material-faults` (a .blend and its export). Measure: `materials`, `uvLayers`.
- Manual: https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html,
  https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/image.html
- Godot: https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/advanced_import_settings.html

**64. Collision shapes** (`collision`). Making simple collision meshes and naming them so Godot
builds the collision.
- Needs: 61.
- Teaches:
  - A low box or convex hull (Mesh > Convex Hull) around the prop.
  - Name suffixes: `-colonly`, `-convcolonly`, `-col`, `-convcol`.
  - Godot's Physics > Generate in the Advanced Import Settings as the alternative. Empties don't
    work for this from glTF.
- Exercise: project, 15 min. Collision for the crate (box), barrel (convex) and chest. No starter.
  Measure: `tris` (of the collision meshes, small).
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/convex_hull.html
- Godot: https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/node_type_customization.html,
  https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/advanced_import_settings.html

**65. Levels of detail** (`lods`). Making lower-detail versions of a model with Decimate, and
letting Godot make its own.
- Needs: 61, 37.
- Teaches:
  - The Decimate modifier: Collapse ratio, Un-Subdivide, Planar.
  - Godot generates LODs on import; LOD Bias; why it can break skinned meshes.
  - Hand-made LODs with visibility ranges.
- Exercise: drill, 15 min. Two lower versions of a 2,000-triangle rock at a half and a quarter.
  Starter `dense-rock`. Measure: `tris`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/decimate.html
- Godot: https://docs.godotengine.org/en/stable/tutorials/3d/mesh_lod.html,
  https://docs.godotengine.org/en/stable/tutorials/3d/visibility_ranges.html

**66. Modular kits** (`modular-kit`). Building wall, floor and corner pieces on a grid so they fit
together.
- Needs: 12, 14, 18.
- Teaches:
  - Sizes that divide into each other (2 m pieces, 1 m halves).
  - Snap to Grid and Increment; origins on the ground plane at a corner or the centre.
  - Names such as `wall_2m`, `wall_corner`, `floor_2m`.
- Exercise: drill, 20 min. A floor, a wall, a corner and a doorway, each 2 m. No starter.
  Example model: `kenney-town-wall`. Measure: `dimensions`, `scaleApplied`, `tris`.
- Manual: https://docs.blender.org/manual/en/5.2/editors/3dview/controls/snapping.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/origin.html
- Godot: https://docs.godotengine.org/en/stable/tutorials/3d/using_gridmaps.html

**67. A small building kit** (`building-kit`). Building a modular kit, exporting it, and assembling
a small building in Godot.
- Needs: 57, 64, 66.
- Teaches: eight to ten palette-textured pieces with collision, exported in one .glb, turned into a
  MeshLibrary (Scene > Export As... > MeshLibrary), and laid out with a GridMap at a 2 m cell.
- Exercise: project, 60 min. No starter. Example models: `kenney-town-wall`,
  `kenney-survival-floor`. Measure: `tris` max 200 per piece, `materials` 1, `dimensions`,
  `scaleApplied`, `nonManifoldEdges`.
- Manual: https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html
- Godot: https://docs.godotengine.org/en/stable/tutorials/3d/using_gridmaps.html,
  https://docs.godotengine.org/en/stable/classes/class_gridmap.html

## Part 9. Lighting and rendering

**68. Lights** (`lights`). Lighting a scene with point, sun, spot and area lights.
- Needs: 9.
- Teaches: Add > Light; Power, Color, Radius; Sun Strength and angle; a key, fill and rim
  arrangement.
- Exercise: drill, 15 min. Light a prop three ways: one sun, a three-light setup, a single lamp
  at night. Starter `light-stage`: a prop on a floor with a camera. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/render/lights/light_object.html,
  https://docs.blender.org/manual/en/5.2/render/lights/index.html

**69. World lighting** (`world-lighting`). Lighting a scene from the World with a colour or an
HDRI image.
- Needs: 68.
- Teaches: the World tab's Color and Strength; an Environment Texture with a CC0 HDRI from Poly
  Haven (5.2: dropping an image into the World node editor makes one); rotating it with Mapping.
- Exercise: drill, 10 min. Light the same prop with a sky HDRI and an indoor HDRI. Starter
  `light-stage`. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/render/lights/world.html,
  https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/environment.html

**70. Cameras** (`cameras`). Placing and aiming a camera, choosing a lens and framing a shot.
- Needs: 3.
- Teaches:
  - `Numpad 0` camera view; `Ctrl+Alt+Numpad 0` to move the camera to the view.
  - Sidebar > View > Lock Camera to View; Focal Length; Orthographic and its scale gizmo (5.2).
  - Passepartout, composition guides, depth of field.
- Exercise: drill, 10 min. Three shots of a prop: a wide, a close-up and an orthographic front.
  Starter `light-stage`. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/render/cameras.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/camera_view.html

**71. Rendering with EEVEE** (`eevee`). Rendering a still image with EEVEE and choosing its main
quality settings.
- Needs: 68, 70.
- Teaches:
  - `F12` to render, Image > Save As; Render > View Render (`F11`).
  - Samples, Ray Tracing, Shadows; glow through the compositor's Glare node (Bloom left EEVEE in
    4.2).
- Exercise: drill, 15 min. Render the lit prop at 1920 by 1080 and save a PNG. Starter
  `light-stage`. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/render/eevee/index.html,
  https://docs.blender.org/manual/en/5.2/render/eevee/render_settings/index.html,
  https://docs.blender.org/manual/en/5.2/render/introduction.html

**72. Rendering with Cycles** (`cycles`). Rendering with Cycles on your graphics card with sensible
samples and denoising.
- Needs: 71.
- Teaches:
  - Preferences > System > Cycles Render Devices; Device: GPU Compute.
  - Noise Threshold, Max Samples, Denoise; Light Paths bounces.
  - When Cycles is worth the wait over EEVEE.
- Exercise: drill, 15 min. The same shot in Cycles at two noise thresholds; compare time and noise.
  Starter `light-stage`. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/render/cycles/index.html,
  https://docs.blender.org/manual/en/5.2/render/cycles/gpu_rendering.html,
  https://docs.blender.org/manual/en/5.2/render/cycles/render_settings/sampling.html,
  https://docs.blender.org/manual/en/5.2/render/cycles/render_settings/light_paths.html

**73. Render output** (`render-output`). Setting resolution, colour view and file format, and
rendering an animation.
- Needs: 71.
- Teaches:
  - Output Properties: Resolution and %, Frame Range, Frame Rate, output path, PNG, OpenEXR or
    FFmpeg video.
  - Color Management: the AgX view (default) and Standard for exact colours; Exposure.
  - `Ctrl+F12` to render an animation; image sequences first, then video.
- Exercise: drill, 15 min. Render a 48-frame turntable of a prop to PNGs. Starter `turntable`.
  Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/render/output/properties/format.html,
  https://docs.blender.org/manual/en/5.2/render/output/properties/frame_range.html,
  https://docs.blender.org/manual/en/5.2/render/output/properties/output.html,
  https://docs.blender.org/manual/en/5.2/render/output/animation.html,
  https://docs.blender.org/manual/en/5.2/render/color_management/displays_views.html

**74. A portfolio render** (`portfolio-render`). Lighting and rendering your low-poly assets as a
finished image and a clay render.
- Needs: 69, 71, 73.
- Teaches: arranging your props, a three-light or HDRI setup, an EEVEE colour render and a
  Workbench clay render with wireframe, saved as PNGs.
- Exercise: project, 45 min. Your crate, barrel, sword, chest and furniture on one stage. No
  starter. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/render/workbench/index.html,
  https://docs.blender.org/manual/en/5.2/editors/3dview/viewport_render.html,
  https://docs.blender.org/manual/en/5.2/render/cameras.html

## Part 10. Sculpting

**75. Sculpt Mode** (`sculpt-mode`). Sculpting a shape with the Draw, Clay Strips, Smooth and Grab
brushes.
- Needs: 19.
- Teaches:
  - The Sculpting workspace; brushes from the asset shelf (brushes became assets in 4.3).
  - `F` size (a diameter since 5.0), `Shift+F` strength; `Ctrl` to invert, `Shift` to smooth.
  - X symmetry.
- Exercise: drill, 20 min. A lumpy stone and a mushroom cap from a remeshed sphere. Starter
  `sculpt-ball`. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/sculpt_paint/sculpting/introduction/index.html,
  https://docs.blender.org/manual/en/5.2/sculpt_paint/brush/brush_management.html,
  https://docs.blender.org/manual/en/5.2/sculpt_paint/sculpting/brushes/index.html,
  https://docs.blender.org/manual/en/5.2/sculpt_paint/sculpting/tool_settings/symmetry.html

**76. Remeshing for sculpting** (`remeshing`). Adding detail where you need it with voxel remesh,
Dyntopo and Multiresolution.
- Needs: 75.
- Teaches:
  - Voxel Remesh: `R` for voxel size, `Ctrl+R` to remesh.
  - Dyntopo detail size (its `Ctrl+D` shortcut went in 4.0).
  - The Multiresolution modifier: Subdivide, levels, Apply Base.
- Exercise: drill, 15 min. Join two shapes into one sculpt with remesh, then add detail with
  Dyntopo. Starter `sculpt-ball`. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/sculpt_paint/sculpting/tool_settings/remesh.html,
  https://docs.blender.org/manual/en/5.2/sculpt_paint/sculpting/tool_settings/dyntopo.html,
  https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/multiresolution.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/retopology.html

**77. Retopology** (`retopology`). Building a clean low-poly mesh over a sculpt with snapping and
Shrinkwrap.
- Needs: 76, 12.
- Teaches:
  - A new plane, snapping to Face Project, the Retopology overlay.
  - The Poly Build tool; extruding along the surface.
  - The Shrinkwrap modifier to keep it on the surface; Decimate as the quick alternative.
- Exercise: drill, 25 min. Retopologise a sculpted stone into under 300 triangles. Starter
  `sculpted-stone`. Measure: `tris` max 300, `ngons`, `nonManifoldEdges` 0.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/meshes/retopology.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/tools/poly_build.html,
  https://docs.blender.org/manual/en/5.2/modeling/modifiers/deform/shrinkwrap.html

**78. Baking textures** (`baking`). Baking a sculpt's detail and a material's colour into images
for a low-poly model.
- Needs: 77, 52, 55.
- Teaches:
  - Cycles > Bake: Normal and Diffuse (Color only); Selected to Active with Extrusion and Max Ray
    Distance; the target Image Texture node selected.
  - A Non-Color image for the normal map; saving the baked images.
- Exercise: drill, 25 min. Bake the sculpted stone onto your retopologised one, and a procedural
  wood onto a plank. Starter `sculpted-stone`. Measure: `uvLayers` 1, `materials`.
- Manual: https://docs.blender.org/manual/en/5.2/render/cycles/baking.html,
  https://docs.blender.org/manual/en/5.2/render/shader_nodes/displacement/normal_map.html

**79. A rock and a tree** (`rock-tree`). Sculpting a rock and modelling a tree, each within a
triangle budget.
- Needs: 29, 65, 77.
- Teaches: a sculpted rock reduced to a low-poly game rock; a tree from a cylinder trunk and
  displaced ico-sphere leaves (the Displace modifier), each with a palette colour, exported.
- Exercise: project, 45 min. No starter. Example models: `kenney-survival-rock` (104 triangles),
  `kenney-nature-tree` (114 triangles). Measure: `tris` max 300 (rock) and 400 (tree), `materials`,
  `nonManifoldEdges`, `scaleApplied`, `dimensions`, `silhouette` front.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/modifiers/deform/displace.html,
  https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/decimate.html

## Part 11. Curves and Geometry Nodes

**80. Bézier curves** (`bezier-curves`). Drawing and shaping a Bézier curve with its control points
and handles.
- Needs: 19.
- Teaches:
  - Add > Curve > Bézier; Edit Mode on control points and handles.
  - `V` handle type, `E` extrude, `F` make segment, `Alt+C` close; `Ctrl`+click to add a point.
  - The Draw tool for freehand curves.
- Exercise: drill, 15 min. Trace a road and a hook shape from a top-view image. Starter
  `curve-trace`. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/curves/introduction.html,
  https://docs.blender.org/manual/en/5.2/modeling/curves/structure.html,
  https://docs.blender.org/manual/en/5.2/modeling/curves/editing/index.html,
  https://docs.blender.org/manual/en/5.2/modeling/curves/tools/index.html

**81. Curve depth and bevel** (`curve-geometry`). Turning a curve into a pipe, rope or rail and
then into a mesh.
- Needs: 80.
- Teaches:
  - Object Data > Geometry: Extrude, Bevel Depth and Resolution, a profile object; Resolution kept
    low for low-poly.
  - Object > Convert > Mesh; the Curve to Tube modifier (5.0), which also makes UVs.
- Exercise: drill, 15 min. A rope, a pipe with a bend and a hook rail, each under 200 triangles.
  Starter `curve-trace`. Measure: `tris`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/curves/properties/geometry.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/convert.html,
  https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/curve_to_tube.html

**82. 3D text** (`text`). Adding 3D text, choosing a font, giving it depth and converting it to a
mesh.
- Needs: 81.
- Teaches: Add > Text; `Tab` to type; Object Data > Font, Paragraph, Geometry (Extrude, Bevel);
  converting to a mesh and cleaning it.
- Exercise: drill, 15 min. A carved sign reading "INN" on a board. No starter. Measure: `tris`,
  `ngons`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/texts/introduction.html,
  https://docs.blender.org/manual/en/5.2/modeling/texts/editing.html,
  https://docs.blender.org/manual/en/5.2/modeling/texts/properties.html

**83. Other object types** (`other-objects`). Trying surfaces, metaballs, volumes and point clouds,
and converting them to meshes.
- Needs: 81.
- Teaches:
  - NURBS surfaces: control points and a smooth result.
  - Metaballs: blobs that merge; converting to a mesh.
  - Volumes (OpenVDB) and point clouds (a full object type since 4.5): what they are for.
- Exercise: drill, 15 min. A metaball slime and a NURBS dome, each converted to a mesh under 500
  triangles. No starter. Measure: `tris`.
- Manual: https://docs.blender.org/manual/en/5.2/scene_layout/object/types.html,
  https://docs.blender.org/manual/en/5.2/modeling/surfaces/introduction.html,
  https://docs.blender.org/manual/en/5.2/modeling/metas/introduction.html,
  https://docs.blender.org/manual/en/5.2/modeling/volumes/introduction.html,
  https://docs.blender.org/manual/en/5.2/modeling/point_cloud/index.html

**84. Geometry Nodes** (`geometry-nodes`). Changing a mesh with a Geometry Nodes modifier and your
first few nodes.
- Needs: 37, 50.
- Teaches:
  - The Geometry Nodes workspace; New; Group Input and Group Output.
  - Transform Geometry, Set Position, Join Geometry; the Viewer node (`Ctrl+Shift`+click).
  - Exposing a value on the modifier panel.
- Exercise: drill, 15 min. A node tree that stacks three scaled copies of a mesh into a tower.
  No starter. Measure: `modifiers`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/introduction.html,
  https://docs.blender.org/manual/en/5.2/modeling/modifiers/geometry_nodes.html,
  https://docs.blender.org/manual/en/5.2/editors/geometry_node.html,
  https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/inspection.html

**85. Attributes and fields** (`fields`). Moving parts of a mesh differently using positions,
normals and other attributes.
- Needs: 84.
- Teaches: Position, Normal and Index inputs; Math nodes; diamond and round sockets; the Spreadsheet
  to see the values.
- Exercise: drill, 15 min. A plane rippled by a wave that depends on each point's position.
  No starter. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/fields.html,
  https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/attributes_reference.html,
  https://docs.blender.org/manual/en/5.2/editors/spreadsheet.html

**86. Instancing on points** (`instancing`). Scattering copies of an object over a surface with
points and instances.
- Needs: 85.
- Teaches:
  - Distribute Points on Faces, Instance on Points, Object Info and Collection Info.
  - Random Value for rotation and scale; Realize Instances before export.
  - The Scatter on Surface modifier (5.0) as the ready-made version.
- Exercise: drill, 20 min. Scatter your rocks and trees over a hill. Starter `grid-ground`.
  Measure: `tris`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/instances.html,
  https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/point/distribute_points_on_faces.html,
  https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/instances/instance_on_points.html,
  https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/instances/realize_instances.html,
  https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/scatter_on_surface.html

**87. A fence generator** (`fence`). Building a node group that places fence posts and rails along
any curve.
- Needs: 80, 86.
- Teaches: Resample Curve and Curve to Points for posts, Curve to Mesh for rails, inputs for post
  spacing and height, a node group (`Ctrl+G`), realized and applied for export.
- Exercise: project, 45 min. A fence that follows any curve you draw, exported to Godot along a
  path. No starter. Measure: `modifiers`, `tris`, `dimensions`.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/curve/operations/resample_curve.html,
  https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/curve/operations/curve_to_points.html,
  https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/curve/operations/curve_to_mesh.html,
  https://docs.blender.org/manual/en/5.2/interface/controls/nodes/groups.html

## Part 12. Animation

**88. Keyframes** (`keyframes`). Animating an object by setting keyframes on its location, rotation
and scale.
- Needs: 6.
- Teaches:
  - `I` keys the channels set in Preferences > Animation (no menu since 4.1); `K` for the keying
    menu; hovering a field and pressing `I`; `Alt+I` to delete.
  - The Timeline, the playback footer (5.0), `Space` to play, Auto Keying.
  - Up Arrow and Down Arrow jump to the previous and next keyframe (swapped in 5.0).
- Exercise: drill, 15 min. A coin that rises, spins and lands over 48 frames. No starter.
  Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/animation/keyframes/introduction.html,
  https://docs.blender.org/manual/en/5.2/animation/keyframes/editing.html,
  https://docs.blender.org/manual/en/5.2/editors/timeline.html,
  https://docs.blender.org/manual/en/5.2/editors/preferences/animation.html

**89. The Dope Sheet** (`dope-sheet`). Moving, copying and retiming keyframes in the Dope Sheet.
- Needs: 88.
- Teaches: selecting and moving keys with `G`, scaling timing with `S`, `Shift+D`, `Ctrl+C` and
  `Ctrl+V`; markers (`M`); keyframe types; loop modes in the Playback popover (5.2).
- Exercise: drill, 10 min. Retime a bouncing ball so it slows as it loses height. Starter
  `bounce-even`. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/editors/dope_sheet/introduction.html,
  https://docs.blender.org/manual/en/5.2/editors/dope_sheet/editing.html,
  https://docs.blender.org/manual/en/5.2/animation/markers.html

**90. The Graph Editor** (`graph-editor`). Shaping how motion speeds up, slows down and loops in the
Graph Editor.
- Needs: 89.
- Teaches: F-curves; `T` interpolation (Constant, Linear, Bézier), `V` handle type, `Ctrl+E`
  easing; the Cycles F-curve modifier for loops.
- Exercise: drill, 15 min. A door swing with a hard stop and a lamp that sways forever. Starter
  `bounce-even`. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/editors/graph_editor/introduction.html,
  https://docs.blender.org/manual/en/5.2/editors/graph_editor/fcurves/introduction.html,
  https://docs.blender.org/manual/en/5.2/editors/graph_editor/fcurves/editing.html,
  https://docs.blender.org/manual/en/5.2/editors/graph_editor/fcurves/modifiers.html

**91. Constraints** (`constraints`). Making objects follow, aim at or copy other objects with
constraints.
- Needs: 16, 88.
- Teaches: the Object Constraint tab; Track To and Damped Track (a camera on an empty); Copy
  Location; Child Of for picking things up; Limit Rotation for a hinge; `Ctrl+Shift+C`.
- Exercise: drill, 15 min. A camera that follows a moving cart and a turret that aims at a target.
  Starter `cart-path`. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/animation/constraints/introduction.html,
  https://docs.blender.org/manual/en/5.2/animation/constraints/tracking/track_to.html,
  https://docs.blender.org/manual/en/5.2/animation/constraints/tracking/damped_track.html,
  https://docs.blender.org/manual/en/5.2/animation/constraints/relationship/child_of.html

**92. Drivers** (`drivers`). Linking one property to another so a wheel turns as its cart moves.
- Needs: 88.
- Teaches: right click > Add Driver (`Ctrl+D` over a field); the Drivers editor; a Transform Channel
  variable; a simple expression.
- Exercise: drill, 15 min. Wheels that turn by distance travelled. Starter `cart-path`.
  Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/animation/drivers/introduction.html,
  https://docs.blender.org/manual/en/5.2/animation/drivers/usage.html,
  https://docs.blender.org/manual/en/5.2/animation/drivers/drivers_panel.html,
  https://docs.blender.org/manual/en/5.2/editors/drivers_editor.html

**93. Shape keys** (`shape-keys`). Storing other shapes of a mesh and blending between them.
- Needs: 88, 19.
- Teaches: Object Data > Shape Keys; Basis and a new key; editing it in Edit Mode; keying its
  Value; exported as glTF morph targets and Godot blend shapes (only with Apply Modifiers off).
- Exercise: drill, 15 min. A sack that squashes and a chest lid that bulges. No starter.
  Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/animation/shape_keys/introduction.html,
  https://docs.blender.org/manual/en/5.2/animation/shape_keys/shape_keys_panel.html,
  https://docs.blender.org/manual/en/5.2/animation/shape_keys/workflow.html

**94. Actions** (`actions`). Keeping several animations of one object as separate, named actions.
- Needs: 89.
- Teaches: the Action Editor; New action, naming, Fake User; slots (4.4); Push Down and Stash;
  only active, stashed and NLA actions export to glTF.
- Exercise: drill, 15 min. Two actions on one door, open and close. No starter. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/animation/actions.html,
  https://docs.blender.org/manual/en/5.2/editors/dope_sheet/modes/action.html

**95. The NLA editor** (`nla`). Stacking, repeating and blending actions as strips in the Nonlinear
Animation editor.
- Needs: 94.
- Teaches: tracks and strips; `Tab` to tweak a strip; Repeat, Scale, Blend In and Out; muting.
- Exercise: drill, 15 min. A door that opens, waits and closes, built from two strips. No starter.
  Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/editors/nla/introduction.html,
  https://docs.blender.org/manual/en/5.2/editors/nla/tracks.html,
  https://docs.blender.org/manual/en/5.2/editors/nla/strips.html

**96. An animated chest** (`animated-chest`). Animating a chest lid opening and closing as two
actions and playing them in Godot.
- Needs: 53, 90, 94.
- Teaches: keying the lid on its hinge, eased in the Graph Editor, two actions stashed, glTF
  Animation Mode Actions, played in Godot's AnimationPlayer.
- Exercise: project, 30 min. Your chest from lesson 53. No starter. Example model:
  `kenney-pirate-chest` (has open, close and open-close animations). Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/animation/actions.html,
  https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html

## Part 13. Characters

**97. Character modelling** (`character-modelling`). Modelling a low-poly character from a cube
with Mirror, extrusions and loop cuts.
- Needs: 38, 46, 23.
- Teaches: front and side references; a body, arms and legs extruded from a cube with Mirror;
  loops at the joints for bending; a T or A pose; feet on the ground at the origin.
- Exercise: copy, 60 min. Starter `character-sheet`: a front and side sheet rendered from
  `kenney-mini-character`. Measure: `tris` max 2000, `ngons`, `nonManifoldEdges` 0,
  `scaleApplied`, `dimensions`, `silhouette` front.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/mirror.html,
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/extrude_faces.html,
  https://docs.blender.org/manual/en/5.2/modeling/empties.html

**98. Armatures** (`armatures`). Adding an armature and building a skeleton of bones for a
character.
- Needs: 97.
- Teaches: Add > Armature; Edit Mode on bones, `E` to extrude; naming with .L and .R and Armature >
  Symmetrize; In Front; bone roll; bone collections.
- Exercise: drill, 20 min. A 15-bone skeleton fitted inside your character. No starter.
  Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/animation/armatures/introduction.html,
  https://docs.blender.org/manual/en/5.2/animation/armatures/bones/introduction.html,
  https://docs.blender.org/manual/en/5.2/animation/armatures/bones/editing/extrude.html,
  https://docs.blender.org/manual/en/5.2/animation/armatures/bones/editing/naming.html,
  https://docs.blender.org/manual/en/5.2/animation/armatures/bones/editing/symmetrize.html,
  https://docs.blender.org/manual/en/5.2/animation/armatures/bones/bone_collections.html

**99. Skinning** (`skinning`). Binding a mesh to an armature with automatic weights so it bends with
the bones.
- Needs: 98, 15.
- Teaches: mesh then armature, `Ctrl+P` > With Automatic Weights; the Armature modifier and the
  vertex groups it uses; applying scale first; what to do when automatic weights fail.
- Exercise: drill, 10 min. Bind your character and bend each limb. No starter. Measure:
  `modifiers`, `scaleApplied`.
- Manual: https://docs.blender.org/manual/en/5.2/animation/armatures/skinning/introduction.html,
  https://docs.blender.org/manual/en/5.2/animation/armatures/skinning/parenting.html,
  https://docs.blender.org/manual/en/5.2/modeling/modifiers/deform/armature.html

**100. Weight painting** (`weight-painting`). Painting how strongly each bone moves each part of the
mesh.
- Needs: 99.
- Teaches: Weight Paint mode with the armature in Pose Mode; Weight and Strength; Add, Subtract,
  Blur; Normalize All and Limit Total (four bones); the Zero Weights overlay.
- Exercise: fix, 20 min. A character whose shoulders and hips fold badly; paint them clean.
  Starter `bad-weights`. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/sculpt_paint/weight_paint/introduction.html,
  https://docs.blender.org/manual/en/5.2/sculpt_paint/weight_paint/usage.html,
  https://docs.blender.org/manual/en/5.2/sculpt_paint/weight_paint/tools.html,
  https://docs.blender.org/manual/en/5.2/sculpt_paint/weight_paint/editing.html

**101. Posing** (`posing`). Posing a rigged character in Pose Mode and saving poses to reuse.
- Needs: 99.
- Teaches: Pose Mode (`Ctrl+Tab`); rotating bones; `Alt+G`, `Alt+R`, `Alt+S` to clear; copy and
  paste flipped poses; the Pose Library as assets.
- Exercise: drill, 15 min. Three poses (wave, crouch, point) saved to the Pose Library. No
  starter. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/animation/armatures/posing/introduction.html,
  https://docs.blender.org/manual/en/5.2/animation/armatures/posing/editing/clear.html,
  https://docs.blender.org/manual/en/5.2/animation/armatures/posing/editing/copy_paste.html,
  https://docs.blender.org/manual/en/5.2/animation/armatures/posing/editing/pose_library.html

**102. Inverse kinematics** (`inverse-kinematics`). Making a leg or arm follow a target with an IK
constraint and a pole.
- Needs: 101, 91.
- Teaches: `Shift+I` to add IK; Chain Length 2; a target bone and a pole target with Pole Angle;
  keeping IK and target bones out of the export (Deform off).
- Exercise: drill, 20 min. Feet that stay planted while the hips move. No starter.
  Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/animation/armatures/posing/bone_constraints/inverse_kinematics/introduction.html,
  https://docs.blender.org/manual/en/5.2/animation/constraints/tracking/ik_solver.html,
  https://docs.blender.org/manual/en/5.2/animation/armatures/posing/editing/inverse_kinematics.html

**103. Rigify** (`rigify`). Generating a full humanoid rig from a meta-rig with the bundled Rigify
add-on.
- Needs: 102.
- Teaches: enabling Rigify (a core add-on); Add > Armature > Human (the meta-rig); fitting it; Generate
  Rig; the DEF bones; why the course's game character keeps a plain armature.
- Exercise: drill, 25 min. Fit and generate a Rigify rig for a supplied character. Starter
  `rigify-body`. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/addons/rigify/introduction.html,
  https://docs.blender.org/manual/en/5.2/addons/rigify/basics.html,
  https://docs.blender.org/manual/en/5.2/addons/rigify/bone_positioning.html

**104. A walk cycle** (`walk-cycle`). Animating a looping walk from contact, down, passing and up
poses.
- Needs: 90, 102.
- Teaches: key poses first (contact, down, passing, up), then in-betweens; in place; a Cycles
  modifier; motion paths to check the arcs.
- Exercise: drill, 40 min. A 24-frame walk for your character. No starter. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/animation/keyframes/editing.html,
  https://docs.blender.org/manual/en/5.2/animation/motion_paths.html,
  https://docs.blender.org/manual/en/5.2/editors/graph_editor/fcurves/modifiers.html

**105. Animations in Godot** (`godot-animations`). Exporting a character's actions and playing them
in Godot with an AnimationPlayer.
- Needs: 94, 104.
- Teaches: actions named `idle-loop` and `walk-loop` and stashed; glTF Animation Mode Actions;
  Export Deformation Bones Only; in Godot, the AnimationPlayer, loop modes in Advanced Import
  Settings, and playing an animation from the editor.
- Exercise: project, 20 min. Your walk and an idle playing in a Godot scene. No starter. Example
  model: `kenney-mini-character` (rigged, with idle and walk). Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html,
  https://docs.blender.org/manual/en/5.2/animation/actions.html
- Godot: https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/node_type_customization.html,
  https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/advanced_import_settings.html

**106. An animated character** (`animated-character`). Rigging and animating your character with
idle and walk cycles that loop in Godot.
- Needs: 100, 105.
- Teaches: the whole road from mesh to Godot: palette colours, armature, weights, idle and walk,
  export, a scene where the character plays both.
- Exercise: project, 90 min. Your character from lesson 97. No starter. Example model:
  `kenney-mini-character`. Measure: `tris` max 2000, `materials`, `scaleApplied`, `modifiers`,
  `dimensions`.
- Manual: https://docs.blender.org/manual/en/5.2/animation/armatures/skinning/parenting.html,
  https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html

## Part 14. Physics

**107. Rigid bodies** (`rigid-bodies`). Dropping, stacking and knocking over objects with rigid body
physics.
- Needs: 88.
- Teaches: Physics tab > Rigid Body, Active and Passive; Shape, Mass, Friction; the Rigid Body
  World and its cache; Object > Rigid Body > Bake to Keyframes.
- Exercise: drill, 15 min. A wall of blocks knocked down by a ball. No starter. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/physics/rigid_body/introduction.html,
  https://docs.blender.org/manual/en/5.2/physics/rigid_body/properties/index.html,
  https://docs.blender.org/manual/en/5.2/physics/rigid_body/world.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/rigid_body.html

**108. Cloth** (`cloth`). Simulating cloth that hangs, drapes and blows, and baking the result.
- Needs: 107.
- Teaches: Physics > Cloth; a pin group; Collision on the objects it touches; quality and
  self-collision; baking. 5.2's node-based Cloth Dynamics is experimental and mentioned only.
- Exercise: drill, 20 min. A tablecloth that falls onto your table. Starter `cloth-table`.
  Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/physics/cloth/introduction.html,
  https://docs.blender.org/manual/en/5.2/physics/cloth/settings/index.html,
  https://docs.blender.org/manual/en/5.2/physics/collision.html,
  https://docs.blender.org/manual/en/5.2/physics/baking.html

**109. Soft bodies** (`soft-bodies`). Making objects squash and wobble like jelly with soft body
physics.
- Needs: 107.
- Teaches: Physics > Soft Body; Goal and Edges settings; collisions; baking.
- Exercise: drill, 15 min. A jelly cube that drops and wobbles on a plate. No starter.
  Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/physics/soft_body/introduction.html,
  https://docs.blender.org/manual/en/5.2/physics/soft_body/settings/index.html

**110. Fluids, smoke and fire** (`fluids`). Setting up smoke, fire and liquid with a domain, a flow
and a bake.
- Needs: 107.
- Teaches: Object > Quick Effects (Quick Smoke, Quick Liquid); Domain, Flow and Effector; domain
  resolution; baking; why game fire is usually a particle effect in the engine.
- Exercise: drill, 20 min. A torch flame and water poured into a tub, at low resolution. No starter.
  Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/physics/fluid/introduction.html,
  https://docs.blender.org/manual/en/5.2/physics/fluid/type/index.html,
  https://docs.blender.org/manual/en/5.2/physics/baking.html

**111. Particles and force fields** (`particles`). Emitting particles, scattering objects with them
and pushing them with force fields.
- Needs: 107.
- Teaches: Particles tab, Emitter; Emission, Physics, Render As Object or Collection; Add > Force
  Field (Wind, Turbulence); the older Hair particle type and its replacement in lesson 112.
- Exercise: drill, 15 min. Leaves that fall from a tree and drift in wind. No starter.
  Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/physics/particles/introduction.html,
  https://docs.blender.org/manual/en/5.2/physics/particles/emitter/index.html,
  https://docs.blender.org/manual/en/5.2/physics/particles/emitter/render.html,
  https://docs.blender.org/manual/en/5.2/physics/forces/force_fields/index.html

**112. Hair curves** (`hair`). Adding, combing and cutting hair with the Curves object and its
sculpt brushes.
- Needs: 75.
- Teaches: Add > Curves > Empty Hair (or Fur) on a mesh; Sculpt Mode for curves: Add, Comb, Cut,
  Density; the hair Geometry Nodes assets; 5.2's experimental Hair Dynamics, mentioned only.
- Exercise: drill, 20 min. Grass tufts on a ground tile and a beard on a head. No starter.
  Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/modeling/curves_new/primitives.html,
  https://docs.blender.org/manual/en/5.2/sculpt_paint/curves_sculpting/introduction.html,
  https://docs.blender.org/manual/en/5.2/sculpt_paint/curves_sculpting/brushes/index.html

**113. Simulation nodes** (`simulation-nodes`). Building a simple simulation in Geometry Nodes with
a simulation zone.
- Needs: 86.
- Teaches: Add > Simulation Zone; state that carries from frame to frame; a falling, bouncing point
  cloud; baking the zone.
- Exercise: drill, 20 min. Coins that pour out of a chest and settle. No starter. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/physics/simulation_nodes.html,
  https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/simulation/index.html,
  https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/baking.html

**114. Falling crates** (`falling-crates`). Simulating crates tumbling off a cart and baking the fall
to keyframes for Godot.
- Needs: 96, 107.
- Teaches: your crates as rigid bodies on a tipping cart; Bake to Keyframes; one glTF animation of
  the fall played in Godot. The lesson must check which glTF Animation Mode gives one animation
  for many objects in 5.2 (Scene is the likely one).
- Exercise: project, 30 min. Starter `crate-cart`: a cart and six copies of a crate. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/rigid_body.html,
  https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html

## Part 15. Grease Pencil, compositing and video

**115. Drawing with Grease Pencil** (`grease-pencil`). Drawing strokes and fills in 3D space with a
Grease Pencil object.
- Needs: 3.
- Teaches: Add > Grease Pencil; Draw Mode and brushes from the asset shelf; the Draw tool's Stroke,
  Fill or Both (5.1); layers; drawing on the view or on a surface.
- Exercise: imagination, 20 min. A concept sketch of a prop you will model, in 3D space. No
  starter. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/grease_pencil/introduction.html,
  https://docs.blender.org/manual/en/5.2/grease_pencil/structure.html,
  https://docs.blender.org/manual/en/5.2/grease_pencil/modes/draw/index.html,
  https://docs.blender.org/manual/en/5.2/grease_pencil/properties/layers.html

**116. Grease Pencil animation** (`grease-pencil-animation`). Drawing a short frame-by-frame
animation with Grease Pencil and onion skinning.
- Needs: 115, 89.
- Teaches: the 2D Animation template; a new drawing per keyframe; onion skinning; interpolation
  between drawings.
- Exercise: drill, 25 min. A 12-frame flickering flame. No starter. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/grease_pencil/animation/introduction.html,
  https://docs.blender.org/manual/en/5.2/grease_pencil/animation/tools.html,
  https://docs.blender.org/manual/en/5.2/grease_pencil/properties/onion_skinning.html

**117. Line Art** (`line-art`). Drawing outlines around 3D models automatically with the Line Art
modifier.
- Needs: 115, 71.
- Teaches: Add > Grease Pencil > Scene, Collection or Object Line Art; line thickness and the edge
  types it draws; rendering outlines over a low-poly scene.
- Exercise: drill, 15 min. An outlined render of your building kit. No starter. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/grease_pencil/modifiers/generate/line_art.html,
  https://docs.blender.org/manual/en/5.2/render/materials/line_art.html,
  https://docs.blender.org/manual/en/5.2/scene_layout/object/properties/line_art.html

**118. The Compositor** (`compositor`). Adjusting a finished render with render passes and nodes in
the Compositor.
- Needs: 71, 50.
- Teaches: the Compositing workspace; Render Layers to Group Output (the Composite node went in
  5.0); passes in View Layer properties; Glare (Bloom), Color Balance, Blur; the Viewer node and
  backdrop.
- Exercise: drill, 20 min. Add glow, a vignette and a colour grade to your portfolio render.
  No starter. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/compositing/introduction.html,
  https://docs.blender.org/manual/en/5.2/compositing/usage.html,
  https://docs.blender.org/manual/en/5.2/compositing/types/filter/glare.html,
  https://docs.blender.org/manual/en/5.2/render/layers/passes.html,
  https://docs.blender.org/manual/en/5.2/render/layers/view_layer.html

**119. The Video Sequencer** (`video-sequencer`). Cutting renders into a short video with titles and
sound in the Video Sequencer.
- Needs: 73.
- Teaches: the Video Editing template and its Sequencer Scene (5.0); `Shift+A` to add movie, image
  sequence, sound and text strips; `K` to split; strip properties in the Properties editor;
  FFmpeg output.
- Exercise: project, 30 min. A 20-second video of your assets with a title and music. No
  starter. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/video_editing/index.html,
  https://docs.blender.org/manual/en/5.2/video_editing/sequencer_scene.html,
  https://docs.blender.org/manual/en/5.2/video_editing/edit/montage/strips/introduction.html,
  https://docs.blender.org/manual/en/5.2/video_editing/edit/montage/editing.html,
  https://docs.blender.org/manual/en/5.2/video_editing/edit/montage/strips/text.html

## Part 16. Files, add-ons and scripting

**120. Linking and appending** (`link-append`). Bringing objects and materials in from other .blend
files by appending or linking them.
- Needs: 8.
- Teaches: File > Append and File > Link; browsing inside a .blend; Make Local; Library Overrides
  for editing linked objects.
- Exercise: drill, 10 min. Append your crate and link your barrel into a new scene. No starter.
  Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/files/linked_libraries/link_append.html,
  https://docs.blender.org/manual/en/5.2/files/linked_libraries/library_overrides.html

**121. The Asset Browser** (`asset-browser`). Marking your models as assets and dragging them into
any file from the Asset Browser.
- Needs: 120.
- Teaches: Mark as Asset; catalogs; Preferences > Asset Libraries (its own page since 5.2); import
  methods Link, Append, Append (Reuse Data) and Pack; online libraries (5.2).
- Exercise: drill, 15 min. Your props as an asset library with a Props catalog. No starter.
  Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/editors/asset_browser.html,
  https://docs.blender.org/manual/en/5.2/files/asset_libraries/introduction.html,
  https://docs.blender.org/manual/en/5.2/files/asset_libraries/catalogs.html,
  https://docs.blender.org/manual/en/5.2/editors/preferences/asset_libraries.html

**122. Packing and file paths** (`file-paths`). Packing textures into a .blend file and finding
files that have gone missing.
- Needs: 51.
- Teaches: File > External Data: Pack Resources, Unpack, Make Paths Relative, Report Missing Files,
  Find Missing Files; data-blocks and orphan data.
- Exercise: fix, 10 min. A file whose textures were moved; find and pack them. Starter
  `missing-textures`. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/files/blend/packed_data.html,
  https://docs.blender.org/manual/en/5.2/files/file_paths.html,
  https://docs.blender.org/manual/en/5.2/files/data_blocks.html

**123. Importing and exporting** (`import-export`). Moving models in and out of Blender as glTF,
FBX, OBJ, STL and USD.
- Needs: 35.
- Teaches: what each format carries; FBX import's new importer (5.0) and its export axes; OBJ for
  static meshes; STL for printing; USD for big pipelines; Collada is gone (5.0).
- Exercise: drill, 15 min. Import a Kenney .glb and an .obj, fix their scale, export your crate as
  FBX. No starter. Measure: `dimensions`, `scaleApplied`.
- Manual: https://docs.blender.org/manual/en/5.2/files/import_export/index.html,
  https://docs.blender.org/manual/en/5.2/files/import_export/fbx.html,
  https://docs.blender.org/manual/en/5.2/files/import_export/obj.html,
  https://docs.blender.org/manual/en/5.2/files/import_export/stl.html,
  https://docs.blender.org/manual/en/5.2/files/import_export/usd.html

**124. Extensions and add-ons** (`extensions`). Installing, turning on and updating extensions and
the add-ons that come with Blender.
- Needs: 2.
- Teaches: Preferences > Get Extensions with Allow Online Access; Install from Disk; the Add-ons tab
  and the core add-ons (Rigify, Node Wrangler, glTF); updating; disabling.
- Exercise: drill, 10 min. Install one free extension and turn on Node Wrangler. No starter.
  Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/editors/preferences/extensions.html,
  https://docs.blender.org/manual/en/5.2/editors/preferences/addons.html,
  https://docs.blender.org/manual/en/5.2/addons/index.html

**125. Preferences and keymap** (`preferences`). Changing preferences and shortcuts and saving your
own startup file.
- Needs: 2.
- Teaches: Preferences (`Ctrl+Comma`) and its search (5.1); Interface > Resolution Scale; Themes;
  Keymap: changing a shortcut, right click > Assign Shortcut; the Industry Compatible keymap exists
  but the course uses the default; Quick Favorites (`Q`); File > Defaults > Save Startup File.
- Exercise: drill, 10 min. Set up a startup file with metric units, your layout and two Quick
  Favorites. No starter. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/editors/preferences/introduction.html,
  https://docs.blender.org/manual/en/5.2/editors/preferences/interface.html,
  https://docs.blender.org/manual/en/5.2/editors/preferences/keymap.html,
  https://docs.blender.org/manual/en/5.2/advanced/keymap_editing.html,
  https://docs.blender.org/manual/en/5.2/getting_started/configuration/defaults.html

**126. Python in Blender** (`python-console`). Running Python in the console and reading the
commands Blender runs for you.
- Needs: 2.
- Teaches: the Scripting workspace; the Info editor's log of operators; Preferences > Interface >
  Python Tooltips; the Python Console with `bpy.data.objects` and autocomplete.
- Exercise: drill, 15 min. Rename and move objects from the console, copying commands from the Info
  editor. No starter. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/editors/python_console.html,
  https://docs.blender.org/manual/en/5.2/editors/info_editor.html,
  https://docs.blender.org/manual/en/5.2/advanced/scripting/introduction.html

**127. Writing a script** (`scripting`). Writing a script in the Text Editor that exports every
object as its own file.
- Needs: 126, 35.
- Teaches: Text > New, Run Script (`Alt+P`); a loop over `bpy.context.selected_objects`; calling the
  glTF exporter per object; scripts and security (auto-run); running a script with
  `blender -b --python`.
- Exercise: project, 30 min. A script that exports every object in a collection as its own .glb.
  No starter. Measure: none.
- Manual: https://docs.blender.org/manual/en/5.2/editors/text_editor.html,
  https://docs.blender.org/manual/en/5.2/advanced/scripting/introduction.html,
  https://docs.blender.org/manual/en/5.2/advanced/scripting/security.html,
  https://docs.blender.org/manual/en/5.2/advanced/command_line/arguments.html

## What was cut, and where it went

| Cut | Where it went |
| --- | --- |
| Colour management as its own lesson | Lesson 73 (Render output) |
| View layers and passes as their own lesson | Lesson 118 (The Compositor) |
| The Displace modifier as its own lesson | Lesson 79 (A rock and a tree) |
| Node groups and inputs as their own lesson | Lesson 87 (A fence generator) |
| Key poses as their own lesson | Lesson 104 (A walk cycle) |
| GridMap as its own lesson | Lesson 67 (A small building kit) |
| Workbench as its own lesson | Lesson 74 (A portfolio render) |
| Masks and face sets, Freestyle, motion tracking, Dynamic Paint and other corners | `research/01-scope.md`, "Left to the manual" |

If the course needs to be shorter, these lessons could go to Practice or the manual with the
least loss: 83 (Other object types), 103 (Rigify), 109 (Soft bodies), 112 (Hair curves),
116 (Grease Pencil animation) and 117 (Line Art). Each covers an area the owner asked to include,
so cutting them leaves that area with no lesson.
