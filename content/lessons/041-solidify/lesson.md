---
needs: [modifiers, extrude, normals]
exercise: banner-bowl-wall
watch: [josh-gambrell-solidify, blender-manual-modeling-modifiers-generate-solidify]
sources:
  - 'Blender 5.2 Manual, "Solidify Modifier": Thickness, Offset, Even Thickness, Rim Fill, and the note that thickness uses the object''s local scale (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/solidify.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Overlays", Face Orientation (https://docs.blender.org/manual/en/5.2/editors/3dview/display/overlays.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Normals", Flip (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/normals.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Extrude Edges" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/extrude_edges.html), read 2026-10-15'
  - 'Blender 5.2.2, checked 2026-10-15: a new Solidify modifier has Thickness 0.01 m, Offset -1 and Fill Rim on; on a plane facing up, Offset -1 puts the thickness below it and 1 above it; the exercise banner, bowl and wall measure 0 non-manifold edges'
---

# Solidify

A plane has no thickness: seen edge on, it disappears. The Solidify modifier gives a surface a real thickness, which suits banners, leaves, walls and the sides of a bowl. In this lesson you'll set the thickness, choose which side it grows on, and keep it even round corners.

![The exercise's three objects with Solidify: a banner, a bowl and an L-shaped wall.](example)

## Steps

1. **Start from a surface.** Solidify is for surfaces with no thickness yet: a plane, or a mesh with some faces deleted. For a bowl, add a UV sphere, and in the front view delete the vertices of its top half.

   ![Left, a UV sphere from the front with its top half selected. Right, what is left after deleting it: an open bowl.](surface)

2. **Add Solidify and set Thickness.** Add Generate > Solidify and type the Thickness in metres, such as 0.03 for 3 cm. Blender measures it on the mesh before the object's scale, so apply the scale first.

   ![A standing plane, then the same plane with Solidify and its Thickness measured across it.](thickness)

3. **Choose the side with Offset.** Offset -1, the default, grows the thickness behind the faces, away from their normals. Offset 1 grows it in front, and 0 splits it across the face. The Face Orientation overlay shows the back of each face in red.

   ![A face seen edge on with its normal pointing up. Offset -1 puts the thickness below it, 0 on both sides, 1 above it.](offset)

4. **Keep corners even.** Where two faces meet at an angle, the wall gets thinner at the corner. Tick Even Thickness and the wall keeps one thickness all the way round.

   ![The L-shaped wall from above. With Even Thickness off it thins at the corner. With it on, the thickness stays the same.](even)

5. **Close the edges.** Fill Rim, on by default, adds faces between the two surfaces along every open edge. With it off you get two separate skins with a gap between them.

   ![The banner's corner with Fill Rim off, two separate skins, and on, a closed slab.](rim)

## Common mistake

![A wall on the edge of a floor, from the side. Left, normals pointing into the room: the thickness sticks out past the floor. Right, normals pointing out: the thickness stays on the floor.](mistake)

The thickness can grow on the wrong side without any warning. Solidify grows it behind the faces, so a wall whose normals point into the room sticks out past the floor. Turn on Face Orientation, then flip the faces with Mesh > Normals > Flip, or set Offset to 1.

## Checking your model

Look at each object from the front and the side:

1. Each object has a Solidify modifier.
2. Seen edge on, the banner is 2 cm thick.
3. The wall's corner is as thick as the rest of the wall.
4. Face Orientation shows no red on any outside surface.
