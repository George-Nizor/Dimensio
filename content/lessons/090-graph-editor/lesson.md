---
needs: [dope-sheet]
exercise: door-and-lamp
watch: [ryan-king-graph-editor, grant-abbitt-animation-graph-editor]
sources:
  - 'Blender 5.2 Manual, "Graph Editor: Introduction", keyframes and handles, Frame All, Local View (https://docs.blender.org/manual/en/5.2/editors/graph_editor/introduction.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "F-Curves: Introduction" (https://docs.blender.org/manual/en/5.2/editors/graph_editor/fcurves/introduction.html), read 2026-10-15'
  - Blender 5.2 Manual, "F-Curve Properties", Interpolation, Easing, Handle Types (https://docs.blender.org/manual/en/5.2/editors/graph_editor/fcurves/properties.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing F-Curves", Handle Type V, Interpolation Mode T, Easing Type Ctrl+E, Copy and Paste (https://docs.blender.org/manual/en/5.2/editors/graph_editor/fcurves/editing.html), read 2026-10-15
  - 'Blender 5.2 Manual, "Channels: Editing", Extrapolation Mode Shift+E and Make Cyclic (https://docs.blender.org/manual/en/5.2/editors/graph_editor/channels/editing.html), read 2026-10-15'
  - Blender 5.2 Manual, "F-Curve Modifiers", Cycles (https://docs.blender.org/manual/en/5.2/editors/graph_editor/fcurves/modifiers.html), read 2026-10-15
  - 'Blender 5.2.2, checked 2026-10-15 in a script: new keys are Bézier with Auto Clamped handles; a Cycles modifier on two keys at -15 and 15 degrees jumps from 15 back to -15 every 24 frames, and on three keys ending back at -15 it swings smoothly'
---

# The Graph Editor

The Graph Editor draws each animated value as a curve, with time running across and the value running up. The shape of that curve decides whether a motion eases in, stops dead or repeats. In this lesson you'll change interpolation, easing and handles, and loop a curve forever.

![Two curves: a door's rotation rising faster and faster to a dead stop at frame 20, and a lamp's swing repeating to frame 96.](example)

## Steps

1. **Open the Graph Editor.** Select the door and change an area to the Graph Editor with its Editor Type button. Each animated value is an F-curve, with frames across and the value up. Keys are dots with a handle either side. `Home` shows every curve.

   ![The door's rotation curve from 0 at frame 1 to 100 at frame 20, with a handle either side of each key.](anatomy)

2. **Pick one curve.** Click Z Euler Rotation in the channel list on the left to select that curve. Press `/` to show only the selected curve while you work, and press it again to bring the others back.

3. **Change the interpolation.** Select keys and press `T`. Constant holds the value, then jumps. Linear moves at one steady speed. Bézier, the default, starts and stops smoothly. A key's setting shapes the curve from that keyframe to the next.

   ![The same two keys with Constant, Linear and Bézier interpolation: a step, a straight line and a smooth S.](interpolation)

4. **Make a hard stop.** Select the door's first key, press `T` and choose Quadratic, then press `Ctrl+E` and choose Ease In. The door starts slowly and gets faster all the way to frame 20, where it stops dead, as if it hit a door stop.

   ![Left, the default Bézier, slow at both ends. Right, Quadratic with Ease In, getting steeper right up to the last key.](ease)

5. **Shape it with handles.** Press `V` to set the handle type of the selected keys. Vector points each handle at the neighbouring key, which gives a sharp corner. Dragging a handle with `G` bends the curve near its key.

   ![Left, a curve over three keys with Auto Clamped handles, flat at each key. Right, Vector handles on the middle key making a sharp peak.](handles)

6. **Loop it.** Select the lamp. Copy its first keyframe with `Ctrl+C`, go to frame 49 and paste it with `Ctrl+V`, so the swing comes back. Then press `Shift+E` and choose Make Cyclic. A Cycles modifier repeats the curve forever.

   ![The lamp's curve keyed on frames 1, 25 and 49, then repeated after frame 49 by the Cycles modifier.](cyclic)

## Common mistake

![Above, a loop made from two keys, jumping from 15 back to -15 at every repeat. Below, the first key copied to frame 49, so the curve flows into each repeat.](mistake)

Make Cyclic repeats the curve exactly as it is. With only two keys, out at -15 degrees and back at 15, every repeat snaps from 15 straight to -15. Copy the first keyframe to the end before you make a curve cyclic.

## Checking your work

Play the animation from frame 1 and check:

1. The door speeds up and stops dead on frame 20.
2. The lamp swings out and back with no jump.
3. The lamp keeps swinging all the way to frame 96.
4. The Sidebar's Modifiers tab shows a Cycles modifier on the lamp's curve.
