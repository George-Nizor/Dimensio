---
needs: [modifiers, loop-cuts, array]
exercise: twist-bend-sag
watch: [ryan-king-simple-deform, grant-abbitt-array-curve]
sources:
  - 'Blender 5.2 Manual, "Simple Deform Modifier": Twist and Bend, Angle, Axis, Origin, Limits, and that it measures from the object''s origin (https://docs.blender.org/manual/en/5.2/modeling/modifiers/deform/simple_deform.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Lattice Modifier" (https://docs.blender.org/manual/en/5.2/modeling/modifiers/deform/lattice.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Lattice": points and Usage (https://docs.blender.org/manual/en/5.2/animation/lattice.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Curve Modifier": Curve Object, Deformation Axis, and keeping the mesh''s origin on the curve''s origin (https://docs.blender.org/manual/en/5.2/modeling/modifiers/deform/curve.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Curve Primitives", Path (https://docs.blender.org/manual/en/5.2/modeling/curves/primitives.html), read 2026-10-15'
  - 'Blender 5.0 release notes, Modeling: Lattice Deform Selected (https://developer.blender.org/docs/release_notes/5.0/modeling/), read 2026-10-15'
  - 'Blender 5.2.2, checked 2026-10-15: a new Simple Deform modifier is Twist at 45 degrees around X; Bend around Z curls a bar along X with its ends towards +Y; Add > Lattice > Lattice Deform Selected fits a 2 x 2 x 2 lattice and adds the Lattice modifier; Add > Curve > Path is 4 m long with 5 points along X'
---

# Deform modifiers

Deform modifiers move the vertices a mesh already has, without adding any. They can twist a column, bend a sign into an arc, squeeze a shape inside a cage, or lay a row of planks along a curve. In this lesson you'll use the Simple Deform, Lattice and Curve modifiers.

![The exercise: a twisted column, a bent sign, and a row of planks sagging along a curve.](example)

## Steps

1. **Twist with Simple Deform.** Make a tall box with about ten loop cuts up its height. Add Deform > Simple Deform, keep the mode Twist, set Axis to Z and Angle to 90°. Each loop turns a little more than the one below it.

   ![A column with loop cuts up its height, then the same column with Simple Deform, Twist, Axis Z, 90 degrees.](twist)

2. **Bend with Simple Deform.** For a curved sign, make a box long along X with ten loop cuts across it. Set the mode to Bend, Axis Z and Angle 90°. The middle stays put and the ends curl back.

   ![A sign with ten loop cuts, seen from above, then the same sign bent 90 degrees into an arc.](bend)

3. **Move the centre.** Simple Deform works from the object's origin, so a twist or bend centres there. To steer it, pick an empty in the Origin field: moving and turning the empty moves the centre and the axis.

4. **Shape with a lattice.** Select an object and choose Add > Lattice > Lattice Deform Selected. It fits a cage round the object and adds a Lattice modifier. Press `Tab` on the lattice and move its points, and the mesh follows smoothly.

   ![A box inside a lattice of eight points, then the lattice's top four points moved together, squeezing the top of the box.](lattice)

5. **Lay it along a curve.** Add > Curve > Path is a straight curve 4 m long. In Edit Mode, move its middle point down. Give the plank row Deform > Curve, with the path as Curve Object. Keep both origins at the world origin.

   ![A straight row of planks, then the Path with its middle point moved down and the planks following its sag.](curve)

## Common mistake

![A sign bent 90 degrees, seen from above. Left, with no loop cuts it barely changes. Right, with ten loop cuts it bends into an arc.](mistake)

A deform modifier can only move vertices that exist, so a plain box hardly bends: only its ends can move. If a twist or bend looks stiff or does nothing, add more loop cuts along the length you want to deform.

## Checking your model

Look at the three objects from the front and from above:

1. The column turns a quarter turn from bottom to top.
2. Seen from above, the sign bends into a smooth arc.
3. The planks follow the path's sag with even gaps.
4. With a modifier's viewport button off, the straight mesh shows underneath.

Lattice Deform Selected makes a lattice of 2 points each way. For finer control, raise Resolution U, V and W in the lattice's Object Data properties.
