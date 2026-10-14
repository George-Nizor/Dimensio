"""Turns each downloaded example model into the form the course uses.

    python3 desktop/scripts/reference-models.py <blender.exe> <id> [<id> ...]

For each id, desktop/public/reference/models/<id>.glb (or .gltf, .fbx, .obj) is imported into an
empty Blender scene and saved as models/<id>/<id>.blend, the file "Open in Blender" opens. Then
blender/dimensio_check.py renders it from the front, the right, the top and a three-quarter view
into the same folder, so an example model looks the same as a learner's measured model. Blender
runs from WSL as well as Windows; paths are passed to it in Windows form when it is a .exe.
"""

import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODELS = os.path.join(ROOT, "desktop", "public", "reference", "models")
TOOLKIT = os.path.join(ROOT, "blender")

IMPORT = r"""
import bpy, sys
src, out = sys.argv[sys.argv.index('--') + 1:][:2]
for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj)
ext = src.lower().rsplit('.', 1)[-1]
if ext in ('glb', 'gltf'):
    bpy.ops.import_scene.gltf(filepath=src)
elif ext == 'fbx':
    bpy.ops.import_scene.fbx(filepath=src)
elif ext == 'obj':
    bpy.ops.wm.obj_import(filepath=src)
for image in bpy.data.images:
    if image.source == 'FILE' and not image.packed_file:
        image.pack()
bpy.ops.wm.save_as_mainfile(filepath=out, compress=True)
"""


def host(path, blender):
    if blender.lower().endswith(".exe") and os.name != "nt":
        return subprocess.run(["wslpath", "-w", path], capture_output=True, text=True, check=True).stdout.strip()
    return path


def run(blender, args):
    result = subprocess.run([blender, *args], capture_output=True, text=True)
    if result.returncode != 0:
        sys.stderr.write(result.stdout[-2000:] + result.stderr[-2000:])
        raise SystemExit(f"Blender failed: {' '.join(args[:4])}")


def build(blender, model_id):
    source = next((os.path.join(MODELS, f"{model_id}.{ext}") for ext in ("glb", "gltf", "fbx", "obj") if os.path.exists(os.path.join(MODELS, f"{model_id}.{ext}"))), None)
    if not source:
        raise SystemExit(f"No downloaded file for {model_id} in {MODELS}")
    folder = os.path.join(MODELS, model_id)
    os.makedirs(folder, exist_ok=True)
    blend = os.path.join(folder, f"{model_id}.blend")
    script = os.path.join(folder, "import.py")
    with open(script, "w") as handle:
        handle.write(IMPORT)
    try:
        run(blender, ["-b", "--factory-startup", "--python", host(script, blender), "--", host(source, blender), host(blend, blender)])
    finally:
        os.remove(script)
    renders = os.path.join(folder, "check")
    run(blender, ["-b", "--factory-startup", "--disable-autoexec", host(blend, blender), "--python", host(os.path.join(TOOLKIT, "dimensio_check.py"), blender),
                  "--", "--out", host(renders, blender), "--views", "persp,front,right,top"])
    for view in ("persp", "front", "right", "top"):
        shutil.move(os.path.join(renders, f"{view}.png"), os.path.join(folder, f"{view}.png"))
    shutil.rmtree(renders)
    for leftover in (blend + "1",):
        if os.path.exists(leftover):
            os.remove(leftover)
    print(f"{model_id}: {os.path.relpath(folder, ROOT)}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    for model in sys.argv[2:]:
        build(sys.argv[1], model)
