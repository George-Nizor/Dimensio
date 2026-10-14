---
needs: [proportional-editing, lods, retopology]
exercise: rock-and-tree
watch: [grant-abbitt-low-poly-rocks, joel-nantel-low-poly-trees]
sources:
  - 'Blender 5.2 Manual, "Remesh", Voxel Size with R and Ctrl+R (https://docs.blender.org/manual/en/5.2/sculpt_paint/sculpting/tool_settings/remesh.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Decimate Modifier": Collapse, Ratio and the face count it shows (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/decimate.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Displace Modifier": Texture, Strength and Direction (https://docs.blender.org/manual/en/5.2/modeling/modifiers/deform/displace.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Mesh Primitives", Cylinder and Ico Sphere options (https://docs.blender.org/manual/en/5.2/modeling/meshes/primitives.html), read 2026-10-15'
  - 'Blender 5.2.2: Ico Sphere Subdivisions 2 gives 80 triangles and each step multiplies them by four; a new texture is Image or Movie until set to Clouds; a remeshed 0.6 m cube decimated at Ratio 0.04 gives 148 triangles; a six-sided trunk with Subdivisions 2 leaves gives 100, checked 2026-10-15'
---

# A rock and a tree

Outdoor game scenes use many rocks and trees, so each one has to stay light. In this lesson you'll sculpt a rock and cut it down with Decimate, then build a tree from a six-sided trunk and lumpy leaves. The rock stays under 300 triangles and the tree under 400.

![A faceted low-poly rock beside a tree with a six-sided trunk and lumpy leaves.](example)

## Steps

1. **Sculpt a rough rock.** Add a cube, scale it to about 0.6 m and apply the scale with `Ctrl+A`. In Sculpt Mode, remesh it at a voxel size of 0.03 m with `R` and `Ctrl+R`. Shape a lumpy rock with Grab and Clay Strips.

   ![A cube 0.6 m across, the same cube remeshed into even quads, and the lumpy rock sculpted from it.](rock-sculpt)

2. **Cut it down with Decimate.** In Object Mode, add a Decimate modifier and lower Ratio until the modifier's Face Count reads about 150. Apply it, then choose Object > Shade Flat for sharp facets.

   ![The Decimate modifier at Ratio 0.040 with a face count of 150, and the dense rock turning into a few flat facets.](decimate)

3. **Model the trunk.** Add > Mesh > Cylinder, and in the Adjust Last Operation panel set Vertices to 6, Radius to 0.08 m and Depth to 0.8 m. In Edit Mode, select the top face and scale it down with `S`.

   ![The Add Cylinder panel with Vertices 6, Radius 0.08 m and Depth 0.8 m, and the straight trunk tapering once its top face is scaled down.](trunk)

4. **Make the leaves.** Add > Mesh > Ico Sphere with Subdivisions 2 and set it on the trunk. Add a Displace modifier and click New. In the Texture Properties tab, set Type to Clouds, then raise the modifier's Strength to about 0.3.

   ![The Displace modifier with a Clouds texture at Strength 0.3, and the ico sphere turning lumpy.](leaves)

5. **Colour, apply and join.** Give the rock, trunk and leaves a palette colour each, as in lesson 57. Apply the Displace modifier and the scale with `Ctrl+A`, then join the trunk and leaves with `Ctrl+J`.

6. **Export both.** Put each origin at its base, as in lesson 14, then export the rock and the tree to Godot as glTF files, as in lesson 35.

## Common mistake

![Left, leaves from an ico sphere with Subdivisions 4: 1,280 triangles. Right, Subdivisions 2: 80 triangles, made lumpy with Displace.](mistake)

Raising Subdivisions for rounder leaves multiplies the triangles by four each time: 80 at 2, 320 at 3, 1,280 at 4. Keep Subdivisions at 2 and let Displace give the shape. Watch the Statistics overlay as you go.

## Checking your model

With the Statistics overlay on, check:

1. The rock is under 300 triangles and the tree under 400.
2. The rock shows flat facets, not smooth shading.
3. The leaves sit on the trunk, with no gap between them.
4. Both read a Scale of 1, 1, 1 in the Sidebar's Item tab.
