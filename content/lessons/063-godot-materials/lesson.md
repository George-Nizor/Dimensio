---
needs: [palette-texture, vertex-paint, godot-import]
exercise: fix-godot-materials
watch: [godot-docs-standard-material-3d, godot-docs-advanced-import-settings]
sources:
  - Blender 5.2 Manual, "glTF 2.0", Exported Materials, Double-Sided and Backface Culling, Use Vertex Color (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15
  - Blender 5.2 Manual, "Image Texture Node", Interpolation Closest (https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/image.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing Normals", Recalculate Outside and Shift+N (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/normals.html), read 2026-10-15
  - Godot 4 docs, "Import configuration", procedural Blender materials (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/import_configuration.html), read 2026-10-15
  - Godot 4 docs, "Standard Material 3D and ORM Material 3D", Cull Mode, Vertex Color and Sampling (https://docs.godotengine.org/en/stable/tutorials/3d/standard_material_3d.html), read 2026-10-15
  - Godot 4 docs, "Advanced Import Settings", Extract Materials, and texture filtering set in the material rather than the image (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/advanced_import_settings.html), read 2026-10-15
  - Godot 4 docs, "Available 3D formats", Backface Culling and Godot's cull mode (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/available_formats.html), read 2026-10-15
  - Godot 4.7.2 source, gltf_document.cpp, where vertex colours set Use as Albedo only after the material is read (https://github.com/godotengine/godot/blob/4.7.2-stable/modules/gltf/gltf_document.cpp), read 2026-10-15
  - Exports from Blender 5.2.2 imported into Godot 4.7.2 on 2026-10-15, checking Filter, Cull Mode and Use as Albedo on each material
---

# Materials in Godot

When Godot imports a model, it rebuilds each Blender material as a StandardMaterial3D. Most settings come across, but three decide whether a palette stays sharp, vertex colours show and faces stay visible. In this lesson you'll set those in Blender, then change materials in Godot without losing your changes on the next import.

![Three props as they should look in Godot: a sign with a flat red board on a brown post, a solid crate, and a bush in green vertex colours.](example)

## Steps

1. **Know what crosses over.** Godot builds each material from the Principled BSDF: base colour and its image, metallic, roughness, a normal map, emission and alpha. Texture nodes such as Noise don't export, so bake them to an image first.

   ![Blender's Principled BSDF inputs on the left with arrows to Godot's StandardMaterial3D properties on the right; Noise and Voronoi lead nowhere and say bake first.](carry)

2. **Keep palette pixels sharp.** Set the palette's Image Texture node to Interpolation Closest. Godot then sets the material's Filter to Nearest Mipmap, and each face stays one flat colour. With Linear, swatches blur into their neighbours.

   ![Left, the sign's board with Interpolation Linear: its red mixes with neighbouring swatches towards the edges. Right, Interpolation Closest: one flat red.](palette)

3. **Let vertex colours through.** Connect a Color Attribute node to Base Color, or the exporter leaves the colours out. If the model still shows grey in Godot, tick Vertex Color > Use as Albedo in its material.

   ![The bush in Godot: left, Use as Albedo off and the bush grey; right, Use as Albedo ticked and the bush green.](vcol)

4. **Fix the faces Godot hides.** Godot copies Backface Culling: on gives Cull Mode Back, off gives Disabled, which draws both sides. With culling on, any face pointing inwards disappears, so fix normals with `Shift+N` before you export.

   ![Left, the crate inside out with culling on: its near faces vanish and you see into it. Right, after Shift+N, a solid crate.](culling)

5. **Extract materials to change them.** In Advanced Import Settings, choose Actions… > Extract Materials and pick a folder. Godot saves each material as a .tres file and uses it from then on, so your changes survive every reimport.

   ![The Actions menu in Advanced Import Settings with Extract Materials picked out, and the .tres files it saves in the FileSystem dock.](extract)

## Common mistake

![Left, the palette image's Import dock, which has no filter setting. Right, the extracted material's Sampling section with Filter set to Nearest Mipmap.](mistake)

It's tempting to look for a filter setting in the palette image's Import dock. Godot 4 sets texture filtering in the material instead, so the image's settings can't fix a blur. Set Closest in Blender, or set Sampling > Filter in the extracted material.

## Checking your model

Check in Blender, then in Godot:

1. The sign's Image Texture node reads Closest.
2. Face Orientation shows the crate blue all over.
3. The bush's material has a Color Attribute node in Base Color.
4. In Godot, each face of the sign is one flat colour.
5. In Godot, the crate is solid and the bush is green.
