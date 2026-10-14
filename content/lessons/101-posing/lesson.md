---
needs: [skinning]
exercise: three-poses
watch: [joey-carlino-character-animation, woodplank-pose-library]
sources:
  - Blender 5.2 Manual, "Posing" introduction, Pose Mode and the rest position (https://docs.blender.org/manual/en/5.2/animation/armatures/posing/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Clear Transform", Alt-G, Alt-R and Alt-S (https://docs.blender.org/manual/en/5.2/animation/armatures/posing/editing/clear.html), read 2026-10-15
  - Blender 5.2 Manual, "Copy/Paste Pose", Ctrl-C, Ctrl-V and Shift-Ctrl-V, pasting by bone name (https://docs.blender.org/manual/en/5.2/animation/armatures/posing/editing/copy_paste.html), read 2026-10-15
  - Blender 5.2 Manual, "Pose Library", Create Pose Asset, the Current File library, applying and blending poses from the asset shelf (https://docs.blender.org/manual/en/5.2/animation/armatures/posing/editing/pose_library.html), read 2026-10-15
  - Blender 5.2 Manual, "Bones" editing introduction, Edit Mode changes the rest position (https://docs.blender.org/manual/en/5.2/animation/armatures/bones/editing/introduction.html), read 2026-10-15
  - Blender 5.2 bl_ui, space_view3d.py, the Pose menu ends with Create Pose Asset (https://projects.blender.org/blender/blender/src/branch/blender-v5.2-release/scripts/startup/bl_ui/space_view3d.py), read 2026-10-15
  - Blender 5.2 source, editors/animation/anim_asset_ops.cc, Create Pose Asset asks for a Pose Name and a Library, Current File by default (https://projects.blender.org/blender/blender/src/branch/blender-v5.2-release/source/blender/editors/animation/anim_asset_ops.cc), read 2026-10-15
  - Blender 5.2 source, editors/space_view3d/view3d_buttons.cc, Ctrl+Tab toggles Pose Mode for an armature (https://projects.blender.org/blender/blender/src/branch/blender-v5.2-release/source/blender/editors/space_view3d/view3d_buttons.cc), read 2026-10-15
---

# Posing

Pose Mode is where you move a rigged character's bones without changing the skeleton itself. A pose stores how far each bone has turned from its rest position. In this lesson you'll pose your character three ways, mirror a pose to the other side and save poses to use again.

![The character waving in Pose Mode: its left upper arm and forearm raised and picked out, its right arm down by its side.](example)

## Steps

1. **Enter Pose Mode.** Select the armature and press `Ctrl+Tab`. The mode menu in the header now reads Pose Mode. Click a bone to select it, and `Shift` click to add more.

   ![Ctrl+Tab and the header's mode menu reading Pose Mode, beside the skeleton with the left forearm selected.](posemode)

2. **Rotate the bones.** Press `R` to turn the selected bones around their heads. Children go with their parents, so pose from the middle outwards: hips and spine first, then the upper arms and thighs, then forearms, shins and head.

   ![The left upper arm turned up from its rest position, drawn faint, with the forearm going with it untouched.](rotate)

3. **Clear a pose.** `Alt+G`, `Alt+R` and `Alt+S` clear the location, rotation and scale of the selected bones. Press `A` first to select every bone and return to the rest pose.

   ![A waving pose and, after A, Alt+G, Alt+R and Alt+S, the character back in its rest pose.](clear)

4. **Copy and flip.** Select the bones of a left-arm pose and press `Ctrl+C`. Press `Shift+Ctrl+V` to paste it flipped onto the right arm. Pasting goes by bone name, which is why the .L and .R names matter.

   ![The left arm's wave copied with Ctrl+C, and the same wave on the right arm after Shift+Ctrl+V.](flip)

5. **Save it as an asset.** Select the posed bones and choose Pose > Create Pose Asset. Name it, keeping Library on Current File. It joins the asset shelf below the 3D Viewport: click it to pose the character, or drag sideways to blend it in.

   ![The Pose menu with Create Pose Asset picked out, and the asset shelf with three saved poses: wave, crouch and point.](library)

## Common mistake

![Left, the upper arm bone moved in Edit Mode: the mesh stays and the bone sticks out of the arm. Right, the bone turned in Pose Mode: the arm turns with it.](mistake)

Moving bones in Edit Mode changes the skeleton's rest position, so the mesh stays put and the bone ends up outside it. Pose only in Pose Mode. If the header reads Edit Mode, press `Tab` to leave it, then `Ctrl+Tab`.

## Checking your work

Clear the pose, then check:

1. The asset shelf shows wave, crouch and point.
2. Clicking each one poses the character the same way again.
3. The flipped wave raises the other arm.
4. In Edit Mode, the bones still sit where you built them.
