"""Six props on a 20 m floor, each with one letter on a face only one view shows.

For lesson 3, Viewport navigation. The props are named "Prop 1" to "Prop 6" and
read in that order the letters spell CAMERA. Each letter is a flat mesh parented
to its prop, a little proud of the face it sits on, and reads the right way round
from the view that finds it:

- Prop 1, a small crate 0.3 m wide in the far corner: on its front (Numpad 1),
  but too small to read until you select it and frame it with Numpad . .
- Prop 2, a cube: on its back (Ctrl+Numpad 1).
- Prop 3, a crate: on its right side (Numpad 3).
- Prop 4, a pillar: on its left side (Ctrl+Numpad 3).
- Prop 5, a drum (a cylinder): on its top (Numpad 7).
- Prop 6, a slab on a post just past the floor's edge: on its underside
  (Ctrl+Numpad 7). From below, the floor would hide anything standing on it.

The floor is a 20 m plane. The default cube is removed; the camera and the light
stay. Measuring gives 14 mesh objects: the floor, the six props, Prop 6's post
and six letters. The only n-gons are Prop 5's two caps. The exercise has no
measure: limits.
"""

import math

OPTIONS = {}

WORD = "CAMERA"

# Euler rotations (degrees) that turn a text object, which faces +Z, to face
# the viewer of each view with its letter upright and not mirrored.
FACING = {
    "front": (90, 0, 0),
    "back": (90, 0, 180),
    "right": (90, 0, 90),
    "left": (90, 0, -90),
    "top": (0, 0, 0),
    "bottom": (180, 0, 0),
}

# Which way each face points, to set the letter just off the surface.
NORMAL = {
    "front": (0, -1, 0),
    "back": (0, 1, 0),
    "right": (1, 0, 0),
    "left": (-1, 0, 0),
    "top": (0, 0, 1),
    "bottom": (0, 0, -1),
}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    scene = starter.scene
    starter.remove_default_cube()

    floor_mat = starter.material("Floor", (0.62, 0.62, 0.60))
    prop_mat = starter.material("Prop", (0.80, 0.55, 0.32))
    letter_mat = starter.material("Letter", (0.08, 0.08, 0.09))

    def mesh_object(name, make, location, material):
        bm = bmesh.new()
        make(bm)
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        scene.collection.objects.link(obj)
        return obj

    def box(size):
        def make(bm):
            bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Diagonal((size[0], size[1], size[2], 1.0)))
        return make

    def drum(radius, depth):
        def make(bm):
            bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=16,
                                  radius1=radius, radius2=radius, depth=depth)
        return make

    def letter(char, prop, face, half_extent, size):
        curve = bpy.data.curves.new(f"Letter {char}", type="FONT")
        curve.body = char
        curve.align_x = "CENTER"
        curve.align_y = "CENTER"
        curve.size = size
        text = bpy.data.objects.new("Letter text", curve)
        scene.collection.objects.link(text)
        depsgraph = bpy.context.evaluated_depsgraph_get()
        mesh = bpy.data.meshes.new_from_object(text.evaluated_get(depsgraph))
        bpy.data.objects.remove(text)
        bpy.data.curves.remove(curve)
        mesh.name = f"{prop.name} letter"
        mesh.materials.append(letter_mat)
        obj = bpy.data.objects.new(f"{prop.name} letter", mesh)
        scene.collection.objects.link(obj)
        n = NORMAL[face]
        offset = half_extent + 0.003
        obj.location = (n[0] * offset, n[1] * offset, n[2] * offset)
        obj.rotation_euler = tuple(math.radians(a) for a in FACING[face])
        obj.parent = prop
        obj.hide_select = True
        return obj

    floor = mesh_object("Floor", lambda bm: bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=10.0), (0, 0, 0), floor_mat)
    floor.hide_select = True

    props = []
    # Prop 1: small and far away, letter on the front.
    p1 = mesh_object("Prop 1", box((0.3, 0.3, 0.3)), (9.2, 9.2, 0.15), prop_mat)
    letter(WORD[0], p1, "front", 0.15, 0.22)
    props.append(p1)
    # Prop 2: a cube with its letter on the back.
    p2 = mesh_object("Prop 2", box((1.2, 1.2, 1.2)), (-5.0, -3.0, 0.6), prop_mat)
    letter(WORD[1], p2, "back", 0.6, 0.8)
    props.append(p2)
    # Prop 3: a crate with its letter on the right side.
    p3 = mesh_object("Prop 3", box((1.0, 1.4, 1.0)), (-1.5, 5.5, 0.5), prop_mat)
    letter(WORD[2], p3, "right", 0.5, 0.75)
    props.append(p3)
    # Prop 4: a pillar with its letter on the left side.
    p4 = mesh_object("Prop 4", box((0.8, 0.8, 3.0)), (5.5, -4.5, 1.5), prop_mat)
    letter(WORD[3], p4, "left", 0.4, 0.6)
    props.append(p4)
    # Prop 5: a drum with its letter on top.
    p5 = mesh_object("Prop 5", drum(0.7, 0.9), (3.0, 3.5, 0.45), prop_mat)
    letter(WORD[4], p5, "top", 0.45, 0.8)
    props.append(p5)
    # Prop 6: a slab held up on a post, its letter underneath. It stands past the floor's edge,
    # because from below the floor would hide it.
    p6 = mesh_object("Prop 6", box((1.6, 1.6, 0.15)), (-12.5, 2.0, 1.6), prop_mat)
    letter(WORD[5], p6, "bottom", 0.075, 1.0)
    post = mesh_object("Prop 6 post", box((0.12, 0.12, 1.525)), (0, 0, 0), prop_mat)
    post.parent = p6
    post.location = (0.7, 0.7, -0.8375)
    props.append(p6)

    for obj in bpy.data.objects:
        obj.select_set(False)
    low, high = starter.world_bounds([floor, *props])
    starter.frame_viewports(low, high)
