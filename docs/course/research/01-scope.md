# Scope: every part of Blender, and the lessons that cover it

> Lesson numbers in this file come from the first outline. Spin and Screw was added afterwards as
> lesson 45, so from 45 on the current number is one higher. `docs/course/COURSE.md` has the current numbers.

The owner's decision is that the course covers every part of Blender a 3D artist uses, with no
gaps. This file holds the course to that. Section 1 walks the Blender 5.2 manual's own structure
and names the lessons for each area. Section 2 lists what is left to the manual and why.

**How this was checked.** The structure is the 5.2 manual's navigation tree, read on 2026-10-15
from https://docs.blender.org/manual/en/5.2/ (about 2,300 entries). Lesson numbers are those in
`COURSE.md` and `content/course.yaml`. Manual links below are relative to
https://docs.blender.org/manual/en/5.2/.

**The rule used.** "No gaps" means every area a 3D artist uses gets at least an introduction
lesson: what it is for, how to start it, and one exercise. Inside an area, a tool can be left to
the manual when a lesson already teaches how that kind of tool works (for example, the Modifiers
lesson teaches how every modifier panel behaves, so a rarely used modifier needs only its manual
page). An area is left to the manual only when a 3D artist making assets doesn't need it, and the
reason is given.

---

## 1. The manual's areas and the lessons that cover them

### Getting Started (`getting_started/`)

| Area | Lessons |
| --- | --- |
| Installing (Windows, Steam, Linux, macOS) | 1 |
| Configuring: peripherals, defaults, Quick Setup | 1, 4, 124 |
| Help System | 1 |

### User Interface (`interface/`)

| Area | Lessons |
| --- | --- |
| Window system: splash, topbar, workspaces, status bar, areas, regions, tabs and panels | 1, 2 |
| Keymap: default keymap, Industry Compatible keymap | 2, 124 (the Industry Compatible keymap is named, not taught) |
| UI elements: buttons, fields, menus, eyedropper, data-block menu, lists, colour picker, colour ramp | 2, 9, 49 |
| Tools and operators, Adjust Last Operation, undo and redo | 2, 7, 8 |
| Selecting | 5 |
| Nodes: node editors, parts, selecting, arranging, editing, groups | 49, 83, 86 |
| Annotations | Left to the manual (section 2) |

### Editors (`editors/`)

| Editor | Lessons |
| --- | --- |
| 3D Viewport: modes, navigation, 3D cursor, selecting, controls (orientation, pivot, snapping, proportional editing), display (gizmos, overlays, shading), toolbar, sidebar, viewport render | 2, 3, 4, 5, 7, 12, 13, 19, 29, 31, 73 |
| Image Editor | 57 |
| UV Editor | 53, 54, 55, 56 |
| Compositor | 117 |
| Texture Nodes (legacy) | Left to the manual |
| Geometry Node Editor | 83 |
| Shader Editor | 49 |
| Video Sequencer | 118 |
| Movie Clip Editor | Left to the manual (with motion tracking) |
| Dope Sheet (and Action Editor, Grease Pencil and Shape Key modes) | 88, 93, 115 |
| Timeline | 87 |
| Graph Editor | 89 |
| Drivers Editor | 91 |
| Nonlinear Animation | 94 |
| Text Editor | 126 |
| Python Console | 125 |
| Info Editor | 125 |
| Outliner | 17, 16 |
| Properties Editor | 2 |
| File Browser | 8 |
| Asset Browser | 120 |
| Spreadsheet | 84 |
| Preferences: interface, viewport, lights, editing, animation, extensions, add-ons, themes, asset libraries, input, navigation, keymap, system, save and load, file paths | 4, 8, 71, 87, 120, 123, 124, 125 |

### Scenes and Objects (`scene_layout/`)

| Area | Lessons |
| --- | --- |
| Scene properties, units | 11 |
| Object types | 82 |
| Object origin | 14 |
| Selecting objects | 5 |
| Editing: transform, mirror, clear, apply, snap, duplicate, linked duplicate, join, parenting, track, relations, link and transfer data, shading, rigid body, convert, show and hide, clean up, delete | 6, 7, 12, 15, 16, 17, 30, 32, 48, 80, 90, 106 |
| Object properties: transform, relations, instancing, visibility, viewport display, Line Art | 6, 16, 116 |
| Tools: toolbar, tool settings (Affect Only Origins), scale cage | 6, 14 |
| Collections | 17 |

### Modeling (`modeling/`)

