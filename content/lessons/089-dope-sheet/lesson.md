---
needs: [keyframes]
exercise: retime-the-bounce
watch: [skill-brew-dope-sheet, blender-dope-sheet]
sources:
  - Blender 5.2 Manual, "Dope Sheet: Introduction", channels and keyframes (https://docs.blender.org/manual/en/5.2/editors/dope_sheet/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing Dopesheet Data", Select menu, scaling only moves keys in time from the playhead, Keyframe Type R (https://docs.blender.org/manual/en/5.2/editors/dope_sheet/editing.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing F-Curves", Move, Scale, Copy and Paste, Duplicate (https://docs.blender.org/manual/en/5.2/editors/graph_editor/fcurves/editing.html), read 2026-10-15
  - Blender 5.2 Manual, "Timeline", S scales keys in relation to the playhead (https://docs.blender.org/manual/en/5.2/editors/timeline.html), read 2026-10-15
  - Blender 5.2 Manual, "Markers", Add Marker M and Rename Marker F2 (https://docs.blender.org/manual/en/5.2/animation/markers.html), read 2026-10-15
  - Blender 5.2 Manual, "Animation Editors", Playback popover, Loop (https://docs.blender.org/manual/en/5.2/animation/animation_editors.html), read 2026-10-15
  - Blender 5.2 Manual, "Keyframes: Introduction", Keyframe Types (https://docs.blender.org/manual/en/5.2/animation/keyframes/introduction.html), read 2026-10-15
  - Blender 5.2.2, checked 2026-10-15: the Animation workspace has a Dope Sheet; pasted keys land with the first on the current frame by default; Loop is Infinite by default
---

# The Dope Sheet

The Dope Sheet lists every keyframe in the scene, one row for each animated property. It's where you change the timing of an animation without touching its poses. In this lesson you'll select, move, scale and copy keys, and mark moments, to give a bouncing ball believable timing.

![The ball's Z Location keys in the Dope Sheet, first a key every 12 frames, then retimed so each bounce is shorter than the one before.](example)

## Steps

1. **Open the Dope Sheet.** Select the ball and switch to the Animation workspace, or change any area with its Editor Type button. Each row is a channel, one animated property such as Z Location, and each diamond a keyframe. The Summary row shows every key.

   ![The Dope Sheet with the channel list on the left, Summary, Ball, Object Transforms and Z Location, and a row of diamonds for each.](open)

2. **Select keys.** Click a keyframe to select it, and hold `Shift` and click to add more. Press `B` and drag to select keys in a box, or `A` to select all of them.

   ![The keys B, A and Shift, and a dashed box around the last bounce's three keys, now picked out.](select)

3. **Move and scale timing.** `G` slides the selected keys along in time. `S` scales the gaps between them, measured from the playhead, so put the playhead on the keyframe that should stay put. In the Dope Sheet, scaling changes timing only, never values.

   ![Keys on 13, 25, 37 and 49 scaled by 0.5 from a playhead on 13: the one on 13 stays and the others close up to 19, 25 and 31.](scale)

4. **Copy and duplicate.** `Shift+D` duplicates the selected keys and lets you slide the copies to a new frame. `Ctrl+C` copies keys, and `Ctrl+V` pastes them with the first on the current frame. Use them to repeat a bounce or a blink.

5. **Mark moments.** Press `M` to add a marker on the current frame, such as each frame where the ball lands, and `F2` to name it. Markers show in every animation editor, so keys can line up with them anywhere.

   ![The retimed keys with a marker named land under each frame where the ball touches the ground.](markers)

6. **Label and loop.** `R` sets the keyframe type, such as Breakdown or Extreme, which changes how the diamond looks. In the Playback popover, Loop sets what happens at the end frame. Infinite, the default, starts again.

## Common mistake

![Above, the last bounce's keys scaled with the playhead on frame 1: they jump back to frames 31 to 43. Below, the playhead on frame 61: that key stays and the others close up to it.](mistake)

`S` scales from the playhead, wherever it is. With the playhead left on frame 1, the selected keys slide back towards the start of the animation as well as closing up. Put the playhead on the first selected keyframe before you press `S`.

## Checking your work

Play the ball from frame 1 and check:

1. Each bounce takes fewer frames than the one before.
2. Each bounce starts on the frame where the last one lands.
3. A marker sits on every frame where the ball lands.
4. The animation ends on the last landing, with no pause before it loops.
