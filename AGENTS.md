# Dimensio repository guidance

- Dimensio teaches Blender: a course app (`desktop/src/course/`, content in `content/`) and the Workshop (`desktop/src/renderer/`), where an agent builds a model from a prompt. Claude Code is the default agent and Codex is an option. `docs/course/PLAN.md` is the plan; raise a disagreement with it rather than guess.
- Every word a learner sees follows `docs/course/WRITING.md`. Run `npm run lint:copy` in `desktop/` after changing course copy.
- Keep Dimensio a personal, local tool. The Electron desktop is a local client for the agents, run history, previews and guarded file actions; do not add a network daemon, hosted web UI or generic workflow framework.
- Treat Blender `.blend` files as editable source and GLB files as runtime exports.
- Use the direct Blender MCP for interactive inspection and supervised viewport edits. Use reviewed scripts under `blender/` for repeatable processing.
- Use the direct Godot MCP for import, scene, runtime, screenshot and debugger validation.
- Run AI inference in isolated WSL environments. Do not install ML packages into Blender's embedded Python.
- Never upload an input to a cloud 3D provider without explicit per-job approval.
- Never overwrite an existing asset output. Create a numbered version.
- Use meters. Keep Blender's Z-up source convention and validate the glTF conversion in Godot.
- Prefer Python standard library code in the host CLI. Add dependencies only when they materially reduce risk.
- Dimensio was Forge3D. Code that reads Forge3D's names (`FORGE3D_*` variables, `.forge3d` projects, Forge3D's folders and Blender markers) is there on purpose, for people upgrading; `desktop/src/lib/forge3d-compat.cjs` and `src/dimensio/environment.py` list it.
- Run `dimensio doctor`, the Python test suite, `npm test` and `npm run build` in `desktop/`, a Blender headless smoke test and a Godot headless smoke test before handoff.