| Area | Lessons |
| --- | --- |
| Meshes: structure, primitives, Mesh Plane (images as planes) | 7, 19, 45 |
| Mesh tools: extrude, loop cut, poly build, spin | 21, 23, 45 (Spin and Screw), 77 |
| Mesh selecting: loops, linked, more and less, similar, all by trait | 20, 33, 34 |
| Mesh editing: transform, mirror, duplicate, extrude, merge, split, separate, bisect, knife, convex hull, symmetrize, normals, shading, clean up, delete and dissolve | 21, 25, 28, 30, 31, 32, 34, 38, 63 |
| Vertex, edge and face operators: bevel, connect path, rip, slide, bridge, subdivide, loop cut, inset, triangulate, fill, grid fill, intersect | 22, 23, 24, 26, 33, 43 |
| Mesh properties: vertex groups, attributes | 98, 99, 84 |
| UVs: seams, unwrapping, tools, layout | 53, 54, 55, 56 |
| Mesh Analysis | 34 |
| Remeshing | 75 |
| Curves: structure, editing, properties (geometry, bevel, taper) | 79, 80 |
| Curves (New): the hair and general curves object | 111 |
| Surfaces (NURBS) | 82 |
| Metaball | 82 |
| Text | 81 |
| Point Cloud | 82 |
| Volumes | 82 |
| Empties | 16, 45 |
| Modifiers: introduction and common options | 37 |
| Modifiers, Generate: Array, Array (Legacy), Bevel, Boolean, Curve to Tube, Decimate, Mirror, Multiresolution, Remesh, Scatter on Surface, Solidify, Subdivision Surface, Triangulate | 38, 39, 40, 41, 42, 43, 64, 75, 80, 85 |
| Modifiers, Deform: Armature, Curve, Displace, Lattice, Shrinkwrap, Simple Deform | 44, 76, 78, 98 |
| Modifiers, Normals: Smooth by Angle | 32 |
| Modifiers, Physics: Cloth, Collision, Fluid, Particle System, Soft Body | 107, 108, 109, 110 |
| Other modifiers (see section 2) | Left to the manual |
| Geometry Nodes: introduction, inspection, attributes, fields, instances, simulation, baking, node groups | 83, 84, 85, 86, 112 |
| Transform and its modal keys | 6 |

### Sculpting and Painting (`sculpt_paint/`)

| Area | Lessons |
| --- | --- |
| Brushes: asset shelf, brush management, settings, stroke, falloff | 57, 74 |
| Sculpting: brushes, tools, symmetry, Dyntopo, Remesh | 74, 75 |
| Sculpting: masks, face sets, filters, gestures | Left to the manual (section 2) |
| Texture Paint | 57 |
| Vertex Paint | 58 |
| Weight Paint | 99 |
| Curves Sculpting | 111 |

### Grease Pencil (`grease_pencil/`)

| Area | Lessons |
| --- | --- |
| Structure, layers, Draw Mode, materials, fills | 114 |
| Animation, onion skinning, interpolation | 115 |
| Modifiers: Line Art | 116 |
| Other Grease Pencil modifiers, visual effects, Sculpt, Vertex Paint and Weight Paint modes | Left to the manual |

### Animation and Rigging (`animation/`)

| Area | Lessons |
| --- | --- |
| Keyframes, keying, Auto Keying | 87 |
| Animation editors | 87, 88, 89, 91, 93, 94 |
| Armatures: bones, bone collections, structure | 97 |
| Skinning | 98 |
| Posing, pose library | 100 |
| Bone constraints, inverse kinematics | 101 |
| Lattice | 44 |
| Constraints: Track To, Damped Track, Child Of, Copy Location, Limit Rotation, IK | 90, 101 |
| Actions and slots | 93, 104 |
| Drivers | 91 |
| Markers | 88 |
| Shape Keys | 92 |
| Motion Paths | 103 |
| In-Betweens | Left to the manual |
| Keying Sets | Left to the manual |

### Physics (`physics/`)

| Area | Lessons |
| --- | --- |
| Rigid Body, world, Bake to Keyframes | 106, 113 |
| Cloth | 107 |
| Soft Body | 108 |
| Fluid: smoke, fire, liquid | 109 |
| Particle System: emitter (hair particles named) | 110 |
| Forces: force fields | 110 |
| Collision | 107 |
| Baking physics simulations | 107, 109, 113 |
| Simulation Nodes | 112 |
| Dynamic Paint | Left to the manual |

### Rendering (`render/`)

| Area | Lessons |
| --- | --- |
| Render engines: EEVEE | 70 |
| Cycles, GPU rendering, sampling, light paths | 71 |
| Cycles baking | 77 |
| Workbench | 73 |
| Cameras | 69 |
| Lights, World | 67, 68 |
| Light Linking | Left to the manual |
| Materials: assignment, settings, render method | 9, 47, 48 |
| Shader nodes: Principled BSDF, textures, colour, vectors, groups | 47, 49, 50, 51 |
| Colour management | 72 |
| Freestyle | Left to the manual (Line Art covers outlines) |
| View layers and passes | 117 |
| Render output, rendering animations | 72 |
| Audio, speakers, the animation player | Left to the manual (lesson 118 covers sound in a video) |
| EEVEE light probes | Left to the manual |

