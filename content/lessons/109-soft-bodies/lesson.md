---
needs: [rigid-bodies]
exercise: jelly-on-a-plate
watch: [ryan-king-soft-body, blender-manual-physics-soft-body-introduction]
sources:
  - 'Blender 5.2 Manual, "Soft Body: Introduction", Creating a Soft Body and Tips (https://docs.blender.org/manual/en/5.2/physics/soft_body/introduction.html), read 2026-10-15'
  - Blender 5.2 Manual, "Soft Body Goal" (https://docs.blender.org/manual/en/5.2/physics/soft_body/settings/goal.html), read 2026-10-15
  - Blender 5.2 Manual, "Soft Body Edges", Pull, Push and Bending (https://docs.blender.org/manual/en/5.2/physics/soft_body/settings/edges.html), read 2026-10-15
  - Blender 5.2 Manual, "Soft Body Collision", Collisions with Other Objects and Good Collisions (https://docs.blender.org/manual/en/5.2/physics/soft_body/collision.html), read 2026-10-15
  - Blender 5.2 Manual, "Baking Physics Simulations" (https://docs.blender.org/manual/en/5.2/physics/baking.html), read 2026-10-15
  - 'Blender 5.2.2, a 0.8 m cube with 4 cuts dropped on a filled circle with Collision: Goal on by default at 0.7; with Goal off and default Edges it slumps to 0.1 m; with Bending 3 and Pull and Push 0.8 it keeps its shape, checked 2026-10-15'
  - Ryan King Art, "Soft Body Physics for Beginners", chapters Use Enough Geometry, Turn Off Goal and Bending (https://www.youtube.com/watch?v=6Dtwhd1N0bY), read 2026-10-15
---

# Soft bodies

Soft body physics makes a mesh squash, wobble and spring back, like jelly, a rubber ball or a cushion. In this lesson you'll drop a jelly cube onto a plate, stop it slumping into a puddle with the Edges settings, and bake the wobble.

![A jelly cube a moment after landing on a plate, squashed down and bulging at the sides before it springs back.](example)

## Steps

1. **Give it vertices.** A soft body moves a mesh's vertices, and a default cube has only 8. Select the cube, press `Tab` and choose Edge > Subdivide, with Number of Cuts set to 4. Press `Tab` again.

   ![Left, the default cube with 8 vertices. Right, the same cube with 4 cuts along each edge and 152 vertices.](vertices)

2. **Add Soft Body and turn off Goal.** In the Physics tab, click Soft Body. Goal starts ticked: it holds each vertex to its keyed place, so an unkeyed cube hangs where it is. Untick the Goal panel's checkbox so the cube falls.

   ![The Physics tab with Soft Body on and its panels folded, the Goal panel's checkbox unticked.](goal)

3. **Make the plate collide.** Choose Add > Mesh > Circle and set Fill Type to N-Gon for a flat plate under the cube. Click Collision in its Physics tab. A thin closed plate works worse, because its top and bottom collision zones overlap.

   ![The subdivided cube falling toward a flat disc, made with Add, Mesh, Circle and Fill Type N-Gon, which has Collision turned on.](collide)

4. **Keep its shape.** With the default Edges settings, the cube slumps into a puddle. In the Edges panel, set Pull and Push to 0.8 and Bending to 3. Higher values make it stiffer, lower ones softer.

   ![Left, the defaults: the cube slumped flat across the plate. Right, Bending 3 with Pull and Push 0.8: it keeps its shape, beside the Edges panel with those values.](shape)

5. **Bake it.** Save the file, set End to 100 in Soft Body > Cache and click Bake. Play it with `Space` to see the cube land, squash and wobble to a stop.

Ryan King Art turns Goal off and adds Bending first in his soft body video, before he tunes Push and Pull.

## Common mistake

![Left, Goal on: the cube stays in the air above the plate. Right, Goal off: the cube has fallen onto the plate.](mistake)

Soft Body turns Goal on, and with no keys the goal is where the cube starts, so the cube stays in the air when you press play. Untick Goal in the Physics tab. Goal is for jiggle on something that moves with keys or bones.

## Checking your model

Play from frame 1 and check:

1. The cube falls, lands on the plate and doesn't sink through it.
2. It squashes when it lands, then springs back to a cube shape.
3. The wobble dies down before frame 100.
4. Scrubbing back to frame 1 after baking shows the same fall.
