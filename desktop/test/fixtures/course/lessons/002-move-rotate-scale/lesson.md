---
needs: [viewport-navigation]
exercise: cube-stool
watch: [blenderguru-beginner-4-0, manual-axis-locking]
sources:
  - Blender 5.2 Manual, "Move" (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/move.html), read 2026-10-15
  - Blender 5.2 Manual, "Rotate" and "Scale" (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/rotate.html, https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/scale.html), read 2026-10-15
  - Blender 5.2 Manual, "Axis Locking" (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/control/axis_locking.html), read 2026-10-15
  - Blender 5.2 Manual, "Numeric Input" (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/control/numeric_input.html), read 2026-10-15
  - Blender 5.2 Manual, "Object Origin" (https://docs.blender.org/manual/en/5.2/scene_layout/object/origin.html), read 2026-10-15
  - Blender 5.2 Manual, "Mesh Primitives", Add > Mesh with Shift-A (https://docs.blender.org/manual/en/5.2/modeling/meshes/primitives.html), read 2026-10-15
  - Blender 5.2 Manual, "Apply" (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/apply.html) and "Sidebar" (https://docs.blender.org/manual/en/5.2/editors/3dview/sidebar.html), read 2026-10-15
  - Blender Guru, "Beginner Blender 4.0 Tutorial (2023)", chapters "Moving objects", "Scale" and "Rotation" (https://www.youtube.com/watch?v=B0J27sf9N1Y), watched 2026-10-15
---

# Move, rotate and scale

Most models start as a few simple shapes put in the right places. In this lesson you'll learn to move, rotate and scale objects from the keyboard, by exact amounts and along a single axis. Then you'll apply the scale, so the size you gave an object becomes its real size.

## Steps

1. **Move.** Select an object with a left click and press `G`. The object follows the mouse. Left click to put it down.

2. **Lock to an axis.** After `G`, `R` or `S`, press `X`, `Y` or `Z` to limit the change to that axis. Press `Shift+Z` instead to move or scale across the floor and leave the height alone.

3. **Type an amount.** Type a number before you confirm, then press `Enter`. `G` `Z` `2` moves the object 2 m up. `R` `Z` `90` turns it 90 degrees. `S` `2` doubles its size.

4. **Rotate and scale.** Press `R` to rotate and `S` to scale. Both work around the object's origin, the small dot that appears when you select it. While scaling, move the mouse towards the origin to shrink the object.

5. **Apply the scale.** Press `Ctrl+A` and choose Scale. The object keeps its size. Press `N` to open the Sidebar: in the Item tab, Scale now reads 1 on every axis.

## Common mistake

The most common mistake is scaling an object and never applying the scale. The object looks right, but its Scale still reads 3 or 0.2. Modifiers depend on it, so a Bevel comes out wider one way than another. Press `Ctrl+A` and apply the scale before you edit the mesh.

## Checking your model

Look at your stool in the front, right and top views:

1. The seat rests on top of all four legs, with no gap.
2. Every leg reaches the floor.
3. The front and back legs lean out by the same angle.
4. In the Sidebar, every part's Scale reads 1 on every axis.
