"""Helpers shared by Dimensio's Blender scripts.

``dimensio_check.py`` and ``dimensio_starter.py`` both import a reference model
and both need to know which objects make up "the model" in a scene. Those two
pieces live here so the starter scenes and the measurement agree.

Runs inside Blender's bundled Python (bpy and numpy are available).
"""

from __future__ import annotations

import os
import shutil
import sys
import tempfile

import bpy

# A collection carrying this custom property holds reference material (a model
# to copy, reference image empties). Its objects are never measured or
# rendered as the learner's model.
REFERENCE_MARK = "dimensio_reference"

# Object types that draw a surface in a Workbench render.
GEOMETRY_TYPES = frozenset({"MESH", "CURVE", "SURFACE", "META", "FONT"})

REFERENCE_SUFFIXES = (".glb", ".gltf", ".fbx", ".obj", ".blend")


class DimensioError(Exception):
    """A failure with a message that can be shown to the learner as it is."""


def script_args() -> list[str]:
    """Arguments after Blender's ``--`` separator."""
    return sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []


def blender_version() -> str:
    return ".".join(str(part) for part in bpy.app.version)


def forward_slashes(path: str) -> str:
    return path.replace("\\", "/")


def marked_objects() -> set:
    """Every object inside a collection marked as reference material."""
    found = set()
    for collection in bpy.data.collections:
        if collection.get(REFERENCE_MARK):
            found.update(collection.all_objects)
    return found


def exclusion(obj, view_layer, marked: set) -> str | None:
    """Why an object is not part of the learner's model, or None if it is.

    The model is what the learner sees and renders: objects visible in the
    viewport, enabled for renders, and drawn as solid geometry. A boolean
    cutter shown as wire or bounds, a hidden helper, and the reference
    collection a starter scene made are all left out.
    """
    if obj in marked:
        return "reference"
    try:
        visible = obj.visible_get(view_layer=view_layer)
    except (RuntimeError, TypeError):
        visible = False
    if not visible or obj.hide_render:
        return "hidden"
    if obj.type in GEOMETRY_TYPES and obj.display_type in {"WIRE", "BOUNDS"}:
        return obj.display_type.lower()
    return None


def model_objects(scene, view_layer=None) -> list:
    """Objects in ``scene`` that make up the model, sorted by name."""
    view_layer = view_layer or scene.view_layers[0]
    marked = marked_objects()
    return sorted(
        (obj for obj in scene.objects if exclusion(obj, view_layer, marked) is None),
        key=lambda obj: obj.name,
    )


def _with_scene(scene, collection, action):
    """Run ``action`` with ``scene`` active and ``collection`` as the target.

    Importers add objects to the active collection of the context's view
    layer, so both are switched for the duration and restored afterwards.
    """
    window = bpy.context.window
    previous_scene = window.scene if window else None
    view_layer = scene.view_layers[0]
    previous_collection = view_layer.active_layer_collection

    def find_layer(layer):
        if layer.collection == collection:
            return layer
        for child in layer.children:
            hit = find_layer(child)
            if hit:
                return hit
        return None

    try:
        if window:
            window.scene = scene
            target = find_layer(view_layer.layer_collection)
            if target:
                view_layer.active_layer_collection = target
            return action()
        with bpy.context.temp_override(scene=scene, view_layer=view_layer, collection=collection):
            return action()
    finally:
        try:
            view_layer.active_layer_collection = previous_collection
        except (ReferenceError, RuntimeError, TypeError):
            pass
        if window and previous_scene:
            window.scene = previous_scene


def _run_importer(path: str, suffix: str) -> None:
    if suffix in (".glb", ".gltf"):
        result = bpy.ops.import_scene.gltf(filepath=path)
    elif suffix == ".fbx":
        if hasattr(bpy.ops.wm, "fbx_import"):
            result = bpy.ops.wm.fbx_import(filepath=path)
        else:
            result = bpy.ops.import_scene.fbx(filepath=path)
    elif suffix == ".obj":
        result = bpy.ops.wm.obj_import(filepath=path)
    else:
        raise DimensioError(f"Dimensio cannot import {suffix} files.")
    if "FINISHED" not in result:
        raise DimensioError(f"Blender could not import {os.path.basename(path)}.")


def _append_blend_model(path: str):
    """Append the model objects of a .blend's first scene.

    The scene is appended rather than its objects so that its view layer's
    hidden state comes with it: a reference .blend is read the same way as a
    learner's file, visible solid objects only.
    """
    with bpy.data.libraries.load(path, link=False) as (source, target):
        if not source.scenes:
            raise DimensioError(f"{os.path.basename(path)} has no scene to take a model from.")
        target.scenes = source.scenes[:1]
    appended = target.scenes[0]
    if appended is None:
        raise DimensioError(f"Blender could not read a scene from {os.path.basename(path)}.")
    objects = [
        obj for obj in model_objects(appended)
        if obj.type in GEOMETRY_TYPES or (obj.type == "EMPTY" and obj.instance_type == "COLLECTION")
    ]
    return objects, appended


def import_reference(path: str, scene, collection) -> list:
    """Import a reference model into ``collection`` of ``scene``.

    Accepts .glb, .gltf, .fbx, .obj and .blend. Returns the new objects. A
    .blend contributes only its visible solid objects; the importers'
    cameras and lights come along for the other formats and are harmless in
    a Workbench render.
    """
    path = os.path.abspath(path)
    if not os.path.isfile(path):
        raise DimensioError(f"The reference file was not found: {path}")
    suffix = os.path.splitext(path)[1].lower()
    if suffix not in REFERENCE_SUFFIXES:
        raise DimensioError(
            f"Dimensio cannot use a {suffix or 'file without an extension'} as a reference. "
            "Use a .glb, .gltf, .fbx, .obj or .blend file."
        )
    if suffix == ".blend":
        open_file = bpy.data.filepath and os.path.normcase(os.path.abspath(bpy.data.filepath))
        if open_file == os.path.normcase(path):
            # Blender will not append from the file it has open; use a copy.
            fd, copy = tempfile.mkstemp(suffix=".blend", prefix="dimensio-reference-")
            os.close(fd)
            try:
                shutil.copyfile(path, copy)
                objects, appended = _append_blend_model(copy)
                for obj in objects:
                    if obj.name not in collection.objects:
                        collection.objects.link(obj)
                bpy.data.scenes.remove(appended)
                return objects
            finally:
                os.remove(copy)
        objects, appended = _append_blend_model(path)
        for obj in objects:
            if obj.name not in collection.objects:
                collection.objects.link(obj)
        bpy.data.scenes.remove(appended)
        return objects

    before = set(bpy.data.objects)
    _with_scene(scene, collection, lambda: _run_importer(path, suffix))
    created = [obj for obj in bpy.data.objects if obj not in before]
    for obj in created:
        if obj.name not in collection.objects and not obj.users_collection:
            collection.objects.link(obj)
    return created
