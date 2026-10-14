"""Four meshes with coloured targets for loop, ring, path and linked selection.

For lesson 20, Selecting loops. Each target is coloured with a second
material, so the learner can see whether a selection covers it exactly:

- "Pipe": a 12-sided cylinder 1 m across and 2 m tall with five edge loops
  around it, so its side is six rows of faces. The fourth row up is red: one
  face loop, selected with Alt+click in Face mode, or as a ring of 12
  vertical edges with Ctrl+Alt+click in Edge mode.
- "Ball": a UV sphere, 16 segments and 8 rings, 1.2 m across, blue above the
  equator and white below it. The equator is one edge loop of 16 edges.
- "Floor": a 2 m grid of 8 x 8 faces with two dark corner squares, for a
  shortest path from one to the other with Ctrl+click.
- "Bolts": five small cubes in one mesh, not joined to each other, for L
  (select linked under the mouse).

The default cube is removed; the camera and the light stay. Measuring gives
4 meshes, 580 triangles and no n-gons, because the Pipe's caps are triangle
fans. The Floor is an open grid, so nonManifoldEdges reads 32. The
exercise has no measure: limits, because the learner checks each selection
against its colour.
"""

import math

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    starter.remove_default_cube()
    scene = starter.scene
    plain = starter.material("Plain", (0.80, 0.80, 0.78))
    red = starter.material("Target red", (0.85, 0.20, 0.18))
    blue = starter.material("Target blue", (0.25, 0.45, 0.85))
    dark = starter.material("Target dark", (0.15, 0.15, 0.17))
    metal = starter.material("Bolt", (0.55, 0.57, 0.60))

    def finish(name, bm, materials, location):
        mesh = bpy.data.meshes.new(name)
        bm.to_mesh(mesh)
        bm.free()
        for material in materials:
            mesh.materials.append(material)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        scene.collection.objects.link(obj)
        return obj

    # Pipe: a ring of 12 vertices repeated at 7 heights, quads between, triangle-fan caps.
    bm = bmesh.new()
    sides, rows, radius, height = 12, 6, 0.5, 2.0
    rings = []
    for row in range(rows + 1):
        z = height * row / rows
        rings.append([bm.verts.new((radius * math.cos(2 * math.pi * i / sides),
                                    radius * math.sin(2 * math.pi * i / sides), z)) for i in range(sides)])
    for row in range(rows):
        for i in range(sides):
            j = (i + 1) % sides
            face = bm.faces.new((rings[row][i], rings[row][j], rings[row + 1][j], rings[row + 1][i]))
            face.material_index = 1 if row == 3 else 0
    for ring, z, flip in ((rings[0], 0.0, True), (rings[-1], height, False)):
        centre = bm.verts.new((0.0, 0.0, z))
        for i in range(sides):
            j = (i + 1) % sides
            corners = (ring[j], ring[i], centre) if flip else (ring[i], ring[j], centre)
            bm.faces.new(corners)
    bm.normal_update()
    pipe = finish("Pipe", bm, [plain, red], (-2.4, 0.0, 0.0))

    # Ball: a UV sphere, blue above the equator.
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=16, v_segments=8, radius=0.6,
                              matrix=Matrix.Translation((0.0, 0.0, 0.6)), calc_uvs=True)
    for face in bm.faces:
        face.material_index = 1 if face.calc_center_median().z > 0.6 else 0
    ball = finish("Ball", bm, [plain, blue], (-0.6, 0.0, 0.0))

    # Floor: an 8 x 8 grid with two dark corner squares.
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=8, y_segments=8, size=1.0, calc_uvs=True)
    for face in bm.faces:
        c = face.calc_center_median()
        face.material_index = 1 if (c.x < -0.74 and c.y < -0.74) or (c.x > 0.74 and c.y > 0.74) else 0
    floor = finish("Floor", bm, [plain, dark], (1.6, 0.0, 0.0))

    # Bolts: five separate cubes in one mesh.
    bm = bmesh.new()
    for index in range(5):
        matrix = Matrix.Translation((index * 0.35, 0.0, 0.1)) @ Matrix.Diagonal((0.2, 0.2, 0.2, 1.0))
        bmesh.ops.create_cube(bm, size=1.0, matrix=matrix, calc_uvs=True)
    bolts = finish("Bolts", bm, [metal], (0.9, -1.8, 0.0))

    for obj in bpy.data.objects:
        obj.select_set(False)
    low, high = starter.world_bounds([pipe, ball, floor, bolts])
    starter.frame_viewports(low, high)
