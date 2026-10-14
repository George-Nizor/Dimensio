---
needs: [transform]
exercise: row-of-primitives
watch: [cgcookie-3d-cursor, cgcookie-object-data]
sources:
  - Blender 5.2 Manual, "Mesh Primitives", Shift+A > Mesh, primitives added at the 3D cursor, the options of each (https://docs.blender.org/manual/en/5.2/modeling/meshes/primitives.html), read 2026-10-15
  - Blender 5.2 Manual, "Undo & Redo", Adjust Last Operation and F9 (https://docs.blender.org/manual/en/5.2/interface/undo_redo.html), read 2026-10-15
  - Blender 5.2 Manual, "3D Cursor", Shift and right click to place it, Center Cursor and Frame All (https://docs.blender.org/manual/en/5.2/editors/3dview/3d_cursor.html), read 2026-10-15
  - Blender 5.2 Manual, "Duplicate", Shift+D (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/duplicate.html), read 2026-10-15
  - Blender 5.2 Manual, "Duplicate Linked", Alt+D (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/duplicate_linked.html), read 2026-10-15
  - Blender 5.2 Manual, "Default Keymap", X deletes with a confirmation, Delete without (https://docs.blender.org/manual/en/5.2/interface/keymap/blender_default.html), read 2026-10-15
  - Blender 5.2.2 default keymap, Shift+C runs Frame All with Center (5.2/scripts/presets/keyconfig/keymap_data/blender_default.py), and the exercise's row built and counted at 190 triangles, checked 2026-10-15
  - CG Cookie, "Adding, Deleting, and the 3D Cursor in Blender" (https://www.youtube.com/watch?v=ACdtFVSbDZo), read 2026-10-15
---

# Adding and duplicating

Low-poly models are often a handful of simple shapes put together. In this lesson you'll add those shapes, set their size and number of sides as you add them, and duplicate and delete objects.

![A row of five shapes: a cube, an 8-sided cylinder, a 6-sided cone, a UV sphere and an ico sphere.](example)

## Steps

1. **Place the 3D cursor.** New objects appear at the 3D cursor, the red and white ring. Hold `Shift` and right click to put it where you click. `Shift+C` puts it back at the centre of the world and shows the whole scene.

   ![The 3D cursor, a red and white ring with cross hairs, on the grid beside a cube.](cursor)

2. **Add a shape.** With the mouse over the 3D Viewport, press `Shift+A` and choose Mesh > Cylinder. Blender calls the shapes in this menu primitives. The Add menu in the viewport header holds the same list.

   ![The Add menu open at Mesh, with Cylinder picked out among Plane, Cube, Circle, UV Sphere, Ico Sphere, Cone and Torus.](add-menu)

3. **Adjust it straight away.** The Adjust Last Operation panel opens in the bottom left corner of the viewport. Set Vertices to 8, Radius to 0.5 m and Depth to 1 m. Change these first: after your next action the panel shows that action instead.

   ![The Adjust Last Operation panel with Vertices 8, Radius 0.5 m and Depth 1 m, beside the 8-sided cylinder it makes.](adjust)

4. **Duplicate.** `Shift+D` copies the selected objects and starts moving the copy, so you can lock and type as in lesson 6: `Shift+D`, `X`, `2`, `Enter` puts a copy 2 m along X. `Alt+D` makes a linked duplicate, which shares the original's mesh.

   ![A cylinder and its copy 2 m along X, with the keys Shift+D, X, 2 and Enter.](duplicate)

5. **Delete.** Press `X` and choose Delete. Pressing `Delete` instead deletes the selected objects straight away, without asking first.

## Common mistake

![Left, after Shift+D and Esc the copy sits exactly on top of the original, and the Outliner lists Cube and Cube.001. Right, the copy moved along X, where you can see it.](mistake)

Pressing `Esc` or right clicking after `Shift+D` cancels only the move. The copy stays, exactly on top of the original, where you can't see it. The Outliner lists both. Press `Ctrl+Z` to remove the copy, or move it with `G`.

## Checking your model

Look at the row from the front and the top, then check:

1. Five objects stand in a row 2 m apart, none hidden inside another.
2. From the top, the cylinder has 8 sides and the cone 6.
3. Every shape's Dimensions Z reads 1 m in the Sidebar.
4. With nothing selected, Statistics shows 190 triangles.

If Statistics shows more, a shape has more segments than the exercise asks for, or a copy hides inside another.
