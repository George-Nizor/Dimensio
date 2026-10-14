---
needs: [edit-mode]
exercise: cut-the-wall
watch: [ryan-king-knife-tool, blender-manual-modeling-meshes-editing-mesh-knife-topology-tool]
sources:
  - 'Blender 5.2 Manual, "Knife Topology Tool": usage, Close Loop, Stop, Confirm, Cut Through, Angle Constraint, Measure and Midpoint Snap (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/knife_topology_tool.html), read 2026-10-15'
  - Blender 5.2 Manual, "Knife Project" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/knife_project.html), read 2026-10-15
  - Blender 5.2 Manual, "Bisect" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/bisect.html), read 2026-10-15
---

# The knife tool

A loop cut runs all the way round a mesh. The knife adds edges only where you draw them. In this lesson you'll cut outlines and cracks into faces with the Knife tool, and cut through to the back of a model. You'll also cut along another object's outline and slice a mesh in two with Bisect.

![A wall with a doorway outline cut into its front from the bottom edge, and a zigzag crack running from its top edge to its right side.](example)

## Steps

1. **Start a cut.** In Edit Mode, press `K`. Click where the cut starts, on an edge or a vertex, then click at each corner. A line shows where the new edges will go. Press `Enter` to make the cut, or `Esc` to cancel it.

   ![The front of the wall with a doorway being cut: clicks on the bottom edge and at two corners, and the next line following the mouse.](start)

2. **Close a shape.** Double-click at the last corner to join the cut back to its first point. Right click ends one line so you can start another. Blender makes all of them when you press `Enter`.

   ![A window outline cut into the wall, its last corner double-clicked to close it back to the first.](close)

3. **Measure and line up.** While cutting, press `S` to show lengths and angles along the cut. Press `A` to hold each line to steps of 30 degrees. Hold `Shift` to snap to the middle of an edge.

   ![A cut line held to steps of 30 degrees, with faint guides at each step and its length shown beside it.](angles)

4. **Cut through.** The knife cuts only the faces you can see. Press `C` while cutting to cut the faces behind as well, such as the back of a wall.

   ![The wall seen through, with the doorway cut on the front face and the same outline cut on the back face.](through)

5. **Project an outline.** Select the mesh to cut and press `Tab`. Hold `Ctrl` and click a flat shape or a curve in the Outliner, then choose Mesh > Knife Project. Blender cuts its outline into the mesh, looking along the view.

   ![Left, a circle floating above a plane, seen from the top. Right, the plane with a ring of new edges where the circle was.](project)

6. **Slice with Bisect.** Choose Mesh > Bisect and drag a line across the mesh. Blender cuts the selection in two along that line, all the way through. In the Adjust Last Operation panel, Clear Outer deletes one side and Fill closes the cut.

   ![Left, a sphere with a line dragged across its middle. Right, the lower half left, closed with a flat face.](bisect)

## Common mistake

![Both pictures show the back of the wall. Left, cut without C: the back is whole. Right, cut with C: the doorway outline goes through to the back.](mistake)

If you cut a doorway from the front without pressing `C`, the knife cuts only the faces you can see and the back of the wall stays whole. Press `C` during the cut, before `Enter`, then orbit round to check the back.

## Checking your model

Look at the wall from the front, then orbit round to the back:

1. The doorway outline shows on both the front and the back.
2. The doorway's sides stand straight up and its top is level.
3. The crack runs from the top edge to a side edge without stopping.
