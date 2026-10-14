---
needs: [inverse-kinematics]
exercise: fit-rigify-rig
watch: [grant-abbitt-rigify, blender-manual-addons-rigify-basics]
sources:
  - 'Blender 5.2 Manual, "Rigify: Introduction", Enabling Add-on (https://docs.blender.org/manual/en/5.2/addons/rigify/introduction.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Rigify: Basic Usage" (https://docs.blender.org/manual/en/5.2/addons/rigify/basics.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Rigify: Bone Positioning Guide", Limbs Bones (https://docs.blender.org/manual/en/5.2/addons/rigify/bone_positioning.html), read 2026-10-15'
  - Blender 5.2 Manual, "Add-ons" (https://docs.blender.org/manual/en/5.2/editors/preferences/addons.html), read 2026-10-15
  - 'Blender 5.2 Manual, "Object Properties: Viewport Display", In Front (https://docs.blender.org/manual/en/5.2/scene_layout/object/properties/display.html), read 2026-10-15'
  - Blender 5.2 Manual, "Tool Settings", X-Axis Mirror (https://docs.blender.org/manual/en/5.2/animation/armatures/posing/tool_settings.html), read 2026-10-15
  - Blender 5.2 Manual, "Apply" (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/apply.html), read 2026-10-15
  - Blender 5.2 Manual, "Armature Deform Parent", With Automatic Weights (https://docs.blender.org/manual/en/5.2/animation/armatures/skinning/parenting.html), read 2026-10-15
  - Blender 5.2.2, the Rigify add-on's menu and panel (5.2/scripts/addons_core/rigify/metarig_menu.py and ui.py) for Add > Armature > Rigify Meta-Rigs > Basic > Basic Human and Generate Rig, and a generated Basic Human rig (222 bones, 35 in DEF, some DEF bones parented to ORG bones), checked 2026-10-15
  - Grant Abbitt, "Easy Rigging Using RIGIFY in Blender" (https://www.youtube.com/watch?v=RdTuAY23vzk), read 2026-10-15
---

# Rigify

Rigify builds a full set of animation controls for a human, with IK and FK arms and legs, so you don't have to make them bone by bone. You fit a simple skeleton called a meta-rig to your character, and Rigify generates the rig from it. In this lesson you'll fit Rigify's Basic Human meta-rig to a body and bind the body to the rig.

![Left, the Basic Human meta-rig fitted inside a body. Right, the rig Rigify generated from it, with rings at the waist, chest and wrists and boxes under the feet.](example)

## Steps

1. **Turn on Rigify.** Rigify comes with Blender but starts switched off. Open Edit > Preferences > Add-ons, type rigify in the search field and tick the checkbox beside Rigify.

   ![The Add-ons section of the Preferences with rigify typed in the search field and the checkbox beside Rigify ticked.](enable)

2. **Add the meta-rig.** In Object Mode choose Add > Armature > Rigify Meta-Rigs > Basic > Basic Human. It has no face or finger bones. Tick In Front in the Object tab's Viewport Display panel so the bones show through the body.

   ![The meta-rig standing in the body. Left, In Front off, so only the head bone shows above the body. Right, In Front on, with every bone showing through.](in-front)

3. **Scale it to the body.** The meta-rig is 1.98 m tall, because Rigify expects a person about 2 m high. Press `S` and type the body's height divided by 1.98, 0.86 for a 1.7 m body. Then press `Ctrl+A` and choose Scale.

   ![The meta-rig scaled down from 1.98 m, marked by a dashed line, to the body's 1.7 m, beside the keys S and Ctrl+A.](scale)

4. **Fit the joints.** Press `Tab` for Edit Mode. In the Sidebar's Tool tab, tick X-Axis Mirror so the right side copies the left. Move each joint of the left arm and leg into the middle of the limb.

   ![A close view of the left arm: dashed bones where the scaled meta-rig was, and arrows moving each joint into the middle of the arm, beside the X-Axis Mirror checkbox.](fit)

5. **Generate the rig.** Go back to Object Mode. In the Properties editor, open the Object Data tab and click Generate Rig in the Rigify panel. A new armature called rig appears. The bones that bend the mesh have names starting with DEF.

   ![The Rigify panel with Generate Rig picked out, and the Outliner after clicking it with the new armature, rig, picked out.](generate)

6. **Bind the body.** Select the body, then hold `Shift` and click the rig. Press `Ctrl+P` and choose With Automatic Weights. Blender gives the body one vertex group for each DEF bone. Test it in Pose Mode by moving the wrist and foot controls.

   ![The body bound to the rig, its left arm lifted by the wrist ring and its right foot moved out by the foot box, beside Ctrl+P and With Automatic Weights.](bind)

Grant Abbitt scales the meta-rig to the character before he moves any joints.

## Common mistake

![Side view of a leg's two bones. Left, fitted dead straight, with the knee bending backwards when posed. Right, the knee joint moved a little forward, so it bends forward.](mistake)

A leg or arm fitted dead straight gives Rigify no bend to read, so the knee or elbow can bend the wrong way. Before you generate, move each knee joint a little forward and each elbow joint a little back.

## Checking your model

Pose the rig and look at the body:

1. The body's vertex groups all start with DEF in its Object Data tab.
2. Moving a foot control bends the knee forward, never backwards.
3. Moving a wrist control bends the elbow and lifts the arm.
4. The meta-rig is still in the file, beside the generated rig.

A Basic Human rig has 222 bones. Only 35 bend the mesh, and some of those hang from bones that don't, which makes the rig awkward to export. Lesson 106 gives the game character a small armature of your own.
