---
needs: [mirror, bevel-modifier, solidify, reference-images, first-export]
exercise: low-poly-sword
watch: [grant-abbitt-low-poly-sword, blender-manual-addons-scene-gltf2]
sources:
  - 'Blender 5.2 Manual, "Mirror Modifier" (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/mirror.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Solidify Modifier" (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/solidify.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Bevel Modifier" (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/bevel.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Primitives", Cylinder and Cap Fill Type (https://docs.blender.org/manual/en/5.2/modeling/meshes/primitives.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Join" (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/join.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "glTF 2.0", Data > Mesh > Apply Modifiers (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15'
  - 'Grant Abbitt, "Create a Low Poly Sword for Beginners": a sword from a reference picture, built in half with a mirror (https://www.youtube.com/watch?v=lgJaWqIYeKM), read 2026-10-15'
  - 'Kenney, Mini Dungeon, the sword the exercise copies, CC0 (https://kenney.nl/assets/mini-dungeon), read 2026-10-15'
  - 'Blender 5.2.2, checked 2026-10-15: the glTF exporter has Apply Modifiers off by default; a sword built as these steps say measures 140 triangles, 0 n-gons and 0 non-manifold edges; the parts are sized from the Kenney sword scaled to 1 m'
---

# A low-poly sword

This project puts the modifiers to work on a game prop. In this lesson you'll model a sword 1 m long over front and side pictures. You'll build the blade in half with Mirror, thicken it with Solidify and bevel its edges, add a guard and a grip, and export it to Godot.

![The finished sword: a bevelled blade with a pointed tip, a bevelled guard and an eight-sided grip.](example)

## Steps

1. **Draw half the blade.** Delete the cube. In the front view, add a plane, stand it up with `R` `X` `90` and apply the rotation. In Edit Mode, move its vertices over the blade's right half, pulling the top outer corner down for the point.

   ![The front picture with the blade's right half drawn as one face over it, its top outer corner pulled down so the inner corner is the tip.](half)

2. **Mirror it and thicken it.** Add Mirror with Clipping on. Then add Solidify with Thickness 0.06 m and Offset 0, so the blade grows equally on both sides of the picture.

   ![The Mirror and Solidify panels, and the blade they make: both halves, 6 cm thick.](thicken)

3. **Bevel its edges.** Add Bevel last in the stack, with Amount 0.015 m and Limit Method Angle. A narrow face now runs along every edge of the blade.

   ![The blade cut across. After Solidify it is a thin rectangle; after Bevel its corners are cut off.](bevel)

4. **Add the guard and grip.** Scale a cube to 52 by 24 by 16 cm for the guard, apply the scale and add the same Bevel. For the grip, size a cylinder with 8 vertices and Cap Fill Type Triangle Fan to the picture.

   ![The guard, a bevelled box, and the grip, an eight-sided cylinder wider near the bottom.](parts)

5. **Apply, join and export.** Apply each part's modifiers from the top down. Select all three parts, press `Ctrl+J` to join them, and apply the scale. Export with File > Export > glTF 2.0 into your Godot project.

## Common mistake

![The sword in Godot. Left, exported with the modifiers left in the stack: the blade is the flat half face. Right, modifiers applied: the whole sword.](mistake)

If the blade turns up in Godot as a flat half, the modifiers were still in the stack, and the glTF exporter leaves them out by default. Apply them before you export, or tick Apply Modifiers under Data > Mesh in the export settings.

## Checking your model

Check the sword in Blender, then in Godot:

1. The Sidebar's Dimensions show the sword 1 m tall.
2. In the front view, its outline matches the front picture.
3. The Statistics overlay shows under 200 triangles.
4. In Godot, the whole sword shows: blade, guard and grip.
