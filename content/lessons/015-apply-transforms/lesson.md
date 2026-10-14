---
needs: [origins]
exercise: apply-stretched
watch: [joey-carlino-apply-scale, blender-manual-scene-layout-object-editing-apply]
sources:
  - 'Blender 5.2 Manual, "Apply": Object > Apply, Ctrl+A, Rotation & Scale, Corrective Flip Normals (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/apply.html), read 2026-10-15'
  - Blender 5.2 Manual, "Transform" properties, Scale and Dimensions (https://docs.blender.org/manual/en/5.2/scene_layout/object/properties/transforms.html), read 2026-10-15
  - Blender 5.2 Manual, "Sidebar", Item tab (https://docs.blender.org/manual/en/5.2/editors/3dview/sidebar.html), read 2026-10-15
  - Blender 5.1 release notes, Modeling, Corrective Flip Normals on by default (https://developer.blender.org/docs/release_notes/5.1/modeling/), read 2026-10-15
  - Blender 5.2.2, the Apply menu in 5.2/scripts/startup/bl_ui/space_view3d.py (Location, Rotation, Scale, All Transforms, Rotation & Scale), and the bevel widths before and after applying, measured on the apply-stretched starter, checked 2026-10-15
  - Godot Docs, "Model export considerations", apply the object transform before exporting (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/model_export_considerations.html), read 2026-10-15
  - Joey Carlino, "Apply scale? What does that mean?" (https://www.youtube.com/watch?v=DK0_FH7miEQ), checked 2026-10-15
---

# Applying transforms

When you scale or turn an object in Object Mode, Blender records the change on the object and leaves its mesh as it was. Modifiers then work on a mesh of the wrong size, and Godot's docs ask you to apply transforms before export. In this lesson you'll apply rotation and scale, so the mesh holds its real size.

![One end of a bench, close up. Left, stretched in Object Mode with Scale 1, 0.25, 0.25: its bevels are thin along the sides and wide at the end. Right, after applying scale, Scale 1, 1, 1: the same bevel on every edge.](example)

## Steps

1. **Read the scale.** Select an object and press `N` for the Sidebar's Item tab. Scale shows how far you stretched the object in Object Mode, and Dimensions shows its size. Any scale other than 1 means the mesh is still at its old size.

   ![The Sidebar's Item tab for the bench: Scale 1, 0.25 and 0.25 picked out, and Dimensions 2 m, 0.5 m and 0.5 m below it.](sidebar-scale)

2. **See the uneven bevel.** Each box in the exercise has a Bevel modifier, which rounds its edges. The modifier works on the mesh before the object's scale, so the stretched bench's bevel comes out 8 cm at its ends and 2 cm along its sides.

   ![The bench from above with its bevels measured: 8 cm at the end and 2 cm along the side.](uneven-bevel)

3. **Apply rotation and scale.** Select the objects, press `Ctrl+A` and choose Rotation & Scale. Nothing moves, but Rotation now reads 0 and Scale reads 1: the mesh itself has the new size. Every bevel becomes 8 cm.

   ![The Apply menu after Ctrl+A, with Rotation & Scale picked out below Location, Rotation, Scale and All Transforms.](apply-menu)

4. **Check the dimensions.** After applying, Dimensions give the sizes along the world's X, Y and Z. The sign started out lying flat, and `R` `X` `90` stood it up. Its Dimensions read 1.2, 0.8, 0.24 m before applying and 1.2, 0.24, 0.8 m after.

   ![The sign standing upright. Left, before applying, its local axes turned so Y points up, with Dimensions 1.2, 0.8, 0.24. Right, after applying, its axes match the world's, with Dimensions 1.2, 0.24, 0.8.](sign-axes)

5. **Apply a mirror.** A negative scale on one axis mirrors an object, as the sign's -0.6 on X does. Older tutorials warn that applying it turns faces inside out. In 5.2, Apply turns them back: Corrective Flip Normals is on by default.

## Common mistake

![Left, All Transforms applied: the crate's origin has jumped to the centre of the world, far from the crate. Right, Rotation & Scale applied: the origin stays at the middle of the crate's base.](mistake)

All Transforms applies Location too, which moves the object's origin to the centre of the world. The crate then turns around a point far away, and a game places it by that point. Choose Rotation & Scale instead, so the origin stays at the base.

## Checking your model

Select each box and look at the Sidebar's Item tab:

1. Scale reads 1, 1 and 1 on all three boxes.
2. Rotation reads 0° on all three, the sign included.
3. Every bevel is the same width, 8 cm.
4. Each origin is still at the middle of its box's base.
