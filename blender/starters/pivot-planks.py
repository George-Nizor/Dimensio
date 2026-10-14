"""Twelve planks to turn into a ring, and a tilted sign to slide.

For lesson 13, Pivot points and orientations.

- "Plank 01" to "Plank 12" are boards 0.3 m wide, 0.08 m thick and 1.2 m
  tall, all standing in the same place, 2 m in front of the world origin
  along +Y (X 0, Y 2), with their origins at their bottom centres. The 3D
  cursor is at the world origin. With the pivot point on 3D Cursor, turning
  Plank 02 by 30 degrees around Z, Plank 03 by 60 and so on up to Plank 12 by
  330 sets them out in a ring of radius 2 m, each board tangent to the ring.
  The planks are easiest to pick one at a time in the Outliner.
- "Sign" is a board 1.2 by 0.08 by 0.6 m off to the right, turned 35 degrees
  around Z and tipped 15 degrees around Y. "Sign target" is the same board
  drawn as a wire outline 1 m further along the sign's own X axis, in a
  reference collection that cannot be selected. G, X, X, 1 (the second X
  switches to Local) slides the sign into it.

The default cube is removed; the camera and the light stay. Nothing is
selected. Measuring gives 13 meshes (twelve planks and the sign), 156
triangles and no n-gons. The exercise has no measure: limits.
"""

import math

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Euler, Matrix, Vector

    scene = starter.scene
    starter.remove_default_cube()
    scene.cursor.location = (0.0, 0.0, 0.0)

    def board(name, size, base=False):
        bm = bmesh.new()
        lift = Matrix.Translation((0.0, 0.0, size[2] / 2)) if base else Matrix.Identity(4)
        bmesh.ops.create_cube(bm, size=1.0, matrix=lift @ Matrix.Diagonal((*size, 1.0)))
        data = bpy.data.meshes.new(name)
        bm.to_mesh(data)
        bm.free()
        return data

    plank_mesh = board("Plank", (0.3, 0.08, 1.2), base=True)
    plank_mesh.materials.append(starter.material("Plank", (0.70, 0.50, 0.30)))
    objects = []
    for number in range(1, 13):
        plank = bpy.data.objects.new(f"Plank {number:02d}", plank_mesh)
        plank.location = (0.0, 2.0, 0.0)
        scene.collection.objects.link(plank)
        objects.append(plank)

    rotation = Euler((0.0, math.radians(15.0), math.radians(35.0)))
    sign_mesh = board("Sign", (1.2, 0.08, 0.6))
    sign_mesh.materials.append(starter.material("Sign", (0.30, 0.55, 0.45)))
    sign = bpy.data.objects.new("Sign", sign_mesh)
    sign.location = (5.0, -1.0, 1.5)
    sign.rotation_euler = rotation
    scene.collection.objects.link(sign)
    objects.append(sign)

    targets = starter.reference_collection("Targets")
    target = bpy.data.objects.new("Sign target", board("Sign target", (1.2, 0.08, 0.6)))
    along = rotation.to_matrix() @ Vector((1.0, 0.0, 0.0))
    target.location = Vector(sign.location) + along * 1.0
    target.rotation_euler = rotation
    target.display_type = "WIRE"
    target.show_in_front = True
    targets.objects.link(target)

    for obj in scene.objects:
        obj.select_set(False)
    low, high = starter.world_bounds([*objects, target])
    low = Vector((min(low.x, -2.3), min(low.y, -2.3), 0.0))
    high = Vector((high.x, max(high.y, 2.3), high.z))
    starter.frame_viewports(low, high)
