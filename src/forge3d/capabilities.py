"""Capability report: what is installed, what works, and what each route needs.

`forge3d capabilities --json` is the single place that answers "can this machine
make a splat / a Blender asset / an export / a Godot review, and if not, why and
what should the person do". Every dependency is a small `probe_*` function that
takes an `Env` (runner, PATH lookup, globbing, environment variables), so tests
swap in fakes. Nothing here writes to disk or changes any configuration.

The routes need "an agent": the one chosen in the desktop (`--agent`, or
FORGE3D_AGENT), Claude Code by default. It is reported as the `agent` item.

Schema: docs/capabilities.md. Vocabulary: states are ready | missing |
signed_out | degraded | optional_missing; route states are ready | degraded |
blocked.
"""

from __future__ import annotations

import glob as _glob
import json
import ntpath
import os
import platform as _platform
import re
import shlex
import shutil
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Mapping, Sequence

from . import __version__
from .errors import Forge3DError, ToolNotFoundError
from .models import MODELS
from .process import CommandResult, CommandRunner, WSL

SCHEMA_VERSION = 1

STATES = ("ready", "missing", "signed_out", "degraded", "optional_missing")
ROUTE_STATES = ("ready", "degraded", "blocked")

# Blender extensions (the KIRI Engine splat importer is one) need Blender 4.2.
MIN_BLENDER = (4, 2)
KIRI_EXTENSION_ID = "dgs_render_by_kiri_engine"
BLENDER_MCP_ADDON = "blender_mcp.py"

_PROBE_TIMEOUT = 15.0
_WSL_TIMEOUT = 45.0  # a cold WSL VM can take several seconds to boot

AGENTS = {"claude": "Claude Code", "codex": "Codex"}
DEFAULT_AGENT = "claude"

# Which capabilities each route needs. `required` capabilities that are missing
# or signed out block the route; degraded ones degrade it. `soft` capabilities
# only degrade it (a missing one is listed, never blocks).
_SPLAT_STACK = ["wsl", "wsl_tools", "cuda", "triposplat", "triposplat_weights"]
ROUTES: dict[str, dict[str, Any]] = {
    "splat": {
        "label": "Gaussian splat (TripoSplat)",
        "required": ["agent", *_SPLAT_STACK],
        "soft": [],
        "optional": False,
    },
    # A splat with no attached image: the agent has to make the reference image,
    # which only Codex can do.
    "splat_text": {
        "label": "Gaussian splat from words alone",
        "required": ["agent", "image_generation", *_SPLAT_STACK],
        "soft": [],
        "optional": False,
    },
    "blender": {
        "label": "Procedural Blender asset",
        "required": ["agent", "blender"],
        "soft": ["blender_mcp"],
        "optional": False,
    },
    "export": {
        "label": "Export (GLB, FBX, Blend)",
        "required": ["blender"],
        "soft": ["kiri"],
        "optional": False,
    },
    "godot": {
        "label": "Godot review",
        "required": ["godot"],
        "soft": ["node"],
        "optional": True,
    },
}


# --------------------------------------------------------------------------- env


def detect_platform(
    system: str | None = None,
    release: str | None = None,
    environ: Mapping[str, str] | None = None,
) -> str:
    """`windows`, `wsl`, `linux` or `macos`."""
    system = (system if system is not None else _platform.system()).lower()
    release = (release if release is not None else _platform.release()).lower()
    environ = os.environ if environ is None else environ
    if system.startswith(("win", "cygwin", "msys")):
        return "windows"
    if system == "darwin":
        return "macos"
    if "microsoft" in release or environ.get("WSL_DISTRO_NAME") or environ.get("WSL_INTEROP"):
        return "wsl"
    return "linux"


@dataclass
class Env:
    """Everything the probes touch outside Python, so tests can fake it."""

    platform: str = field(default_factory=detect_platform)
    environ: Mapping[str, str] = field(default_factory=lambda: dict(os.environ))
    runner: Any = field(default_factory=CommandRunner)
    which: Callable[[str], str | None] = shutil.which
    glob: Callable[[str], list[str]] = field(default=lambda pattern: sorted(_glob.glob(pattern)))
    is_file: Callable[[str], bool] = lambda path: Path(path).is_file()
    find_blender: Callable[[], Path | None] | None = None
    find_godot: Callable[[], Path | None] | None = None

    def get(self, name: str) -> str | None:
        value = self.environ.get(name)
        return value or None

    def run(self, command: Sequence[str], *, timeout: float = _PROBE_TIMEOUT) -> CommandResult | None:
        """Run a command; None when it cannot start or times out."""
        try:
            return self.runner.run(list(command), timeout=timeout, check=False)
        except Forge3DError:
            return None
        except OSError:
            return None


