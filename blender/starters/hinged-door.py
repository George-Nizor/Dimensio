"""A door in a frame, with its origin on the hinge, ready to animate.

For lessons 94 and 95, Actions and The NLA editor.

Options:
  --actions true  also give the door two actions, open and close

"Door" is a 1 x 0.08 x 2 m slab standing in "Door frame" (two posts and a
lintel, 1.2 m wide inside and 2.1 m tall). The door's origin sits on its
left edge at floor level, X -0.5, so rotating it about Z swings it on its
hinge like a real door. Rotating it to -100 degrees opens it towards the
front (-Y). The default cube is removed; the camera and the light stay.

Without --actions the door has no animation, for lesson 94.

With --actions, for lesson 95, the door has two actions. "open" turns its Z
rotation from 0 at frame 1 to -100 degrees at frame 24 and is the active
action. "close" turns it from -100 degrees at frame 1 back to 0 at frame 24
and is stashed: it sits on a muted, locked NLA track called [Action Stash],
as Blender leaves it when you click New Action. Both actions use one slot,
named after the door. The scene runs from frame 1 to 100.

Measuring gives 2 meshes (the door and the frame): verts 32, faces 24,
tris 48, ngons 0, nonManifoldEdges 0. The exercises have no measure: limits,
because the lessons are about animation.
"""

import math

OPTIONS = {
    "actions": "Give the door two actions, open (active) and close (stashed).",
}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    scene = starter.scene
    starter.remove_default_cube()
    scene.frame_start = 1
    scene.frame_end = 100

    wood = starter.material("Door", (0.62, 0.40, 0.22))
    frame_mat = starter.material("Frame", (0.85, 0.83, 0.78))

    def box(bm, low, high):
        size = [h - l for l, h in zip(low, high)]
        centre = [(l + h) / 2 for l, h in zip(low, high)]
        bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation(centre) @ Matrix.Diagonal((*size, 1.0)))

    def mesh_object(name, bm, material, location):
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        scene.collection.objects.link(obj)
        return obj

    frame_bm = bmesh.new()
    box(frame_bm, (-0.7, -0.06, 0.0), (-0.6, 0.06, 2.1))
    box(frame_bm, (0.6, -0.06, 0.0), (0.7, 0.06, 2.1))
    box(frame_bm, (-0.7, -0.06, 2.1), (0.7, 0.06, 2.2))
    frame = mesh_object("Door frame", frame_bm, frame_mat, (0.0, 0.0, 0.0))
    frame.hide_select = True

    door_bm = bmesh.new()
    # The mesh runs from the hinge at X 0 to X 1 m, so the origin is on the hinge.
    box(door_bm, (0.0, -0.04, 0.0), (1.0, 0.04, 2.0))
    door = mesh_object("Door", door_bm, wood, (-0.5, 0.0, 0.0))

    if str(starter.option("actions", "")).lower() in {"true", "1", "yes"}:
        def make_action(name, start_deg, end_deg):
            door.rotation_euler.z = math.radians(start_deg)
            door.keyframe_insert("rotation_euler", index=2, frame=1)
            door.rotation_euler.z = math.radians(end_deg)
            door.keyframe_insert("rotation_euler", index=2, frame=24)
            action = door.animation_data.action
            action.name = name
            return action

        close = make_action("close", -100.0, 0.0)
        slot = door.animation_data.action_slot
        # Stash close the way New Action does: a muted, locked track at the bottom.
        track = door.animation_data.nla_tracks.new()
        track.name = "[Action Stash]"
        strip = track.strips.new("close", 1, close)
        if getattr(strip, "action_slot", None) is None and slot is not None:
            strip.action_slot = slot
        track.mute = True
        track.lock = True
        door.animation_data.action = None

        door.animation_data.action = bpy.data.actions.new("open")
        make_action("open", 0.0, -100.0)
        door.rotation_euler.z = 0.0

    for obj in bpy.data.objects:
        obj.select_set(False)
    door.select_set(True)
    bpy.context.view_layer.objects.active = door
    scene.frame_set(1)
    starter.frame_viewports((-1.5, -1.5, 0.0), (1.5, 1.0, 2.2))
