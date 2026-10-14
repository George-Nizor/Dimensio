"""A plain wall to cut into, for lesson 28, The knife tool.

One mesh object, "Wall": a box 3 m wide (X), 0.2 m thick (Y) and 2.5 m tall
(Z), standing on the ground with its origin at the middle of its base. Its
front faces -Y, so the front view (Numpad 1) looks straight at the face the
exercise cuts. The file opens in that view.

Measuring the starting file gives: verts 8, edges 12, faces 6, tris 12,
quads 6, ngons 0, nonManifoldEdges 0, looseVerts 0, looseEdges 0, doubles 0,
flippedFaces 0, scaleApplied true, dimensions 3, 0.2, 2.5.
"""

OPTIONS = {}

WIDTH = 3.0
THICKNESS = 0.2
HEIGHT = 2.5


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    starter.remove_default_cube()
    bm = bmesh.new()
    matrix = Matrix.Translation((0.0, 0.0, HEIGHT / 2)) @ Matrix.Diagonal((WIDTH, THICKNESS, HEIGHT, 1.0))
    bmesh.ops.create_cube(bm, size=1.0, matrix=matrix, calc_uvs=True)
    mesh = bpy.data.meshes.new("Wall")
    bm.to_mesh(mesh)
    bm.free()
    mesh.materials.append(starter.material("Plaster", (0.78, 0.74, 0.66)))
    wall = bpy.data.objects.new("Wall", mesh)
    starter.scene.collection.objects.link(wall)
    bpy.context.view_layer.objects.active = wall
    wall.select_set(True)
    starter.frame_viewports((-WIDTH / 2, -THICKNESS / 2, 0.0), (WIDTH / 2, THICKNESS / 2, HEIGHT), view="front")