# ---------------------------------------------------------------------- results


def _item(
    id: str,
    label: str,
    state: str,
    *,
    reason: str = "",
    fix: str = "",
    version: str | None = None,
    path: str | None = None,
    detail: dict[str, Any] | None = None,
    gates: Sequence[str] = (),
    optional: bool = False,
) -> dict[str, Any]:
    assert state in STATES, state
    return {
        "id": id,
        "label": label,
        "state": state,
        "reason": reason,
        "fix": fix,
        "version": version,
        "path": path,
        "detail": detail or {},
        "gates": list(gates),
        "optional": optional,
    }


def _first_line(result: CommandResult | None) -> str:
    if result is None:
        return ""
    text = (result.stdout or result.stderr).strip()
    return text.splitlines()[0].strip() if text else ""


def parse_version(text: str) -> str | None:
    match = re.search(r"(\d+)\.(\d+)(?:\.(\d+))?", text or "")
    return ".".join(part for part in match.groups() if part is not None) if match else None


def _version_tuple(version: str | None) -> tuple[int, ...]:
    return tuple(int(part) for part in version.split(".")) if version else ()


# ----------------------------------------------------------------------- codex


def _mtime(path: str) -> float:
    try:
        return os.path.getmtime(path)
    except OSError:
        return 0.0


def find_codex(env: Env) -> str | None:
    configured = env.get("FORGE3D_CODEX_EXE")
    if configured and env.is_file(configured):
        return configured
    for name in ("codex.exe", "codex"):
        found = env.which(name)
        if found:
            return found
    local = env.get("LOCALAPPDATA")
    if local:
        pattern = os.path.join(local, "OpenAI", "Codex", "bin", "**", "codex.exe")
        matches = env.glob(pattern)
        if matches:
            return max(matches, key=_mtime)
    return None


def probe_codex(env: Env) -> dict[str, Any]:
    gates = ("splat", "blender")
    fix_missing = "Install the Codex app or CLI (https://developers.openai.com/codex) and sign in, then press Check again."
    exe = find_codex(env)
    if not exe:
        return _item("codex", "Codex", "missing", reason="The Codex CLI was not found.", fix=fix_missing, gates=gates)
    version = parse_version(_first_line(env.run([exe, "--version"])))
    if version is None:
        return _item(
            "codex", "Codex", "missing", path=exe, gates=gates,
            reason="Codex was found but did not report a version.", fix=fix_missing,
        )
    status = env.run([exe, "login", "status"])
    if status is None:
        return _item(
            "codex", "Codex", "degraded", version=version, path=exe, gates=gates,
            reason="Codex did not answer the sign-in check in time, so sign-in is unconfirmed.",
            fix="Press Check again. If it persists, run `codex login status` in a terminal.",
        )
    if status.returncode != 0:
        return _item(
            "codex", "Codex", "signed_out", version=version, path=exe, gates=gates,
            reason="Codex is installed but not signed in.",
            fix="Run `codex login` in a terminal (or open the Codex app) and sign in, then press Check again.",
            detail={"login_status": _first_line(status)},
        )
    return _item(
        "codex", "Codex", "ready", version=version, path=exe, gates=gates,
        detail={"login_status": _first_line(status)},
    )


# ---------------------------------------------------------------------- claude


def find_claude(env: Env) -> str | None:
    """DIMENSIO_CLAUDE_EXE, the native installer's copy, PATH, then npm's claude.cmd."""
    configured = env.get("DIMENSIO_CLAUDE_EXE")
    if configured and env.is_file(configured):
        return configured
    if env.platform == "windows":
        profile = env.get("USERPROFILE")
        if profile:
            native = ntpath.join(profile, ".local", "bin", "claude.exe")
            if env.is_file(native):
                return native
        for name in ("claude.exe", "claude.cmd"):
            found = env.which(name)
            if found:
                return found
        appdata = env.get("APPDATA")
        if appdata:
            npm = ntpath.join(appdata, "npm", "claude.cmd")
            if env.is_file(npm):
                return npm
        return None
    home = env.get("HOME")
    if home:
        native = os.path.join(home, ".local", "bin", "claude")
        if env.is_file(native):
            return native
    return env.which("claude")


