"""Three props with ready-made UV maps and a test grid, for reading UV maps.

For lesson 54, UV maps. Three meshes stand in a row, "Prop 1" to "Prop 3",
sharing one material, "Test grid": an Image Texture holding a generated
1024 px UV Grid image, linked to Base Color. Every 3D Viewport opens in
Material Preview so the grid shows. Each prop has one UV map, "UVMap",
written vertex by vertex:

- Prop 1, a 1 m cube: a cross layout, every face a square of the same size.
  Nothing stretches.
- Prop 2, a 12-sided barrel 0.8 m across and 1 m tall with triangle-fan ends:
  the sides are one strip in the right proportions, but each end was
  projected from the front, so it lies on the UV map as a flat line. Both
  ends stretch.
- Prop 3, a ramp 1 m wide, 1 m deep and 1.5 m tall at the back: the bottom,
  the back and the two sides are in proportion, but the sloping face was
  projected from above, so its UVs are 1.8 times too short along the slope.
  Only the slope stretches.

The answers to the exercise are: none on Prop 1, the two ends on Prop 2 and
the slope on Prop 3. The default cube is removed; the camera and the light
stay.

Measuring gives 3 meshes: Prop 1 verts 8, faces 6, tris 12; Prop 2 verts 26,
faces 36, tris 48; Prop 3 verts 6, faces 5, tris 8. ngons 0,
nonManifoldEdges 0, materials 1 and uvLayers 1 on each. The exercise makes no
model and has no measure: limits.
"""

import math

OPTIONS = {}

# A metre is a quarter of the image across, on every prop.
UNIT = 0.25


def build(starter):
    import bmesh
    import bpy

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

    def make(name, verts, faces, uvs, x):
        bm = bmesh.new()
        layer = bm.loops.layers.uv.new("UVMap")
        bverts = [bm.verts.new(co) for co in verts]
        for face, face_uvs in zip(faces, uvs):
            bface = bm.faces.new([bverts[i] for i in face])
            for loop, uv in zip(bface.loops, face_uvs):
                loop[layer].uv = uv
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = (x, 0.0, 0.0)
        scene.collection.objects.link(obj)
        return obj

    # Prop 1: a cube in a cross layout. Faces as (corner indices, normal axis, sign).
    h = 0.5
    cube_verts = [(x, y, z + h) for z in (-h, h) for y in (-h, h) for x in (-h, h)]
    cube_faces = [
        ((0, 4, 6, 2), "-x"), ((1, 3, 7, 5), "+x"),
        ((0, 1, 5, 4), "-y"), ((2, 6, 7, 3), "+y"),
        ((0, 2, 3, 1), "-z"), ((4, 5, 7, 6), "+z"),
    ]
    cells = {"-x": (0.0, 0.375), "-y": (0.25, 0.375), "+x": (0.5, 0.375), "+y": (0.75, 0.375), "+z": (0.25, 0.625), "-z": (0.25, 0.125)}
    # The two axes across each face, so that no face is mirrored seen from outside.
    across = {"-x": ((1, -1), (2, 1)), "+x": ((1, 1), (2, 1)), "-y": ((0, 1), (2, 1)), "+y": ((0, -1), (2, 1)), "+z": ((0, 1), (1, 1)), "-z": ((0, 1), (1, -1))}

    def cube_uv(co, side):
        (a, sa), (b, sb) = across[side]
        u0, v0 = cells[side]
        s = (co[a] + h) if a != 2 else co[a]
        t = (co[b] + h) if b != 2 else co[b]
        s = s if sa > 0 else 1.0 - s
        t = t if sb > 0 else 1.0 - t
        return (u0 + s * UNIT, v0 + t * UNIT)

    make("Prop 1", cube_verts, [f for f, _ in cube_faces], [[cube_uv(cube_verts[i], side) for i in f] for f, side in cube_faces], -2.2)

    # Prop 2: a 12-sided barrel. Sides as one strip; each end projected from the front, so flat.
    n = 12
    radius = 0.4
    height = 1.0
    verts = []
    for z in (0.0, height):
        for i in range(n):
            a = 2 * math.pi * i / n
            verts.append((radius * math.cos(a), radius * math.sin(a), z))
    bottom_c = len(verts)
    verts.append((0.0, 0.0, 0.0))
    top_c = len(verts)
    verts.append((0.0, 0.0, height))
    faces = []
    uvs = []
    side = 2 * radius * math.sin(math.pi / n)
    strip = n * side * UNIT
    u_start = (1.0 - strip) / 2
    for i in range(n):
        j = (i + 1) % n
        faces.append((i, j, n + j, n + i))
        u0 = u_start + i * side * UNIT
        u1 = u_start + (i + 1) * side * UNIT
        uvs.append([(u0, 0.4), (u1, 0.4), (u1, 0.4 + height * UNIT), (u0, 0.4 + height * UNIT)])

    def front(co, v):
        return (0.375 + (co[0] + radius) * UNIT, v)

    for i in range(n):
        j = (i + 1) % n
        faces.append((j, i, bottom_c))
        uvs.append([front(verts[k], 0.2) for k in (j, i, bottom_c)])
        faces.append((n + i, n + j, top_c))
        uvs.append([front(verts[k], 0.8) for k in (n + i, n + j, top_c)])
    make("Prop 2", verts, faces, uvs, 0.0)

    # Prop 3: a ramp. The slope's UVs come from looking down on it, so they are too short.
    w, d, tall = 1.0, 1.0, 1.5
    verts = [(-w / 2, -d / 2, 0.0), (w / 2, -d / 2, 0.0), (w / 2, d / 2, 0.0), (-w / 2, d / 2, 0.0), (-w / 2, d / 2, tall), (w / 2, d / 2, tall)]
    faces = [(0, 3, 2, 1), (3, 4, 5, 2), (0, 1, 5, 4), (0, 4, 3), (1, 2, 5)]
    U = UNIT
    uvs = [
        [(0.05, 0.05), (0.05, 0.05 + d * U), (0.05 + w * U, 0.05 + d * U), (0.05 + w * U, 0.05)],
        [(0.35 + w * U, 0.05), (0.35 + w * U, 0.05 + tall * U), (0.35, 0.05 + tall * U), (0.35, 0.05)],
        [(0.65, 0.05), (0.65 + w * U, 0.05), (0.65 + w * U, 0.05 + d * U), (0.65, 0.05 + d * U)],
        [(0.05, 0.55), (0.05 + d * U, 0.55 + tall * U), (0.05 + d * U, 0.55)],
        [(0.35, 0.55), (0.35 + d * U, 0.55), (0.35 + d * U, 0.55 + tall * U)],
    ]
    make("Prop 3", verts, faces, uvs, 2.2)

    props = [bpy.data.objects[name] for name in ("Prop 1", "Prop 2", "Prop 3")]
    for obj in bpy.data.objects:
        obj.select_set(False)
    low, high = starter.world_bounds(props)
    starter.frame_viewports(low, high)
    for screen in bpy.data.screens:
        for area in screen.areas:
            if area.type == "VIEW_3D":
                for space in area.spaces:
                    if space.type == "VIEW_3D":
                        space.shading.type = "MATERIAL"
