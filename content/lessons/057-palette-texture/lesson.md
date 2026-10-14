---
needs: [image-textures, unwrapping]
exercise: palette-barrel
watch: [imphenzia-palette-textures, imphenzia-pixpal]
sources:
  - 'Blender 5.2 Manual, "Image Texture Node": Interpolation Closest, no interpolation (https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/image.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Editing UVs": Scale (S) and Move (G) in the UV Editor (https://docs.blender.org/manual/en/5.2/modeling/meshes/uv/editing.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "UV Operators": Unwrap Angle Based (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/uv.html), read 2026-10-15'
  - Imphenzia, "How To Speed Up Your Blender Low Poly Modeling Process", chapter "Colorize Low Poly Object with a simple palette" (https://www.youtube.com/watch?v=wymvSs7m1jk), chapter list read 2026-10-15
  - Imphenzia, PixPal palette texture, a 128 by 128 pixel CC0 palette mapped by placing UVs on its colours (https://imphenzia.com/imphenzia-pixpal), read 2026-10-15
  - glTF-Blender-IO, blender/exp/sampler.py, Closest exported as Nearest filtering (https://github.com/KhronosGroup/glTF-Blender-IO/blob/main/addons/io_scene_gltf2/blender/exp/sampler.py), read 2026-10-15
  - 'Kenney''s Pirate Kit chest in content/references/models.yaml, one material on one 512 px colormap image, checked in Blender 5.2.2 on 2026-10-15'
  - Blender 5.2.2, the palette-barrel starter coloured as the steps describe and rendered in EEVEE, checked 2026-10-15
---

# Palette textures

Many low-poly game models take all their colours from one small image of colour swatches. You shrink each face's UVs onto the swatch whose colour it should take, so one material serves the whole model, or a whole game. In this lesson you'll set up a palette material and colour a barrel by moving its UVs onto swatches.

![A palette image of swatch rows, from dark to light, beside a barrel coloured from it: wooden staves, grey metal bands and darker ends, all one material.](example)

## Steps

1. **Set up one material.** Give the model one material. In the Shader Editor, add an Image Texture holding the palette image and link its Color to Base Color. Set Interpolation to Closest so that each swatch keeps its hard edges.

   ![An Image Texture node holding the palette, its Interpolation set to Closest and picked out, its Color linked to the Principled BSDF's Base Color.](material)

2. **Select faces of one colour.** In Edit Mode, select every face that should share a colour, such as both metal bands. Hold `Alt` and click a band to select its whole ring of faces, and add the second with `Shift+Alt`.

   ![The barrel in Edit Mode with both of its metal bands selected, beside Alt and a left click.](select)

3. **Shrink them to a point.** Press `U` > Unwrap Angle Based so the faces get UVs of their own. Then, with the mouse over the UV Editor, press `S`, type `0` and press `Enter`. The faces' UVs shrink to a single point.

   ![The bands' unwrapped strip over the palette in the UV Editor, with arrows closing it to a single point after S, 0 and Enter.](shrink)

4. **Move them onto a swatch.** Press `G` and move the point onto the swatch you want, then click. The faces take that colour at once in Material Preview. Repeat for each colour on the model.

   ![The point moved onto a grey swatch with G, and the barrel's bands now grey.](move)

Imphenzia colours whole games this way, and his free PixPal palette is a 128 px image made for it. Kenney's kits share one colour image across every model. Closest stays Closest in the .glb, so Godot keeps the edges sharp too.

## Common mistake

![Left, the band's UVs only partly shrunk, lying across a grey and a red swatch, and one band showing both colours. Right, the UVs a point inside one grey swatch, and the bands one flat grey.](mistake)

A face shows two colours, or a blend, when its UVs cover more than one swatch. That happens when you scale them down only part of the way. Shrink them to a point, or until the island sits inside a single swatch.

## Checking your model

Look at the barrel in Material Preview and in the UV Editor:

1. The barrel has one material, its Image Texture set to Closest.
2. Every face shows one flat colour, with no blends.
3. Each island sits inside a single swatch.
