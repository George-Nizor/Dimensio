---
needs: [rigid-bodies]
exercise: torch-and-tub
watch: [olav3d-fire-smoke, ryan-king-fluids]
sources:
  - 'Blender 5.2 Manual, "Fluid: Introduction", Workflow (https://docs.blender.org/manual/en/5.2/physics/fluid/introduction.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Physics: Introduction", Quick Effects (https://docs.blender.org/manual/en/5.2/physics/introduction.html), read 2026-10-15'
  - Blender 5.2 Manual, "Fluid Domain Settings", Resolution Divisions (https://docs.blender.org/manual/en/5.2/physics/fluid/type/domain/settings.html), read 2026-10-15
  - Blender 5.2 Manual, "Fluid Domain Cache", Type and Bake All (https://docs.blender.org/manual/en/5.2/physics/fluid/type/domain/cache.html), read 2026-10-15
  - Blender 5.2 Manual, "Fluid Flow", Flow Type and Flow Behavior (https://docs.blender.org/manual/en/5.2/physics/fluid/type/flow.html), read 2026-10-15
  - Blender 5.2 Manual, "Fluid Effector", Surface Thickness (https://docs.blender.org/manual/en/5.2/physics/fluid/type/effector.html), read 2026-10-15
  - 'Blender 5.2.2, Object > Quick Effects > Quick Smoke and Quick Liquid (5.2/scripts/startup/bl_operators/object_quick_effects.py): Smoke Style Smoke, Fire or Smoke & Fire, Resolution Divisions 32 and cache Type Replay by default; a ball of water dropped into a tub with walls 10 cm thick and baked at 32, checked 2026-10-15'
  - Godot Docs, "Particle systems (3D)" (https://docs.godotengine.org/en/stable/tutorials/3d/particles/index.html), read 2026-10-15
  - 'Olav3D Tutorials, "[4.2] Blender Tutorial: Quick And Realistic Fire And Smoke" (https://www.youtube.com/watch?v=RRU4MaqwBow), read 2026-10-15'
---

# Fluids, smoke and fire

Blender works out smoke, fire and water inside a box called a domain, which is how you get a flame that flickers or water that splashes. In this lesson you'll light a torch and drop water into a tub. You'll keep the resolution low, so each test takes seconds rather than minutes.

![Left, a torch burning inside its smoke domain. Right, a ball of water splashing into a tub inside its liquid domain.](example)

## Steps

1. **Light the torch.** Select the small cube on top of the torch and choose Object > Quick Effects > Quick Smoke. In the Adjust Last Operation panel, set Smoke Style to Fire. Blender adds a Smoke Domain round the cube. Press `Space`.

   ![The torch inside the Smoke Domain that Quick Smoke adds, beside Object, Quick Effects, Quick Smoke and Smoke Style set to Fire.](quick-smoke)

2. **Learn the three types.** Each object in a fluid simulation has a Type in its Physics tab's Fluid panel. A Domain is the box the fluid lives in. A Flow adds fluid. An Effector is an obstacle the fluid moves round.

   ![A domain box with a flow cube at the bottom giving off fire and smoke, and an effector wall the smoke moves round.](roles)

3. **Keep the resolution low.** Resolution Divisions, 32 by default, cuts the domain's longest side into that many cells called voxels. Test at 32 and raise it for the final bake. Scale the domain down to fit the flame with a little room.

   ![The same flame on a grid 16 cells tall and on one 32 cells tall: blocky, then finer.](resolution)

4. **Drop water into a tub.** Set the tub's Fluid Type to Effector. Put a sphere above it and choose Object > Quick Effects > Quick Liquid. The sphere's Flow Behavior, Geometry, turns its whole volume into water once. Scale the Liquid Domain round both.

   ![A ball above a tub inside the Liquid Domain, with the ball's Flow Behavior set to Geometry and the tub's Effector Type set to Collision.](liquid)

5. **Bake it.** Save the file. In each domain's Cache panel, set Type to All and click Bake All. The default, Replay, only stores frames as you play them.

   ![The domain's Cache panel with Frame Start 1, End 120, Type set to All and the Bake All button.](bake)

A .glb file carries meshes, not smoke, so a fire in a Godot game is usually made with Godot's own particle systems.

## Common mistake

![Left, the torch moved so its flow cube pokes out of the domain and the flame is cut off flat at the top. Right, the domain moved round the torch with room above it.](mistake)

A Flow only works inside its domain's box. If you move the torch after Quick Smoke, part of it can end up outside, and the flame stops short at the wall. Move or scale the domain to enclose the flow, with room above for the flame.

## Checking your model

Bake both and play them from frame 1:

1. The flame rises from the torch without touching the domain's top.
2. Smoke drifts up from the flame and fades.
3. The water lands inside the tub and stays in it.
4. Both domains use Resolution Divisions of 32.

If water leaks through the tub's walls, raise the tub's Surface Thickness in its Fluid settings.
