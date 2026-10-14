---
needs: [shader-editor]
exercise: planks-and-stone
watch: [ryan-king-procedural-shader-nodes, southern-shotty-shader-nodes]
sources:
  - Blender 5.2 Manual, "Noise Texture Node" (https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/noise.html), read 2026-10-15
  - 'Blender 5.2 Manual, "Voronoi Texture Node": Feature, Distance to Edge, Scale (https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/voronoi.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Wave Texture Node": Bands, Bands Direction, Distortion (https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/wave.html), read 2026-10-15'
  - Blender 5.2 Manual, "Brick Texture Node" (https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/brick.html), read 2026-10-15
  - 'Blender 5.2 Manual, "Texture Coordinate Node": Generated and Object outputs (https://docs.blender.org/manual/en/5.2/render/shader_nodes/input/texture_coordinate.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Mapping Node": Point type and Scale (https://docs.blender.org/manual/en/5.2/render/shader_nodes/utilities/vector/mapping.html), read 2026-10-15'
  - Blender 5.2 Manual, "Color Ramp Node" (https://docs.blender.org/manual/en/5.2/render/shader_nodes/color/color_ramp.html), read 2026-10-15
  - 'Blender 5.2 Manual, "glTF 2.0", Exported Materials: the exporter builds a glTF material from the nodes it recognises (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15'
  - Blender 5.2.2, the Add menu (Input, Texture, Color, Utilities > Vector) and the wood and stone recipes rendered in EEVEE, with Generated and Object coordinates compared, checked 2026-10-15
---

# Procedural textures

A procedural texture is a pattern Blender works out from numbers instead of reading an image. It never runs out of pixels, and you change it with a slider. In this lesson you'll make wood grain and stone from texture nodes, colour them with a Color Ramp and size them with the Texture Coordinate and Mapping nodes.

![Two floors with no images: wooden planks whose grain is a Wave Texture, and stones with dark gaps between them made from a Voronoi Texture.](example)

## Steps

1. **Add a pattern.** In the Shader Editor, add a node from the Texture menu: Noise for cloudy blotches, Voronoi for cells such as stones, Wave for bands such as wood grain, or Brick. Link its first output to Base Color to see it in grey.

   ![Four patterns in grey: Noise Texture's blotches, Voronoi Texture's cells, Wave Texture's wavy bands and Brick Texture's rows of bricks.](patterns-row)

2. **Colour it with a Color Ramp.** Put Color > Color Ramp between the pattern and Base Color. Click a stop on the ramp and choose its colour under the bar, and drag stops to move them. Two stops close together give a hard edge.

   ![A Noise Texture's Factor feeding a Color Ramp with a blue and an orange stop close together, its Color feeding Base Color. Below, the grey noise, and the hard-edged blue and orange patches the ramp makes from it.](color-ramp)

3. **Size it with Mapping.** Add Input > Texture Coordinate and Utilities > Vector > Mapping. Link Texture Coordinate's Object to Mapping's Vector, and Mapping's Vector to the texture's Vector. Mapping's Scale stretches the pattern: X at 0.3 draws it over three times longer along X.

   ![Texture Coordinate's Object output feeding the Mapping node, with Scale X set to 0.3, and Mapping's Vector feeding the Wave Texture. Below, a plank's grain with Scale X at 1, and longer and smoother at 0.3.](mapping)

4. **Make wood grain.** Use a Wave Texture with Bands Direction Y, so its bands run along X, and Distortion 6 to make them wobble. Stretch it with Mapping's Scale X at 0.3 and colour it dark to light brown with the Color Ramp.

   ![The wood nodes in a row: Texture Coordinate, Mapping with Scale X 0.3, Wave Texture with direction Y and Distortion 6, Color Ramp and the Principled BSDF. Below, four planks with grain along their length.](wood)

5. **Make stone.** Use a Voronoi Texture with Feature set to Distance to Edge and Scale at 3. In the Color Ramp, set Interpolation to Constant, make the first stop dark for the gaps, and give the second stop a grey and move it to 0.05.

   ![A Voronoi Texture set to Distance to Edge with Scale 3, feeding a Color Ramp on Constant with a dark stop at 0 and a grey stop at 0.05. Beside it, a floor of grey stones with dark gaps.](stone)

A glTF file carries image textures but not a node pattern, so these materials stay in Blender. Lesson 78 bakes a pattern into an image that Godot can use.

## Common mistake

![The same Wave Texture on a long plank and a small cube. Left, Vector left unlinked: six bands on each, wide on the plank and narrow on the cube. Right, Texture Coordinate's Object output: the bands are the same width on both.](mistake)

A texture with nothing linked to Vector uses Generated coordinates, which run from 0 to 1 across each object. The pattern stretches to fit, so a long plank gets wider grain than a cube. Link Texture Coordinate's Object output instead.

## Checking your model

Look at both objects in Material Preview, then at their nodes:

1. The plank's grain runs along its length.
2. Each texture's Vector comes through Mapping from Texture Coordinate's Object output.
3. The floor shows separate stones with dark gaps between them.
4. Neither material has an Image Texture node.
