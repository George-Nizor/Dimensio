from __future__ import annotations

import json
import ntpath
from pathlib import Path

import pytest

from forge3d import capabilities as caps
from forge3d.cli import main
from forge3d.errors import CommandError
from forge3d.process import CommandResult


class FakeRunner:
    """Maps a command-prefix match to a canned result; records every call."""

    def __init__(self, rules: list[tuple[str, CommandResult | Exception]]) -> None:
        self.rules = rules
        self.calls: list[list[str]] = []

    def run(self, command, *, timeout=None, check=True, **_):
        text = " ".join(command)
        self.calls.append(list(command))
        for needle, outcome in self.rules:
            if needle in text:
                if isinstance(outcome, Exception):
                    raise outcome
                return outcome
        return CommandResult(tuple(command), 127, "", "not faked")


def ok(out: str = "", code: int = 0, err: str = "") -> CommandResult:
    return CommandResult((), code, out, err)


WSL_OUT = """distro=Ubuntu-24.04
venv=1
marker=1
rev=a78fa12d06dbdeadbeef
weights_files=4
weights_bytes=9000000000
uv=uv 0.8.3
git=git version 2.43.0
gpu=NVIDIA GeForce RTX 5080, 16303, 14000, 581.15
cuda=12.9
free_kb=104857600
"""


def make_env(platform="windows", *, rules=None, which=None, files=(), globs=None, environ=None, blender=None, godot=None):
    which = which or {}
    globs = globs or {}
    return caps.Env(
        platform=platform,
        environ=environ or {},
        runner=FakeRunner(rules or []),
        which=lambda name: which.get(name),
        glob=lambda pattern: list(globs.get(pattern, [])),
        is_file=lambda path: path in files,
        find_blender=lambda: blender,
        find_godot=lambda: godot,
    )


CLAUDE_EXE = ntpath.join("C:/Users/u", ".local", "bin", "claude.exe")
GIT_BASH = ntpath.join("C:\\Program Files", "Git", "bin", "bash.exe")


def full_windows_env(**overrides):
    rules = [
        ("claude.exe --version", ok("2.1.299 (Claude Code)")),
        ("claude.exe auth status", ok('{\n  "loggedIn": true,\n  "authMethod": "claude.ai"\n}')),
        ("codex.exe --version", ok("codex-cli 0.159.2")),
        ("codex.exe login status", ok("Logged in using ChatGPT")),
        ("blender.exe --version", ok("Blender 5.0.1\n\tbuild date: x")),
        ("godot.exe --version", ok("4.6.2.stable.mono.official.abc")),
        ("node.exe --version", ok("v22.1.0")),
        ("uv.exe --version", ok("uv 0.8.3")),
        ("--list --quiet", ok("Ubuntu-24.04\x00\n")),
        ("--exec bash -lc", ok(WSL_OUT)),
    ]
    which = {
        "codex.exe": "C:/codex.exe", "wsl.exe": "wsl.exe", "node.exe": "node.exe", "uv.exe": "uv.exe",
    }
    appdata = "C:/Users/u/AppData/Roaming"
    globs = {
        f"{appdata}/Blender Foundation/Blender/*": [f"{appdata}/Blender Foundation/Blender/5.0"],
        f"{appdata}/Blender Foundation/Blender/5.0/extensions/*/{caps.KIRI_EXTENSION_ID}": ["kiri-dir"],
        f"{appdata}/Blender Foundation/Blender/5.0/scripts/addons/blender_mcp.py": ["mcp.py"],
    }
    kwargs = dict(
        rules=rules, which=which, globs=globs, environ={"APPDATA": appdata, "USERPROFILE": "C:/Users/u"},
        files=(CLAUDE_EXE, GIT_BASH), blender=Path("blender.exe"), godot=Path("godot.exe"),
    )
    kwargs.update(overrides)
    return make_env(**kwargs)


def test_detect_platform():
    assert caps.detect_platform("Windows", "10", {}) == "windows"
    assert caps.detect_platform("Linux", "6.6-microsoft-standard-WSL2", {}) == "wsl"
    assert caps.detect_platform("Linux", "6.1", {"WSL_DISTRO_NAME": "Ubuntu"}) == "wsl"
    assert caps.detect_platform("Linux", "6.1", {}) == "linux"
    assert caps.detect_platform("Darwin", "23", {}) == "macos"


