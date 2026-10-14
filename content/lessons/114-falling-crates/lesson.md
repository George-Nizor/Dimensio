---
needs: [animated-chest, rigid-bodies]
exercise: crates-off-a-cart
watch: [pixxo-rigid-body-keyframes, chevifier-blender-godot-animations]
sources:
  - 'Blender 5.2 Manual, "Rigid Body: Introduction" (https://docs.blender.org/manual/en/5.2/physics/rigid_body/introduction.html), read 2026-10-15'
  - Blender 5.2 Manual, "Rigid Body Collisions", Shape (https://docs.blender.org/manual/en/5.2/physics/rigid_body/properties/collisions.html), read 2026-10-15
  - Blender 5.2 Manual, "Rigid Body World", Substeps Per Frame (https://docs.blender.org/manual/en/5.2/physics/rigid_body/world.html), read 2026-10-15
  - Blender 5.2 Manual, "Rigid Body Tips", Animation and Bake To Keyframes (https://docs.blender.org/manual/en/5.2/physics/rigid_body/tips.html), read 2026-10-15
  - Blender 5.2 Manual, "glTF 2.0", Animations, Active Actions merged, and Animation export options (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15
  - Godot Docs, "Import configuration", Scene inheritance (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/import_configuration.html), read 2026-10-15
  - Godot Docs, "Introduction to the animation features", Autoplay on load (https://docs.godotengine.org/en/stable/tutorials/animation/introduction.html), read 2026-10-15
  - 'Blender 5.2.2, the crate-cart starter with this lesson''s settings, Bake to Keyframes (5.2/scripts/startup/bl_operators/rigidbody.py), and the glTF exporter''s Animation Mode and Merged Animation Name: Actions gave one animation per object, Active actions merged gave one animation, fall, moving all six crates and the cart, checked 2026-10-15'
  - Godot 4.7.2, the exported .glb imported with one animation, fall, 5 seconds long, checked 2026-10-15
  - PIXXO 3D, "Convert Rigid Body Into Keyframes | Blender 4.2" (https://www.youtube.com/watch?v=0deNiqxS-nk), read 2026-10-15
---

# Falling crates

To use a Blender simulation in a game, you bake it into ordinary keyframes that Godot can play. In this project you'll tip six crates off a cart with rigid bodies, bake the fall to keyframes, and play it in Godot as one animation.

![A cart tipped back, with six crates that slid off its bed lying tumbled on the ground behind it.](example)

## Steps

1. **Set up the physics.** Open the exercise. Select the six crates and choose Object > Rigid Body > Add Active. Make the ground and the cart passive. On the cart, tick Animated so its keys tip it, and set Shape to Mesh.

   ![The cart with six crates stacked on its bed, beside the settings: crates active with the default Convex Hull shape, the cart passive with Animated ticked and Shape Mesh, the ground passive.](physics)

2. **Play it and adjust.** Press `Space`. The cart tips back between frames 20 and 45, and the crates slide off and tumble. If they shake or pass through the bed, raise Substeps Per Frame in the Scene tab's Rigid Body World panel.

   ![Frame 45: the cart tipped back and the crates sliding off it, beside Substeps Per Frame in the Rigid Body World panel.](play)

3. **Bake to keyframes.** Select the six crates and choose Object > Rigid Body > Bake to Keyframes, with Start Frame 1 and End Frame 120. Each crate gets a key on every frame and loses its rigid body, so the fall is now ordinary animation.

   ![Object, Rigid Body, Bake to Keyframes with Start Frame 1, End Frame 120 and Frame Step 1, and one crate's keys on every frame.](bake)

4. **Export one animation.** Select the cart, crates and ground and choose File > Export > glTF 2.0 (.glb/.gltf) with Selected Objects ticked. Under Animation, set Animation Mode to Active actions merged and Merged Animation Name to fall.

   ![The Animation export settings: Animation Mode set to Active actions merged and Merged Animation Name set to fall.](export)

5. **Play it in Godot.** Save the .glb in your Godot project. Choose Scene > Open Scene, pick it and click New Inherited. Select the AnimationPlayer, choose fall and click Play Animation from Start. Click Autoplay on Load so it plays when the game starts.

   ![Godot's Scene dock with the cart, the crates and the AnimationPlayer, and the Animation panel playing fall, 5 seconds long.](godot)

Active actions merged puts every exported object's action into one glTF animation, the cart's tip and the six crates' falls together.

## Common mistake

![Godot's animation list. Left, exported with Actions: CartTip and six crate actions. Right, exported with Active actions merged: one animation, fall.](mistake)

With Animation Mode left on Actions, each object's action becomes an animation of its own. Godot lists CartTip and six crate actions, and playing one moves only one object. Choose Active actions merged, so the whole fall arrives as one animation.

## Checking your model

Play the fall in Blender, then in Godot:

1. Every crate leaves the bed and rests on the ground by frame 120.
2. After baking, the crates' Physics tab shows no rigid body.
3. Godot's AnimationPlayer lists one animation, fall.
4. Playing fall in Godot tips the cart and drops every crate.
