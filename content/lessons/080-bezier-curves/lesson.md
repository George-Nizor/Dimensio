---
needs: [edit-mode]
exercise: trace-road-and-hook
watch: [ryan-king-curves, blender-manual-modeling-curves-introduction]
sources:
  - 'Blender 5.2 Manual, "Curves: Introduction" (https://docs.blender.org/manual/en/5.2/modeling/curves/introduction.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Curve Structure": control points, handles and the four handle types set with V (https://docs.blender.org/manual/en/5.2/modeling/curves/structure.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Curve Primitives", Bézier (https://docs.blender.org/manual/en/5.2/modeling/curves/primitives.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Control Points": Extrude Curve and Move with E, Make Segment with F and Set Handle Type with V (https://docs.blender.org/manual/en/5.2/modeling/curves/editing/control_points.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Curve", Toggle Cyclic with Alt+C (https://docs.blender.org/manual/en/5.2/modeling/curves/editing/curve.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Other", Add Vertex with Ctrl and the right mouse button (https://docs.blender.org/manual/en/5.2/modeling/curves/editing/other.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Draw", the curve Draw tool and its Tolerance (https://docs.blender.org/manual/en/5.2/modeling/curves/tools/draw.html), read 2026-10-15'
  - 'Blender 5.2.2: a new Bézier curve has two control points with Aligned handles; curve.vertex_add is Ctrl and the action mouse button, the right button with left-click select (blender_default.py), checked 2026-10-15'
---

# Bézier curves

A Bézier curve is a smooth line you shape with a few points instead of many vertices. Curves make roads, cables and rails once a later lesson gives them thickness. In this lesson you'll add a curve, shape it with its points and handles, and trace a road and a hook from the top view.

![A road and a hook seen from above, each traced with a Bézier curve whose control points and handles show.](example)

## Steps

1. **Add a curve.** In the top view, `Numpad 7`, choose Add > Curve > Bézier and press `Tab`. The curve has two control points. Each has a handle on either side that pulls the curve toward it.

   ![A Bézier curve in Edit Mode: two control points, one picked out with its two handles labelled.](add)

2. **Shape it with the handles.** Drag a control point with `G` to move it. Drag the round end of a handle to bend the curve through that point. A longer handle pulls the curve further.

   ![The same curve before and after the first point's right handle is dragged up, bending the curve.](handles)

3. **Add points.** Select an end point and press `E` to extrude a new one, or hold `Ctrl` and right click where the next point should go. Put points at the bends, not along the straight parts.

   ![E extruding a new point from the curve's end, and Ctrl with a right click adding one at the mouse.](extrude)

4. **Choose handle types.** Select a point and press `V`. Automatic keeps the curve smooth by itself. Vector points the handles at the next points, for a corner or a straight piece. Aligned keeps both handles in line, and Free lets them move apart.

   ![The same three points with the middle one's handles set to Automatic, Vector, Aligned and Free.](types)

5. **Join and close.** Select two end points and press `F` to join them with a new segment. `Alt+C` closes a curve, from its last point back to its first.

   ![F joining two selected end points with a dashed new segment, and Alt+C closing a curve into a loop.](join)

6. **Draw freehand.** Choose Draw in the Toolbar and drag across the view. Blender fits a Bézier curve to your stroke, and Tolerance in the tool settings sets how closely it follows.

   ![A wobbly freehand stroke, dashed, and the smooth curve Blender fits to it with four control points.](draw)

## Common mistake

![Left, a road traced with a point at every small bump, so the curve wobbles. Right, four points at the bends and a smooth curve.](mistake)

Tracing with a point at every bump makes a wobbly curve that is slow to change. Use as few points as the shape allows, one at each bend, and let the handles do the shaping.

## Checking your model

From the top view, in Edit Mode, check:

1. The road curve runs along the middle of the road, end to end.
2. The road takes five control points or fewer.
3. The hook's shaft is straight and turns into the bend without a corner.
4. Each curve is one object with no stray points.
