"""A market corner with every object left under its default name.

For lesson 17, Collections and the Outliner. Everything sits in the one
"Collection" the factory scene has, named as Blender names new objects:

- Props: four crates ("Cube.001" to "Cube.004"), three barrels ("Cylinder",
  "Cylinder.001", "Cylinder.002") and a table top and its four legs
  ("Cube.005" to "Cube.009"), all standing on a 10 m ground ("Plane").
- Lights: the factory "Light" and three more point lights, "Point",
  "Point.001" and "Point.002", hanging over the stalls.
- Reference: a 1.8 m figure for scale ("Cube.010") and a 2 m tall pole
  ("Cylinder.003") marking where a lamp will go.

The camera stays. Measuring the starting file gives 15 meshes, 298
triangles and no n-gons, because the barrels' and the pole's caps are
triangle fans. The ground is an open plane, so nonManifoldEdges reads 4. The
exercise has no measure: limits, because the sorting is checked in the
Outliner.
"""

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    starter.remove_default_cube()
    scene = starter.scene
    collection = bpy.data.collections.get("Collection") or scene.collection
    wood = starter.material("Wood", (0.62, 0.42, 0.24))
    barrel_wood = starter.material("Barrel", (0.45, 0.28, 0.16))
    cloth = starter.material("Cloth", (0.78, 0.74, 0.62))
    ground = starter.material("Ground", (0.42, 0.50, 0.36))
    grey = starter.material("Grey", (0.55, 0.55, 0.58))

    def mesh_object(name, make, location, material):
        bm = bmesh.new()
        make(bm)
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        collection.objects.link(obj)
        return obj

    def box(size):
        def make(bm):
            matrix = Matrix.Translation((0.0, 0.0, size[2] / 2)) @ Matrix.Diagonal((size[0], size[1], size[2], 1.0))
            bmesh.ops.create_cube(bm, size=1.0, matrix=matrix, calc_uvs=True)
        return make

    def drum(radius, height, segments=12):
        def make(bm):
            bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=True, segments=segments,
                                  radius1=radius, radius2=radius, depth=height,
                                  matrix=Matrix.Translation((0.0, 0.0, height / 2)), calc_uvs=True)
        return make

    def plane(size):
        def make(bm):
            bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=size / 2, calc_uvs=True)
        return make

    def point_light(name, location, energy=300.0):
        data = bpy.data.lights.new(name, type="POINT")
        data.energy = energy
        obj = bpy.data.objects.new(name, data)
        obj.location = location
        collection.objects.link(obj)
        return obj

    objects = [mesh_object("Plane", plane(10.0), (0.0, 0.0, 0.0), ground)]
    # Four crates, two of them stacked.
    for name, location in (("Cube.001", (-3.0, -1.0, 0.0)), ("Cube.002", (-2.1, -1.2, 0.0)),
                           ("Cube.003", (-2.6, -1.1, 0.8)), ("Cube.004", (-3.2, 0.4, 0.0))):
        objects.append(mesh_object(name, box((0.8, 0.8, 0.8)), location, wood))
    # Three barrels.
    for name, location in (("Cylinder", (2.4, -1.4, 0.0)), ("Cylinder.001", (3.3, -1.0, 0.0)),
                           ("Cylinder.002", (2.8, -0.2, 0.0))):
        objects.append(mesh_object(name, drum(0.4, 1.0), location, barrel_wood))
    # A table: a top and four legs.
    objects.append(mesh_object("Cube.005", box((1.6, 0.9, 0.06)), (0.0, 1.5, 0.72), cloth))
    for index, (x, y) in enumerate(((-0.72, 1.12), (0.72, 1.12), (-0.72, 1.88), (0.72, 1.88))):
        objects.append(mesh_object(f"Cube.{6 + index:03d}", box((0.06, 0.06, 0.72)), (x, y, 0.0), wood))
    # Reference: a 1.8 m figure and a 2 m pole.
    objects.append(mesh_object("Cube.010", box((0.45, 0.25, 1.8)), (0.6, -2.4, 0.0), grey))
    objects.append(mesh_object("Cylinder.003", drum(0.05, 2.0, segments=8), (-0.8, -2.2, 0.0), grey))

    # Three more lights over the stalls; the factory "Light" stays where it is.
    point_light("Point", (-2.6, -0.6, 2.6))
    point_light("Point.001", (2.8, -0.8, 2.6))
    point_light("Point.002", (0.0, 1.5, 2.4))

    for obj in bpy.data.objects:
        obj.select_set(False)
    low, high = starter.world_bounds(objects)
    starter.frame_viewports(low, high)
