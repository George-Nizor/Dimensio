"""Three low-poly props on a curved backdrop, lit by three area lights, with a camera.

For lessons 70 to 72: Cameras, Rendering with EEVEE and Rendering with Cycles.
The props stand near the origin on a 20 m wide floor that curves up into a
back wall, so a render has no horizon line:

- "Crate", a 0.7 m box with bevelled edges, turned 20 degrees.
- "Barrel", 0.85 m tall and wider in the middle, with two metal "Hoops"
  (metallic, so ray tracing has something to reflect).
- "Lantern" on top of the crate, whose "Lantern glass" glows (Emission
  Strength 6), so the compositor's Glare node has a highlight to bloom.

The factory light is replaced by three area lights: "Key" (300 W, front
left), "Fill" (80 W, front right) and "Rim" (200 W, behind). The factory
camera is kept at 50 mm and moved to a three-quarter view from the front
right, about 6 m away, so the whole group is in frame with room to spare.
The World is a dark grey. Render settings stay at their factory defaults
(EEVEE, 1920 by 1080), because the lessons change them.

Measuring gives 7 meshes and 460 triangles. The backdrop and the hoops are
open surfaces, so 96 edges read as non-manifold, and the barrel and lantern
glass have 4 n-gon caps. The exercises in these lessons make renders, not
models, so they have no measure: limits.
"""

