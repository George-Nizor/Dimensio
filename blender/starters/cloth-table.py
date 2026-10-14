"""A low-poly table with a flat tablecloth held above it, for a cloth drape.

For lesson 108, Cloth. "Table" is one mesh: a 1.2 x 0.8 m top, 5 cm thick, on
four square legs, its top surface 0.77 m above the floor. "Tablecloth" is a
single-face plane, 1.8 x 1.4 m, held level 0.25 m above the table top. It has
no cuts yet: the learner subdivides it before adding Cloth physics, because
cloth bends only at vertices. "Floor" is an 8 m plane at Z 0. No object has any
physics yet; the learner adds Cloth to the tablecloth and Collision to the table
and the floor.

The default cube is removed; the camera and the light stay. Measuring gives 3
meshes: Table (verts 40, faces 30, tris 60, ngons 0, dimensions 1.2 x 0.8 x
0.77 m), Tablecloth (verts 4, faces 1, dimensions 1.8 x 1.4 x 0 m) and Floor
(verts 4, faces 1). The exercise has no measure: limits; the result is a
simulation.
"""

OPTIONS = {}

TOP = (1.2, 0.8, 0.05)
TOP_Z = 0.77
LEG = 0.06


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    scene = starter.scene
    starter.remove_default_cube()

    def box(bm, size, centre):
        bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation(centre) @ Matrix.Diagonal((*size, 1.0)))

    def mesh_object(name, fill, material):
        bm = bmesh.new()
        fill(bm)
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        scene.collection.objects.link(obj)
        return obj

    def table(bm):
        box(bm, TOP, (0.0, 0.0, TOP_Z - TOP[2] / 2))
        height = TOP_Z - TOP[2]
        for sx in (-1, 1):
            for sy in (-1, 1):
                centre = (sx * (TOP[0] / 2 - 0.08), sy * (TOP[1] / 2 - 0.08), height / 2)
                box(bm, (LEG, LEG, height), centre)

    def plane(size, z):
        def fill(bm):
            hx, hy = size[0] / 2, size[1] / 2
            verts = [bm.verts.new((x, y, z)) for x, y in ((-hx, -hy), (hx, -hy), (hx, hy), (-hx, hy))]
            bm.faces.new(verts)
        return fill

    mesh_object("Table", table, starter.material("Wood", (0.55, 0.36, 0.2)))
    cloth = mesh_object("Tablecloth", plane((1.8, 1.4), TOP_Z + 0.25), starter.material("Cloth", (0.75, 0.2, 0.18)))
    mesh_object("Floor", plane((8.0, 8.0), 0.0), starter.material("Floor", (0.6, 0.6, 0.58)))

    for obj in scene.objects:
        obj.select_set(obj is cloth)
    bpy.context.view_layer.objects.active = cloth
    low, high = starter.world_bounds([scene.objects["Table"], cloth])
    starter.frame_viewports(low, high)
