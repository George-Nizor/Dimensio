---
needs: [interface]
exercise: find-the-letters
watch: [cgcookie-navigation, blender-viewport-navigation]
sources:
  - "Blender 5.2 Manual, \"Navigation\": Orbit, Pan, Zoom, Frame All and Frame Selected (https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/navigation.html), read 2026-10-15"
  - Blender 5.2 Manual, "Viewpoint" (https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/viewpoint.html), read 2026-10-15
  - Blender 5.2 Manual, "Perspective/Orthographic" (https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/projections.html), read 2026-10-15
  - Blender 5.2 Manual, "Navigating", Navigation Gizmo (https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/introduction.html), read 2026-10-15
---

# Viewport navigation

To model something you need to see it from every side. In this lesson you'll learn to orbit, pan and zoom the 3D Viewport with the mouse. You'll also jump to the front, side and top views with the numpad, and bring a lost object back into view.

![One shape seen four ways: from the front, from the right, from the top, and from Blender's opening view.](example)

## Steps

1. **Orbit.** Hold the middle mouse button (press the wheel down) and drag in the 3D Viewport. The view turns around the point you're looking at.

   ![The cube with an arrow curving around it, beside a mouse with its wheel picked out.](orbit)

2. **Pan and zoom.** Hold `Shift` and drag with the middle mouse button to slide the view without turning it. Roll the wheel to zoom in and out, or hold `Ctrl` and drag with the middle mouse button.

   ![Left, arrows sliding the cube sideways with Shift and the middle mouse button. Right, the cube drawn small and large with the wheel between them.](pan-zoom)

3. **Jump to a view.** Press `Numpad 1` for the front view, `Numpad 3` for the right and `Numpad 7` for the top. Add `Ctrl` for the opposite side: the back, the left or the bottom.

   ![The numpad with 1, 3 and 7 picked out, beside a shape seen from the front, the right and the top.](views)

4. **Switch the projection.** Press `Numpad 5` to switch between perspective and orthographic. In orthographic, objects stay the same size however far away they are, which makes proportions easier to judge.

   ![A row of three cubes going away from you, shrinking in perspective and staying the same size in orthographic.](projection)

5. **Find what you lost.** Press `Home` to fit everything in the scene into the view. To look at one object, select it and press `Numpad .` to fill the view with it.

   ![Left, a small object far off in the corner of the view. Right, the same object filling the view after Numpad . .](frame)

6. **Use the gizmo.** The navigation gizmo in the top right of the 3D Viewport works without a numpad. Drag it to orbit. Click an axis letter to look along that axis, and click it again for the opposite side.

   ![The navigation gizmo with its Z ball picked out, beside the cube seen from the top after clicking it.](gizmo)

## Common mistake

![Left, an arrow orbiting around empty space far from the cube, so the cube swings out of view. Right, the cube framed with Numpad . and the arrow orbiting around it.](mistake)

When you lose track of a model, orbiting and zooming in search of it usually makes things worse. The view keeps turning around a point that isn't on the model. Stop and press `Home`, or select the model and press `Numpad .`, then orbit.

## Checking your work

Go back over the exercise file and check:

1. You found all six letters, one on each prop.
2. Read from Prop 1 to Prop 6, the letters spell a word.
3. You found each letter with the numpad views or the gizmo, rather than by orbiting.
4. `Home` brings every prop back into view at once.

If you have no numpad or middle mouse button, lesson 4 shows how to do all of this on a laptop.
