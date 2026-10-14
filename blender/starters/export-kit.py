"""Four building-kit pieces in a "Kit" collection, ready for an export script.

For lesson 127, Writing a script. The pieces stand in a row along X, each with
its origin at the middle of its base, so a script that moves each one to the
world origin before exporting it gives files centred on their own origin:

- "Floor", a 2 x 2 x 0.1 m slab at X -4.
- "Wall", a 2 x 0.2 x 2 m wall at X -1.5.
- "Doorway", the same wall with a 0.9 x 1.6 m opening, at X 1.
- "Pillar", a 0.4 x 0.4 x 2 m post at X 3.5, with a Bevel modifier (width
  0.04 m, 2 segments) that is not applied.

All four use the material "Stone". A 12 m "Ground" plane lies in the scene's
own collection, outside "Kit", so a script that reads the collection leaves it
out. The default cube is removed; the camera and the light stay.

Measuring gives 5 meshes: Floor and Wall 8 verts and 12 tris each, Doorway
16 verts and 28 tris with 2 n-gons (its front and back), Pillar 56 verts and
108 tris after its Bevel (8 and 12 before), and Ground 4 verts, 2 tris and 4
non-manifold edges (an open plane). Totals: verts 92, tris 162, ngons 2. The
exercise has no measure: limits; its result is the .glb files the script
writes.
"""

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    scene = starter.scene
    starter.remove_default_cube()
    stone = starter.material("Stone", (0.6, 0.58, 0.54))
    kit = bpy.data.collections.new("Kit")
    scene.collection.children.link(kit)

    def add(name, make, location, collection):
        bm = bmesh.new()
        make(bm)
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(stone)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        collection.objects.link(obj)
        return obj

    def box(size, centre):
        def make(bm):
            bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation(centre) @ Matrix.Diagonal((*size, 1.0)))
        return make

    def doorway(bm):
        # A 2 m wall with a 0.9 m wide, 1.6 m tall opening: two side faces of
        # the wall's outline joined round the hole, built from 16 corners.
        w, d, h = 1.0, 0.1, 2.0
        dw, dh = 0.45, 1.6
        outline = [(-w, 0), (-dw, 0), (-dw, dh), (dw, dh), (dw, 0), (w, 0), (w, h), (-w, h)]
        front = [bm.verts.new((x, -d, z)) for x, z in outline]
        back = [bm.verts.new((x, d, z)) for x, z in outline]
        n = len(outline)
        for i in range(n):
            j = (i + 1) % n
            bm.faces.new((front[i], front[j], back[j], back[i]))
        bm.faces.new(front)
        bm.faces.new(list(reversed(back)))
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])

    add("Floor", box((2, 2, 0.1), (0, 0, 0.05)), (-4, 0, 0), kit)
    add("Wall", box((2, 0.2, 2), (0, 0, 1)), (-1.5, 0, 0), kit)
    add("Doorway", doorway, (1, 0, 0), kit)
    pillar = add("Pillar", box((0.4, 0.4, 2), (0, 0, 1)), (3.5, 0, 0), kit)
    bevel = pillar.modifiers.new("Bevel", "BEVEL")
    bevel.width = 0.04
    bevel.segments = 2

    def ground(bm):
        bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=6.0)

    add("Ground", ground, (0, 0, 0), scene.collection)

    for obj in bpy.data.objects:
        obj.select_set(False)
    low, high = starter.world_bounds(list(kit.objects))
    starter.frame_viewports(low, high)
