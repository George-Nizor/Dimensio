---
needs: [first-export]
exercise: import-three-props
watch: [octodemy-godot-export, godot-docs-import-configuration]
sources:
  - Godot 4 docs, "Import process", adding files, the .import file and the Reimport warning (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/import_process.html), read 2026-10-15
  - Godot 4 docs, "Import configuration", the Import dock, the Advanced Import Settings dialog and scene inheritance (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/import_configuration.html), read 2026-10-15
  - Godot 4 docs, "Advanced Import Settings" (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/advanced_import_settings.html), read 2026-10-15
  - Godot 4 docs, "ResourceImporterScene", Root Type and Root Scale (https://docs.godotengine.org/en/stable/classes/class_resourceimporterscene.html), read 2026-10-15
  - Godot 4 docs, "Available 3D formats", importing .blend files and Blender Path (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/available_formats.html), read 2026-10-15
  - Godot 4.7 source, editor_node.cpp, the Scene menu's New Inherited Scene... item (https://github.com/godotengine/godot/blob/4.7/editor/editor_node.cpp), read 2026-10-15
  - Octodemy, "Exporting 3D Models to Godot 4 | GlTF settings" (https://www.youtube.com/watch?v=_eIAl_HZWXM), checked 2026-10-15
---

# Godot import settings

Godot imports every model you put into a project and turns it into a scene, using settings you can change. In this lesson you'll read the Import dock and open the Advanced Import Settings. Then you'll make an inherited scene, so you can add to a model without touching its import.

![Godot's FileSystem dock with three imported .glb files and a .tscn scene for each, and the Scene dock showing crate.tscn: the imported nodes and an added light.](example)

## Steps

1. **Add the model to the project.** Drag your .glb from the file manager into Godot's FileSystem dock. Godot imports it and keeps the settings it used in crate.glb.import, a file beside it.

   ![Dragging crate.glb from a file manager window into Godot's FileSystem dock.](filesystem)

2. **Read the Import dock.** Click the file once in the FileSystem dock, then open the Import tab beside the Scene tab. Root Type sets the type of the top node, and Root Scale resizes the whole model. Change an option, then click Reimport.

   ![The Import dock for crate.glb, with Root Type and Root Scale picked out, and the Advanced and Reimport buttons at the bottom.](import-dock)

3. **Open Advanced Import Settings.** Double-click the file, or click Advanced… in the Import dock. The Scene tab lists every node, mesh and material in a tree, with a 3D preview beside it and options for whatever you select.

   ![The Advanced Import Settings window: the tree of nodes, meshes and materials on the left, a preview of the crate in the middle and the selected node's options on the right.](advanced)

4. **Make an inherited scene.** Choose Scene > New Inherited Scene… and pick the .glb. Add your own nodes to the new scene, such as an OmniLight3D, and save it as crate.tscn. A reimport updates the model and keeps what you added.

   ![New Inherited Scene picked out in Godot's Scene menu, and the scene it makes: the imported crate nodes with an OmniLight3D added under the root.](inherited)

5. **Or import the .blend.** Godot can read a .blend file by running Blender's glTF exporter for you. Set the path to blender.exe in Editor > Editor Settings, under FileSystem > Import > Blender > Blender Path. Everyone who opens the project then needs Blender.

   ![Godot's Editor Settings at FileSystem, Import, Blender, with the Blender Path field picked out.](blend)

## Common mistake

![Left, Root Scale changed in the Import dock and then another file clicked, which throws the change away. Right, Reimport clicked first.](mistake)

If you change an option in the Import dock and then click another file, Godot throws the change away. Nothing applies until you click Reimport, so click it before you select anything else.

## Checking your work

In Godot, check:

1. The FileSystem dock lists your crate, barrel and chest .glb files.
2. Each opens in Advanced Import Settings with a preview.
3. crate.tscn, barrel.tscn and chest.tscn each have your added light.
4. After you click Reimport on a .glb, its scene keeps the light.
