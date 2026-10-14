"""A crate and a barrel whose two texture images have been moved.

For lesson 122, Packing and file paths. This starter breaks the rule that a
starter packs its images: the exercise is to find them. It writes two small
PNG textures into a folder called "Moved textures" beside the saved .blend
file ("crate-planks.png" and "barrel-staves.png", 64 by 64 pixels each),
then points the scene's images at a "textures" folder beside the .blend that
does not exist. Opened in Blender, both models show pink (magenta) in
Material Preview, File > External Data > Report Missing Files lists 2 files,
and Find Missing Files on "Moved textures" finds both.

- "Crate", a 0.8 m box at X -0.7 with UVs, material "Planks".
- "Barrel", a 12-sided cylinder 0.9 m tall at X 0.7 with UVs, material
  "Staves".

Each material is a Principled BSDF with an Image Texture in its Base Color.
The default cube is removed; the camera and the light stay. Measuring gives 2
meshes: verts 8 + 24 = 32, faces 6 + 14 = 20, tris 12 + 44 = 56, ngons 2 (the
barrel's caps), uvLayers 1 each, materials 1 each. The exercise has no
measure: limits.
"""

import os

OPTIONS = {}

FOLDER = "Moved textures"


def _out_dir():
    from dimensio_common import DimensioError, script_args

    args = script_args()
    if "--out" not in args or args.index("--out") + 1 >= len(args):
        raise DimensioError("The missing-textures starter needs --out to know where to put its textures.")
    return os.path.dirname(os.path.abspath(args[args.index("--out") + 1]))


def _texture(name, pixel):
    """A 64 by 64 image filled by pixel(x, y) -> (r, g, b)."""
    import bpy

    image = bpy.data.images.new(name, 64, 64, alpha=False)
    data = []
    for y in range(64):
        for x in range(64):
            data.extend((*pixel(x, y), 1.0))
    image.pixels = data
    return image


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    out_dir = _out_dir()
    moved = os.path.join(out_dir, FOLDER)
    os.makedirs(moved, exist_ok=True)
    starter.remove_default_cube()

    def planks(x, y):
        gap = y % 16 in (0, 1)
        grain = 0.04 * ((x * 7 + y * 3) % 5) / 4
        return (0.18, 0.11, 0.06) if gap else (0.55 + grain, 0.36 + grain, 0.19)

    def staves(x, y):
        band = 10 <= y <= 14 or 49 <= y <= 53
        gap = x % 8 == 0
        if band:
            return (0.35, 0.36, 0.38)
        return (0.2, 0.12, 0.07) if gap else (0.5, 0.31, 0.16)

    images = {}
    for file_name, pixel in (("crate-planks.png", planks), ("barrel-staves.png", staves)):
        image = _texture(file_name, pixel)
        image.filepath_raw = os.path.join(moved, file_name)
        image.file_format = "PNG"
        image.save()
        images[file_name] = image

    def material(name, image):
        mat = starter.material(name, (0.5, 0.33, 0.18))
        tree = mat.node_tree
        bsdf = next(n for n in tree.nodes if n.type == "BSDF_PRINCIPLED")
        node = tree.nodes.new("ShaderNodeTexImage")
        node.image = image
        node.location = (bsdf.location.x - 320, bsdf.location.y)
        tree.links.new(node.outputs["Color"], bsdf.inputs["Base Color"])
        return mat

    def add(name, make, location, mat):
        bm = bmesh.new()
        bm.loops.layers.uv.new("UVMap")  # calc_uvs below fills the layer that exists
        make(bm)
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(mat)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        starter.scene.collection.objects.link(obj)
        return obj

    def crate(bm):
        bmesh.ops.create_cube(bm, size=0.8, matrix=Matrix.Translation((0, 0, 0.4)), calc_uvs=True)

    def barrel(bm):
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=12, radius1=0.35, radius2=0.35,
                              depth=0.9, matrix=Matrix.Translation((0, 0, 0.45)), calc_uvs=True)

    objects = [
        add("Crate", crate, (-0.7, 0, 0), material("Planks", images["crate-planks.png"])),
        add("Barrel", barrel, (0.7, 0, 0), material("Staves", images["barrel-staves.png"])),
    ]

    # Point both images at a folder that is not there, as if the textures had been moved away.
    for file_name, image in images.items():
        image.filepath = os.path.join(out_dir, "textures", file_name)
        image.reload()

    for obj in bpy.data.objects:
        obj.select_set(False)
    low, high = starter.world_bounds(objects)
    starter.frame_viewports(low, high)
