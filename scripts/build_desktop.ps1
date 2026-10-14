[CmdletBinding()]
param(
    [switch]$SkipTests,
    [switch]$SkipCli
)

$ErrorActionPreference = "Stop"
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptRoot
$desktopRoot = Join-Path $repoRoot "desktop"
$runtimeRoot = Join-Path $desktopRoot "runtime"
$packageRoot = Join-Path $desktopRoot "dist-package"
$temporaryRoot = Join-Path $repoRoot ".tmp\desktop-build"

foreach ($command in @("uv", "npm")) {
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
        throw "$command is required to build Dimensio."
    }
}

if (-not $SkipCli) {
    New-Item -ItemType Directory -Path $runtimeRoot -Force | Out-Null
    New-Item -ItemType Directory -Path $temporaryRoot -Force | Out-Null
    Push-Location $repoRoot
    & uv run --with "pyinstaller==6.19.0" pyinstaller `
        --noconfirm `
        --clean `
        --onefile `
        --name dimensio `
        --paths (Join-Path $repoRoot "src") `
        --distpath $runtimeRoot `
        --workpath (Join-Path $temporaryRoot "work") `
        --specpath (Join-Path $temporaryRoot "spec") `
        (Join-Path $repoRoot "scripts\dimensio_entry.py")
    $pyInstallerExitCode = $LASTEXITCODE
    Pop-Location
    if ($pyInstallerExitCode -ne 0) { throw "PyInstaller failed to build dimensio.exe." }
}

$npmSteps = [System.Collections.Generic.List[string]]::new()
$npmSteps.Add("npm ci")
if (-not $SkipTests) {
    $npmSteps.Add("npm test")
}
$npmSteps.Add("npm run dist")

if ($env:OS -eq "Windows_NT" -and $desktopRoot.StartsWith("\\")) {
    # cmd.exe cannot use a UNC current directory. pushd maps the share to a
    # temporary drive for this child process and removes it when cmd exits.
    $npmCommand = 'pushd "{0}" && {1} && popd' -f $desktopRoot, ($npmSteps -join " && ")
    & cmd.exe /d /s /c $npmCommand
    if ($LASTEXITCODE -ne 0) { throw "Dimensio desktop dependency, test, or package step failed." }
}
else {
    Push-Location $desktopRoot
    try {
        foreach ($npmStep in $npmSteps) {
            $npmArguments = $npmStep.Substring(4).Split(" ")
            & npm @npmArguments
            if ($LASTEXITCODE -ne 0) { throw "Dimensio desktop step failed: $npmStep" }
        }
    }
    finally {
        Pop-Location
    }
}

$desktopPackage = Get-Content -LiteralPath (Join-Path $desktopRoot "package.json") -Raw | ConvertFrom-Json
$releaseVersion = [string]$desktopPackage.version
if ([string]::IsNullOrWhiteSpace($releaseVersion)) {
    throw "Dimensio desktop package version is missing."
}
$assetName = "Dimensio-$releaseVersion-windows-x64.zip"
$asset = Join-Path $packageRoot $assetName
if (-not (Test-Path -LiteralPath $asset -PathType Leaf)) {
    $electronVersion = ($releaseVersion -split "\+", 2)[0]
    $electronAssetName = "Dimensio-$electronVersion-windows-x64.zip"
    $electronAsset = Join-Path $packageRoot $electronAssetName
    if ($electronAsset -ne $asset -and (Test-Path -LiteralPath $electronAsset -PathType Leaf)) {
        Move-Item -LiteralPath $electronAsset -Destination $asset
    }
}
if (-not (Test-Path -LiteralPath $asset -PathType Leaf)) {
    throw "Dimensio release archive was not created: $asset"
}
$assetInfo = Get-Item -LiteralPath $asset
$manifest = [ordered]@{
    schemaVersion = 1
    product = "dimensio"
    version = $releaseVersion
    platform = "windows-x64"
    minimumInstrumentaVersion = "0.8.0"
    installStrategy = "managed-bundle"
    bundle = [ordered]@{
        asset = $assetName
        size = $assetInfo.Length
        sha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $asset).Hash.ToLowerInvariant()
        entry = "Dimensio.exe"
    }
}
$manifestPath = Join-Path $packageRoot "instrumenta-release.json"
$manifestJson = $manifest | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText($manifestPath, "$manifestJson`n", [System.Text.UTF8Encoding]::new($false))
Write-Host "Dimensio release ready: $asset"
Write-Host "Instrumenta manifest: $manifestPath"