"""A rock of about 2,000 triangles to make lower levels of detail from.

For lesson 65, Levels of detail. "Rock_LOD0" is a UV sphere of 32 segments
and 32 rings (1,984 triangles), pushed in and out by two sizes of noise,
stretched to about 1.75 m long, 1.26 m deep and 0.89 m high, and flattened
at the bottom so it sits on the ground. Its origin is at the base centre.
Faces are flat shaded. It has one material, "Stone", and no modifiers. The
default cube is removed; the camera and the light stay.

Measuring the starting file gives 1 mesh: verts 994, faces 1,024, tris
1,984, quads 960, ngons 0, nonManifoldEdges 0, scaleApplied true.

The exercise adds two copies, "Rock_LOD1" and "Rock_LOD2", with a Decimate
modifier (Collapse) at Ratio 0.5 and 0.25. Measured, the three together come
to 3,472 triangles (1,984 + 992 + 496; the modifiers' own Face Count reads
690 and 445, because some quads survive), so it measures meshes (equals 3)
and tris (max 3,600).
"""

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix, Vector, noise

    scene = starter.scene
    starter.remove_default_cube()

    # mathutils.noise seeds itself from the clock (seed 0 does too); fix it so the file is the same.
    noise.seed_set(1)

    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=32, v_segments=32, radius=0.5)
    for v in bm.verts:
        direction = v.co.normalized()
        broad = noise.noise(direction * 1.6 + Vector((3.1, 1.7, 0.4)))
        fine = noise.noise(direction * 4.5 + Vector((7.3, 2.9, 5.1)))
        v.co = direction * (0.5 + broad * 0.12 + fine * 0.04)
    bmesh.ops.transform(bm, verts=bm.verts, matrix=Matrix.Diagonal((1.6, 1.2, 1.0, 1.0)))
    # Flatten the underside so the rock rests on the ground, then stand it on Z 0.
    floor = min(v.co.z for v in bm.verts) * 0.7
    for v in bm.verts:
        v.co.z = max(v.co.z, floor)
    bottom = min(v.co.z for v in bm.verts)
    for v in bm.verts:
        v.co.z -= bottom
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)

    mesh = bpy.data.meshes.new("Rock_LOD0")
    bm.to_mesh(mesh)
    bm.free()
    for poly in mesh.polygons:
        poly.use_smooth = False
    mesh.materials.append(starter.material("Stone", (0.32, 0.31, 0.29)))
    rock = bpy.data.objects.new("Rock_LOD0", mesh)
    scene.collection.objects.link(rock)

    for obj in bpy.data.objects:
        obj.select_set(False)
    rock.select_set(True)
    bpy.context.view_layer.objects.active = rock
    low, high = starter.world_bounds([rock])
    starter.frame_viewports(low, high)
