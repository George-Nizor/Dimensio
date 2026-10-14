# What changed in Blender 4.x and 5.x that a lesson must get right

> Lesson numbers in this file come from the first outline. Spin and Screw was added afterwards as
> lesson 45, so from 45 on the current number is one higher. `docs/course/COURSE.md` has the current numbers.

The course is written for Blender 5.2 LTS. Most free tutorials a learner will find were made with
3.x or 4.x, and several things they show no longer work the way they say. This file lists the
changes that touch a beginner or game-asset lesson, with the release note or manual page for each.

**How this was checked.** On 2026-10-15 I read the official release notes for 4.0 to 5.2
(developer.blender.org/docs/release_notes/), the Blender 5.2 manual, and Blender 5.2.2 LTS itself.
The Blender checks ran headless on this machine (`blender.exe -b --factory-startup --python`) and
read the bundled UI and keymap scripts under `5.2/scripts/`. Where a fact comes from Blender itself
rather than a web page, it says "checked in 5.2.2".

Blender 5.2 LTS was released on 14 July 2026 and is supported until July 2028
(https://developer.blender.org/docs/release_notes/5.2/). Blender 5.3 is in beta until 4 November
2026 (https://developer.blender.org/docs/release_notes/5.3/), so lessons should say "5.2" and not
"the latest version".

---

## 1. Changes that alter a beginner lesson

These change a key, a menu path, a default, or a name a lesson uses.

| Change | Version | What a lesson must say | Source |
| --- | --- | --- | --- |
| Auto Smooth is gone from Object Data > Normals. Object > Shade Auto Smooth adds a Smooth by Angle modifier (a Geometry Nodes asset) pinned to the bottom of the stack. Shade Smooth and Shade Flat remove that modifier. Edit Mode has Set Sharpness by Angle. | 4.1, operator in 4.2 | Teach Object > Shade Flat, Shade Smooth and Shade Auto Smooth, and the Smooth by Angle modifier. Never "tick Auto Smooth". | https://developer.blender.org/docs/release_notes/4.1/modeling/, https://developer.blender.org/docs/release_notes/4.2/modeling/, https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/shading.html, https://docs.blender.org/manual/en/5.2/modeling/modifiers/normals/smooth_by_angle.html |
| `I` in the 3D Viewport inserts a keyframe at once, on the channels set in Preferences > Animation. `K` opens the Keying Set menu. `Shift+K` changes the active keying set. | 4.1 | "Press `I` to key location, rotation and scale." No menu appears. | https://developer.blender.org/docs/release_notes/4.1/animation_rigging/ |
| Up Arrow jumps to the previous keyframe and Down Arrow to the next. It used to be the other way round. | 5.0 | Up is previous, Down is next. Checked in 5.2.2's `blender_default.py`: `UP_ARROW` has `next: False`. | https://developer.blender.org/docs/release_notes/5.0/user_interface/ |
| "Toggle Maximize Area" with `Ctrl+Space` is now called Focus Mode. | 5.0 | Call it Focus Mode. | https://developer.blender.org/docs/release_notes/5.0/user_interface/ |
| The number keys that hide and show collections moved from the 3D Viewport to the Outliner. | 5.0 | In the viewport, `1`, `2`, `3` switch vertex, edge and face select in Edit Mode. Collection numbers work with the mouse over the Outliner. | https://developer.blender.org/docs/release_notes/5.0/user_interface/ |
| Menus and popups stay open until a click closes them (a preference restores the old behaviour). | 5.0 | Don't tell learners that moving the mouse away closes a menu. | https://developer.blender.org/docs/release_notes/5.0/user_interface/ |
| "Use Nodes" is gone for materials and worlds (5.0) and for lights (5.1). They always use nodes. | 5.0, 5.1 | Never "click Use Nodes". A new material already has a Principled BSDF. | https://developer.blender.org/docs/release_notes/5.0/rendering/, https://developer.blender.org/docs/release_notes/5.1/user_interface/ |
| EEVEE was rewritten ("EEVEE Next"). Bloom, Screen Space Reflections and Ambient Occlusion toggles are gone; ray tracing is one option. Bloom is now the compositor's Glare node with the Bloom type. Material Blend Mode became Render Method (Dithered or Blended). Shadow Mode moved to Object > Visibility. | 4.2 | Glow comes from the Glare node. Transparency is set with Material > Settings > Render Method. | https://developer.blender.org/docs/release_notes/4.2/eevee/, https://developer.blender.org/docs/release_notes/4.2/eevee_migration/, https://docs.blender.org/manual/en/5.2/compositing/types/filter/glare.html |
| The compositor's Composite node was removed. The node tree ends in a Group Output node whose first input must be a colour. "Use Nodes" in the compositor is gone, and the compositing tree is its own data-block. | 5.0 | Render Layers into Group Output. Older tutorials that add a Composite node no longer match. | https://developer.blender.org/docs/release_notes/5.0/compositor/ |
| Many render passes were renamed: `DiffCol` is Diffuse Color, `IndexMA` is Material Index, `Z` is Depth. | 5.0 | Use the new pass names. | https://developer.blender.org/docs/release_notes/5.0/rendering/ |
| Add Modifier > Generate > Array now adds a new Geometry Nodes based Array modifier (shapes Line, Circle, Curve, Transform; gizmos; randomisation). The old one is listed as Array (Legacy). Curve to Tube and Scatter on Surface are also node based, and more (Instance on Elements, Randomize Instances, Geometry Input) arrived in 5.0. | 5.0 | Say which Array the lesson means. Checked in 5.2.2: the Generate menu lists "Array" (the node asset from `geometry_nodes_essentials.blend`) and then "Array (Legacy)". With default settings the new Array outputs a real mesh, not instances. | https://developer.blender.org/docs/release_notes/5.0/modeling/, https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/array.html, https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/array_legacy.html |
| The Boolean solver "Fast" is now called "Float". A third solver, Manifold, was added in 4.5 and is more robust but needs manifold inputs. | 4.5, 5.0 | Solvers are Float, Exact and Manifold. | https://developer.blender.org/docs/release_notes/5.0/modeling/, https://developer.blender.org/docs/release_notes/4.5/modeling/ |
| UV Sync Selection is on by default, can select individual UVs, and all UV maps share one selection. | 5.0 | A learner opening the UV Editor sees the 3D selection mirrored. Lessons that say "turn on sync selection" are out of date. | https://developer.blender.org/docs/release_notes/5.0/modeling/ |
| Merge by Distance has a Centroid option, on by default, and picks the target vertex deterministically. "Remove Doubles" has been Merge by Distance since 2.80. | 5.0 | Mesh > Clean Up > Merge by Distance, or `M` > By Distance. | https://developer.blender.org/docs/release_notes/5.0/modeling/ |
| Applying scale to an object with negative scale now flips its normals automatically (an option in the Apply redo panel, on by default). | 5.1 | Ctrl+A > Scale no longer leaves inside-out faces after a mirror by scale. | https://developer.blender.org/docs/release_notes/5.1/modeling/ |
| "Absolute Grid Snap" was replaced by a snap target called Snap to Grid. | 4.2 | Snapping popover > Snap To > Grid. | https://developer.blender.org/docs/release_notes/4.2/modeling/ |
| Snapping to face centres. | 5.1 | Available in the snap popover. | https://developer.blender.org/docs/release_notes/5.1/modeling/ |
| LoopTools' Circle, Space and Flatten are built in as To Circle, Space Edge Loops Evenly and Flatten. | 5.2 | No add-on is needed for these. | https://developer.blender.org/docs/release_notes/5.2/modeling/ |
| Selection now works through back-face culled faces. | 5.2 | With Backface Culling on, you can still click faces behind. | https://developer.blender.org/docs/release_notes/5.2/modeling/ |
| Mouse Button 4 frames the selection, alongside `Numpad .`. | 5.2 | A second way to frame on mice with side buttons. Checked in 5.2.2's keymap. | https://developer.blender.org/docs/release_notes/5.2/user_interface/ |
| Brushes are assets (4.3). The asset shelf at the bottom of the viewport is where you pick them, or `Shift+Space`. Brush size is now a diameter, not a radius (5.0). Many single-key brush shortcuts were removed in 4.0, including `Ctrl+D` for Dyntopo. | 4.0, 4.3, 5.0 | Pick brushes from the asset shelf. Don't give old brush hotkeys. | https://developer.blender.org/docs/release_notes/4.3/sculpt/, https://developer.blender.org/docs/release_notes/5.0/sculpt/, https://developer.blender.org/docs/release_notes/4.0/keymap/ |
| Grease Pencil was rewritten (v3). Layer groups, brush assets, and a new radius unit. In 5.1, fills no longer depend on materials: the Draw tool has Stroke, Fill or Both, and fills can have holes. | 4.3, 5.1 | Teach fills with the tool setting, not with fill materials. | https://developer.blender.org/docs/release_notes/4.3/grease_pencil/, https://developer.blender.org/docs/release_notes/5.1/grease_pencil/ |
| Actions are "slotted": one action can hold animation for several data-blocks, and assigning an action also needs a slot. | 4.4 | The Action Editor and the Object properties show an Action and a Slot. | https://developer.blender.org/docs/release_notes/4.4/animation_rigging/ |
| Add-ons became extensions, installed from Edit > Preferences > Get Extensions (needs Allow Online Access) or from disk. Most add-ons that used to ship with Blender now come from extensions.blender.org. Rigify, Node Wrangler, glTF, FBX and a few others still ship as core add-ons. | 4.2 | "Get it from Get Extensions", not "enable it in Add-ons". Checked in 5.2.2: `scripts/addons_core` holds io_scene_gltf2, io_scene_fbx, io_anim_bvh, io_curve_svg, io_mesh_uv_layout, node_wrangler, pose_library, rigify, ui_translate, viewport_vr_preview, cycles, hydra_storm and bl_pkg. | https://developer.blender.org/docs/release_notes/4.2/extensions/, https://docs.blender.org/manual/en/5.2/editors/preferences/extensions.html |
| Collada (.dae) import and export were removed. A new C++ FBX importer is the default; the Python one is "FBX (Legacy)". | 5.0 | No Collada. FBX import goes through the new importer. | https://developer.blender.org/docs/release_notes/5.0/pipeline_io/, https://docs.blender.org/manual/en/5.2/files/import_export/fbx.html |
| .blend files are compressed when saved, by default. | 5.0 | Nothing to teach, but file sizes differ from older tutorials. | https://developer.blender.org/docs/release_notes/5.0/core/ |
| The Sequencer no longer uses the window's active scene. It uses a Sequencer Scene per workspace, chosen in its header. Strip properties moved to the Properties editor. `Shift+A` drops a strip at the mouse. | 5.0 | Video editing lessons start from the Video Editing template, whose scene is called "Edit". | https://developer.blender.org/docs/release_notes/5.0/sequencer/, https://docs.blender.org/manual/en/5.2/video_editing/sequencer_scene.html |
| Asset libraries have their own Preferences page. Online asset libraries can be registered and browsed, and the Essentials library gains online assets, when Allow Online Access is on. | 5.2 | Preferences > Asset Libraries. | https://developer.blender.org/docs/release_notes/5.2/assets/ |
| Custom asset libraries import by Packing by default (packed linked data stored in the file). | 5.0 | The Asset Browser's import method menu has a Pack option. | https://developer.blender.org/docs/release_notes/5.0/assets/, https://developer.blender.org/docs/release_notes/5.0/core/ |
| The Preferences window has a search field. | 5.1 | Search Preferences for "numpad" or "emulate". | https://developer.blender.org/docs/release_notes/5.1/user_interface/ |
| The "Only Insert Available" preference is on by default. | 5.2 | Affects keying after the first key. A keyframes lesson should check this against 5.2 before writing steps on auto-keying. | https://developer.blender.org/docs/release_notes/5.2/animation_rigging/ |
| Playback loop modes (Infinite, Stop at End Frame, Bounce and others) in the Playback popover. All animation editors have a playback footer (5.0). | 5.0, 5.2 | The footer and the loop modes are where the play controls are. | https://developer.blender.org/docs/release_notes/5.2/animation_rigging/, https://developer.blender.org/docs/release_notes/5.0/animation_rigging/ |
| When saving a file with modified images, Blender asks whether to save the images too. | 5.2 | Texture painting lessons still say "Image > Save", and this dialog is the safety net. | https://developer.blender.org/docs/release_notes/5.2/user_interface/ |
| Theme settings were rebuilt; custom themes from 4.5 break. | 5.0 | Only matters for a preferences lesson. | https://developer.blender.org/docs/release_notes/5.0/user_interface/ |

## 2. Changes worth a sentence

- **Copy Global Transform** is built in, no longer an add-on (5.0).
  https://developer.blender.org/docs/release_notes/5.0/animation_rigging/
- **Shape keys:** the list supports multi-select and drag and drop, and "Make Shape Key the Basis
  Key" applies a key without reordering (5.0).
  https://developer.blender.org/docs/release_notes/5.0/animation_rigging/
- **New constraint, Geometry Attribute** (5.0). https://developer.blender.org/docs/release_notes/5.0/animation_rigging/
- **Gaussian Smooth F-Curve modifier** (5.1). https://developer.blender.org/docs/release_notes/5.1/animation_rigging/
- **In-between tools** work in Object Mode, under Object > Animation > In-Betweens (5.2).
  https://developer.blender.org/docs/release_notes/5.2/animation_rigging/
- **Armature edit mode** has Duplicate and Rename, and the Add Bone redo panel has Space, Align,
  Length and Deform (5.2). https://developer.blender.org/docs/release_notes/5.2/animation_rigging/
- **Ctrl+L** (Link/Transfer Data) has Copy Constraints (5.2).
  https://developer.blender.org/docs/release_notes/5.2/animation_rigging/
- **Weight Paint:** the Zero Weights overlay defaults to Active, and weights under 0.0001 round to
  0 (5.0). https://developer.blender.org/docs/release_notes/5.0/sculpt/
- **Sculpt:** a Blur brush and `Alt`+left click to paint a mask (5.1); the Scene Project brush and
  Add Primitive tools in Sculpt Mode; the voxel remesher keeps vertex colours (5.2).
  https://developer.blender.org/docs/release_notes/5.1/sculpt/,
  https://developer.blender.org/docs/release_notes/5.2/sculpt/
- **Multiresolution** has Conform Base beside Apply Base (5.0).
  https://developer.blender.org/docs/release_notes/5.0/sculpt/
- **Lattice:** Add > Lattice Deform Selected fits a lattice to the selection (5.0).
  https://developer.blender.org/docs/release_notes/5.0/modeling/
- **Point Cloud** is a full object type with an Edit Mode (4.5).
  https://developer.blender.org/docs/release_notes/4.5/modeling/
- **The new Curves object** (the one hair uses) has gained draw, extrude, separate, join and other
  operators across 4.1 to 4.5; the manual lists it as "Curves (New)".
  https://developer.blender.org/docs/release_notes/4.1/modeling/,
  https://docs.blender.org/manual/en/5.2/modeling/curves_new/index.html
- **3D text** fills overlapping font outlines correctly (5.1).
  https://developer.blender.org/docs/release_notes/5.1/modeling/
- **Geometry Nodes:** bundles and closures (5.0); Geometry Nodes modifiers on empties, lists and a
  Mesh Bevel node (5.2). https://developer.blender.org/docs/release_notes/5.0/geometry_nodes/,
  https://developer.blender.org/docs/release_notes/5.2/geometry_nodes/
- **Physics:** experimental Geometry Nodes based Cloth Dynamics and Hair Dynamics modifiers built on
  an XPBD solver (5.2). The classic Cloth physics is still there and is what the course teaches.
  https://developer.blender.org/docs/release_notes/5.2/physics/
- **Point caches** are always ZSTD compressed; old LZO and LZMA caches have to be rebaked (5.0).
  https://developer.blender.org/docs/release_notes/5.0/physics/
- **Colour management:** files have a working colour space (Linear Rec.709 by default), and there
  are ACES and AgX HDR views (5.0). AgX has been the default view since 4.0; checked in 5.2.2.
  https://developer.blender.org/docs/release_notes/5.0/color_management/
- **EEVEE:** the Raycast shader node (5.1); screen-space ray tracing overhaul (5.2); the render
  engine's internal name is `BLENDER_EEVEE` again (5.0).
  https://developer.blender.org/docs/release_notes/5.1/eevee/,
  https://developer.blender.org/docs/release_notes/5.2/eevee/,
  https://developer.blender.org/docs/release_notes/5.0/eevee/
- **Cycles:** adaptive subdivision is no longer experimental (5.0).
  https://developer.blender.org/docs/release_notes/5.0/cycles/
- **Render output** saving can be switched off, and a right click on Resolution offers Swap
  Dimensions (5.2). https://developer.blender.org/docs/release_notes/5.2/rendering/,
  https://developer.blender.org/docs/release_notes/5.2/user_interface/
- **glTF exporter:** maintenance for the removal of "Use Nodes" (5.0); meshopt compression,
  point cloud export and KHR iridescence and dispersion (5.2).
  https://developer.blender.org/docs/release_notes/5.0/pipeline_io/,
  https://developer.blender.org/docs/release_notes/5.2/pipeline_io/
- **Preferences** opens with `Ctrl+Comma` (4.0). https://developer.blender.org/docs/release_notes/4.0/keymap/
- **Hardware:** Intel Macs are no longer supported, and Cycles needs an NVIDIA card of compute
  capability 5.0 or newer (GeForce 900 series on) (5.0). https://developer.blender.org/docs/release_notes/5.0/
- **Python** is 3.13 (5.1). https://developer.blender.org/docs/release_notes/5.1/

## 3. Facts checked in Blender 5.2.2

Read from a factory-startup session, `blender.exe -b --factory-startup`, on 2026-10-15.

- The startup file holds a Cube, a Light and a Camera. The render engine is EEVEE
  (`BLENDER_EEVEE`), the view transform is AgX, units are Metric with Unit Scale 1.0 and length in
  metres, the frame rate is 24 fps, resolution 1920 by 1080, and the frame range 1 to 250.
- Object > Shade Smooth, Shade Flat, Shade Auto Smooth and Shade Smooth by Angle all exist.
- The first-run Quick Setup offers Language, Theme, Keymap, Mouse Select (Left or Right) and
  Spacebar Action, or importing the preferences of an older version
  (`5.2/scripts/startup/bl_operators/wm.py`, `WM_MT_splash_quick_setup`).
- Operator labels a lesson will quote: Merge by Distance, Set Vertex Colors, Set Sharpness by
  Angle, Smart UV Project, Cube Projection, Follow Active Quads, Average Islands Scale, Pack
  Islands, Bake to Keyframes, Pack Resources, Save Startup File, Flatten. Add > Curves offers
  Empty Hair and Fur; Add > Grease Pencil offers Scene, Collection and Object Line Art; Object >
  Quick Effects has Quick Smoke and Quick Liquid; Add > Image has Reference and Background.
- The Essentials node assets include Array, Curve to Tube, Scatter on Surface, Instance on Elements,
  Randomize Transforms, Geometry Input, Smooth by Angle and Capture Rest Geometry
  (`5.2/datafiles/assets/nodes/geometry_nodes_essentials.blend`).
- **glTF exporter defaults** (`bpy.ops.export_scene.gltf`):
  - +Y Up: on.
  - Apply Modifiers: **off**. A lesson that relies on the Mirror, Bevel or Array modifier must
    turn it on or apply the modifiers first.
  - Selected Objects: off, so the whole scene goes out unless the lesson says otherwise.
  - Materials: Export. Images: Automatic. Custom Properties: off.
  - Animation Mode: Actions (other choices: Active Actions, Broadcast, NLA Tracks, Scene).
    Merge Animation: by Action. Group by NLA Track: on. Always Sample Animations: on.
  - Use Vertex Color: Material (choices Material, Active, Name, None).
  - Skinning, Shape Keys, UVs and Normals: on. Tangents: off.
  - Export Deformation Bones Only: off. Add Leaf Bones: off. Use Rest Position Armature: on.
- **Keymap** (`5.2/scripts/presets/keyconfig/keymap_data/blender_default.py`):
  - Frame selected: `Numpad .` and Mouse Button 4. View all: `Home`. Local view: `Numpad /` and `/`.
  - The `` ` `` (accent grave) key opens the View pie; `Shift+`` ` starts Fly/Walk navigation.
  - Loop cut `Ctrl+R`, inset `I`, bevel `Ctrl+B` (vertex bevel `Shift+Ctrl+B`), knife `K`,
    separate `P`, split `Y`, connect vertex path `J`, merge menu `M`, new edge or face `F`,
    fill `Alt+F`, triangulate `Ctrl+T`, tris to quads `Alt+J`, recalculate normals `Shift+N`,
    normals menu `Alt+N`, UV menu `U`, edge crease `Shift+E`, dissolve `Ctrl+X`.
  - Object Mode: Add menu `Shift+A`, Apply menu `Ctrl+A`, parent `Ctrl+P`, clear parent `Alt+P`,
    join `Ctrl+J`, clear location, rotation and scale `Alt+G`, `Alt+R`, `Alt+S`, snap pie `Shift+S`,
    pivot pie `.`, orientation pie `,`, X-ray `Alt+Z`, keyframe `I`, keying menu `K`.
  - Subdivision levels with `Ctrl+1` to `Ctrl+5` in Object and Edit Mode.
  - Sculpt Mode: voxel remesh `Ctrl+R`, voxel size `R`, mask pie `A`, face sets pie `Alt+W`,
    smooth while held `Shift`, mask while held `Alt` (5.1).

## 4. Things the release notes don't settle

These need a check in 5.2 by whoever writes the lesson:

- Which channels `I` keys by default in a factory 5.2 (Preferences > Animation > Default Key
  Channels), and how "Only Insert Available" (on by default in 5.2) changes auto-keying.
- How the glTF exporter in 5.2 names and splits slotted actions when Animation Mode is Actions.
  The release notes for 5.0 to 5.2 mention fixes but no behaviour change.
- Touchpad gestures on a real Windows laptop. The 5.2 manual documents them (two fingers to orbit,
  `Shift` and two fingers to pan, `Ctrl` and two fingers to zoom, a two-finger tap for right click,
  on Windows, macOS and Linux with Wayland:
  https://docs.blender.org/manual/en/5.2/getting_started/configuration/hardware.html), and
  Preferences > Input has a Multi-touch Gestures option
  (https://docs.blender.org/manual/en/5.2/editors/preferences/input.html), but nobody has tried
  them for this course yet.
- The Rigify meta-rig menu entry. In 5.2.2 Rigify names its entries from its meta-rig files, so
  Add > Armature shows "Human" and a "Basic" submenu (checked in
  `addons_core/rigify/metarig_menu.py`). Older tutorials say "Human (Meta-Rig)".
