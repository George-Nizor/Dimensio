---
needs: [game-ready]
exercise: collide-three-props
watch: [stayathomedev-godot-blender, godot-docs-node-type-suffixes]
sources:
  - Godot 4 docs, "Node type customization using name suffixes", -col, -convcol, -colonly, -convcolonly and empties in Collada files (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/node_type_customization.html), read 2026-10-15
  - Godot 4 docs, "Advanced Import Settings", Generate > Physics, Body Type and Shape Type (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/advanced_import_settings.html), read 2026-10-15
  - Godot 4 docs, "Collision shapes (3D)", primitive, convex and concave shapes (https://docs.godotengine.org/en/stable/tutorials/physics/collision_shapes_3d.html), read 2026-10-15
  - Godot 4 docs, "Physics introduction", never scale collision shapes (https://docs.godotengine.org/en/stable/tutorials/physics/physics_introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Convex Hull" (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/convex_hull.html), read 2026-10-15
  - Blender 5.2 Manual, "Viewport Display", Display As (https://docs.blender.org/manual/en/5.2/scene_layout/object/properties/display.html), read 2026-10-15
  - Blender 5.2 Manual, "Apply", Scale (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/apply.html), read 2026-10-15
  - Blender 5.0 release notes, Collada import and export removed (https://developer.blender.org/docs/release_notes/5.0/pipeline_io/), read 2026-10-15
  - Exports from Blender 5.2.2 imported into Godot 4.7.2 on 2026-10-15, checking what each suffix, an empty and a scaled mesh become
  - 'StayAtHomeDev, "Godot 4 and Blender: Setup and Importing" (https://www.youtube.com/watch?v=6TsdmFvkw9w), checked 2026-10-15'
---

# Collision shapes

A game doesn't test collisions against the mesh you see. It uses simpler shapes, which are quicker to check and cause fewer glitches. In this lesson you'll wrap each prop in a low collision mesh and name it so that Godot turns it into a physics body on import.

![The crate inside a slightly larger box and the barrel inside an eight-sided cylinder, both collision meshes drawn as wires.](example)

## Steps

1. **Wrap the prop in a simple shape.** Add a cube and scale it in Edit Mode until it covers the crate. Wrap the barrel in a cylinder with 8 vertices. For an irregular prop, duplicate it and choose Mesh > Convex Hull in Edit Mode.

   ![Left, the crate inside a box of 12 triangles. Right, the barrel inside a cylinder of 8 vertices, 28 triangles.](wrap)

2. **Draw it as a wire.** In the Object properties' Viewport Display panel, set Display As to Wire, so you can see the prop through it. A collision mesh needs no material and no UV map, since the game never draws it.

   ![The Viewport Display panel with Display As set to Wire, beside the crate seen solid inside its wire collision box.](wire)

3. **Name it with a suffix.** Press `F2` and name it CrateCollision-convcolonly. On import, Godot removes the mesh and builds a StaticBody3D with a convex shape from it. Use -colonly for a shape with hollows, such as an arch that never moves.

   ![The Outliner with Crate and CrateCollision-convcolonly, and the tree Godot makes: a StaticBody3D called CrateCollision holding a CollisionShape3D.](names)

4. **Keep its scale at 1.** Godot copies the object's scale onto the StaticBody3D, and Godot's physics docs say never to scale collision shapes. If you scaled the collision mesh in Object Mode, press `Ctrl+A` > Scale before you export.

   ![The Sidebar's Scale fields reading about 1.05 before Ctrl+A > Scale, and 1.000 after.](scale)

5. **Or let Godot make the shape.** In Advanced Import Settings, select the prop's node, tick Generate > Physics and set Shape Type to Box, Cylinder or Capsule. Godot's docs call these primitive shapes the fastest and most reliable.

   ![Advanced Import Settings with the chest's node selected, Generate Physics ticked, Body Type Static and Shape Type Box.](generate)

## Common mistake

![Left, an empty named Crate-colonly arrives in Godot as a plain Node3D with no collision. Right, a mesh box with the suffix becomes a StaticBody3D with a CollisionShape3D.](mistake)

Older tutorials make a box by naming an empty Crate-colonly. Godot builds a shape from an empty only in Collada files, which Blender 5.2 can't write. From glTF the empty arrives as a plain Node3D with no collision, so use a mesh.

## Checking your model

Look at each collision mesh, then at Godot:

1. Each collision mesh shows as a wire around its prop.
2. Each name ends in -convcolonly or -colonly.
3. The Sidebar shows scale 1 on every collision mesh.
4. Statistics shows each collision mesh under 50 triangles.
5. In an inherited scene, each prop has a StaticBody3D with a CollisionShape3D.
