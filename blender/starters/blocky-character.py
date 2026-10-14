"""A low-poly character 1.8 m tall in a T pose, with or without a rig.

For lessons 98 to 102: Armatures, Skinning, Weight painting, Posing and
Inverse kinematics, when the learner has no character of their own.

Options:
  --rig none      the mesh only (the default)
  --rig armature  the mesh and a 15-bone armature inside it, not bound
  --rig bound     the mesh bound to the armature with automatic weights
  --rig bad       bound, then with weights broken at the shoulders and hips

"Character" is one closed mesh made from a box by extrusion, the way lesson
97 teaches: a torso 0.38 m wide from 0.95 to 1.45 m, legs to the floor with
three loops close together at each knee and one below each hip, feet
pointing forward (-Y), arms straight out along X to 0.84 m with three loops
at each elbow and one at each shoulder, a neck and a box head whose top is
at 1.8 m. It faces
-Y, stands on the floor with its origin between its feet, and has its scale
applied. Measuring the mesh gives verts 232, faces 230, tris 460, quads 230,
ngons 0, nonManifoldEdges 0, doubles 0, scaleApplied true, dimensions
1.68 x 0.364 x 1.8 m.

"Armature" has 15 bones: hips, spine, chest, neck and head up the middle,
then upper_arm, forearm, thigh, shin and foot on each side, named .L and .R.
The arms and legs are children of the chest and the hips, not connected to
them. Every bone deforms. In Front is on, so the bones show through the mesh.
With --rig bound or bad the mesh is its child, with an Armature modifier and
one vertex group per bone (Object > Parent > With Automatic Weights).

With --rig bad, the upper arms also pull the sides of the chest at full
weight, the left thigh pulls the whole bottom of the torso, and the loop
below the right hip has no weight at all, so it stays behind when the leg
moves. With the Zero Weights overlay set to All, that loop shows black.

The default cube is removed; the camera and the light stay.
"""

OPTIONS = {
    "rig": "none, armature, bound or bad. Default none.",
}

# Torso grid: three columns across X, three rows through Y, four bands up Z.
XS = (-0.19, -0.045, 0.045, 0.19)
YS = (-0.11, -0.06, 0.06, 0.11)
ZS = (0.95, 1.05, 1.18, 1.31, 1.45)
LEG_X = (XS[2] + XS[3]) / 2


def build_mesh(bm):
    import bmesh
    from mathutils import Matrix, Vector

    # The torso as a box with its grid lines, built face by face so it comes out the same every time.
    verts = {}

    def v(x, y, z):
        key = (round(x, 5), round(y, 5), round(z, 5))
        if key not in verts:
            verts[key] = bm.verts.new(key)
        return verts[key]

    def quad(a, b, c, d):
        return bm.faces.new((a, b, c, d))

    for i in range(3):
        for j in range(3):
            quad(v(XS[i], YS[j], ZS[0]), v(XS[i], YS[j + 1], ZS[0]), v(XS[i + 1], YS[j + 1], ZS[0]), v(XS[i + 1], YS[j], ZS[0]))
            quad(v(XS[i], YS[j], ZS[-1]), v(XS[i + 1], YS[j], ZS[-1]), v(XS[i + 1], YS[j + 1], ZS[-1]), v(XS[i], YS[j + 1], ZS[-1]))
    for i in range(3):
        for k in range(4):
            quad(v(XS[i], YS[0], ZS[k]), v(XS[i + 1], YS[0], ZS[k]), v(XS[i + 1], YS[0], ZS[k + 1]), v(XS[i], YS[0], ZS[k + 1]))
            quad(v(XS[i], YS[-1], ZS[k]), v(XS[i], YS[-1], ZS[k + 1]), v(XS[i + 1], YS[-1], ZS[k + 1]), v(XS[i + 1], YS[-1], ZS[k]))
    for j in range(3):
        for k in range(4):
            quad(v(XS[0], YS[j], ZS[k]), v(XS[0], YS[j], ZS[k + 1]), v(XS[0], YS[j + 1], ZS[k + 1]), v(XS[0], YS[j + 1], ZS[k]))
            quad(v(XS[-1], YS[j], ZS[k]), v(XS[-1], YS[j + 1], ZS[k]), v(XS[-1], YS[j + 1], ZS[k + 1]), v(XS[-1], YS[j], ZS[k + 1]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)

    def faces_where(test):
        return [f for f in bm.faces if test(f.calc_center_median(), f.normal)]

    def extrude(faces, offsets, scale=None):
        """Extrude a region once per offset, moving it by that vector each time."""
        region = faces
        for step, offset in enumerate(offsets):
            result = bmesh.ops.extrude_face_region(bm, geom=region)
            # The operator leaves the old faces behind as a lid inside the new walls; remove them.
            bmesh.ops.delete(bm, geom=region, context="FACES")
            new_verts = [e for e in result["geom"] if isinstance(e, bmesh.types.BMVert)]
            region = [e for e in result["geom"] if isinstance(e, bmesh.types.BMFace)]
            bmesh.ops.translate(bm, vec=Vector(offset), verts=new_verts)
            if scale and step in scale:
                centre = sum((vert.co for vert in new_verts), Vector()) / len(new_verts)
                bmesh.ops.scale(bm, vec=scale[step], space=Matrix.Translation(-centre), verts=new_verts)
        return region

    for side in (1, -1):
        # Leg: a loop below the hip, two at the knee, then the shin and the ankle.
        leg = faces_where(lambda c, n: n.z < -0.9 and abs(c.z - ZS[0]) < 1e-4 and c.x * side > XS[2] - 1e-4)
        leg = extrude(leg, [(0, 0, -0.07), (0, 0, -0.28), (0, 0, -0.06), (0, 0, -0.06), (0, 0, -0.38), (0, 0, -0.10)])
        # Foot: the front of the lowest leg segment, pushed forward.
        foot = faces_where(lambda c, n: n.y < -0.9 and c.z < 0.1 and c.x * side > 0)
        extrude(foot, [(0, -0.14, 0)])
        # Arm: from the shoulder band of the torso's side, straight out along X.
        arm = faces_where(lambda c, n: n.x * side > 0.9 and abs(c.x) > 0.18 and c.z > ZS[3] and abs(c.y) < 0.01)
        extrude(arm, [(side * 0.06, 0, 0), (side * 0.17, 0, 0), (side * 0.05, 0, 0), (side * 0.05, 0, 0), (side * 0.20, 0, 0), (side * 0.12, 0, 0)])

    neck = faces_where(lambda c, n: n.z > 0.9 and abs(c.z - ZS[-1]) < 1e-4 and abs(c.x) < 0.01 and abs(c.y) < 0.01)
    extrude(neck, [(0, 0, 0.05), (0, 0, 0.04), (0, 0, 0.26)], scale={1: Vector((2.7, 1.9, 1.0))})
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)


