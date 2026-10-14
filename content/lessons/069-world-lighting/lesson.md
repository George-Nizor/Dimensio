---
needs: [lights]
exercise: two-hdris
watch: [ryan-king-hdri, polyhaven-hdris]
sources:
  - Blender 5.2 Manual, "World Environment", the Surface panel's Background shader with Color and Strength, and the Environment Texture node for HDR images (https://docs.blender.org/manual/en/5.2/render/lights/world.html), read 2026-10-15
  - Blender 5.2 Manual, "Environment Texture Node", made by dragging an image into the Shader Editor while it edits the World (https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/environment.html), read 2026-10-15
  - Blender 5.2 Manual, "Shader Editor", Shader Type set to World (https://docs.blender.org/manual/en/5.2/editors/shader_editor.html), read 2026-10-15
  - Blender 5.2 Manual, "Texture Coordinate Node" (https://docs.blender.org/manual/en/5.2/render/shader_nodes/input/texture_coordinate.html), read 2026-10-15
  - Blender 5.2 Manual, "Mapping Node", Rotation (https://docs.blender.org/manual/en/5.2/render/shader_nodes/utilities/vector/mapping.html), read 2026-10-15
  - Blender 5.2 Manual, "Viewport Shading", Material Preview's Scene World and Scene Lights options (https://docs.blender.org/manual/en/5.2/editors/3dview/display/shading.html), read 2026-10-15
  - Blender 5.2.2, checked 2026-10-15, Material Preview starts with Scene World off, and Generated into Mapping turns an Environment Texture when Rotation Z changes
  - Poly Haven, "Kloofendal 48d Partly Cloudy (Pure Sky)" and "Small Empty Room 1", CC0 (https://polyhaven.com/hdris), checked 2026-10-15
  - Ryan King Art, "How to Light your Scenes with HDRIs in Blender" (https://www.youtube.com/watch?v=QNr7lwhW0h4), checked 2026-10-15
---

# World lighting

The World surrounds the whole scene and lights it from every direction. In this lesson you'll light props with a plain World colour, then with an HDRI, a photo that holds the light of a real place. You'll also turn the HDRI to choose where its sun comes from.

![The World as a dome of light around the crate and the barrel, lighting them from every direction and most strongly from the HDRI's sun.](example)

## Steps

1. **Set the World's colour.** In the Properties editor, open the World tab. The Surface panel holds a Background shader with a Color and a Strength. A light grey at Strength 1 lights the props softly and evenly from all round.

   ![The World tab's Surface panel: Surface set to Background, with its Color and a Strength of 1.](world-tab)

2. **Get an HDRI.** An HDRI is one picture of everything around a spot, holding light far brighter than white. Poly Haven's are free and CC0: download Kloofendal 48d Partly Cloudy (Pure Sky) at 1K, as an EXR file.

   ![An HDRI laid out flat: sky above the horizon, ground below, and the sun as the brightest spot.](hdri)

3. **Load it into the World.** Open a Shader Editor and set its Shader Type to World. Drag the .exr in from your file manager: Blender adds an Environment Texture node. Connect its Color output to the Background's Color input.

   ![The Shader Editor set to World: an Environment Texture node's Color linked to the Background's Color, and the Background into the World Output.](load)

4. **Turn the sky.** Press `Shift+A` to add Input > Texture Coordinate and Utilities > Vector > Mapping. Connect Generated to Mapping's Vector input, and Mapping's output to the Environment Texture's Vector. Mapping's Rotation Z now turns the sky around the props.

   ![Texture Coordinate's Generated output linked into a Mapping node with Rotation Z at 90 degrees, and Mapping linked into the Environment Texture's Vector.](rotate)

5. **Try a room.** Load Small Empty Room 1 the same way and compare. Its light comes in softly through windows, where the sky's comes from one bright sun. Change the Background's Strength if the props look too bright or too dark.

## Common mistake

![The shading popover in Material Preview. Left, Scene World unticked: Blender lights the props with a built-in HDRI. Right, Scene World ticked: your World lights them.](mistake)

Material Preview is the wrong place to judge an HDRI. It lights the scene with Blender's own built-in HDRI and ignores your World until you tick Scene World in the shading popover. Use Rendered view, or tick Scene World.

## Checking your work

In Rendered view, look through the camera (`Numpad 0`) and check:

1. The sky shows behind the props.
2. Shadows fall away from the HDRI's sun.
3. Changing Mapping's Rotation Z swings the shadows around the props.
4. The room HDRI gives softer shadows than the sky.
