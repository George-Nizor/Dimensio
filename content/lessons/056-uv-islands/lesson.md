---
needs: [unwrapping]
exercise: pack-chest-islands
watch: [blender-guru-donut-part-6, blender-manual-modeling-meshes-uv-editing]
sources:
  - 'Blender 5.2 Manual, "Editing UVs": Move, Rotate and Scale (G, R, S), Pin and Unpin (P, Alt+P), Pack Islands with Margin and Lock Pinned Islands, Average Island Scale (https://docs.blender.org/manual/en/5.2/modeling/meshes/uv/editing.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Selecting UVs": Select Linked (Ctrl+L, and L under the mouse), Select All by Trait > Overlap (https://docs.blender.org/manual/en/5.2/editors/uv/selecting.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "UV Operators": Follow Active Quads and why its active face must already have the right shape (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/uv.html), read 2026-10-15'
  - Blender 5.2 Manual, "Layout Workflow" (https://docs.blender.org/manual/en/5.2/modeling/meshes/uv/workflows/layout.html), read 2026-10-15
  - Blender Guru, "Blender Basic UV Unwrapping Tutorial (Donut Part 6)", chapters on straight lines and matching texel density (https://www.youtube.com/watch?v=yxAqN8TzFbo), chapter list read 2026-10-15
  - 'Blender 5.2.2, the UV menu (5.2/scripts/startup/bl_ui/space_image.py: Average Islands Scale, Pack Islands), and the exercise done on the chest-unwrapped starter: one face unwrapped, Follow Active Quads, Average Islands Scale, Pack Islands with Margin 0.01, checked 2026-10-15'
---

# Arranging UV islands

An unwrap rarely leaves the islands where you want them. Some come out too big or too small, curved strips come out bent, and islands overlap or run off the image. In this lesson you'll move and straighten islands, give them all the same size on the model and pack them into the square.

![A chest's UV map before and after. Before, islands of uneven size, a bent strip, islands overlapping and one running off the square. After, every island in proportion and packed inside the square with a gap round each.](example)

## Steps

1. **Select an island.** In the UV Editor, hover over an island and press `L` to select all of it. Move, rotate and scale it with `G`, `R` and `S`, as in the 3D Viewport. `Ctrl+L` selects the rest of any island you have part of.

   ![The chest's UV map with one half disc selected under the mouse after pressing L, beside the keys G, R and S.](select)

2. **Straighten a bent strip.** Select one face of the strip and press `U` > Unwrap Angle Based: alone, it unwraps as a true rectangle. Keep it selected, hover over the rest of the strip and press `L`, then choose `U` > Follow Active Quads.

   ![Left, the lid's strip bent into an arc, with one of its faces unwrapped on its own as a rectangle. Right, after Follow Active Quads, the whole strip in a straight line.](straighten)

3. **Even out the sizes.** Texel density is how many pixels of the image cover a metre of the model. Select all with `A` and choose UV > Average Islands Scale. It scales each island to its size on the model, so the density matches everywhere.

   ![Left, islands at uneven sizes, with the body's sides too big and its top and bottom too small. Right, after Average Islands Scale, each in proportion.](average)

4. **Pack the islands.** With everything selected, choose UV > Pack Islands and set Margin to about 0.01 in its options. Blender fits every island inside the square with a gap round each, so neighbours never share pixels at their edges.

   ![The islands packed inside the square with gaps between them, beside the Pack Islands options with Margin set to 0.010 picked out.](pack)

5. **Pin what should stay.** Select UVs and press `P` to pin them, or `Alt+P` to unpin. Pinned UVs keep their place when you unwrap again, and Pack Islands leaves them alone when Lock Pinned Islands is on.

## Common mistake

![The chest with a test grid. Left, packed without averaging: the lid's squares much bigger than the body's. Right, averaged and then packed: squares of one size all over.](mistake)

Pack Islands scales every island by the same amount. If you pack before averaging, an island that came out too small stays too small, and its squares look bigger on the model. Run Average Islands Scale first, then Pack Islands.

## Checking your model

Look at the chest in the UV Editor and in Material Preview:

1. Every island lies inside the square, with a gap round it.
2. The grid's squares are one size on the body and the lid.
3. Select > Select All by Trait > Overlap selects nothing.
4. The lid's curved strip lies straight.
