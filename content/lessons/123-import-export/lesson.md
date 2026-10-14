---
needs: [first-export]
exercise: import-and-fix
watch: [ryan-king-measure-scale, blender-manual-files-import-export]
sources:
  - Blender 5.2 Manual, "Importing & Exporting Files", File > Import and File > Export (https://docs.blender.org/manual/en/5.2/files/import_export/index.html), read 2026-10-15
  - Blender 5.2 Manual, "FBX", the importer and its Scale (https://docs.blender.org/manual/en/5.2/files/import_export/fbx.html), read 2026-10-15
  - Blender 5.2 Manual, "FBX" add-on, export options and Forward and Up axes (https://docs.blender.org/manual/en/5.2/addons/import_export/scene_fbx.html), read 2026-10-15
  - Blender 5.2 Manual, "Wavefront OBJ" (https://docs.blender.org/manual/en/5.2/files/import_export/obj.html), read 2026-10-15
  - Blender 5.2 Manual, "STL" (https://docs.blender.org/manual/en/5.2/files/import_export/stl.html), read 2026-10-15
  - Blender 5.2 Manual, "Universal Scene Description" (https://docs.blender.org/manual/en/5.2/files/import_export/usd.html), read 2026-10-15
  - Blender 5.2 Manual, "glTF 2.0" (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15
  - Blender 5.0 release notes, "Pipeline & I/O", the new FBX importer and Collada's removal (https://developer.blender.org/docs/release_notes/5.0/pipeline_io/), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15 with the import-practice starter, the File > Import list, the lantern.glb import at 0.6 m, crate.obj at 50 m, the fix to 0.5 m with scale applied, and an FBX export imported again at 0.5 m
---

# Importing and exporting

Models move between Blender, game engines and other 3D apps as files in a few common formats. Each format carries different things, and some arrive at the wrong size. In this lesson you'll choose a format, import models and fix their scale, then export a model for another app.

![Five formats and what each carries: glTF and FBX take meshes, materials and animation, OBJ meshes and simple materials, STL bare meshes, USD whole scenes.](example)

## Steps

1. **Pick a format.** Use glTF (.glb) for game engines such as Godot: it carries meshes, materials, textures and animation. FBX does the same for Unity, Unreal and other apps. OBJ holds static meshes, STL bare shapes for 3D printing, and USD whole scenes.

2. **Import a file.** Choose File > Import and the file's format, such as glTF 2.0 (.glb/.gltf) or Wavefront (.obj). For most formats, the options down the side of the File Browser include Scale, which multiplies the model's size as it comes in.

   ![File > Import with the formats Blender 5.2 reads, glTF 2.0 and Wavefront picked out.](import-menu)

3. **Check its size.** Press `N` and read Dimensions in the Sidebar's Item tab. A model made in centimetres can arrive 100 times too big. Press `S`, type 0.01 and press `Enter`, then apply the scale with `Ctrl+A` > Scale.

   ![The 0.6 m lantern beside the crate from the .obj file, 50 m wide, with Dimensions of 50 m in the Sidebar.](size)

4. **Export what you've selected.** Select the objects to send and choose File > Export > FBX (.fbx). Tick Include > Limit to > Selected Objects. Blender's Z axis points up and many apps use Y, so Forward -Z and Up Y convert for you.

   ![The FBX exporter's options: Limit to Selected Objects ticked, Scale 1.00, Forward -Z and Up Y.](export)

5. **Use the new FBX importer.** File > Import > FBX (.fbx) is the new importer, the default since 5.0. FBX (.fbx) (Legacy) is the old one, kept for a file the new one gets wrong.

Blender 5.0 removed Collada (.dae). Send models as glTF or FBX instead.

## Common mistake

![Left, the crate scaled down and left with Scale 0.010. Right, the scale applied, Scale 1.000, at the same 0.5 m.](mistake)

Scaling an import down in Object Mode makes it look right, but its Scale now reads 0.01. Modifiers such as Bevel and every later export carry that scale with them. Apply it with `Ctrl+A` > Scale, so Scale reads 1 and Dimensions show the real size.

## Checking your model

Select each object and look at the Sidebar's Item tab:

1. The crate measures 0.5 m and the lantern 0.6 m tall.
2. Every object's Scale reads 1.000 on all three axes.
3. The lantern keeps its yellow material after import.
4. Your FBX file imports again at 0.5 m.