### Compositing (`compositing/`)

| Area | Lessons |
| --- | --- |
| Workspace, Group Output, Viewer, Glare, Color Balance, Blur | 117 |
| Keying, Cryptomatte, tracking and lens-effect nodes | Left to the manual |

### Motion Tracking and Masking (`movie_clip/`)

Left to the manual (section 2).

### Video Editing (`video_editing/`)

| Area | Lessons |
| --- | --- |
| Sequencer Scene, setting up, montage: strips, editing, text, sound | 118 |
| Strip modifiers, meta strips, storyboarding template | Left to the manual |

### Assets, Files and Data System (`files/`)

| Area | Lessons |
| --- | --- |
| Opening and saving, recovery, compression | 8 |
| Packed data, file paths, data-blocks | 121 |
| Custom properties | Left to the manual |
| Linked libraries, library overrides | 119 |
| Asset libraries, catalogs, remote libraries | 120 |
| Media formats | 72 |
| Importing and exporting: glTF, FBX, OBJ, STL, USD | 35, 122 |
| Alembic, BVH, PLY, SVG, Grease Pencil SVG and PDF | Left to the manual |

### Add-ons (`addons/`)

| Add-on | Lessons |
| --- | --- |
| glTF 2.0 | 35, 61, 104 |
| Rigify | 102 |
| Node Wrangler | 49 |
| Manage UI Translations, VR Scene Inspection | Left to the manual |

### Advanced (`advanced/`)

| Area | Lessons |
| --- | --- |
| Scripting and extending Blender, scripting and security | 125, 126 |
| Keymap customisation | 124 |
| Command line: running a script in the background | 126 |
| Command line rendering, creating extensions, application templates, working limits, directory layout, deploying in production | Left to the manual |

### Troubleshooting (`troubleshooting/`)

| Area | Lessons |
| --- | --- |
| Recovering data | 8 |
| Startup, graphics hardware, crashes, Python errors, network, reporting a bug | Left to the manual; lesson 1 links the graphics hardware page |

## 2. Left to the manual, and why

Each of these has its manual page. A lesson that touches one names the page in a single line.

