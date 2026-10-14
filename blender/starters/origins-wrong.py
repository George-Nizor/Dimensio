"""A crate, a lamp and a door whose origins are in the wrong places.

For lesson 14, Origins. Each object stands on the grid where it belongs; only
its origin is wrong. The 3D cursor is at the world origin.

- "Crate", a 1 m cube centred at X -3, Y 0, standing on the grid. Its origin
  floats above and behind it, at (-1.8, 1.6, 2.2). Fixed, the origin is at
  the middle of its base, (-3, 0, 0): Origin to Geometry puts it at
  (-3, 0, 0.5), then moving only the origin 0.5 m down along Z.
- "Lamp", a lamp post 2.6 m tall (a base plate, a pole and a lantern) whose
  base centre is at the world origin. Its origin is at the top of the
  lantern, (0, 0, 2.6). Fixed, it is at (0, 0, 0): Origin to 3D Cursor, with
  the cursor where it starts.
- "Door", 0.9 m wide, 0.1 m thick and 2.1 m tall, centred at X 3, Y 0,
  standing on the grid, seen face on from the front view. Its origin is off
  to one side, at (4.2, -0.8, 1.6). Fixed, it is on the hinge: the bottom of
  the door's left edge as seen from the front, (2.55, 0, 0). Origin to
  Geometry puts it at (3, 0, 1.05); then moving only the origin 0.45 m along
  -X and 1.05 m down.

The default cube is removed; the camera and the light stay. Nothing is
selected. Measuring gives 3 meshes, 60 triangles and no n-gons, with every
scale and rotation applied. The exercise has no measure: limits.
"""

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix, Vector

    scene = starter.scene
    starter.remove_default_cube()
    scene.cursor.location = (0.0, 0.0, 0.0)

    def boxes(name, parts, origin, colour):
        """One mesh object from boxes given as (centre, size) in world space, with its origin at ``origin``."""
        bm = bmesh.new()
        for centre, size in parts:
            local = Vector(centre) - Vector(origin)
            bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation(local) @ Matrix.Diagonal((*size, 1.0)))
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(starter.material(name, colour))
        obj = bpy.data.objects.new(name, mesh)
        obj.location = origin
        scene.collection.objects.link(obj)
        return obj

    crate = boxes("Crate", [((-3.0, 0.0, 0.5), (1.0, 1.0, 1.0))], (-1.8, 1.6, 2.2), (0.80, 0.58, 0.32))
    lamp = boxes("Lamp", [
        ((0.0, 0.0, 0.05), (0.4, 0.4, 0.1)),
        ((0.0, 0.0, 1.2), (0.12, 0.12, 2.2)),
        ((0.0, 0.0, 2.45), (0.3, 0.3, 0.3)),
    ], (0.0, 0.0, 2.6), (0.25, 0.27, 0.30))
    door = boxes("Door", [((3.0, 0.0, 1.05), (0.9, 0.1, 2.1))], (4.2, -0.8, 1.6), (0.45, 0.30, 0.20))

    for obj in scene.objects:
        obj.select_set(False)
    low, high = starter.world_bounds([crate, lamp, door])
    starter.frame_viewports(low, high)