import math

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix, Vector

    scene = starter.scene
    starter.remove_default_cube()
    old_light = bpy.data.objects.get("Light")
    if old_light is not None and old_light.type == "LIGHT":
        data = old_light.data
        bpy.data.objects.remove(old_light)
        if data.users == 0:
            bpy.data.lights.remove(data)

    def mesh_object(name, bm, material, location=(0, 0, 0), smooth=False):
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        if smooth:
            for poly in mesh.polygons:
                poly.use_smooth = abs(poly.normal.z) < 0.99 or poly.center.z < 0.01
        mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        scene.collection.objects.link(obj)
        return obj

    def lathe(profile, segments, cap_bottom=True, cap_top=True):
        """A shape turned around Z from (radius, height) pairs, bottom to top."""
        bm = bmesh.new()
        rings = []
        for radius, z in profile:
            ring = []
            for i in range(segments):
                t = 2 * math.pi * i / segments
                ring.append(bm.verts.new((radius * math.cos(t), radius * math.sin(t), z)))
            rings.append(ring)
        for a, b in zip(rings, rings[1:]):
            for i in range(segments):
                j = (i + 1) % segments
                bm.faces.new((a[i], a[j], b[j], b[i]))
        if cap_bottom:
            bm.faces.new(list(reversed(rings[0])))
        if cap_top:
            bm.faces.new(rings[-1])
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        return bm

    def box(size, bevel=0.0):
        bm = bmesh.new()
        bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Diagonal((size[0], size[1], size[2], 1.0)))
        if bevel:
            bmesh.ops.bevel(bm, geom=bm.edges[:], offset=bevel, segments=1, affect="EDGES", profile=0.5)
        return bm

    # Materials. Colours are linear RGB.
    floor_mat = starter.material("Backdrop", (0.55, 0.53, 0.50))
    wood_mat = starter.material("Crate wood", (0.42, 0.20, 0.07))
    barrel_mat = starter.material("Barrel wood", (0.28, 0.12, 0.05))
    metal_mat = starter.material("Metal", (0.55, 0.55, 0.58))
    lantern_mat = starter.material("Lantern frame", (0.05, 0.05, 0.05))
    glass_mat = starter.material("Lantern glass", (1.0, 0.55, 0.2))
    for mat, metallic, roughness in ((metal_mat, 1.0, 0.3), (lantern_mat, 1.0, 0.45), (floor_mat, 0.0, 0.6)):
        node = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
        node.inputs["Metallic"].default_value = metallic
        node.inputs["Roughness"].default_value = roughness
    glass = next(n for n in glass_mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    glass.inputs["Emission Color"].default_value = (1.0, 0.55, 0.2, 1.0)
    glass.inputs["Emission Strength"].default_value = 6.0

    # The backdrop: a floor 6 m wide that runs back and curves up into a wall.
    profile = [(-6.0, 0.0), (-3.0, 0.0), (0.0, 0.0), (1.0, 0.0)]
    for i in range(1, 9):
        a = math.pi / 2 * i / 8
        profile.append((1.0 + 2.0 * math.sin(a), 2.0 - 2.0 * math.cos(a)))
    profile.append((3.0, 6.0))
    bm = bmesh.new()
    columns = []
    for x in (-10.0, -5.0, 0.0, 5.0, 10.0):
        columns.append([bm.verts.new((x, y, z)) for y, z in profile])
    for left, right in zip(columns, columns[1:]):
        for k in range(len(profile) - 1):
            bm.faces.new((left[k], right[k], right[k + 1], left[k + 1]))
    backdrop = mesh_object("Backdrop", bm, floor_mat, smooth=True)
    backdrop.hide_select = True

    # The crate, turned a little, and the lantern on top of it.
    crate = mesh_object("Crate", box((0.7, 0.7, 0.7), bevel=0.04), wood_mat, (-0.55, 0.2, 0.35))
    crate.rotation_euler = (0, 0, math.radians(20))
    lantern = mesh_object("Lantern", box((0.22, 0.22, 0.04)), lantern_mat, (-0.55, 0.2, 0.72))
    roof = box((0.24, 0.24, 0.05))
    bmesh.ops.translate(roof, verts=roof.verts, vec=(0, 0, 0.30))
    posts = []
    for sx in (-1, 1):
        for sy in (-1, 1):
            post = box((0.025, 0.025, 0.26))
            bmesh.ops.translate(post, verts=post.verts, vec=(sx * 0.095, sy * 0.095, 0.15))
            posts.append(post)
    frame = bmesh.new()
    for part in (roof, *posts):
        mesh = bpy.data.meshes.new("part")
        part.to_mesh(mesh)
        part.free()
        frame.from_mesh(mesh)
        bpy.data.meshes.remove(mesh)
    frame_obj = mesh_object("Lantern frame", frame, lantern_mat)
    frame_obj.parent = lantern
    core = lathe([(0.07, 0.02), (0.07, 0.28)], 8)
    core_obj = mesh_object("Lantern glass", core, glass_mat)
    core_obj.parent = lantern

    # The barrel: wider in the middle, with two metal hoops.
    barrel = lathe([(0.27, 0.0), (0.31, 0.2), (0.33, 0.425), (0.31, 0.65), (0.27, 0.85)], 16)
    barrel_obj = mesh_object("Barrel", barrel, barrel_mat, (0.55, -0.1, 0.0), smooth=True)
    hoops = bmesh.new()
    for z in (0.16, 0.66):
        ring = lathe([(0.322, z - 0.03), (0.322, z + 0.03)], 16, cap_bottom=False, cap_top=False)
        mesh = bpy.data.meshes.new("hoop")
        ring.to_mesh(mesh)
        ring.free()
        hoops.from_mesh(mesh)
        bpy.data.meshes.remove(mesh)
    hoops_obj = mesh_object("Hoops", hoops, metal_mat, smooth=True)
    hoops_obj.parent = barrel_obj

    # Three area lights, each aimed at the middle of the group.
    aim = Vector((0.0, 0.05, 0.45))

    def area_light(name, power, size, location):
        light = bpy.data.lights.new(name, type="AREA")
        light.energy = power
        light.size = size
        obj = bpy.data.objects.new(name, light)
        obj.location = location
        obj.rotation_euler = (aim - Vector(location)).to_track_quat("-Z", "Y").to_euler()
        scene.collection.objects.link(obj)
        return obj

    area_light("Key", 300, 1.5, (-3.0, -3.0, 3.2))
    area_light("Fill", 80, 2.0, (3.5, -2.5, 1.8))
    area_light("Rim", 200, 1.0, (1.2, 2.6, 2.8))

    world = scene.world or bpy.data.worlds.new("World")
    scene.world = world
    background = next((n for n in world.node_tree.nodes if n.type == "BACKGROUND"), None)
    if background is not None:
        background.inputs["Color"].default_value = (0.03, 0.03, 0.035, 1.0)
        background.inputs["Strength"].default_value = 1.0

    camera = bpy.data.objects.get("Camera")
    if camera is not None and camera.type == "CAMERA":
        camera.data.lens = 50
        camera.location = (3.4, -5.0, 1.9)
        camera.rotation_euler = (aim - camera.location).to_track_quat("-Z", "Y").to_euler()
        scene.camera = camera

    for obj in bpy.data.objects:
        obj.select_set(False)
    low, high = starter.world_bounds([crate, barrel_obj, lantern])
    starter.frame_viewports(low, high)
