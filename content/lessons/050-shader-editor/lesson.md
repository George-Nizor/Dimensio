---
needs: [principled-bsdf]
exercise: gradient-two-colours
watch: [ryan-king-procedural-shader-nodes, blender-manual-editors-shader-editor]
sources:
  - Blender 5.2 Manual, "Shader Editor" (https://docs.blender.org/manual/en/5.2/editors/shader_editor.html), read 2026-10-15
  - 'Blender 5.2 Manual, "Materials: Introduction", the Shading workspace (https://docs.blender.org/manual/en/5.2/render/materials/introduction.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Node Parts": sockets, inputs and outputs, and a colour linked to a shader socket acting as an Emission node (https://docs.blender.org/manual/en/5.2/interface/controls/nodes/parts.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Editing Nodes": Connecting Sockets, Cut Links (Ctrl and a right drag), Mute (M) and Connect to Output (Shift+Alt and a left click) (https://docs.blender.org/manual/en/5.2/interface/controls/nodes/editing.html), read 2026-10-15'
  - Blender 5.2 Manual, "Mix Color Node" (https://docs.blender.org/manual/en/5.2/render/shader_nodes/color/mix.html), read 2026-10-15
  - 'Blender 5.2 Manual, "Gradient Texture Node": Linear outputs the X coordinate (https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/gradient.html), read 2026-10-15'
  - Blender 5.2 Manual, "Color Ramp Node" (https://docs.blender.org/manual/en/5.2/render/shader_nodes/color/color_ramp.html), read 2026-10-15
  - Blender 5.2.2, the Shader Editor's Add menu (5.2/scripts/startup/bl_ui/node_add_menu_shader.py) and keymap (5.2/scripts/presets/keyconfig/keymap_data/blender_default.py), checked 2026-10-15
---

# The Shader Editor

Every material is a set of nodes: boxes that each do one job, joined by lines. The Material tab shows them as a list, and the Shader Editor shows them as they are, so you can add your own. In this lesson you'll add, connect and cut nodes, and build a material that fades from one colour to another.

![The finished material in the Shader Editor: a Gradient Texture's Factor feeds a Mix node, the Mix node's Result feeds the Principled BSDF's Base Color, and the Principled BSDF feeds the Material Output. Beside it, a cube fading from blue on the left to red on the right.](example)

## Steps

1. **Open the Shading workspace.** Select the object and click the Shading tab at the top of the window. The Shader Editor under the 3D Viewport shows its material: a Principled BSDF node linked to a Material Output node.

   ![A new material in the Shader Editor: the Principled BSDF's BSDF output linked to the Surface input of the Material Output.](default)

2. **Add a node.** With the mouse over the Shader Editor, press `Shift+A` and open a category such as Texture. Click a node, move it where you want it and click again to place it. You can also type a node's name to search for it.

   ![The Add menu after Shift+A, with the Texture category open and Gradient Texture picked out.](add-menu)

3. **Connect and cut.** Drag from a socket on a node's right side, an output, to a socket on another node's left side, an input. That line is a link. To cut links, hold `Ctrl` and right drag across them.

   ![Left, a link dragged from the Gradient Texture's Color output to the Principled BSDF's Base Color input. Right, a dashed line drawn across a link with Ctrl and a right drag, which cuts it.](link-cut)

4. **Mix two colours.** Add Color > Mix Color and link its Result to Base Color. Pick a colour for A and another for B. Factor sets how much of B shows: 0 gives A, 1 gives B and 0.5 half of each.

   ![A Mix node set to Color, with Factor at 0.5 and a blue A and a red B, its Result linked to the Principled BSDF's Base Color.](mix)

5. **Drive it with a gradient.** Add Texture > Gradient Texture and link its Factor to the Mix node's Factor. Now A fades into B from left to right. To shorten the fade, add a Color Ramp between them and drag its stops closer.

   ![A Gradient Texture's Factor feeding a Color Ramp whose stops sit at 0.3 and 0.7, and the Color Ramp's Color feeding the Mix node's Factor. Beside it, the cube fading from blue on the left to red on the right.](gradient)

6. **Mute and preview.** Select a node and press `M` to mute it: its links pass straight through it, drawn red. Hold `Shift+Alt` and left click a node to link it to the Material Output and see it on its own.

   ![Left, a muted Color Ramp drawn faint, with a red link passing straight through it. Right, Shift+Alt and a left click on the Gradient Texture, which links its Color to the Material Output's Surface.](mute-preview)

## Common mistake

![Left, the Gradient Texture still linked to the Material Output after a preview, and the cube showing a grey gradient with no light or shade. Right, the Principled BSDF linked to Surface again and the cube lit, fading from blue to red.](mistake)

After a preview, the Material Output still takes its Surface from the node you previewed. A colour linked there glows like an Emission shader, so the object looks flat and unlit. Hold `Shift+Alt` and left click the Principled BSDF to link it back.

## Checking your model

Look at the cube's material in the Shader Editor:

1. The Gradient Texture feeds the Mix node's Factor through a Color Ramp.
2. The Mix node's Result feeds the Principled BSDF's Base Color.
3. The Principled BSDF feeds the Material Output's Surface.
4. In Material Preview the cube fades from one colour to the other.
