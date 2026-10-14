"""Build the starting .blend for a Dimensio exercise.

    blender -b --python dimensio_starter.py -- --starter <id> --out <file.blend>
        [--force] [--<option> <value> ...]

Each starter is a script in ``starters/<id>.py`` with a ``build(starter)``
function; ``starters/README.md`` says how to write one. This runner starts
from Blender's factory scene (the cube, the camera and the light), runs the
starter, and saves the result. It never overwrites a file unless ``--force``
is given, because a learner may already have worked in it.

The last line printed is ``DIMENSIO_STARTER=`` followed by JSON: the starter
id and the saved path, or an ``error``. The exit code is 0 on success.
"""

from __future__ import annotations

import importlib.util
import json
import os
import re
import sys
import traceback

import bpy
from mathutils import Euler, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from dimensio_common import (  # noqa: E402
    GEOMETRY_TYPES,
    REFERENCE_MARK,
    DimensioError,
    forward_slashes,
    script_args,
)

FORMAT = 1
RESULT_PREFIX = "DIMENSIO_STARTER="
STARTERS = os.path.join(HERE, "starters")
STARTER_ID = re.compile(r"^[a-z0-9][a-z0-9-]{0,63}$")


def parse(argv):
    """``--starter``, ``--out`` and ``--force``; every other ``--name value`` is an option."""
    starter = out = None
    force = False
    options = {}
    index = 0
    while index < len(argv):
        item = argv[index]
        if not item.startswith("--") or len(item) < 3:
            raise DimensioError(f"Unexpected argument {item!r}.")
        name = item[2:]
        has_value = index + 1 < len(argv) and not argv[index + 1].startswith("--")
        value = argv[index + 1] if has_value else None
        index += 2 if has_value else 1
        if name == "force":
            force = True
        elif name in ("starter", "out"):
            if value is None:
                raise DimensioError(f"--{name} needs a value.")
            if name == "starter":
                starter = value
            else:
                out = value
        else:
            options[name] = "true" if value is None else value
    if not starter:
        raise DimensioError("--starter is required.")
    if not out:
        raise DimensioError("--out is required.")
    return starter, out, force, options


