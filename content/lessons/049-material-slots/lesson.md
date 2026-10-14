---
needs: [principled-bsdf, edit-mode]
exercise: house-three-slots
watch: [ryan-king-managing-materials, blender-manual-render-materials-assignment]
sources:
  - 'Blender 5.2 Manual, "Assignment": Material Slots, the + button, Assign, Select and Deselect in Edit Mode, and Ctrl+L to reuse a material (https://docs.blender.org/manual/en/5.2/render/materials/assignment.html), read 2026-10-15'
  - 'Blender 5.2 Manual, "Link Data": Object > Link/Transfer Data (Ctrl+L) > Link Materials (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/link_transfer/link_data.html), read 2026-10-15'
  - Papaya Games, "Blazing-fast rendering with a single material per scene", on the cost of changing materials while drawing (https://papaya-games.itch.io/duck-in-town/devlog/73530/blazing-fast-rendering-with-a-single-material-per-scene), read 2026-10-15
  - Blender 5.2.2, the exercise done on the house-block starter and measured with blender/dimensio_check.py, checked 2026-10-15
---

# Material slots

One object can wear several materials, like a house with pale walls, a red roof and a blue door. Each material sits in a slot on the object, and each face uses one slot. In this lesson you'll add slots, give faces to them in Edit Mode and share them between objects.

![A small house with three materials, pale walls, a red roof and a blue door, beside its slot list holding Walls, Roof and Door.](example)

## Steps

1. **Add a slot.** Select the object and open the Material tab. Click + beside the slot list to add an empty slot, then click New to give it a material. Every face uses the first slot until you assign it to another.

   ![Left, a slot list holding Walls, with the + button beside it picked out. Right, the list after clicking +: an empty slot under Walls, and the New button below.](add-slot)

2. **Assign faces.** Press `Tab` for Edit Mode and select the faces that need the new material, such as the two faces of a roof. Click that material's slot in the list, then click Assign.

   ![The house in Edit Mode with both roof faces selected and red, and the slot list with Roof highlighted and the Assign button picked out under it.](assign)

3. **Check with Select.** Click a slot and click Select to select every face that uses it, or Deselect to drop them from the selection. It's the quickest way to find a face you forgot to assign.

   ![The slot list with Door highlighted and the Select button picked out, and the house with its one door face selected.](select)

4. **Share them with other objects.** In Object Mode, select the objects that should match, then select the one with the slots last, so it is active. Press `Ctrl+L` and choose Link Materials.

   ![Three houses: two plain grey ones and a painted one selected last. After Ctrl+L and Link Materials, all three have pale walls, a red roof and a blue door.](link-materials)

Give a game prop only the slots it needs: Papaya Games notes that changing material is one of the slower jobs when a game draws a frame. Lesson 57 colours a whole model with one material.

## Common mistake

![Left, the whole house red after Assign, because every face was still selected. Right, only the roof red, the walls pale and the door blue.](mistake)

`Tab` often leaves every face selected from your last edit, so Assign gives the whole object the new material. Press `Alt+A` to deselect everything first, then select only the faces you want.

## Checking your model

Look at the house in Material Preview, then in Edit Mode:

1. The house has three slots holding three different materials.
2. Both roof faces show the roof material.
3. Select on the door's slot selects only the door face.
4. Every other face shows the walls material.
