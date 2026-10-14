"""Three props whose materials go wrong in Godot.

For lesson 63, Materials in Godot. Three props stand in a row on the ground,
1.5 m apart:

- "Sign" at X -1.5: a post and a board coloured from "Palette", a 4 by 4
  pixel palette image packed into the file. Each face's UVs cover one whole
  pixel. The Image Texture node's Interpolation is Linear, so colours blur
  into their neighbours across every face, in Material Preview and in Godot.
- "Crate" at X 0: a 0.8 m box whose faces all point inwards. Its material,
  "Crate wood", has Backface Culling (Camera) on, so the crate looks
  see-through in Material Preview and in Godot.
- "Bush" at X 1.5: an ico sphere 0.9 m across, painted in two greens in a
  face-corner colour attribute, "Attribute". Its material, "Bush", is a plain
  grey Principled BSDF with no Color Attribute node, so the glTF exporter
  writes no colours for it and it shows grey.

The default cube is removed; the camera and the light stay.

Measuring the starting file gives 3 meshes and 116 triangles: Sign 24, Crate
12 (flippedFaces 6), Bush 80. Sign has one UV map; Crate and Bush have
none. The exercise measures flippedFaces (max 0).
"""

OPTIONS = {}

# The palette, bottom row first, as linear RGB. Swatch 0 is the board's red,
# swatch 1 the post's brown.
PALETTE = [
    (0.60, 0.05, 0.04), (0.20, 0.09, 0.03), (0.90, 0.70, 0.10), (0.05, 0.25, 0.60),
    (0.10, 0.40, 0.08), (0.80, 0.80, 0.78), (0.05, 0.05, 0.05), (0.50, 0.20, 0.45),
    (0.95, 0.40, 0.10), (0.30, 0.55, 0.70), (0.40, 0.40, 0.40), (0.70, 0.55, 0.35),
    (0.15, 0.15, 0.25), (0.85, 0.20, 0.30), (0.25, 0.30, 0.10), (0.95, 0.90, 0.60),
]


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    scene = starter.scene
    starter.remove_default_cube()

    def mesh_object(name, bm, material, location):
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        scene.collection.objects.link(obj)
        return obj

    # The palette image, 4 by 4 pixels, packed so the file still works when copied.
    image = bpy.data.images.new("Palette", 4, 4, alpha=False)
    pixels = []
    for r, g, b in PALETTE:
        pixels.extend((r, g, b, 1.0))
    image.pixels.foreach_set(pixels)
    image.pack()

    palette = starter.material("Palette", PALETTE[0])
    palette.use_backface_culling = True
    tree = palette.node_tree
    bsdf = next(n for n in tree.nodes if n.type == "BSDF_PRINCIPLED")
    texture = tree.nodes.new("ShaderNodeTexImage")
    texture.image = image
    texture.interpolation = "Linear"
    texture.location = (bsdf.location.x - 320, bsdf.location.y)
    tree.links.new(texture.outputs["Color"], bsdf.inputs["Base Color"])

    # The sign: a post and a board. Every face's UVs fill one pixel of the palette.
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation((0.0, 0.0, 0.6)) @ Matrix.Diagonal((0.08, 0.08, 1.2, 1.0)))
    post = set(bm.faces)
    bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation((0.0, -0.05, 1.05)) @ Matrix.Diagonal((0.8, 0.05, 0.4, 1.0)))
    uv = bm.loops.layers.uv.new("UVMap")

    def swatch(index):
        x, y = index % 4, index // 4
        return [((x + 0.0) / 4, (y + 0.0) / 4), ((x + 1.0) / 4, (y + 0.0) / 4),
                ((x + 1.0) / 4, (y + 1.0) / 4), ((x + 0.0) / 4, (y + 1.0) / 4)]

    for face in bm.faces:
        corners = swatch(1 if face in post else 0)
        for loop, corner in zip(face.loops, corners):
            loop[uv].uv = corner
    sign = mesh_object("Sign", bm, palette, (-1.5, 0.0, 0.0))

    # The crate: a box turned inside out, with Backface Culling on.
    wood = starter.material("Crate wood", (0.45, 0.25, 0.10))
    wood.use_backface_culling = True
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=0.8, matrix=Matrix.Translation((0.0, 0.0, 0.4)))
    bmesh.ops.reverse_faces(bm, faces=bm.faces)
    crate = mesh_object("Crate", bm, wood, (0.0, 0.0, 0.0))

    # The bush: painted with vertex colours that its material never reads.
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=2, radius=0.45, matrix=Matrix.Translation((0.0, 0.0, 0.45)))
    bush_mat = starter.material("Bush", (0.6, 0.6, 0.6))
    bush_mat.use_backface_culling = True
    bush = mesh_object("Bush", bm, bush_mat, (1.5, 0.0, 0.0))
    colours = bush.data.color_attributes.new("Attribute", "BYTE_COLOR", "CORNER")
    bush.data.color_attributes.active_color = colours
    for poly in bush.data.polygons:
        green = (0.10, 0.35, 0.06, 1.0) if poly.center.z < 0.45 else (0.22, 0.55, 0.12, 1.0)
        for index in poly.loop_indices:
            colours.data[index].color = green

    for obj in bpy.data.objects:
        obj.select_set(False)
    low, high = starter.world_bounds([sign, crate, bush])
    starter.frame_viewports(low, high)
