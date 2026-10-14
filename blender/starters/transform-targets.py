"""Eight blocks, each to be moved, turned or scaled into a wire outline.

For lesson 6, Move, rotate and scale. "Block 1" to "Block 8" are blue boxes
0.5 by 0.5 by 1 m, standing on the grid with their origins at their centres
(Z 0.5 m). Each has a target: the same box drawn as a wire outline, in a
"Targets" reference collection that cannot be selected, with a number on the
floor in front of the block. Matching block N to its outline takes:

1. G X 2: 2 m along X.
2. G Y 2: 2 m along Y, away from the front.
3. G Z 1: 1 m up.
4. R Z 45: 45 degrees around Z.
5. R Y 30: 30 degrees around Y, leaning sideways.
6. S 1.5: one and a half times as big.
7. S Z 0.5: half as tall.
8. R X 90, then G Z -0.25: laid down flat on the grid.

The blocks stand 6 m apart in two rows of four, so no outline touches another
pair. The default cube is removed; the camera and the light stay. Measuring
the starting file gives 8 meshes (the blocks), 96 triangles, scale and
rotation applied on every block. The targets are skipped. The exercise has
no measure: limits.
"""

import math

OPTIONS = {}

SIZE = (0.5, 0.5, 1.0)

# (start x, start y, target location offset, target rotation in degrees, target scale)
PAIRS = [
    ((2.0, 0.0, 0.0), (0, 0, 0), (1, 1, 1)),
    ((0.0, 2.0, 0.0), (0, 0, 0), (1, 1, 1)),
    ((0.0, 0.0, 1.0), (0, 0, 0), (1, 1, 1)),
    ((0.0, 0.0, 0.0), (0, 0, 45), (1, 1, 1)),
    ((0.0, 0.0, 0.0), (0, 30, 0), (1, 1, 1)),
    ((0.0, 0.0, 0.0), (0, 0, 0), (1.5, 1.5, 1.5)),
    ((0.0, 0.0, 0.0), (0, 0, 0), (1, 1, 0.5)),
    ((0.0, 0.0, -0.25), (90, 0, 0), (1, 1, 1)),
]

SPOTS = [(-9.0, 6.0), (-3.0, 6.0), (3.0, 6.0), (9.0, 6.0), (-9.0, 0.0), (-3.0, 0.0), (3.0, 0.0), (9.0, 0.0)]


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    scene = starter.scene
    starter.remove_default_cube()
    targets = starter.reference_collection("Targets")

    def box_mesh(name):
        bm = bmesh.new()
        bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Diagonal((*SIZE, 1.0)))
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        return mesh

    def digit(text, location):
        curve = bpy.data.curves.new(f"Number {text}", type="FONT")
        curve.body = text
        curve.align_x = "CENTER"
        curve.align_y = "CENTER"
        curve.size = 0.7
        temp = bpy.data.objects.new("Number text", curve)
        scene.collection.objects.link(temp)
        depsgraph = bpy.context.evaluated_depsgraph_get()
        mesh = bpy.data.meshes.new_from_object(temp.evaluated_get(depsgraph))
        bpy.data.objects.remove(temp)
        bpy.data.curves.remove(curve)
        mesh.name = f"Number {text}"
        mesh.materials.append(number_mat)
        obj = bpy.data.objects.new(f"Number {text}", mesh)
        obj.location = location
        targets.objects.link(obj)
        return obj

    block_mat = starter.material("Block", (0.25, 0.45, 0.80))
    number_mat = starter.material("Number", (0.10, 0.10, 0.12))

    blocks = []
    for index, ((dx, dy, dz), rotation, scale) in enumerate(PAIRS, start=1):
        x, y = SPOTS[index - 1]
        mesh = box_mesh(f"Block {index}")
        mesh.materials.append(block_mat)
        block = bpy.data.objects.new(f"Block {index}", mesh)
        block.location = (x, y, SIZE[2] / 2)
        scene.collection.objects.link(block)
        blocks.append(block)

        target = bpy.data.objects.new(f"Target {index}", box_mesh(f"Target {index}"))
        target.location = (x + dx, y + dy, SIZE[2] / 2 + dz)
        target.rotation_euler = tuple(math.radians(a) for a in rotation)
        target.scale = scale
        target.display_type = "WIRE"
        target.show_in_front = True
        targets.objects.link(target)

        digit(str(index), (x, y - 1.2, 0.002))

    for obj in scene.objects:
        obj.select_set(False)
    low, high = starter.world_bounds([*blocks, *targets.objects])
    starter.frame_viewports(low, high)
