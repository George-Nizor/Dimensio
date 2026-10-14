"""A 1.7 m low-poly body in an A pose, ready for a Rigify meta-rig.

For lesson 103, Rigify. "Body" is one closed mesh made by a Skin modifier from a
stick figure and then applied, so it has no modifiers: a pelvis, a three-part
torso, a neck and head, arms held 30 degrees below level and straight legs with
feet pointing forward (-Y). It stands on the ground at the origin with its scale
and rotation applied, 1.70 m tall, so Rigify's Basic Human meta-rig (1.98 m)
has to be scaled to about 0.86 and its joints moved to fit. The elbows and knees
have edge loops a rig can bend.

The default cube is removed; the camera and the light stay. Measuring gives one
mesh, "Body": verts 216, faces 214, tris 420, quads 206, ngons 0,
nonManifoldEdges 0, doubles 0, dimensions 1.44 x 0.27 x 1.70 m, scaleApplied
true, no modifiers. Once the learner binds it to the generated rig it has an
ARMATURE modifier, which the exercise measures.
"""

import math

OPTIONS = {}

# The stick figure: joint name -> (position in metres, skin radius x, radius y).
# Arms leave the shoulders 30 degrees below level, as Rigify's meta-rig holds them.
ARM_DROP = math.radians(30)


def _arm(side):
    shoulder = (0.17 * side, 0.0, 1.40)
    reach = (math.cos(ARM_DROP) * side, 0.0, -math.sin(ARM_DROP))
    at = lambda distance: tuple(shoulder[i] + reach[i] * distance for i in range(3))
    return {
        f"shoulder{side}": (shoulder, 0.065, 0.06),
        f"upper{side}": (at(0.14), 0.055, 0.055),
        f"elbow{side}": (at(0.28), 0.048, 0.048),
        f"fore{side}": (at(0.40), 0.044, 0.044),
        f"wrist{side}": (at(0.52), 0.038, 0.036),
        f"hand{side}": (at(0.62), 0.045, 0.022),
    }


def _leg(side):
    x = 0.11 * side
    return {
        f"hip{side}": ((x, 0.0, 0.90), 0.075, 0.08),
        f"thigh{side}": ((x, 0.0, 0.70), 0.068, 0.07),
        f"knee{side}": ((x, 0.0, 0.48), 0.055, 0.058),
        f"shin{side}": ((x, 0.0, 0.28), 0.05, 0.055),
        f"ankle{side}": ((x, 0.0, 0.085), 0.042, 0.045),
        f"toe{side}": ((x, -0.15, 0.045), 0.05, 0.04),
    }


JOINTS = {
    "pelvis": ((0.0, 0.0, 0.95), 0.16, 0.10),
    "waist": ((0.0, 0.0, 1.10), 0.13, 0.09),
    "chest": ((0.0, 0.0, 1.30), 0.16, 0.10),
    "neck": ((0.0, 0.0, 1.47), 0.05, 0.05),
    "head": ((0.0, 0.0, 1.56), 0.095, 0.105),
    "crown": ((0.0, 0.0, 1.697), 0.09, 0.10),
}
for _side in (1, -1):
    JOINTS.update(_arm(_side))
    JOINTS.update(_leg(_side))

BONES = [
    ("pelvis", "waist"), ("waist", "chest"), ("chest", "neck"), ("neck", "head"), ("head", "crown"),
]
for _side in (1, -1):
    BONES += [
        ("chest", f"shoulder{_side}"), (f"shoulder{_side}", f"upper{_side}"), (f"upper{_side}", f"elbow{_side}"),
        (f"elbow{_side}", f"fore{_side}"), (f"fore{_side}", f"wrist{_side}"), (f"wrist{_side}", f"hand{_side}"),
        ("pelvis", f"hip{_side}"), (f"hip{_side}", f"thigh{_side}"), (f"thigh{_side}", f"knee{_side}"),
        (f"knee{_side}", f"shin{_side}"), (f"shin{_side}", f"ankle{_side}"), (f"ankle{_side}", f"toe{_side}"),
    ]


def build(starter):
    import bmesh
    import bpy

    scene = starter.scene
    starter.remove_default_cube()

    names = list(JOINTS)
    stick = bpy.data.meshes.new("BodyStick")
    stick.from_pydata([JOINTS[name][0] for name in names], [(names.index(a), names.index(b)) for a, b in BONES], [])
    stick_obj = bpy.data.objects.new("BodyStick", stick)
    scene.collection.objects.link(stick_obj)
    skin = stick_obj.modifiers.new("Skin", "SKIN")
    skin.branch_smoothing = 0.5
    layer = stick.skin_vertices[0].data
    for index, name in enumerate(names):
        layer[index].radius = (JOINTS[name][1], JOINTS[name][2])
        layer[index].use_root = name == "pelvis"

    # Apply the Skin modifier by copying the evaluated mesh, so no operator
    # context is needed and the result is the same every time.
    depsgraph = bpy.context.evaluated_depsgraph_get()
    body_mesh = bpy.data.meshes.new_from_object(stick_obj.evaluated_get(depsgraph))
    body_mesh.name = "Body"
    bpy.data.objects.remove(stick_obj)
    bpy.data.meshes.remove(stick)

    bm = bmesh.new()
    bm.from_mesh(body_mesh)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    # Stand it on the ground: the lowest point goes to Z 0.
    low = min(v.co.z for v in bm.verts)
    for v in bm.verts:
        v.co.z -= low
    bm.to_mesh(body_mesh)
    bm.free()
    for polygon in body_mesh.polygons:
        polygon.use_smooth = False

    body_mesh.materials.append(starter.material("Body", (0.78, 0.55, 0.38)))
    body = bpy.data.objects.new("Body", body_mesh)
    scene.collection.objects.link(body)
    for obj in scene.objects:
        obj.select_set(obj is body)
    bpy.context.view_layer.objects.active = body

    low, high = starter.world_bounds([body])
    starter.frame_viewports(low, high, view="front")
