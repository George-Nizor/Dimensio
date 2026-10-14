---
needs: [loop-cuts, extrude, shading, first-export]
exercise: copy-the-barrel
watch: [imphenzia-fantasy-props, octodemy-godot-export]
sources:
  - Kenney, Pirate Kit, the barrel model, CC0 (https://kenney.nl/assets/pirate-kit), read 2026-10-15
  - 'Blender 5.2 Manual, "Primitives", Cylinder: Vertices, Radius, Depth (https://docs.blender.org/manual/en/5.2/modeling/meshes/primitives.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Loop Cut and Slide": the wheel for Number of Cuts, right click to leave the cuts in the middle (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/loopcut_slide.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Select Loops": edge loops and face loops with Alt and a click (https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/loops.html), read 2026-10-15'
  - Blender 5.2 Manual, "Axis Locking", plane locking with Shift+Z (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/transform/control/axis_locking.html), read 2026-10-15
  - Blender 5.2 Manual, "Extrude Faces Along Normals" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/extrude_faces_normal.html), read 2026-10-15
  - Blender 5.2 Manual, "Extrude Faces", cancelling leaves the new faces behind (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/extrude_faces.html), read 2026-10-15
  - Blender 5.2 Manual, "Inset Faces" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/inset_faces.html), read 2026-10-15
  - Blender 5.2 Manual, "Shading", Shade Auto Smooth and its Angle (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/shading.html), read 2026-10-15
  - Blender 5.2 Manual, "glTF 2.0", Data > Mesh > Apply Modifiers (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15
  - Godot Docs, "Import process", dragging files onto the FileSystem dock (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/import_process.html), read 2026-10-15
---

# A low-poly barrel

The barrel is the second game asset in the course. In this lesson you'll copy Kenney's barrel from a 12-sided cylinder, with a bulge, two raised bands and a sunken lid. Then you'll shade it and stand it beside your crates in Godot.

![The finished barrel, shaded smooth: 12 sides, wider in the middle, with two raised bands and a lid sunk into the top.](example)

## Steps

1. **Add the cylinder.** Choose Add > Mesh > Cylinder. In the Adjust Last Operation panel, set Vertices to 12, Radius to 0.55 m and Depth to 1.2 m. Press `Tab`, `A`, then `G`, `Z`, type 0.6 and press `Enter` to stand it on the ground.

   ![A 12-sided cylinder 1.2 m tall standing on the ground, its origin at the middle of its base.](cylinder)

2. **Cut four rings.** Press `Ctrl+R` and point at one of the upright edges. Roll the wheel up to 4 cuts, click, then right click to leave them evenly spaced, 0.24 m apart.

   ![The cylinder with four new rings of edges, evenly spaced up its side.](rings)

3. **Bulge the middle.** Hold `Alt` and click one of the new rings, then hold `Shift+Alt` and click the other three. Press `S`, then `Shift+Z` so the height stays fixed. Type 1.15 and press `Enter`.

   ![The four inner rings selected and scaled out by 1.15, so the barrel is wider in the middle than at the ends.](bulge)

4. **Raise the bands.** Press `3`. Hold `Alt` and click an upright edge in the second row of faces, then hold `Shift+Alt` and click one in the fourth row. Press `Alt+E`, choose Extrude Faces Along Normals, type 0.04 and press `Enter`.

   ![The second and fourth rows of faces pushed out 4 cm into two bands, still selected.](bands)

5. **Sink the lid.** Click the top face. Press `I`, type 0.06 and press `Enter`. Press `E`, type -0.05 and press `Enter` to push the lid down.

   ![The top face inset by 6 cm and pushed 5 cm down into the barrel, still selected.](lid)

6. **Shade and export.** In Object Mode, choose Object > Shade Auto Smooth and set Angle to 40 degrees. Tick Backface Culling in the material, export barrel.glb with Apply Modifiers on, and drag it into Godot's FileSystem dock, then onto the Node3D beside your crates.

   ![The barrel standing on Godot's grid beside the three crates.](in-godot)

The reference is the barrel from Kenney's Pirate Kit. It has 8 sides and 148 triangles; yours has 12 sides, so it reads rounder.

## Common mistake

![Left, a ring of faces moved with E: the band slides off to one side. Right, the same faces moved with Extrude Faces Along Normals: the band stands out all round.](mistake)

`E` on the band rows moves the whole ring of faces in one direction, so the band slides off to one side instead of standing out all round. Use `Alt+E` and Extrude Faces Along Normals, which moves each face outwards.

## Checking your model

Check the barrel in Blender, then in Godot:

1. Statistics shows 284 triangles, under the limit of 300.
2. The only n-gons are the lid and the base.
3. The sides look round, and the bands keep crisp edges.
4. In Godot, the barrel stands on the grid beside the crates.

If the bands look blurred in Godot, Apply Modifiers was off when you exported.
