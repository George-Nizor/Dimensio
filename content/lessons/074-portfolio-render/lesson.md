---
needs: [world-lighting, eevee, render-output]
exercise: portfolio-sheet
watch: [blender-forge-clay-renders, grant-abbitt-low-poly-scenes]
sources:
  - 'Blender 5.2 Manual, "Link & Append", File > Append (https://docs.blender.org/manual/en/5.2/files/linked_libraries/link_append.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Viewport Render": View > Render Viewport Preview, rendering from the camera view, and overlays in the result (https://docs.blender.org/manual/en/5.2/editors/3dview/viewport_render.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "3D Viewport: Shading", Solid mode''s Lighting and Color (https://docs.blender.org/manual/en/5.2/editors/3dview/display/shading.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Viewport Overlays": Floor, Axes, 3D Cursor and Wireframe (https://docs.blender.org/manual/en/5.2/editors/3dview/display/overlays.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Workbench" (https://docs.blender.org/manual/en/5.2/render/workbench/index.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Cameras" (https://docs.blender.org/manual/en/5.2/render/cameras.html), read 2026-10-15'
  - 'Blender 5.2.2, a viewport render from the camera view with Solid shading, Studio lighting, Custom colour and the Wireframe overlay, with and without Floor, Axes and 3D Cursor, checked 2026-10-15'
---

# A portfolio render

A portfolio picture shows your models finished and lit, and a clay render shows their shapes without colour. In this lesson you'll gather the game assets you've made into one scene and light and frame them. Then you'll render them three ways: in colour, as plain clay, and as clay with the wireframe on top.

![The same arranged assets three ways: a colour render, a plain grey clay render, and the clay render with every edge drawn on it.](example)

## Steps

1. **Gather your props.** In a new file, choose File > Append. Open your crate's .blend file, then its Object folder, and pick the crate. Do the same for the barrel, sword, chest, table and chair.

   ![File > Append inside crate.blend's Object folder, with Crate picked and the Append button.](append)

2. **Arrange and light them.** Add a plane under them for a floor and move each prop with `G` into a loose group. Light them with a key, fill and rim light, as in lesson 68, or with a studio HDRI.

   ![Seen from above: the props in a group, the camera in front, a key light to the front left, a fill to the front right and a rim light behind.](lights)

3. **Render in colour.** Frame the group with the camera, leaving room around it. Render with EEVEE with Raytracing on, then save the PNG.

4. **Render clay.** In camera view, switch to Solid shading. In the Shading popover, set Lighting to Studio and Color to Custom, with a light grey. Choose View > Render Viewport Preview and save the picture with Image > Save As.

   ![The Shading popover with Lighting set to Studio and Color set to Custom, beside the clay picture that Render Viewport Preview gives.](clay)

5. **Add the wireframe.** In the Overlays popover, tick Wireframe and turn off Floor, Axes and 3D Cursor. Press `Alt+A` to deselect everything, so no outline shows. Render the viewport preview again and save it.

   ![The Overlays popover with Wireframe ticked and Floor, Axes and 3D Cursor off, beside the clay picture with every edge drawn on it.](wire)

## Common mistake

![Left, a viewport render with the floor grid, the red and green axes and the 3D cursor in it. Right, the same render with those overlays turned off.](mistake)

A viewport preview keeps every overlay you can see on screen. Leave the grid, the axes and the 3D cursor on and they end up in your clay picture. Turn them off in the Overlays popover before you render.

## Checking your work

Open your three PNGs side by side:

1. All six props stand on the floor, none floating or sunk into it.
2. No prop is cut off by the edge of the picture.
3. The clay render shows one even grey, lit from the front.
4. The wireframe render shows edges but no grid, axes or cursor.
