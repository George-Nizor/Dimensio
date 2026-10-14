---
needs: [shader-editor]
exercise: brick-wall-maps
watch: [blender-guru-donut-part-5, blender-manual-render-shader-nodes-textures-image]
sources:
  - 'Blender 5.2 Manual, "Image Texture Node": Vector from the active UV map, Interpolation (Linear, Closest), Color Space (https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/image.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Color Spaces": normal and other data maps marked Non-Color (https://docs.blender.org/manual/en/5.2/render/color_management/color_spaces.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Normal Map Node": Tangent Space, Non-Color image, OpenGL convention by default (https://docs.blender.org/manual/en/5.2/render/shader_nodes/displacement/normal_map.html), read 2026-10-15'
  - Blender 5.2 Manual, "Principled BSDF", Roughness 0 to 1 (https://docs.blender.org/manual/en/5.2/render/shader_nodes/shader/principled.html), read 2026-10-15
  - 'Blender 5.2 Manual, "Packed Data": File > External Data > Pack Resources (https://docs.blender.org/manual/en/5.2/files/blend/packed_data.html), read 2026-10-15'
  - ambientCG, Bricks 059, CC0 (https://ambientcg.com/a/Bricks059), downloaded 2026-10-15
  - Blender 5.2.2, the exercise done on the textured-wall starter, rendered with the normal map wired four ways, checked 2026-10-15
---

# Image textures

An image texture puts a picture on a surface, such as a photo of bricks or a small palette of colours. A texture set gives you several images of one surface, one for each setting. In this lesson you'll connect a colour map, a roughness map and a normal map, and give each the colour space it needs.

![The finished brick material: three Image Texture nodes feeding the Principled BSDF. The colour map, in sRGB, feeds Base Color; the roughness map, in Non-Color, feeds Roughness; the normal map, in Non-Color, feeds a Normal Map node whose Normal feeds the Principled BSDF's Normal.](example)

## Steps

1. **Add an Image Texture.** In the Shader Editor, add Texture > Image Texture and link its Color to Base Color. Click Open to load an image, or the picture icon beside it to pick one in the .blend. The UV map decides where it lands.

   ![A new Image Texture node with its Color linked to Base Color. Its image row has a picture icon, which lists images in the file, then New and Open, which loads a file from disk.](image-node)

2. **Set the colour space.** A colour map stays on sRGB. A roughness map or a normal map holds numbers rather than colours, so set its Color Space to Non-Color. Left on sRGB, Blender converts those numbers as if they were colours.

   ![Three Image Texture nodes: the colour map with Color Space sRGB, and the roughness map and the normal map with Color Space set to Non-Color, picked out.](color-space)

3. **Link roughness and normals.** Link the roughness map's Color to Roughness: white is rough and black is shiny. A normal map goes through Displacement > Normal Map into Normal. When a set offers OpenGL and DirectX normal maps, use the OpenGL one, often named GL.

   ![The roughness map's Color linked to Roughness, and the normal map's Color linked to a Normal Map node whose Normal is linked to the Principled BSDF's Normal.](data-maps)

4. **Use Closest for pixel art.** Interpolation Linear blends each pixel into its neighbours when the image is shown large. For pixel art or a small palette image, set Interpolation to Closest so every pixel stays a sharp square.

   ![A 4 by 4 pixel image shown large. Left, Linear, where the pixels blur into each other. Right, Closest, where every pixel is a sharp square.](closest)

5. **Pack the images.** A .blend file only stores where its images are on your disk. Choose File > External Data > Pack Resources, then save, and the images go inside the .blend, so the file works on another computer.

   ![The File menu with External Data open and Pack Resources picked out.](pack)

## Common mistake

![Left, the normal map's Color linked straight to Normal, and the brick wall dark all over. Right, a Normal Map node between them, and the bricks lit, with the mortar sunk between them.](mistake)

Linking the normal map's Color straight to Normal skips the Normal Map node, the one that turns its colours into directions. The Principled BSDF then reads raw colours as directions, and the wall turns dark. Put a Normal Map node between them.

## Checking your model

Look at the wall's material and at the wall in Material Preview:

1. The colour map is sRGB; the roughness and normal maps are Non-Color.
2. A Normal Map node sits between the normal map and the Principled BSDF.
3. Orbiting the wall, the mortar looks sunk in between the bricks.
