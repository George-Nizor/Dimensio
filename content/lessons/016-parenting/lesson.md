---
needs: [origins]
exercise: parent-the-car
watch: [ryan-king-parenting, cgcookie-orientations]
sources:
  - 'Blender 5.2 Manual, "Parenting Objects": Ctrl+P, select the parent last, Object parent, Alt+P, Clear Parent and Clear and Keep Transformation (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/parent.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Empties": display types, an empty as a parent for a group of objects (https://docs.blender.org/manual/en/5.2/modeling/empties.html), read 2026-10-15'
  - Blender 5.2 Manual, "Outliner Usage", parenting by drag and drop (https://docs.blender.org/manual/en/5.2/editors/outliner/usage.html), read 2026-10-15
  - Blender 5.2.2, Ctrl+P and Alt+P in 5.2/scripts/presets/keyconfig/keymap_data/blender_default.py, and the Clear Parent menu items, checked 2026-10-15
  - Ryan King Art, "Understanding Parenting in Blender" (https://www.youtube.com/watch?v=5oclP4hQndc), checked 2026-10-15
---

# Parenting and empties

A car is a body and four wheels, and when the car drives off, the wheels should go with it. In this lesson you'll make one object the parent of others, so its children move with it. You'll also add an empty, an object with no mesh, and use it as a handle for the whole car.

![A block car with an empty under it. Beside it, the Outliner shows the empty Car holding Body, and Body holding the cabin and four wheels.](example)

## Steps

1. **Select the children, then the parent.** Click a wheel and `Shift`+click the other wheels and the cabin. Click the body last. The object you click last is the active one, and it becomes the parent.

   ![The car with the wheels and the cabin selected first, numbered 1 to 5, and the body clicked last as number 6, the active object.](select-order)

2. **Make the parent.** Press `Ctrl+P` and choose Object. Nothing moves, but in the Outliner the wheels and cabin now sit under the body. Move the body with `G` and they go with it. Move a wheel and the body stays put.

   ![The Set Parent To menu with Object picked out, and the Outliner after it: Body with the cabin and four wheels indented under it.](set-parent)

3. **Turn a child on its own.** Each child keeps its own origin. Select one wheel and press `R` `X` `90`: it spins on its axle, around its own origin, and nothing else moves.

   ![The front wheel close up from the side, before and after R X 90: a marked face has turned a quarter round the wheel's own origin, and the body has not moved.](wheel-spin)

4. **Add an empty.** An empty is a single point with no mesh. It never renders, but you can move it, turn it and parent things to it. Press `Shift+A` and choose Empty > Plain Axes to add one at the 3D cursor.

   ![The Empty menu with Plain Axes picked out, and the empty it adds on the ground under the car: six short lines along X, Y and Z.](empty)

5. **Parent to the empty.** Select the body, then the empty, and press `Ctrl+P` > Object. Now move the empty: the body follows, and the wheels and cabin follow the body.

   ![The empty moved 6 m along Y with an arrow, and the whole car moved with it.](drive)

6. **Clear a parent.** Select a child and press `Alt+P`. Clear Parent drops what the parent did to it, so it may jump. Clear and Keep Transformation leaves it where it is. You can also parent by dragging one object onto another in the Outliner.

## Common mistake

![Left, the body selected first and a wheel last: in the Outliner the body sits under the wheel. Right, the wheel selected first and the body last: the wheel sits under the body.](mistake)

The parent is the object you select last. Click the body first and a wheel last, and the body becomes the wheel's child, so moving the wheel drags the car away. Press `Alt+P` > Clear Parent, then select again with the body last.

## Checking your model

Look at the Outliner, then move a few parts:

1. Car, the empty, holds Body, and Body holds the cabin and four wheels.
2. Moving the empty moves the whole car.
3. Turning one wheel spins it on its axle and moves nothing else.
4. Moving a wheel on its own leaves the body where it is.
