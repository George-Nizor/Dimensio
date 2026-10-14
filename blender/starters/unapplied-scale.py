"""A shelf board scaled in Object Mode, with a Bevel modifier.

The board is Blender's 2 m cube scaled to 2 x 0.6 x 0.24 m in Object Mode,
so its scale reads (1, 0.3, 0.12). The Bevel modifier works on the mesh
before that scale, so its 0.2 m width comes out as 0.2 m along X, 6 cm along
Y and 2.4 cm along Z: the ends are rounded and the long edges barely are.
Applying the scale (Object > Apply > Scale, Ctrl+A) evens the bevel out.

The scene keeps the camera and the light. Measuring the starting file gives
scaleApplied false for "Shelf".
"""

OPTIONS = {}


def build(starter):
    import bpy

    shelf = bpy.data.objects["Cube"]
    shelf.name = "Shelf"
    shelf.data.name = "Shelf"
    shelf.scale = (1.0, 0.3, 0.12)
    shelf.location = (0.0, 0.0, 0.24)
    bevel = shelf.modifiers.new("Bevel", "BEVEL")
    bevel.width = 0.2
    bevel.segments = 3
    shelf.data.materials.clear()
    shelf.data.materials.append(starter.material("Painted wood", (0.80, 0.68, 0.50)))
    starter.frame_viewports((-1.0, -0.3, 0.0), (1.0, 0.3, 0.48))
