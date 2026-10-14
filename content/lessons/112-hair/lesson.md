---
needs: [sculpt-mode]
exercise: grass-and-beard
watch: [bradley-animation-hair-curves, blender-hair-assets]
sources:
  - Blender 5.2 Manual, "Curve Primitives", Empty Hair (https://docs.blender.org/manual/en/5.2/modeling/curves_new/primitives.html), read 2026-10-15
  - 'Blender 5.2 Manual, "Curves Sculpting: Introduction" (https://docs.blender.org/manual/en/5.2/sculpt_paint/curves_sculpting/introduction.html), read 2026-10-15'
  - Blender 5.2 Manual, "Curves Sculpting Brushes", Add Curves, Density, Comb Curves, Grow / Shrink Curves and Delete Curves (https://docs.blender.org/manual/en/5.2/sculpt_paint/curves_sculpting/brushes/index.html), read 2026-10-15
  - Blender 5.2 Manual, "Hair Nodes" (https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/hair/index.html), read 2026-10-15
  - Blender 5.2 release notes, Physics, Hair Dynamics (https://developer.blender.org/docs/release_notes/5.2/physics/), read 2026-10-15
  - Blender 5.2.2, Add > Curves > Empty Hair on a selected mesh (the Curves object gets the mesh as Surface and a Hair Dynamics modifier with Mode Animation), the brush names in the Essentials library (essentials_brushes-curve_sculpt.blend), the Add brush's Count and Curve Shape settings, Ctrl to invert a brush, and the Hair catalog in Add Modifier, checked 2026-10-15
  - Bradley Animation, "[Tut] New Hair Curves - Blender 5.0 Geometry Nodes Beginner" (https://www.youtube.com/watch?v=FMWw6XEcY4Y), read 2026-10-15
---

# Hair curves

Blender grows hair, fur and grass as a Curves object, a set of strands you style with brushes. In this lesson you'll add hair to a surface, plant strands where you want them, then comb and trim them. You'll grow grass on a tile and a beard on a head.

![Left, a ground tile with grass tufts growing from it. Right, a head seen from the side with a beard along its jaw.](example)

## Steps

1. **Add empty hair.** Select the mesh the hair grows from, such as a ground tile, and choose Add > Curves > Empty Hair. The new Curves object takes that mesh as its Surface and becomes its child. It has no strands yet.

   ![Add, Curves, Empty Hair, with the Outliner showing a Curves object under the tile and the Surface panel naming the tile.](empty-hair)

2. **Switch to Sculpt Mode.** With the Curves object selected, choose Sculpt Mode from the mode menu at the left of the 3D Viewport's header. Its brushes sit in the asset shelf along the bottom of the viewport.

   ![The 3D Viewport header's mode menu set to Sculpt Mode, and the asset shelf with the Add, Density, Comb, Grow/Shrink, Delete and Smooth brushes.](sculpt-mode)

3. **Plant strands.** Choose the Add brush. In the header, set Count to 10, and under Curve Shape set Length to 0.15 m. Click on the tile to plant a tuft. The Density brush fills a whole area with evenly spaced strands instead.

   ![Two grass tufts on a tile and a third being planted under the Add brush's circle, beside Count 10 and Length 0.15 m.](add-curves)

4. **Comb them.** Choose the Comb brush and drag across the strands the way they should lie. Comb keeps each strand's length, so the hair bends rather than stretches. Hold `Shift` while you drag to smooth instead.

   ![Upright tufts before combing, and the same tufts bent the way the arrow drags after the Comb brush.](comb)

5. **Trim them.** Choose the Grow/Shrink brush and hold `Ctrl` as you drag to shorten the strands under it. Without `Ctrl` it grows them. The Delete brush removes whole strands.

   ![Long tufts, then the same tufts shorter after the Grow/Shrink brush with Ctrl held.](trim)

Empty Hair also adds a Hair Dynamics modifier, which is experimental in Blender 5.2. Leave its Mode on Animation. More hair node groups, such as Frizz Hair Curves, are in Add Modifier > Hair.

## Common mistake

![Left, Empty Hair added with nothing selected: Surface none, and the Add brush plants nothing. Right, the tile selected first: Surface Tile, and a tuft planted.](mistake)

The Add brush needs a surface to plant on. If you had nothing selected when you chose Empty Hair, the Curves object has no Surface, and clicking plants nothing. Set Surface in the Curves object's Object Data tab, or select the mesh and add the hair again.

## Checking your model

Look at the hair from the front and side views:

1. Every strand grows from the surface, with none floating free.
2. The tufts lean the way you combed them.
3. The beard covers the jaw and stops below the mouth.
4. Strands are short enough not to pass through the tile or head.
