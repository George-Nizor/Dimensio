---
needs: [eevee]
exercise: turntable-frames
watch: [ryan-king-render-video, blender-manual-render-output-properties-output]
sources:
  - 'Blender 5.2 Manual, "Format": Resolution, Percentage and Frame Rate (https://docs.blender.org/manual/en/5.2/render/output/properties/format.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Frame Range" (https://docs.blender.org/manual/en/5.2/render/output/properties/frame_range.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Output": File Path, the // prefix, frame numbers, Media Type, File Format and Encoding (https://docs.blender.org/manual/en/5.2/render/output/properties/output.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Rendering Animations": rendering frames first, and Overwrite (https://docs.blender.org/manual/en/5.2/render/output/animation.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Animation Player", View Animation with Ctrl+F11 (https://docs.blender.org/manual/en/5.2/render/output/animation_player.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Topbar", Render Animation with Ctrl+F12 (https://docs.blender.org/manual/en/5.2/interface/window_system/topbar.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Displays and Views": AgX, Standard and Exposure (https://docs.blender.org/manual/en/5.2/render/color_management/displays_views.html), read 2026-10-15'
  - 'Blender 5.2.2, factory settings: 1920 by 1080 at 100%, 24 fps, frames 1 to 250, PNG, AgX; Media Type Video starts on Matroska with H.264; the render-stage scene rendered in AgX and Standard, checked 2026-10-15'
---

# Render output

A render has a size, a frame range, a place to save to and a colour view, and all four live in the Properties editor. In this lesson you'll set them up and render a turntable: a prop turning once, saved as a numbered picture for every frame.

![Six of the 48 frames of the turntable, each turned a little further, named 0001.png to 0041.png.](example)

## Steps

1. **Set the size.** Open the Output Properties tab. Under Format, Resolution X and Y give the picture's size in pixels, 1920 by 1080 at first. Set % to 50 for test renders: the picture keeps its shape at half the size.

   ![The Format panel with Resolution 1920 by 1080 and % set to 50, beside a 1920 by 1080 frame with the 960 by 540 test size inside it.](size)

2. **Set the frames.** Under Frame Range, Frame Start and End choose which frames render. Frame Rate, under Format, is 24 fps, so 48 frames last two seconds.

   ![The Frame Range panel with End set to 48, Frame Rate 24 fps, and a timeline with frames 1 to 48 picked out.](frames)

3. **Say where the frames go.** In the Output panel, type //turntable/ as the path. Two slashes at the start mean your .blend file's folder. Leave Media Type on Image and File Format on PNG. Blender numbers the frames 0001.png, 0002.png and so on.

   ![The Output panel with the path //turntable/, Media Type Image and File Format PNG, beside a turntable folder holding 0001.png to 0048.png.](output)

4. **Check the colour view.** In Render Properties, open Color Management. View Transform starts on AgX, which rolls bright colours off gently, the way film does. Standard leaves colours as you set them but turns bright areas flat white. Exposure brightens or darkens everything.

   ![A graph of brightness in the render against brightness on screen: Standard climbs straight and stops flat at white, AgX bends over before it gets there.](colour)

5. **Render the animation.** Save the .blend file, then press `Ctrl+F12`. Blender renders each frame and saves it before starting the next. Render > View Animation, or `Ctrl+F11`, plays the frames back at the frame rate.

6. **Save a video instead.** Set Media Type to Video. In the Encoding panel, choose Container MPEG-4 with Video Codec H.264 for an .mp4 file.

   ![Media Type set to Video, and the Encoding panel with Container MPEG-4 and Video Codec H.264.](video)

## Common mistake

![Left, one video file whose render stopped at frame 30, so nothing was kept. Right, a folder of PNG frames with the first 30 kept.](mistake)

A long animation rendered straight to a video file is lost if Blender stops part way, and every frame has to render again. Render PNG frames first. To carry on after a stop, untick Overwrite in the Output panel and render again: Blender skips frames already saved.

## Checking your work

Open the turntable folder beside your .blend file:

1. It holds 48 PNG files, 0001.png to 0048.png.
2. Each picture is 960 by 540 pixels, at 50%.
3. View Animation shows one smooth turn with no jump where it loops.
