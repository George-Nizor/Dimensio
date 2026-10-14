"""Two flat-shaded barrels to shade two ways, for lesson 32, Flat and smooth
shading.

"Barrel A" (at X -0.8) and "Barrel B" (at X 0.8) are the same barrel, the
one lesson 36 builds: a 12-sided cylinder 1.1 m across and 1.2 m tall, cut
into five rings, bulging to 1.27 m across in the middle, with two bands that
stand 0.04 m proud and a lid sunk 0.05 m into the top. Both stand on the ground with their
origins at the middle of their base, and every face is flat shaded.

The angle between neighbouring sides of a 12-sided barrel is 30 degrees, the
same as Shade Auto Smooth's default angle, so the lesson sets 40 degrees: the
sides then shade smooth and the bands, rims and lid stay sharp.

Measuring the starting file gives, for each barrel: verts 144, faces 134,
tris 284, quads 132, ngons 2 (the lid and the base), nonManifoldEdges 0,
doubles 0, flippedFaces 0, shading "flat". The exercise has no measure:
limits, because a barrel shaded smooth with sharp rims reads as "mixed".
"""

import math

OPTIONS = {}

SIDES = 12
RADIUS = 0.55
HEIGHT = 1.2
BULGE = 1.15
BAND = 0.04
LID_INSET = 0.06
LID_DEPTH = 0.05


def barrel_mesh(name):
    """The lesson 36 barrel as a new mesh, built ring by ring with bmesh.

    The rings follow the lesson's steps: a cylinder of radius 0.55 m and depth
    1.2 m cut at 0.24, 0.48, 0.72 and 0.96 m, the four inner rings scaled by
    1.15, the two bands pushed out 0.04 m, and the top inset by 0.06 m and
    pushed down 0.05 m. Each ring is (height, distance from the middle).
    """
    import bmesh
    import bpy

    body = RADIUS * BULGE
    band = body + BAND
    lid = RADIUS - LID_INSET / math.cos(math.pi / SIDES)
    profile = [
        (0.0, RADIUS), (0.2 * HEIGHT, body), (0.2 * HEIGHT, band), (0.4 * HEIGHT, band), (0.4 * HEIGHT, body),
        (0.6 * HEIGHT, body), (0.6 * HEIGHT, band), (0.8 * HEIGHT, band), (0.8 * HEIGHT, body), (HEIGHT, RADIUS),
        (HEIGHT, lid), (HEIGHT - LID_DEPTH, lid),
    ]
    bm = bmesh.new()
    rings = [[bm.verts.new((r * math.cos(2 * math.pi * i / SIDES), r * math.sin(2 * math.pi * i / SIDES), z))
              for i in range(SIDES)] for z, r in profile]
    for low, high in zip(rings, rings[1:]):
        for i in range(SIDES):
            j = (i + 1) % SIDES
            bm.faces.new((low[i], low[j], high[j], high[i]))
    bm.faces.new(rings[0])
    bm.faces.new(rings[-1])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    for face in bm.faces:
        face.smooth = False
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    return mesh


def build(starter):
    import bpy

    starter.remove_default_cube()
    wood = starter.material("Wood", (0.62, 0.40, 0.22))
    for name, x in (("Barrel A", -0.8), ("Barrel B", 0.8)):
        mesh = barrel_mesh(name)
        mesh.materials.append(wood)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = (x, 0.0, 0.0)
        starter.scene.collection.objects.link(obj)
    starter.frame_viewports((-1.5, -0.7, 0.0), (1.5, 0.7, 1.2))
