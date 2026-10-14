"""The lesson 27 crate with four common faults in it, for lesson 34, Checking
your model.

One mesh object, "Crate": the 0.5 m crate from lesson 27 (edges chamfered by
0.01 m, each side split by a diagonal brace, two triangular panels sunk
0.025 m), standing on the ground with its origin at the middle of its base.
Planted in it:

- The top was split off and never merged back, so its 4 corner vertices sit
  exactly on 4 others (4 doubles). The 4 edges round it each have only one
  face on either side (8 non-manifold edges).
- One chamfer face along the bottom front edge is missing: a hole with 4
  edges round it (4 non-manifold edges).
- The two sunk panels on the front face inwards (2 flipped faces). The 6
  edges where they meet the walls round them count as non-manifold too.
- Three stray vertices float inside the crate (3 loose vertices).

Measuring the starting file gives: verts 103, faces 103, tris 186, ngons 0,
nonManifoldEdges 18 (8 round the split top, 4 round the hole, 6 round the
reversed panels), looseVerts 3, looseEdges 0, doubles 4, flippedFaces 2,
scaleApplied true. Fixed, it measures verts 96, faces 104, tris 188 and 0
for every fault.
"""

OPTIONS = {}

SIZE = 0.5
CHAMFER = 0.01
INSET = 0.04
DEPTH = 0.025


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix, Vector

    starter.remove_default_cube()
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=SIZE, matrix=Matrix.Translation((0.0, 0.0, SIZE / 2)), calc_uvs=True)
    bmesh.ops.bevel(bm, geom=list(bm.edges) + list(bm.verts), offset=CHAMFER, offset_type="OFFSET",
                    segments=1, profile=0.5, affect="EDGES")
    big = [f for f in bm.faces if f.calc_area() > 0.5 * SIZE * SIZE]
    tris = bmesh.ops.triangulate(bm, faces=big, quad_method="BEAUTY", ngon_method="BEAUTY")["faces"]
    bmesh.ops.inset_individual(bm, faces=tris, thickness=INSET, use_even_offset=True)
    bm.normal_update()
    # Sink each inner triangle 0.05 m along its normal, with walls round it.
    sunk = bmesh.ops.extrude_discrete_faces(bm, faces=tris)["faces"]
    for face in sunk:
        offset = face.normal.copy() * -DEPTH
        for vert in face.verts:
            vert.co += offset
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.normal_update()

    # Fault 1: the top split off along its border, leaving 4 doubled corners.
    top_region = [f for f in bm.faces if f.calc_center_median().z > SIZE - CHAMFER - DEPTH - 0.001
                  and all(v.co.z > SIZE - CHAMFER - DEPTH - 0.001 for v in f.verts)
                  and all(abs(v.co.x) < SIZE / 2 - CHAMFER + 0.001 and abs(v.co.y) < SIZE / 2 - CHAMFER + 0.001 for v in f.verts)]
    bmesh.ops.split(bm, geom=top_region, use_only_faces=False)

    # Fault 2: the chamfer face along the bottom front edge removed.
    strip = next(f for f in bm.faces
                 if len(f.verts) == 4 and f.normal.y < -0.5 and f.normal.z < -0.5)
    bmesh.ops.delete(bm, geom=[strip], context="FACES_ONLY")

    # Fault 3: the two sunk panels on the front reversed.
    bm.normal_update()
    front_panels = [f for f in sunk if f.is_valid and f.normal.y < -0.9]
    bmesh.ops.reverse_faces(bm, faces=front_panels)

    # Fault 4: three stray vertices inside.
    for point in ((0.05, 0.025, 0.2), (-0.075, 0.05, 0.275), (0.025, -0.1, 0.15)):
        bm.verts.new(Vector(point))

    mesh = bpy.data.meshes.new("Crate")
    bm.to_mesh(mesh)
    bm.free()
    mesh.materials.append(starter.material("Wood", (0.62, 0.40, 0.22)))
    crate = bpy.data.objects.new("Crate", mesh)
    starter.scene.collection.objects.link(crate)
    bpy.context.view_layer.objects.active = crate
    crate.select_set(True)
    starter.frame_viewports((-0.5, -0.5, 0.0), (0.5, 0.5, 1.0))
