---
needs: [transform]
exercise: ring-and-sign
watch: [cgcookie-pivots-snapping, cgcookie-orientations]
sources:
  - Blender 5.2 Manual, "Transform Pivot Point", Period for its menu (https://docs.blender.org/manual/en/5.2/editors/3dview/controls/pivot_point/index.html), read 2026-10-15
  - Blender 5.2 Manual, "Median Point" (https://docs.blender.org/manual/en/5.2/editors/3dview/controls/pivot_point/median_point.html), "3D Cursor" (https://docs.blender.org/manual/en/5.2/editors/3dview/controls/pivot_point/3d_cursor.html) and "Individual Origins" (https://docs.blender.org/manual/en/5.2/editors/3dview/controls/pivot_point/individual_origins.html), read 2026-10-15
  - Blender 5.2 Manual, "Transform Orientation", Comma for its menu, Global and Local, pressing an axis key twice (https://docs.blender.org/manual/en/5.2/editors/3dview/controls/orientation.html), read 2026-10-15
  - Blender 5.2 Manual, "Axis Locking", a second press of the same axis key, a third press to remove the lock, the axis named in the header (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/control/axis_locking.html), read 2026-10-15
  - Blender 5.2.2, the Pivot Point and Orientation pies (VIEW3D_MT_pivot_pie, VIEW3D_MT_orientations_pie) and Median Point and Global in a factory start, checked 2026-10-15
  - CG Cookie, "Pivots, Snapping, and Proportional Editing in Blender" (https://www.youtube.com/watch?v=PfBO0Gfla_Y) and "Orientations and Parenting in Blender" (https://www.youtube.com/watch?v=vlR6qAbIlR0), read 2026-10-15
---

# Pivot points and orientations

Rotating and scaling always happen around a point, and moving always follows a set of axes. In this lesson you'll choose that point, so objects turn around the 3D cursor or each around its own origin. You'll also move a tilted object along its own axes instead of the world's.

![Seen from the top, twelve planks turned around the 3D cursor into a ring. Beside them, a tilted sign moving along its own X axis.](example)

## Steps

1. **Open the pivot pie.** Press `.` over the viewport for the Pivot Point pie, or use the pivot menu in the viewport header. It starts on Median Point, the middle of the selected objects' origins.

   ![The Pivot Point pie: Bounding Box Center, 3D Cursor, Individual Origins, Median Point, Active Element and the Only Locations switch, with Median Point picked out.](pivot-pie)

2. **Turn around the 3D cursor.** Choose 3D Cursor and put the cursor where the centre of the turn should be. Now `R`, `Z`, `30` swings the selection 30 degrees around the cursor, the way a spoke turns around a hub.

   ![Seen from the top, a plank 2 m from the 3D cursor swinging 30 degrees around it.](around-cursor)

3. **Turn each one in place.** Choose Individual Origins to rotate or scale every selected object around its own origin. With Median Point, the same `R` swings the whole group around its middle.

   ![Three planks turned 90 degrees. Left, with Individual Origins, each turns in place. Right, with Median Point, the row swings around its middle.](individual)

4. **Open the orientation pie.** Press `,` for the Transform Orientation pie. Global, where you start, uses the world's axes. Local uses the active object's own axes, which turn with the object.

   ![A tilted sign with two sets of axes: the world's Global axes, and its own Local axes tilted with it.](orientations)

5. **Move along the object's own axis.** Press the axis letter twice. With Global orientation, `G`, `X`, `X` moves along the object's own X axis, and a third `X` takes the lock off. The header names the axis in use.

   ![The tilted sign sliding along its own X axis into a wire outline, after G, X and X.](local-move)

## Common mistake

![Left, a block rotated while the pivot point is still on 3D Cursor: it swings away across the scene. Right, the same rotation with Median Point: it turns where it stands.](mistake)

The pivot point stays on 3D Cursor until you change it. The next time you rotate an object, it swings around the cursor and across the scene. If an object flies off when you rotate it, press `.` and choose Median Point.

## Checking your work

Look at the planks and the sign from the top and the front:

1. From the top, the twelve planks make an evenly spaced ring.
2. Plank 12's Rotation Z reads 330 degrees in the Sidebar.
3. The sign sits inside its wire outline from every side.
4. The pivot point is back on Median Point.
