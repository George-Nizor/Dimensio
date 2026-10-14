---
needs: [navigation, parenting]
exercise: sword-references
watch: [ryan-king-background-images, blender-manual-modeling-empties]
sources:
  - 'Blender 5.2 Manual, "Empties", Image: Size, Offset, Depth, Show In Orthographic and Perspective, Only Axis Aligned, Opacity (https://docs.blender.org/manual/en/5.2/modeling/empties.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Mesh Plane", Add > Image > Mesh Plane (https://docs.blender.org/manual/en/5.2/modeling/meshes/import_images_as_planes.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Viewpoint", Numpad 1 and Numpad 3 (https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/viewpoint.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Shading", X-Ray, Alt+Z (https://docs.blender.org/manual/en/5.2/editors/3dview/display/shading.html), read 2026-10-15'
  - 'Blender 5.2 source, object_add.cc, OBJECT_OT_empty_image_add: from the menu the picture is aligned to the view, placed at the 3D cursor, with Size 5 m (https://projects.blender.org/blender/blender/raw/branch/blender-v5.2-release/source/blender/editors/object/object_add.cc), read 2026-10-15'
  - 'Blender 5.2.2, checked 2026-10-15: Add > Image lists Reference, Background, Mesh Plane and Empty Image; the Empty panel labels are Size, Offset X and Y, Depth, Side, Show In and Opacity; Offset Y 0 puts the picture''s bottom edge on the origin'
  - 'Kenney, Mini Dungeon, the sword the pictures are rendered from, CC0 (https://kenney.nl/assets/mini-dungeon), read 2026-10-15'
---

# Reference images

With a front picture and a side picture lined up in Blender, you can match a model's outline in both views instead of guessing its proportions. In this lesson you'll add two pictures of a sword, size them to 1 m, and set them up so they stay out of your way.

![The front and side pictures of the sword standing at right angles on the ground, with a box blocked out over the blade.](example)

## Steps

1. **Add the front picture.** Press `Numpad 1` for the front view. Choose Add > Image > Reference and pick sword-front.png, in the same folder as the exercise file. The picture comes in facing you, centred on the 3D cursor.

   ![The front view right after adding the picture: it faces the view, centred on the 3D cursor, half of it below the ground line.](add)

2. **Size it and stand it up.** In the Properties editor's Object Data tab, set Size to 1 m, the picture's longer side. Set Offset Y to 0 so its bottom edge sits on the ground.

   ![The front picture 1 m tall, its bottom edge on the ground line.](size)

3. **Add the side picture.** Press `Numpad 3` for the right view and add sword-side.png the same way, with the same Size and Offset. The sword is now 1 m tall in both pictures.

   ![The front picture in the front view and the side picture in the right view, side by side, the tips level.](side)

4. **Keep them out of the way.** Set Depth to Back, so your model draws in front of the picture. Under Show In, untick Perspective and tick Only Axis Aligned. Tick Opacity and set it to 0.5.

   ![The Empty panel with Size 1 m, Offset Y 0, Depth Back, Orthographic and Only Axis Aligned ticked, Perspective unticked, and Opacity 0.5.](settings)

5. **Block out over them.** Scale the cube to the blade in the front view, then in the right view. Press `Alt+Z` for X-ray when the cube hides the picture behind it.

   ![The cube scaled to the blade over the front picture and over the side picture.](block)

A reference picture is an empty, so it never renders. Add > Image > Mesh Plane puts a picture on a real plane with a material instead.

## Common mistake

![Front and side pictures with a line through the blade's tip. Left, the side picture smaller, its tip below the line. Right, the same Size and Offset, and both tips on the line.](mistake)

Setting each picture's size by eye leaves them slightly different, so the blade ends at a different height in each view and the model can't match both. Give both pictures the same Size and Offset Y, then check that the tip sits at the same height in each view.

## Checking your model

Look at the front view, the right view and a view from an angle:

1. Both pictures show the sword 1 m tall, standing on the ground.
2. Each picture shows only in its own view.
3. The tip of the blade sits at the same height in both views.
4. The cube matches the blade in the front and the right view.
