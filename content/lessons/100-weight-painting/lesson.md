---
needs: [skinning]
exercise: fix-weights
watch: [royal-skies-weight-paint, blender-manual-sculpt-paint-weight-paint-introduction]
sources:
  - Blender 5.2 Manual, "Weight Paint" introduction, the colours from 0 to 1, Normalize All, Auto Normalize (https://docs.blender.org/manual/en/5.2/sculpt_paint/weight_paint/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Using Vertex Groups", painting bone weights with the armature in Pose Mode, selecting a bone with Alt and a click (https://docs.blender.org/manual/en/5.2/sculpt_paint/weight_paint/usage.html), read 2026-10-15
  - Blender 5.2 Manual, "Brushes", the Paint brush and its Mix blend, the Blur brush (https://docs.blender.org/manual/en/5.2/sculpt_paint/weight_paint/brushes.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing Weight Paint", Normalize All and Limit Total (https://docs.blender.org/manual/en/5.2/sculpt_paint/weight_paint/editing.html), read 2026-10-15
  - Blender 5.2 Manual, "Viewport Overlays", Weight Paint Zero Weights None, Active and All (https://docs.blender.org/manual/en/5.2/editors/3dview/display/overlays.html), read 2026-10-15
  - Blender 5.2 Manual, "glTF 2.0", Bone Influences, 4 by default (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15
  - Blender 5.2.2 default keymap, scripts/presets/keyconfig/keymap_data/blender_default.py, Weight Paint keys, Ctrl inverts a stroke, Shift smooths, Alt and a click selects a bone, read 2026-10-15
  - Blender 5.2 source, editors/sculpt_paint/mesh/paint_weight.cc, an inverted stroke with the Mix blend paints 1 minus the Weight (https://projects.blender.org/blender/blender/src/branch/blender-v5.2-release/source/blender/editors/sculpt_paint/mesh/paint_weight.cc), read 2026-10-15
  - Blender 5.2 source, editors/sculpt_paint/mesh/paint_vertex.cc, Shift while painting switches to the Essentials Blur brush (https://projects.blender.org/blender/blender/src/branch/blender-v5.2-release/source/blender/editors/sculpt_paint/mesh/paint_vertex.cc), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15, with the armature and the mesh selected and the mesh active, Weight Paint puts the armature into Pose Mode; the Paint brush starts at Weight 1.0 with the Mix blend; Limit Total starts at 4
---

# Weight painting

Automatic weights get most of a character right and a few places wrong, usually where limbs meet the body. Weight painting fixes them: you paint how strongly a bone moves each vertex, from 0 to 1. In this lesson you'll repair a character whose shoulders and hips fold badly.

![The left shoulder in Weight Paint mode with the upper arm's group active: full weight along the arm, fading to none on the torso, beside a scale from 0 to 1.](example)

## Steps

1. **Enter Weight Paint.** In Object Mode, click the armature, then `Shift` click the mesh. Press `Ctrl+Tab` and choose Weight Paint. The armature goes into Pose Mode alongside, so you can turn bones while you paint.

   ![The Outliner with Armature selected first and Character second and active, beside the mode pie from Ctrl+Tab with Weight Paint picked out.](enter)

2. **Pick a bone.** Hold `Alt` and click a bone. Its vertex group becomes active and the mesh shows its weights: red is 1, where the bone moves vertices fully, and blue is 0. Rotate the bone with `R` to see the problem.

   ![The upper arm bone picked out over the shoulder, its weights shown on the mesh, beside the Alt key and a left click.](pick)

3. **Paint the weights.** Drag over the mesh with the Paint brush at Weight 1.0 to give vertices to the bone. Hold `Ctrl` as you drag to paint the opposite weight, 0, and take them away. Lower Strength in the header for gentler strokes.

   ![Left, a drag over the arm's first rings raising them to full weight. Right, the same drag with Ctrl held taking the weight away.](paint)

4. **Blur the borders.** Hold `Shift` as you drag to switch to the Blur brush, which evens out weights between neighbours. A border that fades over two or three loops bends in a curve.

   ![Two lowered arms. Left, a hard border creases at the shoulder. Right, after Blur the weight fades over three rings and the shoulder bends in a curve.](blur)

5. **Clean up.** Choose Weights > Normalize All so each vertex's weights add up to 1. Then choose Weights > Limit Total with a Limit of 4, the number of bones per vertex that glTF exports by default.

   ![The Weights menu with Limit Total picked out, and its Limit set to 4.](clean)

6. **Find unweighted vertices.** In the Overlays popover, set Zero Weights to All. Vertices that no bone moves turn black. Paint a bone's weight onto them.

   ![The Weight Paint Overlays with Zero Weights set to All, beside a leg whose loop below the hip has no weight, hatched here where Blender shows it black.](zero)

## Common mistake

![Left, weights that look tidy with the arm out crease sharply at the shoulder when the arm comes down. Right, painted with the arm lowered first, the shoulder bends in a curve.](mistake)

A shoulder can look fine with the arm out and crease once the arm comes down. Paint in the rest pose and you never see it. Turn the bone into a working pose first, such as the arm lowered, and paint while you watch the bend.

## Checking your model

Pose the character in Weight Paint mode and check:

1. With both arms lowered, the shoulders bend without a crease.
2. Lifting either leg moves only that side of the hips.
3. With Zero Weights on All, no vertex shows black.
4. After `Alt+R` on all bones, the character is back in its T pose.
