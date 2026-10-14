---
needs: [mirror, palette-texture]
exercise: table-and-chair
watch: [imphenzia-interior-assets, blender-manual-modeling-modifiers-generate-mirror]
sources:
  - Blender 5.2 Manual, "Mirror Modifier", Axis, Bisect and Merge (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/mirror.html), read 2026-10-15
  - Blender 5.2 Manual, "Apply", Scale and Rotation & Scale (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/apply.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing UVs", scaling and moving UVs in the UV Editor (https://docs.blender.org/manual/en/5.2/modeling/meshes/uv/editing.html), read 2026-10-15
  - Blender 5.2 Manual, "glTF 2.0", Include Selected Objects and Data Mesh Apply Modifiers (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15
  - Godot 4 docs, "Model export considerations", +Y is rear and -Y is front in Blender (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/model_export_considerations.html), read 2026-10-15
  - Kenney, Furniture Kit 2.0, table.glb and chair.glb, measured in Blender 5.2.2 (https://kenney.nl/assets/furniture-kit), checked 2026-10-15
  - Imphenzia, "Modeling Low Poly Interior Assets - Ep. 113" (https://www.youtube.com/watch?v=rJb4_v0a3ds), checked 2026-10-15
---

# Low-poly furniture

A table and a chair are simple shapes with a lot of repeats, such as four matching legs. In this lesson you'll model both at real size and let the Mirror modifier make the repeats. You'll colour both from one palette texture, so they share a single material in Godot.

![A low-poly table and a chair beside it, both built from boxes at real size, the chair's open front facing the viewer.](example)

## Steps

1. **Block out at real size.** Start from cubes and type sizes into the Sidebar's Item tab (`N`). The table top is 1.4 by 0.8 m, its upper face 0.75 m up. The seat is 0.45 m up. Apply scale with `Ctrl+A` > Scale.

   ![The front view: the table's upper face 0.75 m above the floor and 1.4 m long, the chair's seat 0.45 m above the floor.](sizes)

2. **Model one leg, mirror the rest.** With the origin at the base centre, model one leg under the +X +Y corner. Add a Mirror modifier with X and Y on, plus Bisect for both so the top isn't doubled. The chair needs X only.

   ![The table from the top: one leg under the +X +Y corner picked out, and three dashed legs mirrored across the X and Y lines through the origin.](mirror)

3. **Share one palette material.** Give the table and the chair the same palette material from the material browse menu. In the UV Editor, scale each part's faces down onto a swatch: light wood for the tops, darker wood for the legs.

   ![A small palette image in the UV Editor, with the table top's faces placed on a light wood swatch and the legs' faces on a darker one.](palette)

4. **Export both together.** Check each piece has its origin at its base centre and its front facing -Y. Select both and choose File > Export > glTF 2.0, with Selected Objects and Apply Modifiers on.

   ![The glTF export options for this exercise: glTF Binary, Selected Objects on, +Y Up on and Apply Modifiers on.](export)

Kenney's Furniture Kit is built smaller than life, with each origin at a corner. Copy its shapes, not its sizes.

## Common mistake

![Left, the table in Godot after exporting with Apply Modifiers off: the top and one leg. Right, Apply Modifiers on: all four legs.](mistake)

Exporting with Apply Modifiers off sends Godot one leg. Blender shows four, but the file holds only the mesh you modelled. Turn on Apply Modifiers under Data > Mesh in the export window, or apply the Mirror modifier first.

## Checking your model

Select each piece and check:

1. Both pieces use the one palette material, and no other.
2. The Sidebar shows the table 0.75 m tall and the chair's seat 0.45 m up.
3. In the front view (`Numpad 1`) you look at the chair's open front.
4. Statistics shows under 300 triangles for each piece.
5. In Godot, the table has four legs and the chair its back.
