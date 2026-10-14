---
needs: [python-console, first-export]
exercise: export-each-piece
watch: [mina-pecheux-scripting, blender-python-api-quickstart]
sources:
  - Blender 5.2 Manual, "Text Editor", Text > New (Alt+N) and Run Script (Alt+P) (https://docs.blender.org/manual/en/5.2/editors/text_editor.html), read 2026-10-15
  - Blender 5.2 Manual, "Scripting & Security", Auto Run Python Scripts (https://docs.blender.org/manual/en/5.2/advanced/scripting/security.html), read 2026-10-15
  - Blender 5.2 Manual, "Command Line Arguments", -b and --python-text (https://docs.blender.org/manual/en/5.2/advanced/command_line/arguments.html), read 2026-10-15
  - Blender 5.2 Python API, "Export Scene Operators", bpy.ops.export_scene.gltf with use_selection and export_apply (https://docs.blender.org/api/5.2/bpy.ops.export_scene.html), read 2026-10-15
  - Blender 5.2 Python API, "bpy.path", abspath and // paths (https://docs.blender.org/api/5.2/bpy.path.html), read 2026-10-15
  - Blender 5.2 Python API, "Collection", objects (https://docs.blender.org/api/5.2/bpy.types.Collection.html), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15, the script exactly as shown, run with --python-text on the export-kit starter: four .glb files, each at the origin with its modifiers applied; in an unsaved file, // gave no folder
---

# Writing a script

A script is a list of Python commands saved as a text, which Blender runs in one go. It's worth writing one for any job you'd otherwise repeat by hand, such as exporting each piece of a kit as its own file. In this lesson you'll write that script, run it, and run it again without opening Blender.

![Four kit pieces from kit.blend, each written by the script to its own .glb file in an export folder.](example)

## Steps

1. **Start a new text.** In the Scripting workspace, click New in the Text Editor's header, or press `Alt+N` with the mouse over it. Rename the text export.py in the header's name field.

   ![The Text Editor's Text menu with New picked out, and the header with the text renamed export.py.](new-text)

2. **Type the script.** Copy the script line by line. It works out the export folder beside your .blend file, then goes through every object in the Kit collection. Python uses indents of 4 spaces to show which lines belong to the loop.

   ![The whole export script in the Text Editor, 16 lines with line numbers.](code)

3. **Read the loop.** For each object, the script selects only that object and moves it to the world origin. Then it exports the selection, so each file holds one object, and export_apply=True applies its modifiers first. Last, it puts the object back.

   ![The loop, lines 7 to 16, with what each part does.](loop)

4. **Save, then run it.** Save the .blend file, then press `Alt+P` with the mouse over the Text Editor, or click Run Script. The export folder beside the .blend file fills with one .glb file for each object in Kit.

5. **Run it without opening Blender.** In a terminal, go to your .blend file's folder and type blender -b kit.blend --python-text export.py. The -b option runs Blender with no window, and --python-text runs a text saved in the file.

   ![A terminal running Blender in the background on kit.blend with export.py, and the four lines it prints.](terminal)

A script can do anything your computer lets it. Blender won't run scripts in a file you open unless you allow it, so run only scripts you trust.

## Common mistake

![Left, an unsaved file sending its exports into Blender's own folder. Right, kit.blend saved first, with the export folder beside it.](mistake)

In a file you haven't saved, // has no folder to stand for, so the exports land wherever Blender started. Save the .blend file before you run the script, and run it again from the saved file.

## Checking your work

Open the export folder beside your .blend file and check:

1. It holds one .glb file for each object in Kit.
2. Each file has the name of its object.
3. A file imported into a new scene stands at the world origin.
4. The objects in your .blend file are back where they were.
