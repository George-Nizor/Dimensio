---
needs: [transform]
exercise: shape-three-cubes
watch: [cgcookie-mesh-components, blender-object-edit-mode]
sources:
  - 'Blender 5.2 Manual, "Object Modes": Tab, Ctrl+Tab, the mode selector in the header (https://docs.blender.org/manual/en/5.2/editors/3dview/modes.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Mesh Structure": vertices, edges and faces (https://docs.blender.org/manual/en/5.2/modeling/meshes/structure.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Mesh Selecting: Introduction": selection modes 1, 2, 3, X-Ray, A and Alt+A (https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/introduction.html), read 2026-10-15'
  - Blender 5.2 Manual, "Viewport Overlays", Statistics (https://docs.blender.org/manual/en/5.2/editors/3dview/display/overlays.html), read 2026-10-15
  - Blender 5.2 Manual, "Viewport Shading", X-Ray Alt+Z (https://docs.blender.org/manual/en/5.2/editors/3dview/display/shading.html), read 2026-10-15
  - Blender 5.2.2, the Statistics checkbox under Viewport Overlays > Text in 5.2/scripts/startup/bl_ui/space_view3d.py, checked 2026-10-15
---

# Edit Mode

In Object Mode you move whole objects. To change an object's shape, you work on its mesh in Edit Mode: the points, lines and faces it is made of. In this lesson you'll switch into Edit Mode, choose what to select, and move, turn and scale parts of a mesh.

![The default cube in Edit Mode with one vertex, one edge and one face picked out and labelled.](example)

## Steps

1. **Switch to Edit Mode.** Select the cube and press `Tab`. The mode menu in the 3D Viewport header now reads Edit Mode, and the cube shows its points and lines. `Tab` again returns to Object Mode, and `Ctrl+Tab` opens a pie of every mode.

   ![Left, the cube in Object Mode. Right, after Tab, the cube in Edit Mode with a dot at every corner.](tab)

2. **Choose what to select.** A vertex is a point, an edge is a line between two vertices, and a face fills the space between three or more edges. Press `1` for vertices, `2` for edges and `3` for faces, or use the header buttons.

   ![Three cubes over the keys 1, 2 and 3: one with a vertex selected, one with an edge and one with a face.](select-modes)

3. **Select through the mesh.** Click to select, `Shift`+click to add, `A` to select everything and `Alt+A` to select nothing. You can only click what faces you. Press `Alt+Z` for X-Ray to see the back of the mesh and select it too.

   ![The cube in X-Ray: its hidden back edges drawn dashed, and a vertex at the back selected through the front.](xray)

4. **Move, turn and scale.** `G`, `R` and `S` work on a selection as they do on objects, with axes and numbers. Select the top face and press `S`, then type 0.5, to taper the cube. Press `G` `X` `1` to lean it sideways.

   ![Two cubes with their top face selected. Left, the face scaled to half its size. Right, the face moved 1 m along X.](transform-face)

5. **Count the parts.** Open the Viewport Overlays menu in the header and tick Statistics. The top left of the viewport then lists the vertices, edges, faces and triangles, and how many of each you have selected.

   ![The Statistics overlay for the cube in Edit Mode: Vertices 4/8, Edges 4/12, Faces 1/6, Triangles 12.](statistics)

## Common mistake

![Left, Object Mode: G moves the whole cube. Right, Edit Mode: G moves only the selected top face.](mistake)

You press `G` to move one face and the whole cube moves. You're still in Object Mode, where `G` moves objects. Check the mode menu at the left of the header, and press `Tab` before you select parts.

## Checking your model

Look at the three shapes from the front (`Numpad 1`) and the side (`Numpad 3`):

1. The ramp's front is 0.5 m high and its top slopes up to the back.
2. The pillar's top face is half the width of its base.
3. The leaning block's top sits 1 m to the side of its base.
4. Statistics shows 36 triangles for the three shapes together.
