---
needs: [lights, cameras]
exercise: render-the-stage
watch: [cg-boost-eevee-quality, blender-guru-donut-finale]
sources:
  - 'Blender 5.2 Manual, "Rendering: Introduction" (https://docs.blender.org/manual/en/5.2/render/introduction.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "EEVEE" (https://docs.blender.org/manual/en/5.2/render/eevee/index.html), read 2026-10-15'
  - 'Blender 5.2 Manual, EEVEE "Sampling": Viewport and Render Samples (https://docs.blender.org/manual/en/5.2/render/eevee/render_settings/sampling.html), read 2026-10-15'
  - 'Blender 5.2 Manual, EEVEE "Raytracing": Method, Screen-Trace and the light-probe fallback (https://docs.blender.org/manual/en/5.2/render/eevee/render_settings/raytracing.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "3D Viewport: Shading", the Z pie (https://docs.blender.org/manual/en/5.2/editors/3dview/display/shading.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Topbar", Render Image F12 and View Render F11 (https://docs.blender.org/manual/en/5.2/interface/window_system/topbar.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Image Editor: Editing", Save As with Shift+Alt+S (https://docs.blender.org/manual/en/5.2/editors/image/editing.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Compositing: Introduction", the New button (https://docs.blender.org/manual/en/5.2/compositing/introduction.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Glare Node", the Bloom type (https://docs.blender.org/manual/en/5.2/compositing/types/filter/glare.html), read 2026-10-15'
  - 'Blender 4.2 release notes, "EEVEE Migration Process", Bloom replaced by the Glare node (https://developer.blender.org/docs/release_notes/4.2/eevee_migration/), read 2026-10-15'
  - 'Blender 5.2.2, factory settings: Render Samples 64, Viewport Samples 16, Raytracing off, Shift+A > Filter > Glare > Bloom, checked 2026-10-15'
---

# Rendering with EEVEE

EEVEE is Blender's real-time render engine. It draws a finished picture in seconds, which suits game assets and quick tests. In this lesson you'll preview EEVEE in the viewport and set its samples and ray tracing. Then you'll render a still image, save it and add a glow to its brightest parts.

![The finished EEVEE render of the stage in Blender's render window, with a soft glow round the lantern.](example)

## Steps

1. **Preview the render.** Look through the camera with `Numpad 0`, press `Z` and choose Rendered. The viewport now shows EEVEE's picture as you work. EEVEE is already the Render Engine in the Render Properties tab.

   ![The shading pie after pressing Z, with Rendered at the top picked out and Wireframe, Solid and Material Preview around it.](preview)

2. **Set the samples.** In Render Properties, open Sampling. EEVEE draws each pixel several times with tiny shifts and blends the results, and each pass is a sample. Render Samples starts at 64, which gives smooth edges. Viewport Samples is 16.

   ![The Sampling panel with Viewport Samples 16 and Render Samples 64, beside the same edge close up: stepped at 1 sample, blended at 64.](samples)

3. **Turn on ray tracing.** Tick the Raytracing panel and leave Method on Screen-Trace. EEVEE then traces reflections and light bouncing between surfaces from what is on screen. With it off, EEVEE uses quicker estimates from light probes.

   ![The Raytracing panel ticked with Method set to Screen-Trace, beside a ray of light bouncing off the floor onto the side of the crate.](raytracing)

4. **Render and save.** Press `F12` to render through the camera into a new window. Choose Image > Save As, or press `Shift+Alt+S`, and save a PNG. `F11` brings the last render back later.

   ![F12 opening the render window, with its Image menu open and Save As picked out beside the keys Shift Alt S.](save)

5. **Add a glow.** Older tutorials tick Bloom, which EEVEE dropped in 4.2. Open the Compositing workspace and click New. Press `Shift+A`, choose Filter > Glare > Bloom, drop the node on the link into Group Output, and render again.

   ![The compositor nodes: Render Layers into a Glare node set to Bloom, into Group Output.](glare)

## Common mistake

![Left, a renders folder holding only the .blend file after the render window was closed. Right, the same folder with stage.png saved beside it.](mistake)

Blender does not save an `F12` render by itself. Close Blender or render again, and the picture is gone. Save each render you want to keep with Image > Save As as soon as it finishes.

## Checking your work

Open the PNG you saved and check:

1. It is 1920 by 1080 pixels.
2. All three props sit inside the picture.
3. The lantern has a soft glow round it.
4. The crate's edges look smooth, with no stair steps.
