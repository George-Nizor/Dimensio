---
needs: []
exercise: tour-the-default-scene
watch: [blenderguru-donut-2026-1]
sources:
  - Blender 5.2 Manual, "Navigation" (https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/navigation.html), read 2026-10-15
  - Blender 5.2 Manual, "Viewpoint" (https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/viewpoint.html), read 2026-10-15
  - Blender 5.2 Manual, "Perspective/Orthographic" (https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/projections.html), read 2026-10-15
  - Blender 5.2 Manual, "Overlays", Text Info (https://docs.blender.org/manual/en/5.2/editors/3dview/display/overlays.html), read 2026-10-15
  - Blender 5.2 Manual, "Input" preferences, Emulate Numpad and Emulate 3 Button Mouse (https://docs.blender.org/manual/en/5.2/editors/preferences/input.html), read 2026-10-15
  - Blender Guru, "Blender Donut Tutorial Part 1 (2026)", chapter "Navigation" at 1:30 (https://www.youtube.com/watch?v=-tbSCMbJA6o), watched 2026-10-15
---

# Viewport navigation

To build a model well, you need to see it from every side. In this lesson you'll learn to turn, slide and zoom the view in the 3D Viewport with the mouse. Then you'll jump to the front, right and top views with the numpad.

## Steps

1. **Orbit.** Hold the middle mouse button and drag in the 3D Viewport to turn the view around the scene. Right click while you drag to cancel and go back to where you started.

2. **Pan.** Hold `Shift` and drag with the middle mouse button to slide the view left, right, up or down without turning it.

3. **Zoom.** Scroll the mouse wheel to move closer or further away. For finer control, hold `Ctrl` and drag up or down with the middle mouse button.

4. **Snap to a view.** Press `Numpad 1` for the front view, `Numpad 3` for the right view and `Numpad 7` for the top. Hold `Ctrl` with the same keys for the back, left and bottom.

   ![A numpad with 7 marked top, 1 marked front, 3 marked right, 5 marked perspective or orthographic and the period key marked frame selected.](numpad)

5. **Switch the projection.** Press `Numpad 5` to swap between perspective and orthographic. In orthographic, far things stay the same size as near ones, which makes proportions easier to judge.

6. **Find your way back.** Press `Home` to fit everything in the scene into the view. Select an object with a left click and press `Numpad Period` to fit that object alone.

On a laptop without a numpad or a middle mouse button, open Edit > Preferences > Input and turn on Emulate Numpad and Emulate 3 Button Mouse. The number keys then work as the numpad, and `Alt` with a left drag orbits.

## Common mistake

The most common mistake is getting lost. The model drifts out of the view, or you zoom so far in that scrolling stops moving you. Press `Home` to see everything again, or select the model and press `Numpad Period` to centre the view on it.

## Checking your model

Check these in the starter scene before you add it:

1. You can centre any object in the view with `Numpad Period`.
2. The text at the top left of the view names the view you're in.
3. You can go from the front view to the top view without the mouse.
4. After orbiting anywhere, `Home` brings every object back into view.