def test_everything_ready_on_windows():
    report = caps.collect(full_windows_env(), agent="codex")
    states = {k: v["state"] for k, v in report["capabilities"].items()}
    assert set(states.values()) == {"ready"}, states
    assert {r["state"] for r in report["routes"].values()} == {"ready"}
    assert report["agent"] == {"id": "codex", "name": "Codex"}
    assert report["capabilities"]["agent"]["label"] == "Codex"
    assert report["versions"]["blender"] == "5.0.1"
    assert report["versions"]["godot"] == "4.6.2"
    assert report["versions"]["agent"] == "0.159.2"
    assert report["versions"]["cuda"] == "12.9"
    assert report["versions"]["wsl_distro"] == "Ubuntu-24.04"
    assert report["capabilities"]["cuda"]["detail"]["vram_free_mib"] == 14000
    json.dumps(report)


def test_claude_code_is_the_default_agent_and_routes_require_it():
    report = caps.collect(full_windows_env())
    assert report["agent"] == {"id": "claude", "name": "Claude Code"}
    agent = report["capabilities"]["agent"]
    assert (agent["state"], agent["label"], agent["version"], agent["path"]) == ("ready", "Claude Code", "2.1.299", CLAUDE_EXE)
    assert agent["detail"]["agent"] == "claude"
    assert "codex" not in report["capabilities"]
    assert report["versions"]["agent"] == "2.1.299"
    assert report["capabilities"]["git_bash"]["state"] == "ready"
    for route in ("splat", "blender", "splat_text"):
        assert "agent" in report["routes"][route]["requires"]
    assert "codex" not in json.dumps(report["routes"])
    assert report["routes"]["splat"]["state"] == "ready"
    assert report["routes"]["blender"]["state"] == "ready"


def test_a_splat_from_words_alone_needs_codex_and_says_so():
    report = caps.collect(full_windows_env())
    route = report["routes"]["splat_text"]
    assert route["state"] == "blocked" and route["blocked_by"] == ["image_generation"]
    assert route["reason"] == "Claude Code cannot make images, so a splat from words alone needs Codex."
    item = report["capabilities"]["image_generation"]
    assert item["optional"] is True and "Attach a reference image" in item["fix"]
    with_codex = caps.collect(full_windows_env(), agent="codex")
    assert with_codex["routes"]["splat_text"]["state"] == "ready"


def test_the_agent_comes_from_the_flag_then_the_environment():
    env = full_windows_env(environ={"APPDATA": "C:/A", "USERPROFILE": "C:/Users/u", "FORGE3D_AGENT": "codex"})
    assert caps.collect(env)["agent"]["id"] == "codex"
    assert caps.collect(env, agent="claude")["agent"]["id"] == "claude"
    odd = full_windows_env(environ={"USERPROFILE": "C:/Users/u", "FORGE3D_AGENT": "gemini"})
    assert caps.collect(odd)["agent"]["id"] == "claude"


def test_claude_is_looked_for_in_order_and_sign_in_is_auth_status():
    environ = {"DIMENSIO_CLAUDE_EXE": "D:/c.exe", "USERPROFILE": "C:/Users/u", "APPDATA": "C:/A"}
    npm = ntpath.join("C:/A", "npm", "claude.cmd")
    assert caps.find_claude(make_env(environ=environ, files=("D:/c.exe", CLAUDE_EXE))) == "D:/c.exe"
    assert caps.find_claude(make_env(environ=environ, files=(CLAUDE_EXE,))) == CLAUDE_EXE
    assert caps.find_claude(make_env(environ=environ, which={"claude.cmd": "C:/bin/claude.cmd"})) == "C:/bin/claude.cmd"
    assert caps.find_claude(make_env(environ=environ, files=(npm,))) == npm
    assert caps.find_claude(make_env(environ=environ)) is None

    missing = caps.probe_claude(make_env())
    assert missing["state"] == "missing" and "install.ps1" in missing["fix"]
    assert "install.sh" in caps.probe_claude(make_env("linux"))["fix"]
    signed_out = make_env(
        which={"claude.exe": "C:/claude.exe"},
        rules=[("--version", ok("2.1.299 (Claude Code)")), ("auth status", ok('{"loggedIn": false}', code=1))],
    )
    item = caps.probe_claude(signed_out)
    assert item["state"] == "signed_out" and "`claude`" in item["fix"]
    timeout = make_env(
        which={"claude.exe": "C:/claude.exe"},
        rules=[("--version", ok("2.1.299 (Claude Code)")), ("auth status", CommandError(["x"], 124, "", "Timed out"))],
    )
    assert caps.probe_claude(timeout)["state"] == "degraded"


