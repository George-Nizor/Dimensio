---
needs: [edit-mode]
exercise: stack-three-modifiers
watch: [cgcookie-modifiers, blender-manual-modeling-modifiers-introduction]
sources:
  - 'Blender 5.2 Manual, "Modifiers: Introduction": Add Modifier, Shift+A, the stack, the header buttons, Apply (Ctrl+A), Delete (X) and the warning about applying out of order (https://docs.blender.org/manual/en/5.2/modeling/modifiers/introduction.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Bevel Modifier" (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/bevel.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Subdivision Surface Modifier" (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/subdivision_surface.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Wireframe Modifier" (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/wireframe.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "glTF 2.0", Data > Mesh > Apply Modifiers (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15'
  - 'Blender 5.2.2, checked 2026-10-15: the Add Modifier menu''s categories (properties_data_modifier.py), and that Subdivision Surface above Bevel leaves no edge sharper than Bevel''s 30 degree limit, so nothing is bevelled'
---

# Modifiers

A modifier changes how an object looks without touching its mesh, so you can keep editing the simple mesh underneath. In this lesson you'll add modifiers in the Properties editor, see why their order matters, and apply one so it becomes part of the mesh.

![Left, the cube's mesh, still eight vertices. Right, the same cube as the viewport shows it with a Bevel and a Subdivision Surface modifier: a rounded box.](example)

## Steps

1. **Open the Modifiers tab.** Select the cube. In the Properties editor, click the wrench tab. Click Add Modifier, or press `Shift+A` with the mouse over the tab. The menu sorts modifiers into Edit, Generate, Deform, Normals and Physics.

   ![The Properties editor with the wrench tab picked out and the Add Modifier menu open at Generate, with Bevel picked out in the list beside it.](add)

2. **Build a stack.** Choose Generate > Bevel, then add Generate > Subdivision Surface. Each new modifier goes to the bottom of the list. This list is the modifier stack, and Blender works down it from the top.

   ![Bevel above Subdivision Surface in the stack, beside the cube, the cube after Bevel, and the cube after both.](stack)

3. **Change the order.** Drag a panel by the dots at the right end of its header. With Subdivision Surface above Bevel, the cube turns into a ball, because no edge is left sharp enough for the bevel.

   ![Two stacks side by side. Bevel first gives a rounded box. Subdivision Surface first gives a ball.](order)

4. **Switch one off.** The buttons in a panel's header show the modifier in Edit Mode, in the viewport and in renders. Click the viewport button to hide the modifier's effect without removing it. Click again to bring it back.

   ![A modifier panel's header with its buttons named: Edit Mode, viewport, render, the menu, delete, and the dots to drag it by. The viewport button is picked out.](toggles)

5. **Apply or delete.** With the mouse over a panel, `Ctrl+A` applies the modifier: its result becomes the mesh and the panel goes. `X` over a panel deletes the modifier and its effect.

   ![The panel's menu open at Apply, beside the mesh in Edit Mode before, a plain cube, and after, a cube with narrow bevel faces along every edge.](apply)

## Common mistake

![Left, Apply used on Subdivision Surface while Bevel sits above it: the mesh becomes a ball. Right, Apply used on Bevel at the top of the stack: the rounded box stays.](mistake)

It's easy to apply whichever modifier you're looking at. Blender applies it as if it were at the top of the stack, so the shape can change from what the viewport showed. Apply from the top down, or choose Move to First from the panel's menu before you apply.

## Checking your model

Select the cube and check:

1. Subdivision Surface is the only modifier left, at Levels Viewport 2.
2. In Edit Mode, narrow bevel faces run along every edge of the mesh.
3. The Statistics overlay shows 26 faces in Edit Mode and 384 in Object Mode.

A modifier left in the stack only goes into a game engine if you apply it first or tick Apply Modifiers when you export.
