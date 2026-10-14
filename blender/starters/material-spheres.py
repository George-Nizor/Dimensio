"""Six smooth spheres in a row on a checked floor, waiting for materials.

For lesson 48, The Principled BSDF. The spheres are named, from left to right,
"Painted wood", "Rough stone", "Gold", "Red plastic", "Glowing crystal" and
"Glass". Each is a UV sphere 0.8 m across (32 segments, 16 rings), shaded
smooth, standing on the floor, with a UV map and no material, so the learner
gives each one its own.

Behind them a floor and a back wall carry a grey Checker Texture, so the glass
sphere shows what is behind it. Floor and wall sit in a "Stage" reference
collection: they cannot be selected and measuring skips them. The default cube
is removed; the camera and the light stay. Every 3D Viewport opens in Material
Preview.

Measuring gives 6 meshes, each with verts 482, faces 512, tris 960, ngons 0,
nonManifoldEdges 0, uvLayers 1 and materials 0 until the learner adds them.
"""

import math

OPTIONS = {}

NAMES = ["Painted wood", "Rough stone", "Gold", "Red plastic", "Glowing crystal", "Glass"]
RADIUS = 0.4
SPACING = 1.1


def build(starter):
    import bmesh
    import bpy

    scene = starter.scene
    starter.remove_default_cube()

    spheres = []
    for index, name in enumerate(NAMES):
        bm = bmesh.new()
        bm.loops.layers.uv.new("UVMap")
        bmesh.ops.create_uvsphere(bm, u_segments=32, v_segments=16, radius=RADIUS, calc_uvs=True)
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        for polygon in mesh.polygons:
            polygon.use_smooth = True
        obj = bpy.data.objects.new(name, mesh)
        obj.location = ((index - (len(NAMES) - 1) / 2) * SPACING, 0.0, RADIUS)
        scene.collection.objects.link(obj)
        spheres.append(obj)

    # A grey checked floor and back wall, so glass and alpha have something to show.
    stage = starter.reference_collection("Stage")
    checks = bpy.data.materials.new("Stage checks")
    tree = checks.node_tree
    bsdf = next(n for n in tree.nodes if n.type == "BSDF_PRINCIPLED")
    checker = tree.nodes.new("ShaderNodeTexChecker")
    checker.location = (bsdf.location.x - 260, bsdf.location.y)
    checker.inputs["Color1"].default_value = (0.75, 0.75, 0.75, 1.0)
    checker.inputs["Color2"].default_value = (0.12, 0.12, 0.12, 1.0)
    coords = tree.nodes.new("ShaderNodeTexCoord")
    coords.location = (checker.location.x - 220, checker.location.y)
    tree.links.new(coords.outputs["Object"], checker.inputs["Vector"])
    checker.inputs["Scale"].default_value = 2.0
    tree.links.new(checker.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.8
    checks.diffuse_color = (0.45, 0.45, 0.45, 1.0)

    def panel(name, size, location, rotation):
        bm = bmesh.new()
        bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=0.5)
        for vert in bm.verts:
            vert.co.x *= size[0]
            vert.co.y *= size[1]
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(checks)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        obj.rotation_euler = rotation
        stage.objects.link(obj)
        return obj

    width = SPACING * len(NAMES) + 1.0
    floor = panel("Floor", (width, 3.0), (0.0, 0.5, 0.0), (0.0, 0.0, 0.0))
    wall = panel("Back wall", (width, 2.0), (0.0, 2.0, 1.0), (math.radians(90), 0.0, 0.0))

    for obj in bpy.data.objects:
        obj.select_set(False)
    low, high = starter.world_bounds(spheres)
    starter.frame_viewports(low, high)
    for screen in bpy.data.screens:
        for area in screen.areas:
            if area.type == "VIEW_3D":
                for space in area.spaces:
                    if space.type == "VIEW_3D":
                        space.shading.type = "MATERIAL"
    return floor, wall
