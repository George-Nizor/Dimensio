"""A hand cart that tips back, with six crates stacked on its bed.

For lesson 114, Falling crates. "Cart" is one mesh: a 1.2 x 1.8 m bed with low
rails on the left, right and front sides and an open back (+Y), two wheels, two
front legs and two handles. Its origin is on the axle, 0.35 m up, and it is
keyed: level until frame 20, then turned 35 degrees about X by frame 45 so the
back of the bed drops and the crates slide off it. The keys are in the action
"CartTip". "Ground" is a 12 m plane at Z 0.

"Crate.001" to "Crate.006" are 0.4 m cubes sharing one mesh, "Crate": four
on the bed and two on top of them, each a few millimetres clear of what is
below. No object has rigid body physics yet; the learner adds it. The scene
runs from frame 1 to 120.

The default cube is removed; the camera and the light stay. Measuring gives 8
meshes: Cart (verts 124, faces 126, tris 204, ngons 0), Ground (verts 4,
faces 1) and six crates (verts 8, faces 6, dimensions 0.4 x 0.4 x 0.4 m each).
The exercise has no measure: limits; the result is an animation.
"""

import math

OPTIONS = {}

AXLE_Z = 0.35
WHEEL_R = 0.35
BED = (1.2, 1.8, 0.06)
BED_TOP = 0.78
CRATE = 0.4
TIP_DEGREES = -35.0


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    scene = starter.scene
    starter.remove_default_cube()
    scene.frame_start = 1
    scene.frame_end = 120

    def box(bm, size, centre):
        bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation(centre) @ Matrix.Diagonal((*size, 1.0)))

    def wheel(bm, x):
        rotate = Matrix.Rotation(math.radians(90), 4, "Y")
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=True, segments=12, radius1=WHEEL_R, radius2=WHEEL_R,
                              depth=0.08, matrix=Matrix.Translation((x, 0.0, 0.0)) @ rotate)

    # The cart is built around its axle, which is the object's origin.
    bm = bmesh.new()
    top = BED_TOP - AXLE_Z
    hx, hy, t = BED[0] / 2, BED[1] / 2, BED[2]
    box(bm, BED, (0.0, 0.0, top - t / 2))
    rail = 0.18
    box(bm, (0.05, BED[1] - 0.01, rail), (hx - 0.03, 0.0, top + rail / 2))
    box(bm, (0.05, BED[1] - 0.01, rail), (-hx + 0.03, 0.0, top + rail / 2))
    box(bm, (BED[0] - 0.12, 0.05, rail), (0.0, -hy + 0.03, top + rail / 2))
    for side in (-1, 1):
        wheel(bm, side * (hx + 0.08))
        leg = top - t + AXLE_Z
        box(bm, (0.05, 0.05, leg), (side * (hx - 0.1), -hy + 0.1, top - t - leg / 2))
        box(bm, (0.05, 0.8, 0.05), (side * (hx - 0.1), -hy - 0.4, top - t / 2))
    box(bm, (BED[0] + 0.1, 0.05, 0.05), (0.0, 0.0, 0.0))
    cart_mesh = bpy.data.meshes.new("Cart")
    bm.to_mesh(cart_mesh)
    bm.free()
    cart_mesh.materials.append(starter.material("Cart wood", (0.45, 0.3, 0.18)))
    cart = bpy.data.objects.new("Cart", cart_mesh)
    cart.location = (0.0, 0.0, AXLE_Z)
    scene.collection.objects.link(cart)

    # Level until frame 20, tipped back by frame 45.
    cart.animation_data_create().action = bpy.data.actions.new("CartTip")
    for frame, degrees in ((1, 0.0), (20, 0.0), (45, TIP_DEGREES)):
        cart.rotation_euler = (math.radians(degrees), 0.0, 0.0)
        cart.keyframe_insert("rotation_euler", index=0, frame=frame)
    cart.rotation_euler = (0.0, 0.0, 0.0)

    ground_mesh = bpy.data.meshes.new("Ground")
    bm = bmesh.new()
    verts = [bm.verts.new((x, y, 0.0)) for x, y in ((-6, -6), (6, -6), (6, 6), (-6, 6))]
    bm.faces.new(verts)
    bm.to_mesh(ground_mesh)
    bm.free()
    ground_mesh.materials.append(starter.material("Ground", (0.5, 0.55, 0.45)))
    scene.collection.objects.link(bpy.data.objects.new("Ground", ground_mesh))

    crate_mesh = bpy.data.meshes.new("Crate")
    bm = bmesh.new()
    box(bm, (CRATE, CRATE, CRATE), (0.0, 0.0, 0.0))
    bm.to_mesh(crate_mesh)
    bm.free()
    crate_mesh.materials.append(starter.material("Crate", (0.72, 0.48, 0.25)))
    gap = 0.005
    low = BED_TOP + CRATE / 2 + gap
    spots = [(-0.22, 0.0, low), (0.22, 0.0, low), (-0.22, 0.45, low), (0.22, 0.45, low),
             (-0.22, 0.22, low + CRATE + gap), (0.22, 0.22, low + CRATE + gap)]
    for index, spot in enumerate(spots, start=1):
        crate = bpy.data.objects.new(f"Crate.{index:03d}", crate_mesh)
        crate.location = spot
        scene.collection.objects.link(crate)

    scene.frame_set(1)
    for obj in scene.objects:
        obj.select_set(False)
    bpy.context.view_layer.objects.active = cart
    low_corner, high_corner = starter.world_bounds([cart] + [o for o in scene.objects if o.name.startswith("Crate")])
    starter.frame_viewports(low_corner, high_corner)