def test_missing_git_bash_is_a_note_not_a_block():
    env = full_windows_env(files=(CLAUDE_EXE,))
    report = caps.collect(env)
    item = report["capabilities"]["git_bash"]
    assert item["state"] == "optional_missing" and item["optional"] is True
    assert "PowerShell" in item["reason"] and "git-scm.com" in item["fix"]
    assert report["routes"]["blender"]["state"] == "ready"
    assert report["routes"]["splat"]["state"] == "ready"
    found = make_env(environ={"CLAUDE_CODE_GIT_BASH_PATH": "E:/git/bin/bash.exe"}, files=("E:/git/bin/bash.exe",))
    assert caps.find_git_bash(found) == "E:/git/bin/bash.exe"
    via_path = make_env(which={"git.exe": "D:\\Git\\cmd\\git.exe"}, files=("D:\\Git\\bin\\bash.exe",))
    assert caps.find_git_bash(via_path) == "D:\\Git\\bin\\bash.exe"
    assert "git_bash" not in caps.collect(full_windows_env(), agent="codex")["capabilities"]


def test_every_item_has_the_documented_fields():
    report = caps.collect(full_windows_env())
    for item in report["capabilities"].values():
        assert set(item) == {"id", "label", "state", "reason", "fix", "version", "path", "detail", "gates", "optional"}
        assert item["state"] in caps.STATES


def test_codex_missing_signed_out_and_timeout():
    env = make_env()
    item = caps.probe_codex(env)
    assert item["state"] == "missing" and item["fix"]

    signed_out = make_env(
        which={"codex": "/bin/codex"},
        rules=[("--version", ok("codex-cli 0.1.0")), ("login status", ok("Not logged in", code=1))],
    )
    item = caps.probe_codex(signed_out)
    assert item["state"] == "signed_out" and "codex login" in item["fix"]

    timeout = make_env(
        which={"codex": "/bin/codex"},
        rules=[("--version", ok("codex-cli 0.1.0")), ("login status", CommandError(["x"], 124, "", "Timed out"))],
    )
    assert caps.probe_codex(timeout)["state"] == "degraded"


def test_codex_found_under_localappdata():
    pattern = "C:/L/OpenAI/Codex/bin/**/codex.exe".replace("/", __import__("os").sep)
    env = make_env(
        environ={"LOCALAPPDATA": "C:/L"},
        globs={pattern: ["nonexistent-a/codex.exe", "nonexistent-b/codex.exe"]},
    )
    # Neither exists on disk, so mtimes tie and the first match wins; the point is that it is found.
    assert caps.find_codex(env) == "nonexistent-a/codex.exe"


def test_blender_states():
    assert caps.probe_blender(make_env())["state"] == "missing"
    old = make_env(rules=[("--version", ok("Blender 4.1.0"))], blender=Path("b"))
    item = caps.probe_blender(old)
    assert item["state"] == "degraded" and item["version"] == "4.1.0"
    garbage = make_env(rules=[("--version", ok("", code=1))], blender=Path("b"))
    assert caps.probe_blender(garbage)["state"] == "missing"


def test_kiri_and_mcp_missing():
    env = full_windows_env(globs={}, environ={"APPDATA": "C:/Users/u/AppData/Roaming", "USERPROFILE": "C:/Users/u"})
    report = caps.collect(env)
    assert report["capabilities"]["kiri"]["state"] == "missing"
    assert report["capabilities"]["blender_mcp"]["state"] == "optional_missing"
    # KIRI missing degrades export but does not block it; the MCP add-on is optional.
    assert report["routes"]["export"]["state"] == "degraded"
    assert report["routes"]["export"]["degraded_by"] == ["kiri"]
    assert report["routes"]["blender"]["state"] == "ready"


def test_godot_is_optional():
    env = full_windows_env(godot=None)
    report = caps.collect(env)
    assert report["capabilities"]["godot"]["state"] == "optional_missing"
    assert report["routes"]["godot"]["state"] == "blocked"
    assert report["routes"]["godot"]["optional"] is True
    assert report["routes"]["blender"]["state"] == "ready"


def test_wsl_missing_and_no_distro():
    env = full_windows_env(which={"codex.exe": "C:/codex.exe"})
    report = caps.collect(env)
    assert report["capabilities"]["wsl"]["state"] == "missing"
    assert report["routes"]["splat"]["state"] == "blocked"
    assert "wsl" in report["routes"]["splat"]["blocked_by"]

    rules = [("--list --quiet", ok("", code=0))]
    env = make_env(which={"wsl.exe": "wsl.exe"}, rules=rules)
    items = {i["id"]: i for i in caps.probe_splat_stack(env)}
    assert items["wsl"]["state"] == "missing"
    assert "distribution" in items["wsl"]["reason"]


