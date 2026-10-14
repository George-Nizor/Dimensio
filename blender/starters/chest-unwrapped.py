"""A chest unwrapped into seven islands that still need arranging.

For lesson 56, Arranging UV islands. "Chest" is one mesh in two closed parts:
a 1.2 by 0.8 by 0.6 m box, and 1 cm above it a lid that is half of a
12-sided cylinder lying along X (radius 0.4 m), its ends closed with triangle
fans and its underside with two faces. Seams run round every island, and the
UV map, "UVMap", holds seven islands as an unwrap might leave them:

- the box's four sides as one strip, 1.5 times too big, running off the
  right of the square;
- the box's top and bottom, each half the size it should be;
- the lid's six curved faces as a strip bent into an arc;
- the lid's two ends as half discs, and its underside turned 20 degrees and
  shrunk, all overlapping the other islands.

The shared material, "Test grid", is an Image Texture holding a generated
1024 px UV Grid, linked to Base Color, so the uneven sizes show on the model.
Every 3D Viewport opens in Material Preview. The default cube is removed; the
camera and the light stay.

Measuring gives 1 mesh: verts 24, faces 26, tris 40, quads 14, ngons 0,
nonManifoldEdges 0, doubles 0, materials 1, uvLayers 1. The lesson's measure asks for
uvLayers min 1; what it teaches is in the UV Editor.
"""

import math

OPTIONS = {}

W, D, H = 1.2, 0.8, 0.6
R = D / 2
SEG = 6

# Each island: scale, turn in degrees, where it goes, and for the lid's strip, the arc it bends on.
PLAN = {
    "strip": dict(s=0.3, at=(-0.08, 0.5)),
    "top": dict(s=0.1, at=(0.3, 0.32)),
    "bottom": dict(s=0.1, at=(0.62, 0.62)),
    "lid": dict(s=0.2, at=(0.5, -0.12), bend=(-0.75, 0.75, 0.3)),
    "endL": dict(s=0.2, at=(0.12, 0.22)),
    "endR": dict(s=0.2, at=(0.7, 0.24)),
    "under": dict(s=0.14, at=(0.42, 0.56), turn=20),
}


def parts():
    """Faces as (island, corners, flat corners in metres), the body first, then the lid."""
    x0, x1, y0, y1 = -W / 2, W / 2, -D / 2, D / 2
    body = [
        ("strip", [(x0, y0, 0), (x1, y0, 0), (x1, y0, H), (x0, y0, H)], [(0, 0), (W, 0), (W, H), (0, H)]),
        ("strip", [(x1, y0, 0), (x1, y1, 0), (x1, y1, H), (x1, y0, H)], [(W, 0), (W + D, 0), (W + D, H), (W, H)]),
        ("strip", [(x1, y1, 0), (x0, y1, 0), (x0, y1, H), (x1, y1, H)], [(W + D, 0), (2 * W + D, 0), (2 * W + D, H), (W + D, H)]),
        ("strip", [(x0, y1, 0), (x0, y0, 0), (x0, y0, H), (x0, y1, H)], [(2 * W + D, 0), (2 * W + 2 * D, 0), (2 * W + 2 * D, H), (2 * W + D, H)]),
        ("bottom", [(x0, y1, 0), (x1, y1, 0), (x1, y0, 0), (x0, y0, 0)], [(0, D), (W, D), (W, 0), (0, 0)]),
        ("top", [(x0, y0, H), (x1, y0, H), (x1, y1, H), (x0, y1, H)], [(0, 0), (W, 0), (W, D), (0, D)]),
    ]

    # The lid sits 1 cm above the box, as a separate lid would, so no vertices are doubled.
    base = H + 0.01

    def arc(x, i):
        a = math.pi - math.pi * i / SEG
        return (x, math.cos(a) * R, base + math.sin(a) * R)

    step = math.pi * R / SEG
    lid = []
    for i in range(SEG):
        lid.append(("lid", [arc(x0, i), arc(x0, i + 1), arc(x1, i + 1), arc(x1, i)], [(i * step, 0), ((i + 1) * step, 0), ((i + 1) * step, W), (i * step, W)]))
    for i in range(SEG):
        p, q = arc(x0, i), arc(x0, i + 1)
        lid.append(("endL", [(x0, 0, base), q, p], [(R, 0), (R - q[1], q[2] - base), (R - p[1], p[2] - base)]))
        p, q = arc(x1, i), arc(x1, i + 1)
        lid.append(("endR", [(x1, 0, base), p, q], [(R, 0), (R + p[1], p[2] - base), (R + q[1], q[2] - base)]))
    lid.append(("under", [(x0, y0, base), (x0, 0, base), (x1, 0, base), (x1, y0, base)], [(0, 0), (0, R), (W, R), (W, 0)]))
    lid.append(("under", [(x0, 0, base), (x0, y1, base), (x1, y1, base), (x1, 0, base)], [(0, R), (0, D), (W, D), (W, R)]))
    return body, lid


def place(island, flat):
    plan = PLAN[island]
    s = plan["s"]
    ax, ay = plan["at"]
    if "bend" in plan:
        start, end, radius = plan["bend"]
        out = []
        for x, y in flat:
            angle = start + (x / (math.pi * R)) * (end - start)
            r = radius + y * s
            out.append((ax + math.sin(angle) * r, ay + math.cos(angle) * r))
        return out
    a = math.radians(plan.get("turn", 0))
    return [(ax + x * s * math.cos(a) - y * s * math.sin(a), ay + x * s * math.sin(a) + y * s * math.cos(a)) for x, y in flat]


def build(starter):
    import bmesh
    import bpy

    scene = starter.scene
    starter.remove_default_cube()

    image = bpy.data.images.new("UV Grid", 1024, 1024)
    image.generated_type = "UV_GRID"
    material = bpy.data.materials.new("Test grid")
    tree = material.node_tree
    bsdf = next(n for n in tree.nodes if n.type == "BSDF_PRINCIPLED")
    texture = tree.nodes.new("ShaderNodeTexImage")
    texture.image = image
    texture.location = (bsdf.location.x - 320, bsdf.location.y)
    tree.links.new(texture.outputs["Color"], bsdf.inputs["Base Color"])

    bm = bmesh.new()
    layer = bm.loops.layers.uv.new("UVMap")
    island_of = {}
    for part in parts():
        verts = {}

        def vert(co):
            key = tuple(round(c, 6) for c in co)
            if key not in verts:
                verts[key] = bm.verts.new(key)
            return verts[key]

        for island, corners, flat in part:
            face = bm.faces.new([vert(co) for co in corners])
            island_of[face] = island
            for loop, uv in zip(face.loops, place(island, flat)):
                loop[layer].uv = uv
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    for edge in bm.edges:
        islands = {island_of[f] for f in edge.link_faces}
        edge.seam = len(islands) > 1

    mesh = bpy.data.meshes.new("Chest")
    bm.to_mesh(mesh)
    bm.free()
    mesh.materials.append(material)
    obj = bpy.data.objects.new("Chest", mesh)
    scene.collection.objects.link(obj)

    for other in bpy.data.objects:
        other.select_set(False)
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    low, high = starter.world_bounds([obj])
    starter.frame_viewports(low, high)
    for screen in bpy.data.screens:
        for area in screen.areas:
            if area.type == "VIEW_3D":
                for space in area.spaces:
                    if space.type == "VIEW_3D":
                        space.shading.type = "MATERIAL"
