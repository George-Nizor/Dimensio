---
needs: [modifiers, bevel, apply-transforms]
exercise: bevel-a-table
watch: [ryan-king-bevel-problems, blender-manual-modeling-modifiers-generate-bevel]
sources:
  - 'Blender 5.2 Manual, "Bevel Modifier": Amount, Segments, Limit Method (None, Angle, Weight), Clamp Overlap and Harden Normals (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/bevel.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Edge Data", Edge Bevel Weight (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/edge_data.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Apply", Ctrl+A > Scale (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/apply.html), read 2026-10-15'
  - 'Ryan King Art, "How to Fix Common Bevel Modifier Problems in Blender", the chapter Apply the Scale (https://www.youtube.com/watch?v=kewi6MSXYm0), read 2026-10-15'
  - 'Blender 5.2.2, checked 2026-10-15: a new Bevel modifier has Amount 0.1 m, Segments 1, Limit Method Angle at 30 degrees and Clamp Overlap on; the exercise table measures 540 triangles with 2 segments'
---

# The Bevel modifier

The edges of real objects are rarely perfectly sharp, and a narrow bevel catches the light along each one. The Bevel modifier bevels every edge of an object at once and stays adjustable. In this lesson you'll set its width and segments, limit it to the sharp edges, and keep it even by applying scale first.

![The exercise's table: a top and four legs with a narrow bevel along every edge.](example)

## Steps

1. **Check the scale.** Press `N` to open the Sidebar and look at Scale in the Item tab. It should read 1, 1, 1. If it doesn't, press `Ctrl+A` > Scale in Object Mode before you add the modifier.

2. **Add Bevel and set Amount.** Add Generate > Bevel. Amount is how far each new edge sits from the old corner: type 0.01 for 1 cm. Clamp Overlap, on by default, stops a wide bevel running into the next edge.

   ![One edge seen end on: the bevel face cutting the corner off, with Amount measured from the old corner along the face.](amount)

3. **Choose the segments.** Segments sets how many faces run across each bevel. With 1 the corner is a flat cut, and 2 or 3 round it off. Each extra segment adds faces along every edge, so low-poly models use 1 or 2.

   ![The same corner with 1, 2 and 3 segments, from a flat cut to a rounder curve.](segments)

4. **Limit it to sharp edges.** Limit Method Angle, the default, bevels only edges where the surface turns more than 30°. A cylinder's rims get a bevel and its sides don't. Limit Method Weight bevels only edges you weight with Edge > Edge Bevel Weight.

   ![Two 16-sided cylinders. With Limit Method Angle, the modifier bevels the rims and leaves the edges down the sides alone.](angle)

5. **Harden the normals.** If you shade the model smooth, tick Harden Normals under Shading. The flat faces then look flat, and only the bevel faces shade round.

## Common mistake

![Left, a shelf scaled in Object Mode: the bevel is wide at the ends and thin along the long edges. Right, the scale applied first: the bevel is the same width all round.](mistake)

If the bevel is wide at the ends and thin along the sides, the object has a scale you haven't applied. The modifier works on the mesh before the scale, so the scale stretches the bevel too. Press `Ctrl+A` > Scale and the bevel evens out.

## Checking your model

Select the table and check:

1. Scale reads 1, 1, 1 in the Sidebar's Item tab.
2. The Bevel modifier shows Amount 0.01 m and Segments 2.
3. Every edge of the top and the legs has the same narrow bevel.
4. The Statistics overlay shows under 600 triangles in Object Mode.
