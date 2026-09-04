"""Package a TripoSplat Gaussian PLY as an editable KIRI-backed Blend file."""

from __future__ import annotations

import json
import math
import re
import struct
import sys
from datetime import datetime, timezone
from pathlib import Path

import bpy


KIRI_MODULE = "bl_ext.user_default.dgs_render_by_kiri_engine"


def arguments() -> tuple[Path, Path, Path]:
    values = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    if len(values) != 3:
        raise SystemExit("usage: import_gaussian_splat.py INPUT.ply OUTPUT.blend REPORT.json")
    source, blend, report = (Path(value).expanduser().resolve() for value in values)
    if source.suffix.lower() != ".ply" or not source.is_file():
        raise ValueError(f"A TripoSplat source PLY is required: {source}")
    if blend.suffix.lower() != ".blend" or report.suffix.lower() != ".json":
        raise ValueError("Output must be .blend and report must be .json")
    for output in (blend, report):
        if output.exists():
            raise FileExistsError(f"Refusing to overwrite {output}")
        output.parent.mkdir(parents=True, exist_ok=True)
    return source, blend, report


def prepare_kiri_ply(source: Path, destination: Path) -> tuple[Path, int]:
    with source.open("rb") as stream:
        prefix = stream.read(65536)
        marker_index = prefix.find(b"end_header")
        if marker_index < 0:
            raise ValueError("PLY end_header marker was not found")
        newline_index = prefix.find(b"\n", marker_index)
        if newline_index < 0:
            raise ValueError("PLY header is incomplete")
        header_end = newline_index + 1
        header = prefix[:header_end]
        stream.seek(header_end)
        header_text = header.decode("ascii")
        if "format binary_little_endian 1.0" not in header_text:
            raise ValueError("Only binary little-endian Gaussian PLY input is supported")
        count_match = re.search(r"^element vertex (\d+)$", header_text, re.MULTILINE)
        if not count_match:
            raise ValueError("PLY vertex count was not found")
        vertex_count = int(count_match.group(1))
        if re.search(r"^property float f_rest_0$", header_text, re.MULTILINE):
            return source, vertex_count
        vertex_section = header_text.split("element vertex", 1)[1].split("end_header", 1)[0]
        property_lines = [line for line in vertex_section.splitlines() if line.startswith("property ")]
        if not property_lines or any(not line.startswith("property float ") for line in property_lines):
            raise ValueError("Expected float-only TripoSplat vertex records")
        record_size = len(property_lines) * 4
        if source.stat().st_size - header_end != vertex_count * record_size:
            raise ValueError("Unexpected Gaussian PLY payload size")
        updated_header = header.replace(b"end_header", b"property float f_rest_0\nend_header", 1)
        zero = struct.pack("<f", 0.0)
        with destination.open("xb") as output:
            output.write(updated_header)
            remaining = vertex_count
            while remaining:
                count = min(remaining, 8192)
                data = stream.read(count * record_size)
                if len(data) != count * record_size:
                    raise EOFError("Gaussian PLY payload ended early")
                for offset in range(0, len(data), record_size):
                    output.write(data[offset : offset + record_size])
                    output.write(zero)
                remaining -= count
        return destination, vertex_count


def enable_kiri() -> None:
    if KIRI_MODULE not in bpy.context.preferences.addons:
        result = bpy.ops.preferences.addon_enable(module=KIRI_MODULE)
        if "FINISHED" not in result:
            raise RuntimeError(f"Could not enable the KIRI Engine Blender extension: {result}")
    if not hasattr(bpy.ops.sna, "dgs_render_import_ply_e0a3a"):
        raise RuntimeError("KIRI Engine is installed but its Gaussian PLY importer is unavailable")


def main() -> None:
    source, blend_path, report_path = arguments()
    compatibility_path = blend_path.with_name(f"{blend_path.stem}-kiri-source.ply")
    compatible_source, source_count = prepare_kiri_ply(source, compatibility_path)
    enable_kiri()
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.scale_length = 1.0
    scene.render.engine = "BLENDER_EEVEE"
    scene.sna_dgs_scene_properties.import_face_vert = "Verts"
    scene.sna_dgs_scene_properties.import_uv = False
    scene.sna_dgs_scene_properties.import_proxy = False
    result = bpy.ops.sna.dgs_render_import_ply_e0a3a(filepath=str(compatible_source))
    if "FINISHED" not in result:
        raise RuntimeError(f"KIRI Gaussian import did not finish: {result}")
    splat = bpy.context.active_object
    if splat is None or splat.type != "MESH" or len(splat.data.vertices) < 1:
        raise RuntimeError("KIRI imported no Gaussian splats")
    required = {
        "f_dc_0", "f_dc_1", "f_dc_2", "opacity", "scale_0", "scale_1", "scale_2",
        "rot_0", "rot_1", "rot_2", "rot_3", "f_rest_0",
    }
    missing = sorted(required.difference(splat.data.attributes.keys()))
    if missing:
        raise RuntimeError(f"Imported splat is missing attributes: {missing}")
    asset_name = re.sub(r"[^A-Za-z0-9]+", "_", source.stem).strip("_") or "Forge3D"
    splat.name = f"{asset_name}_GaussianSplat"
    splat.data.name = f"{asset_name}_GaussianSplat_Data"
    splat.rotation_mode = "XYZ"
    splat.rotation_euler = (math.pi, 0.0, 0.0)
    splat["forge3d_source"] = str(source)
    splat["forge3d_representation"] = "gaussian_splat_not_polygon_mesh"
    splat["forge3d_splat_count"] = len(splat.data.vertices)
    scene["forge3d_representation"] = "Gaussian splat rendered by KIRI Engine"
    scene["forge3d_source_ply"] = str(source)
    bpy.ops.wm.save_as_mainfile(filepath=str(blend_path), check_existing=False, compress=True, relative_remap=False)
    if not blend_path.is_file() or blend_path.stat().st_size == 0:
        raise RuntimeError("Blender produced no Blend package")
    report = {
        "schema": "forge3d.gaussian_blend.v1",
        "status": "completed",
        "source": str(source),
        "output": str(blend_path),
        "representation": "Gaussian splat stored as KIRI attributes and Geometry Nodes; not a polygon mesh",
        "source_splat_count": source_count,
        "imported_splat_count": len(splat.data.vertices),
        "object": splat.name,
        "attributes": sorted(splat.data.attributes.keys()),
        "kiri_module": KIRI_MODULE,
        "blender_version": bpy.app.version_string,
        "completed_at": datetime.now(timezone.utc).isoformat(),
    }
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print("FORGE3D_GAUSSIAN_BLEND=" + json.dumps(report))


if __name__ == "__main__":
    main()
