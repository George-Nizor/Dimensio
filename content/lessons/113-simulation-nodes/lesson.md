---
needs: [instancing]
exercise: coins-from-a-chest
watch: [xan3d-simulation-nodes, blender-studio-simulation-nodes]
sources:
  - Blender 5.2 Manual, "Simulation Nodes" (https://docs.blender.org/manual/en/5.2/physics/simulation_nodes.html), read 2026-10-15
  - Blender 5.2 Manual, "Simulation Zone", Inputs and Baking (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/simulation/simulation_zone.html), read 2026-10-15
  - Blender 5.2 Manual, "Baking" for Geometry Nodes (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/baking.html), read 2026-10-15
  - Blender 5.2.2, the Geometry Node Editor's Add > Simulation > Simulation and the Physics tab's Simulation Nodes panel (5.2/scripts/startup/bl_ui/node_add_menu_geometry.py and properties_physics_geometry_nodes.py); this lesson's node tree built on the coin-spout starter, dropping about 1.8 coins a frame that stop at Z 0, and baked, checked 2026-10-15
  - Xan 3D, "How SIMULATION NODES Works in Blender", chapters Delta Time and Join Geometry creating new points (https://www.youtube.com/watch?v=_BAFFWPOx5U), read 2026-10-15
---

# Simulation nodes

A simulation zone in Geometry Nodes carries its result from one frame to the next, so you can build your own physics out of ordinary nodes. In this lesson you'll make coins pour out of a chest: new points each frame, a fall, a floor, and a coin on every point.

![Coins pouring from in front of a treasure chest's lid and lying in a heap on the floor below.](example)

## Steps

1. **Add the zone.** Select the spout. In the Modifiers tab, choose Add Modifier > Geometry Nodes and click New. In the Geometry Node Editor, choose Add > Simulation > Simulation. Nodes between the two new ones rerun every frame, starting from the last frame's result.

   ![Group Input, Simulation Input, Simulation Output and Group Output in a row, with the shaded zone between the two simulation nodes, under Add, Simulation, Simulation.](zone)

2. **Make points each frame.** Inside the zone, add Distribute Points on Faces with the Group Input's Geometry as its Mesh and Density set to 20. Plug Scene Time's Frame into its Seed. Join its points to the zone's Geometry with Join Geometry.

   ![Scene Time's Frame and the Group Input's Geometry feeding Distribute Points on Faces, whose Points join the Simulation Input's Geometry in Join Geometry.](emit)

3. **Make them fall.** Add Set Position after Join Geometry. For its Offset, add Vector Math set to Scale, with Vector (0, 0, -2) and Scale from the Simulation Input's Delta Time, the seconds between frames. The points now drop 2 m a second.

   ![Join Geometry into Set Position, whose Offset comes from Vector Math set to Scale, scaled by the Simulation Input's Delta Time.](fall)

4. **Stop them at the floor.** Add a second Set Position. Split Position into X, Y and Z with Separate XYZ. Keep the larger of Z and 0 with Math set to Maximum, then rebuild the vector with Combine XYZ for its Position.

   ![Position into Separate XYZ, Z through Math set to Maximum with 0, and X, Y and the new Z into Combine XYZ, which sets the second Set Position's Position.](floor)

5. **Make coins.** After the Simulation Output, add Instance on Points. Plug a Cylinder node, Radius 0.04 m and Depth 0.008 m, into its Instance, and its Instances into the Group Output. Press `Space` to watch them pour.

   ![The Simulation Output into Instance on Points, with a Cylinder as the instance, into the Group Output.](coins)

6. **Bake the zone.** Save the file. In the Physics tab's Simulation Nodes panel, click Bake. Blender stores the bake beside the file, so you can jump to any frame and see the same pile.

   ![The Physics tab's Simulation Nodes panel with Calculate to Frame and Bake.](bake)

## Common mistake

![Left, Distribute Points on Faces outside the zone feeding the Simulation Input, so every coin is made at once. Right, Distribute Points on Faces inside the zone, joined each frame.](mistake)

The Simulation Input reads what's plugged into it on the first frame only. If Distribute Points on Faces feeds it from outside the zone, every coin appears at once and they fall as one sheet. Put the node inside the zone and join its points each frame.

## Checking your model

Play from frame 1 and check:

1. New coins appear at the spout on every frame.
2. Each coin falls straight down from where it appeared.
3. Coins stop at the floor instead of sinking below it.
4. After baking, jumping to frame 100 shows the same heap.
