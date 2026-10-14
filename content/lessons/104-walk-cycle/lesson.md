---
needs: [graph-editor, inverse-kinematics]
exercise: walk-24-frames
watch: [pierrick-picaut-walk-cycle, imphenzia-walk-cycle]
sources:
  - Blender 5.2 Manual, "Editing Keyframes", Insert Keyframe (https://docs.blender.org/manual/en/5.2/animation/keyframes/editing.html), read 2026-10-15
  - Blender 5.2 Manual, "Timeline", Frame Controls (https://docs.blender.org/manual/en/5.2/editors/timeline.html), read 2026-10-15
  - Blender 5.2 Manual, "Copy/Paste Pose" (https://docs.blender.org/manual/en/5.2/animation/armatures/posing/editing/copy_paste.html), read 2026-10-15
  - Blender 5.2 Manual, "F-Curve Modifiers", Cycles Modifier (https://docs.blender.org/manual/en/5.2/editors/graph_editor/fcurves/modifiers.html), read 2026-10-15
  - Blender 5.2 Manual, "Motion Paths" (https://docs.blender.org/manual/en/5.2/animation/motion_paths.html), read 2026-10-15
  - Blender 5.2.2, the Graph Editor's Channel menu and Pose > Motion Paths > Calculate (5.2/scripts/startup/bl_ui/space_graph.py and space_view3d.py); A in the Graph Editor selecting every curve and Add F-Curve Modifier adding Cycles to all of them, checked 2026-10-15
  - Pierrick Picaut, "Create a Walk Cycle animation in Blender" (https://www.youtube.com/watch?v=SLh3hUIxv1s), read 2026-10-15
  - Imphenzia, "Simple Walk Cycle in Blender 2.81" (https://www.youtube.com/watch?v=B5h2HvkqXZ0), read 2026-10-15
---

# A walk cycle

A walk cycle is two steps, one with each foot, that end where they began, so a game can play them on a loop. In this lesson you'll pose the four key poses of the first step, paste them flipped for the second, and make the 24 frames repeat without a hitch.

![The eight key poses of a walk, frames 1 to 22, with a dashed line through the hips that dips on the down poses and rises on the up poses.](example)

## Steps

1. **Set the length.** In the Timeline, set Start to 1 and End to 24. At 24 frames a second the walk lasts one second. It stays in place: the hips stay over the origin and a foot on the ground slides back.

   ![The Timeline from 1 to 25 with a key every 3 frames, the pose on each named under it, and End set to 24.](frames)

2. **Pose the contact.** On frame 1, in Pose Mode, put the left foot forward, heel down, and the right foot back on its toes. Swing the left arm back and the right arm forward. Press `A` to select every bone and `I` to key them.

   ![The contact pose: the left leg forward with its heel on the ground, the right foot back on its toes and the left arm back, beside the keys A and I.](contact)

3. **Add down, passing and up.** On frame 4, bend the knees so the hips drop: the down pose. On frame 7, swing the right leg past the left: passing. On frame 10, push up onto the left toes: up. Key each one.

   ![The down pose on frame 4 with the hips lowest, the passing pose on frame 7 with the back leg swinging past, and the up pose on frame 10 with the hips highest.](poses)

4. **Paste them flipped.** Copy frame 1's pose with `Ctrl+C`. On frame 13, paste it flipped with `Shift+Ctrl+V` and press `I`. Repeat from 4 to 16, 7 to 19 and 10 to 22. On frame 25, paste frame 1 unflipped with `Ctrl+V` and press `I`.

   ![The contact pose on frame 1, and the same pose pasted flipped on frame 13 with the other leg in front, joined by Ctrl+C and Shift+Ctrl+V.](flip)

5. **Make it loop.** In the Graph Editor, press `A` to select every curve, then choose Channel > Add F-Curve Modifier > Cycles. Each curve now repeats its keys from 1 to 25 before and after them, so the walk keeps going past frame 25.

   ![The Graph Editor with the hips' height curve from frame 1 to 25 and dashed copies of it before and after, under Channel, Add F-Curve Modifier, Cycles.](cycles)

6. **Check the arcs.** Select the foot and hand bones and choose Pose > Motion Paths > Calculate. Each bone draws its path, a dot per frame. A foot should slide back flat along the ground, then swing forward in a smooth curve.

   ![The left foot's motion path over the walk: a flat run back along the ground from frame 1 to 13, then a smooth arc forward, with a dot for every frame.](paths)

Pierrick Picaut builds his walk from these four poses. Imphenzia pastes the first step's poses flipped to make the second.

## Common mistake

![Frames 23 to 2 of the walk. Top, with End at 25: frames 25 and 1 both show the contact pose, outlined in red. Bottom, with End at 24: frame 24 runs straight into frame 1.](mistake)

Frame 25 holds the same pose as frame 1. If the End frame is 25, playback shows that pose twice in a row and the walk stalls for a frame on every loop. Keep frame 25's keys for the curves, but set End to 24.

## Checking your model

Play the walk with `Space` and check:

1. Frames 1, 13 and 25 are contact poses, with the feet swapped on 13.
2. The hips are lowest on frames 4 and 16, highest on 10 and 22.
3. A foot on the ground slides straight back without lifting.
4. The foot paths are smooth loops with no sharp corners.
5. Playback runs from frame 24 into frame 1 without a pause.
