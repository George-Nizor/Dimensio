---
needs: [chest, graph-editor, actions]
exercise: chest-in-godot
watch: [michael-jared-godot-animations, blender-manual-addons-scene-gltf2]
sources:
  - Blender 5.2 Manual, "Actions" (https://docs.blender.org/manual/en/5.2/animation/actions.html), read 2026-10-15
  - Blender 5.2 Manual, "Action Editor", New Action stashes the previous action (https://docs.blender.org/manual/en/5.2/editors/dope_sheet/modes/action.html), read 2026-10-15
  - Blender 5.2 Manual, "F-Curve Editing", Interpolation Mode with T (https://docs.blender.org/manual/en/5.2/editors/graph_editor/fcurves/editing.html), read 2026-10-15
  - Blender 5.2 Manual, "F-Curve Properties", Dynamic Effects, Bounce (https://docs.blender.org/manual/en/5.2/editors/graph_editor/fcurves/properties.html), read 2026-10-15
  - Blender 5.2 Manual, "Object Origin" (https://docs.blender.org/manual/en/5.2/scene_layout/object/origin.html), read 2026-10-15
  - Blender 5.2 Manual, "glTF 2.0", Include Selected Objects, Animation mode Actions exports the active and stashed actions under their own names (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15
  - Godot Docs, "Import configuration", Scene inheritance (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/import_configuration.html), read 2026-10-15
  - Godot Docs, "Introduction to the animation features", the Animation panel and Play from beginning with Shift + D (https://docs.godotengine.org/en/stable/tutorials/animation/introduction.html), read 2026-10-15
  - Godot 4.5 source, editor/editor_node.cpp, the Open Anyway and New Inherited buttons shown when an imported scene is opened (https://github.com/godotengine/godot/blob/4.5-stable/editor/editor_node.cpp), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15, a chest lid with open stashed and close active, close's first keyframe set to Bounce, exported as one .glb with two animations, open and close; Godot 4.7.2 imported it with an AnimationPlayer holding close and open
---

# An animated chest

In this lesson you'll animate the lid of your chest from lesson 53 opening and closing, as two actions a game can play one at a time. Then you'll export the chest and play both animations in Godot.

![The chest with its lid swung open on its hinge, beside Godot's AnimationPlayer listing its two animations, close and open.](example)

## Steps

1. **Check the hinge.** Select the lid. Its origin, the orange dot, must sit on the hinge line along the back top edge, so the lid turns like a real one. If it doesn't, move it there as in lesson 14 before you animate.

   ![The chest from the side, the lid's origin on the hinge at the back top edge, and the lid swinging up and back clear of the box.](hinge)

2. **Animate the opening.** Open the Action Editor and select the lid. At frame 1, hover over its X rotation in the Object tab and press `I`. At frame 12, type -100 there and press `I`. Rename the action open.

   ![The Action Editor's header with the action named open, and the chest from the side with the lid shut at frame 1 and at -100° at frame 12.](keys)

3. **Animate the closing.** Click New Action, which stashes open. Rename the copy close, then insert -100° at frame 1 and 0° at frame 12 over the copied keyframes.

4. **Make it bounce.** In the Graph Editor, select close's first keyframe, press `T` and choose Bounce under Dynamic Effects. The lid now drops shut, bounces a few times and settles.

   ![The close curve in the Graph Editor, from -100° at frame 1 to 0° at frame 12, bouncing back a few times before it settles, beside the T menu's Dynamic Effects with Bounce picked out.](bounce)

5. **Export the chest.** Select the chest and its lid and choose File > Export > glTF 2.0. Tick Selected Objects under Include and keep Animation Mode at Actions. The exporter takes open from the stash and close, the active action.

   ![The glTF export options with Selected Objects ticked, Apply Modifiers ticked and Animation Mode set to Actions.](export)

6. **Play it in Godot.** Copy the .glb into your Godot project. Open it with Scene > Open Scene and click New Inherited. Select the AnimationPlayer node, pick open in the Animation panel at the bottom and press `Shift+D` to play it.

   ![Godot's Scene dock with the AnimationPlayer selected, and the Animation panel with open picked and the play button beside the key Shift+D.](godot)

## Common mistake

![Left, the lid's origin in its middle: turned -100°, it spins in place and cuts into the box. Right, the origin on the hinge: the lid swings up and back clear of the box.](mistake)

If the lid's origin sits in its middle, the lid spins in place and its back half cuts into the box. Keyframes can't fix that. Put the origin on the hinge first, then animate the rotation.

## Checking your model

Play each action in Blender, then in Godot, and check:

1. The lid turns about its back edge and never cuts into the box.
2. open ends with the lid up at -100°.
3. close bounces before the lid settles shut.
4. Godot's AnimationPlayer lists open and close.
