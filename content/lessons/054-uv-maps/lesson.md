---
needs: [image-textures]
exercise: read-three-uv-maps
watch: [grant-abbitt-uv-unwrapping, blender-manual-editors-uv-introduction]
sources:
  - 'Blender 5.2 Manual, "UV Editor: Introduction": UV maps, U and V, the cardboard box, distortion, Sync Selection in the header (https://docs.blender.org/manual/en/5.2/editors/uv/introduction.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Selecting UVs": Sync Selection on by default (https://docs.blender.org/manual/en/5.2/editors/uv/selecting.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "UVs & Texture Space": Properties > Data > UV Maps (https://docs.blender.org/manual/en/5.2/modeling/meshes/uv/uv_texture_spaces.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "UV Overlays": UV Stretch, blue for little distortion and red for high (https://docs.blender.org/manual/en/5.2/editors/uv/overlays.html), read 2026-10-15'
  - Blender 5.2 Manual, "Using UV Maps", the test grid and Generated Type UV Grid (https://docs.blender.org/manual/en/5.2/modeling/meshes/uv/applying_image.html), read 2026-10-15
  - 'Blender 5.2 Manual, "Unwrapping: Introduction", UV islands and the UV Editing workspace (https://docs.blender.org/manual/en/5.2/modeling/meshes/uv/unwrapping/introduction.html), read 2026-10-15'
  - Blender 5.2.2, the uv-three-props starter rendered in EEVEE, and a cube with its UV map removed rendered with a UV Grid, checked 2026-10-15
---

# UV maps

A UV map lays a model's faces flat on an image, the way a cardboard box opens out flat on a table. Each face shows the part of the image it lies on. In this lesson you'll read a UV map in the UV Editor and use a test grid to find the faces where an image stretches.

![A cube with a test grid on it beside its UV map: the six faces laid flat in a cross on the image's square, with the front face selected in both.](example)

## Steps

1. **Open UV Editing.** Select the object and click the UV Editing tab at the top of the window. The 3D Viewport on the right switches to Edit Mode, and the UV Editor on the left shows the object's UV map.

   ![The UV Editing workspace: the UV Editor on the left showing a cube's UV map, the 3D Viewport in Edit Mode on the right, and the Outliner and Properties at the far right.](workspace)

2. **Read the square.** U runs across the image and V up it, from 0 to 1. Every face lies somewhere on that square, and faces joined to each other form a UV island. A barrel usually has three: its side and its two ends.

   ![A barrel's UV map on the square from 0 to 1 in U and V: the side as one strip of 12 faces, and the top and bottom as two discs, three islands in all.](islands)

3. **Select in either editor.** Sync Selection is on by default in 5.2, so selecting faces in the 3D Viewport selects their UVs, and the other way round. Its button is at the left of the UV Editor's header, after the Editor Type.

   ![The left end of the UV Editor's header: the Editor Type button, then the Sync Selection button, on, then the vertex, edge and face select modes.](sync)

4. **Add a test grid.** In the UV Editor's header click New, set Generated Type to UV Grid and click OK. To see it on the model, choose that image in an Image Texture node linked to Base Color, and switch to Material Preview.

   ![The New Image dialog with Name, Width and Height at 1024 px, and Generated Type set to UV Grid, above the OK button.](new-image)

5. **Find the stretching.** Where the UVs match the faces, the grid's squares stay square. Long or squashed squares mean a stretched face. To see it in the UV Editor, open its Overlays menu and tick UV Stretch: blue is even and red stretched.

   ![Left, a ramp with a test grid: square cells on its sides and long cells on its slope. Right, its UV map with UV Stretch on: every face blue except the slope, which is red.](stretch)

## Common mistake

![Left, a cube with no UV map showing its grid material as one flat colour, and an empty UV Maps list. Right, the same cube with UVMap in the list and the grid on every face.](mistake)

An image that shows as one flat colour over the whole object usually means the mesh has no UV map. Look in Object Data > UV Maps. If the list is empty, the object needs unwrapping, which lesson 55 covers.

## Checking your work

Go back over the three props in the exercise file:

1. You found no stretched faces on Prop 1.
2. On Prop 2, you named the top and the bottom.
3. On Prop 3, you named the sloping face and nothing else.
4. UV Stretch shows red on every face you named.
