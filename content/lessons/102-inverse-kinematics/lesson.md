---
needs: [posing, constraints]
exercise: planted-feet
watch: [what-make-art-leg-ik, ryan-king-arm-ik]
sources:
  - Blender 5.2 Manual, "Inverse Kinematics" introduction (https://docs.blender.org/manual/en/5.2/animation/armatures/posing/bone_constraints/inverse_kinematics/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Inverse Kinematics Constraint", Target, Pole Target, Chain Length, Use Tail (https://docs.blender.org/manual/en/5.2/animation/constraints/tracking/ik_solver.html), read 2026-10-15
  - Blender 5.2 Manual, "Add IK to Bone", Shift-I and Target Selected Bone (https://docs.blender.org/manual/en/5.2/animation/armatures/posing/editing/inverse_kinematics.html), read 2026-10-15
  - Blender 5.2 Manual, "Posing" introduction, bones with an IK constraint shown yellow (https://docs.blender.org/manual/en/5.2/animation/armatures/posing/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Parenting" in armature Edit Mode, Alt-P Clear Parent (https://docs.blender.org/manual/en/5.2/animation/armatures/bones/editing/parenting.html), read 2026-10-15
  - Blender 5.2 Manual, "Deform" bone panel, unticking it mutes a bone's influence (https://docs.blender.org/manual/en/5.2/animation/armatures/bones/properties/deform.html), read 2026-10-15
  - Blender 5.2 Manual, "Symmetrize", constraints mirrored with the bones (https://docs.blender.org/manual/en/5.2/animation/armatures/bones/editing/symmetrize.html), read 2026-10-15
  - Blender 5.2 Manual, "glTF 2.0", Export Deformation Bones Only (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15
  - Blender 5.2 bl_ui, properties_constraint.py, Pole Angle shows once a Pole Target is set (https://projects.blender.org/blender/blender/src/branch/blender-v5.2-release/scripts/startup/bl_ui/properties_constraint.py), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15 on the blocky-character starter, with feet unparented, shin IK at Chain Length 2 and a knee pole 0.5 m in front, Pole Angle -90° pointed the knee at the pole; lowering the hips 0.3 m kept both ankles in place; Symmetrize copied the IK to the right leg with foot.R and knee.R; Chain Length 0 turned the hips as well
---

# Inverse kinematics

With inverse kinematics, or IK, you place the end of a limb and Blender bends the bones above it to reach. Legs are the usual case: you put the foot where it should stand, and the knee follows. In this lesson you'll set up IK on both legs so the feet stay planted while the hips move.

![IK on both legs, seen from the side: the hips lowered 0.3 m, the feet still flat where they were and the knees bent forward towards the pole bone in front of them.](example)

## Steps

1. **Free the foot.** In Edit Mode, select foot.L and press `Alt+P` > Clear Parent. The foot no longer follows the shin, so it can stay on the ground while the body moves. It will be the IK target, the bone the leg reaches for.

   ![The left leg's bones in Edit Mode with foot.L selected, beside Alt+P and the Clear Parent menu.](target)

2. **Add the constraint.** In Pose Mode, click foot.L, then `Shift` click shin.L so it's active. Press `Shift+I` and choose Target Selected Bone. The shin turns yellow: it now carries an IK constraint aimed at the foot.

   ![foot.L selected first and shin.L second and active, beside Shift+I and the Add IK menu with Target Selected Bone picked out.](add)

3. **Set the chain length.** In the Bone Constraints tab, set the constraint's Chain Length to 2. Only the shin and its parent, the thigh, will bend. At 0 the chain runs all the way up the skeleton.

   ![The IK constraint with Target Armature, Bone foot.L and Chain Length 2 picked out.](chain)

4. **Add a pole for the knee.** In Edit Mode, add knee.L 0.5 m in front of the knee, unparented, with Deform unticked. Set the IK's Pole Target to the armature and Bone to knee.L, and turn Pole Angle until the knee points at it.

   ![The left leg from the side with knee.L in front of the knee, beside the Pole Target set to knee.L and Pole Angle -90°.](pole)

5. **Mirror and test.** In Edit Mode, select the left leg's bones and knee.L and choose Armature > Symmetrize: the right leg gets its own IK. In Pose Mode, select hips, press `G`, `Z` and move down. The feet stay put.

   ![The character from the side at rest, and with the hips moved 0.3 m down: the feet flat on the floor and the knees bent forward.](test)

## Common mistake

![The same foot lifted forward. Left, Chain Length 0: the whole body tips over to follow. Right, Chain Length 2: only the thigh and shin bend.](mistake)

With Chain Length left at 0, the IK reaches up through the thigh and hips into the spine, so moving a foot tips the whole body. Set Chain Length to 2 for a leg or an arm: the two bones above the target.

## Checking your work

In Pose Mode, check:

1. Lowering the hips 0.3 m leaves both feet where they were.
2. Both knees bend forward, towards their pole bones.
3. Only the shins show yellow.
4. knee.L and knee.R have Deform unticked in the Bone tab.

When you export, tick Export Deformation Bones Only, so the pole bones stay in Blender.
