"""A block car in loose parts, ready to be parented.

For lesson 16, Parenting and empties. Six mesh objects stand in place as one
car facing -Y, none of them parented:

- "Body": a box 1.6 x 3.6 x 0.7 m, its bottom 0.35 m above the ground, with
  its origin on the ground under its middle.
- "Cabin": a box 1.4 x 1.8 x 0.5 m on top of the body, a little to the back.
- "Wheel FL", "Wheel FR", "Wheel BL", "Wheel BR": 12-sided cylinders 0.7 m
  across and 0.3 m wide, turned to roll along Y, each with its origin at its
  own centre so it spins on its axle.

There is no empty; the learner adds one. The camera and the light stay.
Measuring gives 6 meshes, 120 vertices, 216 triangles and no n-gons (the
wheels' caps are triangle fans). The exercise has no measure: limits,
because parenting is checked in the Outliner.
"""

import math

OPTIONS = {}

WHEEL_RADIUS = 0.35
WHEEL_WIDTH = 0.3


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    starter.remove_default_cube()
    scene = starter.scene
    paint = starter.material("Paint", (0.75, 0.22, 0.18))
    glass = starter.material("Glass", (0.55, 0.72, 0.80))
    tyre = starter.material("Tyre", (0.12, 0.12, 0.13))

    def mesh_object(name, make, location, material):
        bm = bmesh.new()
        make(bm)
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        scene.collection.objects.link(obj)
        return obj

    def box(size, centre):
        def make(bm):
            matrix = Matrix.Translation(centre) @ Matrix.Diagonal((size[0], size[1], size[2], 1.0))
            bmesh.ops.create_cube(bm, size=1.0, matrix=matrix, calc_uvs=True)
        return make

    def wheel(bm):
        # A cylinder on its side: its axis along X, so it rolls along Y.
        matrix = Matrix.Rotation(math.radians(90), 4, "Y")
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=True, segments=12,
                              radius1=WHEEL_RADIUS, radius2=WHEEL_RADIUS, depth=WHEEL_WIDTH,
                              matrix=matrix, calc_uvs=True)

    body = mesh_object("Body", box((1.6, 3.6, 0.7), (0.0, 0.0, 0.7)), (0.0, 0.0, 0.0), paint)
    cabin = mesh_object("Cabin", box((1.4, 1.8, 0.5), (0.0, 0.0, 0.0)), (0.0, 0.25, 1.3), glass)
    wheels = []
    for name, x, y in (("Wheel FL", -0.8, -1.15), ("Wheel FR", 0.8, -1.15),
                       ("Wheel BL", -0.8, 1.15), ("Wheel BR", 0.8, 1.15)):
        wheels.append(mesh_object(name, wheel, (x, y, WHEEL_RADIUS), tyre))

    for obj in bpy.data.objects:
        obj.select_set(False)
    low, high = starter.world_bounds([body, cabin, *wheels])
    starter.frame_viewports(low, high)
