"""A ball dropped from 3 m that bounces three times, every bounce 24 frames.

For lesson 89, The Dope Sheet. "Ball" is a UV sphere 0.5 m across. Its
Z Location has 8 keys, 12 frames apart: 3 m at frame 1, then the ground
(0.25 m) at frames 13, 37, 61 and 85, with tops of 2.2, 1.5 and 0.9 m at
frames 25, 49 and 73. The ground keys have Vector handles, so the ball hits
the floor sharply. The ball bounces in place: nothing else is keyed. Every
bounce lasts 24 frames however high it goes, which is the timing the
exercise fixes. The scene's frame range is 1 to 85.

The floor is in a "Floor" reference collection, which measuring skips. The
default cube is removed; the camera and the light stay. Measuring the
starting file gives 1 mesh, "Ball", 960 triangles. The exercise has no
measure: limits.
"""

OPTIONS = {}

TOPS = [3.0, 2.2, 1.5, 0.9]
RADIUS = 0.25


def build(starter):
    import bmesh
    import bpy
    from bpy_extras import anim_utils

    scene = starter.scene
    starter.remove_default_cube()

    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=32, v_segments=16, radius=RADIUS)
    mesh = bpy.data.meshes.new("Ball")
    bm.to_mesh(mesh)
    bm.free()
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    mesh.materials.append(starter.material("Ball", (0.85, 0.30, 0.20)))
    ball = bpy.data.objects.new("Ball", mesh)
    scene.collection.objects.link(ball)

    # Z: a top, then the ground, every 12 frames.
    frame = 1
    keys = []
    for top in TOPS:
        keys.append((frame, top))
        keys.append((frame + 12, RADIUS))
        frame += 24
    for when, z in keys:
        ball.location.z = z
        ball.keyframe_insert("location", index=2, frame=when)
    last = keys[-1][0]

    bag = anim_utils.action_get_channelbag_for_slot(ball.animation_data.action, ball.animation_data.action_slot)
    for fcurve in bag.fcurves:
        for key in fcurve.keyframe_points:
            if abs(key.co[1] - RADIUS) < 1e-6:
                key.handle_left_type = "VECTOR"
                key.handle_right_type = "VECTOR"
        fcurve.update()

    scene.frame_start = 1
    scene.frame_end = last
    scene.frame_set(1)

    floor_collection = starter.reference_collection("Floor")
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=2.0)
    floor_mesh = bpy.data.meshes.new("Floor")
    bm.to_mesh(floor_mesh)
    bm.free()
    floor_mesh.materials.append(starter.material("Floor", (0.62, 0.62, 0.60)))
    floor = bpy.data.objects.new("Floor", floor_mesh)
    floor_collection.objects.link(floor)

    for obj in bpy.data.objects:
        obj.select_set(False)
    ball.select_set(True)
    bpy.context.view_layer.objects.active = ball
    starter.frame_viewports((-1.5, -1.0, 0.0), (1.5, 1.0, 3.3), view="front")
