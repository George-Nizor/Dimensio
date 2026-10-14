"""Three props that break five game-ready rules between them.

For lesson 61, Game-ready models. The props stand in a row on the ground,
2.5 m apart, each with a name Blender gave it rather than one that says what
it is:

- "Cube.001", a 1 m crate at X -2.5: Blender's 2 m cube scaled to 0.5 in
  Object Mode, so its scale reads 0.5 (scale not applied).
- "Cylinder", a 0.9 m barrel at X 0: a 12-sided barrel, wider in the
  middle, with fan caps. Every face points inwards (inside out), and its
  origin is at its middle, 0.45 m up, instead of at its base.
- "Cube.002", a chair at X 2.5: a seat, four legs and a back, turned 180
  degrees in Object Mode so its front looks along +Y (rotation not applied),
  with a Subdivision Surface modifier at level 2 that takes it far over a
  300-triangle budget.

Each prop has one material. The default cube is removed; the camera and the
light stay.

Measuring the starting file gives 3 meshes. Crate: tris 12, scaleApplied
false. Barrel: tris 120, flippedFaces 72 (every face). Chair: tris 1152
after the modifier (72 before), rotationApplied false, modifiers
["SUBSURF"]. Totals: tris 1284, flippedFaces 72, ngons 0, doubles 0. With
every fault fixed and the modifier removed, tris is 204, scaleApplied and
rotationApplied are true and flippedFaces is 0. The exercise measures tris
(max 300), scaleApplied, rotationApplied and flippedFaces (max 0).
"""

import math

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    scene = starter.scene
    starter.remove_default_cube()

    def mesh_object(name, bm, material, location):
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        scene.collection.objects.link(obj)
        return obj

    def add_box(bm, size, centre):
        bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation(centre) @ Matrix.Diagonal((size[0], size[1], size[2], 1.0)))

    # The crate: a 2 m cube scaled down in Object Mode.
    bm = bmesh.new()
    add_box(bm, (2.0, 2.0, 2.0), (0.0, 0.0, 0.0))
    crate = mesh_object("Cube.001", bm, starter.material("Crate wood", (0.45, 0.25, 0.10)), (-2.5, 0.0, 0.5))
    crate.scale = (0.5, 0.5, 0.5)

    # The barrel: built around its middle, then turned inside out.
    bm = bmesh.new()
    segments = 12
    profile = [(0.26, -0.45), (0.30, -0.2), (0.32, 0.0), (0.30, 0.2), (0.26, 0.45)]
    rings = []
    for radius, z in profile:
        rings.append([bm.verts.new((radius * math.cos(2 * math.pi * i / segments),
                                    radius * math.sin(2 * math.pi * i / segments), z)) for i in range(segments)])
    for a, b in zip(rings, rings[1:]):
        for i in range(segments):
            j = (i + 1) % segments
            bm.faces.new((a[i], a[j], b[j], b[i]))
    for ring, z in ((rings[0], -0.45), (rings[-1], 0.45)):
        centre = bm.verts.new((0.0, 0.0, z))
        for i in range(segments):
            bm.faces.new((ring[i], ring[(i + 1) % segments], centre))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bmesh.ops.reverse_faces(bm, faces=bm.faces)
    mesh_object("Cylinder", bm, starter.material("Barrel wood", (0.30, 0.15, 0.06)), (0.0, 0.0, 0.45))

    # The chair: built facing -Y (the back of the chair on the +Y side), then turned around.
    bm = bmesh.new()
    add_box(bm, (0.45, 0.45, 0.05), (0.0, 0.0, 0.425))
    for sx in (-1, 1):
        for sy in (-1, 1):
            add_box(bm, (0.05, 0.05, 0.4), (sx * 0.19, sy * 0.19, 0.2))
    add_box(bm, (0.43, 0.05, 0.45), (0.0, 0.2, 0.675))
    chair = mesh_object("Cube.002", bm, starter.material("Chair wood", (0.55, 0.35, 0.18)), (2.5, 0.0, 0.0))
    chair.rotation_euler = (0.0, 0.0, math.radians(180))
    subsurf = chair.modifiers.new("Subdivision", "SUBSURF")
    subsurf.levels = 2
    subsurf.render_levels = 2

    for obj in bpy.data.objects:
        obj.select_set(False)
    low, high = starter.world_bounds([crate, chair, bpy.data.objects["Cylinder"]])
    starter.frame_viewports(low, high)
