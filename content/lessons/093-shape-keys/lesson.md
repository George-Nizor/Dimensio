---
needs: [keyframes, edit-mode]
exercise: squashing-sack
watch: [ryan-king-shape-keys, royal-skies-shape-keys]
sources:
  - Blender 5.2 Manual, "Shape Keys" introduction, Basis, Relative keys and Value (https://docs.blender.org/manual/en/5.2/animation/shape_keys/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Shape Keys Panel", Object Data > Shape Keys, Value, Relative (https://docs.blender.org/manual/en/5.2/animation/shape_keys/shape_keys_panel.html), read 2026-10-15
  - Blender 5.2 Manual, "Shape Keys Workflow", adding keys, editing them in Edit Mode, never adding or removing vertices (https://docs.blender.org/manual/en/5.2/animation/shape_keys/workflow.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing Keyframes", hovering over a property and pressing I (https://docs.blender.org/manual/en/5.2/animation/keyframes/editing.html), read 2026-10-15
  - Blender 5.2 Manual, "glTF 2.0", Shape Keys export as morph targets, Apply Modifiers (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15
  - Blender 5.2 glTF add-on, io_scene_gltf2/__init__.py, the Apply Modifiers tooltip warns that it prevents exporting shape keys (https://projects.blender.org/blender/blender/src/branch/blender-v5.2-release/scripts/addons_core/io_scene_gltf2/__init__.py), read 2026-10-15
  - Godot Docs, "MeshInstance3D", blend shapes (https://docs.godotengine.org/en/stable/classes/class_meshinstance3d.html), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15, the first click on + adds Basis and the second Key 1; a cube with a Bevel modifier exported with Apply Modifiers on lost its shape key, and kept it with Apply Modifiers off; Godot 4.7.2 imported the kept key as one blend shape
---

# Shape keys

Shape keys store other shapes for the same mesh: the same vertices, moved. A Value from 0 to 1 blends the mesh from its Basis shape toward a key, and you can keyframe that value. In this lesson you'll give a sack a squashed shape and animate it squashing.

![A sack's two shapes side by side: its Basis, round with a narrow neck, and its squash key, the same vertices moved lower and wider.](example)

## Steps

1. **Add the Basis and a key.** Select the sack. In the Properties editor's Object Data tab, under Shape Keys, click + twice. The first click adds Basis, the mesh as it is now. The second adds Key 1. Double click it and rename it squash.

   ![The Shape Keys panel with Basis and squash in its list, squash selected with a Value of 0, and the + button picked out.](panel)

2. **Shape the key.** With squash selected in the list, press `Tab` and select all with `A`. Press `S`, `Z` to make the sack lower, then `S`, `Shift+Z` to make it wider. Never add or delete vertices, because all the keys hold the same ones.

   ![Edit Mode with squash selected: the sack's vertices moved down and out from the Basis shape, drawn dashed, to the squashed shape.](edit)

3. **Blend with Value.** Press `Tab` to go back to Object Mode and drag squash's Value from 0 to 1. At 0 you see the Basis, at 1 the full squash, and values between mix the two.

   ![The Value slider halfway, with the sack at Value 0, 0.5 and 1 above it.](value)

4. **Keyframe the Value.** Hover over Value and press `I` to insert a keyframe: 0 at frame 1, 1 at frame 6 and 0 at frame 12. Play the animation, and the sack squashes and springs back.

   ![A curve of the squash Value over frames 1 to 12, rising from 0 to 1 at frame 6 and back to 0 at frame 12, with a key at each turn and the sack's shape above each key.](keys)

5. **Export it.** glTF exports shape keys as morph targets, which Godot imports as blend shapes. Leave Apply Modifiers off in the export: with it on, an object with modifiers loses its shape keys.

## Common mistake

![Left, the sack squashed with S in Object Mode: its Scale reads 1.3, 1.3, 0.58 and it looks the same at Value 0 and 1. Right, the squash made in Edit Mode: Scale stays 1, 1, 1, and Value 0 and 1 show different shapes.](mistake)

Pressing `S` in Object Mode scales the whole object. The sack looks squashed, yet the shape stored in squash hasn't changed, so its Value does nothing and the sack never springs back. Shape the keys in Edit Mode, with the one you want selected in the list.

## Checking your model

Scrub through frames 1 to 12 and check:

1. The Shape Keys list shows Basis and squash.
2. At Value 0 the sack has its original shape.
3. At Value 1 it is lower and wider.
4. The sack's Scale reads 1, 1, 1 in Object Mode.
5. Value has keyframes at frames 1, 6 and 12.
