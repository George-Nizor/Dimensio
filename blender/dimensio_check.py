"""Measure a learner's .blend for Dimensio and render it.

    blender -b <model.blend> --python dimensio_check.py -- --out <dir>
        [--reference <file>] [--views front,right,top,persp] [--size 512]

Writes ``<dir>/report.json`` in the format docs/course/PLAN.md ("Measurement")
describes, plus the PNG renders it names. The learner's file is never saved:
everything happens in memory, and Blender quits when the script ends.

What the numbers mean
---------------------
Each mesh object is measured twice when it has modifiers. The top-level
counts are the evaluated mesh, with modifiers, the way Blender's Statistics
overlay shows it in Object Mode and the way an export sees it. ``base`` holds
the same counts for the mesh as modelled, before modifiers, which is what
matters for n-gons under a Subdivision Surface modifier. ``totals`` sums the
evaluated counts over the model, and ``totals.base`` sums the base counts.

- tris: triangles after triangulation, the sum of (corners - 2) per face.
- quads, ngons: faces with four corners, and with more than four.
- nonManifoldEdges: the edges Select > Select All by Trait > Non Manifold
  selects with its default options: wire edges (no face), boundary edges
  (one face), edges shared by three or more faces, and edges between two
  faces whose normals point opposite ways.
- looseVerts, looseEdges: vertices without an edge, edges without a face.
- doubles: the vertices Merge by Distance at 0.0001 m would remove
  (``bmesh.ops.find_doubles``, the same search, in object space).
- flippedFaces: faces whose normal points the wrong way. Faces are grouped
  into surfaces joined by edges that have exactly two faces. On a closed
  surface it is the number of faces Mesh > Normals > Recalculate Outside
  would flip, so an inside-out cube counts all six. On an open surface,
  where outside is not defined, it is the smaller side of any disagreement
  between neighbouring faces, so a plane facing down counts nothing.
- shading: "flat", "smooth" or "mixed", read from the evaluated mesh. An
  edge between two faces shades smooth when both faces are smooth and the
  edge is not sharp, so the Smooth by Angle modifier (Shade Auto Smooth in
  4.1 and later) is accounted for: a cube with it reads as flat, a cylinder
  as mixed. ``smoothByAngle`` says whether that modifier is on the object.

The model is every object visible in the viewport, enabled for renders and
drawn as solid. Other objects are listed with ``excluded`` and left out of
the totals and renders. Objects in a collection a starter scene marked as
reference (custom property ``dimensio_reference``) are not listed at all.

Silhouettes
-----------
With ``--reference``, the reference is imported into a scene of its own. For
each orthographic view, both models are rendered as flat masks with the same
camera scale, aligned on the centre of their bounding boxes in X and Y and on
their lowest point in Z, so size counts. ``match`` is the intersection over
union of the two masks.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import sys
import time
import traceback

import bmesh
import bpy
import numpy as np
from mathutils import Matrix, Vector

sys.dont_write_bytecode = True  # the toolkit folder may be read-only once installed
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dimensio_common import (  # noqa: E402
    GEOMETRY_TYPES,
    DimensioError,
    blender_version,
    exclusion,
    forward_slashes,
    import_reference,
    marked_objects,
    script_args,
)

FORMAT = 1
RESULT_PREFIX = "DIMENSIO_CHECK="
DOUBLE_DISTANCE = 0.0001
ORTHO_VIEWS = ("front", "right", "top")
ALL_VIEWS = ("front", "right", "top", "persp")
MARGIN = 0.08  # fraction of the frame left empty on each side
PERSP_LENS = 50.0
PERSP_AZIMUTH = math.radians(35.0)  # from the front, turning toward the right
PERSP_ELEVATION = math.radians(24.0)

# Colours are sRGB values for 8-bit PNGs.
OUTLINE = (0.16, 0.17, 0.19)
FILL_GREY = (0.62, 0.63, 0.65)
EXTRA_GREY = (0.47, 0.48, 0.50)
REFERENCE_LINE = (1.0, 0.37, 0.12)
MISSING_ALPHA = 0.38

# View name -> (direction the camera looks, camera up).
VIEW_AXES = {
    "front": (Vector((0.0, 1.0, 0.0)), Vector((0.0, 0.0, 1.0))),
    "right": (Vector((-1.0, 0.0, 0.0)), Vector((0.0, 0.0, 1.0))),
    "top": (Vector((0.0, 0.0, -1.0)), Vector((0.0, 1.0, 0.0))),
    "persp": (
        -Vector((
            math.sin(PERSP_AZIMUTH) * math.cos(PERSP_ELEVATION),
            -math.cos(PERSP_AZIMUTH) * math.cos(PERSP_ELEVATION),
            math.sin(PERSP_ELEVATION),
        )),
        Vector((0.0, 0.0, 1.0)),
    ),
}


class ArgumentError(DimensioError):
    pass


class Parser(argparse.ArgumentParser):
    def error(self, message):  # argparse would print usage and exit(2)
        raise ArgumentError(f"dimensio_check.py: {message}")


def parse_args(argv):
    parser = Parser(prog="dimensio_check.py", add_help=False)
    parser.add_argument("--out", required=True)
    parser.add_argument("--reference")
    parser.add_argument("--views", default=",".join(ALL_VIEWS))
    parser.add_argument("--size", type=int, default=512)
    args = parser.parse_args(argv)
    views = []
    for name in (part.strip().lower() for part in args.views.split(",")):
        if not name:
            continue
        if name not in ALL_VIEWS:
            raise ArgumentError(f"Unknown view {name!r}. Use any of {', '.join(ALL_VIEWS)}.")
        if name not in views:
            views.append(name)
    if not views:
        raise ArgumentError("--views names no view.")
    if not 64 <= args.size <= 2048:
        raise ArgumentError("--size must be between 64 and 2048 pixels.")
    args.views = views
    return args


# --------------------------------------------------------------------- metrics


def _ints(collection, attribute, count, width=1):
    out = np.empty(count * width, dtype=np.int64)
    if count:
        buffer = np.empty(count * width, dtype=np.int32)
        collection.foreach_get(attribute, buffer)
        out[:] = buffer
    return out.reshape(-1, width) if width > 1 else out


def _bool_attribute(mesh, name, domain, count):
    values = np.zeros(count, dtype=bool)
    attribute = mesh.attributes.get(name)
    if count and attribute is not None and attribute.domain == domain and attribute.data_type == "BOOLEAN":
        attribute.data.foreach_get("value", values)
    return values


def _face_normals(mesh):
    normals = np.zeros(len(mesh.polygons) * 3, dtype=np.float32)
    if len(normals):
        mesh.polygon_normals.foreach_get("vector", normals)
    return normals.reshape(-1, 3)


def _islands(face_count, first, second):
    """Label faces joined through the given face pairs (union-find in numpy)."""
    parent = np.arange(face_count)
    if not len(first):
        return parent
    while True:
        a = parent[first]
        b = parent[second]
        differ = a != b
        if not differ.any():
            return parent
        low = np.minimum(a[differ], b[differ])
        high = np.maximum(a[differ], b[differ])
        np.minimum.at(parent, high, low)
        while True:
            jumped = parent[parent]
            if np.array_equal(jumped, parent):
                break
            parent = jumped


def _flipped_and_doubles(mesh, edge_faces, first, second, loop_edge, loop_face):
    """Count flipped faces and Merge by Distance doubles with one BMesh."""
    face_count = len(mesh.polygons)
    bm = bmesh.new()
    try:
        bm.from_mesh(mesh)
        doubles = 0
        if len(bm.verts):
            doubles = len(bmesh.ops.find_doubles(bm, verts=bm.verts[:], dist=DOUBLE_DISTANCE)["targetmap"])
        if not face_count:
            return 0, doubles
        before = _face_normals(mesh)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
        scratch = bpy.data.meshes.new("dimensio-normals")
        try:
            bm.to_mesh(scratch)
            after = _face_normals(scratch)
        finally:
            bpy.data.meshes.remove(scratch)
    finally:
        bm.free()
    changed = (before * after).sum(axis=1) < 0.0
    labels = _islands(face_count, first, second)
    open_face = np.zeros(face_count, dtype=bool)
    open_face[loop_face[edge_faces[loop_edge] != 2]] = True
    size = np.bincount(labels, minlength=face_count)
    flipped = np.bincount(labels, weights=changed.astype(np.float64), minlength=face_count)
    is_open = np.bincount(labels, weights=open_face.astype(np.float64), minlength=face_count) > 0
    roots = size > 0
    closed_total = flipped[roots & ~is_open].sum()
    open_total = np.minimum(flipped, size - flipped)[roots & is_open].sum()
    return int(round(closed_total + open_total)), doubles


def mesh_metrics(mesh):
    """Topology counts for one mesh datablock. See the module docstring."""
    vert_count, edge_count, face_count = len(mesh.vertices), len(mesh.edges), len(mesh.polygons)
    corners = _ints(mesh.polygons, "loop_total", face_count)
    loop_edge = _ints(mesh.loops, "edge_index", len(mesh.loops))
    loop_vert = _ints(mesh.loops, "vertex_index", len(mesh.loops))
    edge_verts = _ints(mesh.edges, "vertices", edge_count, 2)
    loop_face = np.repeat(np.arange(face_count), corners)

    edge_faces = np.bincount(loop_edge, minlength=edge_count)
    direction = np.where(loop_vert == edge_verts[loop_edge, 0], 1, -1) if len(loop_edge) else loop_edge
    direction_sum = np.bincount(loop_edge, weights=direction, minlength=edge_count)
    wire = edge_faces == 0
    non_contiguous = (edge_faces == 2) & (direction_sum != 0)
    non_manifold = wire | (edge_faces == 1) | (edge_faces > 2) | non_contiguous
    vert_edges = np.bincount(edge_verts.ravel(), minlength=vert_count)

    # The two faces of every edge that has exactly two.
    order = np.argsort(loop_edge, kind="stable")
    starts = np.concatenate(([0], np.cumsum(edge_faces)[:-1])) if edge_count else edge_faces
    pair_edges = np.nonzero(edge_faces == 2)[0]
    first = loop_face[order[starts[pair_edges]]]
    second = loop_face[order[starts[pair_edges] + 1]]

    flipped, doubles = _flipped_and_doubles(mesh, edge_faces, first, second, loop_edge, loop_face)

    sharp_face = _bool_attribute(mesh, "sharp_face", "FACE", face_count)
    sharp_edge = _bool_attribute(mesh, "sharp_edge", "EDGE", edge_count)
    if len(pair_edges):
        smooth = ~sharp_edge[pair_edges] & ~sharp_face[first] & ~sharp_face[second]
    else:
        smooth = ~sharp_face
    if not len(smooth):
        shading = None
    elif smooth.all():
        shading = "smooth"
    elif not smooth.any():
        shading = "flat"
    else:
        shading = "mixed"

    return {
        "verts": vert_count,
        "edges": edge_count,
        "faces": face_count,
        "tris": int((corners - 2).sum()) if face_count else 0,
        "quads": int((corners == 4).sum()),
        "ngons": int((corners > 4).sum()),
        "nonManifoldEdges": int(non_manifold.sum()),
        "looseVerts": int((vert_edges == 0).sum()),
        "looseEdges": int(wire.sum()),
        "doubles": int(doubles),
        "flippedFaces": int(flipped),
    }, shading


COUNT_KEYS = (
    "verts", "edges", "faces", "tris", "quads", "ngons",
    "nonManifoldEdges", "looseVerts", "looseEdges", "doubles", "flippedFaces",
)


def _smooth_by_angle(obj):
    for modifier in obj.modifiers:
        group = getattr(modifier, "node_group", None)
        if modifier.type == "NODES" and group is not None:
            name = group.name.lower()
            if name.startswith("smooth by angle") or name.startswith("auto smooth"):
                return True
    return False


def _rounded(values, places=6):
    return [round(float(value), places) for value in values]


def measure_mesh(obj, depsgraph):
    evaluated = obj.evaluated_get(depsgraph)
    mesh = evaluated.to_mesh()
    try:
        counts, shading = mesh_metrics(mesh)
    finally:
        evaluated.to_mesh_clear()

    _, rotation, scale = obj.matrix_basis.decompose()
    entry = {"name": obj.name, "type": obj.type}
    entry.update(counts)
    entry.update({
        "scaleApplied": all(abs(value - 1.0) < 1e-5 for value in scale),
        "rotationApplied": 2.0 * math.acos(min(1.0, abs(rotation.w))) < 1e-5,
        "dimensions": _rounded(evaluated.dimensions),
        "modifiers": [modifier.type for modifier in obj.modifiers],
        "materials": len({slot.material.name for slot in obj.material_slots if slot.material}),
        "uvLayers": len(obj.data.uv_layers),
        "shading": shading,
        "smoothByAngle": _smooth_by_angle(obj),
    })
    if any(modifier.show_viewport for modifier in obj.modifiers):
        entry["base"] = mesh_metrics(obj.data)[0]
    return entry


def measure_scene(scene, view_layer):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    marked = marked_objects()
    objects, model = [], []
    totals = {key: 0 for key in COUNT_KEYS}
    base_totals = {key: 0 for key in COUNT_KEYS}
    meshes = 0
    for obj in sorted(scene.objects, key=lambda item: item.name):
        reason = exclusion(obj, view_layer, marked)
        if reason == "reference":
            continue
        if reason is None:
            model.append(obj)
        if obj.type != "MESH":
            objects.append({"name": obj.name, "type": obj.type})
            continue
        if reason is not None:
            objects.append({"name": obj.name, "type": obj.type, "excluded": reason})
            continue
        try:
            entry = measure_mesh(obj, depsgraph)
        except Exception as exc:  # one odd mesh should not lose the whole report
            objects.append({"name": obj.name, "type": obj.type, "error": str(exc)})
            continue
        objects.append(entry)
        meshes += 1
        for key in COUNT_KEYS:
            totals[key] += entry[key]
            base_totals[key] += entry.get("base", entry)[key]
    summary = {"objects": len(objects), "meshes": meshes}
    summary.update(totals)
    summary["base"] = base_totals
    return objects, summary, model


# --------------------------------------------------------------------- scenes


def configure_render(scene, size):
    scene.render.engine = "BLENDER_WORKBENCH"
    scene.render.film_transparent = True
    scene.render.resolution_x = size
    scene.render.resolution_y = size
    scene.render.resolution_percentage = 100
    scene.render.pixel_aspect_x = 1.0
    scene.render.pixel_aspect_y = 1.0
    scene.render.use_border = False
    scene.render.use_compositing = False
    scene.render.use_sequencer = False
    scene.render.use_stamp = False
    settings = scene.render.image_settings
    settings.file_format = "PNG"
    settings.color_mode = "RGBA"
    settings.color_depth = "8"
    settings.compression = 15
    try:
        scene.display_settings.display_device = "sRGB"
    except TypeError:
        pass
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "None"
    scene.view_settings.exposure = 0.0
    scene.view_settings.gamma = 1.0
    shading = scene.display.shading
    shading.show_xray = False
    shading.show_shadows = False
    shading.show_backface_culling = False


def style_studio(scene):
    shading = scene.display.shading
    shading.light = "STUDIO"
    try:
        shading.studio_light = "studio.sl"
    except TypeError:
        pass  # the built-in default light is fine
    shading.color_type = "TEXTURE"
    shading.show_object_outline = True
    shading.object_outline_color = OUTLINE
    shading.show_cavity = True
    shading.cavity_type = "WORLD"
    shading.show_specular_highlight = False
    scene.display.render_aa = "16"


def style_mask(scene):
    shading = scene.display.shading
    shading.light = "FLAT"
    shading.color_type = "SINGLE"
    shading.single_color = (1.0, 1.0, 1.0)
    shading.show_object_outline = False
    shading.show_cavity = False
    shading.show_specular_highlight = False
    scene.display.render_aa = "8"


def new_scene(name, size, frame):
    scene = bpy.data.scenes.new(name)
    scene.frame_current = frame
    configure_render(scene, size)
    camera = bpy.data.objects.new(f"{name} camera", bpy.data.cameras.new(f"{name} camera"))
    scene.collection.objects.link(camera)
    scene.camera = camera
    return scene


def sync_viewport_colours(objects):
    """Show Base Color in the Workbench render where no viewport colour is set.

    Blender's Solid view uses a material's Viewport Display colour, which
    stays grey unless someone sets it. Learners colour low-poly models with
    the Principled BSDF's Base Color, so that is copied over in memory.
    """
    for obj in objects:
        for slot in getattr(obj, "material_slots", []):
            material = slot.material
            if not material or not material.node_tree:
                continue
            if any(abs(value - 0.8) > 1e-4 for value in material.diffuse_color[:3]):
                continue
            node = next((n for n in material.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
            if node is None:
                continue
            base = node.inputs[0]
            if base.is_linked:
                continue
            material.diffuse_color = tuple(base.default_value[:3]) + (1.0,)


def in_scene(scene, action):
    """Call ``action(depsgraph)`` with ``scene`` as the window's scene."""
    window = bpy.context.window
    previous = window.scene if window else None
    if window:
        window.scene = scene
    try:
        if window:
            depsgraph = bpy.context.evaluated_depsgraph_get()
        else:
            depsgraph = scene.view_layers[0].depsgraph
            depsgraph.update()
        return action(depsgraph)
    finally:
        if window and previous:
            window.scene = previous


