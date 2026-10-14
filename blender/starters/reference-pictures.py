"""Blender's default scene, with reference pictures saved beside it.

Options:
  --image-front <file>  the subject seen from the front
  --image-side <file>   the subject seen from the right, facing left

At least one image is needed. The scene is Blender's default scene: the
cube, the camera and the light, opened in the front view. Nothing is set up
in it. Each picture is copied, under its own file name, into the folder the
.blend is saved to, so the learner can add it with Add > Image > Reference
and set it up by hand. Use the reference-images starter instead when the
pictures should arrive already placed.

A picture already in that folder under the same name is replaced only when
its bytes differ. Measuring the starting file gives the default cube: verts
8, faces 6, quads 6, tris 12, ngons 0.
"""

OPTIONS = {
    "image-front": "The subject seen from the front.",
    "image-side": "The subject seen from the right, facing left.",
}


def build(starter):
    import filecmp
    import os
    import shutil

    from dimensio_common import DimensioError, script_args

    pictures = [path for path in (starter.path("image-front"), starter.path("image-side")) if path]
    if not pictures:
        raise DimensioError("The reference-pictures starter needs --image-front, --image-side or both.")
    args = script_args()
    if "--out" not in args or args.index("--out") + 1 >= len(args):
        raise DimensioError("The reference-pictures starter needs --out to know where to put the pictures.")
    folder = os.path.dirname(os.path.abspath(args[args.index("--out") + 1]))
    os.makedirs(folder, exist_ok=True)
    for source in pictures:
        target = os.path.join(folder, os.path.basename(source))
        if os.path.abspath(source) == os.path.abspath(target):
            continue
        if os.path.exists(target) and filecmp.cmp(source, target, shallow=False):
            continue
        try:
            shutil.copyfile(source, target)
        except OSError as exc:
            raise DimensioError(f"Could not copy the picture to {folder}: {exc}") from exc
    starter.frame_viewports((-1.0, -1.0, -1.0), (1.0, 1.0, 1.0), view="front")
