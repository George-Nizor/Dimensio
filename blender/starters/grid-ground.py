"""A flat patch of ground to shape, for lesson 29, Proportional editing.

One mesh object, "Ground": a flat grid 20 m by 20 m on the ground plane, cut
into 40 by 40 squares 0.5 m across, so proportional editing has plenty of
vertices to move. Its origin is at its middle.

Measuring the starting file gives: verts 1681, edges 3280, faces 1600,
tris 3200, quads 1600, ngons 0, nonManifoldEdges 160 (the edges round the
outside, which belong to one face each), looseVerts 0, looseEdges 0,
doubles 0, flippedFaces 0, dimensions 20, 20, 0. The exercise has no
measure: limits.
"""

OPTIONS = {}

SIZE = 20.0
CUTS = 40


def build(starter):
    import bmesh
    import bpy

    starter.remove_default_cube()
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=CUTS, y_segments=CUTS, size=SIZE / 2, calc_uvs=True)
    mesh = bpy.data.meshes.new("Ground")
    bm.to_mesh(mesh)
    bm.free()
    mesh.materials.append(starter.material("Grass", (0.35, 0.55, 0.25)))
    ground = bpy.data.objects.new("Ground", mesh)
    starter.scene.collection.objects.link(ground)
    bpy.context.view_layer.objects.active = ground
    ground.select_set(True)
    starter.frame_viewports((-SIZE / 2, -SIZE / 2, 0.0), (SIZE / 2, SIZE / 2, 2.0))
