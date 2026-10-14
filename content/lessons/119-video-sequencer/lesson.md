---
needs: [render-output]
exercise: asset-reel
watch: [ryan-king-video-editing, nick-gammon-vse-trimming]
sources:
  - Blender 5.2 Manual, "Video Editing" and "Sequencer Scene" (https://docs.blender.org/manual/en/5.2/video_editing/sequencer_scene.html), read 2026-10-15
  - Blender 5.2 Manual, "Strips: Introduction", the Add menu and Shift+A (https://docs.blender.org/manual/en/5.2/video_editing/edit/montage/strips/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing Strips", Split with K, Move with G, Delete with X (https://docs.blender.org/manual/en/5.2/video_editing/edit/montage/editing.html), read 2026-10-15
  - Blender 5.2 Manual, "Text Strip", text and style presets (https://docs.blender.org/manual/en/5.2/video_editing/edit/montage/strips/text.html), read 2026-10-15
  - Blender 5.2 Manual, "Sound Strip" (https://docs.blender.org/manual/en/5.2/video_editing/edit/montage/strips/sound.html), read 2026-10-15
  - Blender 5.2 Manual, "Output", Media Type and Encoding (https://docs.blender.org/manual/en/5.2/render/output/properties/output.html), read 2026-10-15
  - Blender 5.0 release notes, "Sequencer", the Sequencer Scene, strips added with Shift+A following the mouse, and strip properties in the Properties editor (https://developer.blender.org/docs/release_notes/5.0/sequencer/), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15, the Video Editing template (scene Edit, End 250, its H.264 in MPEG-4 and AAC settings), the Add menu, and a Color and Text edit rendered to an .mp4 named 0001-0024
---

# The Video Sequencer

The Video Sequencer is Blender's video editor. You lay renders, titles and music along a timeline, cut them to length and render the lot as one video file. In this lesson you'll put together a short reel of your models with a title and music.

![A 20-second edit: three shots on channel 1, a title on channel 2 and music on channel 3, ending at frame 480.](example)

## Steps

1. **Start a video edit.** Choose File > New > Video Editing. The edit lives in a scene called Edit, shown in the Sequencer's header. In Output properties > Frame Range, set End to 480, which is 20 seconds at 24 frames a second.

   ![File > New > Video Editing, and the Sequencer's header with its scene, Edit.](template)

2. **Add your renders.** With the mouse over the Sequencer, press `Shift+A` and choose Movie or Image/Sequence, then pick the files. Each one becomes a strip, a bar on a channel. Channels are the timeline's rows. A new strip follows the mouse until you click.

   ![The Sequencer's Add menu with Movie picked out, above Sound, Image/Sequence and Text.](add-menu)

3. **Cut to length.** Select a strip, put the playhead where you want the cut and press `K` to split the strip in two. Select the part you don't want and press `X` to delete it. Press `G` to slide the strips together.

   ![A strip split in two at the playhead with K.](split)

4. **Add a title.** Press `Shift+A` and choose Text, then move it to channel 2 over your first shot. Type your words in Properties editor > Strip > Effect Strip. Its presets menu has Main Title, for large text in the middle.

   ![The Effect Strip panel with the title's text, and the presets menu with Main Title picked out.](title)

5. **Render the video.** In Output properties, set File Path to a folder such as //video/. The template already uses Media Type Video with MPEG-4, H.264 and AAC sound. Press `Ctrl+F12` to render the whole edit to one .mp4 file.

   ![Output properties with End at 480, Media Type Video, MPEG-4, H.264 and AAC, and Ctrl+F12.](render)

Add music the same way, with Add > Sound, on a channel of its own. Nick Gammon's video shows trimming and moving strips in 5.0.

## Common mistake

![Left, strips running to frame 480 with End still at 250, so everything after is hatched out. Right, End at 480.](mistake)

A new edit ends at frame 250, and adding strips doesn't change that. If your strips run longer, the video stops at 10 seconds, partway through a shot. Set End in Output properties > Frame Range to the last frame of your last strip.

## Checking your work

Play the .mp4 file in a video player and check:

1. It runs for 20 seconds and ends on your last shot.
2. The title reads clearly over the first shot.
3. The music plays from start to finish and stops with the picture.
4. There are no black frames between shots.