def claude_install_fix(env: Env) -> str:
    if env.platform == "windows":
        return (
            "Install Claude Code: in PowerShell run `irm https://claude.ai/install.ps1 | iex`, "
            "then run `claude` once to sign in. Press Check again when it is done."
        )
    return (
        "Install Claude Code: run `curl -fsSL https://claude.ai/install.sh | bash`, "
        "then run `claude` once to sign in. Press Check again when it is done."
    )


def _logged_in(result: CommandResult) -> bool:
    """`claude auth status` prints JSON with loggedIn and exits 0 when signed in, 1 when not."""
    if result.returncode != 0:
        return False
    try:
        data = json.loads(result.stdout or "{}")
    except ValueError:
        return '"loggedIn": false' not in (result.stdout or "")
    return data.get("loggedIn") is not False


def probe_claude(env: Env) -> dict[str, Any]:
    gates = ("splat", "blender")
    fix_missing = claude_install_fix(env)
    exe = find_claude(env)
    if not exe:
        return _item("claude", "Claude Code", "missing", reason="Claude Code was not found.", fix=fix_missing, gates=gates)
    version = parse_version(_first_line(env.run([exe, "--version"])))
    if version is None:
        return _item(
            "claude", "Claude Code", "missing", path=exe, gates=gates,
            reason="Claude Code was found but did not report a version.", fix=fix_missing,
        )
    status = env.run([exe, "auth", "status"])
    if status is None:
        return _item(
            "claude", "Claude Code", "degraded", version=version, path=exe, gates=gates,
            reason="Claude Code did not answer the sign-in check in time, so sign-in is unconfirmed.",
            fix="Press Check again. If it persists, run `claude auth status` in a terminal.",
        )
    if not _logged_in(status):
        return _item(
            "claude", "Claude Code", "signed_out", version=version, path=exe, gates=gates,
            reason="Claude Code is installed but not signed in.",
            fix="Run `claude` in a terminal and sign in with your Claude account, then press Check again.",
        )
    return _item("claude", "Claude Code", "ready", version=version, path=exe, gates=gates)


def find_git_bash(env: Env) -> str | None:
    """Where Claude Code looks for Git Bash on Windows."""
    configured = env.get("CLAUDE_CODE_GIT_BASH_PATH")
    if configured and ntpath.basename(configured).lower() in ("bash.exe", "sh.exe", "bash", "sh") and env.is_file(configured):
        return configured
    for root in (env.get("ProgramFiles") or "C:\\Program Files", env.get("ProgramFiles(x86)") or "C:\\Program Files (x86)"):
        candidate = ntpath.join(root, "Git", "bin", "bash.exe")
        if env.is_file(candidate):
            return candidate
    git = env.which("git.exe") or env.which("git")
    if git:
        candidate = ntpath.join(ntpath.dirname(ntpath.dirname(git)), "bin", "bash.exe")
        if env.is_file(candidate):
            return candidate
    return None


def probe_git_bash(env: Env) -> dict[str, Any]:
    """Claude Code's Bash tool needs Git Bash on Windows. Without it Claude Code
    runs commands in PowerShell, which Forge3D allows too, so this never blocks."""
    found = find_git_bash(env)
    label = "Git Bash for Claude Code"
    if found:
        return _item("git_bash", label, "ready", path=found, optional=True)
    return _item(
        "git_bash", label, "optional_missing", optional=True,
        reason="Git for Windows is not installed, so Claude Code runs commands in PowerShell. Forge3D works with either.",
        fix="Install Git for Windows (https://git-scm.com/download/win) if you want Claude Code to use Bash.",
    )


def probe_agent(env: Env, agent: str) -> dict[str, Any]:
    """The chosen agent as the `agent` item every generating route requires."""
    item = probe_claude(env) if agent == "claude" else probe_codex(env)
    item = dict(item, id="agent", label=AGENTS[agent])
    item["detail"] = dict(item["detail"], agent=agent)
    return item


