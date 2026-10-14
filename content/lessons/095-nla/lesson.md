---
needs: [actions]
exercise: open-wait-close
watch: [joey-carlino-nla-layers, blender-manual-editors-nla-introduction]
sources:
  - Blender 5.2 Manual, "Nonlinear Animation" introduction, the Action Track, Tweak Mode, Add > Action with Shift-A (https://docs.blender.org/manual/en/5.2/editors/nla/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Tracks", Push Down Action, Mute and Solo (https://docs.blender.org/manual/en/5.2/editors/nla/tracks.html), read 2026-10-15
  - Blender 5.2 Manual, "Strips", action strips (https://docs.blender.org/manual/en/5.2/editors/nla/strips.html), read 2026-10-15
  - Blender 5.2 Manual, "Sidebar", Extrapolation Hold, Blend In and Out, Action Clip with Playback Scale and Repeat (https://docs.blender.org/manual/en/5.2/editors/nla/sidebar.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing Strips", Move with G, Start Tweaking Strips Actions with Tab (https://docs.blender.org/manual/en/5.2/editors/nla/editing/strip.html), read 2026-10-15
  - Blender 5.2 source, blenkernel/intern/nla.cc, Push Down puts the strip on a new track named after the action and makes it active (https://projects.blender.org/blender/blender/src/branch/blender-v5.2-release/source/blender/blenkernel/intern/nla.cc), read 2026-10-15
  - Blender 5.2 source, editors/space_nla/nla_edit.cc, Add Action Strip places the strip at the current frame on the active track (https://projects.blender.org/blender/blender/src/branch/blender-v5.2-release/source/blender/editors/space_nla/nla_edit.cc), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15 with the hinged-door starter, open at frame 1 and close at frame 60 on one track hold the door at -100° from frame 24 to 60 and shut it by frame 83
---

# The NLA editor

The Nonlinear Animation editor, the NLA editor for short, places whole actions on a timeline as strips, the way a video editor places clips. In this lesson you'll build a door that opens, waits and closes from two actions, then repeat and blend strips.

![The door's NLA track with two strips, open from frame 1 to 24 and close from 60 to 83, above a curve of its angle: it opens, holds at -100° while no strip plays, then closes.](example)

## Steps

1. **Open the NLA editor.** In the Animation workspace, change the Dope Sheet to Nonlinear Animation with the Editor Type menu. Select the door. Its orange Action Track holds the active action, open. Below it, a muted [Action Stash] track holds close.

   ![The NLA editor with the door's orange Action Track holding open and its Push Down button picked out, above a muted Action Stash track with close drawn dashed.](editor)

2. **Push down open.** Click the Push Down button beside open. The action becomes a strip on a new track called open. A strip plays one action at a place in time. The door now has no active action.

   ![After Push Down: the Action Track is empty, and open is a strip from frame 1 to 24 on a new track called open.](pushdown)

3. **Add close after it.** Click the open track's name to make it active. Put the playhead on frame 60, hover over the strips and press `Shift+A`, then choose close. Between the strips the door holds open's last pose.

   ![The playhead on frame 60 and Shift+A, with close added to the open track from frame 60 to 83.](add)

4. **Move and repeat strips.** Press `G` to slide the selected strip in time. In the Sidebar (`N`), the Strip tab's Action Clip panel has Repeat, which plays the action several times in one strip, and Playback Scale, which slows it down.

   ![The Action Clip panel with Repeat set to 3, and the open strip it makes, playing open three times from frame 1 to 70.](repeat)

5. **Blend between strips.** In the same tab, Blend In and Blend Out ramp a strip's influence up and down over that many frames. Untick a track's checkbox to mute it, so it stops playing.

   ![The Active Strip panel with Blend In and Out set to 6, and a strip whose influence ramps up over its first 6 frames and down over its last 6.](blend)

6. **Edit a strip's keyframes.** Select a strip and press `Tab` to tweak it: its action opens in the Dope Sheet and the Graph Editor. Press `Tab` again when you're done.

## Common mistake

![Left, a keyframe inserted after Push Down makes DoorAction in the orange track, which overrides every strip. Right, the open strip tweaked with Tab, so new keyframes go into open.](mistake)

After Push Down the door has no active action, so a new keyframe makes one, DoorAction, in the orange track. It plays above every strip and overrides them. To change a strip's animation, select the strip and press `Tab` first.

## Checking your work

Play the animation from frame 1 and check:

1. open and close sit on one track, with close starting at frame 60.
2. Between frames 24 and 60 the door stays open.
3. The orange Action Track holds no action.
4. The door opens, waits and closes once, shut by frame 83.
