---
needs: [modifiers, shader-editor]
exercise: node-tower
watch: [ryan-king-geometry-nodes, joey-carlino-geometry-nodes-start]
sources:
  - Blender 5.2 Manual, "Geometry Nodes: Introduction", Group Input and Group Output (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Geometry Nodes Modifier", Inputs (https://docs.blender.org/manual/en/5.2/modeling/modifiers/geometry_nodes.html), read 2026-10-15
  - Blender 5.2 Manual, "Geometry Node Editor" (https://docs.blender.org/manual/en/5.2/editors/geometry_node.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing Nodes", dropping a node on a link, Duplicate Shift+D (https://docs.blender.org/manual/en/5.2/interface/controls/nodes/editing.html), read 2026-10-15
  - Blender 5.2 Manual, "Node Parts", multi-input sockets (https://docs.blender.org/manual/en/5.2/interface/controls/nodes/parts.html), read 2026-10-15
  - Blender 5.2 Manual, "Transform Geometry Node" (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/geometry/operations/transform_geometry.html), read 2026-10-15
  - Blender 5.2 Manual, "Join Geometry Node" (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/geometry/join_geometry.html), read 2026-10-15
  - Blender 5.2 Manual, "Viewer Node", Shift+Ctrl and left click (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/output/viewer.html), read 2026-10-15
  - Blender 5.2 Manual, "Node Groups", making a new input from the hollow socket (https://docs.blender.org/manual/en/5.2/interface/controls/nodes/groups.html), read 2026-10-15
  - Blender 5.2.2, checked 2026-10-15 in a script: New in the Geometry Node Editor adds a modifier called GeometryNodes with Group Input linked to Group Output; the Add menu path Geometry > Operations > Transform Geometry; three copies of the default cube give 36 triangles; with nothing linked to Group Output the object has no vertices
---

# Geometry Nodes

Geometry Nodes changes a mesh with a chain of nodes, and you can change any setting in the chain later. In this lesson you'll add a Geometry Nodes modifier, scale and copy a mesh with your first nodes, and put a setting on the modifier panel.

![A tower of three cubes, each smaller than the one below, made from the default cube by a Geometry Nodes modifier.](example)

## Steps

1. **Add the modifier.** Open the Geometry Nodes workspace, select the cube, and click New in the node editor's header. Blender adds a Geometry Nodes modifier with two nodes. Group Input is the mesh as it comes in, and Group Output is what the object shows.

   ![Group Input linked straight to Group Output: the mesh as it comes in, and what the object shows.](new)

2. **Add a node.** With the mouse over the node editor, press `Shift+A` and choose Geometry > Operations > Transform Geometry. Drop it on the link between the two nodes and it connects itself. Set its Scale to 0.7 and the cube shrinks.

   ![Transform Geometry linked between Group Input and Group Output, with its Scale set to 0.7.](transform)

3. **Join copies.** Duplicate the Transform Geometry node twice with `Shift+D` and link Group Input into each. Give each its own Scale and Translation Z. Link all three into one Join Geometry node, whose long socket takes many links, and Join Geometry into Group Output.

   ![Three Transform Geometry nodes with Scale 1, 0.7 and 0.4 and Translation Z 0, 1.7 and 2.8 m, all linked into Join Geometry, which is linked to Group Output.](join)

4. **Look at one node.** Hold `Shift` and `Ctrl` and left click a node. Blender links it to a Viewer node, and the 3D Viewport and the Spreadsheet show that node's result instead of the finished tower.

   ![A Transform Geometry node linked to a Viewer node, beside the keys Shift and Ctrl and a mouse with its left button picked out.](viewer)

5. **Put a setting on the modifier.** Drag from a node's Scale socket to the hollow socket on Group Input. Scale becomes an input of the node group and shows on the modifier panel, so you can change it without opening the nodes.

   ![Group Input with a new Scale socket linked to a Transform Geometry node's Scale, and the modifier panel showing Scale 0.7.](expose)

## Common mistake

![Left, Join Geometry not linked to Group Output, and the viewport showing nothing. Right, the two linked, and the tower showing.](mistake)

The object shows only what reaches Group Output. If you add a node at the end of the chain and forget to link it on, or cut the last link, the object disappears. Follow the links back from Group Output when something goes missing.

## Checking your model

Look at the cube in Object Mode and check:

1. The Modifiers tab lists a Geometry Nodes modifier on the cube.
2. Three cubes stack into a tower, the smallest on top.
3. The Statistics overlay shows 36 triangles.
4. Changing the input on the modifier panel changes the tower.
