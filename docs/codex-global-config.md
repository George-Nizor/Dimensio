# Does Dimensio need to write the user's global Codex config?

Investigated 2026-10-06 against `codex-cli 0.159.2` by generating the App Server JSON schema
(`codex app-server generate-json-schema --out <dir>`). Nothing was changed; this records what the
protocol allows. Nothing here was exercised against a live turn.

## What Dimensio writes today

`Repair` in `desktop/src/lib/runtime.cjs` renames `~/plugins/dimensio`, rewrites
`~/.agents/plugins/marketplace.json` and runs `codex plugin add`. Every Codex session on the machine
then sees the Dimensio plugin and its MCP servers.

A machine set up under Forge3D, Dimensio's earlier name, also has `~/plugins/forge3d` and the
`forge3d@personal` entry. Repair leaves them where they are; remove them by hand when Codex should
no longer offer the old skill.

## What the App Server offers per thread

* `thread/start` takes `config`: a free-form object ("config.toml overrides" for that thread).
  Per-thread `mcp_servers` should therefore be expressible without touching `~/.codex/config.toml`.
  Unverified: the exact key names the server honours, and whether MCP servers from `config` start.
* `thread/start` also takes `selectedCapabilityRoots` ("capability roots selected for this thread by
  the hosting platform"), and `skills/extraRoots/set` adds skill roots. Dimensio already passes the
  skill by path as a fallback (`main.cjs`, `refreshSkill`).
* `turn/start` takes `disabledPluginIds`, so a plugin can be switched off per turn.
* The `codex app-server` binary takes `-c key=value` overrides at launch, which applies to the whole
  server process only.
* There are also `config/value/write` and `config/batchWrite`, which write the global file. Dimensio
  should not call them.

## Recommendation

1. Try `selectedCapabilityRoots` (pointing at the bundled plugin folder) plus `config.mcp_servers`
   on `thread/start`. If a live turn can see the skill and call the MCP server, delete the Repair
   path's writes to `~/plugins` and `~/.agents`.
2. If that fails, keep Repair but make it a disclosed, explicit button (it already is) and stop it
   from running implicitly.
3. Either way, add a protocol check at start (`codex --version` is in the capabilities report) so a
   Codex update that moves these fields is noticed.
