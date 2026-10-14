---
needs: [modifiers, loop-cuts, filling-faces]
exercise: cushion-and-box
watch: [cg-essentials-subdivision-surface, blender-manual-modeling-modifiers-generate-subdivision-surface]
sources:
  - 'Blender 5.2 Manual, "Subdivision Surface Modifier": Levels Viewport and Render, the Ctrl+1 to Ctrl+3 shortcuts, Weighted Edge Creases, Edge Loops (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/subdivision_surface.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Edge Data", Edge Crease, Shift+E (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/edge_data.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Loop Cut and Slide" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/loopcut_slide.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Grid Fill" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/grid_fill.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Shade Smooth" in Object Shading (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/shading.html), read 2026-10-15'
  - 'The CG Essentials, "Using the Subdivision Surface Modifier in Blender", creases and edge loops (https://www.youtube.com/watch?v=iiZbeJ_ep2k), read 2026-10-15'
  - 'Blender 5.2.2, checked 2026-10-15: Ctrl+0 to Ctrl+5 run Subdivision Set in Object Mode, a new modifier has Levels Viewport 1 and Render 2, and the cube measures 24, 96 and 384 faces at levels 1, 2 and 3'
---

# Subdivision Surface

The Subdivision Surface modifier splits every face into smaller ones and rounds the shape off. A few faces can then make a soft cushion or a box with smooth edges. In this lesson you'll add it with a shortcut, choose how fine it is, and keep chosen edges sharp with edge loops and creases.

![A cushion made from a flattened cube, and a box whose edges stay tight under the same modifier.](example)

## Steps

1. **Add it with a shortcut.** Select the object in Object Mode and press `Ctrl+2`. Blender adds a Subdivision Surface modifier at Levels Viewport 2. Each level splits every face into four, and the cube rounds off toward a ball.

   ![The cube with no modifier and at levels 1, 2 and 3: 6, 24, 96 and 384 faces, rounder each time.](levels)

2. **Set the two levels.** Levels Viewport is what you see while you work, and Render is what renders use, 2 by default. Keep Levels Viewport no higher than Render. Each level multiplies the faces by four, and a high one can freeze Blender.

3. **Hold an edge with loops.** In Edit Mode, press `Ctrl+R` and slide a new loop close to an edge. The closer a loop sits to the edge, the tighter the curve there. A loop near every edge gives a box with crisp, rounded corners.

   ![Left, the cube with an edge loop close to every edge. Right, the same mesh at level 2: a box with tight, rounded edges.](loops)

4. **Or crease it.** In Edit Mode, select edges, press `Shift+E`, type 1 and press `Enter`. A crease of 1 keeps those edges sharp under the modifier with no extra loops. You can also type a crease in the Sidebar's Item tab.

   ![Left, the cube with its four top edges creased. Right, at level 2 the top rim stays sharp and the rest rounds off.](crease)

5. **Shade it smooth.** Choose Object > Shade Smooth. The modifier rounds the shape, and smooth shading hides the faces that are left.


## Common mistake

![The top of an 8-sided cylinder at level 2. Left, a cap that is one n-gon becomes a star of long, thin faces. Right, a cap of four quads from Grid Fill becomes an even grid.](mistake)

A cylinder's cap is one n-gon, and it's easy to subdivide it without noticing. It turns into a star of long, thin faces meeting at one point, which shades unevenly. Keep the mesh under the modifier to quads: delete the cap and fill the hole with Face > Grid Fill.

## Checking your model

Look at both objects in Object Mode and check:

1. Each one has a Subdivision Surface modifier at Levels Viewport 2.
2. The cushion has no sharp corners left.
3. The box keeps a tight edge all the way round.
4. Shade Smooth is on, and no faces show as flat patches.
