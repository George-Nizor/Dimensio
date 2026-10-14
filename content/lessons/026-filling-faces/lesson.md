---
needs: [selecting-loops, delete-merge]
exercise: fill-the-holes
watch: [cgcookie-subdivide-fill-merge, cg-essentials-grid-fill]
sources:
  - Blender 5.2 Manual, "New Edge/Face from Vertices" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/vertex/make_face_edge.html), read 2026-10-15
  - Blender 5.2 Manual, "Connect Vertex Path" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/vertex/connect_vertex_path.html), read 2026-10-15
  - Blender 5.2 Manual, "Fill" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/fill.html), read 2026-10-15
  - Blender 5.2 Manual, "Grid Fill", including the tip on the "Loops are not connected" error (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/grid_fill.html), read 2026-10-15
  - Blender 5.2 Manual, "Bridge Edge Loops" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/bridge_edge_loops.html), read 2026-10-15
  - Blender 5.2 Manual, "Select Loops", selecting a boundary loop with Alt and a click (https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/loops.html), read 2026-10-15
---

# Filling faces

A hole is a gap in a mesh with no face across it. You get one when you delete faces or build a part without closing it. In this lesson you'll close holes with new faces and split large faces into smaller ones. You'll also join two openings into one tube.

![The box, the tank and the pipe from the exercise with every hole closed: two quads on the box's top, a grid of quads on the tank's top and a ring of new faces joining the two halves of the pipe.](example)

## Steps

1. **Fill a hole with F.** In Edit Mode, hold `Alt` and click an edge on the hole's rim to select the whole rim. Press `F` (New Edge/Face from Vertices) to make one face across it. With two vertices selected, `F` makes an edge.

   ![A box with its top missing and the six edges round the hole selected, beside the same box with one new face across the top.](fill-f)

2. **Split it with J.** A face with more than four corners is an n-gon. To split one, select two vertices on opposite sides of it and press `J` (Connect Vertex Path). Blender adds an edge across the face between them.

   ![The six-sided face on the box's top with two vertices selected, beside the same top split into two four-sided faces by a new edge.](split-j)

3. **Grid fill a round hole.** On a round hole, `F` makes one n-gon and `Alt+F` (Fill) makes triangles. For four-sided faces, select the rim and choose Face > Grid Fill. It works best when opposite sides of the hole have the same number of vertices.

   ![The same 12-sided hole filled three ways: one n-gon with F, a set of triangles with Alt+F, and a grid of nine quads with Grid Fill.](grid-fill)

4. **Bridge two openings.** Select one opening's rim, then hold `Shift+Alt` and click the other's. Choose Edge > Bridge Edge Loops to join them with a ring of faces. Number of Cuts in the Adjust Last Operation panel adds more rings.

   ![Two short tubes with their open ends facing each other and both rims selected, beside one tube where a ring of new faces joins them.](bridge)

## Common mistake

![Left, a round hole with only part of its rim selected, and Grid Fill reporting an error. Right, the whole rim selected and the hole filled with a grid.](mistake)

Grid Fill sometimes stops with "Loops are not connected by wire/boundary edges". That means the selected edges don't go all the way round the hole. Hold `Alt` and click the rim again to select all of it, then try again.

## Checking your model

Look at each object in Edit Mode and from every side:

1. No hole shows through on the box, the tank or the pipe.
2. The box's top is two four-sided faces with one edge between them.
3. The tank's top is a grid of four-sided faces, not one face.
4. The pipe is one closed tube with no gap in the middle.
