"""A door that swings open and a hanging lamp that swings once.

For lesson 90, The Graph Editor. Both objects have their origin where they
turn, and both use Blender's default Bézier keys with Auto Clamped handles:

- "Door", a slab 0.9 m wide, 5 cm thick and 2 m tall, with its origin on
  the hinge edge. Its Z Euler Rotation has two keys: 0 degrees at frame 1
  and 100 degrees at frame 20. With the default handles it starts slowly
  and settles slowly, the timing the exercise changes to a hard stop.
- "Lamp", a cord 1 m long and an 8-sided shade, one mesh, hanging from its
  origin 3 m up. Its X Euler Rotation has two keys: -15 degrees at frame 1
  and 15 degrees at frame 25. It swings one way and stops; the exercise
  makes it swing back and repeat forever.

The scene's frame range is 1 to 96. The floor is in a "Floor" reference
collection, which measuring skips. The default cube is removed; the camera
and the light stay. Measuring the starting file gives 2 meshes, 52
triangles and 2 n-gons (the ends of the lamp shade). The exercise has no
measure: limits.
"""

OPTIONS = {}


def build(starter):
    import math

    import bmesh
    import bpy
    from mathutils import Matrix

    scene = starter.scene
    starter.remove_default_cube()

    def link(name, bm, material, location, collection):
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        collection.objects.link(obj)
        return obj

    # The door: the hinge edge on the origin, the slab running along +X.
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation((0.45, 0.0, 1.0)) @ Matrix.Diagonal((0.9, 0.05, 2.0, 1.0)))
    door = link("Door", bm, starter.material("Door", (0.55, 0.36, 0.22)), (-2.0, 0.0, 0.0), scene.collection)

    # The lamp: a cord hanging from the origin and a shade at its end.
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation((0.0, 0.0, -0.5)) @ Matrix.Diagonal((0.02, 0.02, 1.0, 1.0)))
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=8, radius1=0.3, radius2=0.08, depth=0.3,
                          matrix=Matrix.Translation((0.0, 0.0, -1.15)))
    lamp = link("Lamp", bm, starter.material("Lamp", (0.90, 0.78, 0.35)), (1.5, 0.0, 3.0), scene.collection)

    def key(obj, axis, frames_degrees):
        for frame, degrees in frames_degrees:
            obj.rotation_euler[axis] = math.radians(degrees)
            obj.keyframe_insert("rotation_euler", index=axis, frame=frame)

    key(door, 2, [(1, 0.0), (20, 100.0)])
    key(lamp, 0, [(1, -15.0), (25, 15.0)])

    scene.frame_start = 1
    scene.frame_end = 96
    scene.frame_set(1)

    floor_collection = starter.reference_collection("Floor")
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=3.0)
    link("Floor", bm, starter.material("Floor", (0.62, 0.62, 0.60)), (0.0, 0.0, 0.0), floor_collection)

    for obj in bpy.data.objects:
        obj.select_set(False)
    starter.frame_viewports((-2.5, -1.0, 0.0), (2.5, 1.0, 3.0))
