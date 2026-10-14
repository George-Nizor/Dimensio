"""Builds the course's example stool and the pictures the course app's dev bridge shows.

    blender -b --factory-startup --python desktop/scripts/sample-models.py -- \
        --reference desktop/public/reference/models/stool --dev desktop/src/course/dev

--reference gets stool.blend and four renders (persp, front, right, top) of the example model.
--dev gets the same four renders of a learner's first attempt (straight legs, a thicker seat whose
scale was never applied), front and right overlays in the style blender/dimensio_check.py draws
them (the attempt in grey, the example's outline in orange, missing areas tinted, extra areas
hatched), and report.json, the measurement report docs/course/PLAN.md describes, for that attempt.
`vite dev` and the e2e run use them in place of Blender. Everything here is drawn by Blender from
boxes this script makes, so it is ours to license: CC0.
"""

import json
import math
import os
import sys

import bmesh
import bpy
import numpy as np
from mathutils import Euler, Vector

WIDTH, HEIGHT = 640, 480
VIEWS = ("persp", "front", "right", "top")
WOOD = (0.80, 0.56, 0.34, 1.0)
OUTLINE = (0.933, 0.467, 0.322)  # Dimensio ember, #EE7752
ATTEMPT_FILL = (0.17, 0.17, 0.17, 0.82)


def arguments():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    out = {}
    for flag, value in zip(argv[::2], argv[1::2]):
        out[flag.lstrip("-")] = os.path.abspath(value)
    return out


def empty_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    scene.render.engine = "BLENDER_WORKBENCH"
    scene.render.resolution_x = WIDTH
    scene.render.resolution_y = HEIGHT
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    shading = scene.display.shading
    shading.light = "STUDIO"
    shading.color_type = "MATERIAL"
    shading.show_object_outline = True
    shading.object_outline_color = (0.1, 0.08, 0.06)
    shading.show_specular_highlight = False
    return scene


def material():
    mat = bpy.data.materials.get("Wood") or bpy.data.materials.new("Wood")
    mat.diffuse_color = WOOD
    return mat


def box(name, size, location, rotation=(0.0, 0.0, 0.0), top_origin=False, scale=None):
    """A box of the given size in metres. With top_origin the origin sits at the middle of the top
    face, so a leg leans from where it meets the seat. With scale the mesh is made 2 m wide and the
    object scaled down to size, the way a learner leaves it before applying the scale."""
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    sx, sy, sz = (2.0, 2.0, 2.0) if scale else size
    for v in bm.verts:
        v.co.x *= sx
        v.co.y *= sy
        v.co.z *= sz
        if top_origin:
            v.co.z -= sz / 2
    bm.to_mesh(mesh)
    bm.free()
    mesh.materials.append(material())
    obj = bpy.data.objects.new(name, mesh)
    obj.location = location
    obj.rotation_euler = Euler(rotation)
    if scale:
        obj.scale = scale
    bpy.context.scene.collection.objects.link(obj)
    return obj


def stool(lean_degrees, seat_thickness, seat_width, apply_seat_scale):
    """A seat on four legs. The front legs (towards -Y) lean forward and the back legs lean back."""
    seat_height = 0.47
    leg_length = seat_height - seat_thickness
    inset = 0.15
    parts = []
    seat_size = (seat_width, seat_width, seat_thickness)
    seat_location = (0.0, 0.0, seat_height - seat_thickness / 2)
    if apply_seat_scale:
        parts.append(box("Seat", seat_size, seat_location))
    else:
        parts.append(box("Seat", seat_size, seat_location, scale=(seat_width / 2, seat_width / 2, seat_thickness / 2)))
    lean = math.radians(lean_degrees)
    for name, x, y in (("Leg front left", -inset, -inset), ("Leg front right", inset, -inset), ("Leg back left", -inset, inset), ("Leg back right", inset, inset)):
        tilt = -lean if y < 0 else lean
        parts.append(box(name, (0.04, 0.04, leg_length), (x, y, leg_length), rotation=(tilt, 0.0, 0.0), top_origin=True))
    return parts


def camera(name, location, target, ortho_scale=None):
    data = bpy.data.cameras.new(name)
    if ortho_scale:
        data.type = "ORTHO"
        data.ortho_scale = ortho_scale
    else:
        data.lens = 50
    cam = bpy.data.objects.new(name, data)
    cam.location = location
    direction = Vector(target) - Vector(location)
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.collection.objects.link(cam)
    return cam


def cameras():
    centre = (0.0, 0.0, 0.235)
    return {
        "persp": camera("persp", (1.0, -1.2, 0.9), (0.0, 0.0, 0.2)),
        "front": camera("front", (0.0, -5.0, centre[2]), centre, 0.8),
        "right": camera("right", (5.0, 0.0, centre[2]), centre, 0.8),
        "top": camera("top", (0.0, 0.0, 5.0), (0.0, 0.0001, 0.0), 0.8),
    }


def render_views(folder, cams, prefix=""):
    os.makedirs(folder, exist_ok=True)
    scene = bpy.context.scene
    paths = {}
    for view in VIEWS:
        scene.camera = cams[view]
        path = os.path.join(folder, f"{prefix}{view}.png")
        scene.render.filepath = path
        bpy.ops.render.render(write_still=True)
        paths[view] = path
    return paths


def mask(path):
    image = bpy.data.images.load(path, check_existing=False)
    pixels = np.empty(image.size[0] * image.size[1] * 4, dtype=np.float32)
    image.pixels.foreach_get(pixels)
    alpha = pixels.reshape(image.size[1], image.size[0], 4)[:, :, 3] > 0.5
    bpy.data.images.remove(image)
    return alpha


