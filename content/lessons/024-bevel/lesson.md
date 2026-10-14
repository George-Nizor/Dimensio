---
needs: [selecting-loops, apply-transforms]
exercise: chamfer-crate
watch: [cgcookie-bevel-loop-cut, blender-bevel-tool]
sources:
  - 'Blender 5.2 Manual, "Bevel": Ctrl+B for edges, Shift+Ctrl+B for vertices, the wheel for segments, typing a width, Width, Segments, Profile Shape and Clamp Overlap (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/bevel.html), read 2026-10-15'
  - Blender 5.2 Manual, "Apply" (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/apply.html), read 2026-10-15
  - Blender 5.2.2, a 1 m cube bevelled 0.02 m with one segment (26 faces, 44 triangles, no n-gons), and a 0.1 m bevel on a box scaled to 2 by 0.6 m in Object Mode (10 cm along X, 3 cm along Y), measured with blender/dimensio_check.py, checked 2026-10-15
---

# Bevel

Nothing in real life has a perfectly sharp edge, so a narrow bevel along each edge makes a model look more real. In this lesson you'll bevel edges and corners, choose their width and number of segments, and keep them even.

![A 1 m crate with every edge bevelled 2 cm with one segment: a flat strip along each edge and a small triangle at each corner.](example)

## Steps

1. **Bevel edges.** In Edit Mode, select edges and press `Ctrl+B`. Move the mouse to set the width, or type a number such as 0.02 for 2 cm, then click. Each sharp edge becomes a narrow flat face, called a chamfer.

   ![The cube with its top front edge selected, and the same edge after Ctrl+B: a narrow face where the sharp edge was.](bevel-edge)

2. **Add segments.** While bevelling, scroll the mouse wheel to add segments. More segments round the edge off. One segment keeps it a flat chamfer, which keeps a low-poly model's triangle count down.

   ![The end of a bevelled edge seen side on: one segment makes a single flat cut, three segments make a rounded corner.](segments)

3. **Bevel the corners only.** Select vertices and press `Shift+Ctrl+B` to bevel them instead. Each corner is cut off, and the edges between the corners stay sharp.

   ![The cube with its top front right vertex bevelled: a small triangle cuts off that corner.](vertex-bevel)

4. **Change it afterwards.** The Adjust Last Operation panel holds the bevel's Width and Segments, so you can type exact values after the click. Tick Clamp Overlap to stop a wide bevel running past the end of the faces beside it.

   ![The Bevel panel at the bottom left of the viewport, with Width 0.02 m, Segments 1 and the Clamp Overlap checkbox.](adjust)

## Common mistake

![One corner of a box 2 by 0.6 m, from above. Left, scaled in Object Mode and bevelled 10 cm: the bevel is 10 cm along one side and 3 cm along the other. Right, with scale applied first: 10 cm on both.](mistake)

A bevel on an object scaled in Object Mode comes out uneven. Blender measures the width on the mesh before the scale. On a box stretched to 2 by 0.6 m, 10 cm becomes 10 cm one way and 3 cm the other. Apply scale with `Ctrl+A` first.

## Checking your model

Look closely at the crate's edges and corners:

1. Every edge has a flat chamfer 2 cm wide.
2. Each corner is a small triangle where three chamfers meet.
3. The Sidebar shows Scale 1 and Dimensions of 1 m each way.
4. Statistics shows 26 faces.
