"""A treasure chest, a floor and a small plane where coins will pour from.

For lesson 113, Simulation nodes. "Chest" is a 0.8 x 0.5 x 0.5 m box standing
on the floor at the origin. "Spout" is a 0.3 x 0.3 m plane level with the
chest's top, 0.5 m up, centred 0.4 m in front of the chest's middle (-Y), just
past its front face. Its origin is at the world origin and its vertices sit
0.5 m up, so inside a Geometry Nodes tree on it, Z 0 is the floor. "Floor" is a 6 m plane at
Z 0. Nothing has modifiers; the learner adds a Geometry Nodes modifier to the
spout and builds a simulation zone that drops coins from it.

The default cube is removed; the camera and the light stay. Measuring gives 3
meshes: Chest (verts 8, faces 6, dimensions 0.8 x 0.5 x 0.5 m), Spout (verts 4,
faces 1, dimensions 0.3 x 0.3 x 0 m) and Floor (verts 4, faces 1).
"""

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    scene = starter.scene
    starter.remove_default_cube()

    def mesh_object(name, fill, colour):
        bm = bmesh.new()
        fill(bm)
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(starter.material(name, colour))
        obj = bpy.data.objects.new(name, mesh)
        scene.collection.objects.link(obj)
        return obj

    def quad(size, centre):
        def fill(bm):
            hx, hy = size[0] / 2, size[1] / 2
            cx, cy, cz = centre
            bm.faces.new([bm.verts.new((cx + x, cy + y, cz)) for x, y in ((-hx, -hy), (hx, -hy), (hx, hy), (-hx, hy))])
        return fill

    def chest(bm):
        bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation((0.0, 0.0, 0.25)) @ Matrix.Diagonal((0.8, 0.5, 0.5, 1.0)))

    mesh_object("Chest", chest, (0.5, 0.32, 0.18))
    spout = mesh_object("Spout", quad((0.3, 0.3), (0.0, -0.4, 0.5)), (0.85, 0.7, 0.2))
    mesh_object("Floor", quad((6.0, 6.0), (0.0, 0.0, 0.0)), (0.55, 0.55, 0.52))

    for obj in scene.objects:
        obj.select_set(obj is spout)
    bpy.context.view_layer.objects.active = spout
    low, high = starter.world_bounds([scene.objects["Chest"], spout])
    starter.frame_viewports(low, high)
