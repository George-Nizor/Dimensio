"""A lamp to take apart and a pile of rocks to put together, for lesson 30,
Separate and join.

- "Lamp", one mesh object made of three loose parts: an 8-sided base, a
  square pole and an 8-sided shade open at both ends. The base and pole use
  the material "Brass", the shade "Linen". Its origin is at the middle of its
  base, at the world origin.
- "Rock 1" to "Rock 5", five separate rock objects 1.5 m to the right of the
  lamp, all using "Stone". Rock 1 is the biggest and sits in the middle, with
  its origin at its base.

In the exercise the shade is separated into its own object and the rocks are
joined into one with Rock 1 active, which leaves three mesh objects.

Measuring the starting file gives: meshes 6, ngons 2 (the base's caps),
materials 1 (the fewest on any object; the lamp has 2). After the exercise,
meshes is 3.
"""

import math

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    starter.remove_default_cube()
    scene = starter.scene
    brass = starter.material("Brass", (0.71, 0.55, 0.24))
    linen = starter.material("Linen", (0.90, 0.86, 0.74))
    stone = starter.material("Stone", (0.48, 0.47, 0.45))

    # The lamp: three loose parts in one mesh, with two material slots.
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=8, radius1=0.16, radius2=0.16,
                          depth=0.04, matrix=Matrix.Translation((0.0, 0.0, 0.02)), calc_uvs=True)
    bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation((0.0, 0.0, 0.24)) @ Matrix.Diagonal((0.03, 0.03, 0.40, 1.0)), calc_uvs=True)
    shade = bmesh.ops.create_cone(bm, cap_ends=False, cap_tris=False, segments=8, radius1=0.20, radius2=0.11,
                                  depth=0.22, matrix=Matrix.Translation((0.0, 0.0, 0.42)), calc_uvs=True)
    shade_verts = set(shade["verts"])
    for face in bm.faces:
        face.material_index = 1 if all(v in shade_verts for v in face.verts) else 0
    bmesh.ops.recalc_face_normals(bm, faces=[f for f in bm.faces if f.material_index == 0])
    mesh = bpy.data.meshes.new("Lamp")
    bm.to_mesh(mesh)
    bm.free()
    mesh.materials.append(brass)
    mesh.materials.append(linen)
    lamp = bpy.data.objects.new("Lamp", mesh)
    scene.collection.objects.link(lamp)

    # The rocks: icospheres pushed out of shape, each its own object.
    rocks = [
        ("Rock 1", (1.5, 0.0, 0.0), (0.42, 0.36, 0.30), 0),
        ("Rock 2", (2.0, 0.25, 0.0), (0.20, 0.18, 0.15), 30),
        ("Rock 3", (1.15, 0.35, 0.0), (0.16, 0.14, 0.12), 75),
        ("Rock 4", (1.75, -0.4, 0.0), (0.22, 0.17, 0.14), 140),
        ("Rock 5", (1.05, -0.3, 0.0), (0.13, 0.12, 0.10), 210),
    ]
    for name, location, size, turn in rocks:
        bm = bmesh.new()
        bmesh.ops.create_icosphere(bm, subdivisions=1, radius=1.0, calc_uvs=True)
        for i, vert in enumerate(bm.verts):
            nudge = 0.85 + 0.3 * ((i * 37 + turn) % 11) / 10.0
            vert.co *= nudge
        lowest = min(v.co.z for v in bm.verts)
        angle = math.radians(turn)
        shape = Matrix.Rotation(angle, 4, "Z") @ Matrix.Diagonal((size[0], size[1], size[2], 1.0))
        bmesh.ops.transform(bm, matrix=shape @ Matrix.Translation((0.0, 0.0, -lowest)), verts=bm.verts)
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(stone)
        rock = bpy.data.objects.new(name, mesh)
        rock.location = location
        scene.collection.objects.link(rock)

    bpy.context.view_layer.objects.active = lamp
    lamp.select_set(True)
    starter.frame_viewports((-0.3, -0.6, 0.0), (2.3, 0.6, 0.6))
