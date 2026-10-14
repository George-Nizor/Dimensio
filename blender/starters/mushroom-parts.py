"""A mushroom's cap and stem as two separate objects that overlap.

For lesson 76, Remeshing for sculpting. The learner joins the two with Ctrl+J
and voxel remeshes them into one sculptable surface, then adds detail with
Dyntopo.

- "Cap": a UV sphere (32 segments, 16 rings) 1.2 m across, flattened to
  0.54 m high in its mesh (not with object scale), its middle at Z 1.05 m.
- "Stem": a 16-sided cylinder 0.34 m across and 1 m tall, from the ground to
  Z 1.0 m, so its top 0.22 m is inside the cap.

Both are shaded smooth and share one material. Neither has a voxel size of
its own, so the joined mesh starts at Blender's default of 0.1 m. The default
cube is removed; the camera and the light stay. Measuring gives 2 meshes:
Cap 512 faces (448 quads, 64 triangles), Stem 18 faces with 2 n-gons (its
caps), no non-manifold edges. Joined and remeshed at a voxel size of 0.03 m
they become one mesh of about 6,150 quads. The exercise has no measure: limits.
"""

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    scene = starter.scene
    starter.remove_default_cube()
    clay = starter.material("Clay", (0.6, 0.45, 0.38))

    def mesh_object(name, bm, location):
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        for poly in mesh.polygons:
            poly.use_smooth = True
        mesh.materials.append(clay)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        scene.collection.objects.link(obj)
        return obj

    cap = bmesh.new()
    bmesh.ops.create_uvsphere(cap, u_segments=32, v_segments=16, radius=0.6,
                              matrix=Matrix.Diagonal((1.0, 1.0, 0.45, 1.0)))
    cap_obj = mesh_object("Cap", cap, (0, 0, 1.05))

    stem = bmesh.new()
    bmesh.ops.create_cone(stem, cap_ends=True, cap_tris=False, segments=16, radius1=0.17, radius2=0.17, depth=1.0)
    stem_obj = mesh_object("Stem", stem, (0, 0, 0.5))

    for obj in bpy.data.objects:
        obj.select_set(False)
    low, high = starter.world_bounds([cap_obj, stem_obj])
    starter.frame_viewports(low, high)