| Area | Manual | Why it has no lesson |
| --- | --- | --- |
| Motion tracking and masking | `movie_clip/index.html` | It matches 3D to filmed footage. That is visual-effects work with real video, not asset making, and it would need its own course. |
| Freestyle | `render/freestyle/index.html` | Outlines on renders; Line Art (lesson 116) does the same job, works in EEVEE's viewport and is what current Blender teaching uses. |
| Dynamic Paint | `physics/dynamic_paint/index.html` | Paints wet maps, ripples and footprints into image sequences or vertex data for film. Game engines make these effects at run time. |
| Masks, face sets, filters and gesture tools in Sculpt Mode | `sculpt_paint/sculpting/introduction/visibility_masking_face_sets.html` | Needed for detailed character sculpts. The low-poly course sculpts rocks and bake sources, where brushes and remeshing (lessons 74, 75) are enough. |
| Spin and the Screw modifier | `modeling/meshes/tools/spin.html`, `modeling/modifiers/generate/screw.html` | Lathed shapes. The course builds round props from cylinders, which keeps the vertex count under control; Spin is a single tool the Edit Mode lessons prepare a learner to read up on. |
| Remaining mesh operators (rip, poke, wireframe, un-subdivide, sort elements, hooks, vertex parent and others) | `modeling/meshes/editing/index.html` | Part 3 and 4 teach how mesh operators behave: select, run, adjust in the redo panel. These are single operators found the same way. |
| Remaining modifiers (Build, Cast, Data Transfer, Edge Split, Explode, Hook, Laplacian Deform and Smooth, Mask, Mesh Cache, Mesh Deform, Mesh Sequence Cache, Mesh to Volume, Normal Edit, Ocean, Particle Instance, Remesh as a modifier, Screw, Skin, Smooth, Corrective Smooth, Surface Deform, UV Project, UV Warp, Vertex Weight Edit, Mix and Proximity, Volume Displace, Volume to Mesh, Warp, Wave, Weighted Normal, Weld, Wireframe, and node modifiers such as Instance on Elements and Randomize Instances) | `modeling/modifiers/index.html` | Lesson 37 teaches the stack and how every modifier panel works; lessons 38 to 44 teach the ones game assets use most. Weld is named in lesson 25 beside Merge by Distance. |
| Texture Nodes editor and legacy textures | `editors/texture_node/index.html`, `render/materials/legacy_textures/index.html` | An older system used for brush and modifier textures. Lesson 78 uses a texture with the Displace modifier and names the panel. |
| Grease Pencil modifiers other than Line Art, visual effects, and Sculpt, Vertex Paint and Weight Paint modes | `grease_pencil/modifiers/index.html`, `grease_pencil/visual_effects/index.html`, `grease_pencil/modes/index.html` | The three Grease Pencil lessons cover drawing, 2D animation and outlines. The rest is 2D animation craft for a 2D course. |
| In-Betweens | `animation/in_betweens.html` | Polishing tools for poses. The walk cycle sets in-betweens by hand, which is what a beginner learns from. |
| Keying Sets | `animation/keyframes/keying_sets.html` | Since 4.1, `I` keys the channels set in Preferences; keying sets are for rigs with many controls. Lesson 87 names `K`. |
| Light Linking and EEVEE light probes | `render/lights/light_linking.html`, `render/eevee/light_probes/index.html` | Fine control of render lighting. Game lighting is set up in Godot. |
| Audio, speakers and the animation player | `render/output/audio/index.html`, `render/output/animation_player.html` | Lesson 118 covers sound in a video; 3D positional audio belongs to the game engine. |
| Compositor keying, Cryptomatte, tracking and lens nodes | `compositing/types/index.html` | Keying and tracking need filmed footage; Cryptomatte matters for film pipelines. Lesson 117 teaches how compositor nodes work. |
| Strip modifiers, meta strips and the Storyboarding template | `video_editing/edit/montage/modifiers/index.html`, `video_editing/storyboarding/index.html` | Video editing beyond a short cut of your renders. |
| Custom properties | `files/custom_properties.html` | Useful for game pipelines (glTF `extras`, Godot metadata) once a learner writes Godot import scripts, which is beyond this course. |
| Alembic, BVH, PLY, SVG and Grease Pencil SVG and PDF | `files/import_export/index.html` | Lesson 122 teaches what a format carries and how the importers and exporters behave. Collada was removed in 5.0. |
| Annotations | `interface/annotate_tool.html` | Notes drawn in the viewport for review. Grease Pencil (lesson 114) is the full drawing tool. |
| Industry Compatible keymap | `interface/keymap/industry_compatible.html` | The course teaches the default keymap throughout (`WRITING.md`). Lesson 124 says it exists. |
| Manage UI Translations, VR Scene Inspection | `addons/ui_translations.html`, `addons/vr_scene_inspection.html` | Tools for translators and VR review, not for making assets. |
| Command line rendering, creating extensions, application templates, working limits, directory layout, deploying in production | `advanced/index.html` | Pipeline and developer topics. Lesson 126 runs a script in the background, which is the part an artist uses. |
| Troubleshooting beyond recovery | `troubleshooting/index.html` | Reference for when something goes wrong; lesson 1 links the graphics hardware page and lesson 8 teaches recovery. |
| Node-based tools, gizmos and the more advanced Geometry Nodes nodes (bundles, closures, lists, volumes) | `modeling/geometry_nodes/index.html` | Lessons 83 to 86 and 112 teach how nodes, fields, instances and simulation work. The rest is a reference to read with that grounding. |
| 5.2's experimental Cloth Dynamics and Hair Dynamics | https://developer.blender.org/docs/release_notes/5.2/physics/ | Marked experimental, with a design that may change. Lessons 107 and 111 mention them and teach the stable systems. |

## 3. Areas the owner listed, checked one by one

The brief named these areas. Each has at least one lesson.

| Area | Lessons |
| --- | --- |
| Interface | 1, 2, 3, 4 |
| Meshes | 19 to 34 |
| Curves | 79, 80 |
| Surfaces, metaballs, volumes | 82 |
| Text | 81 |
| Empties | 16, 45 |
| Modifiers | 37 to 44, 64 |
| Geometry Nodes | 83 to 86, 112 |
| Sculpt and paint modes | 57, 58, 74, 75, 99, 111 |
| UVs | 53 to 56 |
| Materials and shader nodes | 9, 47 to 51 |
| Textures | 50, 51, 56, 57, 77 |
| Lighting | 67, 68 |
| Cameras | 69 |
| EEVEE and Cycles | 70, 71 |
| Rendering and output | 72, 73 |
| Compositing | 117 |
| Keyframes and animation editors | 87, 88, 89, 93, 94 |
| Constraints | 90, 101 |
| Drivers | 91 |
| Shape keys | 92 |
| Armatures | 97, 98, 100, 102 |
| Weight painting | 99 |
| NLA | 94 |
| Rigid body | 106, 113 |
| Cloth | 107 |
| Soft body | 108 |
| Fluid | 109 |
| Particles | 110 |
| Hair curves | 111 |
| Grease Pencil | 114, 115, 116 |
| Video Sequencer | 118 |
| Asset Browser | 120 |
| Linking and appending | 119 |
| Add-ons and extensions | 123 |
| Preferences | 124 |
| Scripting | 125, 126 |
