"""A table lamp with n-gons in the right and wrong places, for lesson 33,
Quads, triangles and n-gons.

One mesh object, "Lamp", 0.45 m tall, made of three loose parts:

- an 8-sided base 0.32 m across and 0.04 m thick, whose flat top and bottom
  are 8-sided n-gons. They stay: a flat cap is a fair place for an n-gon.
- a square pole 0.03 m thick.
- an 8-sided shade, open at both ends, that narrows from 0.34 m across at
  the bottom to 0.16 m at the top and bends at a ring of vertices half way
  up. Each of its eight sides is one 6-sided n-gon folded across that ring.
  These are the n-gons to rebuild.

Select > Select All by Trait > Faces by Sides with Number of Vertices 6 and
Type Equal To selects the shade's eight n-gons and nothing else. Ctrl+T then
Alt+J turns them into 16 quads, split along the middle ring.

Measuring the starting file gives: verts 48, faces 24, tris 72, quads 14,
ngons 10 (2 on the base, 8 on the shade), nonManifoldEdges 16 (the shade's
open ends), doubles 0, flippedFaces 0. After the fix: faces 32, quads 30,
ngons 2, tris 72.
"""

import math

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    starter.remove_default_cube()
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=8, radius1=0.16, radius2=0.16,
                          depth=0.04, matrix=Matrix.Translation((0.0, 0.0, 0.02)), calc_uvs=True)
    bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation((0.0, 0.0, 0.215)) @ Matrix.Diagonal((0.03, 0.03, 0.35, 1.0)), calc_uvs=True)

    # The shade: three rings, joined into eight bent hexagons.
    sides = 8
    profile = [(0.25, 0.17), (0.35, 0.14), (0.45, 0.08)]
    rings = [[bm.verts.new((r * math.cos(2 * math.pi * (i + 0.5) / sides), r * math.sin(2 * math.pi * (i + 0.5) / sides), z)) for i in range(sides)] for z, r in profile]
    low, mid, high = rings
    for i in range(sides):
        j = (i + 1) % sides
        bm.faces.new((low[i], low[j], mid[j], high[j], high[i], mid[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)

    mesh = bpy.data.meshes.new("Lamp")
    bm.to_mesh(mesh)
    bm.free()
    mesh.materials.append(starter.material("Brass", (0.71, 0.55, 0.24)))
    lamp = bpy.data.objects.new("Lamp", mesh)
    starter.scene.collection.objects.link(lamp)
    bpy.context.view_layer.objects.active = lamp
    lamp.select_set(True)
    starter.frame_viewports((-0.17, -0.17, 0.0), (0.17, 0.17, 0.45))
