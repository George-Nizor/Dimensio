"""A ball with even, dense topology, ready to sculpt.

For lesson 75, Sculpt Mode, and the Multiresolution drill in lesson 76. "Ball"
is a sphere 2 m across, standing on the ground (its lowest point at Z 0),
rebuilt by the voxel remesher at a voxel size of 0.05 m, so every face is a
small quad of about the same size and no part of it is too coarse to sculpt.
It is shaded smooth, and its mesh keeps the voxel size, so pressing Ctrl+R in
Sculpt Mode remeshes it at the same density. Mirror X is left off: turning it
on is part of lesson 75.

The default cube is removed; the camera and the light stay. Measuring gives
1 mesh of 7,494 faces, all quads: 14,988 triangles, no n-gons, no
non-manifold edges and no loose geometry. The voxel remesher leaves 18
vertices within 0.1 mm of another, so doubles reads 18. Lesson 75's exercise
has no measure: limits.
"""

OPTIONS = {}

VOXEL = 0.05


def build(starter):
    import bmesh
    import bpy

    scene = starter.scene
    starter.remove_default_cube()

    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=48, v_segments=24, radius=1.0)
    mesh = bpy.data.meshes.new("Ball")
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new("Ball", mesh)
    scene.collection.objects.link(obj)

    remesh = obj.modifiers.new("Remesh", "REMESH")
    remesh.mode = "VOXEL"
    remesh.voxel_size = VOXEL
    depsgraph = bpy.context.evaluated_depsgraph_get()
    remeshed = bpy.data.meshes.new_from_object(obj.evaluated_get(depsgraph))
    obj.modifiers.remove(remesh)
    obj.data = remeshed
    bpy.data.meshes.remove(mesh)
    remeshed.name = "Ball"
    for poly in remeshed.polygons:
        poly.use_smooth = True
    remeshed.remesh_voxel_size = VOXEL
    remeshed.materials.append(starter.material("Clay", (0.6, 0.45, 0.38)))
    obj.location = (0, 0, 1.0)

    for other in bpy.data.objects:
        other.select_set(False)
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    low, high = starter.world_bounds([obj])
    starter.frame_viewports(low, high)
