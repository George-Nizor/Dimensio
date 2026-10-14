---
needs: [units, snapping, origins, apply-transforms, collections]
exercise: house-blockout
watch: [sean-oskea-blockouts, blender-manual-editors-3dview-controls-snapping]
sources:
  - 'Blender 5.2 Manual, "Snapping": Shift+Tab, holding Ctrl, Snap Base, Snap Target Vertex (https://docs.blender.org/manual/en/5.2/editors/3dview/controls/snapping.html), read 2026-10-15'
  - Blender 5.2 Manual, "Transform" properties, Dimensions (https://docs.blender.org/manual/en/5.2/scene_layout/object/properties/transforms.html), read 2026-10-15
  - Blender 5.2 Manual, "Object Origin", Set Origin (https://docs.blender.org/manual/en/5.2/scene_layout/object/origin.html), read 2026-10-15
  - Blender 5.2 Manual, "Apply" (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/apply.html), read 2026-10-15
  - Blender 5.2 Manual, "Collections", Move to Collection (https://docs.blender.org/manual/en/5.2/scene_layout/collections/collections.html), read 2026-10-15
  - Blender 5.2.2, the house as these steps build it, measured with blender/dimensio_check.py (8 parts, 96 triangles, every part at Scale 1), checked 2026-10-15
  - Sean O'Skea, "Blockouts in Blender for Absolute Beginners" (https://www.youtube.com/watch?v=Voev2rv4DOs), checked 2026-10-15
---

# A house block-out

A block-out is a rough model built from simple boxes at real size, to test sizes and proportions before any detail goes on. In this lesson you'll block out a one-room house on a 6 m plot. It uses the whole of this part: sizes, snapping, origins, applied scale and collections.

![A block-out of a one-room house on a square plot: a floor, four walls with a doorway at the front, and a roof with two slopes. A 1.8 m figure stands on the path in front of it.](example)

## Steps

1. **Lay the floor.** Add a cube and set its Dimensions in the Sidebar to 5, 4 and 0.2 m. Apply its scale with `Ctrl+A` > Scale, put its origin at the middle of its base, and move it to the plot's centre.

   ![The floor on the plot, seen from above, with its 5 m and 4 m sides measured.](floor)

2. **Raise the walls.** Make the back wall the same way, 5 by 0.2 by 2.5 m. Make the side walls 0.2 by 3.6 by 2.5 m, to fit between the front and back walls. Apply each one's scale and put its origin at its base.

   ![The floor with the back wall and two side walls standing on it: the walls 2.5 m high and the side walls 3.6 m long.](walls)

3. **Snap them together.** In the header's Snapping menu, set Snap Target to Vertex. Move a wall with `G` and hold `Ctrl`: its nearest corner jumps onto the corner under the mouse. Snap each wall onto a corner of the floor or of the next wall.

   ![Top view of one corner: a side wall moving towards the back wall, its corner snapping onto the back wall's corner.](snap)

4. **Leave a door gap.** Build the front wall from three boxes. Two pieces 2.05 m long stand 0.9 m apart, and a lintel, the beam over the door, 0.9 by 0.2 by 0.4 m, sits across the top. That leaves a doorway 2.1 m high.

   ![The front wall from the front: two wall pieces, a 0.9 m gap between them and a lintel across its top, the doorway 2.1 m high beside the 1.8 m figure.](door)

5. **Put a roof on.** Add a cube 4.8 by 3.1 by 3.1 m, to fit inside the side walls. Turn it with `R` `X` `45` and move its middle to the top of the walls, 2.7 m up. Its top half is the roof.

   ![The house from the side: a square box turned 45 degrees with its middle on the top of the walls. Its top half stands above the walls as the roof; its bottom half, dashed, sits inside the house.](roof)

6. **Tidy up.** Apply Rotation & Scale to every part, so each reads Scale 1. Name the parts with `F2`, such as Floor, Back wall and Roof. Then select them all, press `M`, choose New Collection and call it House.

## Common mistake

![Top view of a corner. Left, walls placed by eye with a gap between them. Right, walls snapped corner to corner, meeting exactly.](mistake)

Walls placed by eye look joined from one side and show a gap or an overlap from another. Snap each wall into place by a corner instead. Then look down from the top (`Numpad 7`) and check every corner.

## Checking your model

Look at the house from the front (`Numpad 1`) and from the top (`Numpad 7`):

1. The walls are 2.5 m high and 0.2 m thick.
2. The doorway is 0.9 m wide and 2.1 m high, facing the path.
3. The corners meet with no gaps in the top view.
4. Every part reads Scale 1 and sits in the House collection.
