---
needs: [eevee, shader-editor]
exercise: grade-the-portfolio
watch: [grant-abbitt-compositing, ryan-king-compositing-5]
sources:
  - 'Blender 5.2 Manual, "Compositing: Introduction", the New button and the Compositing option (https://docs.blender.org/manual/en/5.2/compositing/introduction.html), read 2026-10-15'
  - Blender 5.2 Manual, "Compositor" editor, the Asset Shelf (https://docs.blender.org/manual/en/5.2/editors/compositor.html), read 2026-10-15
  - Blender 5.2 Manual, "Group Output", the first image input is the render result (https://docs.blender.org/manual/en/5.2/compositing/types/output/group_output.html), read 2026-10-15
  - Blender 5.2 Manual, "Viewer Node", Shift+Ctrl and left click (https://docs.blender.org/manual/en/5.2/compositing/types/output/viewer.html), read 2026-10-15
  - Blender 5.2 Manual, "Glare Node", Bloom and Threshold (https://docs.blender.org/manual/en/5.2/compositing/types/filter/glare.html), read 2026-10-15
  - Blender 5.2 Manual, "Color Balance Node", Lift, Gamma and Gain (https://docs.blender.org/manual/en/5.2/compositing/types/color/adjust/color_balance.html), read 2026-10-15
  - Blender 5.2 Manual, "Vignette Node", Factor (https://docs.blender.org/manual/en/5.2/compositing/types/camera_lens_effects/vignette.html), read 2026-10-15
  - Blender 5.2 Manual, "Render Passes" (https://docs.blender.org/manual/en/5.2/render/layers/passes.html), read 2026-10-15
  - Blender 5.2 Manual, "Node Editing", dropping a node on a link (https://docs.blender.org/manual/en/5.2/interface/controls/nodes/editing.html), read 2026-10-15
  - Blender 5.0 release notes, "Compositor", the Composite node replaced by Group Output and the built-in Vignette asset (https://developer.blender.org/docs/release_notes/5.0/compositor/), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15, the tree New makes, the Glare defaults, the Ambient Occlusion pass output, and a render through Glare, Color Balance and Vignette into Group Output
---

# The Compositor

The Compositor changes a finished render with nodes: a glow round the lights, a colour grade, darker corners. It works on the image, so you can try changes without rendering the scene again. In this lesson you'll build a short chain of nodes between the render and the saved picture.

![The finished tree: Render Layers into Glare, Color Balance and Vignette, then into Group Output and a Viewer.](example)

## Steps

1. **Start a compositing tree.** Click the Compositing workspace tab and press `F12` to render once. Then click New in the Compositor's header. Blender adds a Render Layers node joined to a Group Output and a Viewer.

   ![The Compositor header with the New button, and the tree it makes: Render Layers joined to Group Output and Viewer.](new-tree)

2. **Add a glow.** Press `Shift+A`, choose Filter > Glare and drop it on the wire after Render Layers to insert it. Set Type to Bloom. Parts of the image brighter than Threshold, 1.0, spread a soft glow.

   ![The Glare node set to Bloom, beside a bright light before and after the glow.](glare)

3. **Grade the colour.** Add Color > Adjust > Color Balance after the Glare. Its Lift wheel tints the shadows, Gamma the middle tones and Gain the highlights. A little blue in Lift and orange in Gain warms the picture.

   ![The Color Balance wheels: Lift nudged towards blue, Gamma left alone, Gain nudged towards orange.](grade)

4. **Darken the corners.** Press `Shift+A`, type vignette and click Vignette, or drag it from the asset shelf at the bottom of the Compositor. Put it last, before the Group Output. Lower its Factor from 1.0 to about 0.4.

   ![The Vignette node with Factor at 0.4, beside a frame with darkened corners.](vignette)

5. **Look at a pass.** A pass is one part of the render, such as its shadows. Tick Ambient Occlusion in View Layer properties > Passes > Light and render again. Drag a wire from Render Layers' new output to the Viewer to see it.

   ![The Light passes with Ambient Occlusion ticked, and the Render Layers node with a new Ambient Occlusion output.](passes)

Older tutorials end the tree in a Composite node. Blender 5.0 replaced it with the Group Output.

## Common mistake

![Left, the Vignette feeding only the Viewer while the Glare feeds the Group Output. Right, the Vignette feeding both.](mistake)

The Viewer shows a preview only. The render, and the picture you save, come from the Group Output. If your last node feeds the Viewer and not the Group Output, the saved image looks unchanged. Connect the last node to the Group Output.

## Checking your work

Render with `F12` and check the result:

1. The render shows the glow, the grade and the vignette.
2. The glow sits round the brightest parts only.
3. The corners are darker but their detail still shows.
4. Output properties > Post Processing has Compositing ticked.
