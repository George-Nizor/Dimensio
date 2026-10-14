---
needs: [saving]
exercise: append-and-link
watch: [pierrick-picaut-linking, blender-manual-files-linked-libraries-link-append]
sources:
  - Blender 5.2 Manual, "Link & Append", File > Link, File > Append, the chain icon, Reload and Make Local (https://docs.blender.org/manual/en/5.2/files/linked_libraries/link_append.html), read 2026-10-15
  - Blender 5.2 Manual, "Library Overrides", Object > Library Override > Make (https://docs.blender.org/manual/en/5.2/files/linked_libraries/library_overrides.html), read 2026-10-15
  - Blender 5.2 Manual, "Data-Blocks" (https://docs.blender.org/manual/en/5.2/files/data_blocks.html), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15, appending Crate and linking Barrel from the props-library starter, making a library override of the barrel and moving it, and Object > Relations > Make Local and its four choices
---

# Linking and appending

You can use a model from one .blend file in any other. Appending copies it into the file you're working in. Linking points at the original instead, so a fix made there reaches every file that links it. In this lesson you'll do both, and learn how to edit a linked model.

![A props library with a crate, a barrel and a lamp: the crate appended into a scene as a copy, the barrel linked as a reference.](example)

## Steps

1. **Append a copy.** Choose File > Append and find the other .blend file. Click into it: its contents show as folders, such as Material, Mesh and Object. Open Object, pick Crate and click Append. The crate is now yours to change.

   ![The File Browser inside props-library.blend, with the Object folder open, Crate picked out and the Append button.](browser)

2. **Link instead.** File > Link works the same way, but your file keeps a reference to the original. A linked object shows a chain icon in the Outliner, and you can't edit it. It updates when you save the source file and reopen this one.

   ![The Outliner with the appended crate as an ordinary object and the linked barrel marked with a chain icon.](outliner)

3. **Override to edit a linked model.** Select the linked object and choose Object > Library Override > Make. Now you can move it and change its settings. Everything you leave alone still follows the source file.

4. **Make it local.** To cut the tie for good, select it and choose Object > Relations > Make Local > Selected Objects, Data and Materials. The object becomes an ordinary part of this file, as an appended one is.

   ![The Object menu with Library Override > Make picked out, and Relations > Make Local below it.](override)

5. **Choose append or link.** Append when you want a copy to change in this file. Link when you use one model in many files and want a fix in the source to reach all of them, as with a kit of level pieces.

Pierrick Picaut's video covers linking whole collections and overriding them.

## Common mistake

![Left, G pressed on the linked barrel, which stays where the library put it. Right, the barrel after Make Library Override, moving with G.](mistake)

A linked object won't move or change, and it's tempting to delete it and append it instead. That loses the link to the source. Make a library override to edit it in this file, or open the source file and change it there.

## Checking your work

Look at the Outliner and the 3D Viewport:

1. The crate has an ordinary object icon and you can edit it.
2. The barrel showed a chain icon before you made the override.
3. After the override, the barrel moves with `G`.
4. File > External Data > Report Missing Files reports nothing.
