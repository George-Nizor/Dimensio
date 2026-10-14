"""A yard of 30 props of five kinds, for practising selection.

For lesson 5, Selecting objects. The props stand on a 16 by 12 m floor that
cannot be selected:

- "Barrel 1" to "Barrel 6": brown cylinders spread across the yard, mixed in
  with everything else, so no single box catches only barrels.
- "Crate 1" to "Crate 8": tan 0.8 m cubes in a block of four by two at the
  front left. Crate 4 sits between two other crates in the front row, so no
  single box selects the other seven without it: leaving it out takes a
  Shift-click or a Ctrl-drag.
- "Post 1" to "Post 7": grey posts in a row along the back.
- "Sack 1" to "Sack 5" and "Pot 1" to "Pot 4": scattered.

Each kind shares one mesh and one material. Nothing is selected when the
file opens. With the camera and the light the scene holds 33 objects, which
is the total the Statistics overlay shows; Select All (A) selects 32 of
them, because the floor cannot be selected.

Measuring gives 33 objects, 31 meshes, 1,190 triangles and 20 n-gons (the
barrels' and pots' caps, two each). The exercise has no measure: limits.
"""

OPTIONS = {}

# (kind, x, y) for every prop, in the order they are named.
LAYOUT = {
    "Barrel": [(-5.5, 3.5), (-1.0, 0.5), (2.5, 3.8), (5.8, 0.2), (0.8, -3.2), (6.2, -3.8)],
    "Crate": [(-6.0, -2.0), (-5.0, -2.0), (-4.0, -2.0), (-5.0, -3.0), (-3.0, -2.0), (-6.0, -3.0), (-4.0, -3.0), (-3.0, -3.0)],
    "Post": [(-6.0, 5.2), (-4.0, 5.2), (-2.0, 5.2), (0.0, 5.2), (2.0, 5.2), (4.0, 5.2), (6.0, 5.2)],
    "Sack": [(-2.6, 2.4), (1.2, 2.2), (4.2, 1.6), (-1.8, -1.6), (3.4, -1.4)],
    "Pot": [(-3.6, 0.6), (0.2, 3.6), (4.8, 3.4), (2.2, -4.2)],
}

COLOURS = {
    "Barrel": (0.45, 0.25, 0.12),
    "Crate": (0.80, 0.62, 0.38),
    "Post": (0.45, 0.45, 0.47),
    "Sack": (0.86, 0.80, 0.62),
    "Pot": (0.72, 0.33, 0.20),
}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    scene = starter.scene
    starter.remove_default_cube()

    def make_mesh(name, fill):
        bm = bmesh.new()
        fill(bm)
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        return mesh

    def barrel(bm):
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=12,
                              radius1=0.35, radius2=0.35, depth=0.9,
                              matrix=Matrix.Translation((0, 0, 0.45)))

    def crate(bm):
        bmesh.ops.create_cube(bm, size=0.8, matrix=Matrix.Translation((0, 0, 0.4)))

    def post(bm):
        bmesh.ops.create_cube(bm, size=1.0,
                              matrix=Matrix.Translation((0, 0, 0.8)) @ Matrix.Diagonal((0.15, 0.15, 1.6, 1.0)))

    def sack(bm):
        bmesh.ops.create_uvsphere(bm, u_segments=12, v_segments=6, radius=0.35,
                                  matrix=Matrix.Translation((0, 0, 0.245)) @ Matrix.Diagonal((1.0, 1.0, 0.7, 1.0)))

    def pot(bm):
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=10,
                              radius1=0.22, radius2=0.28, depth=0.45,
                              matrix=Matrix.Translation((0, 0, 0.225)))

    fills = {"Barrel": barrel, "Crate": crate, "Post": post, "Sack": sack, "Pot": pot}

    floor_mesh = make_mesh("Yard", lambda bm: bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=1.0,
                                                                     matrix=Matrix.Diagonal((8.0, 6.0, 1.0, 1.0))))
    floor_mesh.materials.append(starter.material("Ground", (0.55, 0.58, 0.50)))
    floor = bpy.data.objects.new("Yard", floor_mesh)
    scene.collection.objects.link(floor)
    floor.hide_select = True

    props = []
    for kind, spots in LAYOUT.items():
        mesh = make_mesh(kind, fills[kind])
        mesh.materials.append(starter.material(kind, COLOURS[kind]))
        for number, (x, y) in enumerate(spots, start=1):
            obj = bpy.data.objects.new(f"{kind} {number}", mesh)
            obj.location = (x, y, 0.0)
            scene.collection.objects.link(obj)
            props.append(obj)

    for obj in scene.objects:
        obj.select_set(False)
    bpy.context.view_layer.objects.active = None
    low, high = starter.world_bounds([floor, *props])
    starter.frame_viewports(low, high)
