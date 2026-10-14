---
needs: [bezier-curves]
exercise: rope-pipe-rail
watch: [ryan-king-curves, blender-secrets-curve-to-tube]
sources:
  - 'Blender 5.2 Manual, "Curves: Geometry", Bevel (Round, Object), Depth, Resolution, Fill Caps (https://docs.blender.org/manual/en/5.2/modeling/curves/properties/geometry.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Curves: Shape", Resolution Preview U (https://docs.blender.org/manual/en/5.2/modeling/curves/properties/shape.html), read 2026-10-15'
  - Blender 5.2 Manual, "Convert", Mesh (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/convert.html), read 2026-10-15
  - Blender 5.2 Manual, "Curve to Tube Modifier" (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/curve_to_tube.html), read 2026-10-15
  - Blender 5.2 Manual, "Properties Editor", Object Data tab (https://docs.blender.org/manual/en/5.2/editors/properties_editor.html), read 2026-10-15
  - 'Blender 5.2.2, checked 2026-10-15 in a script: a new curve has Resolution Preview U 12 and bevel Resolution 4; a round bevel has 4 + 2 x Resolution sides; Depth is the tube''s radius; the default Bézier curve at Depth 0.1 m gives 288 triangles, and 48 with Preview U 4 and Resolution 1; Curve to Tube''s Scale is the radius and it makes a UV map called UVMap'
---

# Curve depth and bevel

A curve is a line with no thickness until you give it some. In this lesson you'll turn curves into a rope, a pipe and a rail by giving each one depth and a cross-section. Then you'll convert them to meshes, which Dimensio can measure and Godot can load.

![Three pieces made from curves: a rope hanging between two posts, a pipe that bends upward with closed ends, and a flat-sided handrail.](example)

## Steps

1. **Give the curve depth.** Select the curve and open the Properties editor's Object Data tab. Under Geometry > Bevel, keep Round and raise Depth. The line becomes a round tube, and Depth is its radius: 0.03 m makes a rope 6 cm across.

   ![The same Bézier curve twice: on the left a thin line with its control points and handles, on the right a round tube after setting Depth.](depth)

2. **Lower the resolution.** The bevel's Resolution sets the points around the tube: 0 gives 4 sides and 1 gives 6. Shape > Resolution Preview U sets the points between each pair of control points. Set it to 4 for a low-poly piece.

   ![Top, the cross-section at bevel Resolution 0, 1 and 4: a square, a hexagon and a 12-sided ring. Bottom, the same curve with Resolution Preview U 12 and with 4.](resolution)

3. **Choose a cross-section.** Tick Fill Caps to close the tube's ends. For the rail, set Bevel to Object and pick the Rail profile curve. Blender sweeps that flat shape along the path, so the rail comes out rectangular.

   ![A small rectangle 8 cm by 4 cm, the Rail profile, and the rail it makes when swept along a curved path, with both ends filled.](profile)

4. **Convert it to a mesh.** In Object Mode, choose Object > Convert > Mesh. The tube keeps its shape but is now vertices and faces, and the curve settings are gone. Dimensio only measures meshes, so convert before you add your file.

   ![Left, the curve with its control points and handles. Right, the same tube as a mesh, its vertices shown as dots.](convert)

5. **Or use Curve to Tube.** Add Modifier > Generate > Curve to Tube builds the tube as a modifier instead. Scale is the radius and Resolution the points around it. It also makes a UV map, which a bevel doesn't. Convert it the same way.

   ![The Curve to Tube modifier's panel with Scale, Resolution, Caps and UV Map, beside the six-sided tube it makes with its ends capped.](curve-to-tube)

## Common mistake

![Left, a tube at the default resolutions, dense with rings and 12 sides, 288 triangles. Right, the same curve at Preview U 4 and Resolution 1, 48 triangles.](mistake)

A new curve uses Resolution Preview U 12 and a bevel Resolution of 4, so one short rope already has 288 triangles. Convert it like that and you have a dense mesh to thin out by hand. Lower both numbers first, while each is still one field.

## Checking your model

Select each piece in Object Mode and check:

1. The Outliner lists the rope, pipe and rail as meshes, not curves.
2. The Statistics overlay shows under 200 triangles for each piece.
3. Both ends of the pipe have caps.
4. The rail has the profile's flat sides, not a round section.
