"""A crate and a barrel with faces turned the wrong way, for lesson 31, Normals.

- "Crate", a 1 m box standing on the ground at X -0.8. Two of its six faces,
  the top and the front, point inwards.
- "Barrel", a 12-sided barrel 1 m tall at X 0.8, wider in the middle, with
  every face pointing inwards: it is inside out.

Shift+N (Recalculate Outside) with everything selected in Edit Mode turns all
of them the right way. With the Face Orientation overlay on, the crate shows
two red faces and the barrel is red all over until they are fixed.

Measuring the starting file gives: meshes 2, verts 56, faces 44, tris 104,
quads 42, ngons 2 (the barrel's caps), nonManifoldEdges 6 (the crate's edges
where a reversed face meets a correct one), doubles 0, flippedFaces 40 (2 on
the crate, all 38 of the barrel's faces). After the fix, flippedFaces and
nonManifoldEdges are both 0.
"""

import math

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    starter.remove_default_cube()
    scene = starter.scene
    wood = starter.material("Wood", (0.62, 0.40, 0.22))

    def finish(name, bm, location):
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(wood)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        scene.collection.objects.link(obj)
        return obj

    # The crate: two faces reversed.
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation((0.0, 0.0, 0.5)), calc_uvs=True)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.normal_update()
    wrong = [f for f in bm.faces if f.normal.z > 0.9 or f.normal.y < -0.9]
    bmesh.ops.reverse_faces(bm, faces=wrong)
    crate = finish("Crate", bm, (-0.8, 0.0, 0.0))

    # The barrel: 12 sides, three bands of faces, bulging in the middle, all reversed.
    bm = bmesh.new()
    sides = 12
    profile = [(0.0, 0.36), (0.3, 0.42), (0.7, 0.42), (1.0, 0.36)]
    rings = [[bm.verts.new((r * math.cos(2 * math.pi * i / sides), r * math.sin(2 * math.pi * i / sides), z)) for i in range(sides)] for z, r in profile]
    for low, high in zip(rings, rings[1:]):
        for i in range(sides):
            j = (i + 1) % sides
            bm.faces.new((low[i], low[j], high[j], high[i]))
    bm.faces.new(rings[0])
    bm.faces.new(rings[-1])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bmesh.ops.reverse_faces(bm, faces=bm.faces)
    finish("Barrel", bm, (0.8, 0.0, 0.0))

    bpy.context.view_layer.objects.active = crate
    crate.select_set(True)
    starter.frame_viewports((-1.3, -0.5, 0.0), (1.3, 0.5, 1.0))
