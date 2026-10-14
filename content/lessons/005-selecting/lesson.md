---
needs: [navigation]
exercise: select-in-the-yard
watch: [cgcookie-select-objects, blender-manual-scene-layout-object-selecting]
sources:
  - Blender 5.2 Manual, "Selecting", clicking with the Toolbar tools, Shift to add or remove, Select Box with Shift and Ctrl, Lasso Select with Ctrl and a right drag, Select Lasso and origins in Object Mode, the Outliner's Ctrl-click (https://docs.blender.org/manual/en/5.2/interface/selecting.html), read 2026-10-15
  - Blender 5.2 Manual, "Selecting Objects", the active object, Shift-click to make another object active, Select All, None and Invert (https://docs.blender.org/manual/en/5.2/scene_layout/object/selecting.html), read 2026-10-15
  - Blender 5.2 Manual, "Object Origin", the dot that marks an object's origin (https://docs.blender.org/manual/en/5.2/scene_layout/object/origin.html), read 2026-10-15
  - Blender 5.2 Manual, "Viewport Overlays", Statistics, selected objects and the total (https://docs.blender.org/manual/en/5.2/editors/3dview/display/overlays.html), read 2026-10-15
  - Blender 5.2.2 default keymap, Outliner, Ctrl-click extends the selection and Shift-click selects the range between (5.2/scripts/presets/keyconfig/keymap_data/blender_default.py), checked 2026-10-15
  - CG Cookie, "How to Select Objects in Blender, Every Selection Tool Explained" (https://www.youtube.com/watch?v=zkupB5S3sUQ), read 2026-10-15
---

# Selecting objects

Almost every command in Object Mode works on the objects you have selected. In this lesson you'll select objects by clicking, with a box and with a lasso, and by name in the Outliner. You'll also learn which object is the active one, the one many commands treat as the main object.

![A yard of barrels and crates seen from above. Three are selected with orange outlines, and the active one is filled in as well.](example)

## Steps

1. **Click to select.** Left click an object to select it. Blender draws an orange outline round it and deselects everything else. Click empty space to deselect everything.

   ![Left, the mouse clicking a barrel, which gets an orange outline. Right, a click on empty space, and nothing is selected.](click)

2. **Add with Shift.** Hold `Shift` and click another object to add it to the selection. The last object you clicked is the active object, drawn with a lighter outline. Commands that copy something from one object to others copy it from the active one.

   ![Three selected objects with orange outlines. The last one clicked with Shift, the active object, is filled in as well.](active)

3. **Drag a box.** With the Select Box tool, which Blender starts with, drag across empty space. Blender selects everything the box touches. Hold `Shift` while you drag to add to the selection, or `Ctrl` to take objects out of it.

   ![A box dragged across part of the yard. The objects it touches are selected, the others are not.](box)

4. **Draw a lasso.** Hold `Ctrl` and drag with the right mouse button to draw round objects and add them to the selection. In Object Mode the lasso only counts each object's origin, the small dot at its middle, so draw round the dots.

   ![A lasso drawn round the dots at the middle of three barrels, which are selected. A crate whose edge is inside the lasso but whose dot is outside is not selected.](lasso)

5. **Select all, none or the rest.** Press `A` to select everything and `Alt+A` to select nothing. `Ctrl+I` inverts the selection: it deselects what you had selected and selects everything else.

   ![Left, two crates selected among five objects. Right, after Ctrl+I, the other three are selected instead.](invert)

6. **Pick names in the Outliner.** Click a name in the Outliner to select that object. `Ctrl` and click adds a name. `Shift` and click selects every name up to the one you clicked last. Names are in alphabetical order, so the barrels sit together.

   ![The Outliner with Barrel 1 clicked and Barrel 6 Shift-clicked, and all six barrel names between them picked out.](outliner)

## Common mistake

![Left, a Shift-click on a selected crate that isn't active: it stays selected and becomes the active object. Right, a second Shift-click on the same crate: it is deselected.](mistake)

A Shift-click on a selected object doesn't always take it out of the selection. If the object wasn't the active one, the first Shift-click makes it active instead. Shift-click it again to deselect it, or drag a box over it with `Ctrl` held.

## Checking your work

Open the Overlays menu in the viewport header and turn on Statistics. Then check each round of the exercise:

1. All six barrels read Objects 6 / 33.
2. With the barrels selected, the Properties editor's Object tab shows Barrel 1.
3. Every crate but Crate 4 reads Objects 7 / 33.
4. Everything but the posts reads Objects 25 / 33.

The count includes the camera and the light, which `A` selects too. You can't select the ground.