def test_wsl_with_no_gpu_and_no_install():
    out = WSL_OUT.replace("gpu=NVIDIA GeForce RTX 5080, 16303, 14000, 581.15", "gpu=").replace("venv=1", "venv=0").replace("weights_files=4", "weights_files=0").replace("uv=uv 0.8.3", "uv=")
    rules = [("--list --quiet", ok("Ubuntu\n")), ("--exec bash -lc", ok(out))]
    items = {i["id"]: i for i in caps.probe_splat_stack(make_env(which={"wsl.exe": "wsl.exe"}, rules=rules))}
    assert items["wsl"]["state"] == "ready"
    assert items["cuda"]["state"] == "missing"
    assert items["triposplat"]["state"] == "missing"
    assert items["triposplat_weights"]["state"] == "missing"
    assert items["wsl_tools"]["state"] == "missing" and "uv" in items["wsl_tools"]["reason"]


def test_partial_install_and_low_vram():
    out = WSL_OUT.replace("marker=1", "marker=0").replace("14000", "3000")
    rules = [("--list --quiet", ok("Ubuntu\n")), ("--exec bash -lc", ok(out))]
    items = {i["id"]: i for i in caps.probe_splat_stack(make_env(which={"wsl.exe": "wsl.exe"}, rules=rules))}
    assert items["triposplat"]["state"] == "degraded"
    assert items["cuda"]["state"] == "degraded" and "free" in items["cuda"]["reason"]

    small = WSL_OUT.replace("16303, 14000", "6144, 6000")
    rules = [("--list --quiet", ok("Ubuntu\n")), ("--exec bash -lc", ok(small))]
    items = {i["id"]: i for i in caps.probe_splat_stack(make_env(which={"wsl.exe": "wsl.exe"}, rules=rules))}
    assert items["cuda"]["state"] == "degraded" and "6 GB" in items["cuda"]["reason"]


def test_wsl_command_failure_is_degraded_not_an_exception():
    rules = [("--list --quiet", ok("Ubuntu\n")), ("--exec bash -lc", ok("", code=1, err="boom"))]
    items = {i["id"]: i for i in caps.probe_splat_stack(make_env(which={"wsl.exe": "wsl.exe"}, rules=rules))}
    assert items["wsl"]["state"] == "degraded"
    assert "boom" in items["wsl"]["reason"] or "did not run" in items["wsl"]["reason"]


def test_running_inside_wsl_runs_the_script_directly():
    rules = [("bash -lc", ok(WSL_OUT))]
    env = make_env("wsl", rules=rules, environ={"WSL_DISTRO_NAME": "Ubuntu-24.04"})
    items = {i["id"]: i for i in caps.probe_splat_stack(env)}
    assert items["wsl"]["state"] == "ready"
    assert items["triposplat"]["state"] == "ready"
    assert not any("wsl.exe" in " ".join(c) for c in env.runner.calls)


def test_linux_and_mac_degrade_without_running_anything():
    for platform in ("linux", "macos"):
        env = make_env(platform)
        items = {i["id"]: i for i in caps.probe_splat_stack(env)}
        assert items["wsl"]["state"] == "missing" and platform in items["wsl"]["reason"]
        assert env.runner.calls == []


def test_models_dir_override_is_quoted_into_the_script():
    env = make_env(environ={"FORGE3D_WSL_MODELS_DIR": "/data/my models"})
    assert "'/data/my models'" in caps.wsl_probe_script(env)


def test_parse_version():
    assert caps.parse_version("Blender 5.0.1") == "5.0.1"
    assert caps.parse_version("4.6.2.stable.mono") == "4.6.2"
    assert caps.parse_version("v22.1") == "22.1"
    assert caps.parse_version("") is None


def test_cli_json_runs_here(capsys):
    assert main(["capabilities", "--json"]) == 0
    report = json.loads(capsys.readouterr().out)
    assert report["schema"] == caps.SCHEMA_VERSION
    assert set(report["routes"]) == {"splat", "splat_text", "blender", "export", "godot"}
    assert report["agent"]["id"] in ("claude", "codex")
    assert report["platform"]["system"] in ("windows", "wsl", "linux", "macos")


def test_cli_text_runs_here(capsys):
    assert main(["capabilities"]) == 0
    assert "route splat" in capsys.readouterr().out


def test_cli_takes_the_agent(capsys):
    assert main(["capabilities", "--json", "--agent", "codex"]) == 0
    assert json.loads(capsys.readouterr().out)["agent"]["id"] == "codex"
