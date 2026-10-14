---
needs: [selecting-loops, extrude]
exercise: three-planks
watch: [cgcookie-bevel-loop-cut, blender-loop-cut]
sources:
  - 'Blender 5.2 Manual, "Loop Cut and Slide": Ctrl+R, the preview, the wheel for the number of cuts, click to slide, right click to centre, Even and Flipped (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/loopcut_slide.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Loop Cut" tool: the Toolbar tool and Number of Cuts (https://docs.blender.org/manual/en/5.2/modeling/meshes/tools/loop.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Edge Slide": G twice, Even (E) and Flipped (F) (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/edge_slide.html), read 2026-10-15'
  - Blender 5.2 Manual, "Extrude Faces Along Normals" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/extrude_faces_normal.html), read 2026-10-15
  - Blender 5.2.2, the three planks built as the exercise says and measured with blender/dimensio_check.py (38 faces, no n-gons, no doubled vertices), checked 2026-10-15
---

# Loop cuts

To extrude or add detail to part of a mesh, you often need more edges in the right place. In this lesson you'll add edge loops all the way round a mesh with a loop cut, and slide new and old loops to where you need them.

![A box with three planks on every side, the grooves between them made from loop cuts.](example)

## Steps

1. **Start a loop cut.** In Edit Mode, press `Ctrl+R` and point at an edge. A preview line shows the new loop: it runs across the edge under the mouse, all the way round the mesh. Point at another edge to turn it the other way.

   ![The cube with the pointer on a vertical edge and a preview line running round its sides horizontally.](preview)

2. **Choose how many.** Before you click, scroll the mouse wheel to add more cuts, or type a number. Blender spaces them evenly between the edges either side. Click to make them.

   ![The cube with two horizontal loops spaced evenly round its sides, splitting each side into three bands.](cuts)

3. **Slide or centre.** After the click, the new loop follows the mouse along the faces. Click again to leave it where it is, or right click to put it back in the middle.

   ![A new loop slid towards the top of the cube, with arrows showing it can move up or down between its neighbours.](slide)

4. **Slide an existing loop.** `Alt`+click a loop, then press `G` twice to slide it along the faces beside it. Press `E` for Even, so it keeps the shape of one neighbouring loop, and `F` to choose the other one.

   ![A ramp with a loop slid along its side with G G. Left, with Even, the loop runs parallel to the slope. Right, with Flipped as well, it runs parallel to the base.](edge-slide)

5. **Use the Loop Cut tool.** The Loop Cut tool in the Toolbar does the same with the mouse. Click an edge to cut a loop across it. Number of Cuts, in the tool settings above the viewport, sets how many.

## Common mistake

![Left, the pointer on a horizontal edge gives a vertical loop. Right, the pointer on a vertical edge gives the horizontal loop that was wanted.](mistake)

The loop goes the wrong way round. A loop cut runs across the edge under the mouse, so pointing at a horizontal edge cuts a vertical loop. Point at an edge the new loop should cross, and check the preview before you click.

## Checking your model

Look at the box from the front (`Numpad 1`):

1. Each side shows three planks with a groove between them.
2. The two grooves are the same height, about 10 cm.
3. The grooves sink 5 cm into the box all the way round.
4. Every face has four corners.
