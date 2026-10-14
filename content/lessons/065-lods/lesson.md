---
needs: [game-ready, modifiers]
exercise: rock-lods
watch: [gwizz-godot-lod, tom-lauerman-decimate]
sources:
  - Blender 5.2 Manual, "Decimate Modifier", Collapse and Ratio, Un-Subdivide, Planar, and when not to use it (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/decimate.html), read 2026-10-15
  - Blender 5.2 Manual, "Duplicate", the copy starts in move mode (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/duplicate.html), read 2026-10-15
  - Godot 4 docs, "Mesh level of detail (LOD)", LODs made on import, LOD Bias, skinned meshes and Display Wireframe (https://docs.godotengine.org/en/stable/tutorials/3d/mesh_lod.html), read 2026-10-15
  - Godot 4 docs, "Visibility ranges (HLOD)", Begin, End and their margins (https://docs.godotengine.org/en/stable/tutorials/3d/visibility_ranges.html), read 2026-10-15
  - Godot 4 docs, "Import configuration", Generate LODs in the Import dock (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/import_configuration.html), read 2026-10-15
  - Blender 5.2.2, Decimate on the exercise's rock (1,984, 992 and 496 triangles) and on Kenney's Platformer Kit crate, checked 2026-10-15
---

# Levels of detail

A rock on the far side of a map covers a few pixels, so drawing all its triangles wastes time. A level of detail, or LOD, is a lighter version shown from further away. In this lesson you'll make LODs with the Decimate modifier and see how Godot makes and uses its own.

![The rock and two lighter versions of it side by side, Rock_LOD0, Rock_LOD1 and Rock_LOD2, each with fewer and larger faces.](example)

## Steps

1. **Copy the rock in place.** Select Rock_LOD0, press `Shift+D`, then `Esc`: the copy stays exactly on top of the rock. Rename it Rock_LOD1 with `F2`, and make Rock_LOD2 the same way. Hide the others in the Outliner while you work.

   ![The keys Shift+D then Esc, which leave the copy in place, and the Outliner listing Rock_LOD0, Rock_LOD1 and Rock_LOD2.](copy)

2. **Add a Decimate modifier.** On Rock_LOD1, choose Add Modifier > Generate > Decimate. Leave it on Collapse and set Ratio to 0.5, which keeps about half the triangles. Give Rock_LOD2 a Ratio of 0.25. Statistics shows the new counts.

   ![The Decimate modifier set to Collapse with Ratio 0.5, beside the Statistics overlay reading 992 triangles.](decimate)

3. **Know the other two modes.** Un-Subdivide undoes subdivision on grid-like meshes; two iterations undo one level. Planar merges faces that lie almost flat against each other, which suits walls and other flat-sided shapes.

   ![A wall made of 124 small faces, and the same wall after Planar: 6 faces.](planar)

4. **Let Godot make its own.** With Generate LODs on in the Import dock, Godot makes LODs for each imported mesh and picks one by size on screen. A LOD Bias above 1 keeps detail longer. Skinned meshes can break, so turn LODs off for them.

   ![The rock drawn smaller and with fewer faces as it moves away from the camera, beside a MeshInstance3D's LOD Bias field.](godot-lod)

5. **Use your own LODs with visibility ranges.** In Godot, set each rock's Visibility Range: Rock_LOD0 End 10 m, Rock_LOD1 Begin 10 and End 25, Rock_LOD2 Begin 25. A 1 m margin at each switch stops them flickering back and forth.

   ![Bars along a distance scale: Rock_LOD0 from 0 to 10 m, Rock_LOD1 from 10 to 25 m and Rock_LOD2 from 25 m on.](ranges)

## Common mistake

![Left, a crate after Decimate: two faces gone and the inside showing. Right, the dense rock after Decimate, its shape kept.](mistake)

Decimate spoils a prop you built by hand, such as the crate. Every face there holds part of the shape, so Collapse takes faces out and opens holes. Decimate dense meshes such as sculpts and scans, and leave low-poly props to Godot's own LODs.

## Checking your model

Show all three rocks and check:

1. Statistics shows about 1,984, 992 and 496 triangles for the three rocks.
2. All three rocks sit in exactly the same place.
3. Rock_LOD2 still has the rock's outline in the front view.
4. In Godot, the rock changes version as the camera moves away.
