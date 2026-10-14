"""The forge3d skill agrees with the desktop host that runs it."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL = (ROOT / "plugins" / "forge3d" / "skills" / "forge3d" / "SKILL.md").read_text(encoding="utf-8")


def test_the_skill_does_not_ask_for_doctor_inside_a_desktop_run() -> None:
    # The host prompt says not to rerun forge3d doctor; the skill used to say to run it first.
    assert not re.search(r"^\d+\. Run `forge3d doctor", SKILL, re.MULTILINE)
    assert "Do not run `forge3d doctor`" in SKILL


def test_the_skill_is_local_only() -> None:
    for phrase in ("cloud-run tripo", "TRIPO_API_KEY", "--approve-upload", "cloud fallback"):
        assert phrase not in SKILL, phrase
    assert "Forge3D is local only" in SKILL


def test_the_skill_assumes_no_gpu_size() -> None:
    assert "16 GB" not in SKILL


def test_the_skill_knows_claude_code_cannot_make_images() -> None:
    assert "Claude Code cannot" in SKILL
