---
needs: [first-material]
exercise: six-materials
watch: [cgcookie-materials, blender-manual-render-shader-nodes-shader-principled]
sources:
  - 'Blender 5.2 Manual, "Principled BSDF": Base Color, Roughness, Metallic, Alpha, Transmission, Emission Color and Strength (https://docs.blender.org/manual/en/5.2/render/shader_nodes/shader/principled.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Materials: Introduction" (https://docs.blender.org/manual/en/5.2/render/materials/introduction.html), read 2026-10-15'
  - 'Blender 5.2 Manual, EEVEE "Materials", Material Settings > Render Method: Dithered and Blended (https://docs.blender.org/manual/en/5.2/render/eevee/material_settings.html), read 2026-10-15'
  - Blender 5.2 Manual, "Viewport Shading", Material Preview (https://docs.blender.org/manual/en/5.2/editors/3dview/display/shading.html), read 2026-10-15
  - Blender 5.2 Manual, "glTF 2.0", Exported Materials and Alpha Modes (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15
  - Godot 4.7 source, modules/gltf/gltf_document.cpp, the glTF material import (https://github.com/godotengine/godot/blob/4.7/modules/gltf/gltf_document.cpp), read 2026-10-15
  - Blender 5.2.2, a new material's defaults (Emission Strength 0, Emission Color white, Render Method Dithered), and the exercise done and rendered in EEVEE, checked 2026-10-15
---

# The Principled BSDF

Every new material starts with one node, the Principled BSDF, and its settings can make most surfaces you'll need. In this lesson you'll set a material's colour, roughness and metallic, make a surface glow, and make one you can see through.

![Six spheres in front of a striped wall, each made with the Principled BSDF alone: painted wood, rough stone, gold, shiny red plastic, a glowing blue crystal and faded see-through glass.](example)

## Steps

1. **Find the settings.** Select an object, open the Material tab in the Properties editor and click New. The Surface panel lists the Principled BSDF's settings, with more in closed panels below. Press `Z` and choose Material Preview to see the material in the 3D Viewport.

   ![The Material tab, second from the bottom of the Properties editor's tabs. Its Surface panel lists Base Color, Metallic, Roughness, IOR, Alpha and Normal, then closed panels from Diffuse to Thin Film, with Emission picked out. The Settings panel near the bottom of the tab is picked out too.](material-tab)

2. **Set colour and roughness.** Click the Base Color swatch to choose a colour. Roughness sets how sharp reflections are: 0 gives a mirror-like shine and 1 a dull, matte surface. Painted wood looks right at about 0.5 and rough stone at 0.9.

   ![The same grey sphere three times: Roughness 0 with a small hard highlight, 0.5 with a wide soft one, and 1 with none.](roughness)

3. **Make it metal.** Set Metallic to 1 and the surface reflects its surroundings, tinted with the Base Color. Gold is a yellow-orange Base Color with Metallic 1 and Roughness about 0.2. Leave Metallic at 0 for paint, wood, stone and plastic.

   ![Two spheres with the same orange Base Color. Left, Metallic 0: orange paint with a white highlight. Right, Metallic 1: gold, showing tinted reflections of its surroundings.](metallic)

4. **Make it glow.** Open the Emission panel, pick a Color and raise Strength. At 1 the surface shows exactly its Emission Color, and higher values make it brighter.

   ![The Emission panel with Color set to blue and Strength raised to 3, beside a glowing blue sphere.](emission)

5. **Make it see-through.** Lower Alpha below 1 to let the background show through: 0.3 suits glass in a game. Then open the Settings panel at the bottom of the Material tab and set Render Method to Blended, which draws see-through surfaces smoothly.

   ![The same sphere three times in front of stripes, with Alpha 1, 0.6 and 0.3: solid, half faded, and faint enough to show the stripes through it.](see-through)

Godot reads Base Color, Metallic, Roughness, Emission and Alpha from an exported .glb. Settings in the closed panels, such as Transmission, stay in Blender.

## Common mistake

![Left, Emission Color set to blue with Strength at 0, and a plain grey sphere that does not glow. Right, the same Color with Strength 3, and the sphere glowing blue.](mistake)

The crystal stays dull after you pick its Emission Color, because Strength starts at 0 and the colour adds no light until you raise it. Set Strength to 1 or more.

## Checking your model

Look at each sphere in Material Preview:

1. Each sphere has its own material, named after its label.
2. Only the gold sphere has Metallic at 1.
3. The crystal glows, with Emission Strength above 0.
4. The floor's checks show through the glass sphere.
