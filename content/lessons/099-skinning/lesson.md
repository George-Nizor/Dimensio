---
needs: [armatures, apply-transforms]
exercise: bind-character
watch: [grant-abbitt-character-rigging, blender-manual-animation-armatures-skinning-parenting]
sources:
  - Blender 5.2 Manual, "Skinning" introduction, the Armature modifier deforms a mesh (https://docs.blender.org/manual/en/5.2/animation/armatures/skinning/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Armature Deform Parent", Ctrl-P With Automatic Weights, a vertex group per deforming bone, weights from the distance to each bone (https://docs.blender.org/manual/en/5.2/animation/armatures/skinning/parenting.html), read 2026-10-15
  - Blender 5.2 Manual, "Armature Modifier", Object and Bind to Vertex Groups (https://docs.blender.org/manual/en/5.2/modeling/modifiers/deform/armature.html), read 2026-10-15
  - Blender 5.2 Manual, "Vertex Groups" (https://docs.blender.org/manual/en/5.2/modeling/meshes/properties/vertex_groups/vertex_groups.html), read 2026-10-15
  - Blender 5.2 Manual, "Apply", apply transforms before rigging and animation (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/apply.html), read 2026-10-15
  - Blender 5.2 Manual, "Posing" introduction and "Clear Transform", Alt-R (https://docs.blender.org/manual/en/5.2/animation/armatures/posing/editing/clear.html), read 2026-10-15
  - Blender 5.2 source, editors/object/object_relations.cc, the Set Parent To menu shows Armature Deform only when an armature is the active object (https://projects.blender.org/blender/blender/src/branch/blender-v5.2-release/source/blender/editors/object/object_relations.cc), read 2026-10-15
  - Blender 5.2 source, editors/space_view3d/view3d_buttons.cc and the default keymap, Ctrl+Tab toggles Pose Mode for an armature (https://projects.blender.org/blender/blender/src/branch/blender-v5.2-release/source/blender/editors/space_view3d/view3d_buttons.cc), read 2026-10-15
  - Blender 5.2 source, editors/armature/meshlaplacian.cc, the Bone Heat Weighting failure message (https://projects.blender.org/blender/blender/src/branch/blender-v5.2-release/source/blender/editors/armature/meshlaplacian.cc), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15, the blocky-character starter bound With Automatic Weights got an Armature modifier and 15 vertex groups named after its bones
---

# Skinning

Skinning binds a mesh to its armature so the bones bend it. Blender can work out how strongly each bone pulls each vertex for you, from how close the vertex is to the bone. In this lesson you'll bind your character with automatic weights and bend every limb to test it.

![The bound character posed: the left arm lowered, the right arm raised and the left leg stepping forward, the mesh following its bones.](example)

## Steps

1. **Apply the transforms.** Select the mesh and the armature and press `Ctrl+A` > All Transforms. Both now read location 0, rotation 0 and scale 1, as the manual advises before rigging.

   ![The Apply menu from Ctrl+A with All Transforms picked out, and the character and armature reading Scale 1, 1, 1 afterwards.](apply)

2. **Parent with automatic weights.** Click the mesh, then `Shift` click the armature so it's the active object. Press `Ctrl+P` and choose With Automatic Weights, under Armature Deform.

   ![The Outliner with Character selected first and Armature second and active, beside the Set Parent To menu with With Automatic Weights picked out.](parent)

3. **See what it made.** The mesh now has an Armature modifier using the armature. In the Object Data tab, Vertex Groups lists a group for every bone. Each holds a weight from 0 to 1 per vertex: how strongly its bone moves that vertex.

   ![The Armature modifier with Object set to Armature, and the Vertex Groups list with a group named after each bone.](groups)

4. **Bend each limb.** Select the armature and press `Ctrl+Tab` for Pose Mode. Click a bone, press `R` and move the mouse: the mesh bends with it. Try both arms and legs, the spine and the head, then press `A` and `Alt+R` to clear the pose.

   ![The character from the side, at rest and with the left thigh turned forward and the shin bent back, the leg's mesh following both bones.](bend)

## Common mistake

![Left, the character active: Set Parent To offers only Object and Vertex. Right, the armature active: the menu offers With Automatic Weights.](mistake)

Click the armature first and the mesh last, and `Ctrl+P` offers only Object and Vertex, because the active object becomes the parent. The armature has to be the parent: click the mesh, then `Shift` click the armature.

## Checking your model

In Object Mode, select the mesh and check:

1. The Modifiers tab shows an Armature modifier with your armature as Object.
2. Vertex Groups lists one group per bone, with matching names.
3. Turning a leg bone in Pose Mode moves only that leg.
4. Scale reads 1, 1, 1 on the mesh and the armature.

If Blender reports Bone Heat Weighting: failed to find solution for one or more bones, some bones got no weights. Run Merge by Distance from lesson 34 and parent again, or paint those weights by hand in lesson 100.
