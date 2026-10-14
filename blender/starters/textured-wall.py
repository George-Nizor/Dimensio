"""A brick wall waiting for its texture set: three images in the file, none connected.

For lesson 51, Image textures. "Wall" is a plane 2 m wide and 2 m tall standing
on the ground with its origin at the middle of its bottom edge, facing the front
(-Y), with a UV map that covers the whole image once. Its material, "Bricks", is a Principled BSDF with nothing connected.

The three images given with the options are loaded, packed into the file and
kept with a fake user, so the learner picks them from an Image Texture node's
image list: --color-map (the colour), --roughness-map and --normal-map (an
OpenGL normal map). The course passes ambientCG's Bricks 059 (CC0), from
desktop/public/reference/051-image-textures/. All three load with Blender's
default colour space, sRGB, so setting Non-Color on the data maps is the
learner's job.

The default cube is removed; the camera and the light stay. Every 3D Viewport
opens in Material Preview, framed on the wall.

Measuring gives 1 mesh: verts 4, faces 1, tris 2, quads 1, ngons 0,
nonManifoldEdges 4 (a plane's open border), materials 1, uvLayers 1. The
exercise has no measure: limits; what it teaches is in the node tree.
"""

import math
import os

OPTIONS = {
    "color-map": "The colour image of the texture set.",
    "roughness-map": "The roughness image of the texture set.",
    "normal-map": "The normal map of the texture set, OpenGL style.",
}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    paths = [starter.path(name, required=True) for name in ("color-map", "roughness-map", "normal-map")]

    scene = starter.scene
    starter.remove_default_cube()

    bm = bmesh.new()
    bm.loops.layers.uv.new("UVMap")
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=1.0, calc_uvs=True)
    # Stand the plane up facing -Y, its bottom edge on the ground, so the object needs no rotation.
    bmesh.ops.rotate(bm, verts=bm.verts, cent=(0.0, 0.0, 0.0), matrix=Matrix.Rotation(math.radians(90), 3, "X"))
    bmesh.ops.translate(bm, verts=bm.verts, vec=(0.0, 0.0, 1.0))
    mesh = bpy.data.meshes.new("Wall")
    bm.to_mesh(mesh)
    bm.free()
    material = bpy.data.materials.new("Bricks")
    material.diffuse_color = (0.55, 0.3, 0.22, 1.0)
    mesh.materials.append(material)
    wall = bpy.data.objects.new("Wall", mesh)
    scene.collection.objects.link(wall)

    for path in paths:
        image = bpy.data.images.load(path, check_existing=False)
        image.name = os.path.basename(path)
        image.pack()
        image.use_fake_user = True

    for obj in bpy.data.objects:
        obj.select_set(False)
    wall.select_set(True)
    bpy.context.view_layer.objects.active = wall
    low, high = starter.world_bounds([wall])
    starter.frame_viewports(low, high, view="front")
    for screen in bpy.data.screens:
        for area in screen.areas:
            if area.type == "VIEW_3D":
                for space in area.spaces:
                    if space.type == "VIEW_3D":
                        space.shading.type = "MATERIAL"
                        if space.region_3d is not None:
                            space.region_3d.view_perspective = "PERSP"
