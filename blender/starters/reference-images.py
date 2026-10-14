"""Front and side reference pictures set up for blocking out.

Options:
  --image-front <file>  the subject seen from the front
  --image-side <file>   the subject seen from the right, facing left
  --height <metres>     how tall the subject is (default 2)

At least one image is needed. Each picture is an image empty in a
"References" collection that measuring skips. The pictures are packed into
the .blend, stand on the ground with their bottom edge at Z 0, and are scaled
so the picture is --height tall. They show only in orthographic views from
their own side (numpad 1 for the front, numpad 3 for the side), behind the
model, at half opacity, and cannot be selected. The default cube stays as
the first block. The file opens in the front view when there is a front
picture, otherwise the side view.
"""

OPTIONS = {
    "image-front": "The subject seen from the front.",
    "image-side": "The subject seen from the right, facing left.",
    "height": "How tall the subject is, in metres. Default 2.",
}


def build(starter):
    import math

    import bpy
    from dimensio_common import DimensioError

    front = starter.path("image-front")
    side = starter.path("image-side")
    if not front and not side:
        raise DimensioError("The reference-images starter needs --image-front, --image-side or both.")
    height = starter.number("height", 2.0)
    collection = starter.reference_collection("References")

    def picture(name, path, rotation):
        try:
            image = bpy.data.images.load(path)
        except RuntimeError as exc:
            raise DimensioError(f"Blender could not open the picture {path}: {exc}") from exc
        width, tall = image.size
        if not width or not tall:
            raise DimensioError(f"The picture {path} has no pixels Blender can read.")
        image.pack()
        empty = bpy.data.objects.new(name, None)
        empty.empty_display_type = "IMAGE"
        empty.data = image
        # The display size sets the picture's longer side.
        empty.empty_display_size = height * max(width, tall) / tall
        empty.empty_image_offset = (-0.5, 0.0)
        empty.empty_image_depth = "BACK"
        empty.empty_image_side = "FRONT"
        empty.show_empty_image_orthographic = True
        empty.show_empty_image_perspective = False
        empty.show_empty_image_only_axis_aligned = True
        empty.use_empty_image_alpha = True
        empty.color[3] = 0.5
        empty.rotation_euler = rotation
        empty.hide_select = True
        empty.hide_render = True
        collection.objects.link(empty)
        return empty, height * width / tall

    widths = []
    if front:
        widths.append(picture("Front reference", front, (math.radians(90), 0.0, 0.0))[1])
    if side:
        widths.append(picture("Side reference", side, (math.radians(90), 0.0, math.radians(90)))[1])
    half = max(widths) / 2
    starter.frame_viewports((-half, -half, 0.0), (half, half, height), view="front" if front else "right")
