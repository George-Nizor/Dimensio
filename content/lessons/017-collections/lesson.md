---
needs: [selecting]
exercise: sort-the-market
watch: [cgcookie-collections, blender-manual-scene-layout-collections-collections]
sources:
  - 'Blender 5.2 Manual, "Collections": Move to Collection (M) and New Collection (https://docs.blender.org/manual/en/5.2/scene_layout/collections/collections.html), read 2026-10-15'
  - Blender 5.2 Manual, "Outliner Interface", restriction toggles, Hide in Viewports and Exclude from View Layer (https://docs.blender.org/manual/en/5.2/editors/outliner/interface.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing Outliner Data", Rename F2 (https://docs.blender.org/manual/en/5.2/editors/outliner/editing.html), read 2026-10-15
  - 'Blender 5.2 Manual, "Show/Hide": H, Shift+H, Alt+H (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/show_hide.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Local View": Numpad / and /, and objects that seem to vanish (https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/local_view.html), read 2026-10-15'
  - Blender 5.2.2, the viewport text " (Local)" in 5.2/datafiles/locale/fr/LC_MESSAGES/blender.mo, checked 2026-10-15
  - Blender 5.2.2, the Outliner's keymap (double click and F2 to rename) and F2 in the 3D Viewport, in 5.2/scripts/presets/keyconfig/keymap_data/blender_default.py, checked 2026-10-15
---

# Collections and the Outliner

A game scene soon holds dozens of objects with names like Cube.014. In this lesson you'll name objects and group them into collections in the Outliner. You'll also hide or isolate them, so you can work on one part without the rest in the way.

![The Outliner of a market scene sorted into collections: Props with barrels, crates and a table top, Lights with the lamps, and Reference with a figure and a pole, hidden by its eye.](example)

## Steps

1. **Rename objects.** Double-click a name in the Outliner, type a new one and press `Enter`. In the 3D Viewport, `F2` renames the active object. A name such as Crate 1 or Barrel 2 tells you what you're clicking.

   ![An Outliner row being renamed: Cube.001 replaced with Crate 1 in the text field.](rename)

2. **Make a collection.** A collection is a group of objects, shown in the Outliner like a folder. Select the objects in the 3D Viewport, press `M` and choose New Collection, then type its name. `M` with an existing collection moves objects into it.

   ![The Move to Collection menu after M, with Scene Collection, Collection and New Collection, and New Collection picked out.](move-menu)

3. **Hide and show.** Click the eye beside an object or collection in the Outliner to hide it in the viewport. In the 3D Viewport, `H` hides the selected objects, `Shift+H` hides everything else and `Alt+H` shows them all again.

   ![Outliner rows with an eye at the right of each. The eye of the Reference collection is closed, and its objects are greyed out.](hide)

4. **Exclude a collection.** Untick the checkbox beside a collection to exclude it from the scene. Its objects disappear from the viewport and the render, and the Outliner stops listing them. Tick it again to bring them back. The eye only hides them in the viewport.

   ![Two collection rows, each with a checkbox at its left. Reference's checkbox is picked out and unticked, and its objects are no longer listed.](exclude)

5. **Work on one object alone.** Select an object and press `Numpad /` for local view. Everything else disappears from this viewport while you work. Press `Numpad /` again to bring the scene back. Without a numpad, use `/`.

   ![Left, the market scene with one barrel selected. Right, local view after Numpad /: the barrel alone, filling the view.](local-view)

## Common mistake

![Left, local view: one barrel alone, and the viewport text reads User Perspective (Local). Right, after Numpad / again: the whole market is back, and the text reads User Perspective.](mistake)

Half the scene has vanished and you didn't hide anything. You probably pressed `Numpad /` by accident, which the Blender manual says happens often. The top left of the viewport then reads User Perspective (Local). Press `Numpad /` again to come back.

## Checking your model

Look at the Outliner when you're done:

1. There are three collections: Props, Lights and Reference.
2. Each collection holds only its own kind of object.
3. Every prop has a name that says what it is.
4. Clicking Reference's eye hides the figure and the pole together.
