---
needs: [edit-mode]
exercise: turn-them-outwards
watch: [cgcookie-normals-smoothing, blender-manual-modeling-meshes-editing-mesh-normals]
sources:
  - Blender 5.2 Manual, "Mesh Structure", Normals (https://docs.blender.org/manual/en/5.2/modeling/meshes/structure.html), read 2026-10-15
  - Blender 5.2 Manual, "Viewport Overlays", Face Orientation (https://docs.blender.org/manual/en/5.2/editors/3dview/display/overlays.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing Normals": Flip, Recalculate with Shift+N, the Alt+N menu (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/normals.html), read 2026-10-15
  - Blender 5.2 Manual, "Viewport Shading", Backface Culling (https://docs.blender.org/manual/en/5.2/editors/3dview/display/shading.html), read 2026-10-15
  - Blender 5.2 Manual, "EEVEE Materials", Settings > Surface > Backface Culling (https://docs.blender.org/manual/en/5.2/render/eevee/material_settings.html), read 2026-10-15
  - Blender 5.2 Manual, "glTF 2.0", Double-Sided / Backface Culling (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15
  - Godot Docs, "Available 3D formats", on Backface Culling and Cull Mode Disabled (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/available_formats.html), read 2026-10-15
---

# Normals

Every face has a front and a back, and the direction its front points is its normal. Blender draws both sides of a face, so one turned the wrong way often looks fine. Godot can skip the back of each face, and then that face vanishes. In this lesson you'll find faces turned inwards and turn them out.

![Left, a crate and a barrel with Face Orientation on: two red faces on the crate and red all over the barrel. Right, the same two after Shift+N, with no red.](example)

## Steps

1. **Show which side is which.** Open the Viewport Overlays popover in the 3D Viewport's header and tick Face Orientation. The back of every face turns red. Red on the outside of a model means that face points the wrong way.

   ![The crate with Face Orientation on: its top and front faces red, the rest in their usual colour.](orientation)

2. **Turn them all outwards.** In Edit Mode, press `A` to select everything, then press `Shift+N` (Recalculate Outside). Blender turns each face that points in so it points out.

   ![Left, the barrel red all over with everything selected. Right, after Shift+N, the barrel with no red.](recalculate)

3. **Flip one face.** Select a face and press `Alt+N`, then choose Flip. Its front and back swap. Use it when one face should point the other way, such as a ground plane that faces down.

   ![Left, a plane seen from above showing red, its normal pointing down. Right, after Alt+N and Flip, its normal points up and the red is gone.](flip)

4. **Cull back faces in the viewport.** Open the Viewport Shading popover and tick Backface Culling. Blender then hides the back of every face, and a face that points the wrong way turns into a hole.

   ![The Viewport Shading popover with Backface Culling ticked, and the crate with its top and front missing because they point inwards.](culling)

5. **Cull in the material too.** In the Material tab, open Settings > Surface and tick Camera beside Backface Culling. The exported file then tells Godot to skip back faces. Left off, Godot draws both sides of every face, which is slower.

   ![The Material tab's Settings panel with Camera ticked beside Backface Culling.](material)

## Common mistake

![The crate with its top face pointing inwards. Left, Backface Culling off: it looks whole. Right, Backface Culling on: the top is a hole.](mistake)

With Backface Culling off, a model can look right in Blender and still have faces turned the wrong way, because Blender draws both sides. Godot skips their backs, and they vanish. Turn culling on in the material, then fix any face that disappears.

## Checking your model

With Face Orientation on, look at both objects from every side:

1. No red shows anywhere on the outside of the crate or the barrel.
2. With Backface Culling on in the viewport, neither object has a hole.
3. The Wood material has Camera ticked beside Backface Culling.
