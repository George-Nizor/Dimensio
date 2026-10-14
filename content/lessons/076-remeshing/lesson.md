---
needs: [sculpt-mode]
exercise: join-and-remesh
watch: [grant-abbitt-multires-dyntopo-remesh, ryan-king-sculpt-remesh]
sources:
  - 'Blender 5.2 Manual, "Adaptive Resolution": the voxel remesher, Dyntopo and Multiresolution, and why Dyntopo and remeshing cannot be used together (https://docs.blender.org/manual/en/5.2/sculpt_paint/sculpting/introduction/adaptive.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Remesh": Voxel Size, R and Ctrl+R, and the Multiresolution limitation (https://docs.blender.org/manual/en/5.2/sculpt_paint/sculpting/tool_settings/remesh.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Dyntopo": the checkbox in Sidebar > Tool, Detail Size and Relative Detail (https://docs.blender.org/manual/en/5.2/sculpt_paint/sculpting/tool_settings/dyntopo.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Multiresolution Modifier": Subdivide, the levels and Apply Base (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/multiresolution.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Remeshing", the voxel remesher in Object Mode (https://docs.blender.org/manual/en/5.2/modeling/meshes/retopology.html), read 2026-10-15'
  - 'Blender 5.2.2, Sculpt Mode keymap (Alt+1 and Alt+2 for Multiresolution levels) and Dyntopo''s default of Relative Detail at 12 px; the mushroom-parts starter joined and remeshed at 0.03 m, checked 2026-10-15'
---

# Remeshing for sculpting

A brush needs enough faces to work with, and a sculpt made of separate parts has to become one surface before you can sculpt across it. In this lesson you'll remesh two joined shapes into one and add detail with Dyntopo where you sculpt. You'll also sculpt at several levels with the Multiresolution modifier.

![A mushroom whose cap and stem have been remeshed into one surface.](example)

## Steps

1. **Join the parts.** In Object Mode, click the stem, `Shift`+click the cap and press `Ctrl+J`. They are now one object, but the top of the stem still sits inside the cap as a separate shell.

   ![Cut through the middle: the cap and stem as two selected objects, then after Ctrl+J as one object with the stem's top still inside the cap.](join)

2. **Set the voxel size.** Switch to Sculpt Mode and press `R`. A grid shows the voxel size: move the mouse toward its middle for smaller voxels, then click. Smaller voxels keep more detail and make more faces.

   ![The R grid over the surface, one square for each voxel, beside the Remesh panel with Voxel Size 0.03 m.](voxel)

3. **Remesh.** Press `Ctrl+R`. Blender rebuilds the surface as even quads round the whole volume and drops anything inside it, so cap and stem become one skin. Smooth the join with `Shift`.

   ![Cut through the middle: before, two overlapping shells; after Ctrl+R, one outside skin of even steps with nothing inside.](remesh)

4. **Add detail with Dyntopo.** In the Sidebar's Tool tab, tick Dyntopo, short for dynamic topology. Brushes now split the faces under each stroke into smaller ones. Detail Size, 12 px at first, sets how small, so zoom in for finer detail.

   ![A grid of faces with a brush stroke across it, the faces under the stroke split into small ones, beside Dyntopo ticked with Detail Size 12 px.](dyntopo)

5. **Sculpt in levels.** On a clean mesh of quads, add a Multiresolution modifier and click Subdivide two or three times. While sculpting, `Alt+1` steps down a level for broad changes and `Alt+2` steps back up to the detail.

   ![The Multiresolution modifier at level 2 with its Subdivide button picked out, beside the keys Alt+1 for down and Alt+2 for up.](multires)

You can't use voxel remeshing and Dyntopo at once, and neither works on an object with a Multiresolution modifier.

## Common mistake

![Cut through a detailed surface: remeshed with a large voxel size the bumps are gone, with a small voxel size they stay.](mistake)

`Ctrl+R` rebuilds the whole surface at the voxel size, so any detail smaller than one voxel disappears. Remesh while you block out the big shapes, before the fine work, and press `R` to check the voxel size before every remesh.

## Checking your model

In Object Mode, check:

1. The cap and stem are one object in the Outliner.
2. With X-ray on (`Alt+Z`), no part of the stem shows inside the cap.
3. The cap meets the stem in a smooth curve, with no seam.
4. The Wireframe overlay shows smaller faces where you used Dyntopo.
