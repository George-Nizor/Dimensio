---
needs: [principled-bsdf, shader-editor]
exercise: paint-the-tree
watch: [tirkkonen-vertex-colors, blender-manual-sculpt-paint-vertex-paint-introduction]
sources:
  - 'Blender 5.2 Manual, "Vertex Paint: Introduction" (https://docs.blender.org/manual/en/5.2/sculpt_paint/vertex_paint/introduction.html), read 2026-10-15'
  - Blender 5.2 Manual, "Object Modes", the mode menu and Ctrl+Tab (https://docs.blender.org/manual/en/5.2/editors/3dview/modes.html), read 2026-10-15
  - Blender 5.2 Manual, "Object Data", Color Attributes and the paint mask for sharp edges (https://docs.blender.org/manual/en/5.2/modeling/meshes/properties/object_data.html), read 2026-10-15
  - Blender 5.2 Manual, "Selection & Visibility", Face Selection Masking and L to pick linked faces (https://docs.blender.org/manual/en/5.2/sculpt_paint/selection_visibility.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing Vertex Paint Colors", Set Vertex Colors and Ctrl+X (https://docs.blender.org/manual/en/5.2/sculpt_paint/vertex_paint/editing.html), read 2026-10-15
  - Blender 5.2 Manual, "Color Attribute Node" (https://docs.blender.org/manual/en/5.2/render/shader_nodes/input/vertex_color.html), read 2026-10-15
  - Blender 5.2 Manual, "Viewport Shading", Solid shading Color set to Attribute (https://docs.blender.org/manual/en/5.2/editors/3dview/display/shading.html), read 2026-10-15
  - Blender 5.2 Manual, "glTF 2.0", Use Vertex Color set to Material (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15
  - Blender 5.2.2 default keymap (5.2/scripts/presets/keyconfig/keymap_data/blender_default.py), Alt+A to deselect in the face mask, checked 2026-10-15
  - 'Jenny Tirkkonen, "Vertex colors: the hidden workhorse of shaders", Blender Conference 2024 (https://www.youtube.com/watch?v=-OqRp9o9vQA), checked 2026-10-15'
---

# Vertex painting

Vertex painting stores a colour on the corners of a model's faces, so you can colour a low-poly prop without a texture or a UV map. In this lesson you'll fill whole parts of a tree with flat colours through the face mask, then connect the colours to the material so they reach Godot.

![The exercise's low-poly tree after painting: the trunk filled with a wood colour and the canopy filled green.](example)

## Steps

1. **Enter Vertex Paint.** Select the tree and choose Vertex Paint from the mode menu in the 3D Viewport header, or from the `Ctrl+Tab` pie. Blender adds a Color Attribute, a colour stored on every corner of every face, white to start with.

   ![The mode menu in the 3D Viewport header, open, with Vertex Paint picked out, beside the Ctrl+Tab key.](mode)

2. **Turn on the face mask.** Press `1`, or click Paint Mask in the header, so paint only reaches selected faces. Hover over the lower canopy and press `L` to select that whole part. `Alt+A` clears the selection.

   ![The tree with the lower canopy's faces selected, beside the keys 1 for the face mask, L to pick a part and Alt+A to clear.](mask)

3. **Fill the selection.** Click the colour swatch in the header and pick a green. Choose Paint > Set Vertex Colors, or press `Ctrl+X`, to fill every selected face at once. Repeat for the top canopy and the trunk.

   ![Left, the lower canopy selected and still white. Right, after Ctrl+X, the same faces filled green and the rest of the tree still white.](fill)

4. **Use the colours in the material.** In the Shader Editor, press `Shift+A` and choose Input > Color Attribute. Connect its Color output to the Principled BSDF's Base Color. The glTF exporter writes vertex colours only when the material uses them.

   ![A Color Attribute node with its Color output linked to the Base Color input of a Principled BSDF node.](node)

Jenny Tirkkonen's Blender Conference talk is a longer introduction to vertex painting for real-time low-poly models.

## Common mistake

![Left, the trunk painted with the brush: its colour runs onto the faces under the canopy. Right, the trunk filled through the face mask: its colour stops at the edge.](mistake)

Painting the trunk with the brush lets its colour run onto the canopy's lowest faces, because the brush colours every corner it touches. Turn on the face mask, select the part with `L` and fill it with `Ctrl+X`, so each colour stops at an edge.

## Checking your model

In Object Mode, open the Viewport Shading popover, set Color to Attribute, and check:

1. The trunk and both parts of the canopy show their own colours.
2. Every colour stops at an edge, with no blend across a face.
3. Material Preview shows the same colours through the Color Attribute node.
4. The tree still has one material and no UV map.
