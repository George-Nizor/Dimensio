"""A small house block, one mesh with no material, ready for material slots.

For lesson 49, Material slots. "House" is a single mesh: walls 2 m by 2 m and
1.6 m tall, a gabled roof whose ridge runs along X at 2.6 m, and a door 0.6 m
wide and 1.1 m tall in the middle of the front (-Y) wall. The walls are cut by
one loop at the door's height and two at its sides, so the door is a face of
its own and every edge joins two faces. The front and back gables are three
triangles each. The roof is two faces.

The default cube is removed; the camera and the light stay. The house stands
on the ground with its origin at the middle of its base.

Measuring gives 1 mesh: verts 26, edges 51, faces 27, tris 48, quads 21,
ngons 0, nonManifoldEdges 0, materials 0, uvLayers 1, dimensions 2, 2, 2.6.
The lesson's measure asks for materials equals 3 (walls, roof and door).
"""

OPTIONS = {}

XS = (-1.0, -0.3, 0.3, 1.0)
ZS = (0.0, 1.1, 1.6)
RIDGE = 2.6


def faces():
    """Every face as a list of corners, in the same order as the lesson's diagrams."""
    out = []
    for y in (-1.0, 1.0):
        for r in range(2):
            for c in range(3):
                out.append([(XS[c], y, ZS[r]), (XS[c + 1], y, ZS[r]), (XS[c + 1], y, ZS[r + 1]), (XS[c], y, ZS[r + 1])])
        for c in range(3):
            out.append([(XS[c], y, ZS[2]), (XS[c + 1], y, ZS[2]), (0.0, y, RIDGE)])
    for x in (-1.0, 1.0):
        for r in range(2):
            out.append([(x, -1.0, ZS[r]), (x, 1.0, ZS[r]), (x, 1.0, ZS[r + 1]), (x, -1.0, ZS[r + 1])])
    for c in range(3):
        out.append([(XS[c], -1.0, 0.0), (XS[c + 1], -1.0, 0.0), (XS[c + 1], 1.0, 0.0), (XS[c], 1.0, 0.0)])
    out.append([(-1.0, -1.0, ZS[2]), (0.0, -1.0, RIDGE), (0.0, 1.0, RIDGE), (-1.0, 1.0, ZS[2])])
    out.append([(1.0, -1.0, ZS[2]), (1.0, 1.0, ZS[2]), (0.0, 1.0, RIDGE), (0.0, -1.0, RIDGE)])
    return out


def build(starter):
    import bmesh
    import bpy

    scene = starter.scene
    starter.remove_default_cube()

    bm = bmesh.new()
    uv = bm.loops.layers.uv.new("UVMap")
    verts = {}

    def vert(co):
        if co not in verts:
            verts[co] = bm.verts.new(co)
        return verts[co]

    for corners in faces():
        bm.faces.new([vert(co) for co in corners])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    # A plain projection from the front and side, so the mesh has a UV map like an added cube.
    for face in bm.faces:
        n = face.normal
        for loop in face.loops:
            x, y, z = loop.vert.co
            loop[uv].uv = ((x + 1) / 2, z / RIDGE) if abs(n.y) > 0.5 else ((y + 1) / 2, z / RIDGE) if abs(n.x) > 0.5 else ((x + 1) / 2, (y + 1) / 2)

    mesh = bpy.data.meshes.new("House")
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new("House", mesh)
    scene.collection.objects.link(obj)

    for other in bpy.data.objects:
        other.select_set(False)
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    low, high = starter.world_bounds([obj])
    starter.frame_viewports(low, high)
