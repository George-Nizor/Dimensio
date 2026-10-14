---
needs: [actions, walk-cycle]
exercise: idle-and-walk-in-godot
watch: [sweet-nanny-goat-godot-multi-animations, chevifier-blender-godot-animations]
sources:
  - Blender 5.2 Manual, "Action Editor", Stash Action (https://docs.blender.org/manual/en/5.2/editors/dope_sheet/modes/action.html), read 2026-10-15
  - Blender 5.2 Manual, "Actions" (https://docs.blender.org/manual/en/5.2/animation/actions.html), read 2026-10-15
  - Blender 5.2 Manual, "glTF 2.0", Animations, Actions (default), and the export options Include, Data - Armature and Animation - Rest & Ranges (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15
  - Godot Docs, "Node type customization using name suffixes", Animation loop (-loop, -cycle) (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/node_type_customization.html), read 2026-10-15
  - Godot Docs, "Import configuration", Scene inheritance (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/import_configuration.html), read 2026-10-15
  - Godot Docs, "Introduction to the animation features", Autoplay on load (https://docs.godotengine.org/en/stable/tutorials/animation/introduction.html), read 2026-10-15
  - Blender 5.2.2 and Godot 4.7.2, an armature with idle-loop and walk-loop stashed, exported with these settings and imported as animations idle and walk, both looping and each 1.0 s long, checked 2026-10-15
  - Godot 4.7 source, the open dialog for imported scenes and the Animation panel's buttons (editor/editor_node.cpp, editor/animation/animation_player_editor_plugin.cpp), read 2026-10-15
---

# Animations in Godot

A game character carries several animations, such as standing idle and walking, and the game plays one at a time. In this lesson you'll keep an idle and a walk as separate actions, export both in one .glb file, and play each of them in Godot.

![Godot with the character open: the Scene dock with its AnimationPlayer picked out, and the Animation panel listing idle and walk, both marked as looping.](example)

## Steps

1. **Name the actions.** In the Dope Sheet's Action Editor, rename your walk action walk-loop. Godot loops any animation whose name ends in -loop and takes that ending off, so it arrives as walk.

   ![The action walk-loop in Blender's Action Editor arriving in Godot's AnimationPlayer as walk, marked as looping, and idle-loop arriving as idle.](names)

2. **Stash both.** The exporter takes only the active action and actions on NLA tracks. Choose Action > Stash Action to move walk-loop onto a track. Click New, key a 48-frame idle, name it idle-loop and stash it too.

   ![The NLA editor after stashing: the armature with no active action and two stash tracks below it, holding idle-loop and walk-loop, under Action, Stash Action.](stash)

3. **Export the character.** Select the mesh and armature and choose File > Export > glTF 2.0 (.glb/.gltf). Tick Selected Objects under Include, Export Deformation Bones Only under Data > Armature, and Set All glTF Animation Starting at 0 under Animation > Rest & Ranges.

   ![The export settings to tick: Selected Objects, Export Deformation Bones Only, and Set All glTF Animation Starting at 0, with Animation Mode left on Actions.](export)

4. **Open it in Godot.** Save the .glb in your Godot project's folder. In Godot, choose Scene > Open Scene, pick the .glb and click New Inherited. The new scene holds the character and an AnimationPlayer node.

   ![The dialog for an imported scene with New Inherited picked out, and the new scene's tree: the character, its Skeleton3D, the body and the AnimationPlayer.](inherited)

5. **Play each animation.** Select the AnimationPlayer. In the Animation panel at the bottom, choose walk from the list and click Play Animation from Start. Then choose idle and click Autoplay on Load, so the game starts with it. Save the scene.

   ![The Animation panel twice: walk chosen and playing, then idle chosen with Autoplay on Load turned on.](play)

Set All glTF Animation Starting at 0 makes a 24-frame walk exactly one second long in Godot, so its loop has no gap.

## Common mistake

![Left, only walk-loop on a stash track and idle-loop on none, and Godot listing only walk. Right, both actions stashed, and Godot listing idle and walk.](mistake)

If Godot lists only one animation, the other action was on no NLA track when you exported. Open it in the Action Editor, choose Action > Stash Action, and export the .glb again over the old one.

## Checking your work

In Blender and in Godot, check:

1. The NLA editor shows idle-loop and walk-loop on stash tracks.
2. Godot's AnimationPlayer lists idle and walk, and nothing else.
3. Both animations repeat in Godot with no pause at the end.
4. The A for Autoplay on Load shows beside idle.
