---
needs: [rigid-bodies]
exercise: drape-a-tablecloth
watch: [ryan-king-cloth, blender-manual-physics-cloth-introduction]
sources:
  - Blender 5.2 Manual, "Cloth: Introduction" (https://docs.blender.org/manual/en/5.2/physics/cloth/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Cloth Settings", Presets and Quality Steps (https://docs.blender.org/manual/en/5.2/physics/cloth/settings/index.html), read 2026-10-15
  - Blender 5.2 Manual, "Cloth Shape", Pin Group (https://docs.blender.org/manual/en/5.2/physics/cloth/settings/shape.html), read 2026-10-15
  - Blender 5.2 Manual, "Cloth Collisions", Object Collisions and Self-Collisions (https://docs.blender.org/manual/en/5.2/physics/cloth/settings/collisions.html), read 2026-10-15
  - Blender 5.2 Manual, "Collision" (https://docs.blender.org/manual/en/5.2/physics/collision.html), read 2026-10-15
  - Blender 5.2 Manual, "Baking Physics Simulations" (https://docs.blender.org/manual/en/5.2/physics/baking.html), read 2026-10-15
  - Blender 5.2 Manual, "Subdivide" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/subdivide.html), read 2026-10-15
  - Blender 5.2 Manual, "Vertex Groups", Assign (https://docs.blender.org/manual/en/5.2/modeling/meshes/properties/vertex_groups/vertex_groups.html), read 2026-10-15
  - Blender 5.2 Manual, "Modifiers: Introduction", Apply (https://docs.blender.org/manual/en/5.2/modeling/modifiers/introduction.html), read 2026-10-15
  - Blender 5.2 release notes, Physics, the experimental Cloth Dynamics modifier (https://developer.blender.org/docs/release_notes/5.2/physics/), read 2026-10-15
  - Blender 5.2.2, the cloth-table starter's tablecloth subdivided with 30 cuts, Cloth with default settings and Self Collisions, Collision on the table and floor, draped by frame 80, checked 2026-10-15
---

# Cloth

Cloth physics drops a mesh over other objects and lets it fold, hang and sway, which is faster than modelling every crease by hand. In this lesson you'll drape a tablecloth over a table, pin cloth that hangs, and bake the result. Then you'll keep the drape as an ordinary mesh for a game.

![A tablecloth draped over a low-poly table: flat across the top and hanging down the four sides in soft folds.](example)

## Steps

1. **Cut the cloth.** Cloth bends only where it has vertices. Select the tablecloth, press `Tab` and choose Edge > Subdivide. In the Adjust Last Operation panel, set Number of Cuts to 30. Press `Tab` again.

   ![Left, a one-face sheet lying stiff across the table. Right, the sheet with 30 cuts folding over the edges.](vertices)

2. **Add Cloth.** In the Physics tab, click Cloth. The presets menu in the Cloth panel's header sets the cloth up as Cotton, Denim, Leather, Rubber or Silk. Quality Steps, 5 by default, is how many steps it works out for each frame.

   ![The Physics tab with Cloth on, the Cloth panel showing Quality Steps 5, and its presets menu open with Cotton picked out.](add-cloth)

3. **Make it collide.** Select the table and click Collision in its Physics tab, then do the same for the floor. In the cloth's Collisions panel, tick Self Collisions so its folds don't pass through each other. Press `Space` to drop it.

   ![The table with its collision zone outlined and the cloth above it, beside the cloth's Collisions panel with Object Collisions and Self Collisions ticked.](collide)

4. **Pin cloth that hangs.** For a banner or a curtain, select the top row of vertices in Edit Mode. In the Object Data tab, add a vertex group and click Assign. Choose that group as Pin Group in Cloth > Shape. Pinned vertices stay put.

   ![A banner hanging from a pole, its top row of vertices picked out, beside Cloth > Shape with Pin Group set to pin.](pin)

5. **Bake and keep the shape.** Save the file and click Bake in Cloth > Cache. To keep the drape for a game, go to a frame where the cloth has settled. Then press `Ctrl+A` over the Cloth modifier in the Modifiers tab to apply it.

   ![The Cloth Cache panel with Simulation Start 1, End 250 and Bake, beside Modifiers tab, Cloth, Apply.](bake)

Blender 5.2 also has an experimental Cloth Dynamics modifier built from nodes. This lesson uses the Cloth physics in the Physics tab.

## Common mistake

![Left, Collision added to the cloth: the cloth lies flat on the floor under the table. Right, Collision on the table: the cloth drapes over it.](mistake)

Collision goes on the objects the cloth lands on, not on the cloth. With Collision only on the tablecloth, the table has none, and the cloth falls straight through it to the floor. Add Collision to the table and the floor instead.

## Checking your model

Play to frame 80 and look at the tablecloth:

1. It lies flat on the top and hangs down every side.
2. No corner of the table pokes through the cloth.
3. The folds stay apart, with no cloth passing through itself.
4. After applying, the Modifiers tab is empty and the drape stays.
