---
needs: [keyframes]
exercise: knock-down-a-wall
watch: [ryan-king-rigid-body, blender-manual-physics-rigid-body-introduction]
sources:
  - 'Blender 5.2 Manual, "Rigid Body: Introduction", Creating a Rigid Body (https://docs.blender.org/manual/en/5.2/physics/rigid_body/introduction.html), read 2026-10-15'
  - Blender 5.2 Manual, "Rigid Body Settings" (https://docs.blender.org/manual/en/5.2/physics/rigid_body/properties/settings.html), read 2026-10-15
  - Blender 5.2 Manual, "Rigid Body Collisions", Shape and Surface Response (https://docs.blender.org/manual/en/5.2/physics/rigid_body/properties/collisions.html), read 2026-10-15
  - Blender 5.2 Manual, "Rigid Body World", Rigid Body Cache (https://docs.blender.org/manual/en/5.2/physics/rigid_body/world.html), read 2026-10-15
  - Blender 5.2 Manual, "Rigid Body Tips", Animation and Scaling Rigid Bodies (https://docs.blender.org/manual/en/5.2/physics/rigid_body/tips.html), read 2026-10-15
  - Blender 5.2.2, the Physics tab's Rigid Body panels and Object > Rigid Body > Bake to Keyframes (5.2/scripts/startup/bl_ui/properties_physics_rigidbody.py, space_view3d.py and bl_operators/rigidbody.py); a keyed passive ball knocking down a 20-block wall with Animated on and passing through it with Animated off, checked 2026-10-15
  - Ryan King Art, "Rigid Body Physics for Beginners" (https://www.youtube.com/watch?v=lctjzasiy64), read 2026-10-15
---

# Rigid bodies

Rigid body physics works out how solid objects fall, collide and tip over, so you don't have to key every tumble by hand. In this lesson you'll make objects active or passive, choose their collision shape, mass and friction, push them over with a keyed ball and bake the result.

![A wall of blocks knocked over by a ball: the blocks lie tumbled on the ground, two still standing, and the ball has rolled past them.](example)

## Steps

1. **Add rigid bodies.** Select the wall's blocks and choose Object > Rigid Body > Add Active. Active bodies fall and collide. Select the ground and choose Add Passive: a passive body stays still and catches them. Press `Space` to play.

   ![A wall of active blocks with an arrow pulling them down, on a passive ground, beside the menu paths Add Active for the blocks and Add Passive for the ground.](add)

2. **Choose the shape.** Set one block's Collisions > Shape to Box in the Physics tab, then choose Object > Rigid Body > Copy from Active for the rest. Convex Hull, the default, wraps an object like shrink wrap. Mesh follows every face but runs slower.

   ![Collision shapes drawn dashed: Box fitting a block, Convex Hull wrapping an L-shaped piece and filling its notch, and Mesh following the notch.](shape)

3. **Set mass and friction.** Mass, in the Settings panel, is 1 kg by default. Friction and Bounciness are under Surface Response. A heavy ball barely slows down when it meets light blocks. Bounciness 0 means no bounce at all.

   ![A 10 kg ball beside a 1 kg block, and the Rigid Body settings Mass 10 kg, Friction 0.5 and Bounciness 0.](mass)

4. **Move a body with keys.** Make the ball passive and tick Animated in its Settings panel. Key its location on frame 10 to the left of the wall, and on frame 30 past the wall. The simulation now sees it move.

   ![The ball keyed on frame 10 beside the wall and on frame 30 past it, with a dashed arrow through the wall, and Animated ticked.](animated)

5. **Bake it.** Save the file. In the Scene tab, open Rigid Body World > Cache and click Bake. The fall now plays the same every time. To turn it into ordinary keys, select the blocks and choose Object > Rigid Body > Bake to Keyframes.

   ![The Rigid Body World Cache panel with Simulation Start 1, End 250 and the Bake button, beside Object, Rigid Body, Bake to Keyframes.](bake)

Ryan King Art smashes a tower with a keyed sphere at the end of his rigid body video.

## Common mistake

![Left, Animated off: the ball has passed through the wall and every block stands. Right, Animated on: the wall lies knocked over.](mistake)

A rigid body that you move with keys needs Animated ticked. Without it, the simulation treats the body as if it never left its first place. Your keyed ball passes through the wall and nothing falls.

## Checking your model

Play the simulation from frame 1 and check:

1. The ground stays still and nothing falls through it.
2. The ball follows its keys from frame 10 to frame 30.
3. The blocks tumble where the ball hits and come to rest.
4. After baking, scrubbing the Timeline shows the same fall each time.
