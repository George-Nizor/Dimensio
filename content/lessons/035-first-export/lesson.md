---
needs: [origins, apply-transforms, crate, checking-model]
exercise: crates-in-godot
watch: [octodemy-godot-export, tomgrave-blender-godot]
sources:
  - 'Blender 5.2 Manual, "glTF 2.0": Format, Include > Selected Objects, Transform > +Y Up, Data > Mesh > Apply Modifiers, Double-Sided / Backface Culling (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15'
  - Blender 5.2 Manual, "Apply", Object > Apply > Scale (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/apply.html), read 2026-10-15
  - Blender 5.2 Manual, "EEVEE Materials", Settings > Surface > Backface Culling (https://docs.blender.org/manual/en/5.2/render/eevee/material_settings.html), read 2026-10-15
  - 'Godot Docs, "Model export considerations": -Y is the front of an asset in Blender, and apply transforms before export (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/model_export_considerations.html), read 2026-10-15'
  - 'Godot Docs, "Available 3D formats": glTF binary files and Backface Culling (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/available_formats.html), read 2026-10-15'
  - 'Godot, "Download for Windows": Godot 4.7.2, extract and run, no installation (https://godotengine.org/download/windows/), read 2026-10-15'
  - Godot Docs, "Using the Project Manager", Create (https://docs.godotengine.org/en/stable/tutorials/editor/project_manager.html), read 2026-10-15
  - 'Godot Docs, "Import process": dragging files onto the FileSystem dock, and automatic reimport (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/import_process.html), read 2026-10-15'
  - Godot Docs, "Nodes and Scenes", the 3D Scene button (https://docs.godotengine.org/en/stable/getting_started/step_by_step/nodes_and_scenes.html), read 2026-10-15
  - 'Godot Docs, "Player scene and input actions": dragging a .glb from the FileSystem dock onto a node (https://docs.godotengine.org/en/stable/getting_started/first_3d_game/02.player_input.html), read 2026-10-15'
  - Godot Docs, "Creating instances", Ctrl+D to duplicate (https://docs.godotengine.org/en/stable/getting_started/step_by_step/instancing.html), read 2026-10-15
  - 'Godot Docs, "Introduction to 3D": 1 unit is 1 metre, and the grid is 1 by 1 metre (https://docs.godotengine.org/en/stable/tutorials/3d/introduction_to_3d.html), read 2026-10-15'
---

# Exporting to Godot

A model is ready for a game once it's in the engine at the right size and facing the right way. In this lesson you'll prepare your crate, export it from Blender as a .glb file and place three copies of it in a Godot 4 scene.

![Three crates standing side by side on Godot's grid, each half a grid square wide.](example)

## Steps

1. **Check the crate.** Open crate.blend. Its origin should sit at the middle of its base, with its front facing -Y, towards you in the front view: Godot's front. If Scale in the Sidebar isn't 1, choose Object > Apply > Scale.

   ![The crate with its origin at the middle of its base, and an arrow along -Y marking its front.](ready)

2. **Cull back faces.** In the Material tab, open Settings > Surface and tick Camera beside Backface Culling. The exported file then tells Godot to skip the back of each face.

3. **Export it.** Select the crate and choose File > Export > glTF 2.0. Set Format to glTF Binary (.glb). Under Include, tick Selected Objects. Under Data > Mesh, tick Apply Modifiers. Leave +Y Up ticked and export crate.glb.

   ![The glTF export settings: Format set to glTF Binary, and Selected Objects, +Y Up and Apply Modifiers ticked.](export)

4. **Open it in Godot.** Download Godot 4 from godotengine.org: it runs without installing. In the Project Manager, click Create, name the project and click Create again. Drag crate.glb from your file manager onto the FileSystem dock.

   ![The Godot editor: the Scene dock top left, the FileSystem dock below it with crate.glb, the viewport in the middle and the Inspector on the right.](godot-ui)

5. **Place three crates.** In the Scene dock, click 3D Scene. Drag crate.glb from the FileSystem dock onto the new Node3D. Press `Ctrl+D` twice for two copies, give each its own Position in the Inspector, then save with `Ctrl+S`.

   ![The Scene dock with a Node3D and three crate nodes under it, and crate.glb being dragged onto the Node3D.](place)

6. **Check the size.** Godot works in metres, and its grid squares are 1 m across. Each crate should stand on the grid and be half a square wide. If one looks tiny or huge, apply its scale in Blender and export again.

   ![A 0.5 m crate on Godot's grid of 1 m squares, half a square wide.](size)

## Common mistake

![Left, exported without Selected Objects: a forgotten, hidden sphere arrives in Godot beside the crate. Right, with Selected Objects ticked: the crate alone.](mistake)

With Selected Objects unticked, the exporter writes every mesh in the file, hidden ones too. A leftover cube or a reference model then arrives in Godot beside the crate. Tick Selected Objects each time you export.

## Checking your model

Check the crate in Blender, then in Godot:

1. In Blender, Scale reads 1 and the origin sits at the base.
2. In Godot, each crate stands on the grid, half a square wide.
3. The Scene dock shows the Node3D with three crates under it.
4. Nothing came into Godot with the crates.
