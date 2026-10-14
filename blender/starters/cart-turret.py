"""A cart that drives past, a target that moves, and a camera and a turret to aim.

For lesson 91, Constraints. Nothing has a constraint yet:

- "Cart", a box body on four wheels, one mesh with its origin at its base.
  Its X Location goes from -6 m at frame 1 to 6 m at frame 120, Linear.
- "Camera", the scene camera, 9 m in front of the middle of the cart's path
  and 3 m up, looking along +Y and a little down. At frames 1 and 120 the
  cart is 33 degrees off its line of sight, outside its view.
- "Turret base", a 12-sided drum 0.5 m tall at (3, 5, 0), and "Turret
  head", a box with a barrel along its local +Y, parented to the base.
  The head's origin is its pivot, 0.5 m up.
- "Target", an ico sphere 0.4 m across. It moves on four keys from
  (-4, 1, 1) at frame 1 through (0, -2, 3) at frame 60 and (4, 1, 1) at
  frame 120 to (0, 2, 0.5) at frame 160.

The scene's frame range is 1 to 160. The ground is in a "Ground" reference
collection, which measuring skips. The default cube is removed; the light
stays. Measuring the starting file gives 4 meshes, 288 triangles and
12 n-gons (the ends of the wheels, drum and barrel). The exercise has no
measure: limits.
"""

OPTIONS = {}


def build(starter):
    import math

    import bmesh
    import bpy
    from mathutils import Matrix

    scene = starter.scene
    starter.remove_default_cube()

    def link(name, bm, materials, location, collection=None):
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        for material in materials:
            mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        (collection or scene.collection).objects.link(obj)
        return obj

    def box(bm, size, centre):
        bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation(centre) @ Matrix.Diagonal((*size, 1.0)))

    def drum(bm, radius, depth, centre, segments=12, axis="Z"):
        turn = Matrix.Rotation(math.radians(90), 4, "Y") if axis == "X" else (
            Matrix.Rotation(math.radians(90), 4, "X") if axis == "Y" else Matrix.Identity(4))
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segments, radius1=radius, radius2=radius,
                              depth=depth, matrix=Matrix.Translation(centre) @ turn)

    wood = starter.material("Cart", (0.62, 0.40, 0.22))
    metal = starter.material("Metal", (0.35, 0.37, 0.40))
    red = starter.material("Target", (0.85, 0.20, 0.18))

    # The cart: a body on four wheels, origin at its base.
    bm = bmesh.new()
    box(bm, (1.2, 0.8, 0.4), (0.0, 0.0, 0.45))
    for x in (-0.4, 0.4):
        for y in (-0.45, 0.45):
            drum(bm, 0.2, 0.08, (x, y, 0.2), segments=8, axis="Y")
    cart = link("Cart", bm, [wood], (-6.0, 0.0, 0.0))
    for frame, x in ((1, -6.0), (120, 6.0)):
        cart.location.x = x
        cart.keyframe_insert("location", index=0, frame=frame)

    # The turret: a drum, and a head with a barrel along local +Y.
    bm = bmesh.new()
    drum(bm, 0.45, 0.5, (0.0, 0.0, 0.25))
    base = link("Turret base", bm, [metal], (3.0, 5.0, 0.0))
    bm = bmesh.new()
    box(bm, (0.5, 0.5, 0.3), (0.0, 0.0, 0.15))
    drum(bm, 0.07, 0.8, (0.0, 0.55, 0.15), segments=8, axis="Y")
    head = link("Turret head", bm, [metal], (0.0, 0.0, 0.5))
    head.parent = base

    # The target: an ico sphere on a slow loop in front of the turret.
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=2, radius=0.2)
    target = link("Target", bm, [red], (-4.0, 1.0, 1.0))
    for frame, location in ((1, (-4.0, 1.0, 1.0)), (60, (0.0, -2.0, 3.0)), (120, (4.0, 1.0, 1.0)), (160, (0.0, 2.0, 0.5))):
        target.location = location
        target.keyframe_insert("location", frame=frame)

    from bpy_extras import anim_utils
    bag = anim_utils.action_get_channelbag_for_slot(cart.animation_data.action, cart.animation_data.action_slot)
    for fcurve in bag.fcurves:
        for key in fcurve.keyframe_points:
            key.interpolation = "LINEAR"

    camera = bpy.data.objects.get("Camera")
    if camera is not None:
        camera.location = (0.0, -9.0, 3.0)
        camera.rotation_euler = (math.radians(80), 0.0, 0.0)

    ground = starter.reference_collection("Ground")
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=8.0)
    link("Ground", bm, [starter.material("Ground", (0.62, 0.62, 0.60))], (0.0, 0.0, 0.0), ground)

    scene.frame_start = 1
    scene.frame_end = 160
    scene.frame_set(1)
    for obj in bpy.data.objects:
        obj.select_set(False)
    starter.frame_viewports((-7.0, -9.0, 0.0), (7.0, 6.0, 3.0))
