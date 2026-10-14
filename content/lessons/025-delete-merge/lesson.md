---
needs: [selecting-loops]
exercise: clean-the-block
watch: [artisans-of-vaul-delete-dissolve, cgcookie-subdivide-fill-merge]
sources:
  - 'Blender 5.2 Manual, "Deleting & Dissolving": X, Delete Vertices, Edges and Faces, Dissolve Vertices, Edges and Faces, Ctrl+X, Limited Dissolve, Edge Loops (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/delete.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Merge": M, At Center, At Cursor, Collapse, At First, At Last, By Distance, Merge Distance (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/merge.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Clean Up": Mesh > Clean Up > Merge by Distance (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/cleanup.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Tool Settings": Auto Merge (https://docs.blender.org/manual/en/5.2/modeling/meshes/tools/tool_settings.html), read 2026-10-15'
  - Blender 5.2 Manual, "Weld Modifier" (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/weld.html), read 2026-10-15
  - Blender 5.0 release notes, Modeling, Merge by Distance and its Centroid option (https://developer.blender.org/docs/release_notes/5.0/modeling/), read 2026-10-15
  - Blender 5.2.2, the cleanup-mess starter cleaned with Ctrl+X, X > Dissolve Edges, X > Edge Loops and X > Edges, and measured with blender/dimensio_check.py (X > Edges leaves 16 open edges; the others leave none), checked 2026-10-15
---

# Delete, dissolve and merge

Taking parts away from a mesh is as common as adding them, and the wrong command leaves a hole. In this lesson you'll delete, dissolve and merge vertices, edges and faces, so a mesh loses what it doesn't need and stays closed.

![A block before and after cleaning up: left, with a stray loop round its middle, an extra vertex, a loose end and three loose vertices; right, a plain box with 8 vertices and 6 faces.](example)

## Steps

1. **Delete.** Select parts and press `X`. Vertices, Edges and Faces delete them, with every face built on them, which leaves a hole. Use it when you want a hole, such as a doorway, or to remove a whole part.

   ![A box with its top face selected, then after X > Faces: the top is gone, leaving an open hole.](delete)

2. **Dissolve.** Dissolving removes parts and joins the faces around them, so the surface stays closed. In Edge select mode, `Alt`+click a loop and press `Ctrl+X`: the faces either side merge into one. `X` > Dissolve Vertices, Edges and Faces work the same way.

   ![A box with an edge loop round its middle selected, then after Ctrl+X: the loop is gone and each side is one face again.](dissolve)

3. **Merge vertices.** Select two or more vertices and press `M`. At Center joins them at their middle, At Cursor at the 3D cursor, and At First or At Last onto the vertex you selected first or last.

   ![Two vertices at the top of a box selected, then merged At Center into one vertex between them.](merge)

4. **Merge by distance.** Doubled vertices sit on top of each other, looking like one. Select all and choose Mesh > Clean Up > Merge by Distance, or `M` > By Distance: it welds pairs closer than 0.0001 m. Older tutorials call it Remove Doubles.

   ![The end of a box that is a separate face, with four doubled vertices at its corners, then welded into the box by Merge by Distance.](by-distance)

5. **Merge as you work.** Tick Auto Merge in the Sidebar's Tool tab, under Options, and a vertex merges as soon as you move it onto another. The Weld modifier does the same merge by distance without changing the mesh itself.

## Common mistake

![Left, an edge loop removed with X > Edges: the faces round it are gone, leaving a gap all the way round the box. Right, the same loop dissolved with Ctrl+X: the box is closed.](mistake)

Removing an edge loop with `X` > Edges deletes the faces that use it too, leaving a gap all the way round. Dissolve it instead, with `Ctrl+X` or `X` > Dissolve Edges, which joins the faces either side.

## Checking your model

Look at the block in Edit Mode with Statistics on:

1. Statistics shows 8 vertices, 12 edges and 6 faces.
2. Each side of the block is one face with four corners.
3. No loose vertices float beside the block.
4. Merge by Distance now removes 0 vertices.
