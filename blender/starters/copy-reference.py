"""A model to copy, beside an empty space to build in.

Options:
  --reference <file>  the model to copy: .glb, .gltf, .fbx, .obj or .blend

The model goes into a "Reference" collection that measuring skips. It is
drawn as wire, cannot be selected and does not render. It stands on the
ground to the left of the origin (towards -X), with a gap of a quarter of its
largest side, so the learner builds at the origin beside it at the same
scale. The default cube is removed; the camera and the light stay.
"""

OPTIONS = {
    "reference": "The model to copy: .glb, .gltf, .fbx, .obj or .blend.",
}


def build(starter):
    import bpy
    from mathutils import Matrix, Vector

    from dimensio_common import GEOMETRY_TYPES, DimensioError, import_reference

    path = starter.path("reference", required=True)
    starter.remove_default_cube()
    collection = starter.reference_collection("Reference")
    try:
        objects = import_reference(path, starter.scene, collection)
    except DimensioError:
        raise
    except Exception as exc:
        raise DimensioError(f"Blender could not import the reference: {exc}") from exc
    bounds = starter.world_bounds(objects)
    if bounds is None:
        raise DimensioError("The reference has no visible geometry to copy.")
    low, high = bounds
    size = high - low
    gap = max(max(size) * 0.25, 0.1)
    shift = Vector((-gap - high.x, -(low.y + high.y) / 2, -low.z))
    imported = set(objects)
    for obj in objects:
        if obj.parent is None or obj.parent not in imported:
            obj.matrix_world = Matrix.Translation(shift) @ obj.matrix_world
        if obj.type in GEOMETRY_TYPES:
            obj.display_type = "WIRE"
        obj.hide_select = True
        obj.hide_render = True
        obj.select_set(False)
    for obj in objects:
        for other in list(obj.users_collection):
            if other != collection:
                other.objects.unlink(obj)
        if obj.name not in collection.objects:
            collection.objects.link(obj)
    starter.frame_viewports(
        (-gap - size.x, -size.y / 2, 0.0),
        (gap + size.x, size.y / 2, size.z),
    )
