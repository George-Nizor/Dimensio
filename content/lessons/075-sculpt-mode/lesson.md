---
needs: [edit-mode]
exercise: stone-and-cap
watch: [grant-abbitt-sculpting, grant-abbitt-every-brush]
sources:
  - 'Blender 5.2 Manual, "Workspaces", the Sculpting workspace (https://docs.blender.org/manual/en/5.2/interface/window_system/workspaces.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Brushes: Introduction": the asset shelf, Shift+Space, F, Shift+F and Ctrl (https://docs.blender.org/manual/en/5.2/sculpt_paint/brush/introduction.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Sculpting: The Brush", the cursor''s rings and the common brushes (https://docs.blender.org/manual/en/5.2/sculpt_paint/sculpting/introduction/brush.html), read 2026-10-15'
  - 'Blender 5.2 Manual, sculpt brushes "Draw", "Clay Strips", "Smooth" (smoothing with Shift) and "Grab" (https://docs.blender.org/manual/en/5.2/sculpt_paint/sculpting/brushes/index.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Symmetry", Mirror across local axes (https://docs.blender.org/manual/en/5.2/sculpt_paint/sculpting/tool_settings/symmetry.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Adaptive Resolution", why sculpting needs enough geometry (https://docs.blender.org/manual/en/5.2/sculpt_paint/sculpting/introduction/adaptive.html), read 2026-10-15'
  - 'Blender 5.2.2, the Sculpt Mode header''s mirror toggles (scripts/startup/bl_ui/space_view3d.py) and Mirror X off on new meshes, checked 2026-10-15'
---

# Sculpt Mode

Sculpting shapes a mesh the way you would shape clay. You drag brushes over the surface to build it up, push it in, smooth it and pull it about. It suits organic shapes such as stones and creatures. In this lesson you'll use the four brushes you'll reach for most often.

![Two shapes sculpted from the starter's ball: a lumpy stone and a mushroom cap.](example)

## Steps

1. **Open the Sculpting workspace.** Select the ball and click the Sculpting tab at the top of the window. The ball is now in Sculpt Mode. Brushes sit on the asset shelf along the bottom of the viewport, and `Shift+Space` opens them under the mouse.

   ![The Sculpting tab picked out, the ball in the viewport and the asset shelf below it with Draw chosen among Clay Strips, Smooth and Grab.](shelf)

2. **Raise and lower the surface.** Choose Draw and drag over the ball to raise the surface. Hold `Ctrl` while you drag to push it in instead.

   ![The surface seen side on: dragging raises a bump, and dragging with Ctrl held pushes in a dent.](draw)

3. **Set the size and strength.** Press `F`, move the mouse to resize the brush and click to confirm. `Shift+F` sets the strength the same way. The outer ring under the mouse shows the size and the inner ring the strength.

   ![The brush cursor on the ball, its outer ring labelled as the size for F and its inner ring as the strength for Shift+F.](size)

4. **Build up, then smooth.** Clay Strips builds broad shapes and flattens them as it adds, like strips of clay. Hold `Shift` while sculpting with any brush to smooth the surface under it.

   ![Side on: Clay Strips raising flat-topped layers, and a bumpy surface smoothed flat with Shift.](clay-smooth)

5. **Move whole areas with Grab.** Grab takes the part of the surface under the brush when you click and drags it with the mouse. Use it to change proportions without adding detail.

   ![The ball with one side pulled out by Grab, the brush circle at the end of the stroke.](grab)

6. **Mirror your strokes.** In the header, click X beside the mirror icon. Every stroke now repeats on the other side of the object's X axis, which keeps a shape symmetrical.

   ![The X toggle picked out beside the mirror icon, and the ball with the same bulge on both sides of a dashed centre line.](mirror)

## Common mistake

![Left, a Draw stroke on a ball with few faces pulling out a spike. Right, the same stroke on the dense ball making a smooth bump.](mistake)

A brush can only move the vertices that are there. On a mesh with few faces, such as the default cube, a stroke drags out spikes and sharp steps. Sculpt on a dense, even mesh like the starter's ball, or remesh first, as lesson 76 shows.

## Checking your model

Orbit around both shapes and check:

1. The stone has lumps and dents across its whole surface.
2. The mushroom cap is a smooth dome, the same on both sides.
3. No spikes or sharp steps are left from strong strokes.
