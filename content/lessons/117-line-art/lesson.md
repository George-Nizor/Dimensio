---
needs: [grease-pencil, eevee]
exercise: outline-the-kit
watch: [pixxo-3d-line-art, blender-manual-grease-pencil-modifiers-line-art]
sources:
  - Blender 5.2 Manual, "Line Art Modifier", the active camera, Line Radius, Edge Types and Crease Threshold (https://docs.blender.org/manual/en/5.2/grease_pencil/modifiers/generate/line_art.html), read 2026-10-15
  - Blender 5.2 Manual, "Grease Pencil Primitives", Scene, Collection and Object Line Art (https://docs.blender.org/manual/en/5.2/grease_pencil/primitives.html), read 2026-10-15
  - 'Blender 5.2 Manual, "Object Properties: Line Art", Usage (https://docs.blender.org/manual/en/5.2/scene_layout/object/properties/line_art.html), read 2026-10-15'
  - Blender 5.2 Manual, "Camera View", Set Active Object as Camera (https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/camera_view.html), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15, Scene Line Art on a cube and an eight-sided cylinder rendered with EEVEE, with no camera (no strokes), Line Radius 0.0025, 0.01 and 0.02, and Crease Threshold 140 and 130 degrees
---

# Line Art

Line Art draws outlines around 3D models for you, as Grease Pencil strokes that follow the models from frame to frame. It suits a flat, illustrated look for game renders. In this lesson you'll add Line Art to a scene, set the line width and choose which edges get lines.

![A wall, an eight-sided pillar and a crate rendered with an outline round each piece and lines on their sharp edges.](example)

## Steps

1. **Point a camera at the models.** Line Art draws only what the scene's active camera can see, so set up the camera first. Press `Numpad 0` to look through it and check every model you want outlined is in view.

2. **Add Line Art.** In Object Mode, press `Shift+A` and choose Grease Pencil > Scene Line Art for every object, or Collection Line Art for the active collection. Blender adds a Grease Pencil object with a Line Art modifier.

   ![Add > Grease Pencil with Scene, Collection and Object Line Art, Collection Line Art picked out.](add-menu)

3. **Set the line width.** Select the new Line Art object and open the Modifier properties. Line Radius sets how thick the lines are. The default, 0.0025, is hard to see from a few metres away, so try 0.02.

   ![The Line Art modifier with its source collection, Line Radius set to 0.02, and its Edge Types.](modifier)

4. **Choose which edges get lines.** Under Edge Types, Contour draws outlines and Crease draws edges where faces meet at less than Crease Threshold, 140° by default. An eight-sided pillar's sides meet at 135°, so each gets a line. At 130° only its outline stays.

   ![The same eight-sided pillar with a line on every side edge at Crease Threshold 140°, and only its outline at 130°.](crease)

5. **Render the lines.** Press `F12` to render with EEVEE. The lines draw over the models. Save the picture from the render window with Image > Save As.

## Common mistake

![Left, a scene with no camera and no lines. Right, the same scene with an active camera and its lines drawn.](mistake)

A Line Art object that draws nothing usually means the scene has no camera, or the models are outside its view. Line Art works from the active camera. Add one, or select a camera and press `Ctrl+Numpad 0` to make it the active camera.

## Checking your work

Render the scene and check:

1. Every model in the camera's view has an outline.
2. Round parts have lines on their sides only where you wanted them.
3. The lines are thick enough to read at the render's full size.
4. Hiding the Line Art object takes every line away and leaves the models.
