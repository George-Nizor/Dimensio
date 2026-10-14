---
needs: [transform]
exercise: spinning-coin
watch: [cgcookie-keyframes, grant-abbitt-animation-keyframes]
sources:
  - 'Blender 5.2 Manual, "Keyframes: Introduction", the object''s name turning yellow on a keyframe (https://docs.blender.org/manual/en/5.2/animation/keyframes/introduction.html), read 2026-10-15'
  - Blender 5.2 Manual, "Editing Keyframes", I, hovering over a property, Alt+I, Auto Keyframe (https://docs.blender.org/manual/en/5.2/animation/keyframes/editing.html), read 2026-10-15
  - Blender 5.2 Manual, "Timeline", Frame Range and keyframes of selected items (https://docs.blender.org/manual/en/5.2/editors/timeline.html), read 2026-10-15
  - Blender 5.2 Manual, "Animation Editors", Playhead, Left and Right, Space, Up and Down to jump between keyframes, Auto Keying (https://docs.blender.org/manual/en/5.2/animation/animation_editors.html), read 2026-10-15
  - 'Blender 5.2 Manual, "Animation: Introduction", State Colors (https://docs.blender.org/manual/en/5.2/animation/introduction.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Preferences: Animation", Default Key Channels (https://docs.blender.org/manual/en/5.2/editors/preferences/animation.html), read 2026-10-15'
  - Blender release notes 4.1, I keys at once with no menu (https://developer.blender.org/docs/release_notes/4.1/animation_rigging/), and 5.0, Up and Down swapped (https://developer.blender.org/docs/release_notes/5.0/user_interface/), read 2026-10-15
  - 'Blender 5.2.2, checked 2026-10-15: the default key channels are Location, Rotation, Scale and Custom Properties; the scene runs at 24 frames a second; a keyed object moved without pressing I goes back to its keyed place when the frame changes'
---

# Keyframes

A keyframe stores the value of a property on one frame, and Blender works out every frame in between. In this lesson you'll keyframe an object's location, rotation and scale, play the result and step from one keyframe to the next. You'll animate a coin that rises, spins and lands.

![A coin at frame 1 on the ground, at frame 12 halfway up and edge-on, and at frame 24 at the top, turned around, above a Timeline with keys on frames 1, 24 and 48.](example)

## Steps

1. **Set the length.** In the Timeline's header, set End to 48. At Blender's 24 frames a second that is two seconds. Drag in the numbers along the Timeline's top to move the playhead, the blue line at the current frame.

   ![The Timeline with Start 1 and End 48, and the playhead on frame 20.](timeline)

2. **Keyframe the first pose.** On frame 1, select the coin and press `I` with the mouse over the 3D Viewport. Blender keys its location, rotation and scale, with no menu. A diamond appears in the Timeline and the object's name in the viewport turns yellow.

   ![The coin in the 3D Viewport with the mouse over it, the I key, and a diamond on frame 1 of the Timeline.](key)

3. **Keyframe the next poses.** Go to frame 24, raise the coin 1 m with `G` `Z`, turn it with `R` `Z` and 180, and press `I`. On frame 48, put it back down, turn it another 180 degrees and press `I`.

   ![The coin's three poses above the Timeline's keys on frames 1, 24 and 48: on the ground, 1 m up and turned, back down.](poses)

4. **Play and step.** Press `Space` to play and again to stop. `Left` and `Right` move one frame. `Up` jumps to the previous keyframe and `Down` to the next. Blender 5.0 swapped these two, so older videos show the opposite.

   ![The keys Space, Left, Right, Up and Down, with arrows from the playhead on frame 30 back to the key on 24 and on to the key on 48.](stepping)

5. **Keyframe one property.** In the Sidebar's Item tab, hover over a field such as Rotation Z and press `I` to keyframe only that value. `Alt+I` over the 3D Viewport deletes the selected object's keys on the current frame.

   ![The Sidebar's Item tab with the mouse over Rotation Z, picked out, beside the I key.](property)

6. **Try Auto Keying.** The record button in the Timeline's header keys every move you make on the current frame, with no `I`. Turn it off when you finish, or the moves you only meant to try become keys too.

## Common mistake

![Left, the coin keyed only on frame 1, moved up on frame 24 without a key, and dropping back. Right, I pressed on frame 24, a second diamond in the Timeline, and the coin staying up.](mistake)

Moving a keyed object doesn't change its animation. Its fields turn orange, which means changed but not keyed, and the next frame change puts it back. Press `I` before you leave the frame.

## Checking your work

Play the coin from frame 1 and check:

1. The Timeline shows diamonds on frames 1, 24 and 48.
2. The coin rises, spins and lands in two seconds.
3. `Up` and `Down` stop the playhead on each of the three keys.
4. Auto Keying is off.
