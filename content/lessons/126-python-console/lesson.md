---
needs: [interface]
exercise: console-commands
watch: [kenzocg-python-interface, blender-manual-editors-python-console]
sources:
  - Blender 5.2 Manual, "Python Console", C and D, Tab to autocomplete, Up for history, and the bpy.context examples (https://docs.blender.org/manual/en/5.2/editors/python_console.html), read 2026-10-15
  - Blender 5.2 Manual, "Info Editor", the log of operators and Ctrl+C (https://docs.blender.org/manual/en/5.2/editors/info_editor.html), read 2026-10-15
  - Blender 5.2 Manual, "Preferences: Interface", Python Tooltips (https://docs.blender.org/manual/en/5.2/editors/preferences/interface.html), read 2026-10-15
  - Blender 5.2 Manual, "Scripting & Extending Blender: Introduction" (https://docs.blender.org/manual/en/5.2/advanced/scripting/introduction.html), read 2026-10-15
  - Blender 5.2 Python API, "Quickstart" (https://docs.blender.org/api/5.2/info_quickstart.html), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15, the Scripting workspace's areas, and every console line in this lesson run on the default scene, including the KeyError for a misspelt name
---

# Python in Blender

Most of what you do in Blender runs a Python command, and you can type those commands yourself. It's the first step towards scripts that do repetitive jobs for you. In this lesson you'll read the commands Blender logs as you work, then rename and move objects by typing in the Python Console.

![The Scripting workspace: the 3D Viewport, Python Console and Info editor down the left, the Text Editor in the middle, the Outliner and Properties on the right.](example)

## Steps

1. **Open the Scripting workspace.** Click the Scripting tab at the top of the window. The Python Console sits on the left under a small 3D Viewport, with the Info editor below it. The Text Editor fills the middle.

2. **Watch the Info editor.** The Info editor logs each command you run, from a menu or with a shortcut, as a line of Python. Add a cube with Add > Mesh > Cube and read the line that appears: bpy.ops.mesh.primitive_cube_add, then its settings.

   ![The Info editor with a move and an Add Cube command, the Add Cube line selected, and Ctrl+C.](info)

3. **Turn on Python Tooltips.** In Edit > Preferences > Interface > Display, tick Python Tooltips. Hovering over a field, such as Location X, now shows its Python path as well: bpy.data.objects["Cube"].location[0].

   ![The tooltip over Location X with its Python path, bpy.data.objects["Cube"].location[0], picked out.](tooltip)

4. **Type a command.** Click in the Python Console, type a line and press `Enter` to run it. In the console, D stands for bpy.data and C for bpy.context. Type D.objects["Cube"].name = "Crate" to rename the cube.

   ![The Python Console after renaming the cube, moving the active object up and listing every object's name.](console)

5. **Let the console finish names.** Type C.object.loc and press `Tab`: the console completes it to C.object.location. Add .z = 1 and press `Enter` to move the active object 1 m up. `Up` brings back your last line.

   ![C.object.loc before Tab, and C.object.location after it.](autocomplete)

6. **Run a copied command.** Click a line in the Info editor and press `Ctrl+C`. Click in the console, press `Ctrl+V`, change a number, such as the location, and press `Enter` to run it again.

## Common mistake

![Above, D.objects["cube"] with a small c stopping with a KeyError. Below, D.objects["Cube"] finding the object.](mistake)

Python looks names up exactly, capitals included. D.objects["cube"] stops with a KeyError, because the object's name is Cube. Copy names from the Outliner or a Python tooltip, or list them all with [obj.name for obj in D.objects].

## Checking your work

Look at the Outliner and the Python Console:

1. The objects carry the names you typed.
2. The crate's Location Z reads 1 m.
3. A second cube stands at X 3 m, made from a copied command.
4. `Up` in the console brings back your earlier lines.
