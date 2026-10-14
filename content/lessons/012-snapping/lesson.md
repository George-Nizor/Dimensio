---
needs: [transform]
exercise: stack-and-fence
watch: [cgcookie-pivots-snapping, blender-manual-editors-3dview-controls-snapping]
sources:
  - Blender 5.2 Manual, "Snapping", the magnet (Shift+Tab), holding Ctrl, the Snapping menu (Shift+Ctrl+Tab), Snap Base and Snap Target and what each option snaps (https://docs.blender.org/manual/en/5.2/editors/3dview/controls/snapping.html), read 2026-10-15
  - Blender 5.2 Manual, "Transform Modal Map", Ctrl to snap during a transform, B to set the Snap Base (https://docs.blender.org/manual/en/5.2/modeling/transform/modal_map.html), read 2026-10-15
  - Blender 5.2 Manual, "Precision", with Increment, Ctrl moves in 1 unit steps at the usual zoom (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/control/precision.html), read 2026-10-15
  - Blender 5.2 Manual, "Snap" menu (Shift+S), Selection to Cursor, Cursor to Selected, Cursor to World Origin (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/snap.html), read 2026-10-15
  - Blender 5.2.2, the Snapping popover's labels Snap Base and Snap Target, the Snap pie's items, and snapping off with Increment as the target in a factory start (5.2/scripts/startup/bl_ui/space_view3d.py), checked 2026-10-15
  - Blender commit 3010f1233b, "Transform, new feature to edit the 'Snap Base'", B starts it and B, a left click or Enter confirms the point (https://projects.blender.org/blender/blender/commit/3010f1233b), read 2026-10-15
  - CG Cookie, "Pivots, Snapping, and Proportional Editing in Blender" (https://www.youtube.com/watch?v=PfBO0Gfla_Y), read 2026-10-15
---

# Snapping

Snapping makes the object you move jump exactly onto the grid or onto another object, so parts meet with no gaps between them. In this lesson you'll snap with `Ctrl` and choose what to snap to and which point snaps. You'll also move objects and the 3D cursor with the Snap menu.

![Three blocks stacked corner to corner into a tower, beside five posts standing 2 m apart along a strip of ground.](example)

## Steps

1. **Hold Ctrl to snap.** Press `G` and hold `Ctrl` while you move the mouse. The object snaps to the Snap Target, which starts as Increment: steps of one grid square, 1 m at the usual zoom. Let go of `Ctrl` to move freely.

   ![A block moving in 1 m steps across the grid while Ctrl is held, its earlier positions drawn faintly.](ctrl-steps)

2. **Choose a Snap Target.** Open the Snapping menu beside the magnet in the viewport header, or press `Shift+Ctrl+Tab`. Grid snaps to the grid's lines, Vertex to the nearest corner, Face to the surface under the mouse and Face Center to a face's middle.

   ![The Snapping menu: Snap Base set to Closest, and the Snap Target list with Vertex picked out.](snap-menu)

3. **Choose the Snap Base.** Snap Base, at the top of the same menu, is the point of your object that lands on the target. Closest picks the corner nearest the target and Center picks the origin. Press `B` while moving to click a point yourself.

   ![A block with its nearest corner picked out for Closest, beside the same block with its origin picked out for Center.](snap-base)

4. **Stack corner to corner.** Set the target to Vertex. Press `G`, then `B`, and click the bottom corner of your block that should land. Hold `Ctrl` and bring the mouse to the matching top corner of the other block, then click when the corners meet.

   ![A block moving onto another: its bottom corner snaps onto the other block's top corner, both corners picked out.](stack)

5. **Use the Snap menu.** Press `Shift+S` for the Snap pie. Cursor to Selected puts the 3D cursor on the selection, and Cursor to World Origin puts it back at the centre. Selection to Cursor moves the selected objects to the cursor.

   ![The Snap pie around the mouse, with Selection to Cursor, Cursor to Selected and Cursor to World Origin picked out.](snap-pie)

CG Cookie usually leaves the magnet off and holds `Ctrl` when they want to snap. Click the magnet, or press `Shift+Tab`, to snap on every move until you turn it off.

## Common mistake

![Left, seen from the top, a post snapped to the grid with Snap Base on Closest: its corner sits on the grid point and the post is off centre. Right, with Snap Base on Center: the post's middle sits on the grid point.](mistake)

With Snap Base still on Closest, a post snapped to the grid lands with a corner on the grid point. Its middle then sits 0.1 m off the whole metre. Set Snap Base to Center to put the post's origin on the grid point.

## Checking your work

Look at the blocks and posts from the front and the top:

1. Block 2 sits on Block 1, and Block 3 on Block 2, edges in line.
2. From the front, no gap or overlap shows between the blocks.
3. The posts' Location X values read 0, 2, 4, 6 and 8 m.
4. Every post's Location Y and Z read 0.
