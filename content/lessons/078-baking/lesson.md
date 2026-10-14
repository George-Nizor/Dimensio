---
needs: [retopology, procedural-textures, unwrapping]
exercise: bake-the-stone
watch: [ryan-king-texture-bake, blender-manual-render-cycles-baking]
sources:
  - 'Blender 5.2 Manual, "Render Baking": the UV map, the active Image Texture node, Bake Type Normal and Diffuse, Contributions, Selected to Active, Extrusion and Max Ray Distance (https://docs.blender.org/manual/en/5.2/render/cycles/baking.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Normal Map Node", Non-Color and Strength (https://docs.blender.org/manual/en/5.2/render/shader_nodes/displacement/normal_map.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Image Texture Node" (https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/image.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Image Editor: Editing", Save As (https://docs.blender.org/manual/en/5.2/editors/image/editing.html), read 2026-10-15'
  - 'Blender 5.2.2, the bake-stone starter baked with Normal and Diffuse (Color only), Extrusion 0.03 m and Max Ray Distance 0.06 m; Shift+A > Displacement > Normal Map in the Shader Editor, checked 2026-10-15'
---

# Baking textures

Baking copies detail from one model into an image that another model wears. Your low-poly stone can carry the sculpt's bumps in a normal map, an image whose colours tell Blender which way each point faces. In this lesson you'll bake the sculpt's detail and colour onto the low-poly stone, ready for a game.

![The low-poly stone with flat faces, and the same 192 triangles showing the sculpt's bumps once its baked maps are on.](example)

## Steps

1. **Unwrap the low-poly stone.** Select Stone low, press `Tab`, select everything with `A`, then press `U` and choose Smart UV Project. Baking needs a UV map to know where on the image each face goes.

   ![U and Smart UV Project, beside a square holding the stone's faces laid flat as islands.](unwrap)

2. **Add an image to bake into.** Give Stone low a new material. In the Shader Editor, add an Image Texture node, click New and name the image stone-normal, 1024 by 1024. Set its Color Space to Non-Color. Cycles bakes into the selected Image Texture node.

   ![The New Image box at 1024 by 1024, and the Image Texture node holding stone-normal with Color Space set to Non-Color.](image-node)

3. **Set up the bake.** In Render Properties, set Render Engine to Cycles and, under Bake, Bake Type to Normal. Tick Selected to Active, with Extrusion 0.03 m and Max Ray Distance 0.06 m. Rays start outside the low-poly surface and look inward for the sculpt.

   ![The Bake panel set to Normal with Selected to Active, Extrusion 0.03 m and Max Ray Distance 0.06 m, beside a cut through both stones with rays pointing inward.](rays)

4. **Select in order and bake.** Click Stone sculpt, then `Shift`+click Stone low, so the low-poly stone is the active object. Click Bake. Open stone-normal in an Image Editor and save it with Image > Save As.

   ![The Outliner with Stone sculpt clicked first and Stone low Shift+clicked, the active object.](order)

5. **Use the normal map.** Press `Shift+A` and add Displacement > Normal Map. Connect the image's Color to the Normal Map node, and its Normal to the Principled BSDF's Normal. The low-poly stone now shades with the sculpt's bumps.

   ![Image Texture into a Normal Map node, into the Normal input of the Principled BSDF.](normal-map)

6. **Bake the colour too.** Add a second Image Texture node with a new image, stone-colour, and select it. Set Bake Type to Diffuse, untick Direct and Indirect so only Color stays ticked, and bake. Connect it to Base Color and save it.

   ![The Bake panel set to Diffuse with only Color ticked, beside the selected Image Texture node holding stone-colour.](colour)

## Common mistake

![Left, the normal map's Image Texture node left on sRGB. Right, the same node set to Non-Color.](mistake)

Left on sRGB, a normal map shades wrongly, because Blender reads its colours as a picture rather than as directions. The bumps look too strong or lit from the wrong side. Set the image node's Color Space to Non-Color before you bake.

## Checking your model

Hide Stone sculpt and look at Stone low in Material Preview:

1. The stone shows the sculpt's pits and ridges as the light moves.
2. Its colour has the sculpt's grey and green patches.
3. The stone-normal image is mostly purple-blue, with each island's edge showing.
4. You saved both images as PNG files beside your .blend file.
