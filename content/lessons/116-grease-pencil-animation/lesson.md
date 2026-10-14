---
needs: [grease-pencil, dope-sheet]
exercise: flickering-flame
watch: [micah-buzan-grease-pencil, blender-manual-grease-pencil-animation-introduction]
sources:
  - Blender 5.2 Manual, "Grease Pencil: Introduction", 2D Animation Template (https://docs.blender.org/manual/en/5.2/grease_pencil/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Grease Pencil Animation: Introduction", keyframes and Auto Keying (https://docs.blender.org/manual/en/5.2/grease_pencil/animation/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Animation Tools", Insert Blank Keyframe and Interpolate Sequence (https://docs.blender.org/manual/en/5.2/grease_pencil/animation/tools.html), read 2026-10-15
  - Blender 5.2 Manual, "Onion Skinning" (https://docs.blender.org/manual/en/5.2/grease_pencil/properties/onion_skinning.html), read 2026-10-15
  - Blender 5.2 Manual, "Dope Sheet: Grease Pencil" (https://docs.blender.org/manual/en/5.2/editors/dope_sheet/modes/grease_pencil.html), read 2026-10-15
  - Blender 5.2 Manual, "Default Keymap", frame keys (https://docs.blender.org/manual/en/5.2/interface/keymap/blender_default.html), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15, the 2D Animation template's layers, Auto Keying and onion skin colours, and the Left, Right and Shift+Ctrl+E keys in the shipped keymap
---

# Grease Pencil animation

Grease Pencil animates the way animators draw on paper: one drawing after another, each shown for a few frames. In this lesson you'll draw a short loop frame by frame, with onion skinning to show the drawings either side. Then you'll let Blender draw the in-betweens.

![Four drawings of a flame on frames 1, 4, 7 and 10 of a 12-frame loop, each a little different.](example)

## Steps

1. **Start from the 2D Animation template.** Choose File > New > 2D Animation. It opens in Draw Mode, looking through the camera, with Auto Keying on. In Output properties > Frame Range, set End to 12.

   ![The File > New menu with 2D Animation picked out.](template)

2. **Draw on the first frame.** On frame 1, draw a flame on the Lines layer. In Grease Pencil a keyframe holds a whole drawing, and that drawing stays on screen until the next keyframe.

3. **Draw the next drawing.** Press `Right` three times to reach frame 4, then draw the flame again, a little changed. Auto Keying makes a new keyframe. Onion skinning shows the drawing before in green and the one after in blue.

   ![Frame 4 with its flame in ink, frame 1's flame as a green ghost and frame 7's as a blue ghost.](onion)

4. **Set up the onion skin.** In Object Data properties > Onion Skinning, Keyframes Before and After set how many ghosts you see. For a loop, turn on Display > Show Start Frame, so the last drawing shows frame 1 as a ghost.

   ![The Onion Skinning panel with one keyframe before and after, and Show Start Frame turned on.](onion-panel)

5. **Time the drawings.** The Dope Sheet under the viewport is in Grease Pencil mode. Each layer is a row and each keyframe is a drawing. Select keyframes and press `G` to move them and change how long each drawing holds.

   ![The Dope Sheet with drawings on frames 1, 4, 7 and 10 of the Lines row and smaller in-betweens on the frames between.](dopesheet)

6. **Let Blender draw the in-betweens.** Put the playhead between two drawings and press `Shift+Ctrl+E`. Interpolate Sequence adds a drawing on every frame between them, blending one shape into the next. It works best when both drawings are one stroke.

   ![The flames drawn on frames 1 and 4, with the in-betweens Blender made on frames 2 and 3.](interpolate)

The manual's own example is a bouncing ball drawn on frames 1, 12 and 24 of the same template.

## Common mistake

![Left, two flames showing on frame 4 and one keyframe in the Dope Sheet. Right, one flame on frame 4 and a new keyframe there.](mistake)

With Auto Keying off, a stroke drawn on frame 4 joins the drawing held from frame 1, so both flames show at once. Turn Auto Keying back on with the record button by the play controls, or press `Shift+I` for a blank keyframe before you draw.

## Checking your work

Play the loop and check:

1. The Dope Sheet shows drawings on frames 1, 4, 7 and 10.
2. Smaller in-between keyframes fill the frames between them.
3. Frame 12 runs into frame 1 without a jump.
4. Every frame shows one flame, never two.
