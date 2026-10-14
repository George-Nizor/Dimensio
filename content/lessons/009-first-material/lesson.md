---
needs: [adding-objects]
exercise: three-colours-five-shapes
watch: [grant-abbitt-materials, blender-manual-render-materials-assignment]
sources:
  - Blender 5.2 Manual, "Materials, Introduction", materials set colour and how light meets a surface, the Principled BSDF (https://docs.blender.org/manual/en/5.2/render/materials/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Assignment", material slots, the data-block menu, reusing a material from the browse list, Ctrl+L to link materials (https://docs.blender.org/manual/en/5.2/render/materials/assignment.html), read 2026-10-15
  - Blender 5.2 Manual, "Link/Transfer Data", Link Materials (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/link_transfer/link_data.html), read 2026-10-15
  - Blender 5.2 Manual, "Viewport Shading", the Z pie, Solid view's Object Color set to Material uses the Viewport Display colour (https://docs.blender.org/manual/en/5.2/editors/3dview/display/shading.html), read 2026-10-15
  - Blender 5.2.2, a new material starts with a Principled BSDF whose Base Color and Viewport Display colour are separate settings; the default cube's material is called Material, checked 2026-10-15
  - Grant Abbitt, "Blender 5 Complete Beginners Guide, Part 2, Materials" (https://www.youtube.com/watch?v=J2OpaKlChI8), read 2026-10-15
---

# Colour with materials

A material sets how a surface looks: its colour and how it reflects light. In this lesson you'll give objects a flat colour, look at the colours in Material Preview, and give one material to several objects.

![Five shapes in three colours: a red cube, a blue cylinder, a green cone, a red sphere and a blue torus.](example)

## Steps

1. **Add a material.** Select an object and open the Material tab in the Properties editor, the round red icon near the bottom of its tabs. Click New. The new material starts with a Principled BSDF, the shader that sets how the surface looks.

   ![The Properties editor with the Material tab picked out at the bottom of its tabs, and the New button beside the browse icon.](material-tab)

2. **Choose a colour.** In the Surface panel, click the Base Color field and pick a colour on the wheel. Then double-click the material's name at the top of the tab and type a new one, such as Red, so you can find it later.

   ![The Base Color field opened into a colour wheel, with the material's name field above it reading Red.](base-color)

3. **Look in Material Preview.** With the mouse over the viewport, press `Z` and choose Material Preview, or click the third of the four shading buttons in the header. The objects now show their materials' colour and shine.

   ![The four shading buttons in the viewport header, Wireframe, Solid, Material Preview and Rendered, with Material Preview picked out.](shading)

4. **Reuse a material.** Select another object, click the browse icon left of New and choose Red from the list. The number beside the material's name says how many objects use it, and a change to the material changes all of them.

   ![The browse list open with Blue, Green and Red, Red picked out, and the name field reading Red with a 2 beside it.](browse)

5. **Copy to many objects.** Select the objects that need the material, then the one that has it, so it is the active object. Press `Ctrl+L` and choose Link Materials. Every selected object now uses the active object's material.

   ![Three selected objects and an active red one, with arrows from the red one to the others: Ctrl+L, Link Materials.](link)

Grant Abbitt's beginner course makes its first materials in the Shading workspace, then moves on to shine, metal and lights.

## Common mistake

![Left, the viewport in Solid shading: the cube stays grey after its Base Color was made red. Right, the same cube in Material Preview: it is red.](mistake)

After you set Base Color, the object can stay grey in the viewport. Solid shading, where the viewport starts, uses each material's Viewport Display colour, a separate setting from Base Color. Switch to Material Preview with `Z` to see the material.

## Checking your model

In Material Preview, check:

1. Every object has a material in its Material tab.
2. Red and Blue each show a 2 beside their names.
3. The browse list shows three materials: Red, Blue and Green.
4. The cube's material, once called Material, is now Red.
