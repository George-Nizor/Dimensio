---
needs: [modifiers, topology]
exercise: window-and-keyhole
watch: [ryan-king-boolean-modifier, blender-manual-modeling-modifiers-generate-booleans]
sources:
  - 'Blender 5.2 Manual, "Boolean Modifier": Difference, Union and Intersect, the Object field, and the Float, Exact and Manifold solvers (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/booleans.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Viewport Display", Display As (https://docs.blender.org/manual/en/5.2/scene_layout/object/properties/display.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Triangulate Faces", Ctrl+T (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/triangulate_faces.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Triangles to Quads", Alt+J (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/triangles_quads.html), read 2026-10-15'
  - 'Blender 5.2.2, checked 2026-10-15: a new Boolean modifier has Operation Difference and Solver Exact; the window cut leaves 2 n-gons, and Ctrl+T then Alt+J on the whole wall leaves 0 n-gons and 0 non-manifold edges; with a cutter exactly as deep as the wall, Exact and Manifold still cut cleanly and Float leaves 8 non-manifold edges'
---

# Boolean

A Boolean cuts one shape out of another, or joins two shapes into one, using a second object as the tool. It puts a window through a wall or a keyhole through a lock without cutting faces by hand. In this lesson you'll cut with the Boolean modifier, keep the cutter out of the way, then apply the cut and tidy the faces it leaves.

![The exercise: a wall with a window cut through it, and a lock with a keyhole.](example)

## Steps

1. **Place a cutter.** Add a cube for the window, scale it to the window's size and move it into place. Make it deeper than the wall, so it comes out of both sides.

   ![The wall with the cutter, a box the size of the window, passing right through it.](cutter)

2. **Add the Boolean modifier.** Select the wall and add Generate > Boolean. Click the Object field and pick the cutter. Operation Difference, the default, cuts the cutter's shape out. Union joins the two shapes, and Intersect keeps only where they overlap.

   ![Two cubes that overlap at one corner, combined three ways: Difference takes a bite out of the first, Union joins them, Intersect leaves the overlap.](operations)

3. **Hide the cutter.** Select the cutter, and in Object properties > Viewport Display set Display As to Wire. The window shows through it. You can still move the cutter, and the window moves with it.

   ![The wall with the window cut through it and the cutter drawn as a wire frame.](hide)

4. **Choose a solver.** Exact, the default, copes with faces that touch or overlap, but it's the slowest. Float is faster and fails where faces overlap. Manifold is usually the fastest, but it needs both meshes closed, with no holes.

5. **Apply and tidy.** Apply the modifier and delete the cutter. The cut leaves n-gons round the hole. In Edit Mode, select everything, press `Ctrl+T` to triangulate, then `Alt+J` to join the triangles back into quads where they fit.

   ![The wall's front. Left, as the Boolean leaves it: a quad and an 8-sided n-gon round the window. Right, after Ctrl+T then Alt+J: two quads and four triangles.](tidy)

## Common mistake

![Left, the cutter still drawn solid, filling the window, so the wall looks uncut. Right, the cutter drawn as wire, and the window shows.](mistake)

After adding the modifier, the wall can look as if nothing happened. The cut is there, but the cutter is still drawn solid and fills the hole exactly. Set the cutter's Display As to Wire, or hide it with `H`, and the window appears.

## Checking your model

Look at the wall and the lock from the front and check:

1. You can see through the window and the keyhole.
2. No cutters are left in the scene.
3. Select > Select All by Trait > Faces by Sides, Greater Than 4, selects nothing.
4. Neither object has a Boolean modifier left: you applied them.
