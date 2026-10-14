---
needs: [edit-mode]
exercise: steps-and-wall
watch: [cgcookie-extrude-inset-knife, blender-extrude]
sources:
  - 'Blender 5.2 Manual, "Extrude Faces": E, axis keys pressed once for the global axis, right click leaves the new faces behind (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/extrude_faces.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Extrude Region": only the border of a selected region grows new faces (https://docs.blender.org/manual/en/5.2/modeling/meshes/tools/extrude_region.html), read 2026-10-15'
  - Blender 5.2 Manual, "Extrude Individual Faces" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/extrude_individual_faces.html), read 2026-10-15
  - Blender 5.2 Manual, "Extrude Faces Along Normals" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/extrude_faces_normal.html), read 2026-10-15
  - Blender 5.2 Manual, "Extrude Edges" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/extrude_edges.html), read 2026-10-15
  - Blender 5.2.2, Alt+E and the Extrude menu (VIEW3D_MT_edit_mesh_extrude), and a cancelled extrusion of the default cube's top face measured with blender/dimensio_check.py (4 doubled vertices), checked 2026-10-15
---

# Extrude

Almost every model starts as a simple shape pulled into a new one. In this lesson you'll learn to extrude faces and edges to build shapes out of a cube, such as a set of steps and an L-shaped wall.

![A set of three steps and an L-shaped wall, each built from one cube by extruding faces.](example)

## Steps

1. **Extrude a face.** In Face select mode, select the cube's top face and press `E`. Blender adds new faces round its border and moves it along its normal, the direction the face points. Move the mouse, or type a distance such as `1`, then click.

   ![The cube with its top face extruded 1 m upwards, the face still selected and an arrow along its normal.](extrude-face)

2. **Extrude along an axis.** While extruding, press `X`, `Y` or `Z` to move along that axis of the world instead of the normal. A sloping face extruded with `E` then `Z` goes straight up.

   ![Two ramps with their sloping top face extruded. Left, along its normal, tilted. Right, after E then Z, straight up.](extrude-axis)

3. **Extrude several faces as one.** Select neighbouring faces and press `E`. They move together as one region, and only the outer border grows new faces, so the shape stays one solid block.

   ![Two neighbouring faces on the side of a box extruded together into one block, with no wall between them.](region)

4. **Extrude faces one by one.** `Alt+E` opens the Extrude menu. Extrude Individual Faces moves every face along its own normal, so faces pointing different ways each grow their own block. Extrude Faces Along Normals keeps them joined at their edges.

   ![A cube with its top and front faces extruded individually, each moved along its own normal.](individual)

5. **Extrude an edge.** In Edge select mode, select an edge and press `E` to pull a new face out of it. A vertex extruded the same way pulls out a new edge.

   ![A single flat face with its back edge extruded upwards into a second face, like a wall rising from a floor.](extrude-edge)

## Common mistake

![Left, an extrusion cancelled with a right click: the new faces lie flat on the cube and four vertices sit doubled at its top corners. Right, after Ctrl+Z: the plain cube with eight vertices.](mistake)

Right clicking cancels the move, but the new faces stay behind, folded flat on the old ones with doubled vertices. You can't see them, but they stay in the mesh. Press `Ctrl+Z` instead, which removes the whole extrusion.

## Checking your model

Look at both models in Edit Mode with Statistics on:

1. Each step rises 0.3 m and is 0.5 m deep.
2. The wall's two arms meet at a square corner post.
3. Every face has four corners.
4. Mesh > Clean Up > Merge by Distance removes 0 vertices.
