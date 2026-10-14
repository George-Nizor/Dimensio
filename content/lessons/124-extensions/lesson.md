---
needs: [interface]
exercise: install-and-enable
watch: [cg-essentials-extensions, blender-manual-editors-preferences-extensions]
sources:
  - Blender 5.2 Manual, "Get Extensions", installing, Install from Disk, updating and disabling (https://docs.blender.org/manual/en/5.2/editors/preferences/extensions.html), read 2026-10-15
  - Blender 5.2 Manual, "Add-ons", enabling and disabling (https://docs.blender.org/manual/en/5.2/editors/preferences/addons.html), read 2026-10-15
  - Blender 5.2 Manual, "System", Network > Allow Online Access (https://docs.blender.org/manual/en/5.2/editors/preferences/system.html), read 2026-10-15
  - Blender 5.2 Manual, "Add-ons" index, the add-ons that ship with Blender (https://docs.blender.org/manual/en/5.2/addons/index.html), read 2026-10-15
  - Blender Extensions, "Extra Mesh Objects" 0.4.1, its menu entries under Add > Mesh (https://extensions.blender.org/add-ons/extra-mesh-objects/), read 2026-10-15
  - Blender 4.2 release notes, most add-ons that shipped with Blender moved to the Extensions Platform (https://developer.blender.org/docs/release_notes/4.2/), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15 with a separate user folder, the Online Extensions box, the Extension Settings menu, Extra Mesh Objects installed from disk and turned on at once, its Rock Generator, and Node Wrangler turned on in Add-ons
---

# Extensions and add-ons

Add-ons give Blender new tools, such as more shapes to add or a rigging system. Blender ships with a few, and many more are free on extensions.blender.org, which Blender can search for you. In this lesson you'll install an extension, turn on an add-on that comes with Blender, and keep them up to date.

![Preferences > Get Extensions with "extra mesh" searched for and Extra Mesh Objects listed with an Install button.](example)

## Steps

1. **Allow online access.** Open Edit > Preferences and choose Get Extensions. Blender goes online only when you let it: click Allow Online Access. You can change this later in System > Network.

   ![The Online Extensions box with its Continue Offline and Allow Online Access buttons.](online)

2. **Install an extension.** An extension is an add-on or theme from extensions.blender.org. Type its name in the search field, such as Extra Mesh Objects, and click Install. It's turned on as soon as it's installed.

   ![Add > Mesh after installing Extra Mesh Objects, with Round Cube and the Extras submenu's Rock Generator picked out.](add-mesh)

3. **Install from a file.** For a .zip you downloaded, open the menu at the top right of Get Extensions and choose Install from Disk. You can also drag the .zip into Blender's window.

4. **Turn on an add-on that comes with Blender.** The Add-ons section lists what you've installed and the core add-ons, such as Node Wrangler, Rigify and glTF 2.0 format. Tick a box to turn an add-on on, and untick it to turn it off.

   ![Preferences > Add-ons with Node Wrangler ticked among the FBX, glTF and Rigify add-ons.](addons)

5. **Keep them up to date.** In the menu at the top right of Get Extensions, choose Refresh Remote to look for updates, then Install Available Updates. To stop using an extension for a while, untick it rather than uninstalling it.

   ![The Extension Settings menu with Refresh Remote, Install Available Updates and Install from Disk picked out.](disk)

The CG Essentials video shows the extensions platform as it arrived in Blender 4.2.

## Common mistake

![Left, the Add-ons list searched for looptools with nothing found. Right, Get Extensions finding LoopTools with an Install button.](mistake)

Older tutorials tell you to tick an add-on such as LoopTools in the Add-ons list, and it isn't there. Since Blender 4.2, most of those add-ons come from extensions.blender.org. Search Get Extensions for it instead.

## Checking your work

Look in the Preferences and the 3D Viewport:

1. Get Extensions shows Extra Mesh Objects as installed.
2. Add > Mesh has Round Cube and an Extras submenu.
3. Node Wrangler has a tick in the Add-ons section.
4. Both are still on after you close and reopen Blender.