def evaluated_bounds(scene):
    """World-space bounds of everything that draws in ``scene``."""
    return in_scene(scene, _bounds)


MAX_FIT_POINTS = 60000


def _bounds(depsgraph):
    """Bounds and a sample of world-space vertices of everything drawn."""
    low = np.full(3, np.inf)
    high = np.full(3, -np.inf)
    samples = []
    cache = {}
    for instance in depsgraph.object_instances:
        obj = instance.object
        if obj.type not in GEOMETRY_TYPES:
            continue
        key = (obj.original.name, obj.type)
        coords = cache.get(key)
        if coords is None:
            coords = _local_coords(obj)
            cache[key] = coords
        if not len(coords):
            continue
        matrix = np.array(instance.matrix_world, dtype=np.float64)
        world = coords @ matrix[:3, :3].T + matrix[:3, 3]
        low = np.minimum(low, world.min(axis=0))
        high = np.maximum(high, world.max(axis=0))
        samples.append(world)
    if not np.all(np.isfinite(low)):
        return None
    points = np.concatenate(samples)
    if len(points) > MAX_FIT_POINTS:
        points = points[:: len(points) // MAX_FIT_POINTS + 1]
    return low, high, points


def _local_coords(obj):
    try:
        mesh = obj.to_mesh()
    except RuntimeError:
        mesh = None
    try:
        if mesh is None or not len(mesh.vertices):
            return np.array([corner[:] for corner in obj.bound_box], dtype=np.float64) if mesh is None else np.zeros((0, 3))
        coords = np.empty(len(mesh.vertices) * 3, dtype=np.float32)
        mesh.vertices.foreach_get("co", coords)
        return coords.reshape(-1, 3).astype(np.float64)
    finally:
        if mesh is not None:
            obj.to_mesh_clear()


# --------------------------------------------------------------------- cameras


def _basis(view):
    forward, up = VIEW_AXES[view]
    forward = forward.normalized()
    right = forward.cross(up).normalized()
    up = right.cross(forward).normalized()
    return forward, right, up


def _corners(low, high):
    return [Vector((x, y, z)) for x in (low[0], high[0]) for y in (low[1], high[1]) for z in (low[2], high[2])]


def _persp_distance(points, centre, forward, right, up, half_tan):
    """Distance and lens shift that fit ``points`` inside the margin, centred.

    Binary search on the camera's distance from ``centre`` along the view
    direction; the projected points are then centred with the lens shift,
    which moves the frame without changing the perspective.
    """
    relative = points - np.array(centre)
    across = relative @ np.array(right)
    upward = relative @ np.array(up)
    along = relative @ np.array(forward)
    scale = 2.0 * half_tan
    target = 1.0 - 2.0 * MARGIN

    def extents(distance):
        depth = distance + along
        x = across / depth / scale
        y = upward / depth / scale
        return x.min(), x.max(), y.min(), y.max()

    def width(distance):
        x0, x1, y0, y1 = extents(distance)
        return max(x1 - x0, y1 - y0)

    near = float((-along).max()) + 1e-6
    reach = float(np.sqrt((relative ** 2).sum(axis=1)).max()) or 1e-3
    far = near + reach / half_tan * 4.0 + 1e-3
    while width(far) > target:
        far *= 2.0
    low = near
    for _ in range(60):
        middle = (low + far) / 2.0
        if width(middle) > target:
            low = middle
        else:
            far = middle
    x0, x1, y0, y1 = extents(far)
    return far, (x0 + x1) / 2.0, (y0 + y1) / 2.0, float((far + along).min())


def frame_camera(scene, view, bounds):
    """Point the scene's camera at the model from ``view``.

    Orthographic views centre the bounding box and scale to its larger side.
    The perspective view fits the model's own vertices, so empty corners of
    the bounding box do not push the model off centre.
    """
    low, high, points = bounds
    camera = scene.camera
    forward, right, up = _basis(view)
    centre = Vector(((low[0] + high[0]) / 2, (low[1] + high[1]) / 2, (low[2] + high[2]) / 2))
    radius = max((Vector(high) - Vector(low)).length / 2, 1e-3)
    rotation = Matrix((right, up, -forward)).transposed().to_4x4()
    data = camera.data
    data.shift_x = 0.0
    data.shift_y = 0.0
    if view == "persp":
        data.type = "PERSP"
        data.lens = PERSP_LENS
        data.sensor_fit = "AUTO"
        half_tan = data.sensor_width / 2.0 / data.lens
        distance, shift_x, shift_y, nearest = _persp_distance(points, centre, forward, right, up, half_tan)
        data.shift_x = shift_x
        data.shift_y = shift_y
        data.clip_start = max(nearest * 0.5, 1e-3)
    else:
        data.type = "ORTHO"
        corners = _corners(low, high)
        extent = max(max(abs((p - centre).dot(axis)) for p in corners) for axis in (right, up)) * 2
        data.ortho_scale = max(extent, 1e-3) / (1.0 - 2.0 * MARGIN)
        distance = radius + 1.0
        data.clip_start = 1e-3
    data.clip_end = distance + radius * 2 + 1.0
    camera.matrix_world = Matrix.Translation(centre - forward * distance) @ rotation


# --------------------------------------------------------------------- images


def render_to(scene, path):
    def render(_depsgraph):
        bpy.ops.render.render(write_still=False, scene=scene.name)
        result = next(image for image in bpy.data.images if image.type == "RENDER_RESULT")
        result.save_render(filepath=path, scene=scene)

    in_scene(scene, render)
    if not os.path.isfile(path):
        raise DimensioError(f"Blender did not write {os.path.basename(path)}.")


def read_png(path):
    image = bpy.data.images.load(path, check_existing=False)
    try:
        width, height = image.size
        pixels = np.empty(width * height * 4, dtype=np.float32)
        image.pixels.foreach_get(pixels)
        return pixels.reshape(height, width, 4)
    finally:
        bpy.data.images.remove(image)


def write_png(path, rgba):
    height, width, _ = rgba.shape
    image = bpy.data.images.new("dimensio-output", width, height, alpha=True)
    try:
        image.pixels.foreach_set(np.ascontiguousarray(np.clip(rgba, 0.0, 1.0), dtype=np.float32).ravel())
        image.filepath_raw = path
        image.file_format = "PNG"
        image.save()
    finally:
        bpy.data.images.remove(image)


def _filter(alpha, combine, radius=1):
    padded = np.pad(alpha, radius, mode="constant", constant_values=0.0)
    height, width = alpha.shape
    out = alpha.copy()
    for dy in range(-radius, radius + 1):
        for dx in range(-radius, radius + 1):
            out = combine(out, padded[radius + dy:radius + dy + height, radius + dx:radius + dx + width])
    return out


def outline_band(alpha, outside=1, inside=1):
    """A soft line along the edge of ``alpha``, ``outside + inside`` pixels wide."""
    grown = _filter(alpha, np.maximum, outside)
    shrunk = _filter(alpha, np.minimum, inside)
    return grown, np.clip(grown - shrunk, 0.0, 1.0)


def add_outline(path):
    """Draw a dark line around the silhouette so light models read on light pages."""
    pixels = read_png(path)
    alpha = pixels[..., 3]
    grown, line = outline_band(alpha)
    line = line[..., None]
    rgb = pixels[..., :3] * (1 - line) + np.array(OUTLINE) * line
    write_png(path, np.concatenate([rgb, grown[..., None]], axis=2))


def _over(top_rgb, top_alpha, rgb, alpha):
    """Straight-alpha "over": paint ``top`` onto ``rgb``/``alpha``."""
    top_alpha = top_alpha[..., None]
    alpha = alpha[..., None]
    out_alpha = top_alpha + alpha * (1 - top_alpha)
    blended = top_rgb * top_alpha + rgb * alpha * (1 - top_alpha)
    out_rgb = np.divide(blended, out_alpha, out=np.zeros_like(blended), where=out_alpha > 0)
    return out_rgb, out_alpha[..., 0]


def overlay(model_alpha, reference_alpha):
    """The learner's silhouette in grey with the reference outline over it.

    Where the reference covers ground the learner's model does not, it is
    tinted in the outline colour. Where the learner's model goes beyond the
    reference, the grey is hatched.
    """
    soft = np.clip(model_alpha, 0.0, 1.0)
    reference_soft = np.clip(reference_alpha, 0.0, 1.0)
    learner = soft > 0.5
    reference = reference_soft > 0.5
    height, width = soft.shape

    rgb = np.zeros((height, width, 3), dtype=np.float32)
    alpha = np.zeros((height, width), dtype=np.float32)
    missing = reference & ~learner
    rgb[missing] = REFERENCE_LINE
    alpha[missing] = MISSING_ALPHA

    fill = np.empty((height, width, 3), dtype=np.float32)
    fill[:] = FILL_GREY
    yy, xx = np.mgrid[0:height, 0:width]
    hatch = (((xx + yy) // 4) % 2 == 0) & ~reference
    fill[hatch] = EXTRA_GREY
    rgb, alpha = _over(fill, soft, rgb, alpha)

    outline = np.empty((height, width, 3), dtype=np.float32)
    outline[:] = OUTLINE
    _, learner_line = outline_band(soft)
    rgb, alpha = _over(outline, learner_line * 0.85, rgb, alpha)

    line_colour = np.empty((height, width, 3), dtype=np.float32)
    line_colour[:] = REFERENCE_LINE
    _, reference_line = outline_band(reference_soft, outside=2, inside=1)
    rgb, alpha = _over(line_colour, reference_line, rgb, alpha)
    return np.concatenate([rgb, alpha[..., None]], axis=2)


def iou(model_alpha, reference_alpha):
    learner = model_alpha > 0.5
    reference = reference_alpha > 0.5
    union = np.count_nonzero(learner | reference)
    if not union:
        return None
    return round(np.count_nonzero(learner & reference) / union, 4)


# --------------------------------------------------------------------- run


def link_all(scene, objects):
    for obj in objects:
        if obj.name not in scene.collection.objects:
            scene.collection.objects.link(obj)


def run(args, report):
    started = time.perf_counter()
    if not bpy.data.filepath:
        raise DimensioError("Blender did not open a .blend file to measure.")
    out = os.path.abspath(args.out)
    os.makedirs(out, exist_ok=True)

    source = bpy.context.scene
    view_layer = bpy.context.view_layer
    if bpy.context.object is not None and bpy.context.object.mode != "OBJECT":
        try:
            bpy.ops.object.mode_set(mode="OBJECT")
        except RuntimeError:
            pass

    units = source.unit_settings
    report["units"] = {"system": units.system, "scaleLength": round(units.scale_length, 6), "lengthUnit": units.length_unit}
    objects, totals, model = measure_scene(source, view_layer)
    report["objects"] = objects
    report["totals"] = totals
    measured = time.perf_counter()

    model_scene = new_scene("Dimensio model", args.size, source.frame_current)
    link_all(model_scene, model)
    sync_viewport_colours(model)
    model_bounds = evaluated_bounds(model_scene)
    if model_bounds is not None:
        low, high, _ = model_bounds
        report["bounds"] = {"min": _rounded(low), "max": _rounded(high), "size": _rounded(high - low)}

    reference_scene = None
    reference_bounds = None
    offset = np.zeros(3)
    if args.reference:
        reference_scene = new_scene("Dimensio reference", args.size, source.frame_current)
        try:
            import_reference(args.reference, reference_scene, reference_scene.collection)
        except DimensioError:
            raise
        except Exception as exc:
            raise DimensioError(f"Blender could not import the reference: {exc}") from exc
        configure_render(reference_scene, args.size)  # importers may change scene settings
        reference_bounds = evaluated_bounds(reference_scene)
        if reference_bounds is None:
            raise DimensioError("The reference has nothing to compare against: no visible geometry.")
        ref_low, ref_high, _ = reference_bounds
        report["reference"] = {
            "file": forward_slashes(os.path.abspath(args.reference)),
            "size": _rounded(ref_high - ref_low),
        }
        if model_bounds is not None:
            low, high, _ = model_bounds
            offset = np.array([
                (low[0] + high[0]) / 2 - (ref_low[0] + ref_high[0]) / 2,
                (low[1] + high[1]) / 2 - (ref_low[1] + ref_high[1]) / 2,
                low[2] - ref_low[2],
            ])

    renders = {}
    silhouettes = {}
    timings = {}
    if model_bounds is None and reference_bounds is None:
        report["renders"] = renders
        report["warnings"] = ["Nothing was rendered: the scene has no visible solid geometry."]
        if args.reference:
            report["silhouette"] = silhouettes
        report["timing"] = {"measure": round(measured - started, 3), "total": round(time.perf_counter() - started, 3)}
        return 0

    # Ortho views frame the model and the aligned reference together, so the
    # renders and overlays share one scale.
    boxes = []
    if model_bounds is not None:
        boxes.append(model_bounds[:2])
    if reference_bounds is not None:
        boxes.append((reference_bounds[0] + offset, reference_bounds[1] + offset))
    ortho_low = np.min([box[0] for box in boxes], axis=0)
    ortho_high = np.max([box[1] for box in boxes], axis=0)

    for view in args.views:
        view_started = time.perf_counter()
        if view in ORTHO_VIEWS:
            frame_camera(model_scene, view, (ortho_low, ortho_high, None))
        elif model_bounds is not None:
            frame_camera(model_scene, view, model_bounds)
        if model_bounds is not None:
            style_studio(model_scene)
            path = os.path.join(out, f"{view}.png")
            render_to(model_scene, path)
            add_outline(path)
            renders[view] = f"{view}.png"
        if reference_scene is not None and view in ORTHO_VIEWS:
            reference_scene.camera.data.type = model_scene.camera.data.type
            reference_scene.camera.data.ortho_scale = model_scene.camera.data.ortho_scale
            reference_scene.camera.data.clip_start = model_scene.camera.data.clip_start
            reference_scene.camera.data.clip_end = model_scene.camera.data.clip_end + float(np.linalg.norm(offset)) * 2
            reference_scene.camera.matrix_world = (
                Matrix.Translation(Vector(-offset)) @ model_scene.camera.matrix_world
            )
            model_mask = os.path.join(out, f".{view}-model-mask.png")
            reference_mask = os.path.join(out, f".{view}-reference-mask.png")
            try:
                if model_bounds is not None:
                    style_mask(model_scene)
                    render_to(model_scene, model_mask)
                    model_alpha = read_png(model_mask)[..., 3]
                else:
                    model_alpha = np.zeros((args.size, args.size), dtype=np.float32)
                style_mask(reference_scene)
                render_to(reference_scene, reference_mask)
                reference_alpha = read_png(reference_mask)[..., 3]
            finally:
                for path in (model_mask, reference_mask):
                    if os.path.exists(path):
                        os.remove(path)
            write_png(os.path.join(out, f"{view}-overlay.png"), overlay(model_alpha, reference_alpha))
            silhouettes[view] = {"match": iou(model_alpha, reference_alpha), "overlay": f"{view}-overlay.png"}
        timings[view] = round(time.perf_counter() - view_started, 3)

    report["renders"] = renders
    if args.reference:
        report["silhouette"] = silhouettes
    report["timing"] = {
        "measure": round(measured - started, 3),
        "views": timings,
        "total": round(time.perf_counter() - started, 3),
    }
    return 0


def write_report(out, report):
    path = os.path.join(out, "report.json")
    temporary = path + ".tmp"
    with open(temporary, "w", encoding="utf-8") as handle:
        json.dump(report, handle, indent=2)
        handle.write("\n")
    os.replace(temporary, path)
    return path


def main():
    report = {
        "format": FORMAT,
        "blender": blender_version(),
        "file": forward_slashes(bpy.data.filepath),
    }
    out = None
    code = 0
    try:
        args = parse_args(script_args())
        out = os.path.abspath(args.out)
        code = run(args, report)
    except DimensioError as exc:
        report = {"format": FORMAT, "error": str(exc), "blender": report["blender"], "file": report["file"]}
        code = 2
    except Exception as exc:  # anything unexpected still ends in a report
        traceback.print_exc()
        report = {
            "format": FORMAT,
            "error": f"The check failed inside Blender: {type(exc).__name__}: {exc}",
            "blender": report["blender"],
            "file": report["file"],
        }
        code = 1
    if out:
        try:
            os.makedirs(out, exist_ok=True)
            write_report(out, report)
        except OSError as exc:
            report = {"format": FORMAT, "error": f"The report could not be written: {exc}",
                      "blender": report["blender"], "file": report["file"]}
            code = code or 2
    print(RESULT_PREFIX + json.dumps(report, separators=(",", ":")), flush=True)
    return code


if __name__ == "__main__":
    raise SystemExit(main())