def probe_image_generation(agent: str, agent_item: dict[str, Any]) -> dict[str, Any]:
    """A splat from words alone needs a reference image the agent makes. Only Codex can."""
    gates = ("splat_text",)
    label = "Reference image from words"
    if agent == "codex" and agent_item["state"] in ("ready", "degraded"):
        return _item("image_generation", label, "ready", gates=gates, optional=True, detail={"agent": agent})
    if agent == "codex":
        return _item(
            "image_generation", label, "optional_missing", gates=gates, optional=True, detail={"agent": agent},
            reason="Codex makes the reference image, and Codex is not ready.", fix=agent_item["fix"],
        )
    return _item(
        "image_generation", label, "optional_missing", gates=gates, optional=True, detail={"agent": agent},
        reason=f"{AGENTS[agent]} cannot make images, so a splat from words alone needs Codex.",
        fix="Attach a reference image to the prompt, or choose Codex as the agent.",
    )


# --------------------------------------------------------------------- blender


def _locate(env: Env, finder: Callable[[], Path | None] | None, default: Callable[[], Path | None]) -> str | None:
    found = (finder or default)()
    return str(found) if found else None


def _default_find_blender() -> Path | None:
    from .blender import find_blender

    return find_blender()


def _default_find_godot() -> Path | None:
    from .doctor import find_godot

    return find_godot()


def probe_blender(env: Env, path: str | None = None) -> dict[str, Any]:
    gates = ("blender", "export")
    fix = "Install Blender 4.2 or later (blender.org or Steam), or set BLENDER_EXECUTABLE to blender.exe."
    path = path or _locate(env, env.find_blender, _default_find_blender)
    if not path:
        return _item("blender", "Blender", "missing", reason="Blender was not found.", fix=fix, gates=gates)
    version = parse_version(_first_line(env.run([path, "--version"])))
    if version is None:
        return _item(
            "blender", "Blender", "missing", path=path, gates=gates,
            reason="Blender was found but did not report a version.",
            fix=fix,
        )
    if _version_tuple(version)[:2] < MIN_BLENDER:
        return _item(
            "blender", "Blender", "degraded", version=version, path=path, gates=gates,
            reason=f"Blender {version} is older than 4.2, which the splat export extension needs.",
            fix="Install Blender 4.2 or later.",
        )
    return _item("blender", "Blender", "ready", version=version, path=path, gates=gates)


def blender_config_dirs(env: Env) -> list[str]:
    """Per-version Blender user config directories that exist on disk."""
    patterns: list[str] = []
    appdata = env.get("APPDATA")
    if appdata:
        patterns.append(os.path.join(appdata, "Blender Foundation", "Blender", "*"))
    home = env.get("HOME") or env.get("USERPROFILE")
    if home:
        patterns.append(os.path.join(home, ".config", "blender", "*"))
        patterns.append(os.path.join(home, "Library", "Application Support", "Blender", "*"))
    found: list[str] = []
    for pattern in patterns:
        found.extend(env.glob(pattern))
    return found


def probe_kiri(env: Env, blender: dict[str, Any]) -> dict[str, Any]:
    gates = ("export",)
    fix = (
        "In Blender open Edit > Preferences > Get Extensions, search for \"3DGS Render by KIRI Engine\" "
        "and install it. Splat-to-Blend export needs it; GLB and FBX exports do not."
    )
    if blender["state"] in ("missing",):
        return _item(
            "kiri", "KIRI Engine extension", "missing", gates=gates,
            reason="Blender is not installed, so the KIRI Engine extension cannot be present.",
            fix=fix,
        )
    for config in blender_config_dirs(env):
        for pattern in (
            os.path.join(config, "extensions", "*", KIRI_EXTENSION_ID),
            os.path.join(config, "extensions", "*", KIRI_EXTENSION_ID, "__init__.py"),
        ):
            hits = env.glob(pattern)
            if hits:
                return _item("kiri", "KIRI Engine extension", "ready", path=hits[0], gates=gates)
    return _item(
        "kiri", "KIRI Engine extension", "missing", gates=gates,
        reason="The KIRI Engine extension was not found in Blender's user extensions.",
        fix=fix,
    )


