---
needs: [interface]
exercise: your-startup-file
watch: [skill-brew-preferences, blender-manual-editors-preferences-introduction]
sources:
  - Blender 5.2 Manual, "Preferences: Introduction", Edit > Preferences, Ctrl+Comma, the search field and Auto-Save Preferences (https://docs.blender.org/manual/en/5.2/editors/preferences/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Preferences: Interface", Resolution Scale (https://docs.blender.org/manual/en/5.2/editors/preferences/interface.html), read 2026-10-15
  - Blender 5.2 Manual, "Preferences: Keymap", presets including Industry Compatible (https://docs.blender.org/manual/en/5.2/editors/preferences/keymap.html), read 2026-10-15
  - Blender 5.2 Manual, "Keymap Customization", F5 to F8 kept free (https://docs.blender.org/manual/en/5.2/advanced/keymap_editing.html), read 2026-10-15
  - Blender 5.2 Manual, "Menus", the context menu's Assign Shortcut (https://docs.blender.org/manual/en/5.2/interface/controls/buttons/menus.html), read 2026-10-15
  - Blender 5.2 Manual, "Default Keymap", Q for Quick Favorites (https://docs.blender.org/manual/en/5.2/interface/keymap/blender_default.html), read 2026-10-15
  - Blender 5.2 Manual, "Defaults", the Preferences and the Startup File, File > Defaults > Save Startup File (https://docs.blender.org/manual/en/5.2/getting_started/configuration/defaults.html), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15, the Edit and File > Defaults menus, the Ctrl+Comma and Q keys in the shipped keymap, and the Add to Quick Favorites and Assign Shortcut labels
---

# Preferences and keymap

Blender keeps two kinds of settings. Preferences, such as the size of the interface and your shortcuts, apply everywhere. The startup file holds the scene and layout every new file begins with. In this lesson you'll change both, so Blender opens the way you work.

![The Preferences window on its Interface section, with Resolution Scale set to 1.2.](example)

## Steps

1. **Open the Preferences.** Choose Edit > Preferences, or press `Ctrl+,`. The sections run down the left. Type in the search field above them, such as "numpad", to find a setting by its name.

   ![Edit > Preferences with its shortcut, and the search field with "numpad" typed in.](open)

2. **Fit the interface to your screen.** In Interface > Display, Resolution Scale makes every button and label bigger or smaller, such as 1.2 on a large screen. Themes changes Blender's colours. Preferences save themselves when you close Blender.

3. **Change a shortcut.** Right-click a menu item or button and choose Assign Shortcut, then press the keys you want. The Keymap section lists every shortcut, and you can search it by name or by key. `F5` to `F8` are left free for your own.

   ![Right-clicking Object > Shade Auto Smooth, with Add to Quick Favorites and Assign Shortcut picked out.](context-menu)

4. **Collect Quick Favorites.** Right-click a menu item you use often and choose Add to Quick Favorites. Press `Q` over the 3D Viewport to open the Quick Favorites menu.

   ![Q over the 3D Viewport opening Quick Favorites with Shade Auto Smooth and All Transforms in it.](favorites)

5. **Save your startup file.** Units, overlays and the layout of your workspaces belong to the file, not to the Preferences. Set them up in a new file, then choose File > Defaults > Save Startup File. Every new General file starts that way.

   ![File > Defaults with Save Startup File picked out, above Load Factory Settings.](startup)

The Keymap section also offers the Industry Compatible keymap, which is closer to other 3D apps. This course uses the Blender keymap.

## Common mistake

![Left, a new General file without the Statistics overlay, because the startup file wasn't saved. Right, a new file showing it after Save Startup File.](mistake)

Preferences save themselves, so you might expect units, overlays and layouts to do the same. They belong to each file. Unless you save them with File > Defaults > Save Startup File, every new file starts with Blender's own settings again.

## Checking your work

Choose File > New > General and check:

1. The Statistics overlay shows in the 3D Viewport.
2. Scene properties > Units shows Metric and Meters.
3. `Q` over the 3D Viewport shows your two Quick Favorites.
4. The layout looks the way you left it.

File > Defaults > Load Factory Settings puts everything back as Blender ships it.
