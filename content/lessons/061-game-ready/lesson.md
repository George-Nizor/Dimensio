---
needs: [checking-model, first-export]
exercise: make-it-game-ready
watch: [grant-abbitt-game-asset-tips, godot-docs-model-export-considerations]
sources:
  - Blender 5.2 Manual, "Viewport Overlays", Statistics and Face Orientation (https://docs.blender.org/manual/en/5.2/editors/3dview/display/overlays.html), read 2026-10-15
  - Blender 5.2 Manual, "Object Origin", Set Origin and Origin to 3D Cursor (https://docs.blender.org/manual/en/5.2/scene_layout/object/origin.html), read 2026-10-15
  - Blender 5.2 Manual, "Apply", what applying Location, Rotation and Scale does (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/apply.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing Normals", Recalculate Outside and Shift+N (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/normals.html), read 2026-10-15
  - Blender 5.2 Manual, "Materials" (EEVEE), Settings and Backface Culling (https://docs.blender.org/manual/en/5.2/render/eevee/material_settings.html), read 2026-10-15
  - Blender 5.2 Manual, "Common Shortcuts", F2 to rename the active item (https://docs.blender.org/manual/en/5.2/interface/keymap/blender_default.html), read 2026-10-15
  - Godot 4 docs, "Model export considerations", -Y is the front in Blender, apply transforms (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/model_export_considerations.html), read 2026-10-15
  - Godot 4 docs, "Available 3D formats", Backface Culling decides Godot's cull mode (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/available_formats.html), read 2026-10-15
  - Papaya Games, "Blazing fast rendering with a single material per scene" (https://papaya-games.itch.io/duck-in-town/devlog/73530/blazing-fast-rendering-with-a-single-material-per-scene), read 2026-10-15
  - Grant Abbitt, "Top Tips for Making Game Assets & Packs" (https://www.youtube.com/watch?v=Cdh2IZmW5ZQ), checked 2026-10-15
---

# Game-ready models

A model that looks right in Blender can still arrive in a game at the wrong size or facing the wrong way. In this lesson you'll check a model against five things a game needs: a triangle budget, the origin, the facing, applied transforms and outward normals.

![Three props ready for a game: a crate, a barrel and a chair, each standing on its origin at the centre of its base, with the front towards the viewer.](example)

## Steps

1. **Count the triangles.** Open the Overlays popover in the 3D Viewport header and tick Statistics. Select one prop: Triangles is its count after modifiers. Keep each prop under its budget, such as 300 triangles for a crate.

   ![The Statistics overlay with the chair selected, its Triangles line reading 1,152 against a budget of 300, because a Subdivision Surface modifier is still on.](stats)

2. **Stand it on its origin.** In Edit Mode, select the faces of the base and choose `Shift+S` > Cursor to Selected. In Object Mode, choose Object > Set Origin > Origin to 3D Cursor. A game places and turns the prop by this point.

   ![Left, the barrel's origin at its middle. Right, the 3D cursor and the origin at the centre of its base.](set-origin)

3. **Face -Y, then apply.** Turn the prop so the front view (`Numpad 1`) shows its front, which then faces -Y, the way Godot expects. Press `Ctrl+A` > Rotation & Scale, so rotation reads 0 and scale 1.

   ![The chair from the top, its open front facing -Y towards the bottom of the picture, beside the Numpad 1 key that looks at the front.](facing)

4. **Point every face outward.** Tick Face Orientation in the Overlays popover: red shows a face's back. In Edit Mode, select all and press `Shift+N`. Then tick Backface Culling > Camera in Material > Settings, so Blender hides back faces as Godot will.

   ![Face Orientation on: left, the barrel inside out and red all over; right, after Shift+N, blue all over.](normals)

5. **Name it and keep materials few.** Press `F2` to rename each prop, since Godot names its node after the object. Give each prop one or two materials: changing material is one of the costlier steps in drawing a frame.

   ![The Outliner before and after F2: Cube.001, Cylinder and Cube.002 renamed Crate, Barrel and Chair.](names)

## Common mistake

![Left, after All Transforms, the crate's origin has moved to the world origin, far from the crate. Right, after Rotation & Scale, the origin stays at the crate's base.](mistake)

`Ctrl+A` > All Transforms on a prop that stands away from the world origin applies its location too. The origin jumps to the middle of the world, far from the prop. Apply Rotation & Scale instead.

## Checking your model

Select each prop in turn and check:

1. Statistics shows the three props under 300 triangles together.
2. The Sidebar's Item tab shows rotation 0 and scale 1.
3. Face Orientation shows blue all over the outside.
4. Each origin dot sits at the centre of its prop's base.
5. The Outliner lists Crate, Barrel and Chair.
