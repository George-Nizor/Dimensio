---
needs: [origins, crate, mirror, material-slots]
exercise: chest-copy
watch: [imphenzia-fantasy-props]
sources:
  - 'Blender 5.2 Manual, "Primitives", Cylinder: Vertices and Cap Fill Type Triangle Fan (https://docs.blender.org/manual/en/5.2/modeling/meshes/primitives.html), read 2026-10-15'
  - Blender 5.2 Manual, "Fill" (Alt+F) (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/fill.html), read 2026-10-15
  - Blender 5.2 Manual, "Object Origin", Set Origin > Origin to 3D Cursor (https://docs.blender.org/manual/en/5.2/scene_layout/object/origin.html), read 2026-10-15
  - Blender 5.2 Manual, "Assignment", material slots (https://docs.blender.org/manual/en/5.2/render/materials/assignment.html), read 2026-10-15
  - Blender 5.2 Manual, "Mirror Modifier" (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/mirror.html), read 2026-10-15
  - Blender 5.2 Manual, "glTF 2.0", export options (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15
  - 'Imphenzia, "Crash Course: Low Poly Fantasy Props in Blender 5", chapters on the treasure chest and its pivot fix (https://www.youtube.com/watch?v=M_cGaqzAIAc), chapter list read 2026-10-15'
  - 'Blender 5.2.2, the lid made from a 12-sided Triangle Fan cylinder as described (28 triangles, no n-gons, closed), and a rough copy with its lid flattened and opened 30 degrees measured against kenney-pirate-chest: outline 0.83 on its worst side, checked 2026-10-15'
---

# A low-poly chest

A treasure chest is a box with a lid that opens, held together with metal bands. In this lesson you'll model one in two parts and put the lid's origin on its hinge so it swings open. Then you'll colour the wood and metal with material slots and open it in Godot.

![A low-poly treasure chest with its rounded lid open on the hinge: a hollow wooden body, two grey metal bands round the lid and a grey lock on the front.](example)

## Steps

1. **Model the body.** Scale a cube to the body's size and apply the scale with `Ctrl+A` > Scale. In Edit Mode, inset the top face with `I` and extrude it down with `E` to hollow the chest out.

   ![Left, a box with its top face inset and the inner face selected. Right, that face extruded 0.45 m down, leaving the box hollow.](body)

2. **Model the lid.** Add a Cylinder with 12 Vertices and Cap Fill Type Triangle Fan, and turn it with `R` `Y` `90`. In Edit Mode, delete its lower half's vertices, select the open edges and press `Alt+F` to fill them with triangles.

   ![Left, a 12-sided cylinder lying along X with triangle fans on its ends. Right, its lower half deleted and the bottom filled: half a cylinder, closed all round.](lid)

3. **Set the hinge.** In Edit Mode, select the body's top back edge and press `Shift+S` > Cursor to Selected. Then select the lid in Object Mode and choose Object > Set Origin > Origin to 3D Cursor. Turned on X, it swings open.

   ![The chest from the right, with the 3D cursor and the lid's origin on the body's top back edge, and the lid swung open around it.](hinge)

4. **Add bands and a lock.** Model the metal bands and the lock as small boxes and join each to the body or the lid with `Ctrl+J`. A Mirror modifier on X copies the bands at one end to the other.

5. **Colour it with slots.** Give the body and the lid the same slots: wood, metal and a dark inside if you like. Pick each material from the slot's list so both parts share it, then assign the band and lock faces to metal.

   ![The closed chest with wooden body and lid and grey metal bands and lock, beside a slot list holding Wood and Metal, with Assign picked out.](colour)

6. **Open it in Godot.** Parent the lid to the body with `Ctrl+P`, select both and export a .glb as in lesson 35, with Apply Modifiers on. In Godot, turn the lid's node on X to check the hinge.

Imphenzia builds an openable chest the same way in his low-poly props crash course, fixing the lid's pivot so that it opens.

## Common mistake

![The chest from the right. Left, the lid's origin left in its middle: turned on X, it spins in place and half of it sinks into the body. Right, the origin on the hinge: the lid swings up and open.](mistake)

A new lid's origin sits in its middle, so turning it spins the lid in place and part of it sinks into the body. Snap the 3D cursor to the hinge edge and set the lid's origin there before you rotate it.

## Checking your model

Check the chest in Blender and in Godot:

1. The lid is its own object, parented to the body.
2. The lid's origin sits on the body's top back edge.
3. Turned on X, the lid opens without cutting into the body.
4. Wood and metal come from material slots, four at most.
5. The Statistics overlay shows under 500 triangles.
