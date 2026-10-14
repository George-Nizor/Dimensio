---
needs: [edit-mode]
exercise: hill-and-pond
watch: [ryan-king-proportional-editing, blender-manual-editors-3dview-controls-proportional-editing]
sources:
  - 'Blender 5.2 Manual, "Proportional Editing": the O key, Proportional Size with the wheel, the Shift+O falloff pie, Connected Only with Alt+O (https://docs.blender.org/manual/en/5.2/editors/3dview/controls/proportional_editing.html), read 2026-10-15'
  - Blender 5.2 Manual, "Axis Locking", for G then Z (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/control/axis_locking.html), read 2026-10-15
---

# Proportional editing

Moving one vertex of a dense mesh makes a spike. Proportional editing moves the vertices round it as well, less and less with distance, so the surface bends into a smooth slope. In this lesson you'll use it to raise hills and dig hollows in a patch of ground.

![A patch of ground with a smooth hill rising near one corner and a round pond sunk near the other.](example)

## Steps

1. **Turn it on.** In Edit Mode, press `O`, or click the Proportional Editing button in the 3D Viewport's header. It stays on for every move you make until you press `O` again.

   ![Left, one vertex of a grid moved up with proportional editing off: a spike. Right, the same move with it on: a smooth hill.](on)

2. **Set the reach.** Select a vertex, press `G`, then `Z`, and move the mouse up. A circle shows how far the effect reaches. Roll the mouse wheel to make the circle bigger or smaller while you move.

   ![A grid with one vertex being moved up, the circle of influence drawn round it on the ground, and the mouse wheel picked out.](reach)

3. **Choose a falloff.** The falloff is the shape of the slope between the moved vertex and the edge of the circle. Press `Shift+O` and pick one from the pie menu: Smooth for a round hill, Sharp for a peak, Constant for a flat-topped step.

   ![The same move seen from the side with four falloffs: Smooth, Sphere, Sharp and Constant.](falloff)

4. **Keep it to one part.** Press `Alt+O` to turn on Connected Only. The effect then spreads along the mesh's edges instead of through space, so a separate part close by stays still.

   ![Two strips side by side with the tip of one lifted. Left, without Connected Only both strips bend. Right, with it only the lifted strip bends.](connected)

## Common mistake

![Left, one corner of a cube moved with proportional editing still on: the whole cube leans. Right, with it off: only that corner moves.](mistake)

Proportional editing stays on after you finish shaping, so the next time you move one vertex, everything inside the circle moves with it. If a small move drags half the mesh, press `Ctrl+Z` to undo, then `O` to turn it off.

## Checking your model

Look at the ground from the side with `Numpad 1`, then from above:

1. The hill rises in a smooth curve with no spike at the top.
2. The pond sinks below the ground, with sloping sides.
3. The rough patch has bumps of different heights.
4. The Proportional Editing button in the header is off again.