def shifted(a, dy, dx):
    out = np.zeros_like(a)
    h, w = a.shape
    out[max(dy, 0):h + min(dy, 0), max(dx, 0):w + min(dx, 0)] = a[max(-dy, 0):h + min(-dy, 0), max(-dx, 0):w + min(-dx, 0)]
    return out


def outline(silhouette, width=2):
    inner = silhouette.copy()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        inner &= shifted(silhouette, dy, dx)
    edge = silhouette & ~inner
    for _ in range(width):
        grown = edge.copy()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            grown |= shifted(edge, dy, dx)
        edge = grown
    return edge


def overlay(attempt_png, reference_png, out_path):
    """The attempt's silhouette in grey with the example's outline drawn over it. Where the example
    has shape and the attempt has none, the area is tinted; where the attempt has shape the example
    lacks, it is hatched."""
    attempt = mask(attempt_png)
    reference = mask(reference_png)
    edge = outline(reference)
    h, w = attempt.shape
    rows, cols = np.mgrid[0:h, 0:w]
    hatch = ((rows + cols) // 5) % 2 == 0
    rgba = np.zeros((h, w, 4), dtype=np.float32)
    rgba[attempt] = ATTEMPT_FILL
    rgba[reference & ~attempt] = (*OUTLINE, 0.32)
    rgba[attempt & ~reference & hatch] = (0.05, 0.05, 0.05, 0.95)
    rgba[edge] = (*OUTLINE, 1.0)
    image = bpy.data.images.new(os.path.basename(out_path), w, h, alpha=True)
    image.pixels.foreach_set(rgba.ravel())
    image.filepath_raw = out_path
    image.file_format = "PNG"
    image.save()
    bpy.data.images.remove(image)
    inside = attempt | reference
    both = attempt & reference
    return round(float(both.sum()) / max(1, float(inside.sum())), 2)


def mesh_report(objects, file_name, renders, silhouette):
    """The measurement report for these objects, in the shape docs/course/PLAN.md gives."""
    rows = []
    for obj in objects:
        bm = bmesh.new()
        bm.from_mesh(obj.data)
        sizes = [len(f.verts) for f in bm.faces]
        rows.append({
            "name": obj.name, "type": "MESH",
            "verts": len(bm.verts), "edges": len(bm.edges), "faces": len(bm.faces),
            "tris": sum(n - 2 for n in sizes), "quads": sizes.count(4), "ngons": sum(1 for n in sizes if n > 4),
            "nonManifoldEdges": sum(1 for e in bm.edges if not e.is_manifold), "looseVerts": sum(1 for v in bm.verts if not v.link_edges),
            "looseEdges": sum(1 for e in bm.edges if not e.link_faces), "doubles": 0, "flippedFaces": 0,
            "scaleApplied": all(abs(s - 1.0) < 1e-6 for s in obj.scale),
            "rotationApplied": all(abs(r) < 1e-6 for r in obj.rotation_euler),
            "dimensions": [round(d, 4) for d in obj.dimensions], "modifiers": [], "materials": len(obj.data.materials),
            "uvLayers": len(obj.data.uv_layers), "shading": "flat",
        })
        bm.free()
    counts = ("verts", "edges", "faces", "tris", "quads", "ngons", "nonManifoldEdges", "looseVerts", "looseEdges", "doubles", "flippedFaces")
    totals = {"objects": len(rows), "meshes": len(rows)}
    totals.update({key: sum(r[key] for r in rows) for key in counts})
    totals["base"] = {key: totals[key] for key in counts}
    return {
        "format": 1,
        "blender": bpy.app.version_string.split(" ")[0],
        "file": f"C:/Users/you/Documents/Dimensio/Course/{file_name}",
        "units": {"system": "METRIC", "scaleLength": 1.0, "lengthUnit": "METERS"},
        "objects": rows,
        "totals": totals,
        "renders": renders,
        "silhouette": silhouette,
    }


def main():
    args = arguments()
    reference_dir = args.get("reference")
    dev_dir = args.get("dev")
    if not reference_dir or not dev_dir:
        raise SystemExit("usage: blender -b --factory-startup --python sample-models.py -- --reference <dir> --dev <dir>")

    # The example: square legs leaning out 8 degrees under a 40 cm seat.
    empty_scene()
    stool(lean_degrees=8, seat_thickness=0.04, seat_width=0.4, apply_seat_scale=True)
    os.makedirs(reference_dir, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(reference_dir, "stool.blend"), compress=True)
    cams = cameras()
    reference_renders = render_views(reference_dir, cams)

    # A first attempt: straight legs, a 6 cm seat a little too wide, its scale never applied.
    empty_scene()
    parts = stool(lean_degrees=0, seat_thickness=0.06, seat_width=0.44, apply_seat_scale=False)
    cams = cameras()
    attempt_renders = render_views(dev_dir, cams)
    silhouette = {}
    for view in ("front", "right"):
        name = f"{view}-overlay.png"
        match = overlay(attempt_renders[view], reference_renders[view], os.path.join(dev_dir, name))
        silhouette[view] = {"match": match, "overlay": name}
    report = mesh_report(parts, "stool.blend", {view: f"{view}.png" for view in VIEWS}, silhouette)
    with open(os.path.join(dev_dir, "report.json"), "w", encoding="utf-8", newline="\n") as handle:
        json.dump(report, handle, indent=2)
        handle.write("\n")


main()
