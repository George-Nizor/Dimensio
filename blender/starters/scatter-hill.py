"""A low-poly hill to scatter on, and a rock and a tree to scatter.

For lesson 86, Instancing on points. "Hill" is a 12 by 12 m grid of 16 by 16
faces raised into a smooth mound 2 m high in the middle, flat shaded:
289 vertices, 256 quads, 512 triangles. It has no modifiers yet.

The "Props" collection holds the two objects to scatter, standing on the
ground 3 m past the hill's +X edge, each with its origin at its base:

- "Rock", a squashed, uneven icosphere about 1 m across and 0.6 m tall:
  12 vertices, 20 triangles.
- "Tree", a 6-sided trunk and a 6-sided cone of leaves, 2.4 m tall, in one
  mesh with two materials: 19 vertices, 30 triangles, 3 n-gons (the
  trunk's ends and the base of the cone).

The default cube is removed; the camera and the light stay. Measuring the
starting file gives 3 meshes, 562 triangles and 3 n-gons. A learner's own
rock and tree from lesson 79 can replace these: put them in the Props
collection.
"""

OPTIONS = {}


def build(starter):
    import math

    import bmesh
    import bpy
    from mathutils import Matrix, Vector

    scene = starter.scene
    starter.remove_default_cube()

    def link(name, bm, materials, location, collection):
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        for material in materials:
            mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        collection.objects.link(obj)
        return obj

    # The hill: a grid raised by a smooth bump, highest in the middle.
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=16, y_segments=16, size=6.0)
    for vert in bm.verts:
        r2 = vert.co.x ** 2 + vert.co.y ** 2
        edge = math.exp(-36.0 / 10.0)
        vert.co.z = max(2.0 * (math.exp(-r2 / 10.0) - edge) / (1.0 - edge), 0.0)
    link("Hill", bm, [starter.material("Grass", (0.36, 0.55, 0.26))], (0.0, 0.0, 0.0), scene.collection)

    props = bpy.data.collections.new("Props")
    scene.collection.children.link(props)

    # The rock: an icosphere, squashed and pushed out of round, standing on its lowest point.
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=1, radius=0.5)
    for index, vert in enumerate(bm.verts):
        bump = 1.0 + 0.18 * math.sin(index * 2.3)
        vert.co = Vector((vert.co.x * 0.9 * bump, vert.co.y * bump, vert.co.z * 0.6 * bump))
    low = min(v.co.z for v in bm.verts)
    for vert in bm.verts:
        vert.co.z -= low
    link("Rock", bm, [starter.material("Rock", (0.5, 0.5, 0.52))], (9.0, -1.5, 0.0), props)

    # The tree: a 6-sided trunk and a 6-sided cone, one mesh, two materials.
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=6, radius1=0.15, radius2=0.12, depth=0.8,
                          matrix=Matrix.Translation((0.0, 0.0, 0.4)))
    trunk_faces = set(bm.faces)
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=6, radius1=0.8, radius2=0.0, depth=1.8,
                          matrix=Matrix.Translation((0.0, 0.0, 1.5)))
    for face in bm.faces:
        face.material_index = 0 if face in trunk_faces else 1
    link("Tree", bm, [starter.material("Bark", (0.42, 0.28, 0.17)), starter.material("Leaves", (0.20, 0.45, 0.22))],
         (9.0, 1.5, 0.0), props)

    for obj in bpy.data.objects:
        obj.select_set(False)
    starter.frame_viewports((-6.0, -6.0, 0.0), (10.0, 6.0, 2.4))
