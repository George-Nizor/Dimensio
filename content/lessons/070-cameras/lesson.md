---
needs: [navigation]
exercise: three-shots
watch: [cgcookie-cameras-rendering, ryan-king-camera]
sources:
  - 'Blender 5.2 Manual, "Camera View": Numpad 0, Ctrl+Numpad 0 and Frame Camera Bounds (https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/camera_view.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Align View", Align Active Camera to View with Ctrl+Alt+Numpad 0 (https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/align.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Sidebar", View Lock and Camera to View (https://docs.blender.org/manual/en/5.2/editors/3dview/sidebar.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Cameras": Focal Length, Orthographic Scale, Depth of Field, Passepartout and Composition Guides (https://docs.blender.org/manual/en/5.2/render/cameras.html), read 2026-10-15'
  - 'Blender 5.2.2, factory startup scene, camera Focal Length 50 mm and Passepartout on, checked 2026-10-15'
---

# Cameras

The camera decides what a render shows and where it is seen from. In this lesson you'll look through the camera, move it to a view you like, choose a lens and set up a flat orthographic shot of a prop.

![Three shots of the same props through their camera frames: a wide shot at 50 mm, a close-up of the lantern at 85 mm and an orthographic front view.](example)

## Steps

1. **Look through the camera.** Press `Numpad 0`. Only what is inside the dashed frame renders. The darker band around it is the passepartout, which you can turn off under Viewport Display in the camera's properties.

   ![The view through the camera: the props inside a dashed frame, with a darker band around the frame.](camera-view)

2. **Move the camera to your view.** Orbit to an angle you like, then press `Ctrl+Alt+Numpad 0`. The camera jumps to where you are looking from, and you see through it.

   ![Seen from above: the camera's old place drawn dashed, an arrow, and the camera at the new view, aimed at the props.](align)

3. **Steer the camera.** Press `N` for the Sidebar and open its View tab. Under View Lock, tick Camera to View. Now orbiting, panning and zooming in camera view move the camera, and the frame turns red. Untick it when the shot is right.

   ![The Sidebar's View tab with Camera to View ticked, beside the camera view with its frame outlined in dashes and an arrow orbiting under it.](lock)

4. **Choose a lens.** Select the camera and open the Object Data tab, the green camera, in the Properties editor. Focal Length starts at 50 mm. A lower number fits more in and stretches depth. A higher one, such as 85 mm, flattens a close-up.

   ![The props framed at the same size at 24 mm from close up, with the barrel's top looming large, and at 85 mm from further back, looking flatter.](lens)

5. **Make an orthographic shot.** Set Type to Orthographic. Distant things no longer shrink, which suits a straight front view of a game asset. Raise Orthographic Scale to fit more into the frame.

   ![The front view through a perspective camera and through an orthographic one, with Orthographic Scale marked across the orthographic frame.](ortho)

6. **Compose with a guide.** Under Viewport Display, open Composition Guides and tick Thirds. Two lines each way split the frame into thirds. Put the main prop on a line, or where two lines cross.

   ![The camera frame divided into thirds, with the lantern circled where the left and upper lines cross.](thirds)

## Common mistake

![Left, the view after orbiting with Camera to View off: no frame, and the camera still standing where it was. Right, Camera to View on: the frame stays, outlined in dashes.](mistake)

You orbit in camera view to improve the shot, but Blender leaves camera view and the camera stays where it was. `Numpad 0` brings the old shot back. Tick Camera to View before you steer, or press `Ctrl+Alt+Numpad 0` while the view you want is on screen.

## Checking your work

Look through each camera in turn, selecting it and pressing `Ctrl+Numpad 0`:

1. Wide shows all three props with space around them.
2. Close fills most of the frame with the lantern, at 85 mm.
3. Front is orthographic and looks straight at the props.
4. Camera to View is off again in the Sidebar.

If the frame sits small or off to one side, press `Home` in camera view to fit it to the viewport.
