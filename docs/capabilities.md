# Capabilities report

`forge3d capabilities --json` answers one question before a run starts: which of the four routes
(splat, blender, export, godot) can this machine do, and for the ones it cannot, what is missing and
what should the person do. It is read-only: it never installs, writes or changes configuration. The
Setup panel in the desktop renders it; the code is `src/forge3d/capabilities.py`.

```text
forge3d capabilities [--json]     exit code 0 whenever a report was produced
```

It runs on Windows (the real target) and degrades on WSL/Linux/macOS: the report says which
`platform.system` it saw, and the splat stack is reported `missing` with a reason on platforms that
are not Windows or WSL. Inside WSL the splat checks run directly instead of through `wsl.exe`.

Cost: one process per tool for `--version`, plus **one** WSL round trip for the whole splat stack.
A cold WSL VM can take several seconds, so call it asynchronously and cache it. The desktop's
`capabilities-service.cjs` does both (60 s cache, shared in-flight call, 90 s timeout).

## Schema (version 1)

```jsonc
{
  "schema": 1,
  "forge3d_version": "0.3.0",
  "generated_at": "2026-10-06T21:14:03+00:00",
  "platform": { "system": "windows", "python": "3.12.3", "release": "10" },   // system: windows | wsl | linux | macos
  "capabilities": { "<id>": { /* item */ }, ... },    // ordered, keyed by id
  "routes": { "splat": { /* route */ }, "blender": {}, "export": {}, "godot": {} },
  "versions": {                                       // real detected versions, null when unknown
    "forge3d": "0.3.0", "codex": "0.159.2", "blender": "5.0.1", "godot": "4.6.2",
    "uv": "0.8.3", "node": "22.1.0", "cuda": "12.9", "wsl_distro": "Ubuntu-24.04"
  }
}
```

Use `versions.blender` and `versions.godot` in the status bar. Do not hard-code numbers.

### Item

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Stable key, see the table below. |
| `label` | string | Display name. |
| `state` | string | `ready`, `missing`, `signed_out`, `degraded`, `optional_missing`. |
| `reason` | string | One sentence on what is wrong. Empty when `ready`. |
| `fix` | string | What the person should do. Empty when `ready`. May name a terminal command. |
| `version` | string or null | Detected version (for `triposplat`, the first 12 characters of the git revision). |
| `path` | string or null | Executable or file that was found. |
| `detail` | object | Extra facts for display, e.g. `cuda.detail.vram_free_mib`, `triposplat.detail.free_disk_gb`. Optional keys; never required. |
| `gates` | string[] | Routes this item feeds (`splat`, `blender`, `export`, `godot`). |
| `optional` | bool | True for items that are never required for the main routes. |

States: `ready` works; `missing` absent or unusable and the route needs it; `signed_out` installed
but not signed in (Codex only); `degraded` present but with a problem (old Blender, low free VRAM,
half-finished install, a check that timed out); `optional_missing` absent and nothing core depends on
it.

### Capability ids

| id | What | Gates | Notes |
| --- | --- | --- | --- |
| `codex` | Codex CLI and sign-in | splat, blender | Sign-in is `codex login status` (exit 0). A timed-out check is `degraded`. |
| `blender` | Blender 4.2 or later | blender, export | `degraded` below 4.2 (extensions). Version from `blender --version`. |
| `kiri` | KIRI Engine Blender extension | export | Needed only for splat-to-Blend export. Looked up in Blender's user extensions folders. |
| `blender_mcp` | Blender MCP add-on | blender | `optional_missing` when absent. Supervised live inspection only; presence is checked, not whether its bridge is running. |
| `uv` | uv on the host | blender | Optional (Blender MCP server). |
| `node` | Node.js | godot | Optional (Godot MCP server). |
| `godot` | Godot 4.x | godot | Optional. `optional_missing` when absent. |
| `wsl` | WSL with a usable distribution | splat | `version` is the distro name. |
| `wsl_tools` | `uv` and `git` inside WSL | splat | |
| `cuda` | NVIDIA GPU visible inside WSL | splat | `degraded` when total VRAM is under 8 GB or free VRAM is under 8 GB right now. `detail`: `gpu`, `vram_total_mib`, `vram_free_mib`, `driver`, `cuda`, `needs_vram_gb`. |
| `triposplat` | TripoSplat checkout, venv and install marker | splat | `degraded` when partly installed. |
| `triposplat_weights` | Model weights present | splat | At least one file over 100 MB under `TripoSplat/ckpts`. The exact weight layout is not verified per file. |

When WSL itself is missing, the four items that depend on it are reported `missing` with the
reason "Needs a working WSL distribution first." so the panel can show one root cause.

### Route

```jsonc
{ "label": "Gaussian splat (TripoSplat)", "state": "blocked", "optional": false,
  "reason": "TripoSplat is not installed in WSL.",      // reason of the first culprit; empty when ready
  "requires": ["codex", "wsl", ...], "soft": [],
  "blocked_by": ["triposplat"], "degraded_by": [] }
```

| Route | Requires | Soft (only degrade) |
| --- | --- | --- |
| `splat` | codex, wsl, wsl_tools, cuda, triposplat, triposplat_weights | |
| `blender` | codex, blender | blender_mcp (an absent optional item does not change the state) |
| `export` | blender | kiri (missing: export is `degraded`, splat-to-Blend only) |
| `godot` | godot | node |

Route `state` is `ready`, `degraded` (usable with a caveat) or `blocked`. `godot` has
`optional: true`: a blocked Godot route should read as "not set up", not as an error.

## What the renderer should do

* Call `window.forge3d.capabilities({ force })` (main handler `forge3d:capabilities`). It resolves to
  either `{ ok: true, ...report }` or `{ ok: false, error, fix }` (the CLI could not run or printed
  something invalid). It never rejects.
* Show per-item rows from `capabilities` (state dot, label, `version`, and `reason` + `fix` when not
  `ready`), group by `gates`, and gate the Run button with `routes[route].state === "blocked"` for the
  route of the pending job. `degraded` should warn, not block.
* "Check again" is `force: true`.

## Not verified

Written and tested on WSL with faked tools. Not yet exercised on Windows: the `wsl.exe` path, the
Codex search under `%LOCALAPPDATA%\OpenAI\Codex\bin`, Blender and KIRI folder globs under
`%APPDATA%\Blender Foundation\Blender\<version>\extensions\<repo>\`, and the exact stdout of
`codex login status` on Windows (only its exit code is used).
