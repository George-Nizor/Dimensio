---
needs: [geometry-nodes]
exercise: ripple-plane
watch: [richard-yot-fields, blender-manual-modeling-geometry-nodes-fields]
sources:
  - Blender 5.2 Manual, "Fields", field nodes and dashed links (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/fields.html), read 2026-10-15
  - 'Blender 5.2 Manual, "Node Parts", socket shapes: diamond for fields (https://docs.blender.org/manual/en/5.2/interface/controls/nodes/parts.html), read 2026-10-15'
  - Blender 5.2 Manual, "Attributes" (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/attributes_reference.html), read 2026-10-15
  - Blender 5.2 Manual, "Set Position Node", Position and Offset (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/geometry/write/set_position.html), read 2026-10-15
  - Blender 5.2 Manual, "Position Node", "Normal Node" and "Index Node" (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/geometry/read/position.html), read 2026-10-15
  - Blender 5.2 Manual, "Math Node" (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/utilities/math/math.html), read 2026-10-15
  - Blender 5.2 Manual, "Separate XYZ Node" and "Combine XYZ Node" (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/utilities/vector/combine_xyz.html), read 2026-10-15
  - Blender 5.2 Manual, "Spreadsheet" (https://docs.blender.org/manual/en/5.2/editors/spreadsheet.html), read 2026-10-15
  - Blender 5.2 Manual, "Mesh Primitives", Grid (https://docs.blender.org/manual/en/5.2/modeling/meshes/primitives.html), read 2026-10-15
  - 'Blender 5.2.2, checked 2026-10-15 in a script: the node tree in this lesson on a 4 m grid with 40 subdivisions gives 1,681 vertices whose Z follows 0.2 x sin(3 x X), 0.4 m from trough to crest; the same wave linked into Position instead of Offset puts every point at X 0 and Y 0'
---

# Attributes and fields

Most nodes do one thing to the whole mesh. A field gives every point its own value, worked out from that point's position, its normal or its number. In this lesson you'll use fields and Math nodes to ripple a flat grid into waves.

![A flat grid rippled into waves that run across it, each point raised or lowered by its own amount.](example)

## Steps

1. **Start from a grid.** Add > Mesh > Grid. In the Adjust Last Operation panel, set X and Y Subdivisions to 40 and Size to 4 m. Give it a Geometry Nodes modifier and drop Set Position (Geometry > Write) on the link.

   ![Set Position between Group Input and Group Output. Its Selection, Position and Offset sockets are diamonds.](set-position)

2. **Read each point's position.** Add Geometry > Read > Position and link it into Separate XYZ (Utilities > Vector). Position is a field, a value that can differ for every point, like Normal and Index. Field sockets are drawn as diamonds, field links dashed.

   ![The Position node linked into Separate XYZ with a dashed link, beside a row of points whose X runs from -2 to 2.](position)

3. **Do math on every point.** Add three Math nodes from Utilities > Math and link X into the first. Set them to Multiply by 3, Sine, and Multiply by 0.2. Each one runs for every point, so each point gets its own height.

   ![Three Math nodes set to Multiply by 3, Sine and Multiply by 0.2, linked by dashed links, and the wave they make along X.](math)

4. **Move the points.** Add Combine XYZ (Utilities > Vector) and link the last Math node into its Z. Link its Vector into Set Position's Offset. Every point moves up or down by its own amount, and the grid ripples.

   ![Combine XYZ with its Vector linked into Set Position's Offset, and Set Position between Group Input and Group Output.](offset)

5. **Read the numbers.** The Spreadsheet in the Geometry Nodes workspace lists every vertex of the result with its Position. Along the grid's first row, X steps by 0.1 m and Z rises and falls with the wave.

   ![The Spreadsheet's first six rows: X going from -2 to -1.5 in steps of 0.1 while Z rises from 0.056 to 0.199 and starts to fall.](spreadsheet)

## Common mistake

![Left, the wave linked into Position: every point of the grid pulled onto one short vertical line. Right, linked into Offset: the grid ripples.](mistake)

Set Position's Position input replaces each point's whole location. Link the wave into it and every point lands at X 0, Y 0, stacked into a line. Offset adds to where each point already is, which is what a ripple needs.

## Checking your model

Look at the grid in Object Mode and check:

1. Waves run across the grid along its X axis.
2. The Sidebar's Item tab shows Dimensions Z of 0.4 m.
3. A dashed link runs into Set Position's Offset.
4. The Spreadsheet's Z column changes from row to row.
