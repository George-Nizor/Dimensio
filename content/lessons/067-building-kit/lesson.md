---
needs: [palette-texture, collision, modular-kit]
exercise: small-building-kit
watch: [godot-docs-using-gridmaps, grant-abbitt-game-asset-tips]
sources:
  - Godot 4 docs, "Using GridMaps", the MeshLibrary scene layout, Scene > Export As... > MeshLibrary..., the Mesh Library property, Cell Size, unticking Center Y and the GridMap panel (https://docs.godotengine.org/en/stable/tutorials/3d/using_gridmaps.html), read 2026-10-15
  - Godot 4 docs, "GridMap", cell_size and cell_center_y (https://docs.godotengine.org/en/stable/classes/class_gridmap.html), read 2026-10-15
  - Godot 4 docs, "Node type customization using name suffixes", -col (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/node_type_customization.html), read 2026-10-15
  - Godot 4.7 source, mesh_library_editor_plugin.cpp, items named after their nodes, with collision from StaticBody3D children (https://github.com/godotengine/godot/blob/4.7/editor/scene/3d/mesh_library_editor_plugin.cpp), read 2026-10-15
  - Godot 4.7 source, editor_node.cpp, the Export As MeshLibrary options Merge With Existing and Apply MeshInstance Transforms (https://github.com/godotengine/godot/blob/4.7/editor/editor_node.cpp), read 2026-10-15
  - Blender 5.2 Manual, "glTF 2.0" (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15
  - A Blender 5.2.2 export with a -col piece imported into Godot 4.7.2 on 2026-10-15, checking that the mesh keeps a StaticBody3D child
---

# A small building kit

In this project you'll use everything from this part. You'll build a kit of eight to ten pieces on a 2 m grid, colour them from one palette and give them collision. Then you'll turn the kit into a MeshLibrary in Godot and lay out a small building with a GridMap.

![A small building laid out from the kit: two by two cells of floor, walls with a door and a window at the front, corner pieces and a flat roof.](example)

## Steps

1. **Build the pieces.** Make eight to ten pieces on the 2 m grid from lesson 66, such as floor_2m, wall_2m, wall_door, wall_window, wall_corner and roof_2m. Keep each under 200 triangles, with its origin at the centre of its cell.

   ![Six of the kit's pieces, each in its own cell: floor_2m, wall_2m, wall_door, wall_window, wall_corner and roof_2m.](pieces)

2. **Colour them from one palette.** Give every piece the same palette material, and place each face's UVs on a swatch as in lesson 57. The whole kit then shares one material and one small image.

3. **Name them for collision.** Add -col to each name, such as wall_2m-col. Godot keeps the mesh and gives it a StaticBody3D child shaped like it, which is the layout a MeshLibrary reads. Spread the pieces out and export them all in one .glb.

   ![The Outliner with wall_2m-col picked out, and the tree Godot makes: wall_2m as a MeshInstance3D holding a StaticBody3D and a CollisionShape3D.](col)

4. **Make the MeshLibrary.** In Godot, choose Scene > New Inherited Scene… and pick the .glb. Then choose Scene > Export As… > MeshLibrary… and save it as kit.tres. Each piece becomes an item named after its node.

   ![The Scene menu with Export As and MeshLibrary picked out, and the save options Merge With Existing on and Apply MeshInstance Transforms off.](meshlib)

5. **Set up a GridMap.** Add a GridMap node and drag kit.tres onto its Mesh Library property. Under Cell, set Size to 2, 2.5 and 2, and untick Center Y. The GridMap panel at the bottom lists every piece.

   ![A GridMap's Inspector with Mesh Library set to kit.tres, Cell Size 2, 2.5, 2 and Center Y unticked, beside the GridMap panel's list of pieces.](gridmap)

6. **Lay out the building.** Pick a piece in the GridMap panel and click in the viewport to place it. Cursor Rotate Y turns the next piece, and Change Grid Floor moves up a level for the roof.

## Common mistake

![From the side. Left, Center Y on: the floors and walls float above the ground line. Right, Center Y off: they stand on it.](mistake)

A GridMap starts with Center Y on, which centres each piece in the height of its cell. The whole building then floats 1.25 m above the ground. Untick Center Y, as Godot's docs say, and every piece sits on its cell's floor.

## Checking your model

Check the kit in Blender, then the building in Godot:

1. Statistics shows each piece under 200 triangles.
2. Every piece uses the one palette material.
3. Every piece's name ends in -col.
4. The GridMap panel lists every piece by name.
5. Pieces placed side by side meet with no gaps.