def probe_blender_mcp(env: Env) -> dict[str, Any]:
    gates = ("blender",)
    for config in blender_config_dirs(env):
        hits = env.glob(os.path.join(config, "scripts", "addons", BLENDER_MCP_ADDON))
        if hits:
            return _item(
                "blender_mcp", "Blender MCP add-on", "ready", path=hits[0], gates=gates, optional=True,
                detail={"note": "Installed; whether it is enabled and its bridge is running is not checked."},
            )
    return _item(
        "blender_mcp", "Blender MCP add-on", "optional_missing", gates=gates, optional=True,
        reason="The Blender MCP add-on is not installed. Only the supervised live-inspection step uses it.",
        fix="Run scripts/setup.ps1 from a Forge3D checkout. Automated runs do not need it.",
    )


# ------------------------------------------------------------------ small tools


def _tool(
    env: Env, id: str, label: str, names: Sequence[str], gates: Sequence[str], fix: str, reason: str,
) -> dict[str, Any]:
    for name in names:
        found = env.which(name)
        if found:
            version = parse_version(_first_line(env.run([found, "--version"])))
            return _item(id, label, "ready", version=version, path=found, gates=gates, optional=True)
    return _item(id, label, "optional_missing", reason=reason, fix=fix, gates=gates, optional=True)


def probe_uv(env: Env) -> dict[str, Any]:
    return _tool(
        env, "uv", "uv", ("uv.exe", "uv"), ("blender",),
        "Install uv from https://docs.astral.sh/uv/ if you want the Blender MCP server.",
        "uv is not installed. Only the optional Blender MCP server uses it.",
    )


def probe_node(env: Env) -> dict[str, Any]:
    return _tool(
        env, "node", "Node.js", ("node.exe", "node"), ("godot",),
        "Install Node.js 22 or later if you want the Godot MCP server.",
        "Node.js is not installed. Only the optional Godot MCP server uses it.",
    )


def probe_godot(env: Env) -> dict[str, Any]:
    gates = ("godot",)
    path = _locate(env, env.find_godot, _default_find_godot)
    if not path:
        return _item(
            "godot", "Godot", "optional_missing", gates=gates, optional=True,
            reason="Godot was not found. It is only needed for the Review in Godot step.",
            fix="Install Godot 4.x and set GODOT_EXECUTABLE to its console executable, or put godot on PATH.",
        )
    version = parse_version(_first_line(env.run([path, "--version"])))
    if version is None:
        return _item(
            "godot", "Godot", "degraded", path=path, gates=gates, optional=True,
            reason="Godot was found but did not report a version.",
            fix="Check that GODOT_EXECUTABLE points at the Godot console executable.",
        )
    return _item("godot", "Godot", "ready", version=version, path=path, gates=gates, optional=True)


# ------------------------------------------------------------------- WSL and GPU

_SPLAT = ("splat",)


def _models_root_expr(env: Env) -> str:
    configured = env.get("FORGE3D_WSL_MODELS_DIR")
    if configured and configured.startswith("/"):
        return shlex.quote(configured.rstrip("/"))
    return '"$HOME/.local/share/forge3d/models"'


def wsl_probe_script(env: Env) -> str:
    """One shell script, one WSL round trip (a cold VM is slow to boot)."""
    model = MODELS["triposplat"]
    return "\n".join(
        [
            f"root={_models_root_expr(env)}",
            f'd="$root/{model.directory_name}"',
            'echo "distro=${WSL_DISTRO_NAME:-}"',
            'echo "venv=$([ -x "$d/.venv/bin/python" ] && echo 1 || echo 0)"',
            'echo "marker=$([ -f "$d/.forge3d-install-complete" ] && echo 1 || echo 0)"',
            'echo "rev=$(git -C "$d" rev-parse HEAD 2>/dev/null)"',
            'echo "weights_files=$(find "$d/ckpts" -type f -size +100M 2>/dev/null | wc -l)"',
            'echo "weights_bytes=$(du -sb "$d/ckpts" 2>/dev/null | cut -f1)"',
            'echo "uv=$(command -v uv >/dev/null 2>&1 && uv --version 2>/dev/null | head -1)"',
            'echo "git=$(command -v git >/dev/null 2>&1 && git --version 2>/dev/null | head -1)"',
            "echo \"gpu=$(nvidia-smi --query-gpu=name,memory.total,memory.free,driver_version "
            '--format=csv,noheader,nounits 2>/dev/null | head -1)"',
            "echo \"cuda=$(nvidia-smi 2>/dev/null | sed -n 's/.*CUDA Version: *\\([0-9.]*\\).*/\\1/p' | head -1)\"",
            'echo "free_kb=$(df -Pk "$HOME" 2>/dev/null | awk \'NR==2{print $4}\')"',
        ]
    )


