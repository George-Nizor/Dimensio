"""Three objects with holes to fill, for lesson 26, Filling faces.

- "Box", 1 m on each side, cut once down the middle by a loop. Its top is
  missing, so the hole's border has 6 vertices and 6 edges. F fills it with
  one 6-sided n-gon; J between the two middle vertices splits that into two
  quads.
- "Tank", a 12-sided cylinder 1 m across and 1 m tall, closed at the bottom
  with a fan of triangles and open at the top: a round hole with 12 edges.
  Face > Grid Fill closes it with 9 quads.
- "Pipe", two 8-sided tubes 0.3 m across, lying along X with a 0.6 m gap
  between them. Their outer ends are closed with fans of triangles and their
  inner ends are open. Edge > Bridge Edge Loops joins them into one pipe.

Every object stands on the ground or rests at 0.5 m, and none has an n-gon.

Measuring the starting file gives: meshes 3, verts 71, faces 64, tris 100,
quads 36, ngons 0, nonManifoldEdges 34 (6 round the box's hole, 12 round the
tank's and 8 at each pipe end), looseVerts 0, looseEdges 0, doubles 0,
flippedFaces 0. With every hole filled and the pipe bridged, nonManifoldEdges
and ngons are both 0.
"""

import math

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy

    starter.remove_default_cube()
    scene = starter.scene
    paint = starter.material("Paint", (0.36, 0.52, 0.62))

    def finish(name, bm, location):
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(paint)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        scene.collection.objects.link(obj)
        return obj

    # The box: a 1 m cube cut once across X, top faces removed.
    bm = bmesh.new()
    grid = {}
    for i, x in enumerate((-0.5, 0.0, 0.5)):
        for j, y in enumerate((-0.5, 0.5)):
            for k, z in enumerate((0.0, 1.0)):
                grid[i, j, k] = bm.verts.new((x, y, z))
    faces = []
    for i in range(2):
        faces.append((grid[i, 0, 0], grid[i + 1, 0, 0], grid[i + 1, 1, 0], grid[i, 1, 0]))  # bottom
        faces.append((grid[i, 0, 0], grid[i + 1, 0, 0], grid[i + 1, 0, 1], grid[i, 0, 1]))  # front
        faces.append((grid[i, 1, 0], grid[i + 1, 1, 0], grid[i + 1, 1, 1], grid[i, 1, 1]))  # back
    faces.append((grid[0, 0, 0], grid[0, 1, 0], grid[0, 1, 1], grid[0, 0, 1]))  # left
    faces.append((grid[2, 0, 0], grid[2, 1, 0], grid[2, 1, 1], grid[2, 0, 1]))  # right
    for face in faces:
        bm.faces.new(face)
    finish("Box", bm, (-2.0, 0.0, 0.0))

    # The tank: 12 sides, a fan of triangles at the bottom, open at the top.
    bm = bmesh.new()
    sides = 12
    radius = 0.5
    ring = lambda z: [bm.verts.new((radius * math.cos(2 * math.pi * i / sides), radius * math.sin(2 * math.pi * i / sides), z)) for i in range(sides)]
    low, high = ring(0.0), ring(1.0)
    centre = bm.verts.new((0.0, 0.0, 0.0))
    for i in range(sides):
        j = (i + 1) % sides
        bm.faces.new((low[i], low[j], high[j], high[i]))
        bm.faces.new((low[j], low[i], centre))
    finish("Tank", bm, (0.0, 0.0, 0.0))

    # The pipe: two 8-sided tubes along X, closed at their outer ends.
    bm = bmesh.new()
    sides = 8
    radius = 0.15

    def tube(x0, x1, closed_at):
        a = [bm.verts.new((x0, radius * math.cos(2 * math.pi * i / sides), radius * math.sin(2 * math.pi * i / sides))) for i in range(sides)]
        b = [bm.verts.new((x1, radius * math.cos(2 * math.pi * i / sides), radius * math.sin(2 * math.pi * i / sides))) for i in range(sides)]
        for i in range(sides):
            j = (i + 1) % sides
            bm.faces.new((a[i], a[j], b[j], b[i]))
        cap = a if closed_at == x0 else b
        tip = bm.verts.new((closed_at, 0.0, 0.0))
        for i in range(sides):
            bm.faces.new((cap[i], cap[(i + 1) % sides], tip))

    tube(-0.9, -0.3, -0.9)
    tube(0.3, 0.9, 0.9)
    finish("Pipe", bm, (2.6, 0.0, 0.5))

    starter.frame_viewports((-2.5, -0.5, 0.0), (3.5, 0.5, 1.0))
