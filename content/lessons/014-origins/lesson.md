---
needs: [pivot-orientation]
exercise: fix-the-origins
watch: [cgcookie-mesh-components, blender-manual-scene-layout-object-origin]
sources:
  - Blender 5.2 Manual, "Object Origin", the dot that shows the origin, Object > Set Origin with Origin to Geometry and Origin to 3D Cursor (https://docs.blender.org/manual/en/5.2/scene_layout/object/origin.html), read 2026-10-15
  - Blender 5.2 Manual, "Tool Settings", Options, Affect Only Origins (Ctrl+Period) in the Sidebar's Tool tab (https://docs.blender.org/manual/en/5.2/scene_layout/object/tools/tool_settings.html), read 2026-10-15
  - Blender 5.2 Manual, "Transform" properties, Location is the position of the object's origin (https://docs.blender.org/manual/en/5.2/scene_layout/object/properties/transforms.html), read 2026-10-15
  - Blender 5.2 Manual, "Individual Origins", each object turns around its origin (https://docs.blender.org/manual/en/5.2/editors/3dview/controls/pivot_point/individual_origins.html), read 2026-10-15
  - Blender 5.2.2, Origin to Geometry puts a box's origin at its middle; the exercise's crate, door and lamp fixed this way, checked 2026-10-15
  - CG Cookie, "Mesh Components and Object Origins in Blender" (https://www.youtube.com/watch?v=eJH0hxlhd5M), read 2026-10-15
---

# Origins

Every object has an origin, the point Blender moves, turns and scales it around. In this lesson you'll put origins where they are useful. A prop's origin goes at the middle of its base, so it stands on the floor at height 0. A door's goes on its hinge, so it swings open.

![A crate with its origin at the middle of its base, and a door with its origin at the bottom of its hinge edge, swinging open around it.](example)

## Steps

1. **Find the origin.** Select an object and look for the small orange dot: that is its origin. The Location in the Sidebar's Item tab is where the origin is, which may be nowhere near the mesh.

   ![A crate with its origin floating above and behind it, and the Location field giving the dot's position.](find)

2. **Bring it to the middle.** Choose Object > Set Origin > Origin to Geometry. The origin moves to the middle of the mesh, and the mesh stays where it is.

   ![Left, the origin outside the crate. Right, after Origin to Geometry, the origin at the crate's middle.](to-geometry)

3. **Move only the origin.** Press `Ctrl+.` to turn on Affect Only Origins, which is also under Options in the Sidebar's Tool tab. Now `G` moves the origin and leaves the mesh where it is.

   ![The origin moving down on its own with G while the crate stays still.](affect-origins)

4. **Drop it to the base.** Press `G`, `Z` and type minus half the object's height, -0.5 for a 1 m crate. The origin is now at the middle of the crate's base, so Location Z 0 stands it on the floor.

   ![The crate with its origin at the middle of its base and a 0.5 m measurement from its middle down to the base.](base)

5. **Put a door's origin on its hinge.** Move the origin half the door's width sideways and half its height down: `G`, `X`, -0.45 and `G`, `Z`, -1.05 for a door 0.9 by 2.1 m. Press `Ctrl+.` again, then rotate the door around Z to check.

   ![Seen from the top, a door with its origin at one end, swinging open around it.](hinge)

6. **Use the 3D cursor.** Object > Set Origin > Origin to 3D Cursor puts the origin wherever the cursor is. With the cursor at the centre of the world, that is the base of anything standing there.

   ![A lamp post standing on the centre of the world, its origin moving from the top of the lamp down to the 3D cursor at its base.](to-cursor)

## Common mistake

![Left, with Affect Only Origins still on, G moves only the orange dot and the crate stays behind. Right, with it off, the crate and its origin move together.](mistake)

Affect Only Origins stays on until you turn it off. While it's on, `G` moves only the orange dot, and the object itself won't move or turn. Press `Ctrl+.` to turn it off as soon as the origin is in place.

## Checking your work

Select each object and read the Sidebar's Item tab:

1. The crate's Location reads -3, 0 and 0.
2. The lamp's Location reads 0, 0 and 0.
3. The door's Location reads 2.55, 0 and 0.
4. Rotating the door around Z swings it on its left edge.
5. Affect Only Origins is off again.
