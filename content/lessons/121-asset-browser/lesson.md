---
needs: [link-append]
exercise: props-library
watch: [grant-abbitt-asset-browser, ryan-king-asset-import-methods]
sources:
  - Blender 5.2 Manual, "Asset Browser", catalogs, Import Method and refreshing with R (https://docs.blender.org/manual/en/5.2/editors/asset_browser.html), read 2026-10-15
  - Blender 5.2 Manual, "Asset Libraries: Introduction", Mark as Asset and saving the file in the library (https://docs.blender.org/manual/en/5.2/files/asset_libraries/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Asset Catalogs" (https://docs.blender.org/manual/en/5.2/files/asset_libraries/catalogs.html), read 2026-10-15
  - Blender 5.2 Manual, "Preferences: Asset Libraries", Import Method and Include Online Essentials (https://docs.blender.org/manual/en/5.2/editors/preferences/asset_libraries.html), read 2026-10-15
  - Blender 5.2 release notes, "Assets", the Asset Libraries page and online libraries (https://developer.blender.org/docs/release_notes/5.2/assets/), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15, Object > Asset > Mark as Asset, the default User Library at Documents\Blender\Assets with Pack as its import method, and the five import methods
---

# The Asset Browser

Once you've made a few props, you'll want them in every new scene without hunting for the files. The Asset Browser keeps them in one place, with a picture of each, ready to drag in. In this lesson you'll turn your props into assets, file them in a library and use them in another file.

![The Asset Browser showing the My Props library, its Props catalog and the crate, barrel and lamp as pictures.](example)

## Steps

1. **Mark the props as assets.** Open the file with your props, select them and choose Object > Asset > Mark as Asset. An asset is something Blender can list in the Asset Browser and drag into other files. Each one gets a preview picture.

   ![The Object menu with Asset > Mark as Asset picked out.](mark)

2. **Save the file into a library.** An asset library is a folder Blender looks through for assets. Edit > Preferences > Asset Libraries lists the User Library, Documents\Blender\Assets, and + adds a folder of your own. Save your props file into one of them.

   ![Preferences > Asset Libraries with the User Library and a second library, My Props, added with the + button.](library)

3. **Sort them into a catalog.** A catalog is a group of assets. Change an area to the Asset Browser and pick your library at its top left. Click + above the catalog list, name the catalog Props, drag the props onto it and save.

   ![The + button above the catalog list, a new catalog named Props, and the crate being dragged onto it.](catalog)

4. **Choose how assets come in.** The Import Method menu in the Asset Browser's header decides what a dragged asset becomes. Append gives you a copy to edit. Link and Pack bring in a read-only model, and Pack stores it inside your file.

   ![The Import Method menu with Append picked out, and what Link, Append, Append (Reuse Data) and Pack each give.](import-method)

5. **Drag a prop into a scene.** In a new file, open the Asset Browser, pick your library and the Props catalog, and drag a prop into the 3D Viewport.

With Allow Online Access on, Include Online Essentials in the same Preferences page adds Blender's online assets to the Essentials library.

## Common mistake

![Left, props.blend saved in Downloads and an empty library. Right, props.blend saved in the library folder and its props listed.](mistake)

You mark your props, look in your library and find nothing. A library shows only assets from .blend files saved inside its folder. Save the props file there, then press `R` with the mouse over the Asset Browser to refresh it.

## Checking your work

Open a new file and look in the Asset Browser:

1. Your library lists the props under its Props catalog.
2. Each prop has a preview picture.
3. A prop you drag in arrives at its usual size.
4. With Append chosen, `Tab` takes the dropped prop into Edit Mode.
