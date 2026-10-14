---
needs: [navigation]
exercise: sketch-a-prop
watch: [grant-abbitt-grease-pencil, janice-journal-grease-pencil]
sources:
  - 'Blender 5.2 Manual, "Grease Pencil: Introduction", Quick Start (https://docs.blender.org/manual/en/5.2/grease_pencil/introduction.html), read 2026-10-15'
  - Blender 5.2 Manual, "Grease Pencil Primitives", Add > Grease Pencil > Blank (https://docs.blender.org/manual/en/5.2/grease_pencil/primitives.html), read 2026-10-15
  - 'Blender 5.2 Manual, "Draw Mode: Introduction" (https://docs.blender.org/manual/en/5.2/grease_pencil/modes/draw/introduction.html), read 2026-10-15'
  - Blender 5.2 Manual, "Brush Tool", Ctrl to erase (https://docs.blender.org/manual/en/5.2/grease_pencil/modes/draw/tools/brush.html), read 2026-10-15
  - Blender 5.2 Manual, "Draw Brushes", Size with F and Stroke Mode (https://docs.blender.org/manual/en/5.2/grease_pencil/modes/draw/brushes/draw.html), read 2026-10-15
  - Blender 5.2 Manual, "Drawing Plane" (https://docs.blender.org/manual/en/5.2/grease_pencil/modes/draw/drawing_planes.html), read 2026-10-15
  - Blender 5.2 Manual, "Stroke Placement" (https://docs.blender.org/manual/en/5.2/grease_pencil/modes/draw/stroke_placement.html), read 2026-10-15
  - Blender 5.2 Manual, "Grease Pencil Materials", Stroke and Fill (https://docs.blender.org/manual/en/5.2/grease_pencil/materials/index.html), read 2026-10-15
  - Blender 5.2 Manual, "Layers" (https://docs.blender.org/manual/en/5.2/grease_pencil/properties/layers.html), read 2026-10-15
  - Blender 5.1 release notes, "Grease Pencil", the Stroke, Fill and Both setting (https://developer.blender.org/docs/release_notes/5.1/grease_pencil/), read 2026-10-15
  - Grant Abbitt, "Draw on 3D Objects in Blender with Grease Pencil", Surface placement and Offset (https://www.youtube.com/watch?v=wskCvU7_xtc), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15, a Blank object's layer and material, the brush list and the Stroke Mode buttons in the tool header
---

# Drawing with Grease Pencil

Grease Pencil lets you draw by hand inside a 3D scene. Your strokes become an object of their own, so you can sketch an idea beside a model and orbit around it. In this lesson you'll add a Grease Pencil object, draw strokes and fills on a plane you choose, and keep lines and fills on separate layers.

![A chest sketched in 3D: its front drawn on the X-Z plane and its side on the Y-Z plane, crossing at the origin.](example)

## Steps

1. **Add a Grease Pencil object.** In Object Mode, press `Shift+A` and choose Grease Pencil > Blank. The new object, GPencil, starts with one layer called Layer and one material called Black.

   ![The Add menu with Grease Pencil open and Blank picked out.](add-menu)

2. **Draw in Draw Mode.** Choose Draw Mode in the 3D Viewport header's mode menu. Pick a brush, such as Ink Pen, from the asset shelf along the bottom. Drag to draw. Press `F` to resize the brush, and hold `Ctrl` while dragging to erase.

   ![The 3D Viewport in Draw Mode, with a stroke, the brush circle and the asset shelf of brushes with Ink Pen picked out.](draw-mode)

3. **Choose the drawing plane.** Every new stroke lies on a plane. In the header, set Drawing Plane to Front (X-Z) for a front view or Side (Y-Z) for a side view. Stroke Placement stays on Origin, so the plane passes through the object's origin.

   ![The Drawing Plane pop-over with Front (X-Z) chosen, beside strokes lying on the X-Z plane.](plane)

4. **Draw strokes, fills or both.** The header has three buttons for the brush: Stroke, Fill and Both. Fill and Both fill the area inside the shape you draw. A fill's colour comes from Material properties > Surface > Fill > Base Color.

   ![The same shape drawn three ways: outline only with Stroke, fill only with Fill, and fill with outline with Both.](stroke-fill)

5. **Keep lines and fills on layers.** In the Object Data properties, the Layers panel lists the layers. Click + to add one and double-click it to rename it. New strokes go onto the selected layer, and layers higher in the list draw over lower ones.

   ![The Layers panel with Lines selected above Fills, each with its eye and lock icons, and the + button.](layers)

Grant Abbitt's quick start sets Stroke Placement to Surface, which sticks strokes onto a mesh, and raises its Offset to stop them flickering.

## Common mistake

![Left, the chest's parts drawn on View from three angles, falling apart when seen from a new angle. Right, every part drawn on Front (X-Z), holding together from the same angle.](mistake)

Drawing Plane starts on View. If you leave it there and orbit between strokes, each stroke lies flat to the view you drew it from. From any other angle the drawing falls apart. Set Front (X-Z) or Side (Y-Z) first, and draw from that view.

## Checking your work

Orbit around your sketch and check:

1. The front and side drawings stand at right angles to each other.
2. `Numpad 1` shows the front drawing square on, and `Numpad 3` the side.
3. Lines and fills are on two layers, with the lines on top.
4. Hiding the fill layer with its eye icon leaves every line in place.
