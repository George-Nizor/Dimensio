---
needs: [filling-faces]
exercise: rebuild-the-shade
watch: [grant-abbitt-quads-ngons, blender-manual-modeling-meshes-structure]
sources:
  - 'Blender 5.2 Manual, "Mesh Structure": faces, triangles, quads and n-gons, and loops stopping at poles (https://docs.blender.org/manual/en/5.2/modeling/meshes/structure.html), read 2026-10-15'
  - Blender 5.2 Manual, "Viewport Overlays", Statistics (https://docs.blender.org/manual/en/5.2/editors/3dview/display/overlays.html), read 2026-10-15
  - Blender 5.2 Manual, "Select All by Trait", Faces by Sides (https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/all_by_trait.html), read 2026-10-15
  - Blender 5.2 Manual, "Connect Vertex Path" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/vertex/connect_vertex_path.html), read 2026-10-15
  - Blender 5.2 Manual, "Triangulate Faces" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/triangulate_faces.html), read 2026-10-15
  - Blender 5.2 Manual, "Triangles to Quads" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/triangles_quads.html), read 2026-10-15
  - 'Blender 5.2 Manual, "Mesh Analysis", Distortion: the triangulation of a distorted n-gon is undefined (https://docs.blender.org/manual/en/5.2/modeling/meshes/mesh_analysis.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "glTF 2.0", Meshes: quads and n-gons become triangles on export (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15'
  - Godot Docs, "Model export considerations", triangulation (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/model_export_considerations.html), read 2026-10-15
---

# Quads, triangles and n-gons

A face can have three corners, four or more. The kind you use decides whether edge loops run cleanly round a model and how it bends. In this lesson you'll find the n-gons in a model and turn the ones that cause trouble into quads.

![A triangle, a quad and a six-sided n-gon, each with its corners marked.](example)

## Steps

1. **Tell the three apart.** A triangle has three corners and is always flat. A quad has four. An n-gon has five or more. Quads are the easiest to work with: they bend and subdivide well, and edge loops run through them.

   ![A strip of quads with an edge loop running through it, beside a fan of triangles where the loop stops at the middle vertex.](loops)

2. **Count the triangles.** Tick Statistics in the Viewport Overlays popover. Triangles is the number Godot draws, because every face is split into triangles in the end. A quad makes two, and an n-gon makes its corner count minus two.

   ![A quad split into two triangles and a six-sided n-gon split into four, with the splits dashed.](count)

3. **Find the n-gons.** In Edit Mode, press `3` for face select and choose Select > Select All by Trait > Faces by Sides. In the Adjust Last Operation panel, set Number of Vertices to 4 and Type to Greater Than.

   ![The exercise's lamp with every n-gon selected: the two caps of its base and the eight sides of its shade.](find)

4. **Keep the flat ones.** A flat n-gon, such as the cap on the lamp's base, splits into triangles cleanly and can stay. A bent n-gon on a curved part can split along the wrong line and shade with a crease. Rebuild those.

   ![One of the shade's bent six-sided faces split two ways. Left, along a wrong line, with a crease across it. Right, along its middle, where it bends.](bent)

5. **Turn them into quads.** Select two vertices across an n-gon and press `J` to split it. For many at once, select them all, press `Ctrl+T` (Triangulate Faces), then `Alt+J` (Triangles to Quads) to join the triangles back into quads.

   ![A bent six-sided face, the same face split into four triangles by Ctrl+T, and two quads after Alt+J.](rebuild)

## Common mistake

![Left, the whole lamp triangulated with Ctrl+T: every face a triangle. Right, only the shade's n-gons rebuilt: quads on the shade, the base's caps left as they were.](mistake)

It's tempting to triangulate the whole model with `Ctrl+T` to get rid of its n-gons. Every quad then becomes two triangles too, and edge loops stop at nearly every vertex. Select only the n-gons first, then use `Ctrl+T` and `Alt+J`.

## Checking your model

Look at the lamp in Edit Mode with Statistics on:

1. Faces by Sides, Greater Than 4, selects only the base's top and bottom.
2. Each side of the shade is two quads, split at the middle ring.
3. Triangles reads 72, the same as before.
