---
needs: [normals]
exercise: shade-two-ways
watch: [ryan-king-auto-smooth, blender-manual-scene-layout-object-editing-shading]
sources:
  - Blender 5.2 Manual, "Shading": Shade Smooth with Keep Sharp Edges, Shade Auto Smooth, Shade Flat (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/shading.html), read 2026-10-15
  - Blender 5.2 Manual, "Smooth By Angle Modifier" (https://docs.blender.org/manual/en/5.2/modeling/modifiers/normals/smooth_by_angle.html), read 2026-10-15
  - Blender 5.2 Manual, "Edge Data": Mark Sharp and Set Sharpness by Angle (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/edge_data.html), read 2026-10-15
  - Blender 5.2 Manual, "glTF 2.0", Data > Mesh > Apply Modifiers (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15
  - Blender 4.1 release notes, Modeling, Auto Smooth replaced by a modifier (https://developer.blender.org/docs/release_notes/4.1/modeling/), read 2026-10-15
---

# Flat and smooth shading

Shading decides whether a model's faces look like flat facets or blend into one smooth surface. It changes only how light falls across the faces, so the outline stays faceted. In this lesson you'll shade objects flat, smooth, and smooth with some edges kept sharp, so that Godot shows the same.

![Two copies of a 12-sided barrel. Left, shaded flat, every side a separate tone. Right, shaded smooth with sharp edges kept: round sides and crisp bands.](example)

## Steps

1. **Flat or smooth.** In Object Mode, choose Object > Shade Flat or Object > Shade Smooth. Flat gives each face one even tone. Smooth blends the tones across faces, so a 12-sided cylinder looks round inside its faceted outline.

   ![A 12-sided cylinder shaded flat, with a band of tone per side, and the same cylinder shaded smooth, with one even blend.](flat-smooth)

2. **Smooth by angle.** Object > Shade Auto Smooth smooths edges between faces that meet at a shallow angle and keeps steeper ones sharp. It adds a Smooth by Angle modifier. A 12-sided barrel's sides meet at 30 degrees, so set Angle to 40 degrees.

   ![The barrel after Shade Auto Smooth: round sides with sharp bands, beside the Smooth by Angle modifier with Angle set to 40 degrees.](auto-smooth)

3. **Mark sharp edges.** In Edit Mode, select edges and choose Edge > Mark Sharp. On a smooth-shaded object, marked edges stay sharp. Edge > Set Sharpness by Angle marks every edge whose faces meet more steeply than the angle you set.

   ![The barrel in Edit Mode with the edges round its bands, rims and lid marked sharp.](mark-sharp)

4. **Shade smooth with sharp edges kept.** Back in Object Mode, Shade Smooth keeps marked edges sharp as long as you leave Keep Sharp Edges ticked in its Adjust Last Operation panel. It starts ticked. The result matches Shade Auto Smooth without a modifier.

   ![The Adjust Last Operation panel for Shade Smooth with Keep Sharp Edges ticked.](keep-sharp)

5. **Check what Godot gets.** The glTF exporter leaves modifiers out unless you tick Apply Modifiers, so a Smooth by Angle modifier needs it on. Sharp edges marked in Edit Mode are part of the mesh and export either way.

   ![The barrel with a Smooth by Angle modifier as Godot shows it. Left, exported with Apply Modifiers off: smooth all over, the bands blurred. Right, with it on: crisp bands.](export)

Older videos tick an Auto Smooth box in the mesh's Normals panel. Blender 4.1 replaced that box with the Smooth by Angle modifier.

## Common mistake

![A crate. Left, shaded smooth: its flat sides look dented and dark. Right, shaded flat: each side one clean tone.](mistake)

Shade Smooth on a model with hard corners, such as a crate, bends the light round every corner, so its flat sides look dented and dark. Use Shade Flat for it, or Shade Auto Smooth, which keeps the corners sharp.

## Checking your model

Compare the two barrels from several sides:

1. On both, the sides look round, with no lines between the 12 sides.
2. The bands, rims and lid keep crisp edges on both.
3. Barrel A has a Smooth by Angle modifier; Barrel B has none.
4. In Edit Mode, Barrel B's sharp edges show in their own colour.
