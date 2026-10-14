---
needs: [selecting-loops]
exercise: lamp-and-rocks
watch: [ryan-king-join-separate, blender-manual-modeling-meshes-editing-mesh-separate]
sources:
  - Blender 5.2 Manual, "Select Linked", L under the mouse (https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/linked.html), read 2026-10-15
  - Blender 5.2 Manual, "Separate": Selection, By Material, By Loose Parts (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/separate.html), read 2026-10-15
  - Blender 5.2 Manual, "Split", Split Selection with Y (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/split.html), read 2026-10-15
  - Blender 5.2 Manual, "Join" (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/join.html), read 2026-10-15
  - Blender 5.2 Manual, "Common Shortcuts", F2 to rename the active item (https://docs.blender.org/manual/en/5.2/interface/keymap/blender_default.html), read 2026-10-15
---

# Separate and join

Sometimes part of a mesh should be an object of its own, such as a lampshade you want to move by itself. Sometimes several objects should be one, such as a pile of rocks you'll place as a single prop. In this lesson you'll separate parts of a mesh into new objects and join objects into one.

![The lamp as two objects, its shade picked out on its own, and five rocks joined into one pile.](example)

## Steps

1. **Select one part.** In Edit Mode, point at the part you want and press `L`. Blender selects everything connected to it. A piece of mesh with no edge joining it to the rest is a loose part.

   ![The lamp in Edit Mode with the mouse over its shade and every face of the shade selected after L.](linked)

2. **Separate it.** Press `P` and choose Selection. The part leaves the mesh and becomes a new object, named after the old one with a number, such as Lamp.001. Select it in Object Mode and press `F2` to rename it.

   ![Left, one object with the shade selected in Edit Mode. Right, two objects in Object Mode, with the Outliner listing Lamp and Lamp.001.](separate)

3. **Separate by part or material.** The `P` menu has two more choices. By Loose Parts makes an object from every loose part, and By Material makes one from each material slot. Both work on the whole mesh, whatever you have selected.

   ![The P menu open with its three choices: Selection, By Material and By Loose Parts.](menu)

4. **Split without a new object.** Press `Y` (Split) to cut the selected faces free along their border. They stay in the same object, so you can move them away from the rest, like a lid lifted off a box.

   ![A box in Edit Mode with its top face split off by Y and lifted, leaving the box open and both still one object.](split)

5. **Join objects.** In Object Mode, click the objects to join, and click the one to keep last: it becomes the active object. Press `Ctrl+J`. The others merge into it and take its name and origin, but lose their modifiers.

   ![Left, five rocks selected with the biggest one clicked last. Right, after Ctrl+J, one rock pile with its origin at the biggest rock's base.](join)

## Common mistake

![Left, the rocks joined with a small rock at the edge active, so the pile's origin sits off to one side. Right, the big rock active, so the origin sits in the middle of the pile.](mistake)

The last object you click before `Ctrl+J` is the active one, and the joined pile keeps its name and origin. If you click a small rock at the edge last, the pile turns round a point off to one side. Click the main rock last.

## Checking your model

Look at the Outliner and the 3D Viewport in Object Mode:

1. Clicking the shade selects the shade alone, and the Outliner lists it as Shade.
2. The base and the pole are still one object, Lamp.
3. The rocks are one object, Rock 1, with its origin at the big rock.
