---
needs: [uv-maps]
exercise: unwrap-three-props
watch: [grant-abbitt-uv-seams, grant-abbitt-uv-unwrapping]
sources:
  - 'Blender 5.2 Manual, "Seams": Edge > Mark Seam, few seams in places that are not seen, the cylinder seam (https://docs.blender.org/manual/en/5.2/modeling/meshes/uv/unwrapping/seams.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "UV Operators": Unwrap Angle Based, Conformal and Minimum Stretch, Smart UV Project with Angle Limit, Cube Projection (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/uv.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Unwrapping: Introduction", the workflow (https://docs.blender.org/manual/en/5.2/modeling/meshes/uv/unwrapping/introduction.html), read 2026-10-15'
  - Grant Abbitt, "The Complete Guide to UV Unwrapping for the 3D Artist - Where and Why Marking Seams" (https://www.youtube.com/watch?v=jnzhNdWoXMg), chapter list read 2026-10-15
  - Blender 5.2.2, the 3D Viewport's U menu (5.2/scripts/startup/bl_ui/space_view3d.py and space_image.py), the seam colour in the default theme, and the exercise done on the unwrap-props starter, checked 2026-10-15
---

# Seams and unwrapping

To lay a model flat on an image, Blender cuts it open along edges you choose, called seams. In this lesson you'll mark seams on a crate and a barrel and unwrap them. For a rock you'll use Smart UV Project, which cuts the seams for you.

![A barrel with red seams down its back and round both ends, and a test grid lying evenly on it. Beside it, its UV map: the side as one strip and each end as a disc.](example)

## Steps

1. **Mark seams.** In Edit Mode, select the edges to cut along, then choose Edge > Mark Seam, or press `U` and choose Mark Seam. Seams show red. Clear Seam, in the same menus, removes them.

   ![Left, a cube in Edit Mode with seven of its edges selected. Right, after Mark Seam those edges show red.](mark-seam)

2. **Choose where they go.** Use few seams, on edges seldom seen, such as the back and bottom. Cut a box like a cardboard box, down its upright edges and round three sides of the top. Cut a barrel down its back and round each end.

   ![The crate with seams down its four upright edges and round three sides of its top, and the barrel from behind with a seam down its back and round each end. Edges behind are dashed.](where)

3. **Unwrap.** Select every face with `A`, press `U` and choose Unwrap Angle Based. Blender cuts along the seams, flattens each piece into an island and lays them out on the UV map. Check the result with a test grid.

   ![The crate with its seams and every face selected, then U and Unwrap Angle Based, and its UV map: all six faces in one island, opened out like a box.](unwrap)

4. **Use Smart UV Project.** For a lumpy rock, skip the seams: select all and choose `U` > Smart UV Project. It cuts wherever faces meet at more than the Angle Limit, 66° by default. Cube Projection does a similar job for boxy props.

   ![A rock with no seams, then Smart UV Project, and its UV map with the rock cut into several islands.](smart)

## Common mistake

![Left, a barrel's side unwrapped with no seam down it: a ring on the UV map, tiny faces inside and big ones outside, most of them red with stretching. Right, with a seam down the back: an even blue strip.](mistake)

Seams round the ends of a barrel aren't enough. Its side is still a closed tube, so Unwrap squashes it into a ring whose faces stretch from tiny to huge. Add one seam from top to bottom at the back and unwrap again.

## Checking your model

Look at the three props in Material Preview and in the UV Editor:

1. The crate and the barrel have red seams where you chose to cut.
2. The barrel's side unwraps as one strip, with a disc for each end.
3. The grid's squares look square on every face of all three props.
4. The rock's UV map holds several islands from Smart UV Project.