def parse_wsl_probe(stdout: str) -> dict[str, str]:
    values: dict[str, str] = {}
    for line in stdout.replace("\x00", "").splitlines():
        key, sep, value = line.partition("=")
        if sep and re.fullmatch(r"[a-z_]+", key.strip()):
            values[key.strip()] = value.strip()
    return values


def run_in_linux(env: Env, script: str) -> tuple[str, CommandResult | None, str, str]:
    """Run a script where the splat route lives.

    Returns (kind, result, distro, problem). kind is `ok`, `no_wsl`, `no_distro`,
    `unsupported` or `failed`.
    """
    if env.platform == "windows":
        exe = env.get("FORGE3D_WSL_EXECUTABLE") or env.which("wsl.exe") or env.which("wsl")
        if not exe:
            return "no_wsl", None, "", "wsl.exe was not found"
        try:
            wsl = WSL(
                distro=env.get("FORGE3D_WSL_DISTRO"), runner=env.runner, executable_path=exe
            )
        except ToolNotFoundError as exc:
            return "no_distro", None, "", str(exc)
        try:
            return "ok", wsl.shell(script, timeout=_WSL_TIMEOUT, check=False), wsl.distro, ""
        except Forge3DError as exc:
            return "failed", None, wsl.distro, str(exc)
    if env.platform == "wsl":
        result = env.run(["bash", "-lc", script], timeout=_WSL_TIMEOUT)
        distro = env.get("WSL_DISTRO_NAME") or ""
        if result is None:
            return "failed", None, distro, "the probe script did not run"
        return "ok", result, distro, ""
    return "unsupported", None, "", ""


