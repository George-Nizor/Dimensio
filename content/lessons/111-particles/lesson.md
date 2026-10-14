---
needs: [rigid-bodies]
exercise: falling-leaves
watch: [ryan-king-particles, blender-manual-physics-particles-introduction]
sources:
  - 'Blender 5.2 Manual, "Particle System: Introduction" (https://docs.blender.org/manual/en/5.2/physics/particles/introduction.html), read 2026-10-15'
  - Blender 5.2 Manual, "Particle Emission" (https://docs.blender.org/manual/en/5.2/physics/particles/emitter/emission.html), read 2026-10-15
  - Blender 5.2 Manual, "Particle Velocity", Normal (https://docs.blender.org/manual/en/5.2/physics/particles/emitter/velocity.html), read 2026-10-15
  - Blender 5.2 Manual, "Particle Render", Object and Scale (https://docs.blender.org/manual/en/5.2/physics/particles/emitter/render.html), read 2026-10-15
  - Blender 5.2 Manual, "Particle Rotation" (https://docs.blender.org/manual/en/5.2/physics/particles/emitter/rotation.html), read 2026-10-15
  - 'Blender 5.2 Manual, "Force Fields: Wind" (https://docs.blender.org/manual/en/5.2/physics/forces/force_fields/types/wind.html), read 2026-10-15'
  - Blender 5.2 Manual, "Collision" (https://docs.blender.org/manual/en/5.2/physics/collision.html), read 2026-10-15
  - Blender 5.2.2, a new particle system's defaults (Number 1000, Frame Start 1, End 200, Lifetime 50, Normal 1 m/s, Scale 0.05) and the Collision panel's Particle settings, and 150 leaves blown by a Wind field of Strength 3 landing on a ground with Damping and Friction 1, checked 2026-10-15
  - Ryan King Art, "Particle Systems for Beginners" (https://www.youtube.com/watch?v=Lj2EBG2_ooQ), read 2026-10-15
---

# Particles and force fields

A particle system sends out many small copies from a mesh, such as sparks, rain or falling leaves, and force fields push them around. In this lesson you'll drop leaves from a tree's canopy, show each one as a leaf object, and blow them sideways with wind until they land.

![Leaves falling from a tree and drifting to the right in the wind, with some already lying on the ground downwind.](example)

## Steps

1. **Add a particle system.** Select the canopy. In the Properties editor's Particles tab, click +. Press `Space`: 1000 particles drop from its faces between frames 1 and 200, each living 50 frames.

   ![The Particles tab with Type Emitter, Number 1000, Frame Start 1, End 200 and Lifetime 50, beside particles dropping from a tree's canopy.](add)

2. **Set how many and how long.** In Emission, set Number to 150, End to 100 and Lifetime to 250, so each leaf lives long enough to reach the ground. In Velocity, set Normal to 0, so leaves drop instead of shooting out.

   ![Particles shooting out of a canopy with Normal 1 and dropping straight down with Normal 0, beside Number 150, End 100, Lifetime 250 and Normal 0.](emission)

3. **Show leaves.** Model a leaf about 10 cm long. In Render, set Render As to Object, choose the leaf as Instance Object and set Scale to 1. Tick Rotation, set Randomize to 1 and tick Dynamic, so each leaf turns its own way.

   ![Leaves turned every which way, beside the Render settings Object, Leaf and Scale 1, and Rotation ticked with Randomize 1 and Dynamic.](render)

4. **Add wind.** Choose Add > Force Field > Wind. Wind blows along the field's own Z axis, shown by its rings. Rotate it 90° on Y so it blows along X, and set Strength to 3. The leaves now drift as they fall.

   ![A Wind field with its rings and its Z axis turned to point along X, leaves drifting along it, and Strength 3 with Rotation Y 90°.](wind)

5. **Let them land and bake.** Click Collision in the ground's Physics tab. In its Particle panel, set Damping and Friction to 1 so leaves stop where they land. Then click Bake in the particle system's Cache panel.

   ![Leaves lying on the ground, beside the ground's Collision Particle settings, Damping 1 and Friction 1, and the particle Cache's Bake button.](land)

The Particles tab also has a Hair type, the older way to grow hair. Lesson 112 uses the newer Curves object instead.

## Common mistake

![Left, Lifetime 50: leaves only near the canopy, vanishing halfway down. Right, Lifetime 250: leaves falling all the way and lying on the ground.](mistake)

Each particle lives for its Lifetime in frames, 50 by default, and then disappears. A leaf falling from a canopy 3 m up vanishes halfway down. Raise Lifetime above the number of frames the longest fall takes.

## Checking your model

Play from frame 1 and check:

1. Leaves start falling on frame 1, and the last leaves the canopy by 100.
2. Every leaf shows as your leaf object, each turned differently.
3. The leaves drift with the wind as they fall.
4. Leaves stay where they land on the ground.
