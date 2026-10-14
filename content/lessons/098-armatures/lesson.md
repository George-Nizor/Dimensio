---
needs: [character-modelling]
exercise: build-skeleton
watch: [grant-abbitt-bones-armatures, joey-carlino-rigging]
sources:
  - Blender 5.2 Manual, "Armatures" introduction, Add > Armature, the rest position (https://docs.blender.org/manual/en/5.2/animation/armatures/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Bone Structure", head, body and tail (https://docs.blender.org/manual/en/5.2/animation/armatures/bones/structure.html), read 2026-10-15
  - Blender 5.2 Manual, "Bone editing" introduction, Shift-A adds a bone in Edit Mode (https://docs.blender.org/manual/en/5.2/animation/armatures/bones/editing/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Extrude", E from a selected tip makes a connected child bone (https://docs.blender.org/manual/en/5.2/animation/armatures/bones/editing/extrude.html), read 2026-10-15
  - Blender 5.2 Manual, "Parenting", Ctrl-P Make Parent with Keep Offset (https://docs.blender.org/manual/en/5.2/animation/armatures/bones/editing/parenting.html), read 2026-10-15
  - Blender 5.2 Manual, "Naming", .L and .R separators (https://docs.blender.org/manual/en/5.2/animation/armatures/bones/editing/naming.html), read 2026-10-15
  - Blender 5.2 Manual, "Symmetrize" (https://docs.blender.org/manual/en/5.2/animation/armatures/bones/editing/symmetrize.html), read 2026-10-15
  - Blender 5.2 Manual, "Viewport Display", In Front (https://docs.blender.org/manual/en/5.2/animation/armatures/properties/display.html), read 2026-10-15
  - Blender 5.2 bl_ui, space_view3d.py, Add > Armature adds one bone when no add-on extends the menu (https://projects.blender.org/blender/blender/src/branch/blender-v5.2-release/scripts/startup/bl_ui/space_view3d.py), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15, the blocky-character starter's 15 bones, with the left limbs mirrored by Armature > Symmetrize
---

# Armatures

An armature is the skeleton that moves a character: an object made of bones, shaped in its own Edit Mode. In this lesson you'll build a skeleton of 15 bones inside your character and name them so Blender can copy the left side to the right.

![A skeleton of 15 bones inside the character, seen from the front: hips, spine, chest, neck and head up the middle, and an upper arm, forearm, thigh, shin and foot on each side.](example)

## Steps

1. **Add an armature.** In Object Mode, with the 3D cursor at the origin, choose Add > Armature. One bone stands up from the cursor. In the Object Data tab's Viewport Display panel, tick In Front so the bones show through the mesh.

   ![One bone standing up from the 3D cursor, beside the Viewport Display panel with In Front ticked.](add)

2. **Build the spine.** Press `Tab` for Edit Mode and move the bone up to run from the hips. Select its tip and press `E` to extrude a new bone, then again for the chest, neck and head. Each is a child of the one before.

   ![The spine from the side: the hips bone, then spine, chest, neck and head, each extruded from the tip of the last.](spine)

3. **Name the bones.** Select each bone and type its name in the Bone tab: hips, spine, chest, neck, head. For the limbs, name the character's left side with .L, as in forearm.L. Blender treats names ending .L and .R as pairs.

   ![The left arm and leg bones labelled upper_arm.L, forearm.L, thigh.L, shin.L and foot.L, with the Bone tab's name field reading forearm.L.](names)

4. **Add the left limbs.** Hold `Shift` and right click at the shoulder to put the 3D cursor there. Press `Shift+A` for a new bone and move its tip to the elbow. Extrude the forearm with `E`, then build the leg from the hip.

5. **Parent them.** Select the upper arm, then `Shift` click the chest. Press `Ctrl+P` and choose Keep Offset: the arm follows the chest without joining it. Parent the thigh to the hips the same way.

   ![The left upper arm and thigh joined to the chest and hips by dashed lines, beside Ctrl+P and the Make Parent menu with Keep Offset picked out.](limbs)

6. **Mirror the other side.** Select all the .L bones and choose Armature > Symmetrize. Blender builds the .R bones across X 0, with matching names and parents.

   ![The whole skeleton with the .R bones, made by Symmetrize, picked out on the character's right side.](symmetrize)

## Common mistake

![Left, an Outliner listing Armature, Armature.001, Armature.002 and more, each with one bone. Right, one Armature holding all its bones.](mistake)

Pressing Add > Armature for every new bone makes a separate armature each time. You can't parent bones in different armatures to each other, and a mesh bound to one ignores the rest. Add the first bone in Object Mode, then build the others in that armature's Edit Mode.

## Checking your model

Look at the Outliner and the 3D Viewport and check:

1. The Outliner shows one armature with 15 bones.
2. Every bone sits inside the mesh, with joints at your loops.
3. Left bones end in .L and right bones in .R.
4. Dashed lines join the upper arms to the chest and the thighs to the hips.
