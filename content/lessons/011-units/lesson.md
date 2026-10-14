---
needs: [transform]
exercise: three-real-sizes
watch: [ryan-king-measure-scale, grant-abbitt-size-matters]
sources:
  - Blender 5.2 Manual, "Scene Properties", Units, Unit System, Unit Scale, Length (https://docs.blender.org/manual/en/5.2/scene_layout/scene/properties.html), read 2026-10-15
  - Blender 5.2 Manual, "Transform" properties, Dimensions is the size of the object's bounding box (https://docs.blender.org/manual/en/5.2/scene_layout/object/properties/transforms.html), read 2026-10-15
  - Blender 5.2 Manual, "Fields", Units, typing 1cm or 2ft, and the default unit when none is given (https://docs.blender.org/manual/en/5.2/interface/controls/buttons/fields.html), read 2026-10-15
  - Blender 5.2 Manual, "Measure", dragging a ruler, Ctrl to snap to edges and vertices, Delete or X to remove a ruler (https://docs.blender.org/manual/en/5.2/editors/3dview/toolbar/measure.html), read 2026-10-15
  - Blender 5.2 Manual, "Mesh Primitives", a cube of size 2 spans -1 to +1 (https://docs.blender.org/manual/en/5.2/modeling/meshes/primitives.html), read 2026-10-15
  - Godot Engine documentation, "Introduction to 3D", 1 unit is 1 meter (https://docs.godotengine.org/en/stable/tutorials/3d/introduction_to_3d.html), read 2026-10-15
  - Blender 5.2.2, a factory scene, Metric, Unit Scale 1.0, Length in meters, checked 2026-10-15
  - Ryan King Art, "How to Measure and Scale 3D Models in Blender" (https://www.youtube.com/watch?v=2PNiRWStZIo), read 2026-10-15
---

# Units and dimensions

Blender measures in metres, and so does Godot, so a door you build 2.1 m tall in Blender is 2.1 m tall in your game. In this lesson you'll check the scene's units, set objects to exact sizes, and measure the distance between two points.

![Three boxes side by side from the front, each with its height measured: a door 2.1 m tall, a crate 1 m tall and a box 1.8 m tall for a person.](example)

## Steps

1. **Check the units.** In the Properties editor, open the Scene tab and the Units panel. A new file starts with Unit System on Metric, Unit Scale at 1.000 and Length in Meters. Leave them like that for game models.

   ![The Units panel: Unit System Metric, Unit Scale 1.000, Rotation Degrees and Length Meters.](units-panel)

2. **Read the size.** Press `N` and open the Item tab. Dimensions shows the size of the active object along X, Y and Z, measured on the box that fits round it. The default cube is 2 m on every side.

   ![The default cube with each side measured at 2 m.](dimensions)

3. **Type a size.** Click a Dimensions field, type the size and press `Enter`. You can type a unit, as in 90cm. A number with no unit counts as metres, so 0.9 gives the same 0.9 m. Blender changes the Scale to fit.

   ![The Dimensions X field with 90cm typed into it, and the same field afterwards reading 0.9 m.](type-size)

4. **Measure a distance.** Click the Measure tool, the ruler near the bottom of the Toolbar, and drag from one point to another. Hold `Ctrl` while you drag to snap the ends to corners and edges. Select a ruler and press `Delete` to remove it.

   ![A ruler snapped from the bottom corner to the top corner of a 1 m cube, reading 1 m.](measure)

5. **Stand it on the grid.** An object added at the centre of the world is half below the grid. Move it up by half its height so it stands on the floor: `G`, `Z`, then 1.05 for a door 2.1 m tall.

   ![Left, a door half below the grid after it was added. Right, the same door moved up 1.05 m so it stands on the grid.](stand)

## Common mistake

![Left, the default cube with Scale 1 and a measurement of 2 m: scale 1 is not 1 m. Right, a cube with its Dimensions set to 1 m on every side.](mistake)

Scale 1 means an object is as big as when it was made, not 1 m. The default cube is 2 m wide at Scale 1. Read and type sizes in Dimensions instead.

## Checking your model

Select each box in turn and read the Sidebar:

1. The door's Dimensions read 0.9, 0.1 and 2.1 m.
2. The crate's Dimensions read 1 m on every side.
3. The person box's Dimensions read 0.5, 0.3 and 1.8 m.
4. Each box's Location Z is half its height, so it stands on the grid.
5. The Measure tool reads 2.1 m from the bottom to the top of the door.
