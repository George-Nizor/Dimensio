"""A grey low-poly tree to colour with vertex paint.

For lesson 59, Vertex painting. "Tree" is one mesh object made of three
separate parts, so `L` in Vertex Paint's face mask picks each one whole:

- the trunk, a six-sided cylinder 1.3 m tall that narrows from 0.24 m to
  0.16 m across, with fan caps (24 triangles);
- the lower canopy, an ico sphere (two subdivisions) about 1.4 m across
  and a little squashed, centred 1.55 m up (80 triangles);
- the top canopy, a smaller ico sphere 0.9 m across, 2.15 m up (80
  triangles).

The tree stands on the ground with its origin at the base centre. It has
one grey material ("Tree", a Principled BSDF with no texture), no UV map and
no colour attribute: entering Vertex Paint mode makes one. Faces are flat
shaded. The default cube is removed; the camera and the light stay.

Measuring the starting file gives 1 mesh, verts 98, faces 178, tris 184,
quads 6, ngons 0, nonManifoldEdges 0, materials 1, uvLayers 0, scaleApplied
true, dimensions about 1.4 x 1.4 x 2.6 m. The exercise measures materials
(equals 1) and uvLayers (max 0).
"""

OPTIONS = {}


def build(starter):
    import bmesh
    import bpy
    from mathutils import Matrix, Vector, noise

    scene = starter.scene
    starter.remove_default_cube()

    # mathutils.noise seeds itself from the clock (seed 0 does too); fix it so the file is the same.
    noise.seed_set(1)

    bm = bmesh.new()

    # Trunk: six sides, narrowing upwards, with triangle fans for caps.
    bmesh.ops.create_cone(
        bm, cap_ends=True, cap_tris=True, segments=6,
        radius1=0.12, radius2=0.08, depth=1.3,
        matrix=Matrix.Translation((0.0, 0.0, 0.65)),
    )

    def blob(radius, centre, squash, seed):
        before = set(bm.verts)
        bmesh.ops.create_icosphere(bm, subdivisions=2, radius=radius,
                                   matrix=Matrix.Translation(centre) @ Matrix.Diagonal((1.0, 1.0, squash, 1.0)))
        made = [v for v in bm.verts if v not in before]
        # A little seeded jitter, so the canopy reads as hand-made rather than a perfect ball.
        for v in made:
            offset = noise.noise_vector(v.co * 2.3 + Vector((seed, seed * 2.0, seed * 3.0)))
            v.co += offset * radius * 0.12

    blob(0.7, (0.0, 0.0, 1.55), 0.85, 1.0)
    blob(0.45, (0.05, -0.03, 2.15), 0.9, 5.0)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)

    mesh = bpy.data.meshes.new("Tree")
    bm.to_mesh(mesh)
    bm.free()
    for poly in mesh.polygons:
        poly.use_smooth = False
    mesh.materials.append(starter.material("Tree", (0.55, 0.55, 0.55)))
    tree = bpy.data.objects.new("Tree", mesh)
    scene.collection.objects.link(tree)

    for obj in bpy.data.objects:
        obj.select_set(False)
    tree.select_set(True)
    bpy.context.view_layer.objects.active = tree
    low, high = starter.world_bounds([tree])
    starter.frame_viewports(low, high)
