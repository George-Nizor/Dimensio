"""A crate, a barrel and a rock with a test grid but no UV maps, ready to unwrap.

For lesson 55, Seams and unwrapping. Three meshes stand in a row: "Crate", a
1 m cube; "Barrel", 12-sided, 1.2 m tall, 0.8 m across at the ends and
0.88 m at its middle, with triangle-fan ends; and "Rock", an icosphere
(80 faces) pushed in and out at random from a fixed seed and squashed
to 0.75 of its height. None has a UV map or a seam, so the shared material,
"Test grid" (an Image Texture holding a generated 1024 px UV Grid, linked to
Base Color), shows as one flat colour until the learner unwraps them. Every
3D Viewport opens in Material Preview.

The default cube is removed; the camera and the light stay.

Measuring gives 3 meshes: Crate verts 8, faces 6, tris 12; Barrel verts 62,
faces 72, tris 120, quads 48; Rock verts 42, faces 80, tris 80. ngons 0,
nonManifoldEdges 0, materials 1 and uvLayers 0 on each. The lesson's measure
asks for uvLayers min 1 (every prop unwrapped).
"""

import math
import random

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    scene = starter.scene
    starter.remove_default_cube()

    image = bpy.data.images.new("UV Grid", 1024, 1024)
    image.generated_type = "UV_GRID"
    material = bpy.data.materials.new("Test grid")
    tree = material.node_tree
    bsdf = next(n for n in tree.nodes if n.type == "BSDF_PRINCIPLED")
    texture = tree.nodes.new("ShaderNodeTexImage")
    texture.image = image
    texture.location = (bsdf.location.x - 320, bsdf.location.y)
    tree.links.new(texture.outputs["Color"], bsdf.inputs["Base Color"])

    def finish(name, bm, x):
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        # bmesh's primitives add a UV map when asked; these have none, so the learner makes it.
        while mesh.uv_layers:
            mesh.uv_layers.remove(mesh.uv_layers[0])
        mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = (x, 0.0, 0.0)
        scene.collection.objects.link(obj)
        return obj

    # The crate: a 1 m cube standing on the ground.
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation((0.0, 0.0, 0.5)))
    crate = finish("Crate", bm, -2.2)

    # The barrel: rings of 12 vertices, wider in the middle, closed with triangle fans.
    bm = bmesh.new()
    n = 12
    heights = (0.0, 0.3, 0.6, 0.9, 1.2)
    radii = (0.4, 0.43, 0.44, 0.43, 0.4)
    rings = [[bm.verts.new((r * math.cos(2 * math.pi * i / n), r * math.sin(2 * math.pi * i / n), z)) for i in range(n)] for z, r in zip(heights, radii)]
    for lower, upper in zip(rings, rings[1:]):
        for i in range(n):
            j = (i + 1) % n
            bm.faces.new((lower[i], lower[j], upper[j], upper[i]))
    bottom = bm.verts.new((0.0, 0.0, 0.0))
    top = bm.verts.new((0.0, 0.0, heights[-1]))
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((rings[0][j], rings[0][i], bottom))
        bm.faces.new((rings[-1][i], rings[-1][j], top))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    barrel = finish("Barrel", bm, 0.0)

    # The rock: a lumpy, squashed icosphere, the same every time.
    rng = random.Random(55)
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=2, radius=0.5)
    for vert in bm.verts:
        vert.co *= 0.85 + 0.3 * rng.random()
        vert.co.z = vert.co.z * 0.75
    low = min(v.co.z for v in bm.verts)
    for vert in bm.verts:
        vert.co.z -= low
    rock = finish("Rock", bm, 2.2)

    for obj in bpy.data.objects:
        obj.select_set(False)
    low, high = starter.world_bounds([crate, barrel, rock])
    starter.frame_viewports(low, high)
    for screen in bpy.data.screens:
        for area in screen.areas:
            if area.type == "VIEW_3D":
                for space in area.spaces:
                    if space.type == "VIEW_3D":
                        space.shading.type = "MATERIAL"
