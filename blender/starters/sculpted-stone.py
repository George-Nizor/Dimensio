"""A sculpted stone of 20,480 triangles to retopologise.

For lesson 77, Retopology. "Stone sculpt" is a stone 0.84 m long, 0.67 m deep
and 0.53 m high, resting on a flat base on the ground. It is an ico sphere
subdivided to 20,480 triangles, squashed, pushed in and out along
its normals by two sizes of noise, pressed flat in six places so it has
chipped faces with edges between them, and pitted all over by fine noise, the
way a sculpt is. It is shaded smooth.

It sits in a "Sculpt" reference collection: measuring skips it, it cannot be
selected and it does not render, but snapping and the Shrinkwrap modifier can
still use it as a target (snapping's Exclude Non-Selectable is off by
default). The learner builds their low-poly stone at the origin over it.

The default cube is removed; the camera and the light stay. Measuring the
starting file gives 0 meshes, so every count belongs to the learner's
retopology. The exercise measures tris (max 300), ngons (0) and
nonManifoldEdges (0).
"""

import math

OPTIONS = {}


def stone_mesh(name):
    """The sculpted stone as a new mesh data-block. bake-stone.py builds the same stone."""
    import bmesh
    import bpy
    from mathutils import Vector, noise

    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=6, radius=1.0)
    squash = Vector((0.45, 0.34, 0.30))
    for v in bm.verts:
        p = v.co.copy()
        n = p.normalized()
        lumps = noise.noise(p * 1.3 + Vector((3.1, 7.4, 1.2))) * 0.16
        bumps = noise.noise(p * 4.0 + Vector((9.3, 2.2, 5.8))) * 0.06
        p = n * (1.0 + lumps + bumps)
        v.co = Vector((p.x * squash.x, p.y * squash.y, p.z * squash.z))
    # Chipped faces: wherever the surface pokes past one of these planes, it is
    # pressed most of the way back onto it, so the stone has flat facets and
    # edges between them. The last plane is the flat base it rests on.
    planes = [
        (Vector((0.9, -0.3, 0.35)), 0.36), (Vector((-0.8, -0.5, 0.3)), 0.33),
        (Vector((0.2, 0.9, 0.4)), 0.27), (Vector((-0.4, 0.6, -0.2)), 0.30),
        (Vector((0.1, -0.7, 0.75)), 0.30), (Vector((0.6, 0.4, 0.7)), 0.30),
        (Vector((0.0, 0.0, -1.0)), 0.20),
    ]
    for normal, offset in planes:
        normal.normalize()
        for v in bm.verts:
            over = v.co.dot(normal) - offset
            if over > 0:
                v.co -= normal * over * 0.9
    # Fine pitting over everything, facets included.
    bm.normal_update()
    for v in bm.verts:
        v.co += v.normal * noise.noise(v.co * 30.0 + Vector((1.7, 4.9, 8.6))) * 0.008
    low = min(v.co.z for v in bm.verts)
    for v in bm.verts:
        v.co.z -= low
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    for poly in mesh.polygons:
        poly.use_smooth = True
    return mesh


def build(starter):
    import bpy

    scene = starter.scene
    starter.remove_default_cube()
    collection = starter.reference_collection("Sculpt")
    mesh = stone_mesh("Stone sculpt")
    mesh.materials.append(starter.material("Stone", (0.32, 0.31, 0.29)))
    obj = bpy.data.objects.new("Stone sculpt", mesh)
    collection.objects.link(obj)

    for other in bpy.data.objects:
        other.select_set(False)
    low, high = starter.world_bounds([obj])
    starter.frame_viewports(low, high)
