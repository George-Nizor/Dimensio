"""A grey barrel and a palette image, ready to be coloured with one material.

For lesson 57, Palette textures. "Barrel" is one mesh, 12-sided and 1.2 m tall:
staves 0.8 m across at the ends and 0.86 m at the middle, two metal bands
0.1 m tall (between 0.22 and 0.32 m, and between 0.88 and 0.98 m) that stand
out by a centimetre on narrow step faces, and triangle-fan ends. It has a UV map like an added
cylinder's (the side as one strip, each end as a disc) and no material.

The file also holds "palette", a 128 by 128 px image of 64 swatches, 16 px
each: eight rows (wood browns, greys, reds, yellows, greens, blues, purples
and skin tones), each running from dark on the left to light on the right.
It is made here, so it is ours (CC0), packed into the file and kept with a
fake user, so the learner picks it from an Image Texture node's image list.

The default cube is removed; the camera and the light stay. Every 3D Viewport
opens in Material Preview.

Measuring gives 1 mesh: verts 122, faces 132, tris 240, quads 108, ngons 0,
nonManifoldEdges 0, materials 0, uvLayers 1. The lesson's measures ask for
materials equals 1 and uvLayers min 1.
"""

import colorsys
import math

OPTIONS = {}

SIZE = 128
CELL = 16
# Hue, saturation for each row, top to bottom.
ROWS = [(0.07, 0.65), (0.0, 0.0), (0.0, 0.75), (0.13, 0.8), (0.3, 0.6), (0.6, 0.65), (0.78, 0.5), (0.06, 0.4)]

HEIGHTS = (0.0, 0.22, 0.32, 0.88, 0.98, 1.2)
RADII = (0.4, 0.43, 0.43, 0.43, 0.43, 0.4)
BAND_RADIUS = 0.01


def palette_pixels():
    """RGBA floats for the image, bottom row first, as Blender stores them."""
    pixels = [0.0] * (SIZE * SIZE * 4)
    for y in range(SIZE):
        row = (SIZE - 1 - y) // CELL  # row 0 is the top of the image
        hue, sat = ROWS[row]
        for x in range(SIZE):
            col = x // CELL
            value = 0.18 + 0.78 * col / 7
            r, g, b = colorsys.hsv_to_rgb(hue, sat, value)
            i = (y * SIZE + x) * 4
            pixels[i:i + 4] = (r, g, b, 1.0)
    return pixels


def build(starter):
    import bmesh
    import bpy

    scene = starter.scene
    starter.remove_default_cube()

    image = bpy.data.images.new("palette", SIZE, SIZE, alpha=False)
    image.pixels.foreach_set(palette_pixels())
    image.pack()
    image.use_fake_user = True

    n = 12
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new("UVMap")
    rings = []
    for k, (z, r) in enumerate(zip(HEIGHTS, RADII)):
        # The bands stand a centimetre proud of the staves.
        r = r + (BAND_RADIUS if k in (1, 2, 3, 4) else 0.0)
        rings.append([bm.verts.new((r * math.cos(2 * math.pi * i / n), r * math.sin(2 * math.pi * i / n), z)) for i in range(n)])
    # Rings 1-2 and 3-4 bound the bands; each band's edges get their own ring of vertices so the
    # band can stand out: inner rings at the staves' radius.
    inner = []
    for k in (1, 2, 3, 4):
        z = HEIGHTS[k]
        inner.append([bm.verts.new((RADII[k] * math.cos(2 * math.pi * i / n), RADII[k] * math.sin(2 * math.pi * i / n), z)) for i in range(n)])
    # Column order up the side: stave, step out, band, step in, stave, step out, band, step in, stave.
    column = [rings[0], inner[0], rings[1], rings[2], inner[1], inner[2], rings[3], rings[4], inner[3], rings[5]]
    heights = [HEIGHTS[0], HEIGHTS[1], HEIGHTS[1], HEIGHTS[2], HEIGHTS[2], HEIGHTS[3], HEIGHTS[3], HEIGHTS[4], HEIGHTS[4], HEIGHTS[5]]
    for k in range(len(column) - 1):
        lower, upper = column[k], column[k + 1]
        for i in range(n):
            j = (i + 1) % n
            face = bm.faces.new((lower[i], lower[j], upper[j], upper[i]))
            v0 = 0.25 + 0.5 * (heights[k] / HEIGHTS[-1]) + 0.002 * k
            v1 = 0.25 + 0.5 * (heights[k + 1] / HEIGHTS[-1]) + 0.002 * (k + 1)
            for loop, (u, v) in zip(face.loops, ((i / n, v0), ((i + 1) / n, v0), ((i + 1) / n, v1), (i / n, v1))):
                loop[uv].uv = (u, v)
    bottom = bm.verts.new((0.0, 0.0, 0.0))
    top = bm.verts.new((0.0, 0.0, HEIGHTS[-1]))
    for i in range(n):
        j = (i + 1) % n
        for ring, centre, cu, flip in ((rings[0], bottom, 0.25, True), (rings[5], top, 0.75, False)):
            verts = (ring[j], ring[i], centre) if flip else (ring[i], ring[j], centre)
            face = bm.faces.new(verts)
            for loop in face.loops:
                x, y, _ = loop.vert.co
                loop[uv].uv = (cu + x * 0.25, 0.12 + y * 0.25) if flip else (cu + x * 0.25, 0.88 + y * 0.25)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    mesh = bpy.data.meshes.new("Barrel")
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new("Barrel", mesh)
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
