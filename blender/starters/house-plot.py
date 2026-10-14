"""An empty 6 x 6 m plot to build a house on, with a figure for scale.

For lesson 18, A house block-out. A "Plot" collection holds:

- "Plot": a 6 x 6 m square of ground at Z 0, centred on the world origin, so
  its corners are at X and Y of plus and minus 3 m.
- "Path": a 1 m wide strip leading to the plot's front edge (towards -Y),
  where the door should go.
- "Figure": a 1.8 m tall block person standing on the path, facing the plot.

The Plot collection is marked as reference: measuring skips it, and its
objects cannot be selected or rendered. They can still be snapped to. The
default cube is removed; the camera and the light stay.

Measuring the starting file gives no meshes. The house built as the lesson
describes (a floor, three walls, a front wall in two pieces with a lintel,
and a 4.8 x 3.1 x 3.1 m box turned 45 degrees as the roof) measures 8
meshes, 96 triangles, no n-gons and scaleApplied true.
"""

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    starter.remove_default_cube()
    plot_collection = starter.reference_collection("Plot")
    ground = starter.material("Ground", (0.46, 0.56, 0.36))
    gravel = starter.material("Path", (0.70, 0.66, 0.58))
    grey = starter.material("Figure", (0.55, 0.55, 0.60))

    def mesh_object(name, make, location, material):
        bm = bmesh.new()
        make(bm)
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        plot_collection.objects.link(obj)
        return obj

    def rectangle(size_x, size_y):
        def make(bm):
            matrix = Matrix.Diagonal((size_x / 2, size_y / 2, 1.0, 1.0))
            bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=1.0, matrix=matrix, calc_uvs=True)
        return make

    def box(size, centre):
        def make(bm):
            matrix = Matrix.Translation(centre) @ Matrix.Diagonal((size[0], size[1], size[2], 1.0))
            bmesh.ops.create_cube(bm, size=1.0, matrix=matrix, calc_uvs=True)
        return make

    def figure(bm):
        # Legs and body in one block, then a head, 1.8 m in all.
        box((0.44, 0.24, 1.55), (0.0, 0.0, 0.775))(bm)
        box((0.24, 0.24, 0.25), (0.0, 0.0, 1.675))(bm)

    plot = mesh_object("Plot", rectangle(6.0, 6.0), (0.0, 0.0, 0.0), ground)
    path = mesh_object("Path", rectangle(1.0, 3.0), (0.0, -4.5, 0.0), gravel)
    person = mesh_object("Figure", figure, (1.2, -4.2, 0.0), grey)

    low, high = starter.world_bounds([plot, path, person])
    high.z = 4.5
    starter.frame_viewports(low, high)