def probe_splat_stack(env: Env) -> list[dict[str, Any]]:
    """wsl, wsl_tools, cuda, triposplat, triposplat_weights, from one WSL round trip."""
    model = MODELS["triposplat"]
    wsl_fix = "Install WSL2 with Ubuntu: run `wsl --install -d Ubuntu` in an administrator terminal, restart, then press Check again."

    def blocked_by_wsl(reason: str, fix: str, state: str = "missing") -> list[dict[str, Any]]:
        stub = "Needs a working WSL distribution first."
        return [
            _item("wsl", "WSL", state, reason=reason, fix=fix, gates=_SPLAT),
            _item("wsl_tools", "uv and git in WSL", "missing", reason=stub, fix=fix, gates=_SPLAT),
            _item("cuda", "NVIDIA CUDA in WSL", "missing", reason=stub, fix=fix, gates=_SPLAT),
            _item("triposplat", "TripoSplat install", "missing", reason=stub, fix=fix, gates=_SPLAT),
            _item("triposplat_weights", "TripoSplat model weights", "missing", reason=stub, fix=fix, gates=_SPLAT),
        ]

    kind, result, distro, problem = run_in_linux(env, wsl_probe_script(env))
    if kind == "no_wsl":
        return blocked_by_wsl("WSL is not installed.", wsl_fix)
    if kind == "no_distro":
        return blocked_by_wsl(
            "WSL is installed but has no usable Linux distribution." + (f" ({problem.splitlines()[-1]})" if problem else ""),
            wsl_fix,
        )
    if kind == "unsupported":
        return blocked_by_wsl(
            f"The splat route runs in WSL2 on Windows; this machine reports platform \"{env.platform}\".",
            "Run Forge3D on Windows with WSL2 and an NVIDIA GPU.",
        )
    if kind == "failed" or result is None or result.returncode != 0:
        detail = problem or (result.stderr.strip().splitlines()[-1] if result and result.stderr.strip() else "")
        return blocked_by_wsl(
            "WSL did not run the check" + (f": {detail}" if detail else "."),
            "Open a WSL terminal once to finish its setup, then press Check again.",
            state="degraded",
        )

    values = parse_wsl_probe(result.stdout)
    distro = values.get("distro") or distro
    items = [_item("wsl", "WSL", "ready", version=distro or None, detail={"distro": distro, "platform": env.platform}, gates=_SPLAT)]

    # uv and git inside WSL
    missing_tools = [name for name in ("uv", "git") if not values.get(name)]
    if missing_tools:
        items.append(
            _item(
                "wsl_tools", "uv and git in WSL", "missing", gates=_SPLAT,
                reason=f"{' and '.join(missing_tools)} not found inside WSL.",
                fix="In WSL run `curl -LsSf https://astral.sh/uv/install.sh | sh` for uv and `sudo apt install git` for git.",
                detail={"uv": values.get("uv", ""), "git": values.get("git", "")},
            )
        )
    else:
        items.append(
            _item(
                "wsl_tools", "uv and git in WSL", "ready", gates=_SPLAT,
                version=parse_version(values["uv"]),
                detail={"uv": values["uv"], "git": values["git"]},
            )
        )

    # GPU
    gpu = [part.strip() for part in values.get("gpu", "").split(",")]
    cuda_fix = (
        "Install or update the NVIDIA Windows driver (it provides CUDA to WSL2); do not install a Linux driver inside WSL."
    )
    if len(gpu) < 4 or not gpu[0]:
        items.append(
            _item(
                "cuda", "NVIDIA CUDA in WSL", "missing", gates=_SPLAT,
                reason="nvidia-smi found no NVIDIA GPU inside WSL.", fix=cuda_fix,
            )
        )
    else:
        name, total, free, driver = gpu[0], _int(gpu[1]), _int(gpu[2]), gpu[3]
        need_mib = model.vram_gb * 1024
        detail = {
            "gpu": name, "vram_total_mib": total, "vram_free_mib": free,
            "driver": driver, "cuda": values.get("cuda") or None, "needs_vram_gb": model.vram_gb,
        }
        if total is not None and total < need_mib:
            items.append(
                _item(
                    "cuda", "NVIDIA CUDA in WSL", "degraded", gates=_SPLAT, version=values.get("cuda") or None, detail=detail,
                    reason=f"{name} has {total // 1024} GB of VRAM; TripoSplat needs about {model.vram_gb} GB.",
                    fix="Use a GPU with at least 8 GB, or lower the Gaussian count and expect failures.",
                )
            )
        elif free is not None and free < need_mib:
            items.append(
                _item(
                    "cuda", "NVIDIA CUDA in WSL", "degraded", gates=_SPLAT, version=values.get("cuda") or None, detail=detail,
                    reason=f"Only {free // 1024} GB of VRAM is free right now; TripoSplat needs about {model.vram_gb} GB.",
                    fix="Close other GPU programs (games, Blender renders, other models) and check again.",
                )
            )
        else:
            items.append(
                _item("cuda", "NVIDIA CUDA in WSL", "ready", gates=_SPLAT, version=values.get("cuda") or None, detail=detail)
            )

    # TripoSplat install and weights
    installed = values.get("venv") == "1"
    complete = values.get("marker") == "1"
    install_detail = {
        "revision": values.get("rev") or None,
        "free_disk_gb": _kb_to_gb(values.get("free_kb")),
    }
    install_fix = "Run `forge3d models install triposplat` (several GB of downloads; the Setup panel will do this for you in a later release)."
    if not installed:
        items.append(
            _item(
                "triposplat", "TripoSplat install", "missing", gates=_SPLAT, detail=install_detail,
                reason="TripoSplat is not installed in WSL.", fix=install_fix,
            )
        )
    elif not complete:
        items.append(
            _item(
                "triposplat", "TripoSplat install", "degraded", gates=_SPLAT, detail=install_detail,
                reason="TripoSplat is partly installed (the install did not finish).",
                fix="Run `forge3d models install triposplat` again; it resumes.",
            )
        )
    else:
        items.append(
            _item(
                "triposplat", "TripoSplat install", "ready", gates=_SPLAT,
                version=(values.get("rev") or "")[:12] or None, detail=install_detail,
            )
        )
    weights = _int(values.get("weights_files")) or 0
    weights_detail = {"files_over_100mb": weights, "bytes": _int(values.get("weights_bytes"))}
    if weights > 0:
        items.append(_item("triposplat_weights", "TripoSplat model weights", "ready", gates=_SPLAT, detail=weights_detail))
    else:
        items.append(
            _item(
                "triposplat_weights", "TripoSplat model weights", "missing", gates=_SPLAT, detail=weights_detail,
                reason="No model weights were found under TripoSplat/ckpts in WSL.",
                fix="Run `forge3d models install triposplat`; it downloads the weights.",
            )
        )
    return items


