---
needs: [modifiers, extrude, normals]
exercise: goblet-from-outline
watch: [ryan-king-screw-modifier, ryan-king-spin-tool]
sources:
  - 'Blender 5.2 Manual, "Screw Modifier": Angle, Screw, Iterations, Axis, Steps Viewport and Render, Merge, and Flip under Normals (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/screw.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Spin": Mesh > Extrude > Spin, Steps, Angle, Auto Merge, the 3D cursor as centre and the view as axis (https://docs.blender.org/manual/en/5.2/modeling/meshes/tools/spin.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Extrude Vertices", E (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/vertex/extrude_vertices.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Merge", At Center (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/merge.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Overlays", Face Orientation (https://docs.blender.org/manual/en/5.2/editors/3dview/display/overlays.html), read 2026-10-15'
  - 'Blender 5.2.2, checked 2026-10-15: a new Screw modifier turns 360 degrees round Z in 16 steps with Merge off; the exercise goblet, drawn from the base up on the +X side, has every face pointing in until Flip is ticked, and with Merge and Flip on it measures 192 triangles, 0 non-manifold edges and 0 doubles; Mesh > Extrude > Spin opens at 360 degrees and 12 steps with Auto Merge on'
---

# Spin and Screw

Goblets, bottles, bowls and wheels are round, and you can make them by turning a flat outline round an axis, the way a lathe turns wood. In this lesson you'll draw half an outline as a line of vertices and turn it into a goblet with the Screw modifier. Then you'll make a spring by giving the turn some height.

![The exercise: a goblet turned from half its outline, and a spring.](example)

## Steps

1. **Draw half the outline.** Add a plane, press `Tab`, then `M` > At Center to merge it into one vertex at the origin. In the front view, press `E` and move to add each vertex, from the base out and up to the rim.

   ![Half a goblet's outline in the front view, a line of vertices starting at the origin on the Z axis.](profile)

2. **Add the Screw modifier.** In Object Mode, add Generate > Screw. It turns the outline 360° round the object's Z axis. Set Steps Viewport and Render to 12: twelve sides keep a round prop light.

   ![The outline beside the Z axis, then the goblet the Screw modifier turns from it, with 12 sides.](screw)

3. **Close the base and face it out.** Tick Merge so the vertices on the axis join into one and close the base. Drawn from the base up, the faces point inwards, and Face Orientation shows them red. Under Normals, tick Flip.

4. **Or use the Spin tool.** The Spin tool does the same in Edit Mode and makes real geometry. With the 3D cursor on the axis, select the outline, go to the top view and choose Mesh > Extrude > Spin. Set Steps in its panel.

   ![The top view: the outline seen edge on as a line from the 3D cursor, copied round it in 12 steps.](spin)

5. **Make a spring.** Add a circle with 8 vertices and Radius 0.05 m. In Edit Mode, stand it up with `R` `X` `90` and move it 0.3 m along X. Add Screw with Screw 0.2 m and Iterations 5.

   ![A small circle beside the axis, then the spring the Screw modifier makes: five turns, each 0.2 m higher.](spring)

## Common mistake

![Left, the outline away from the origin: the goblet comes out as a ring with a hole down the middle. Right, the outline starting on the axis: the base closes.](mistake)

The Screw turns the outline round the object's origin, and moving the outline in Object Mode moves the origin with it. Then the axis misses the outline and the goblet gets a hole down the middle. Keep the first vertex on the origin and move vertices only in Edit Mode.

## Checking your model

Look at the goblet from the front and from above:

1. From above, the goblet has twelve sides.
2. No hole shows in the base or in the bottom of the cup.
3. With Face Orientation on, no red shows on the outside.
4. The Statistics overlay shows under 300 triangles in Object Mode.
