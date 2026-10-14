# Low-poly game assets and the road to Godot

> Lesson numbers in this file come from the first outline. Spin and Screw was added afterwards as
> lesson 45, so from 45 on the current number is one higher. `docs/course/COURSE.md` has the current numbers.

The course's projects are low-poly game assets, and its export lessons end with each asset working
in Godot 4. This file collects the facts those lessons rest on: triangle budgets, shading, palette
textures, modular kits, levels of detail, collision, rigged characters, the glTF exporter, and
Godot's importer. Section 10 says what the course does with them.

**How this was checked.** Two research passes on 2026-10-15 plus my own checks in Blender 5.2.2.
Pages were opened and read. Where a fact comes from source code, the file is linked. Kenney's
triangle counts were measured from the CC0 GLB files, by a research pass and by the example model
list in `docs/course/sources/models.md`. Anything seen only in a search snippet is marked
**(snippet only)**.

**Versions.** Godot's current stable release is 4.7.2, dated 18 August 2026
(https://godotengine.org/download/windows/). The "stable" Godot docs are the 4.7 docs. Blender is
5.2 LTS. The glTF exporter's manual page is now
https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html; the old
`addons/import_export/scene_gltf2.html` path no longer exists in 5.2.

---

## 1. Triangle budgets

No engine or asset maker publishes a fixed table. The Polycount wiki says "poly count" means
triangles, ranges from "2 triangles for a billboard, to 40,000+ triangles for a complex character",
and that vertex count matters more than triangles, because UV seams, hard edges and material
changes split vertices. It leaves the number to "your Lead Artist"
(http://wiki.polycount.com/wiki/Polygon_Count). Godot gives no numbers, and says only that skinned
models "may need to lower the polycount considerably"
(https://docs.godotengine.org/en/stable/tutorials/performance/optimizing_3d_performance.html).

So the course measures real low-poly assets and sets budgets a little above them.

**Kenney, CC0, measured from the GLB files:**

| Asset | Pack | Triangles |
| --- | --- | --- |
| Sword | Mini Dungeon | 80 |
| Crate (open) | Pirate Kit | 76 |
| Crate | Platformer Kit | 156 |
| Barrel | Pirate Kit / Mini Dungeon | 148 |
| Potion bottle | Mini Dungeon | 120 |
| Table | Furniture Kit | 120 |
| Chair | Furniture Kit / Mini Dungeon | 170 / 208 |
| Treasure chest | Pirate Kit / Mini Dungeon | 232 / 288 |
| Rock | Survival Kit | 104 |
| Tree | Nature Kit / Survival Kit pine | 114 / 226 |
| Wall piece | Fantasy Town Kit / Mini Dungeon | 80 / 186 |
| Floor piece | Survival Kit / Mini Dungeon | 84 / 2 |
| Small house | City Kit (Suburban) | 770 to 2,062 |
| Character, rigged | Mini Dungeon character-human / Mini Characters | 465 (14 joints) / 711 (7 bones) |

Sources: https://kenney.nl/assets/mini-dungeon, https://kenney.nl/assets/city-kit-suburban,
`docs/course/sources/models.md` (the other packs). Vertex counts run about 1.6 to 1.9 times the
triangle counts because of flat shading and UV splits.

**Quaternius**, from the "Tris" field on Poly Pizza pages (https://poly.pizza/u/Quaternius): rocks
244 to 522, plants 48 to 360, pine trees 1,646 to 4,502, an animated base character 13,744.

**Character ceilings for comparison.** VRChat's performance ranks: PC Excellent is 32,000
triangles, 75 bones and 4 material slots; Quest Excellent 7,500 triangles and 1 material slot
(https://creators.vrchat.com/avatars/avatar-performance-ranking-system/). Unity recommends at most
four bone influences per vertex and few materials
(https://docs.unity3d.com/Manual/ModelingOptimizedCharacters.html). Synty's POLYGON packs are said
to run about 2,000 triangles per character and 500 per prop **(snippet only)**.

## 2. Flat and smooth shading

- Object > Shade Flat and Shade Smooth set every face. Both remove any Smooth by Angle modifier
  and have a Keep Sharp Edges option. Object > Shade Auto Smooth adds a Smooth by Angle modifier,
  pinned last, with an Angle setting
  (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/shading.html).
- Smooth by Angle is a Geometry Nodes asset in the Essentials library, with Angle and Ignore
  Sharpness (https://docs.blender.org/manual/en/5.2/modeling/modifiers/normals/smooth_by_angle.html).
  It replaced the Auto Smooth checkbox in 4.1
  (https://developer.blender.org/docs/release_notes/4.1/modeling/).
- In Edit Mode, Edge > Mark Sharp stores a `sharp_edge` attribute, and Edge > Set Sharpness by Angle
  marks them by angle (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/edge_data.html).
- Custom split normals live in a face-corner attribute, which the manual says are "mostly used in
  game development" for low-poly trees and rounded corners
  (https://docs.blender.org/manual/en/5.2/modeling/meshes/structure.html).
- **The export catch.** With Apply Modifiers off, which is the exporter's default, the glTF exporter
  writes the mesh without its modifiers
  (https://github.com/KhronosGroup/glTF-Blender-IO/blob/main/addons/io_scene_gltf2/blender/exp/nodes.py).
  A Smooth by Angle modifier only reaches Godot when Apply Modifiers is on. Sharp edges marked in
  Edit Mode are mesh data and export either way (an inference from the exporter code).
- glTF triangulates on export, and flat-shaded edges split vertices
  (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html). Godot uses the normals it is
  given; it has no "flat shading" material switch that the course relies on.

## 3. Palette and gradient textures

The method: one small image of colour swatches, one material for many models, and each face's UVs
scaled down onto the swatch it should be.

- **Imphenzia** teaches it as UV colouring. "How to Colorize Low Poly Fast for Games in Blender 4.3"
  (16 January 2025, https://www.youtube.com/watch?v=wymvSs7m1jk; its oEmbed title now reads "How To
  SPEED UP Your BLENDER LOW POLY Modeling Process") covers Lospec palettes, importing a palette
  texture and colourising with it. His 2020 course puts the "UV Coloring Technique" at 02:12, before
  any modelling (https://www.youtube.com/watch?v=1jHUY3qoBu8, Blender 2.83). His character course
  has a chapter "Why is my color a gradient across the character?"
  (https://www.youtube.com/watch?v=PTWV67qUX2k, Blender 3.5).
- **PixPal**, Imphenzia's palette: a 128 by 128 CC0 texture with BaseColor, Emission and
  Attributes maps and a Godot project, "mapping UVs to tiny spots on the palette texture"
  (https://imphenzia.com/imphenzia-pixpal). Its readme, quoted on the Babylon.js forum, says colours
  are "only one pixel in width", so the texture needs nearest filtering and no compression or
  mipmaps (https://forum.babylonjs.com/t/imphenzia-pixpal-palette-texture-pbr-node-material-example-updated-to-version-1-2/56066).
  A version 1.3 with a Godot 4.6.1 project **(snippet only)**.
- **Kenney** does the same at 512 by 512: every Mini Dungeon model has one material and shares
  `Textures/colormap.png` (measured). Kenney's knowledge base says to copy the Textures folder and
  tick "High Quality" on the texture import in Godot
  (https://kenney.nl/knowledge-base/game-assets-3d/importing-3d-models-into-game-engines).
- **Papaya Games** describes the same pipeline from Blender to Godot with one shared material, and
  notes "One of the more costly operations in rendering is the material change"
  (https://papaya-games.itch.io/duck-in-town/devlog/73530/blazing-fast-rendering-with-a-single-material-per-scene).
- **Filtering survives the trip.** An Image Texture node set to Closest exports glTF sampler mag
  NEAREST and min NEAREST_MIPMAP_NEAREST
  (https://github.com/KhronosGroup/glTF-Blender-IO/blob/main/addons/io_scene_gltf2/blender/exp/sampler.py),
  and Godot reads that as Nearest with mipmaps on the imported material
  (https://github.com/godotengine/godot/blob/4.7/modules/gltf/structures/gltf_texture_sampler.h).
- **A warning.** UV islands scaled to a point break anything that needs real UVs, such as light
  baking (https://github.com/RouBroeck/UV-Colorize). Godot's lightmapper makes its own UV2 on import,
  so this matters only for baking inside Blender.

## 4. Modular kits

- **Footprints divide into each other.** Skyrim's kits: "a 512x512x512 room will always tile nicely
  with a 256x256x256 hallway, but a 384x384x384 room will eventually create gaps". Snap sizes stay
  large, pivots sit "at the ground plane of the kit and in the center", and names use L/R and 01/02
  suffixes (Joel Burgess, GDC 2013, http://blog.joelburgess.com/2013/04/skyrims-modular-level-design-gdc-2013.html).
- **One unit is one metre** in Godot, and modular meshes "should be built to snap to a unit-based
  grid" (http://wiki.polycount.com/wiki/Units).
- **Kenney's Mini Dungeon, measured:** 1 by 1 m tiles from -0.5 to 0.5 on X and Z, origin at the
  bottom centre, walls 1.1 m tall.
- **Godot's GridMap** has a cell size of 2 by 2 by 2 m by default, centred on X, Y and Z; the docs
  say to set the size to your piece size and untick Center Y
  (https://docs.godotengine.org/en/stable/classes/class_gridmap.html). A MeshLibrary is a scene with
  a Node3D root and one MeshInstance3D per tile, each with at most one StaticBody3D and one
  NavigationRegion3D, exported with Scene > Export As... > MeshLibrary
  (https://docs.godotengine.org/en/stable/tutorials/3d/using_gridmaps.html). Godot 4.7 added a
  MeshLibrary editor (https://godotengine.org/releases/4.7/).

## 5. Levels of detail and collision

- **LODs are automatic.** Godot generates mesh LODs on import for glTF, .blend and FBX with
  meshoptimizer, picks them by screen size (1 pixel threshold by default), and has a per-node LOD
  Bias. It can break skinned meshes, and can be switched off per scene or per mesh
  (https://docs.godotengine.org/en/stable/tutorials/3d/mesh_lod.html). 4.6 improved how well LODs
  keep their shape (https://godotengine.org/releases/4.6/).
- **Hand-made LODs** use visibility ranges: Begin, End, margins and Fade Mode
  (https://docs.godotengine.org/en/stable/tutorials/3d/visibility_ranges.html).
- **Collision from the Advanced Import Settings:** per mesh, Physics > Generate, with Body Type
  Static, Rigid or Area and a Shape Type of Decompose Convex, Single Convex, Trimesh, Box, Sphere,
  Cylinder, Capsule or Automatic (default)
  (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/advanced_import_settings.html;
  labels from https://github.com/godotengine/godot/blob/4.7/editor/import/3d/resource_importer_scene.cpp).
- **Collision from names.** See section 8. Empties named `-colonly` only become shapes when imported
  from Collada, and Blender 5 no longer exports Collada, so collision shapes must be meshes.

## 6. Rigged and animated characters

- **Keep the rig small.** Kenney's characters use 7 and 14 bones (measured). Rigify's deform bones
  are in the DEF collection (https://docs.blender.org/manual/en/5.2/addons/rigify/basics.html), but
  they are parented to ORG bones, which Rigify's maintainer calls "not good for export … a known
  limitation" (https://devtalk.blender.org/t/rigify-parent-bones-of-some-def-bones/14745). The
  course rigs its character with a plain armature and teaches Rigify as a lesson of its own.
- **Actions.** Since 4.4 actions are slotted, so one action can animate several data-blocks
  (https://developer.blender.org/docs/release_notes/4.4/animation_rigging/,
  https://docs.blender.org/manual/en/5.2/animation/actions.html). Push Down moves the active action
  onto a new NLA track; Stash moves it onto a muted track; New Action stashes the previous one
  (https://docs.blender.org/manual/en/5.2/editors/dope_sheet/modes/action.html).
- **What the glTF exporter takes** (manual page above, and the 5.2 add-on source,
  https://projects.blender.org/blender/blender/raw/branch/blender-v5.2-release/scripts/addons_core/io_scene_gltf2/__init__.py):
  - Animation Mode Actions is the default. It exports the active action plus stashed and NLA
    actions: "If you have multiple actions you want to export, make sure they are stashed!" Each
    glTF animation is named after its action.
  - Other modes: Active Actions merged, NLA Tracks, Scene, and an undocumented Broadcast.
  - Export all Armature Actions and Reset Pose Bones Between Actions are on by default.
  - Since 4.4, tracks are merged by the action they use, not by track name
    (https://developer.blender.org/docs/release_notes/4.4/pipeline_assets_io/).
- **Godot side.** Root motion is set on the AnimationTree and read with `get_root_motion_position()`
  (https://docs.godotengine.org/en/stable/tutorials/animation/animation_tree.html). Retargeting maps
  bones with a BoneMap and SkeletonProfileHumanoid and recommends "common English names for bones"
  (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/retargeting_3d_skeletons.html).
- Kenney's idle and walk animations carry no loop suffix (measured), so their looping is set in
  Godot's import dialog.

## 7. The glTF exporter in Blender 5.2

Options from https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html. Defaults checked in
5.2.2 (`bpy.ops.export_scene.gltf`) and in the add-on source (version 5.2.40).

- **Format:** glTF Binary (.glb) by default; glTF Separate (.gltf, .bin and textures) is the other
  choice.
- **Include:** Selected Objects off by default, so the whole scene goes out. Visible, Renderable,
  Active Collection and Active Scene filters exist. Custom Properties off (on exports them as glTF
  `extras`).
- **Transform:** +Y Up on.
- **Data > Mesh:** Apply Modifiers **off** (the source warns that on "prevents exporting shape
  keys"), UVs on, Normals on, Tangents off. Use Vertex Color: Material, which exports a colour
  attribute only when the material uses it.
- **Data > Material:** Materials Export, Images Automatic. Principled BSDF base colour, metallic and
  roughness, a tangent-space normal map through a Normal Map node, emission, and alpha (Opaque,
  Mask or Blend) are carried. Images go out as PNG or JPEG.
- **Backface culling:** the material's Backface Culling setting decides glTF `doubleSided`.
- **Armature:** Export Deformation Bones Only off, Add Leaf Bones off, Use Rest Position Armature
  on, four bone influences.
- **Animation:** Animations on, Always Sample Animations on.
- **Collection Exporters** let a collection remember its export settings.
- Collada is gone in 5.0 (https://developer.blender.org/docs/release_notes/5.0/pipeline_io/).

## 8. Godot's side of the import

**Axes and scale.** Godot is Y-up and right-handed; cameras look along -Z and assets face +Z. "In
Blender, this means that +Y is rear and -Y is front." The same page says to apply transforms,
triangulate before export and export in rest pose
(https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/model_export_considerations.html).
Blender's Apply resets location, rotation and scale while keeping the shape, and should be done
before rigging (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/apply.html).
Godot's Apply Root Scale is on and Root Scale is 1.0 by default (resource_importer_scene.cpp).

**Formats.** glTF is recommended. Godot can import a .blend directly by running Blender's glTF
exporter: it needs Blender 3.0 or later (3.5 recommended), the path in Editor Settings > FileSystem
> Import > Blender > Blender Path, and Blender on every team member's machine
(https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/available_formats.html).
A .blend import applies modifiers and exports custom properties by default
(https://github.com/godotengine/godot/blob/4.7/modules/gltf/editor/editor_scene_importer_blend.cpp).

**Import options**
(https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/import_configuration.html):
Root Type and Root Name; animation FPS 30; an import script (`_post_import(scene)`); embedded
textures extracted by default. Per mesh: Ensure Tangents on, Generate LODs on, Create Shadow Meshes
on, Light Baking Static (Static Lightmaps makes UV2, texel size 0.2). The Advanced Import Settings
dialog extracts materials or swaps them for external ones, and sets each animation's loop mode
(None, Linear, Pingpong) (https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/advanced_import_settings.html).
Godot 4.5 added a `materials/extract` option in the Import dock (found by comparing branch sources;
the docs page doesn't list it yet). An inherited scene adds nodes without touching the import
(https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/import_process.html).

**Name suffixes**, from the 4.7 page
https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/node_type_customization.html.
They work with `-`, `$` or `_` and are case-insensitive. Trailing digits are stripped, so
`Crate-col.001` still matches.

| Suffix | Effect |
| --- | --- |
| `-noimp` | Not imported (nodes and animations) |
| `-col` | Keeps the mesh, adds a static trimesh collision |
| `-convcol` | Keeps the mesh, adds a convex collision |
| `-colonly` | Removes the mesh, makes a StaticBody3D with trimesh collision |
| `-convcolonly` | Removes the mesh, makes a StaticBody3D with convex collision |
| `-occ`, `-occonly` | Adds an occluder, or replaces the mesh with one |
| `-navmesh` | Replaces the mesh with a navigation mesh |
| `-rigid` | RigidBody3D |
| `-vehicle`, `-wheel` | VehicleBody3D and VehicleWheel3D |
| `-loop`, `-cycle` | On an animation name (start or end): the animation loops. "In Blender, this requires using the NLA Editor and naming the Action…" |
| `-alpha` | Material gets alpha transparency |
| `-vcol` | Material takes albedo from vertex colours |

Empties with `-colonly` choose a shape from their display type, but only from Collada files, which
Blender 5 can't write. The page now has an opting-out section (`nodes/use_node_type_suffixes`,
`nodes/use_name_suffixes`); it is otherwise the same in 4.5 and 4.7.

**Materials** (https://github.com/godotengine/godot/blob/4.7/modules/gltf/gltf_document.cpp):
glTF materials become StandardMaterial3D. Base colour goes to albedo; metallic and roughness come
from the B and G channels; normal maps, emission (with KHR_materials_emissive_strength) and unlit
are carried. `doubleSided` gives Cull Disabled; Blend gives depth pre-pass alpha; Mask gives alpha
scissor at 0.5. A COLOR_0 vertex colour attribute switches on albedo from vertex colour. Only two UV
maps are read. Procedural Blender materials don't survive and have to be baked to images.

## 9. Gotchas the lessons must head off

- **Faces vanish in Godot.** Blender's materials have Backface Culling off by default, so Godot
  imports them as double-sided (Cull Disabled) and inside-out faces stay hidden until someone turns
  culling on. Turn Backface Culling on in Blender, then fix any red faces with the Face Orientation
  overlay and `Shift+N` (available_formats page above;
  https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/normals.html).
- **Modifiers missing in Godot.** Apply Modifiers is off by default.
- **Shape keys missing.** Apply Modifiers on drops shape keys; with blend shapes, the Godot docs
  also advise Export Deformation Bones Only.
- **Only one animation exports.** In Actions mode, actions that are neither active, stashed nor on
  an NLA track are left out.
- **Wrong size or lying flat.** Unapplied scale or rotation, especially on armatures. One forum case:
  props imported tiny with stretched UVs because Godot used the second of two UV maps
  (https://forum.godotengine.org/t/import-process-ignores-scales-and-uvs/109528).
- **Huge bounding box.** An object far from its origin
  (https://forum.godotengine.org/t/noob-needs-help-huge-bounding-box/110399).
- **Missing textures.** glTF Separate needs its files kept together; Kenney's packs need their
  Textures folder. A .glb embeds them.
- **Blurry palette.** A palette image left on Linear filtering bleeds between swatches. Set Closest
  in Blender, or Nearest in Godot.

## 10. What the course takes from this

- **Budgets.** Each project sets a triangle limit about twice the Kenney reference: potion 250,
  crate 300, barrel 300, sword 200, chest 500, table and chair 300 each, rock 300, tree 400, wall
  piece 200, character 2,000 (well under the Quest "Excellent" 7,500). The budgets are course
  choices and say so.
- **Orientation.** Every prop faces -Y in Blender, has its origin at its base centre and its scale
  applied. The `dimensions` and `scaleApplied` measurements check this.
- **Shading.** Low-poly props use Shade Flat or marked sharp edges. If a project uses Shade Auto
  Smooth, its export lesson turns Apply Modifiers on.
- **Colour.** Material slots first (lesson "A low-poly chest"), then one shared palette texture with
  Closest interpolation (lesson "Palette textures"), which is what Kenney and Imphenzia do. Vertex
  colours are taught as the alternative that needs no texture at all.
- **Export.** .glb from File > Export > glTF 2.0, Selected Objects on, Apply Modifiers on, +Y Up on.
  The first export comes early (lesson "Exporting to Godot", after the crate), and every later
  project ends in Godot.
- **Collision.** A separate low box or convex mesh named `-colonly` or `-convcolonly`, or Godot's
  Advanced Import Settings. Never empties.
- **LODs.** Let Godot generate them; teach Decimate for a hand-made LOD and visibility ranges.
- **Characters.** A plain armature of about 15 bones, four or fewer influences per vertex, actions
  named idle and walk and stashed or pushed down, loop set by a `-loop` name or in Godot's import
  dialog.
- **Modular kits.** Pieces on a 2 m grid (Godot's GridMap default) with origins on the ground plane,
  exported as one .glb and turned into a MeshLibrary.