def _int(value: str | None) -> int | None:
    try:
        return int(str(value).strip())
    except (TypeError, ValueError):
        return None


def _kb_to_gb(value: str | None) -> float | None:
    kb = _int(value)
    return round(kb / 1024 / 1024, 1) if kb is not None else None


# ------------------------------------------------------------------------ routes


def compute_routes(capabilities: Mapping[str, Mapping[str, Any]]) -> dict[str, dict[str, Any]]:
    routes: dict[str, dict[str, Any]] = {}
    for key, spec in ROUTES.items():
        blocked_by: list[str] = []
        degraded_by: list[str] = []
        for cap_id in spec["required"]:
            state = capabilities[cap_id]["state"]
            if state in ("missing", "signed_out", "optional_missing"):
                blocked_by.append(cap_id)
            elif state == "degraded":
                degraded_by.append(cap_id)
        for cap_id in spec["soft"]:
            if capabilities[cap_id]["state"] != "ready":
                degraded_by.append(cap_id)
        state = "blocked" if blocked_by else ("degraded" if degraded_by else "ready")
        # Optional dependencies missing is normal, not worth a warning state.
        if state == "degraded" and all(
            capabilities[c]["state"] == "optional_missing" for c in degraded_by
        ):
            state = "ready"
        reason = ""
        culprit = (blocked_by or degraded_by or [None])[0]
        if state != "ready" and culprit:
            reason = capabilities[culprit]["reason"]
        routes[key] = {
            "label": spec["label"],
            "state": state,
            "optional": spec["optional"],
            "reason": reason,
            "requires": list(spec["required"]),
            "soft": list(spec["soft"]),
            "blocked_by": blocked_by,
            "degraded_by": degraded_by,
        }
    return routes


# ------------------------------------------------------------------------ report


def collect(env: Env | None = None, agent: str | None = None) -> dict[str, Any]:
    env = env or Env()
    agent = agent or env.get("FORGE3D_AGENT") or DEFAULT_AGENT
    if agent not in AGENTS:
        agent = DEFAULT_AGENT
    items: list[dict[str, Any]] = []
    agent_item = probe_agent(env, agent)
    items.append(agent_item)
    items.append(probe_image_generation(agent, agent_item))
    if agent == "claude" and env.platform == "windows":
        items.append(probe_git_bash(env))
    blender = probe_blender(env)
    items.append(blender)
    items.append(probe_kiri(env, blender))
    items.append(probe_blender_mcp(env))
    items.append(probe_uv(env))
    items.append(probe_node(env))
    items.append(probe_godot(env))
    items.extend(probe_splat_stack(env))
    capabilities = {item["id"]: item for item in items}
    return {
        "schema": SCHEMA_VERSION,
        "forge3d_version": __version__,
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "agent": {"id": agent, "name": AGENTS[agent]},
        "platform": {
            "system": env.platform,
            "python": sys.version.split()[0],
            "release": _platform.release(),
        },
        "capabilities": capabilities,
        "routes": compute_routes(capabilities),
        "versions": {
            "forge3d": __version__,
            "agent": capabilities["agent"]["version"],
            "blender": capabilities["blender"]["version"],
            "godot": capabilities["godot"]["version"],
            "uv": capabilities["uv"]["version"],
            "node": capabilities["node"]["version"],
            "cuda": capabilities["cuda"]["version"],
            "wsl_distro": capabilities["wsl"]["version"],
        },
    }


def render_text(report: Mapping[str, Any]) -> str:
    lines = [f"Forge3D {report['forge3d_version']} on {report['platform']['system']}, agent {report['agent']['name']}"]
    for item in report["capabilities"].values():
        version = f" {item['version']}" if item["version"] else ""
        lines.append(f"[{item['state']:16}] {item['label']}{version}")
        if item["state"] != "ready":
            if item["reason"]:
                lines.append(f"                   {item['reason']}")
            if item["fix"]:
                lines.append(f"                   Fix: {item['fix']}")
    lines.append("")
    for key, route in report["routes"].items():
        lines.append(f"route {key}: {route['state']}" + (f" ({route['reason']})" if route["reason"] else ""))
    return "\n".join(lines)
