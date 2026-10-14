"""What a machine set up for Forge3D, Dimensio's earlier name, keeps."""

from __future__ import annotations

import json
from pathlib import Path

from dimensio import environment, paths
from dimensio.models import ModelManager, get_model
from dimensio.process import CommandResult


def test_a_setting_is_read_under_the_new_name_then_the_old_one() -> None:
    assert environment.setting("AGENT", {"DIMENSIO_AGENT": "codex", "FORGE3D_AGENT": "claude"}) == "codex"
    assert environment.setting("AGENT", {"FORGE3D_AGENT": "codex"}) == "codex"
    assert environment.setting("AGENT", {"DIMENSIO_AGENT": "", "FORGE3D_AGENT": "codex"}) == "codex"
    assert environment.setting("AGENT", {}) is None


def test_forge3d_variables_still_point_the_cli_at_its_folders(monkeypatch, tmp_path: Path) -> None:
    monkeypatch.delenv("DIMENSIO_OUTPUT", raising=False)
    monkeypatch.setenv("FORGE3D_OUTPUT", str(tmp_path / "runs"))
    assert paths.output_root() == (tmp_path / "runs").resolve()
    monkeypatch.setenv("DIMENSIO_OUTPUT", str(tmp_path / "new"))
    assert paths.output_root() == (tmp_path / "new").resolve()


class FolderWSL:
    """A WSL where only the folders and files named exist."""

    distro = "Ubuntu-24.04"
    executable = "wsl.exe"

    def __init__(self, existing: set[str]) -> None:
        self.existing = existing

    def run(self, argv: list[str], **_: object) -> CommandResult:
        if argv[:2] == ["printenv", "HOME"]:
            return CommandResult(tuple(argv), 0, "/home/george\n", "")
        if argv[0] == "test":
            return CommandResult(tuple(argv), 0 if argv[2] in self.existing else 1, "", "")
        return CommandResult(tuple(argv), 0, "", "")


def test_models_forge3d_installed_are_used_where_they_are(monkeypatch) -> None:
    monkeypatch.delenv("DIMENSIO_WSL_MODELS_DIR", raising=False)
    monkeypatch.delenv("FORGE3D_WSL_MODELS_DIR", raising=False)
    old = "/home/george/.local/share/forge3d/models"
    new = "/home/george/.local/share/dimensio/models"
    model = get_model("triposplat")

    only_old = ModelManager(root=Path.cwd(), wsl=FolderWSL({old}))  # type: ignore[arg-type]
    assert only_old.models_root == old

    both = ModelManager(root=Path.cwd(), wsl=FolderWSL({old, new}))  # type: ignore[arg-type]
    assert both.models_root == new

    neither = ModelManager(root=Path.cwd(), wsl=FolderWSL(set()))  # type: ignore[arg-type]
    assert neither.models_root == new

    directory = f"{old}/{model.directory_name}"
    marked_by_forge3d = FolderWSL({old, f"{directory}/.venv/bin/python", f"{directory}/.forge3d-install-complete"})
    assert ModelManager(root=Path.cwd(), wsl=marked_by_forge3d).is_ready(model)  # type: ignore[arg-type]


def test_a_licence_accepted_under_forge3d_still_counts(tmp_path: Path) -> None:
    model = get_model("spar3d")
    manager = ModelManager(root=tmp_path, wsl=FolderWSL(set()))  # type: ignore[arg-type]
    assert not manager.license_accepted(model)
    record = tmp_path / ".forge3d" / "licenses" / "spar3d.json"
    record.parent.mkdir(parents=True)
    record.write_text(json.dumps({
        "model": model.key,
        "license": model.license_name,
        "license_url": model.license_url,
        "terms_urls": list(model.terms_urls),
    }), encoding="utf-8")
    assert manager.license_accepted(model)
