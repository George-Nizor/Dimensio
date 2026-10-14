---
needs: []
exercise: install-and-set-up
watch: [grant-abbitt-interface, blender-manual-getting-started-installing-windows]
sources:
  - Blender, "LTS" (https://www.blender.org/download/lts/), read 2026-10-15
  - Blender 5.2 Manual, "Installing on Windows" (https://docs.blender.org/manual/en/5.2/getting_started/installing/windows.html), read 2026-10-15
  - Blender 5.2 Manual, "Installing from Steam" (https://docs.blender.org/manual/en/5.2/getting_started/installing/steam.html), read 2026-10-15
  - Blender 5.2 Manual, "Splash Screen" (https://docs.blender.org/manual/en/5.2/interface/window_system/splash.html), read 2026-10-15
  - Blender 5.2 Manual, "Defaults" (https://docs.blender.org/manual/en/5.2/getting_started/configuration/defaults.html), read 2026-10-15
  - Blender 5.2 Manual, "Keymap Preferences", Select with Mouse Button (https://docs.blender.org/manual/en/5.2/editors/preferences/keymap.html), read 2026-10-15
---

# Installing Blender

Every lesson in this course happens in Blender, so the first job is to install it and set it up the way the lessons expect. In this lesson you'll install Blender 5.2 LTS, choose your first settings on the splash screen, and tell Dimensio where Blender is.

![The Blender window as it first opens: the splash screen in the middle, with the default scene behind it.](example)

## Steps

1. **Download 5.2 LTS.** Get Blender 5.2 LTS from blender.org/download, or from Steam. LTS means long-term support: Blender fixes serious bugs in that version for two years, so what you learn here stays right.

2. **Install it.** The Windows installer adds Blender to the Start menu and opens .blend files with it. The zip version needs no administrator rights but does neither. Steam installs Blender from its Store tab and keeps it updated for you.

3. **Choose your settings.** The first time Blender opens, the splash screen asks for a few settings. Keep the Blender keymap and Mouse Select on Left, set Spacebar Action to Play, then click Save New Preferences.

   ![The first settings on the splash screen: Keymap set to Blender, Mouse Select set to Left and Spacebar Action set to Play, above the Save New Preferences button.](quick-setup)

4. **Check the version, then close.** The version is in the top right corner of the splash picture, and it should start with 5.2. Click anywhere outside the splash screen, or press `Esc`, to close it.

   ![The splash screen with the version number in the top right corner of its picture picked out.](version)

5. **Point Dimensio at Blender.** Open Settings in Dimensio. If it says Blender wasn't found, choose blender.exe in the folder Blender installed to. Dimensio uses it to open exercises and to measure your models.

## Common mistake

![Left, Mouse Select set to Right, as some older tutorials use it. Right, Mouse Select set to Left, Blender's default.](mistake)

Some older tutorials select with the right mouse button, and it's tempting to copy them. Blender selects with the left button by default, and every lesson here assumes it. If you changed it, set it back in Edit > Preferences > Keymap, under Select with Mouse Button.

## Checking your work

Look at Blender and at Dimensio:

1. The splash picture shows a version starting with 5.2.
2. Mouse Select is Left in Edit > Preferences > Keymap.
3. Dimensio's Settings shows Blender 5.2 as found.

If Blender shows errors when it starts after you imported settings from an older version, choose File > Defaults > Load Factory Settings.
