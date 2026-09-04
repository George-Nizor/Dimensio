"""Convert a conventional 3D scene between reviewed local Blender formats."""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import bpy


INPUTS = {".blend", ".glb", ".gltf", ".fbx", ".obj", ".ply", ".stl", ".usd", ".usda", ".usdc"}
OUTPUTS = {".blend", ".glb", ".gltf", ".fbx", ".obj", ".ply", ".stl", ".usd"}


def arguments() -> tuple[Path, Path, Path]:
    values = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    if len(values) != 3:
        raise SystemExit("usage: export_asset.py INPUT OUTPUT REPORT.json")
    return tuple(Path(value).expanduser().resolve() for value in values)  # type: ignore[return-value]


def ensure_new(path: Path, suffixes: set[str]) -> None:
    if path.suffix.lower() not in suffixes:
        raise ValueError(f"Unsupported format {path.suffix}; expected {sorted(suffixes)}")
    if path.exists():
        raise FileExistsError(f"Refusing to overwrite {path}")
    path.parent.mkdir(parents=True, exist_ok=True)


def clear_scene() -> None:
    if bpy.context.object and bpy.context.object.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)


def load_scene(source: Path) -> None:
    suffix = source.suffix.lower()
    if suffix not in INPUTS or not source.is_file():
        raise ValueError(f"Unsupported or missing input: {source}")
    if suffix == ".blend":
        bpy.ops.wm.open_mainfile(filepath=str(source), load_ui=False)
        return
    clear_scene()
    if suffix in {".glb", ".gltf"}:
        bpy.ops.import_scene.gltf(filepath=str(source))
    elif suffix == ".fbx":
        bpy.ops.import_scene.fbx(filepath=str(source))
    elif suffix == ".obj":
        bpy.ops.wm.obj_import(filepath=str(source))
    elif suffix == ".ply":
        bpy.ops.wm.ply_import(filepath=str(source))
    elif suffix == ".stl":
        bpy.ops.wm.stl_import(filepath=str(source))
    else:
        bpy.ops.wm.usd_import(filepath=str(source))


def supported(operator: Any, values: dict[str, Any]) -> dict[str, Any]:
    try:
        properties = {item.identifier for item in operator.get_rna_type().properties}
    except Exception:
        return values
    return {key: value for key, value in values.items() if key in properties}


def export_scene(destination: Path) -> None:
    suffix = destination.suffix.lower()
    if suffix == ".blend":
        bpy.ops.wm.save_as_mainfile(filepath=str(destination), check_existing=False, compress=True, relative_remap=False)
    elif suffix in {".glb", ".gltf"}:
        result = bpy.ops.export_scene.gltf(**supported(bpy.ops.export_scene.gltf, {
            "filepath": str(destination), "check_existing": False,
            "export_format": "GLB" if suffix == ".glb" else "GLTF_SEPARATE",
            "use_selection": False, "export_apply": True, "export_yup": True,
            "export_materials": "EXPORT", "export_attributes": True,
            "export_extras": True, "export_animations": True,
        }))
        if "FINISHED" not in result:
            raise RuntimeError(f"glTF exporter did not finish: {result}")
    elif suffix == ".fbx":
        result = bpy.ops.export_scene.fbx(**supported(bpy.ops.export_scene.fbx, {
            "filepath": str(destination), "check_existing": False, "use_selection": False,
            "apply_unit_scale": True, "bake_anim": True, "axis_forward": "-Z", "axis_up": "Y",
        }))
        if "FINISHED" not in result:
            raise RuntimeError(f"FBX exporter did not finish: {result}")
    elif suffix == ".obj":
        result = bpy.ops.wm.obj_export(**supported(bpy.ops.wm.obj_export, {
            "filepath": str(destination), "check_existing": False,
            "export_selected_objects": False, "apply_modifiers": True, "export_materials": True,
        }))
        if "FINISHED" not in result:
            raise RuntimeError(f"OBJ exporter did not finish: {result}")
    elif suffix == ".ply":
        result = bpy.ops.wm.ply_export(**supported(bpy.ops.wm.ply_export, {
            "filepath": str(destination), "check_existing": False,
            "export_selected_objects": False, "apply_modifiers": True,
        }))
        if "FINISHED" not in result:
            raise RuntimeError(f"PLY exporter did not finish: {result}")
    elif suffix == ".stl":
        result = bpy.ops.wm.stl_export(**supported(bpy.ops.wm.stl_export, {
            "filepath": str(destination), "check_existing": False,
            "export_selected_objects": False, "apply_modifiers": True,
        }))
        if "FINISHED" not in result:
            raise RuntimeError(f"STL exporter did not finish: {result}")
    else:
        result = bpy.ops.wm.usd_export(**supported(bpy.ops.wm.usd_export, {
            "filepath": str(destination), "selected_objects_only": False,
            "export_animation": True, "export_materials": True,
        }))
        if "FINISHED" not in result:
            raise RuntimeError(f"USD exporter did not finish: {result}")


def main() -> None:
    source, destination, report_path = arguments()
    ensure_new(destination, OUTPUTS)
    ensure_new(report_path, {".json"})
    load_scene(source)
    export_scene(destination)
    if not destination.is_file() or destination.stat().st_size == 0:
        raise RuntimeError("Exporter produced no primary output")
    report = {
        "schema": "forge3d.export.v1",
        "status": "completed",
        "source": str(source),
        "output": str(destination),
        "format": destination.suffix.lower().lstrip("."),
        "file_size_bytes": destination.stat().st_size,
        "objects": len(bpy.context.scene.objects),
        "blender_version": bpy.app.version_string,
        "completed_at": datetime.now(timezone.utc).isoformat(),
    }
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print("FORGE3D_EXPORT=" + json.dumps(report))


if __name__ == "__main__":
    main()