def load_starter(starter_id):
    if not STARTER_ID.match(starter_id):
        raise DimensioError(f"{starter_id!r} is not a starter id. Ids are lowercase letters, digits and hyphens.")
    path = os.path.join(STARTERS, f"{starter_id}.py")
    if not os.path.isfile(path):
        known = sorted(name[:-3] for name in os.listdir(STARTERS) if name.endswith(".py") and STARTER_ID.match(name[:-3]))
        raise DimensioError(f"There is no starter called {starter_id}. The starters are: {', '.join(known)}.")
    spec = importlib.util.spec_from_file_location(f"dimensio_starter_{starter_id.replace('-', '_')}", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    if not callable(getattr(module, "build", None)):
        raise DimensioError(f"starters/{starter_id}.py has no build(starter) function.")
    return module


class Starter:
    """What a starter script gets: its options and a few scene helpers."""

    def __init__(self, starter_id, options, accepted):
        self.id = starter_id
        self.options = options
        self.accepted = accepted
        unknown = sorted(set(options) - set(accepted))
        if unknown:
            names = ", ".join(f"--{name}" for name in unknown)
            allowed = ", ".join(f"--{name}" for name in accepted) or "none"
            raise DimensioError(f"The {starter_id} starter does not take {names}. It takes: {allowed}.")

    @property
    def scene(self):
        return bpy.context.scene

    def option(self, name, default=None):
        return self.options.get(name, default)

    def number(self, name, default):
        raw = self.options.get(name)
        if raw is None:
            return default
        try:
            value = float(raw)
        except ValueError as exc:
            raise DimensioError(f"--{name} must be a number, not {raw!r}.") from exc
        if not value > 0:
            raise DimensioError(f"--{name} must be more than 0.")
        return value

    def path(self, name, required=False):
        raw = self.options.get(name)
        if raw is None:
            if required:
                raise DimensioError(f"The {self.id} starter needs --{name}.")
            return None
        path = os.path.abspath(raw)
        if not os.path.isfile(path):
            raise DimensioError(f"The file given with --{name} was not found: {path}")
        return path

    def remove_default_cube(self):
        cube = bpy.data.objects.get("Cube")
        if cube is not None and cube.type == "MESH":
            mesh = cube.data
            bpy.data.objects.remove(cube)
            if mesh.users == 0:
                bpy.data.meshes.remove(mesh)

    def reference_collection(self, name):
        """A collection for reference material, which measuring skips.

        Its objects cannot be selected or rendered, so the learner cannot
        move them by accident and Dimensio never mistakes them for the model.
        """
        collection = bpy.data.collections.new(name)
        collection[REFERENCE_MARK] = True
        collection.hide_select = True
        collection.hide_render = True
        self.scene.collection.children.link(collection)
        return collection

    def material(self, name, colour):
        """A Principled material in ``colour`` (RGB, 0 to 1), shown in Solid view too."""
        material = bpy.data.materials.new(name)
        material.use_nodes = True
        node = next(n for n in material.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
        node.inputs[0].default_value = (*colour, 1.0)
        material.diffuse_color = (*colour, 1.0)
        return material

    def world_bounds(self, objects):
        depsgraph = bpy.context.evaluated_depsgraph_get()
        corners = []
        for obj in objects:
            if obj.type not in GEOMETRY_TYPES:
                continue
            evaluated = obj.evaluated_get(depsgraph)
            corners.extend(evaluated.matrix_world @ Vector(corner) for corner in evaluated.bound_box)
        if not corners:
            return None
        low = Vector((min(c.x for c in corners), min(c.y for c in corners), min(c.z for c in corners)))
        high = Vector((max(c.x for c in corners), max(c.y for c in corners), max(c.z for c in corners)))
        return low, high

    def frame_viewports(self, low, high, view=None):
        """Point every 3D Viewport at the box ``low``-``high``.

        ``view`` may be "front" or "right" to open in that orthographic
        view, as numpad 1 and numpad 3 would.
        """
        low, high = Vector(low), Vector(high)
        centre = (low + high) / 2
        size = max((high - low).length, 0.5)
        rotation = {
            "front": Euler((1.5707963, 0.0, 0.0)).to_quaternion(),
            "right": Euler((1.5707963, 0.0, 1.5707963)).to_quaternion(),
        }.get(view)
        for screen in bpy.data.screens:
            for area in screen.areas:
                if area.type != "VIEW_3D":
                    continue
                for space in area.spaces:
                    if space.type != "VIEW_3D" or space.region_3d is None:
                        continue
                    region = space.region_3d
                    region.view_location = centre
                    region.view_distance = size * 1.3
                    if rotation is not None:
                        region.view_rotation = rotation
                        region.view_perspective = "ORTHO"


def save(out, force):
    out = os.path.abspath(out)
    if not out.lower().endswith(".blend"):
        raise DimensioError("--out must be a .blend file.")
    if os.path.exists(out):
        if not force:
            raise DimensioError(f"{out} already exists. Pass --force to replace it.")
        os.remove(out)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    result = bpy.ops.wm.save_as_mainfile(filepath=out, check_existing=False, compress=True)
    if "FINISHED" not in result or not os.path.isfile(out):
        raise DimensioError(f"Blender could not save {out}.")
    return out


def main():
    result = {"format": FORMAT}
    code = 0
    try:
        starter_id, out, force, options = parse(script_args())
        result["starter"] = starter_id
        module = load_starter(starter_id)
        out_path = os.path.abspath(out)
        if os.path.exists(out_path) and not force:
            raise DimensioError(f"{out_path} already exists. Pass --force to replace it.")
        bpy.ops.wm.read_homefile(use_factory_startup=True, use_empty=False)
        starter = Starter(starter_id, options, getattr(module, "OPTIONS", {}))
        module.build(starter)
        result["out"] = forward_slashes(save(out, force))
    except DimensioError as exc:
        result["error"] = str(exc)
        code = 2
    except Exception as exc:  # report anything unexpected the same way
        traceback.print_exc()
        result["error"] = f"The starter failed inside Blender: {type(exc).__name__}: {exc}"
        code = 1
    print(RESULT_PREFIX + json.dumps(result, separators=(",", ":")), flush=True)
    return code


if __name__ == "__main__":
    raise SystemExit(main())
