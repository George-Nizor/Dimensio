---
needs: [curve-geometry]
exercise: slime-and-dome
watch: [cg-essentials-metaballs, blender-secrets-nurbs-surfaces]
sources:
  - Blender 5.2 Manual, "Object Types" (https://docs.blender.org/manual/en/5.2/scene_layout/object/types.html), read 2026-10-15
  - Blender 5.2 Manual, "Surfaces: Introduction" and "Surface Primitives", NURBS Surface as a 4 by 4 grid (https://docs.blender.org/manual/en/5.2/modeling/surfaces/primitives.html), read 2026-10-15
  - Blender 5.2 Manual, "Surface Structure", compared with a Subdivision Surface mesh (https://docs.blender.org/manual/en/5.2/modeling/surfaces/structure.html), read 2026-10-15
  - Blender 5.2 Manual, "Surfaces: Shape", Resolution Preview U and V (https://docs.blender.org/manual/en/5.2/modeling/surfaces/properties/shape.html), read 2026-10-15
  - Blender 5.2 Manual, "Metaball: Introduction" (https://docs.blender.org/manual/en/5.2/modeling/metas/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Metaball Properties", Resolution Viewport (https://docs.blender.org/manual/en/5.2/modeling/metas/properties.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing Meta Objects", Object Families and Conversion (https://docs.blender.org/manual/en/5.2/modeling/metas/editing.html), read 2026-10-15
  - Blender 5.2 Manual, "Volumes: Introduction" (https://docs.blender.org/manual/en/5.2/modeling/volumes/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Point Cloud" (https://docs.blender.org/manual/en/5.2/modeling/point_cloud/index.html), read 2026-10-15
  - Blender 5.2 Manual, "Convert", Mesh (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/convert.html), read 2026-10-15
  - Blender 5.2.2, checked 2026-10-15 in a script: a NURBS Surface converts to 98, 242 and 450 triangles at resolution 2, 3 and 4; two Ball metaballs give 1,948 triangles at Resolution Viewport 0.2 and 460 at 0.4, the default, and convert into one mesh; Add > Point Cloud adds 400 points, which convert to 400 loose vertices
---

# Other object types

Meshes and curves aren't the only kinds of object in Blender. In this lesson you'll try NURBS surfaces and metaballs, which make smooth shapes from a few controls, and convert both to meshes for a game. You'll also meet volumes and point clouds, so you know what they are when you find one in a file.

![Two shapes before converting: a slime made of five metaballs flowed together, and a dome made from a NURBS surface, its control points around it.](example)

## Steps

1. **Shape a NURBS surface.** Add > Surface > NURBS Surface adds a smooth sheet on a 4 by 4 grid of control points. In Edit Mode, raise the middle four with `G` `Z`. The sheet follows them as a Subdivision Surface follows its cage.

   ![A flat NURBS surface with its 16 control points and the middle four selected, then the same surface after G Z, raised into a dome.](nurbs)

2. **Set its resolution.** In the Object Data tab, Shape > Resolution Preview U and V set how many faces the sheet gets. At 3 by 3 the dome converts to 242 triangles.

   ![The dome at resolution 2 by 2, 3 by 3 and 4 by 4, converting to 98, 242 and 450 triangles.](resolution)

3. **Blend metaballs.** Add > Metaball > Ball, then add a second ball and move it close. The two flow together like drops of water. In the Metaball panel, Resolution Viewport sets the size of the faces: 0.2 gives about four times the triangles of 0.4.

   ![Two metaballs drawn apart as two round balls, then moved close and flowed into one shape.](metaballs)

4. **Convert them.** In Object Mode, choose Object > Convert > Mesh. Each shape becomes a mesh at its current resolution, and a group of metaballs that merge becomes one mesh. Set the resolution before you convert.

5. **Recognise volumes and point clouds.** A volume holds smoke or clouds as a 3D grid of densities, read from OpenVDB files like those Blender's fluid simulation writes. A point cloud holds loose points, as a 3D scan gives. Neither has faces to export.

   ![Left, a point cloud: scattered dots with nothing joining them. Right, a volume: a grid of densities, dense in the middle and thin at the edges.](others)

## Common mistake

![Left, two metaballs named Slime and Blob overlapping but staying two separate balls. Right, Slime and Slime.001 flowing into one shape.](mistake)

Metaballs only merge with others of the same family, which is the part of the name before the first dot. Rename one ball Blob and it stops blending with Slime. Keep one base name, such as Slime, Slime.001 and Slime.002.

## Checking your model

After converting, check:

1. The Outliner lists the slime and the dome as meshes.
2. The slime's balls flow into one shape with no seams between them.
3. The dome rises smoothly from its corners to its middle.
4. The Statistics overlay shows under 500 triangles for each shape.
