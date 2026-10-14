"""A cart that rolls 8 m along X, with four wheels that do not turn yet.

For lesson 92, Drivers. "Cart" is a 2 x 1.2 x 0.5 m box whose underside is
0.5 m above the floor. It is keyed to move from X 0 at frame 1 to X 8 at
frame 96 (Bezier, so it speeds up and slows down), and the scene runs from
frame 1 to 96. Four wheels, "Wheel front left", "Wheel front right",
"Wheel back left" and "Wheel back right", are children of the cart. Each is
a 12-sided disc 0.4 m in radius and 0.15 m wide, standing on the floor with
its axle along Y, plus a light bar across its outer face so a turn is easy
to see. No wheel has any animation: the exercise adds a driver to each
wheel's Y rotation, cart X location / 0.4, which turns it one radian for
every 0.4 m the cart travels.

The floor is a 14 x 4 m plane that cannot be selected. The default cube is
removed; the camera and the light stay. The file opens in the front view,
which looks at the side of the cart. Measuring gives 6 meshes (the floor,
the cart and four wheels): verts 140, faces 87, tris 238, ngons 8 (the
wheels' 12-sided faces), nonManifoldEdges 4 (the floor's open border). The
exercise has no measure: limits, because the lesson is about drivers.
"""

import math

OPTIONS = {}

RADIUS = 0.4


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    scene = starter.scene
    starter.remove_default_cube()
    scene.frame_start = 1
    scene.frame_end = 96
    scene.frame_set(1)

    floor_mat = starter.material("Floor", (0.62, 0.62, 0.60))
    body_mat = starter.material("Cart", (0.72, 0.45, 0.25))
    tyre_mat = starter.material("Tyre", (0.12, 0.12, 0.13))
    bar_mat = starter.material("Wheel bar", (0.85, 0.80, 0.55))

    def mesh_object(name, bm, materials, location, parent=None):
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        for material in materials:
            mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        scene.collection.objects.link(obj)
        if parent is not None:
            obj.parent = parent
        return obj

    floor_bm = bmesh.new()
    bmesh.ops.create_grid(floor_bm, x_segments=1, y_segments=1, size=1.0,
                          matrix=Matrix.Diagonal((7.0, 2.0, 1.0, 1.0)))
    floor = mesh_object("Floor", floor_bm, [floor_mat], (4.0, 0.0, 0.0))
    floor.hide_select = True

    body_bm = bmesh.new()
    bmesh.ops.create_cube(body_bm, size=1.0, matrix=Matrix.Diagonal((2.0, 1.2, 0.5, 1.0)))
    cart = mesh_object("Cart", body_bm, [body_mat], (0.0, 0.0, 0.75))

    def wheel_mesh():
        bm = bmesh.new()
        # A disc with its axle along Y: a cylinder made along Z, turned 90 degrees about X.
        turn = Matrix.Rotation(math.radians(90), 4, "X")
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=12,
                              radius1=RADIUS, radius2=RADIUS, depth=0.15, matrix=turn)
        tyre_faces = list(bm.faces)
        # A bar across the outer face (towards +Y in the wheel's own space), a little proud of it.
        bar = bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation((0.0, 0.09, 0.0))
                                    @ Matrix.Diagonal((0.62, 0.03, 0.1, 1.0)))
        bar_verts = set(bar["verts"])
        for face in bm.faces:
            face.material_index = 1 if all(v in bar_verts for v in face.verts) else 0
        for face in tyre_faces:
            face.material_index = 0
        return bm

    names = {
        "Wheel front left": (0.7, 0.68),
        "Wheel front right": (0.7, -0.68),
        "Wheel back left": (-0.7, 0.68),
        "Wheel back right": (-0.7, -0.68),
    }
    for name, (x, y) in names.items():
        bm = wheel_mesh()
        if y < 0:
            # Mirror the right-hand wheels so their bar faces outwards too.
            bmesh.ops.scale(bm, vec=(1.0, -1.0, 1.0), verts=bm.verts)
            bmesh.ops.reverse_faces(bm, faces=bm.faces)
        # The wheel's centre is 0.4 m up; the cart's centre is 0.75 m up.
        mesh_object(name, bm, [tyre_mat, bar_mat], (x, y, RADIUS - 0.75), parent=cart)

    cart.location = (0.0, 0.0, 0.75)
    cart.keyframe_insert("location", index=0, frame=1)
    cart.location.x = 8.0
    cart.keyframe_insert("location", index=0, frame=96)
    cart.location.x = 0.0
    action = cart.animation_data.action
    action.name = "Cart roll"

    for obj in bpy.data.objects:
        obj.select_set(False)
    scene.frame_set(1)
    starter.frame_viewports((-1.5, -1.0, 0.0), (9.5, 1.0, 1.0), view="front")
