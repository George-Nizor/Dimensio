---
needs: [extrude, inset, bevel]
exercise: copy-the-crate
watch: [imphenzia-fantasy-props, imphenzia-wood-crate]
sources:
  - Kenney, Platformer Kit, the crate model, CC0 (https://kenney.nl/assets/platformer-kit), read 2026-10-15
  - Blender 5.2 Manual, "Numeric Input" for typing 0.5 during a transform (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/control/numeric_input.html), read 2026-10-15
  - Blender 5.2 Manual, "Bevel" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/bevel.html), read 2026-10-15
  - Blender 5.2 Manual, "Selecting", Invert with Ctrl+I (https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Triangulate Faces" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/triangulate_faces.html), read 2026-10-15
  - Blender 5.2 Manual, "Inset Faces", Individual and Thickness (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/inset_faces.html), read 2026-10-15
  - Blender 5.2 Manual, "Extrude Faces Along Normals" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/extrude_faces_normal.html), read 2026-10-15
  - Blender 5.2 Manual, "Viewport Overlays", Statistics (https://docs.blender.org/manual/en/5.2/editors/3dview/display/overlays.html), read 2026-10-15
---

# A low-poly crate

A crate is the first game asset in the course. In this lesson you'll copy Kenney's crate, a box 0.5 m across. Each side has a frame, a diagonal brace and two sunken panels. You'll build it from the default cube with bevel, inset and extrude, in under 300 triangles.

![The finished crate: a 0.5 m box with chamfered edges, and on each side a frame, a diagonal brace and two sunken triangular panels.](example)

## Steps

1. **Size the cube.** Select the default cube and press `Tab`. Press `A`, then `S`, type 0.25 and press `Enter`: the cube is now 0.5 m. Press `G`, `Z`, type 0.25 and press `Enter` to stand it on the ground.

   ![Left, the default cube, 2 m across with its origin in the middle. Right, the cube scaled to 0.5 m in Edit Mode and moved up so its origin sits at the middle of its base, with the default cube's outline dashed behind it.](size)

2. **Chamfer every edge.** Press `3` for face select, then `A`. Press `Ctrl+B`, type 0.01 and press `Enter`. Every edge becomes a narrow face 1 cm wide, which catches the light.

   ![The cube with every edge bevelled into a thin face, the new faces selected.](chamfer)

3. **Split each side.** Bevel leaves its new faces selected, so press `Ctrl+I` to select the six big faces instead. Press `Ctrl+T` (Triangulate Faces) to split each one into two triangles. The diagonal between them becomes the brace.

   ![Left, the six big faces selected after Ctrl+I. Right, each of them split into two triangles by a diagonal after Ctrl+T.](split)

4. **Inset each triangle.** Press `I`, then `I` again so each triangle insets on its own. Type 0.04 and press `Enter`. The border round each triangle makes the frame, and along the diagonal it makes the brace.

   ![The crate with a border inset round each triangle, the smaller inner triangles selected.](inset)

5. **Sink the panels.** With the inner triangles still selected, press `Alt+E` and choose Extrude Faces Along Normals. Type -0.025 and press `Enter`. Each panel drops 2.5 cm, with walls round it.

   ![The crate with the inner triangles pushed 2.5 cm into it, leaving the frame and brace standing out.](sink)

6. **Give it a material.** Press `Tab` for Object Mode. In the Properties editor's Material tab, click New and set Base Color to a wood brown. The Statistics overlay should show 188 triangles.

The reference is the crate from Kenney's Platformer Kit, which has 156 triangles. Dimensio compares your crate's outline with it from the front, the side and the top.

## Common mistake

![Left, each side inset as one shape: a square frame round a sunken square, with no brace. Right, each triangle inset on its own: a frame, a brace and two sunken triangles.](mistake)

Pressing `I` only once insets each side's two triangles together as one shape. The border then runs round the square, and no brace forms along the diagonal. Press `I` a second time while insetting, or tick Individual in the Adjust Last Operation panel.

## Checking your model

Look at the crate in Object Mode with the Statistics overlay on:

1. Triangles reads 188, and anything under 300 is within the limit.
2. Every side has a frame, a diagonal brace and two sunken panels.
3. The crate stands on the grid and measures 0.5 m on each side.
4. Scale in the Sidebar's Item tab reads 1 on all three axes.

If Scale isn't 1, choose Object > Apply > Scale before you go on. Lesson 35 exports this crate.
