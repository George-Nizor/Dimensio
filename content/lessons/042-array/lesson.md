---
needs: [modifiers, apply-transforms]
exercise: fence-and-ring
watch: [grant-abbitt-new-array, blender-manual-modeling-modifiers-generate-array]
sources:
  - 'Blender 5.2 Manual, "Array Modifier": Shape, Count, Offset Method, Radius, Align Rotation, Realize Instances and Merge (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/array.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Array (Legacy) Modifier": Relative Offset and Caps (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/array_legacy.html), read 2026-10-15'
  - 'Blender 5.0 release notes, Modeling: the node-based Array modifier (https://developer.blender.org/docs/release_notes/5.0/modeling/), read 2026-10-15'
  - 'Grant Abbitt, "Blender 5''s New Array Modifier: Create Random and Circle Arrays", the Circle shape (https://www.youtube.com/watch?v=_73-3mq0HI4), read 2026-10-15'
  - 'Blender 5.2.2, checked 2026-10-15: Generate lists Array and then Array (Legacy); a new Array has Shape Line, Count 3, Offset Method Relative with Offset X 1, Radius 0, Align Rotation on and Realize Instances on; with Radius 0 every copy sits on the origin; the exercise fence and ring measure 360 triangles with 1-subdivision Ico Spheres'
---

# Array

Fences, stairs, chains and rings of stones are one piece repeated. The Array modifier makes the copies for you, and when you change the piece, every copy changes with it. In this lesson you'll repeat an object along a line with even gaps and round a circle, using the Array modifier that arrived in Blender 5.0.

![The exercise: a fence of ten planks made from one plank, and a ring of twelve stones made from one stone.](example)

## Steps

1. **Add Array.** Select the plank and add Generate > Array. It starts as three planks in a line along X, each touching the last. Count is the number of pieces in the row, the original included.

   ![One plank, then the plank with an Array modifier at Shape Line and Count 3: three planks side by side.](add)

2. **Space them out.** With Offset Method Relative, Offset X moves each copy by the object's own width: 1 puts them edge to edge, and 1.5 leaves gaps half a plank wide. Offset Method Offset moves each copy by a fixed distance instead.

   ![Four planks from the front. Offset X 1 puts them edge to edge. Offset X 1.5 leaves gaps half a plank wide.](spacing)

3. **Make a ring.** Set Shape to Circle and type a Radius. The copies spread round the object's origin, and Align Rotation, on by default, turns each one to follow the circle.

   ![Twelve stones from above, spread round the origin at the Radius, each turned to follow the circle.](ring)

4. **Merge copies that touch.** For copies that touch and should be one piece, such as the sections of a rail, open the Merge panel and tick Merge. It joins vertices closer than Merge Distance. It needs Realize Instances, which is on by default.

5. **Know the legacy Array.** Tutorials from before Blender 5.0 show the older modifier, which is now Generate > Array (Legacy). Its Relative Offset Factor X works like Offset X here, and it can put a different object at each end of the row.

## Common mistake

![Shape Circle from above. Left, Radius 0: all twelve stones in one clump on the origin. Right, Radius 1 m: a ring.](mistake)

Switching Shape to Circle seems to do nothing, because Radius starts at 0. Every copy sits on the origin, turned a little more than the last, so you see one lumpy stone. Type a Radius, such as 1 m, and the copies spread into a ring.

## Checking your model

Look at both arrays from above and from the front:

1. The fence has ten planks with even gaps between them.
2. The ring has twelve stones, evenly spaced round the circle.
3. In Edit Mode, each object is still one plank or one stone.
4. Moving a vertex of the plank in Edit Mode moves it on every plank.
