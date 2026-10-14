---
needs: [remeshing, snapping]
exercise: retopo-stone
watch: [cg-boost-retopology, ryan-king-retopology]
sources:
  - 'Blender 5.2 Manual, "Remeshing", the Retopology section: a new mesh over the sculpt, the Retopology overlay, Poly Build and snapping (https://docs.blender.org/manual/en/5.2/modeling/meshes/retopology.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Subdivide", Number of Cuts (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/subdivide.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Shrinkwrap Modifier": Target and Nearest Surface Point (https://docs.blender.org/manual/en/5.2/modeling/modifiers/deform/shrinkwrap.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Modifiers: Introduction", Apply with Ctrl+A (https://docs.blender.org/manual/en/5.2/modeling/modifiers/introduction.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Viewport Overlays", the Retopology overlay (https://docs.blender.org/manual/en/5.2/editors/3dview/display/overlays.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Snapping": Shift+Tab, Face Project and Exclude Non-Selectable (https://docs.blender.org/manual/en/5.2/editors/3dview/controls/snapping.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Poly Build": Ctrl+click, dragging an edge and Shift+click (https://docs.blender.org/manual/en/5.2/modeling/meshes/tools/poly_build.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Decimate Modifier", Collapse and Ratio (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/decimate.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Select All by Trait", Non Manifold (https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/all_by_trait.html), read 2026-10-15'
  - 'Blender 5.2.2, a cube cut three times and shrinkwrapped onto the sculpted-stone starter: 96 quads, 192 triangles, no n-gons, no non-manifold edges, checked 2026-10-15'
---

# Retopology

A sculpt has thousands of faces, far too many for a game. Retopology means building a new, light mesh that sits on the sculpt's surface and keeps its shape. In this lesson you'll wrap a cut cube onto a sculpted stone and tidy its faces with snapping and Poly Build. The result is a game stone under 300 triangles.

![The sculpted stone of 20,480 triangles beside its retopology, a stone of 192 triangles in the same shape.](example)

## Steps

1. **Start from a cube.** Add > Mesh > Cube, then scale and move it until it fits closely round the stone. In Edit Mode, select everything, choose Edge > Subdivide and set Number of Cuts to 3. That makes 96 quads.

   ![A cube cut three times along every edge around the sculpt, beside the Subdivide panel with Number of Cuts 3.](cube)

2. **Wrap it onto the stone.** In Object Mode, add a Shrinkwrap modifier from Add Modifier > Deform and set Target to Stone sculpt. Each vertex moves to the nearest point on the sculpt's surface. Apply the modifier with `Ctrl+A` over its panel.

   ![The Shrinkwrap modifier with Target set to Stone sculpt, and the cut cube becoming the stone shape.](shrink)

3. **See both at once.** In Edit Mode, open the overlays and tick Retopology under Shading. Your mesh turns see-through, so the sculpt shows under its edges.

   ![The Retopology overlay ticked under Shading, and the low-poly stone's edges drawn over the sculpt.](overlay)

4. **Slide vertices along the surface.** In the snapping menu in the header, choose Face Project under Snap Target for Individual Elements, and turn snapping on with `Shift+Tab`. Now `G` moves a vertex over the sculpt. Line edges up with the stone's ridges.

   ![The snapping menu with Face Project picked, and a vertex sliding along a curved surface with G.](snap)

5. **Patch with Poly Build.** Choose Poly Build in the Toolbar. `Ctrl`+click adds a face to the nearest edge, dragging an edge pulls out a new quad, and `Shift`+click deletes the face under the mouse.

   ![A strip of quads: Ctrl+click adding a triangle, an edge dragged down into a new quad, and Shift+click deleting a face.](polybuild)

For a background rock, a Decimate modifier with a low Ratio cuts the sculpt itself down quickly, though its triangles come out uneven.

## Common mistake

![Cut through the sculpt's surface: a vertex moved with snapping off floats above it, and with Face Project snapping it lands on it.](mistake)

With snapping off, `G` moves vertices straight across the screen. They float above the sculpt or sink into it, and the low-poly stone loses the shape. Turn on Face Project snapping before you move anything.

## Checking your model

Hide the sculpt with its eye in the Outliner, then check:

1. From the front, side and top, the low-poly stone has the sculpt's outline.
2. The Statistics overlay shows under 300 triangles.
3. Every face has three or four corners.
4. Select > Select All by Trait > Non Manifold selects nothing.
