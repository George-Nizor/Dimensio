---
needs: [extrude]
exercise: panels-and-window
watch: [cgcookie-extrude-inset-knife, blender-manual-modeling-meshes-editing-face-inset-faces]
sources:
  - 'Blender 5.2 Manual, "Inset Faces": I, Ctrl for Depth, I again for Individual, Thickness and Depth in the Adjust Last Operation panel (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/inset_faces.html), read 2026-10-15'
  - Blender 5.2 Manual, "Extrude Faces Along Normals" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/extrude_faces_normal.html), read 2026-10-15
  - Blender 5.2.2, an inset of all six faces of the default cube, as one patch (no change) and as individual faces, measured with blender/dimensio_check.py, checked 2026-10-15
---

# Inset

An inset adds a border of faces inside a face and leaves a smaller copy of it in the middle. In this lesson you'll inset faces to make borders and frames. Then you'll push or pull the middle face to make panels, the start of many crates and windows.

![A box with a sunken panel on every side, and a wall with a raised window frame and the glass set back.](example)

## Steps

1. **Inset a face.** Select a face and press `I`. Move the mouse towards the face's middle to set the border's thickness, or type a number such as 0.2, then click. A ring of new faces now runs round a smaller face in the middle.

   ![The cube's top face inset: a ring of four new faces round a smaller face, which stays selected.](inset-face)

2. **Push the middle in or out.** The middle face stays selected after the inset. Press `E` and move it in for a sunken panel, or out for a raised one. Typing -0.1 sinks it 10 cm.

   ![The inset top face pushed into the cube with E, making a sunken panel inside the border.](panel)

3. **Inset faces one by one.** With several faces selected, `I` insets them as one patch, with a single border round the outside. Press `I` a second time while insetting to switch to Individual, and every face gets a border of its own.

   ![Two neighbouring faces inset. Left, as one patch with one border round both. Right, as individual faces, each with its own border.](individual)

4. **Change it afterwards.** The Adjust Last Operation panel at the bottom left of the viewport holds Thickness and Depth. Depth raises or lowers the middle face as part of the inset. Hold `Ctrl` while insetting to set it with the mouse.

   ![The Inset Faces panel with Thickness 0.2 m and Depth 0 m, and Individual ticked.](adjust)

## Common mistake

![Left, every face of the box selected and inset as one patch: nothing changes. Right, the same inset as individual faces: a border on every side.](mistake)

With every face of a box selected, `I` seems to do nothing. A patch inset puts its border along the outside edge of the selection, and a closed box has none. Press `I` again while insetting, for Individual.

## Checking your model

Look at the box and the wall from a few sides:

1. Every side of the box has a sunken panel inside an even border.
2. The window frame stands out from the wall.
3. The middle of the window sits back behind the frame.
4. Every face has four corners.
