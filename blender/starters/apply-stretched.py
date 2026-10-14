"""Three boxes shaped in Object Mode, each with a Bevel modifier.

For lesson 15, Applying transforms. Each box is Blender's 2 m cube with its
origin at the middle of its base, standing on the ground, shaped by its
object scale. Each has a Bevel modifier 0.08 m wide with 3 segments. The
modifier works on the mesh before the object's scale, so every bevel comes
out uneven until the scale is applied:

- "Bench": scale (1, 0.25, 0.25), 2 x 0.5 x 0.5 m. The bevel is 8 cm on the
  ends and 2 cm along the long edges.
- "Pillar": scale (0.2, 0.2, 1), 0.4 x 0.4 x 2 m. 8 cm at the top and bottom,
  1.6 cm down the sides.
- "Sign": a board 1.2 x 0.8 x 0.24 m modelled lying flat, scale
  (-0.6, 0.4, 0.12), then stood up with a rotation of 90 degrees on X. The
  negative X scale mirrors it. Before applying, its Dimensions read
  1.2, 0.8, 0.24 (along its own axes); after Rotation & Scale they read
  1.2, 0.24, 0.8, the sizes along the world's X, Y and Z.

Object > Apply > Rotation & Scale (Ctrl+A) makes every bevel 8 cm and keeps
each origin where it is. In Blender 5.1 and later, applying the Sign's
negative scale also flips its faces back the right way (Corrective Flip
Normals, on by default).

Measuring the starting file gives 3 meshes, each 96 vertices, 98 faces and
188 triangles with the modifier (8 vertices and 6 quads without it), all
three with scaleApplied false and the Sign with rotationApplied false. After
Rotation & Scale is applied all three read scaleApplied true,
rotationApplied true and flippedFaces 0. Applying the Sign with Corrective
Flip Normals turned off leaves flippedFaces 98 (6 before the modifier).
"""

import math

OPTIONS = {}

BEVEL_WIDTH = 0.08


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    starter.remove_default_cube()
    scene = starter.scene

    def block(name, base, location, scale, rotation_x, colour):
        bm = bmesh.new()
        # Blender's 2 m cube, moved so the side that ends up at the bottom sits on the origin.
        bmesh.ops.create_cube(bm, size=2.0, matrix=Matrix.Translation(base), calc_uvs=True)
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(starter.material(name, colour))
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        obj.scale = scale
        obj.rotation_euler = (math.radians(rotation_x), 0.0, 0.0)
        bevel = obj.modifiers.new("Bevel", "BEVEL")
        bevel.width = BEVEL_WIDTH
        bevel.segments = 3
        scene.collection.objects.link(obj)
        return obj

    bench = block("Bench", (0.0, 0.0, 1.0), (-2.0, 0.0, 0.0), (1.0, 0.25, 0.25), 0, (0.72, 0.52, 0.32))
    pillar = block("Pillar", (0.0, 0.0, 1.0), (0.4, 0.0, 0.0), (0.2, 0.2, 1.0), 0, (0.62, 0.62, 0.66))
    # The sign lies along its own Y; turned 90 degrees on X, its Y points up.
    sign = block("Sign", (0.0, 1.0, -1.0), (2.2, 0.0, 0.0), (-0.6, 0.4, 0.12), 90, (0.36, 0.55, 0.42))

    for obj in bpy.data.objects:
        obj.select_set(False)
    low, high = starter.world_bounds([bench, pillar, sign])
    starter.frame_viewports(low, high)
