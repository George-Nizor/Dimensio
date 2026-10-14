---
needs: [snapping, origins, house-blockout]
exercise: four-kit-pieces
watch: [grant-abbitt-modular-building, godot-docs-using-gridmaps]
sources:
  - 'Joel Burgess, "Skyrim''s Modular Level Design: GDC 2013", footprints that are multiples of each other, and pivots at the ground plane and in the centre (http://blog.joelburgess.com/2013/04/skyrims-modular-level-design-gdc-2013.html), read 2026-10-15'
  - Godot 4 docs, "GridMap", cell_size of 2 by 2 by 2 m by default (https://docs.godotengine.org/en/stable/classes/class_gridmap.html), read 2026-10-15
  - Blender 5.2 Manual, "Object Origin", Set Origin (https://docs.blender.org/manual/en/5.2/scene_layout/object/origin.html), read 2026-10-15
  - Blender 5.2 Manual, "Duplicate", Shift+D (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/duplicate.html), read 2026-10-15
  - Blender 5.2 Manual, "Move" and "Rotate", G and R with an axis and a typed value (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/move.html), read 2026-10-15
  - Kenney, Fantasy Town Kit 2.0, wall-wood-detail-cross.glb, measured in Blender 5.2.2 (https://kenney.nl/assets/fantasy-town-kit), checked 2026-10-15
  - Grant Abbitt, "Essential Tips for Modular Building" (https://www.youtube.com/watch?v=QE4aiWp5bZk), checked 2026-10-15
---

# Modular kits

A modular kit is a set of pieces, such as floors and walls, that fit together into any number of buildings. They only fit if every piece follows the same grid. In this lesson you'll build four pieces on a 2 m grid, with origins placed so they line up in Blender and later in Godot.

![The four pieces of a small kit, each standing in its own 2 m cell with its origin at the cell's centre: floor_2m, wall_2m, wall_corner and wall_door.](example)

## Steps

1. **Choose one grid.** Make every piece 2 m wide, or 1 m for a half, so pieces add up to whole cells. Walls here are 2.5 m tall and 0.2 m thick; floors are 0.1 m thick. Godot's GridMap uses 2 m cells by default.

   ![wall_2m from the front, 2 m long and 2.5 m tall; from the side, 0.2 m thick; and wall_door with an opening 2.1 m tall.](sizes)

2. **Put the origin at the cell's centre.** Every piece's origin sits on the ground at the centre of its 2 m square. A floor fills the square, and a wall runs along its back edge. Kenney's Fantasy Town walls are built the same way.

   ![One 2 m cell from the top: floor_2m filling it, and wall_2m along its back edge, both with the origin at the cell's centre.](cell)

3. **Move and turn by whole cells.** Press `Shift+D`, then `X`, type 2 and press `Enter`: the copy lands exactly one cell along. Turn a wall with `R`, `Z`, `90`, and it swings about the cell's centre onto the next edge.

   ![From the top: a wall copied one cell along with Shift+D, X, 2, and a wall turned with R, Z, 90 onto the cell's left edge.](move)

4. **Name each piece.** Use names that say what the piece is and how big it is: floor_2m, wall_2m, wall_corner, wall_door. Godot lists the pieces by these names when you lay out a level.

5. **Test the fit.** Lay out a small room from copies: four floors, walls on the outer edges, corners and the doorway. Look from the top (`Numpad 7`) for gaps or overlaps where pieces meet.

   ![A small room from the top: four floors, three corner pieces, a wall and the doorway, meeting with no gaps.](test)

The grid rule comes from Joel Burgess's GDC talk on Skyrim's modular kits.

## Common mistake

![From the top. Left, a wall with its origin on the wall itself, turned 90 degrees: it sticks half out of its cell. Right, the origin at the cell's centre: the turned wall lands on the next edge.](mistake)

Origin to Geometry puts a wall's origin in the middle of the wall, on the cell's edge. Turned 90 degrees, the wall then sticks half out of its cell and leaves the corner open. Keep every origin at the cell's centre.

## Checking your model

Select each piece in turn and check:

1. Its origin sits on the ground at the centre of its 2 m square.
2. The Sidebar shows wall_2m as 2 by 0.2 by 2.5 m.
3. The doorway's opening is 1 m wide and 2.1 m tall.
4. From the top, the test room has no gaps at the corners.
5. Every piece's scale reads 1.
