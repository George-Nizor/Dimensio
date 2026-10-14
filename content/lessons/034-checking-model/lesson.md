---
needs: [delete-merge, normals, topology]
exercise: fix-the-crate
watch: [jbdtube-non-manifold, blender-manual-modeling-meshes-editing-mesh-cleanup]
sources:
  - Blender 5.2 Manual, "Clean Up": Merge by Distance, Delete Loose, Fill Holes (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/cleanup.html), read 2026-10-15
  - Blender 5.2 Manual, "Duplicate", a copy left in place by a right click (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/duplicate.html), read 2026-10-15
  - Blender 5.2 Manual, "Select All by Trait", Non Manifold, only in vertex and edge select (https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/all_by_trait.html), read 2026-10-15
  - Blender 5.2 Manual, "Glossary", Non-manifold (https://docs.blender.org/manual/en/5.2/glossary/index.html), read 2026-10-15
  - Blender 5.2 Manual, "Selecting", None with Alt+A (https://docs.blender.org/manual/en/5.2/modeling/meshes/selecting/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing Normals", Recalculate with Shift+N (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/normals.html), read 2026-10-15
  - Blender 5.2 Manual, "New Edge/Face from Vertices", F (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/vertex/make_face_edge.html), read 2026-10-15
---

# Checking your model

Some faults don't show in the viewport: two vertices in one place, a stray vertex, a gap one face wide, a face turned inwards. Each causes trouble later, such as a face that vanishes in Godot. In this lesson you'll check a model for each one in a fixed order and fix what you find. Dimensio then measures the result.

![The four faults this lesson finds: two vertices in one place, a vertex on its own, a hole where a face is missing, and a face turned inwards showing red.](example)

## Steps

1. **Merge doubled vertices.** Two vertices in the same place are doubles, often left by a duplicate or an extrusion you cancelled. In Edit Mode, press `A`, then choose Mesh > Clean Up > Merge by Distance. Blender reports how many vertices it removed.

   ![Left, the crate's top corners each made of two vertices in the same place. Right, after Merge by Distance, one vertex at each corner.](merge)

2. **Delete loose parts.** With everything still selected, choose Mesh > Clean Up > Delete Loose. It removes vertices with no edge and edges with no face, which belong to no surface.

   ![Left, the crate seen through with three stray vertices inside it. Right, after Delete Loose, the stray vertices gone.](loose)

3. **Turn faces outwards.** Press `Shift+N` with everything selected. Then turn on Face Orientation in the Viewport Overlays popover and orbit round the model, looking for red on the outside.

   ![Left, two sunken panels on the crate's front showing red. Right, after Shift+N, no red.](outwards)

4. **Find the holes.** Press `1` for vertex select and `Alt+A` to deselect, then choose Select > Select All by Trait > Non Manifold. An edge with only one face is non-manifold: it's the rim of a hole. Fill each hole with `F`.

   ![Left, a box with its front face missing and the four edges round the hole selected. Right, the hole filled with F.](holes)

5. **Measure it.** Save the file and add it to the exercise in Dimensio. Dimensio counts doubled vertices, loose vertices, holes, faces pointing inwards and n-gons, and shows how many it found of each.

## Common mistake

![Left, Non Manifold before merging: the edges round the crate's top and round the hole are selected. Right, after Merge by Distance: only the four edges round the hole.](mistake)

If you look for holes before merging doubles, Non Manifold picks out too much. Doubled vertices leave the edges along a seam with one face on each side, so the seam shows up as well as the real gap. Merge by Distance first.

## Checking your model

When you've worked through the steps, check again in Edit Mode:

1. Merge by Distance now removes no vertices.
2. Non Manifold selects nothing.
3. No red shows anywhere with Face Orientation on.
4. Statistics shows 188 triangles, as your lesson 27 crate does.
