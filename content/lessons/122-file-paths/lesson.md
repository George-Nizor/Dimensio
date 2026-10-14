---
needs: [image-textures]
exercise: find-and-pack
watch: [ryan-king-missing-textures, blender-manual-files-blend-packed-data]
sources:
  - Blender 5.2 Manual, "Topbar", File > External Data and File > Clean Up (https://docs.blender.org/manual/en/5.2/interface/window_system/topbar.html), read 2026-10-15
  - Blender 5.2 Manual, "Packed Data", Pack Resources, Unpack Resources and the packed icon (https://docs.blender.org/manual/en/5.2/files/blend/packed_data.html), read 2026-10-15
  - Blender 5.2 Manual, "Opening & Saving", Relative Paths (https://docs.blender.org/manual/en/5.2/files/blend/open_save.html), read 2026-10-15
  - Blender 5.2 Manual, "Output", where a // prefix is the folder of the current blend-file (https://docs.blender.org/manual/en/5.2/render/output/properties/output.html), read 2026-10-15
  - Blender 5.2 Manual, "Data-Blocks", Life Time and Protected (https://docs.blender.org/manual/en/5.2/files/data_blocks.html), read 2026-10-15
  - Ryan King Art, "Why your Textures are Pink in Blender" (https://www.youtube.com/watch?v=ChgoGr9V-tc), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15 with the missing-textures starter, Report Missing Files (two warnings with the paths looked in), Find Missing Files on the Moved textures folder (paths saved as //Moved textures\...) and Pack Resources
---

# Packing and file paths

A .blend file doesn't hold its image textures. It stores where they are on your computer, so moving or sharing the file can leave them behind. In this lesson you'll find textures that have gone missing, keep their paths tidy, and pack them into the .blend file so it works anywhere.

![File > External Data, with Pack Resources, Make Paths Relative, Report Missing Files and Find Missing Files picked out.](example)

## Steps

1. **Spot the missing textures.** In Material Preview, a texture Blender can't find shows pink. Choose File > External Data > Report Missing Files. The Info editor lists each missing file and the path Blender looked in.

   ![A crate showing pink, beside the Info editor's two warnings with the paths Blender looked in.](report)

2. **Find them.** Choose File > External Data > Find Missing Files and open the folder the textures are in now. Click Find Missing Files. Blender searches that folder, and the folders inside it, for files with the same names.

   ![The File Browser in the Moved textures folder, with the two images and the Find Missing Files button.](find)

3. **Keep paths relative.** A path that starts with // is relative: // means the folder the .blend file is in. File > External Data > Make Paths Relative turns full paths into relative ones, so the project still works when you move its folder.

   ![An image path starting with //, beside the folder the .blend file is in and the textures folder inside it.](relative)

4. **Pack the textures.** Choose File > External Data > Pack Resources, then save. The images are now stored inside the .blend file, with a parcel icon beside each path, and the file works on any computer.

   ![An Image Texture node with the parcel icon beside its image's path, showing it's packed.](pack)

5. **Clear out unused data.** When you save, Blender leaves out data that nothing uses, such as a material on no object. File > Clean Up > Purge Unused Data removes it straight away. The shield button beside a name, Protected, keeps it.

If a texture still shows pink after you find it, save the file and open it again so Blender reloads the images.

## Common mistake

![Left, crate.blend copied into a new folder on its own and showing pink. Right, the same file packed first, keeping its textures.](mistake)

Copying a .blend file to another folder or computer on its own is the usual way textures go missing. The file stores only where they were. Pack Resources before you share or move a file, or move the textures with it.

## Checking your work

Reopen the file and check:

1. Report Missing Files reports nothing.
2. The crate and the barrel show their textures in Material Preview.
3. Each image shows the parcel icon beside its path.
4. Renaming the Moved textures folder changes nothing when you reopen the file.
