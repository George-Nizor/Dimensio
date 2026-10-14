"""A small library file of three props to append, link and mark as assets.

For lesson 120, Linking and appending, and lesson 121, The Asset Browser.
The props stand in a row along X, each with its origin at the middle of its
base, in a collection called "Props":

- "Crate", a 0.8 m box at X -1.5, with the "Wood" material.
- "Barrel", twelve-sided, 0.9 m tall and widest in the middle, at X 0, with
  "Wood" on its sides and "Metal" on its two end caps.
- "Lamp", a 1.6 m post with a 0.3 m box on top, at X 1.5, with "Metal".

Each mesh has the same name as its object. The default cube is removed; the
camera and the light stay, in the scene's own collection. Measuring gives
3 meshes: verts 8 + 36 + 16 = 60, faces 6 + 26 + 12 = 44, tris 12 + 68 + 24
= 104, ngons 2 (the barrel's caps), and no other problems. The exercises have
no measure: limits; they are about the file, not the models.
"""

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    import math
    from mathutils import Matrix

    scene = starter.scene
    starter.remove_default_cube()

    wood = starter.material("Wood", (0.55, 0.34, 0.18))
    metal = starter.material("Metal", (0.42, 0.44, 0.47))

    props = bpy.data.collections.new("Props")
    scene.collection.children.link(props)

    def add(name, bm, location, materials):
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        for material in materials:
            mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        props.objects.link(obj)
        return obj

    def box(bm, size, centre):
        bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation(centre) @ Matrix.Diagonal((*size, 1.0)))

    # Crate: a 0.8 m box standing on the ground.
    bm = bmesh.new()
    box(bm, (0.8, 0.8, 0.8), (0, 0, 0.4))
    add("Crate", bm, (-1.5, 0, 0), [wood])

    # Barrel: three rings of twelve, the middle one wider, with n-gon caps.
    bm = bmesh.new()
    rings = []
    for z, r in ((0.0, 0.32), (0.45, 0.37), (0.9, 0.32)):
        rings.append([bm.verts.new((r * math.cos(i * math.tau / 12), r * math.sin(i * math.tau / 12), z)) for i in range(12)])
    for low, high in zip(rings, rings[1:]):
        for i in range(12):
            j = (i + 1) % 12
            bm.faces.new((low[i], low[j], high[j], high[i]))
    bottom = bm.faces.new(list(reversed(rings[0])))
    top = bm.faces.new(rings[2])
    bottom.material_index = 1
    top.material_index = 1
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    add("Barrel", bm, (0, 0, 0), [wood, metal])

    # Lamp: a post and a box-shaped head, one mesh.
    bm = bmesh.new()
    box(bm, (0.1, 0.1, 1.6), (0, 0, 0.8))
    box(bm, (0.3, 0.3, 0.3), (0, 0, 1.75))
    add("Lamp", bm, (1.5, 0, 0), [metal])

    for obj in bpy.data.objects:
        obj.select_set(False)
    low, high = starter.world_bounds(list(props.objects))
    starter.frame_viewports(low, high)
