"""A crate and a barrel on a floor, with a camera and no lights.

For lessons 68 and 69, Lights and World lighting. The scene holds:

- "Floor", a 12 m square plane at Z 0. It cannot be selected, so clicks
  land on the props or the lights.
- "Crate", a 0.7 m box with 4 cm bevels, turned 20 degrees, at X -0.5.
- "Barrel", 0.85 m tall and wider in the middle (16 sides), at X 0.5.

The factory light is removed, so a render starts lit only by the World,
which keeps the factory colour (a dark grey, 0.05) at Strength 1. The camera
keeps its 50 mm lens and moves to a three-quarter view from the front right,
about 5.5 m away and 1.8 m up, aimed at the props. Render settings stay at
the factory defaults (EEVEE, 1920 by 1080, AgX).

Measuring gives 3 meshes. The exercises make lighting, not a model, so they
have no measure: limits.
"""

import math

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix, Vector

    scene = starter.scene
    starter.remove_default_cube()
    light = bpy.data.objects.get("Light")
    if light is not None and light.type == "LIGHT":
        data = light.data
        bpy.data.objects.remove(light)
        if data.users == 0:
            bpy.data.lights.remove(data)

    def mesh_object(name, bm, material, location=(0.0, 0.0, 0.0)):
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        scene.collection.objects.link(obj)
        return obj

    floor_mat = starter.material("Floor", (0.50, 0.48, 0.45))
    crate_mat = starter.material("Crate wood", (0.42, 0.20, 0.07))
    barrel_mat = starter.material("Barrel wood", (0.28, 0.12, 0.05))
    for mat in (floor_mat, crate_mat, barrel_mat):
        node = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
        node.inputs["Roughness"].default_value = 0.6

    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=6.0)
    floor = mesh_object("Floor", bm, floor_mat)
    floor.hide_select = True

    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=0.7)
    bmesh.ops.bevel(bm, geom=bm.edges[:], offset=0.04, segments=1, affect="EDGES", profile=0.5)
    crate = mesh_object("Crate", bm, crate_mat, (-0.5, 0.15, 0.35))
    crate.rotation_euler = (0.0, 0.0, math.radians(20))

    bm = bmesh.new()
    segments = 16
    profile = [(0.27, 0.0), (0.31, 0.2), (0.33, 0.425), (0.31, 0.65), (0.27, 0.85)]
    rings = []
    for radius, z in profile:
        rings.append([bm.verts.new((radius * math.cos(2 * math.pi * i / segments),
                                    radius * math.sin(2 * math.pi * i / segments), z)) for i in range(segments)])
    for a, b in zip(rings, rings[1:]):
        for i in range(segments):
            j = (i + 1) % segments
            bm.faces.new((a[i], a[j], b[j], b[i]))
    bm.faces.new(list(reversed(rings[0])))
    bm.faces.new(rings[-1])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    barrel = mesh_object("Barrel", bm, barrel_mat, (0.5, -0.1, 0.0))
    for poly in barrel.data.polygons:
        poly.use_smooth = abs(poly.normal.z) < 0.99

    aim = Vector((0.0, 0.0, 0.4))
    camera = bpy.data.objects.get("Camera")
    if camera is not None and camera.type == "CAMERA":
        camera.data.lens = 50
        camera.location = (3.0, -4.5, 1.8)
        camera.rotation_euler = (aim - camera.location).to_track_quat("-Z", "Y").to_euler()
        scene.camera = camera

    for obj in bpy.data.objects:
        obj.select_set(False)
    low, high = starter.world_bounds([crate, barrel])
    starter.frame_viewports(low, high)
