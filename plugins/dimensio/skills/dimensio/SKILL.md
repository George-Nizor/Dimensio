---
name: dimensio
description: Create, repair, texture, rig, animate, retarget, inspect, and export game-ready 3D assets through the local Dimensio CLI, Blender task library, Blender MCP, and Godot MCP. Use for natural-language requests to make or modify models, characters, materials, rigs, animations, collisions, LODs, Blender files, GLB/glTF assets, or Godot-ready 3D content.
---

# Dimensio

Turn the request into the best practical asset, not a description of how one might be made. Keep an editable `.blend` as the source of truth and validate game-facing output in Godot.

## Required workflow

1. Read [workflow-routing.md](references/workflow-routing.md). Load [mcp-review.md](references/mcp-review.md) before the first Blender or Godot review in a task.
2. When the Dimensio Workshop started the run (`DIMENSIO_STATE_ROOT` is set), it has already checked this machine and put the tool paths in the environment (`BLENDER_EXECUTABLE`, `GODOT_EXECUTABLE`, `DIMENSIO_WSL_MODELS_DIR`). Do not run `dimensio doctor` or `dimensio capabilities` then; start production. Outside the Workshop, run `dimensio capabilities --json` once and resolve actionable local failures before expensive work. If either required MCP is unavailable, report that constraint instead of claiming an MCP inspection occurred.
3. Clarify only an ambiguity that would materially change the asset. Otherwise infer scale, art direction, and sensible game budgets from the request and record them in the run.
4. Select the leanest capable route:
   - Build structured props, architecture, and mechanical forms procedurally in Blender.
   - Use TripoSplat for high-fidelity static visual props. Keep its Gaussian
     representation and pair it with a simple authored collision proxy.
     TripoSplat starts from one reference image. If you cannot generate
     images (Claude Code cannot), use an image the user attached; without one,
     build the asset in Blender instead.
   - Use image generation plus an explicitly selected conventional mesh backend
     only for organic or sculptural forms that genuinely suit image-to-mesh. A
     generated concept remains reference-only for structured hard-surface assets.
   - Use `dimensio process` for an existing model.
   - Use `dimensio rig`, `dimensio animate`, or `dimensio retarget` for character work.
   - For a stylized, chibi, rigid-piece, or pixel-rendered humanoid driven by an
     existing human animation, read [humanoid-retarget.md](references/humanoid-retarget.md)
     and use `dimensio humanoid-retarget` instead of local constraint copying.
5. Work in a new versioned output folder. Never overwrite an artist-owned `.blend`.
6. Use deterministic Blender tasks for repeatable mesh, UV, material, rig, animation, LOD, collision, and export operations.
7. Inspect the real result through Blender MCP. Review scene structure and a
   useful three-quarter viewport. For hard-surface assets, also inspect the
   opposite side and underside (or capture a recorded turntable); use
   additional animation poses when deformation affects quality.
8. Fix visible or structural defects and inspect again. Do not accept raw image-to-mesh output as game-ready.
9. Export GLB and run `dimensio validate`. For game-facing work, use Godot MCP to run or inspect the Dimensio review project and capture engine evidence.
10. Return direct paths to the `.blend`, `.glb`, textures, preview, and validation report. State remaining visible limitations plainly.

## Quality priorities

Judge in this order:

1. Silhouette, proportions, visual identity, and animation readability.
2. Correct scale, transforms, pivots, hierarchy, naming, and material appearance.
3. Clean shading, UVs, texture seams, topology, weights, deformation, and loop/root-motion behavior.
4. Triangle count, LODs, collision, and Godot import behavior.

Spend compute or add detail only when it improves the requested result. Prefer one strong route plus targeted corrections over generating many mediocre candidates.

TripoSR is a rejected route and must not be installed, selected, or suggested.
Its tested result had melted hard edges, repeated surface striations, incorrect
proportions/orientation, and severe non-manifold geometry. Structural repair did
not recover missing form. Rebuild structured hard-surface assets procedurally;
for genuinely sculptural assets, use clean references and a stronger accepted
local backend.

TripoSplat is the primary local image-faithful route for static visuals. It is
Gaussian data, not a polygon mesh: do not promise mesh editing, deformation,
rigging, GLB export, or native Godot import. Preserve PLY/SPLAT as the visual
master, import it into Blender through the reviewed KIRI scripts when useful,
and add only the collision/interaction proxy the game needs. Use a conventional
authored mesh whenever visible animation or part-level editing is required.

For commercial game work, never choose an image-to-mesh backend implicitly.
SPAR3D is the preferred local textured-reconstruction candidate only
after the user confirms current Stability Community License eligibility,
commercial registration, gated-model access, the revenue condition, and
AUP/attribution obligations. TripoSG and PartCrafter are
non-commercial/evaluation-only in Dimensio's bundled workflows because they
load BRIA RMBG-1.4. If no eligible local route exists, model in Blender.

## Safety and external services

- Save or duplicate the Blender working file before any broad MCP code execution.
- Prefer reviewed Blender task scripts. Use Blender MCP arbitrary Python only for a scoped operation that existing tasks cannot perform.
- Keep Blender MCP bound to `127.0.0.1` with telemetry disabled.
- Dimensio is local only. Never invoke Blender MCP's hosted image-to-3D or provider tools, never run `dimensio models cloud-run` or `cloud-estimate`, and never upload an asset or input anywhere.
- Do not expose secrets in prompts, reports, Blender text blocks, or committed files.
- Run one VRAM-heavy local inference job at a time. Check free VRAM rather than assuming a GPU size.
