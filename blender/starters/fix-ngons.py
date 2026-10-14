"""A stool with three mistakes to fix.

One mesh object, "Stool": an octagonal seat on four legs, 0.53 m tall.

- The seat's top and bottom are 8-sided n-gons (2 n-gons).
- The front-left leg has no bottom face, so the four edges around the hole
  have only one face each (4 non-manifold edges).
- The back-right leg was duplicated in place, as Shift+D then a right click
  leaves it: 8 vertices sit exactly on 8 others (8 doubles).

Measuring the starting file gives: verts 56, edges 84, faces 39, tris 86,
quads 37, ngons 2, nonManifoldEdges 4, looseVerts 0, looseEdges 0,
doubles 8, flippedFaces 0.
"""

OPTIONS = {}

SEAT_HEIGHT = 0.45
SEAT_THICKNESS = 0.08
SEAT_RADIUS = 0.4
LEG_SIZE = 0.05
LEG_OFFSET = 0.22


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix

    starter.remove_default_cube()
    bm = bmesh.new()
    seat_matrix = Matrix.Translation((0.0, 0.0, SEAT_HEIGHT + SEAT_THICKNESS / 2))
    bmesh.ops.create_cone(
        bm, cap_ends=True, cap_tris=False, segments=8,
        radius1=SEAT_RADIUS, radius2=SEAT_RADIUS, depth=SEAT_THICKNESS,
        matrix=seat_matrix, calc_uvs=True,
    )

    def leg(x, y):
        matrix = Matrix.Translation((x, y, SEAT_HEIGHT / 2)) @ Matrix.Diagonal((LEG_SIZE, LEG_SIZE, SEAT_HEIGHT, 1.0))
        return bmesh.ops.create_cube(bm, size=1.0, matrix=matrix, calc_uvs=True)["verts"]

    front_left = leg(-LEG_OFFSET, -LEG_OFFSET)
    leg(LEG_OFFSET, -LEG_OFFSET)
    leg(-LEG_OFFSET, LEG_OFFSET)
    leg(LEG_OFFSET, LEG_OFFSET)
    leg(LEG_OFFSET, LEG_OFFSET)  # the duplicate left in place

    # Remove the bottom face of the front-left leg.
    bm.normal_update()
    bottom = [
        face for face in bm.faces
        if all(vert in front_left for vert in face.verts) and face.normal.z < -0.9
    ]
    bmesh.ops.delete(bm, geom=bottom, context="FACES_ONLY")

    mesh = bpy.data.meshes.new("Stool")
    bm.to_mesh(mesh)
    bm.free()
    mesh.materials.append(starter.material("Wood", (0.55, 0.36, 0.20)))
    stool = bpy.data.objects.new("Stool", mesh)
    starter.scene.collection.objects.link(stool)
    bpy.context.view_layer.objects.active = stool
    stool.select_set(True)
    starter.frame_viewports((-0.4, -0.4, 0.0), (0.4, 0.4, 0.53))
