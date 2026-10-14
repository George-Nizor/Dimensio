---
needs: [transform, adding-objects, first-material]
exercise: copy-the-potion
watch: [lisa-cree-primitive-character, cgcookie-3d-cursor]
sources:
  - Kenney, Mini Dungeon, the potion model (https://kenney.nl/assets/mini-dungeon), CC0, measured in Blender 5.2.2 with blender/dimensio_check.py at 0.33 m wide, 0.4 m tall and 120 triangles, checked 2026-10-15
  - Blender 5.2 Manual, "Mesh Primitives", UV Sphere segments and rings, Cylinder and Cone vertices, Radius 1 and Radius 2, Depth (https://docs.blender.org/manual/en/5.2/modeling/meshes/primitives.html), read 2026-10-15
  - Blender 5.2 Manual, "Undo & Redo", Adjust Last Operation with Location (https://docs.blender.org/manual/en/5.2/interface/undo_redo.html), read 2026-10-15
  - Blender 5.2 Manual, "Scale" and "Axis Locking" (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/scale.html), read 2026-10-15
  - Blender 5.2 Manual, "Default Keymap", F2 renames the active item (https://docs.blender.org/manual/en/5.2/interface/keymap/blender_default.html), read 2026-10-15
  - Blender 5.2 Manual, "Viewport Overlays", Statistics (https://docs.blender.org/manual/en/5.2/editors/3dview/display/overlays.html), read 2026-10-15
  - Blender 5.2.2, the bottle built with these settings, 0.32 m wide, 0.4 m tall, 136 triangles, its front outline close to Kenney's, checked 2026-10-15
---

# A potion bottle

This lesson puts lessons 5 to 9 together on one small game prop. You'll build a low-poly potion bottle from three primitives, sized and coloured to match an example by Kenney, without leaving Object Mode.

![The finished bottle: a red, flattened eight-sided body, a grey ring at the neck and an orange cork that widens towards the top.](example)

## Steps

1. **Read the example.** Look at Kenney's potion from the front. It is about 0.33 m wide and 0.4 m tall, and every part has eight sides. Plan three parts: a round body, a ring at the neck and a cork.

   ![The bottle you'll build, from the front, measured at 0.32 m wide and 0.4 m tall.](measure-example)

2. **Add the body.** Add a UV sphere. In the Adjust Last Operation panel set Segments to 8, Rings to 6, Radius to 0.16 m and Location Z to 0.12 m. Then press `S`, `Z`, type 0.75 and press `Enter` to flatten it.

   ![Left, the eight-sided UV sphere as added. Right, the same sphere flattened to three quarters of its height with S and Z.](body)

3. **Add the neck ring.** Add a cylinder with Vertices 8, Radius 0.11 m, Depth 0.06 m and Location Z 0.25 m. It overlaps the top of the body a little, which hides the join.

   ![The body with the eight-sided neck ring on top, overlapping it a little.](neck)

4. **Add the cork.** Add a cone with Vertices 8, Radius 1 at 0.07 m, Radius 2 at 0.09 m, Depth 0.12 m and Location Z 0.34 m. Radius 2 sets the top, so the cone widens upwards like a cork.

   ![The cone added as a cork, narrow at the bottom where Radius 1 is and wider at the top where Radius 2 is.](cork)

5. **Name and colour the parts.** Select each part and press `F2` to name it: Body, Neck and Cork. Give each part its own material in red, grey-blue and brown, and check the colours in Material Preview.

6. **Compare from the front.** Press `Numpad 1` and put the example beside your view. Turn on Statistics in the Overlays menu and click empty space: the whole bottle has 136 triangles.

   ![Your bottle's front outline drawn over the outline of Kenney's potion, matching closely except at the base, where Kenney's is flatter.](compare)

## Common mistake

![Left, the cork added while the 3D cursor was off to one side: it appears beside the body. Right, the cursor back at the centre with Shift+C: the cork sits on the neck.](mistake)

If the 3D cursor isn't at the centre of the world, each new part appears off to one side. Location Z sets only the height. Press `Shift+C` before you add each part, or set Location X and Y to 0 in the panel.

## Checking your model

Look at your bottle from the front and the top:

1. Measured from the front, the bottle is 0.4 m tall and 0.32 m wide.
2. Seen from the top, every part has eight sides.
3. The neck sits on the body and the cork on the neck, with no gaps.
4. Each part has a name and its own material.
5. Statistics shows no more than 250 triangles.

The limit is about twice the 120 triangles of Kenney's potion.
