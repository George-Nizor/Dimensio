---
needs: [unwrapping]
exercise: paint-crate
watch: [grant-abbitt-texture-painting, grant-abbitt-texture-painting-quick-start]
sources:
  - 'Blender 5.2 Manual, "Texture Paint: Introduction": the Texture Paint workspace, UVs needed, saving the image, overlapping UVs (https://docs.blender.org/manual/en/5.2/sculpt_paint/texture_paint/introduction.html), read 2026-10-15'
  - Blender 5.2 Manual, "Texture Slots" (https://docs.blender.org/manual/en/5.2/sculpt_paint/texture_paint/tool_settings/texture_slots.html), read 2026-10-15
  - 'Blender 5.2 Manual, "Brushes": the asset shelf, Shift+Space, F for size and Shift+F for strength (https://docs.blender.org/manual/en/5.2/sculpt_paint/brush/introduction.html), read 2026-10-15'
  - Blender 5.2 Manual, "Texture Paint Tools", the Essentials brushes (https://docs.blender.org/manual/en/5.2/sculpt_paint/texture_paint/tools.html), read 2026-10-15
  - Blender 5.2 Manual, "Symmetry", Mirror (https://docs.blender.org/manual/en/5.2/sculpt_paint/texture_paint/tool_settings/symmetry.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing Images", Image > Save and Save As (https://docs.blender.org/manual/en/5.2/editors/image/editing.html), read 2026-10-15
  - Blender 5.2 release notes, the prompt to save modified images when saving the file (https://developer.blender.org/docs/release_notes/5.2/user_interface/), read 2026-10-15
  - 'Blender 5.2.2, the Texture Slots panel and its + menu (5.2/scripts/startup/bl_ui/space_view3d_toolbar.py) and the keymap (Shift+Space with Spacebar Action set to Play), checked 2026-10-15'
---

# Texture painting

Texture painting puts colour straight onto a model with a brush, the way you'd paint a real object. Blender stores the paint in an image, through the model's UV map. In this lesson you'll set up an image to paint on and paint dirt and wear onto a crate.

![A wooden crate painted in Texture Paint mode: darker dirt along the bottom of each side, and lighter worn patches along its edges and corners.](example)

## Steps

1. **Open Texture Paint.** Select the model and click the Texture Paint tab. The 3D Viewport on the right is in Texture Paint mode, and the Image Editor on the left shows the image you paint on. The model needs UV islands that don't overlap.

   ![The Texture Paint workspace: the Image Editor on the left showing the image being painted, the 3D Viewport on the right in Texture Paint mode with the crate.](workspace)

2. **Add an image to paint on.** In the 3D Viewport's header, open Texture Slots, click + and choose Base Color. Set Color to the model's main colour and click OK. Blender adds an Image Texture linked to Base Color.

   ![The Texture Slots popover with Mode Material and No Textures, and its + menu open with Base Color picked out above Specular IOR Level, Roughness, Metallic, Normal, Bump and Displacement.](slots)

3. **Pick a brush and a colour.** Choose a brush from the asset shelf at the bottom of the 3D Viewport, or press `Shift+Space` to open it at the mouse. Pick a colour in the header. `F` sets the size and `Shift+F` the strength.

   ![The asset shelf with Paint Hard, Paint Soft, Blur and Fill, the F key growing a brush circle and Shift+F turning its strength up, and Shift+Space opening the brushes at the mouse.](brush)

4. **Paint.** Drag on the model. Paint darker dirt low down where a crate meets the floor, and a lighter colour along edges and corners where wood wears. Turn on X under Symmetry to paint both sides of the model at once.

   ![The crate with a dark stroke along the bottom of its front, the brush circle at the end of it, and the Symmetry settings with X turned on.](paint)

5. **Save the image.** The paint lives only in Blender's memory until you save it. In the Image Editor choose Image > Save As and save a PNG next to the .blend. Saving the .blend in 5.2 also asks about unsaved images.

   ![The Image Editor's Image menu, marked Image* for unsaved changes, with Save As picked out.](save)

## Common mistake

![Left, a crate whose two faces share overlapping UVs, so one blue stroke shows on both. Right, each face with its own island, and the stroke shows once.](mistake)

A stroke that appears on two faces at once means their UV islands overlap, so both faces read the same pixels. It happens on models you never unwrapped, whose UVs came with the shapes you started from. Unwrap it, or move the islands apart, before you paint.

## Checking your model

Look at the crate in Material Preview and in the Image Editor:

1. The material has an Image Texture linked to Base Color.
2. Darker dirt runs along the bottom, with lighter wear on the edges.
3. A stroke on one face shows nowhere else.
4. A PNG of the painted image sits next to the .blend.