BONES = [
    # name, head, tail, parent, connected
    ("hips", (0, 0, 0.95), (0, 0, 1.08), None, False),
    ("spine", (0, 0, 1.08), (0, 0, 1.22), "hips", True),
    ("chest", (0, 0, 1.22), (0, 0, 1.45), "spine", True),
    ("neck", (0, 0, 1.45), (0, 0, 1.54), "chest", True),
    ("head", (0, 0, 1.54), (0, 0, 1.80), "neck", True),
]
SIDE_BONES = [
    ("upper_arm", (0.22, 0, 1.38), (0.47, 0, 1.38), "chest", False),
    ("forearm", (0.47, 0, 1.38), (0.80, 0, 1.38), "upper_arm", True),
    ("thigh", (LEG_X, 0, 0.92), (LEG_X, -0.02, 0.51), "hips", False),
    ("shin", (LEG_X, -0.02, 0.51), (LEG_X, 0, 0.08), "thigh", True),
    ("foot", (LEG_X, 0, 0.08), (LEG_X, -0.2, 0.04), "shin", True),
]


def build_armature(scene):
    import bpy

    data = bpy.data.armatures.new("Armature")
    arm = bpy.data.objects.new("Armature", data)
    scene.collection.objects.link(arm)
    arm.show_in_front = True
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.mode_set(mode="EDIT")
    made = {}

    def add(name, head, tail, parent, connected):
        bone = data.edit_bones.new(name)
        bone.head = head
        bone.tail = tail
        bone.roll = 0.0
        if parent:
            bone.parent = made[parent]
            bone.use_connect = connected
        made[name] = bone

    for entry in BONES:
        add(*entry)
    for side, suffix in ((1, ".L"), (-1, ".R")):
        for name, head, tail, parent, connected in SIDE_BONES:
            flip = lambda p: (p[0] * side, p[1], p[2])
            parent_name = parent if parent in ("chest", "hips") else parent + suffix
            add(name + suffix, flip(head), flip(tail), parent_name, connected)
    bpy.ops.object.mode_set(mode="OBJECT")
    return arm


def break_weights(mesh_obj):
    """Spoil the automatic weights at the shoulders and hips, the way a bad bind looks."""
    groups = {g.name: g for g in mesh_obj.vertex_groups}
    for vert in mesh_obj.data.vertices:
        x, y, z = vert.co
        indices = [vert.index]
        if 1.24 < z < 1.46 and 0.1 < abs(x) < 0.2:
            # Shoulders: the upper arm takes the side of the chest outright.
            arm = groups["upper_arm.L" if x > 0 else "upper_arm.R"]
            for g in groups.values():
                g.remove(indices)
            arm.add(indices, 1.0, "REPLACE")
        elif ZS[0] - 1e-4 <= z <= ZS[1] + 1e-4 and abs(x) <= 0.2:
            # Hips: the left thigh owns the whole bottom of the torso, both sides.
            for g in groups.values():
                g.remove(indices)
            groups["thigh.L"].add(indices, 1.0, "REPLACE")
        elif abs(z - 0.88) < 1e-4 and x < 0:
            # The loop below the right hip: no weight at all.
            for g in groups.values():
                g.remove(indices)


def build(starter):
    import bmesh
    import bpy

    from dimensio_common import DimensioError

    rig = str(starter.option("rig", "none")).lower()
    if rig not in {"none", "armature", "bound", "bad"}:
        raise DimensioError("--rig must be none, armature, bound or bad.")

    scene = starter.scene
    starter.remove_default_cube()

    bm = bmesh.new()
    build_mesh(bm)
    mesh = bpy.data.meshes.new("Character")
    bm.to_mesh(mesh)
    bm.free()
    mesh.materials.append(starter.material("Character", (0.45, 0.62, 0.78)))
    character = bpy.data.objects.new("Character", mesh)
    scene.collection.objects.link(character)

    if rig != "none":
        arm = build_armature(scene)
        if rig in {"bound", "bad"}:
            for obj in bpy.data.objects:
                obj.select_set(False)
            character.select_set(True)
            arm.select_set(True)
            bpy.context.view_layer.objects.active = arm
            result = bpy.ops.object.parent_set(type="ARMATURE_AUTO")
            if "FINISHED" not in result or not character.vertex_groups:
                raise DimensioError("Blender could not bind the character with automatic weights.")
            if rig == "bad":
                break_weights(character)

    for obj in bpy.data.objects:
        obj.select_set(False)
    bpy.context.view_layer.objects.active = None
    starter.frame_viewports((-0.9, -0.3, 0.0), (0.9, 0.3, 1.8), view="front")
