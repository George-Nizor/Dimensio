"""An empty scene with two model files beside it to import, one at the wrong size.

For lesson 123, Importing and exporting. The starter makes two props, writes
each to a file in a folder called "Import practice" beside the saved .blend,
then removes them, so the learner imports them:

- "lantern.glb", a glTF file of "Lantern": a 0.3 m square base, a body and a
  top, 0.6 m tall in all, with the material "Lantern". It imports at its
  real size.
- "crate.obj" (with "crate.mtl"), a Wavefront file of "Crate", a 0.5 m box
  with the material "Crate", written with Scale 100 as if it came from an app
  that works in centimetres. It imports 50 m wide, 100 times too big.

The saved scene holds only the camera and the light; the default cube is
removed. Measuring it gives 0 meshes. After both imports with the importers'
default settings, and the crate's scale fixed and applied, it gives 2 meshes
with scaleApplied true on both: Crate (verts 8, faces 6, tris 12, dimensions
0.5 m) and Lantern (dimensions 0.3 x 0.3 x 0.6 m). The glTF importer brings
the lantern in as triangles with its flat-shaded corners split, so it
measures verts 72, faces 36, tris 36, doubles 48 and nonManifoldEdges 72;
those are not the learner's doing, so the exercise measures only
scaleApplied and the mesh count.
"""

import os

OPTIONS = {}

FOLDER = "Import practice"


def _out_dir():
    from dimensio_common import DimensioError, script_args

    args = script_args()
    if "--out" not in args or args.index("--out") + 1 >= len(args):
        raise DimensioError("The import-practice starter needs --out to know where to put its files.")
    return os.path.dirname(os.path.abspath(args[args.index("--out") + 1]))


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    folder = os.path.join(_out_dir(), FOLDER)
    os.makedirs(folder, exist_ok=True)
    starter.remove_default_cube()
    scene = starter.scene

    def add(name, boxes, colour):
        bm = bmesh.new()
        bm.loops.layers.uv.new("UVMap")  # calc_uvs below fills the layer that exists
        for size, centre in boxes:
            bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation(centre) @ Matrix.Diagonal((*size, 1.0)), calc_uvs=True)
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(starter.material(name, colour))
        obj = bpy.data.objects.new(name, mesh)
        scene.collection.objects.link(obj)
        return obj

    lantern = add("Lantern", [
        ((0.3, 0.3, 0.05), (0, 0, 0.025)),
        ((0.22, 0.22, 0.4), (0, 0, 0.25)),
        ((0.3, 0.3, 0.15), (0, 0, 0.525)),
    ], (0.95, 0.7, 0.25))
    crate = add("Crate", [((0.5, 0.5, 0.5), (0, 0, 0.25))], (0.55, 0.36, 0.19))

    def only(obj):
        for other in bpy.data.objects:
            other.select_set(other == obj)
        bpy.context.view_layer.objects.active = obj

    only(lantern)
    bpy.ops.export_scene.gltf(filepath=os.path.join(folder, "lantern.glb"), export_format="GLB", use_selection=True)
    only(crate)
    bpy.ops.wm.obj_export(filepath=os.path.join(folder, "crate.obj"), export_selected_objects=True, global_scale=100.0)

    for obj in (lantern, crate):
        mesh = obj.data
        bpy.data.objects.remove(obj)
        bpy.data.meshes.remove(mesh)
    for material in list(bpy.data.materials):
        if material.users == 0:
            bpy.data.materials.remove(material)
    for obj in bpy.data.objects:
        obj.select_set(False)
