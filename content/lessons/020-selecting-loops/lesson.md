---
needs: [edit-mode]
exercise: select-the-targets
watch: [grant-abbitt-selecting, blender-manual-modeling-meshes-selecting-loops]
sources:
  - 'Blender 5.2 Manual, "Select Loops": edge loops with Alt+click and Shift+Alt+click, face loops, edge rings with Ctrl+Alt+click, double click with Emulate 3 Button Mouse (https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/loops.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Select Linked": Ctrl+L, L under the mouse, Shortest Path with Ctrl+click (https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/linked.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Mesh Selecting: Introduction": More and Less with Ctrl+Numpad + and Ctrl+Numpad -, Select Similar Shift+G (https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/introduction.html), read 2026-10-15'
  - Blender 5.2.2, the Edit Mode keymap for loop, ring, shortest path, linked and more or less selection in 5.2/scripts/presets/keyconfig/keymap_data/blender_default.py, checked 2026-10-15
  - Grant Abbitt, "Why You're Selecting Wrong in Blender" (https://www.youtube.com/watch?v=aCltLvsGxNw), checked 2026-10-15
---

# Selecting loops

Clicking parts one at a time is slow on a mesh with hundreds of them. In this lesson you'll select a whole loop of edges or faces in one click, the path between two parts, and everything joined together. You'll also grow and shrink a selection a ring at a time.

![A cylinder with one edge loop selected all the way round it, a band of faces selected on a second cylinder, and a path of faces across a grid.](example)

## Steps

1. **Select an edge loop.** Hold `Alt` and click an edge. Blender selects the edges that carry on from it in a straight line, usually all the way round the mesh. This is called an edge loop. `Shift+Alt`+click adds another loop to the selection.

   ![A cylinder with one horizontal edge loop selected, the mouse pointer on one of its edges.](edge-loop)

2. **Select a face loop.** In Face select mode, `Alt`+click an edge to select the row of faces running across it. Click near an edge that crosses the band you want: a vertical edge gives a horizontal band.

   ![A cylinder in Face select mode with one horizontal band of faces selected, the pointer on a vertical edge inside the band.](face-loop)

3. **Select an edge ring.** In Edge select mode, `Ctrl+Alt`+click an edge to select the edges side by side with it across one row of faces. This is called an edge ring. A loop runs end to end; a ring runs side by side.

   ![A cylinder with the vertical edges of one band selected all the way round: an edge ring.](edge-ring)

4. **Select a path.** Click one part, then `Ctrl`+click another. Blender selects the shortest path between them, in any select mode.

   ![A grid of faces with a corner face selected, and a path of faces leading to the opposite corner after Ctrl+click.](path)

5. **Select linked parts.** Point at a part of the mesh and press `L` to select everything joined to it. `Ctrl+L` does the same for whatever is already selected. Use it to pick one bolt out of several in one mesh.

   ![A row of five small cubes in one mesh, with one of them selected after L.](linked)

6. **Grow and shrink.** `Ctrl+Numpad +` adds the ring of parts around the selection, and `Ctrl+Numpad -` takes the outer ring away. `Shift+G` opens Select Similar, which finds parts like the selected ones, such as faces with the same material.

   ![One face on a grid, then the same selection grown twice with Ctrl+Numpad +: three by three faces, then five by five.](grow)

## Common mistake

![Left, the pointer in the middle of a face picks the vertical edge, and Alt+click selects a vertical loop. Right, the pointer right on a horizontal edge selects the horizontal loop.](mistake)

`Alt`+click picks the loop of the edge nearest the mouse. Click in the middle of a face and Blender may choose an edge going the other way. Point right at an edge of the loop you want, then click.

## Checking your work

Go back over each selection in the exercise:

1. The Pipe's red band took one `Alt`+click in Face select mode.
2. The Ball's loop runs exactly where blue meets white.
3. The Floor's path joins the two dark squares.
4. `L` selected one bolt, not all five.
