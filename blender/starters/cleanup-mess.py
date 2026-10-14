"""A block that should be a plain box, with four things to clean up.

For lesson 25, Delete, dissolve and merge. One mesh object, "Block", a box
2 m long, 1 m deep and 1 m tall standing on the ground. Cleaned up it has
8 vertices and 6 quad faces. As built it has:

- A stray edge loop around its middle (at X 0.25), splitting the top,
  bottom, front and back into two faces each. Dissolving it, with Ctrl+X or
  X > Dissolve Edges, joins them again without leaving a hole.
- An extra vertex in the middle of the top edge at the back right, which
  makes the top face and the right end 5-sided (2 n-gons). Dissolving that
  vertex makes them quads again.
- Its left end (towards -X) as a separate face whose 4 corners sit exactly
  on the block's own (4 doubles, and 4 open edges on each side of the seam).
  Mesh > Clean Up > Merge by Distance, or M > By Distance, welds them.
- Three loose vertices floating beside it, with no edges.

Measuring the starting file gives: verts 20, edges 25, faces 10, tris 22,
quads 8, ngons 2, nonManifoldEdges 8, looseVerts 3, looseEdges 0,
doubles 4, flippedFaces 0. Cleaned up with Ctrl+X on the loop, Ctrl+X on
the extra vertex, X > Vertices on the loose ones and Merge by Distance:
verts 8, edges 12, faces 6, tris 12, quads 6, and every problem count 0.
Removing the loop with X > Edges instead leaves 2 faces and 16 open edges.
"""

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy

    starter.remove_default_cube()
    bm = bmesh.new()
    x0, x1, xm = -1.0, 1.0, 0.25
    y0, y1 = -0.5, 0.5
    z0, z1 = 0.0, 1.0

    def v(x, y, z):
        return bm.verts.new((x, y, z))

    # Corners of the left part (x0 to xm), the stray loop (xm), and the right end (x1).
    lf0, lb0, lb1, lf1 = v(x0, y0, z0), v(x0, y1, z0), v(x0, y1, z1), v(x0, y0, z1)
    mf0, mb0, mb1, mf1 = v(xm, y0, z0), v(xm, y1, z0), v(xm, y1, z1), v(xm, y0, z1)
    rf0, rb0, rb1, rf1 = v(x1, y0, z0), v(x1, y1, z0), v(x1, y1, z1), v(x1, y0, z1)
    # The extra vertex in the middle of the top back edge of the right part.
    extra = v((xm + x1) / 2, y1, z1)

    # Left part: front, back, top and bottom (its left end is a separate piece below).
    bm.faces.new((lf0, mf0, mf1, lf1))      # front
    bm.faces.new((mb0, lb0, lb1, mb1))      # back
    bm.faces.new((lf1, mf1, mb1, lb1))      # top
    bm.faces.new((lf0, lb0, mb0, mf0))      # bottom
    # Right part: front, back (split by the extra vertex), top (5 corners), bottom, right end.
    bm.faces.new((mf0, rf0, rf1, mf1))      # front
    bm.faces.new((rb0, mb0, mb1, extra, rb1))  # back, 5 corners
    bm.faces.new((mf1, rf1, rb1, extra, mb1))  # top, 5 corners
    bm.faces.new((mf0, mb0, rb0, rf0))      # bottom
    bm.faces.new((rf0, rb0, rb1, rf1))      # right end
    # The left end as a separate face, its corners doubled on the block's.
    e0, e1, e2, e3 = v(x0, y0, z0), v(x0, y0, z1), v(x0, y1, z1), v(x0, y1, z0)
    bm.faces.new((e0, e1, e2, e3))
    # Three loose vertices.
    for position in ((-1.6, -0.9, 0.4), (-1.5, -1.1, 1.3), (1.7, 0.8, 0.2)):
        v(*position)

    bm.normal_update()
    mesh = bpy.data.meshes.new("Block")
    bm.to_mesh(mesh)
    bm.free()
    mesh.materials.append(starter.material("Stone", (0.66, 0.64, 0.60)))
    block = bpy.data.objects.new("Block", mesh)
    starter.scene.collection.objects.link(block)
    bpy.context.view_layer.objects.active = block
    block.select_set(True)
    starter.frame_viewports((-1.7, -1.2, 0.0), (1.7, 1.2, 1.4))
