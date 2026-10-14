# Dimensio release packaging and troubleshooting

## Build a Windows release

```powershell
.\scripts\build_desktop.ps1
```

The script builds the Python command-line tool into `desktop\runtime\dimensio.exe`, installs the
locked npm tree, runs the desktop tests, compiles both pages, and packages the Electron app as
`desktop\dist-package\Dimensio-<version>-windows-x64.zip`, with the version read from
`desktop\package.json`. It then writes `instrumenta-release.json` with the exact ZIP byte size,
SHA-256, the `Dimensio.exe` entry point, the managed install strategy and minimum Instrumenta 0.8.0.

Inside the ZIP, `Dimensio.exe` carries `resources\bin\dimensio.exe`, the Blender tasks and scripts
in `resources\dimensio-toolkit`, the plugin in `resources\dimensio-plugin` and the Godot review
template in `resources\godot-template`.

GitHub Releases are canonical. Do not commit `node_modules`, `.venv`, `.tmp`, runtime executables,
Electron output, user runs, models, generated Godot imports, logs or caches.

## Release audit

1. Run `uv run --with pytest pytest -q`, and `npm test`, `npm run lint:copy` and `npm run build` in
   `desktop`.
2. Run the Blender and Godot headless smoke tests when those tools are available.
3. Build the release and run `desktop\runtime\dimensio.exe --version`.
4. Validate `instrumenta-release.json` and the ZIP through Instrumenta's release verifier.
5. Extract into an empty directory and confirm the declared `Dimensio.exe` exists.
6. Launch without a source checkout. Open a lesson and measure a model in Blender. In the Workshop,
   check that the chosen agent is found and signed in (Claude Code, or Codex with the Dimensio
   skill), run one local prompt, inspect a file, restart, and confirm the run is still there.
7. On a machine that had Forge3D, confirm the first start keeps the agent choice and recent
   projects, opens a `.forge3d` project, and shows Earlier runs.
8. Test a deliberately corrupt bundle and a failed first launch to prove rejection and rollback.
9. Complete the secret, generated-file, dependency-licence and redistribution audits before public
   publication. Keep every third-party notice.

## Troubleshooting

- Claude Code is missing or signed out: install it (`irm https://claude.ai/install.ps1 | iex`
  in PowerShell), run `claude` once to sign in, then press Check again on the Workshop's setup card.
  `DIMENSIO_CLAUDE_EXE` points at a copy somewhere else.
- Codex is missing: install or repair the Codex app. Dimensio searches PATH and the Codex app's
  bin folder and stores no credentials.
- Codex plugin mismatch: use the Repair action, restart Codex if another Codex client is open,
  and check again.
- Blender or Godot missing: install them separately, choose Blender in the course's Settings, or
  set `BLENDER_EXECUTABLE` or `GODOT_EXECUTABLE`. Large external tools are not bundled.
- WSL or CUDA unavailable: the TripoSplat route stays off, and the Blender route still works.
- Preview fails: use Reveal, validate the file, and read the run's transcript. Unsupported
  formats can still be opened with Open.
- Interrupted run: select it in the run list and Continue. It resumes the agent's stored session
  when that agent is still the chosen one, and starts a new session with the whole brief otherwise.
