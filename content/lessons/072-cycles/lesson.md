---
needs: [eevee]
exercise: noise-and-time
watch: [blender-guru-render-faster, blender-manual-render-cycles-render-settings-sampling]
sources:
  - 'Blender 5.2 Manual, "Rendering: Introduction", Cycles as a path tracer (https://docs.blender.org/manual/en/5.2/render/introduction.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "GPU Rendering": CUDA, OptiX, HIP, oneAPI and the GPU Compute device (https://docs.blender.org/manual/en/5.2/render/cycles/gpu_rendering.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Preferences: System", Cycles Render Devices (https://docs.blender.org/manual/en/5.2/editors/preferences/system.html), read 2026-10-15'
  - 'Blender 5.2 Manual, Cycles "Sampling": Noise Threshold, Max Samples and Denoise (https://docs.blender.org/manual/en/5.2/render/cycles/render_settings/sampling.html), read 2026-10-15'
  - 'Blender 5.2 Manual, Cycles "Light Paths", Max Bounces (https://docs.blender.org/manual/en/5.2/render/cycles/render_settings/light_paths.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "EEVEE", how EEVEE differs from Cycles (https://docs.blender.org/manual/en/5.2/render/eevee/index.html), read 2026-10-15'
  - 'Blender 5.2.2, factory settings: Device CPU, Noise Threshold 0.01, Max Samples 4096, Denoise on, Max Bounces Total 12; the render-stage scene rendered at 0, 4 and 12 bounces, checked 2026-10-15'
---

# Rendering with Cycles

Cycles traces rays of light as they bounce around the scene. Its shadows and reflections come out more accurate than EEVEE's, and each picture takes longer. In this lesson you'll render with Cycles on your graphics card and choose how much sampling and denoising a picture needs.

![The same Cycles render twice: grainy at Noise Threshold 0.1 with Denoise off, and clean at 0.01 with Denoise on.](example)

## Steps

1. **Turn on your graphics card.** Open Edit > Preferences > System. Under Cycles Render Devices, choose OptiX or CUDA for an NVIDIA card, HIP for AMD or oneAPI for Intel. Then tick your card in the list.

   ![Cycles Render Devices with the OptiX tab chosen and the graphics card ticked below it, and CPU unticked.](devices)

2. **Switch to Cycles.** In Render Properties, set Render Engine to Cycles and Device to GPU Compute. With no card set up, Device stays on CPU, which works but is slower.

   ![Render Properties with Render Engine set to Cycles and Device set to GPU Compute.](engine)

3. **Set the noise threshold.** Open Sampling > Render. Cycles samples each pixel until its noise drops below Noise Threshold, 0.01 at first, or it reaches Max Samples, 4096. Use 0.1 for quick tests. Lower values look cleaner and take longer.

   ![Sampling > Render with Noise Threshold ticked at 0.0100, Max Samples 4096, Min Samples 0 and Time Limit 0 s.](threshold)

4. **Keep Denoise on.** Denoise, under Sampling > Render, starts ticked. It clears the grain that sampling leaves, so a higher threshold often looks clean enough. At very few samples it can blur fine detail.

   ![Denoise ticked, and the same render before and after: grainy, then clean.](denoise)

5. **Check the bounces.** Under Light Paths, Max Bounces Total is 12: how many times a ray may reflect before Cycles stops it. Fewer bounces render faster. At 0, the barrel's metal hoops turn black, with nothing to reflect.

   ![A ray from the camera bouncing off the floor, then off the crate, then reaching the light, beside Max Bounces Total set to 12.](bounces)

6. **Pick the engine.** Cycles handles bounced light and glass more accurately, but every frame costs more time. EEVEE is far quicker and is often enough for a low-poly asset on a plain backdrop.

## Common mistake

![Left, Render Engine Cycles with Device still on CPU. Right, Device set to GPU Compute.](mistake)

You switch to Cycles and the render crawls, because Device still says CPU. Device is a setting of each scene, and a new file starts on CPU. Set it to GPU Compute before any long render.

## Checking your work

Look at the three renders you saved:

1. The render at 0.1 without Denoise shows grain on the floor.
2. With Denoise on, the same render looks clean.
3. The render at 0.01 took several times longer than at 0.1.
4. Device reads GPU Compute, if Blender supports your graphics card.

Without a supported graphics card, Cycles renders on the CPU, more slowly.
