---
needs: [modifiers, origins, loop-cuts]
exercise: half-a-shield
watch: [ryan-king-mirror-modifier, blender-manual-modeling-modifiers-generate-mirror]
sources:
  - 'Blender 5.2 Manual, "Mirror Modifier": Axis, Clipping, Merge, mirroring across the object origin, and "Accurately Positioning the Mirror Plane" (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/mirror.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Symmetrize" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/symmetrize.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Delete" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/delete.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Loop Cut and Slide" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/loopcut_slide.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Set Origin" (https://docs.blender.org/manual/en/5.2/scene_layout/object/origin.html), read 2026-10-15'
  - 'Blender 5.2.2, checked 2026-10-15: Shift+S opens the snap pie with Cursor to Selected, Object > Set Origin has Origin to 3D Cursor, and the exercise shield measures 0 non-manifold edges with the modifier on'
---

# The Mirror modifier

Most props are the same on both sides, so you only need to model one half. In this lesson you'll cut a mesh in half and let the Mirror modifier build the other half, joined down the middle. Every change you make on one side then shows up on the other.

![A shield from the front. The right half is the mesh, picked out. The left half is the copy the Mirror modifier draws across the middle line.](example)

## Steps

1. **Cut the mesh in half.** In Edit Mode, press `Ctrl+R` over a top edge of the cube. Click, then right click to keep the new loop in the middle. In the front view, select everything left of it and press `X` > Vertices.

   ![The cube from the front with a loop down the middle and its left half selected, ready to delete.](half)

2. **Add the Mirror modifier.** In the Modifiers tab, add Generate > Mirror. Axis X is on, so Blender copies the half across a plane through the object's origin. You edit only the original half.

   ![The half cube, the mirror plane through its origin, and the copy on the far side of it.](add)

3. **Turn on Clipping.** Tick Clipping. Vertices on the middle line can now slide along it but not off it, so the halves can't pull apart or cross. Merge, on by default, joins each of them to its copy.

   ![The half board from the front. A middle vertex can slide up the line but can't cross it.](clipping)

4. **Model one side.** Shape the right half only, and the left half follows. For a shield, add a loop cut across the lower part, then move the bottom corner vertex to the middle line to make the point.

   ![Left, the bottom corner vertex moving to the middle line. Right, the finished shield, both halves pointed.](model)

5. **Apply it, or use Symmetrize.** When the shield is done, apply the modifier with `Ctrl+A` over its panel. Without a modifier, Mesh > Symmetrize in Edit Mode cuts the mesh at the origin and copies one side over the other.

## Common mistake

![Left, the origin left of the middle line: a gap opens between the halves. Right, the origin on the middle line: the halves meet.](mistake)

The mirror plane goes through the object's origin, not the middle of the mesh. With the origin off the middle line, a gap or overlap appears. Select a middle vertex, press `Shift+S` > Cursor to Selected, then in Object Mode choose Object > Set Origin > Origin to 3D Cursor.

## Checking your model

Look at the shield in the front view and check:

1. The Mirror modifier is in the stack with Clipping ticked.
2. No gap or overlap shows down the middle line.
3. In Edit Mode, the mesh is the right half only.
4. The point at the bottom sits on the middle line.

Ryan King Art's Mirror modifier video also shows Mirror Object and Bisect, two more ways to choose where the mirror plane goes.
