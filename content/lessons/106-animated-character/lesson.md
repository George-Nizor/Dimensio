---
needs: [weight-painting, godot-animations]
exercise: character-in-godot
watch: [imphenzia-low-poly-character-course, grant-abbitt-character-rigging]
sources:
  - Blender 5.2 Manual, "Apply", All Transforms (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/apply.html), read 2026-10-15
  - Blender 5.2 Manual, "Armature Deform Parent", With Automatic Weights (https://docs.blender.org/manual/en/5.2/animation/armatures/skinning/parenting.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing Weight Paint", Normalize All and Limit Total (https://docs.blender.org/manual/en/5.2/sculpt_paint/weight_paint/editing.html), read 2026-10-15
  - Blender 5.2 Manual, "glTF 2.0", Data - Skinning, Bone influences (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15
  - Godot Docs, "Model export considerations", 3D asset direction conventions (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/model_export_considerations.html), read 2026-10-15
  - Imphenzia, "Learn Low Poly Character Modeling (Full Course)", chapters on colouring, the armature, skinning, and the idle and walk actions (https://www.youtube.com/watch?v=PTWV67qUX2k), read 2026-10-15
---

# An animated character

This project takes the character you modelled in lesson 97 all the way into a game. You'll colour it with one material, rig it with a small armature, clean up its weights, animate an idle and a walk, and play both in Godot.

![The finished character with its 15 bones inside it, beside Godot's AnimationPlayer listing idle and walk, both looping.](example)

## Steps

1. **Get the mesh ready.** Stand the feet on the ground at the origin, with the face toward -Y. Press `Ctrl+A` and choose All Transforms. In the Statistics overlay, keep the character under 2,000 triangles.

   ![The character from the front with its origin between the feet and 1,412 triangles counted, and from the top facing -Y.](ready)

2. **Colour it with one material.** Give the whole character one material with a palette texture, as in lesson 57. In the UV Editor, move each part's islands onto its colour square. Godot then imports one material for the whole character.

   ![A palette texture of colour squares in the UV Editor, with a UV island sitting on each part's colour, and Material slots: 1.](palette)

3. **Build 15 bones.** Add an armature with hips, spine, chest, neck and head, and an upper arm, forearm, thigh, shin and foot on each side, named .L and .R. Select the mesh, then the armature, and press `Ctrl+P` > With Automatic Weights.

   ![The 15-bone armature inside the character from the front, five bones down the middle and five on each side, beside Ctrl+P and With Automatic Weights.](bones)

4. **Clean up the weights.** In Weight Paint mode, bend each limb and paint away folds at the shoulders and hips. Then choose Weights > Limit Total with Limit 4, and Weights > Normalize All. The glTF exporter writes 4 bones for each vertex.

   ![One shoulder vertex pulled by six bones, and after Limit Total with Limit 4 only the four strongest left, above Weights, Limit Total, then Weights, Normalize All.](weights)

5. **Animate the idle and the walk.** Key a 48-frame idle and a 24-frame walk as in lesson 104. Name them idle-loop and walk-loop and stash both, as in lesson 105.

   ![The NLA editor with two stash tracks: idle-loop, 48 frames long, and walk-loop, 24 frames long.](actions)

6. **Export and play it.** Export the mesh and armature as a .glb with the settings from lesson 105. Open it in Godot as an inherited scene, play walk, and set idle to Autoplay on Load.

   ![Godot with the character's AnimationPlayer selected, walk playing, and idle marked to play on load.](godot)

Imphenzia's character course follows the same road, from colouring by UVs to looping idle and walk actions.

## Common mistake

![The character from above. Left, facing +Y, tagged walks backwards. Right, facing -Y, tagged walks forwards.](mistake)

Godot treats +Z as a character's front, which is -Y in Blender, so a character facing +Y walks backwards in the game. Before you rig, check that the front view (`Numpad 1`) shows its face. If it shows its back, rotate it 180° around Z and apply the rotation.

## Checking your model

Before you export, check:

1. The Statistics overlay shows under 2,000 triangles.
2. The mesh has one material, rotation 0 and scale 1 in the Sidebar.
3. Each limb bends at its joint without spikes or folds.
4. In Godot, idle plays on load and walk loops without a pause.
