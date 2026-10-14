[CmdletBinding()]
param(
    [switch]$InstallModels,
    [switch]$InstallPersonalPlugin,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptRoot
$blenderExe = $env:BLENDER_EXECUTABLE
# Godot is optional: GODOT_EXECUTABLE, then godot/godot4 on PATH. Without it the Godot steps are skipped.
$godotExe = $env:GODOT_EXECUTABLE
if (-not $godotExe) {
    $godotCommand = Get-Command godot, godot4 -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($godotCommand) { $godotExe = $godotCommand.Source }
}
$uvExe = Join-Path $env:USERPROFILE ".local\bin\uv.exe"
$uvxExe = Join-Path $env:USERPROFILE ".local\bin\uvx.exe"
$addonSource = Join-Path $repoRoot "vendor\blender-mcp\addon.py"

function Invoke-Step {
    param(
        [Parameter(Mandatory = $true)][string]$Description,
        [Parameter(Mandatory = $true)][scriptblock]$Action
    )

    Write-Host "==> $Description"
    if (-not $DryRun) {
        & $Action
    }
}

if (-not $blenderExe) {
    $blenderCommand = Get-Command blender -ErrorAction SilentlyContinue
    if ($blenderCommand) { $blenderExe = $blenderCommand.Source }
}
if (-not $blenderExe) {
    $standalone = Get-ChildItem "C:\Program Files\Blender Foundation\Blender *\blender.exe" `
        -File -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -First 1
    if ($standalone) { $blenderExe = $standalone.FullName }
}
if (-not $blenderExe) {
    $steam = "C:\Program Files (x86)\Steam\steamapps\common\Blender\blender.exe"
    if (Test-Path -LiteralPath $steam) { $blenderExe = $steam }
}

foreach ($requiredPath in @($blenderExe, $uvExe, $uvxExe, $addonSource)) {
    if (-not (Test-Path -LiteralPath $requiredPath)) {
        throw "Required path is missing: $requiredPath"
    }
}

Invoke-Step "Install the Dimensio CLI as an editable uv tool" {
    & $uvExe tool install --force --editable $repoRoot
    if ($LASTEXITCODE -ne 0) { throw "uv tool install failed." }
    & $uvExe tool update-shell
    if ($LASTEXITCODE -ne 0) { throw "uv could not add its tool directory to PATH." }
    $env:PATH = "$(Join-Path $env:USERPROFILE '.local\bin');$env:PATH"
}

Invoke-Step "Install the pinned Blender MCP add-on" {
    $installScript = @"
import bpy, shutil
from pathlib import Path
source = Path(r'$addonSource')
target_dir = Path(bpy.utils.user_resource('SCRIPTS', path='addons', create=True))
target = target_dir / 'blender_mcp.py'
shutil.copy2(source, target)
bpy.ops.preferences.addon_enable(module='blender_mcp')
bpy.ops.wm.save_userpref()
print(f'Dimensio: installed Blender MCP to {target}')
"@
    & $blenderExe --background --factory-startup --python-expr $installScript
    if ($LASTEXITCODE -ne 0) { throw "Blender add-on installation failed." }
}

Invoke-Step "Cache the pinned Blender MCP server" {
    $oldTelemetry = $env:DISABLE_TELEMETRY
    try {
        $env:DISABLE_TELEMETRY = "true"
        & $uvExe run --no-project --python 3.11 --with "blender-mcp==1.6.5" python -c `
            "import importlib.metadata; print(importlib.metadata.version('blender-mcp'))"
        if ($LASTEXITCODE -ne 0) { throw "Blender MCP cache warm-up failed." }
    }
    finally {
        $env:DISABLE_TELEMETRY = $oldTelemetry
    }
}

Invoke-Step "Cache the pinned Godot MCP server" {
    & npm cache add "@npgamedev/godot-mcp-server@1.0.0"
    if ($LASTEXITCODE -ne 0) { throw "Godot MCP npm cache warm-up failed." }
}

if ($godotExe -and (Test-Path -LiteralPath $godotExe)) {
    Invoke-Step "Initialize the Godot review project and MCP toolkit" {
        & $godotExe --headless --editor --path (Join-Path $repoRoot "godot") --import
        if ($LASTEXITCODE -ne 0) { throw "Godot review project initialization failed." }
    }
} else {
    Write-Host "==> Godot not found; skipping the optional Godot review project (set GODOT_EXECUTABLE to enable it)"
}

if ($InstallModels) {
    Invoke-Step "Install the local TripoSplat visual reconstruction baseline in WSL" {
        $dimensioExe = Join-Path $env:USERPROFILE ".local\bin\dimensio.exe"
        if (-not (Test-Path -LiteralPath $dimensioExe)) {
            throw "The installed Dimensio CLI was not found: $dimensioExe"
        }
        & $dimensioExe models install triposplat
        if ($LASTEXITCODE -ne 0) { throw "TripoSplat installation failed." }
    }
}

if ($InstallPersonalPlugin) {
    Invoke-Step "Install the personal Dimensio Codex plugin" {
        & (Join-Path $scriptRoot "install-personal-plugin.ps1")
        if ($LASTEXITCODE -ne 0) { throw "Personal plugin installation failed." }
    }
}

Write-Host ""
Write-Host "Dimensio setup complete."
Write-Host "Run: dimensio doctor"
Write-Host "Restart Codex so it loads .codex/config.toml and the Dimensio plugin."
Write-Host "Launch Blender for MCP with: scripts\start-blender-mcp.ps1"
