"""The render stage's props on a round plinth that turns once, for a turntable.

For lesson 73, Render output. This builds the render-stage scene (the crate,
barrel and lantern on a curved backdrop, three area lights and a 50 mm
camera; see render-stage.py) and then:

- adds "Plinth", a disc 2.3 m across and 8 cm high, under the props, and
  lifts the props onto it;
- parents the plinth and the props to an empty, "Turntable", at the origin;
- keys the empty's Z rotation from 0 degrees at frame 1 to 360 degrees at
  frame 49, with linear interpolation, so it turns at an even speed.

Frames 1 to 48 make a loop that never shows the same angle twice. The scene's
frame range is left at the factory 1 to 250, because setting End to 48 is
part of the exercise. Render settings stay at their factory defaults.

Measuring gives 8 meshes and 648 triangles (the render stage's 460 and the
plinth's 188), with the same 96 open edges. The exercise makes renders, not a
model, so it has no measure: limits.
"""

import importlib.util
import math
import os

OPTIONS = {}


def _render_stage():
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "render-stage.py")
    spec = importlib.util.spec_from_file_location("dimensio_starter_render_stage_for_turntable", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _fcurves(obj):
    """The F-curves of an object's action, through its slot (Blender 4.4 and later)."""
    animation = obj.animation_data
    action = animation.action
    try:
        from bpy_extras import anim_utils

        bag = anim_utils.action_get_channelbag_for_slot(action, animation.action_slot)
        return list(bag.fcurves) if bag else []
    except (ImportError, AttributeError):
        return list(action.fcurves)


def build(starter):
    import bmesh
    import bpy

    _render_stage().build(starter)
    scene = starter.scene

    lift = 0.08
    props = [bpy.data.objects[name] for name in ("Crate", "Barrel", "Lantern")]
    for obj in props:
        obj.location.z += lift

    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=48, radius1=1.15, radius2=1.15, depth=lift)
    bmesh.ops.translate(bm, verts=bm.verts, vec=(0, 0, lift / 2))
    mesh = bpy.data.meshes.new("Plinth")
    bm.to_mesh(mesh)
    bm.free()
    mesh.materials.append(starter.material("Plinth", (0.08, 0.08, 0.09)))
    plinth = bpy.data.objects.new("Plinth", mesh)
    scene.collection.objects.link(plinth)

    turntable = bpy.data.objects.new("Turntable", None)
    turntable.empty_display_type = "CIRCLE"
    turntable.empty_display_size = 1.3
    scene.collection.objects.link(turntable)
    for obj in (plinth, *props):
        obj.parent = turntable

    turntable.rotation_euler = (0, 0, 0)
    turntable.keyframe_insert("rotation_euler", index=2, frame=1)
    turntable.rotation_euler = (0, 0, 2 * math.pi)
    turntable.keyframe_insert("rotation_euler", index=2, frame=49)
    for fcurve in _fcurves(turntable):
        for point in fcurve.keyframe_points:
            point.interpolation = "LINEAR"
    scene.frame_set(1)

    for obj in bpy.data.objects:
        obj.select_set(False)
