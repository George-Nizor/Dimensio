"""A sculpted stone with a low-poly copy to bake onto, and a plank of procedural wood.

For lesson 78, Baking textures. Three objects:

- "Stone sculpt": the stone from sculpted-stone.py (20,480 triangles, 0.84 m
  long), with a procedural "Stone" material: a Noise Texture through a Color
  Ramp, from dark grey to a light, slightly green grey. It has a UV map only so
  that measuring's fewest-UV-maps count reflects the low-poly stone.
- "Stone low": a cube cut three times along each axis (96 quads) and
  shrinkwrapped onto the sculpt, shaded smooth. It has no UV map and no
  material: unwrapping it and giving it a material with an image to bake into
  are the exercise.
- "Plank": a board 1.2 m long, 0.2 m wide and 0.05 m thick, 1.6 m to the
  right of the stone, already unwrapped with Smart UV Project, with a
  procedural "Wood" material (a Wave Texture through a Color Ramp), for the
  second exercise.

Render Engine is set to Cycles, because baking needs it. The default cube is
removed; the camera and the light stay. Measuring the starting file gives 3
meshes: the sculpt 20,480 triangles, Stone low 192 triangles (96 quads, no
n-gons, no non-manifold edges), Plank 12 triangles. uvLayers reads 0 and
materials 0 (Stone low has neither) until the learner adds them; the main
exercise measures uvLayers (min 1) and materials (min 1).
"""

import importlib.util
import os

OPTIONS = {}


def _sculpted_stone():
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sculpted-stone.py")
    spec = importlib.util.spec_from_file_location("dimensio_starter_sculpted_stone_for_bake", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix, Vector

    scene = starter.scene
    starter.remove_default_cube()
    scene.render.engine = "CYCLES"

    def principled(material):
        return next(n for n in material.node_tree.nodes if n.type == "BSDF_PRINCIPLED")

    def ramp_material(name, texture_type, stops):
        material = starter.material(name, stops[0][1][:3])
        tree = material.node_tree
        bsdf = principled(material)
        bsdf.inputs["Roughness"].default_value = 0.8
        texture = tree.nodes.new(texture_type)
        texture.location = (-700, 300)
        ramp = tree.nodes.new("ShaderNodeValToRGB")
        ramp.location = (-420, 300)
        elements = ramp.color_ramp.elements
        elements[0].position, elements[0].color = stops[0]
        elements[1].position, elements[1].color = stops[-1]
        for position, colour in stops[1:-1]:
            element = elements.new(position)
            element.color = colour
        tree.links.new(texture.outputs["Fac"], ramp.inputs["Fac"])
        tree.links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
        return material, texture

    # The sculpt, with a procedural colour to bake.
    sculpt_mesh = _sculpted_stone().stone_mesh("Stone sculpt")
    stone_mat, noise = ramp_material("Stone", "ShaderNodeTexNoise", [
        (0.3, (0.08, 0.08, 0.075, 1.0)),
        (0.55, (0.25, 0.25, 0.23, 1.0)),
        (0.7, (0.30, 0.34, 0.24, 1.0)),
    ])
    noise.inputs["Scale"].default_value = 6.0
    noise.inputs["Detail"].default_value = 8.0
    sculpt_mesh.materials.append(stone_mat)
    sculpt_mesh.uv_layers.new(name="UVMap")
    sculpt = bpy.data.objects.new("Stone sculpt", sculpt_mesh)
    scene.collection.objects.link(sculpt)

    # The low-poly stone: a cut cube fitted around the sculpt and shrinkwrapped onto it.
    low_corner, high_corner = starter.world_bounds([sculpt])
    centre = (low_corner + high_corner) / 2
    size = high_corner - low_corner
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=3, use_grid_fill=True)
    bmesh.ops.transform(bm, verts=bm.verts, matrix=Matrix.Diagonal((size.x * 1.1, size.y * 1.1, size.z * 1.1, 1.0)))
    bmesh.ops.translate(bm, verts=bm.verts, vec=centre)
    cage_mesh = bpy.data.meshes.new("Stone low")
    bm.to_mesh(cage_mesh)
    bm.free()
    low = bpy.data.objects.new("Stone low", cage_mesh)
    scene.collection.objects.link(low)
    wrap = low.modifiers.new("Shrinkwrap", "SHRINKWRAP")
    wrap.target = sculpt
    wrap.wrap_method = "NEAREST_SURFACEPOINT"
    depsgraph = bpy.context.evaluated_depsgraph_get()
    wrapped = bpy.data.meshes.new_from_object(low.evaluated_get(depsgraph))
    low.modifiers.remove(wrap)
    low.data = wrapped
    bpy.data.meshes.remove(cage_mesh)
    wrapped.name = "Stone low"
    for poly in wrapped.polygons:
        poly.use_smooth = True

    # The plank, unwrapped, with procedural wood.
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Diagonal((1.2, 0.2, 0.05, 1.0)))
    plank_mesh = bpy.data.meshes.new("Plank")
    bm.to_mesh(plank_mesh)
    bm.free()
    wood_mat, wave = ramp_material("Wood", "ShaderNodeTexWave", [
        (0.0, (0.20, 0.08, 0.025, 1.0)),
        (1.0, (0.55, 0.28, 0.10, 1.0)),
    ])
    wave.inputs["Scale"].default_value = 3.0
    wave.inputs["Distortion"].default_value = 6.0
    plank_mesh.materials.append(wood_mat)
    plank = bpy.data.objects.new("Plank", plank_mesh)
    plank.location = (1.6, 0.0, 0.025)
    scene.collection.objects.link(plank)

    for obj in bpy.data.objects:
        obj.select_set(False)
    plank.select_set(True)
    bpy.context.view_layer.objects.active = plank
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project()
    bpy.ops.object.mode_set(mode="OBJECT")
    plank.select_set(False)

    bounds = starter.world_bounds([sculpt, plank])
    starter.frame_viewports(*bounds)
