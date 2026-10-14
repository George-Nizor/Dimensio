---
needs: [selecting]
exercise: match-the-targets
watch: [cgcookie-transforming, blender-manual-scene-layout-object-editing-transform-control-numeric-input]
sources:
  - Blender 5.2 Manual, "Move" (G), "Rotate" (R) and "Scale" (S), with left click to confirm and the amounts shown in the header (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/move.html), read 2026-10-15
  - Blender 5.2 Manual, "Rotate" (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/rotate.html) and "Scale" (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/scale.html), read 2026-10-15
  - Blender 5.2 Manual, "Axis Locking", X, Y and Z, and Shift with an axis to lock a plane (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/control/axis_locking.html), read 2026-10-15
  - Blender 5.2 Manual, "Numeric Input", typing an amount, Minus to negate, Enter to confirm (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/control/numeric_input.html), read 2026-10-15
  - Blender 5.2 Manual, "Precision", Ctrl snaps to 1 unit, 5 degrees and 0.1 of the scale, Shift moves at a tenth of the speed (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/control/precision.html), read 2026-10-15
  - Blender 5.2 Manual, "Transform" properties in the Sidebar's Item tab (https://docs.blender.org/manual/en/5.2/scene_layout/object/properties/transforms.html), read 2026-10-15
  - Blender 5.2 Manual, "Clear", Alt+G, Alt+R and Alt+S (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/clear.html), read 2026-10-15
  - Blender 5.2.2 default keymap, Transform Modal Map, left click or Enter confirms, right click or Esc cancels (5.2/scripts/presets/keyconfig/keymap_data/blender_default.py), checked 2026-10-15
  - CG Cookie, "Transforming Objects in Blender" (https://www.youtube.com/watch?v=lYr25_YeuL8), read 2026-10-15
---

# Move, rotate and scale

Building a model means putting each part in place at the right size. In this lesson you'll move, rotate and scale objects with `G`, `R` and `S`, lock each change to one axis and type exact amounts. You'll also read and set the same values in the Sidebar.

![One block moved along X, turned around Z and stretched along Z, each change shown beside the block it started as.](example)

## Steps

1. **Move with G.** Select an object, press `G` and move the mouse. Left click to put it down where it is, or right click or press `Esc` to cancel and put it back.

   ![A block with an arrow beside it showing the move, and the mouse's left button picked out to confirm.](move)

2. **Rotate and scale.** Press `R` to rotate the selected object and `S` to scale it, both around its origin. With `S`, move the mouse away from the object to make it bigger, and towards it to make it smaller.

   ![Left, a block turning around its origin with R. Right, a block growing with S as the mouse moves away from it.](rotate-scale)

3. **Lock to an axis.** After `G`, `R` or `S`, press `X`, `Y` or `Z` to work along that axis only. A line in the axis colour shows it. `Shift+Z` locks out Z instead, so the object moves only across the floor.

   ![A block moving along a red line, the X axis, after G and X.](axis-lock)

4. **Type an amount.** While transforming, type a number and press `Enter`. `G`, `Z`, `2` moves 2 m up, and `R`, `X`, `90` turns 90 degrees. `S`, then 0.5, halves the size. Type a minus before the number to go the other way.

   ![The keys G, Z, 2 and Enter, and a block lifted exactly 2 m.](type-amount)

5. **Snap or slow down.** Hold `Ctrl` while moving the mouse to work in steps: 1 m at the usual zoom, 5 degrees, or 0.1 of the size. Hold `Shift` instead and the object moves ten times more slowly than the mouse, for fine changes.

   ![Seen from the top, a block turning in 5 degree steps while Ctrl is held, its earlier positions drawn faintly.](steps)

6. **Use the Sidebar.** Press `N` and open the Item tab. Location, Rotation and Scale show the active object's values, and you can click any field and type a new one. `Alt+G`, `Alt+R` and `Alt+S` reset location, rotation and scale.

   ![The Sidebar's Item tab with its Location, Rotation, Scale and Dimensions fields.](sidebar)

CG Cookie's Blender Basics series teaches the same keys, and shows the Move, Rotate and Scale tools in the Toolbar, which do the same with handles you drag.

## Common mistake

![Left, a block moved freely with G: from the front it looks right, but from the top it has drifted backwards. Right, the same move locked to X: front and top both show it in line.](mistake)

With `G` alone, the object slides parallel to the screen. Seen from above at an angle, that also carries it forwards or back, which you only notice from another side. Lock the move to an axis, or move in a front or top view.

## Checking your work

Look at each pair from the front, the right and the top with the numpad:

1. Every block sits exactly inside its wire outline from all three views.
2. Block 8 lies flat on the grid.
3. In the Sidebar, Block 6's Scale reads 1.5 on every axis.
4. No Location or Rotation has stray decimals, such as 1.9873.

If a block goes wrong, `Ctrl+Z` takes back the last change.
