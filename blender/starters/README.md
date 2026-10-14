# Starter scenes

A starter builds the `.blend` file an exercise begins from. A practice item names one with
`starter: <id>` (see `docs/course/PLAN.md`). Dimensio runs the starter in Blender, saves the file in
the course folder and opens it in Blender's window.

## How a starter runs

```text
blender.exe -b --factory-startup --python blender/dimensio_starter.py -- --starter <id> --out <file.blend> [--force] [--<option> <value> ...]
```

`dimensio_starter.py` loads Blender's factory scene (the cube, the camera and the light), calls
`build(starter)` from `starters/<id>.py`, and saves the result to `--out`. It will not replace a
file that already exists unless you pass `--force`, because the learner may have worked in it.

The last line it prints is `DIMENSIO_STARTER=` followed by JSON: `{"format": 1, "starter": "<id>",
"out": "<path>"}` when the file was saved, or `{"format": 1, "starter": "<id>", "error": "..."}`
when it was not. The exit code is 0 only when the file was saved.

The app calls it through `makeStarter({ blenderPath, starterId, outFile, options })` in
`desktop/src/lib/blender-measure.cjs`. Option names are camelCase there and become flags, so
`{ imageFront: "front.png", height: 1.8 }` is passed as `--image-front front.png --height 1.8`.

## Adding a starter

1. Choose an id made of lowercase letters, digits and hyphens, such as `fix-ngons`. The script is
   `starters/<id>.py`.
2. Start the file with a docstring that says what the scene holds and what measuring it gives. A
   lesson writer reads this to set the `measure:` limits of an exercise.
3. Define `OPTIONS`, a dict from each option name (`"image-front"`) to one line saying what it is.
   The runner refuses any option that is not listed. Use `OPTIONS = {}` when there are none.
4. Define `build(starter)`. The factory scene is already loaded when it runs. Change the scene with
   `bpy` and return; the runner saves the file.
5. Build it and measure it, and check the numbers against your docstring:

   ```text
   blender.exe -b --factory-startup --python blender/dimensio_starter.py -- --starter <id> --out C:\Temp\<id>.blend
   blender.exe -b --factory-startup C:\Temp\<id>.blend --python blender/dimensio_check.py -- --out C:\Temp\<id>-check
   ```

6. Add the starter to `desktop/test/blender-measure.integration.test.cjs`, which builds every
   starter against the real Blender.

When an option is wrong, raise `DimensioError` from `dimensio_common` with one sentence the learner
can act on, such as "The reference-images starter needs --image-front, --image-side or both."

### What `starter` gives you

| Name | What it does |
| --- | --- |
| `starter.scene` | The scene being built. |
| `starter.option(name, default)` | An option's text, or `default`. |
| `starter.number(name, default)` | An option as a number above 0, or `default`. |
| `starter.path(name, required=False)` | An option as an absolute path to a file that exists. |
| `starter.remove_default_cube()` | Deletes the factory cube. The camera and the light stay. |
| `starter.reference_collection(name)` | A new collection for reference material. Measuring skips it, and its objects cannot be selected or rendered. |
| `starter.material(name, (r, g, b))` | A Principled BSDF material in that colour, with the same Viewport Display colour so Solid view shows it. |
| `starter.world_bounds(objects)` | The lowest and highest corner of the objects' bounding boxes in world space. |
| `starter.frame_viewports(low, high, view=None)` | Points every 3D Viewport at that box. `view="front"` or `"right"` opens the file in that orthographic view. |

`dimensio_common.import_reference(path, scene, collection)` imports a `.glb`, `.gltf`, `.fbx`,
`.obj` or `.blend` model into a collection and returns its objects.

### Rules for a starter

- Keep the camera and the light unless the exercise is about them.
- Work in metres. Stand models on the ground at Z 0 unless the exercise needs otherwise.
- Build geometry with `bmesh` or the data API, not Edit Mode operators, so the scene comes out
  the same every time.
- Pack every image the scene uses with `image.pack()`, so the file still works after it is copied.
- Put anything that is not the learner's model in `starter.reference_collection(...)`. The check
  never measures or renders what is in it, so a reference model left in the learner's file does
  not count as their work.

## The starters

| Id | Options | What the scene holds | What measuring it gives |
| --- | --- | --- | --- |
| `empty-scene` | none | Blender's default scene. | Cube: verts 8, faces 6, quads 6, tris 12, ngons 0. |
| `fix-ngons` | none | "Stool", one mesh: an octagonal seat whose top and bottom are n-gons, a leg with no bottom face, and a leg duplicated in place. | verts 56, edges 84, faces 39, tris 86, quads 37, ngons 2, nonManifoldEdges 4, doubles 8, flippedFaces 0. |
| `unapplied-scale` | none | "Shelf", the default cube scaled to 2 x 0.6 x 0.24 m in Object Mode, with a 0.2 m Bevel modifier that comes out uneven. | scaleApplied false, modifiers `["BEVEL"]`, dimensions 2, 0.6, 0.24. |
| `reference-images` | `--image-front`, `--image-side`, `--height` (metres, default 2) | Front and side pictures as image empties standing on the ground, `--height` tall, shown only in their own orthographic view, behind the model, at half opacity. The default cube stays. Opens in the front view. | The default cube only. The pictures are in a reference collection. |
| `navigation-letters` | none | Six props on a 20 m floor, "Prop 1" to "Prop 6", each with one letter on a face that only one view shows (front, back, right, left, top, bottom). In order they spell CAMERA. Prop 1 is small and far away, so it needs Frame Selected. | 14 meshes, 2 n-gons (Prop 5's caps). No limits: lesson 3 is about finding the letters. |
| `copy-reference` | `--reference` | The model from `--reference` in a "Reference" collection, drawn as wire, to the left of the origin with its base on the ground. The default cube is removed. | Nothing until the learner models. The reference is skipped. |

The side picture is seen from the right (numpad 3), where the model's front faces left, so the
subject in that picture should face left.

To compare a learner's copy with the model they copied, measure their file with the same file as
the reference:

```text
blender.exe -b <their.blend> --python blender/dimensio_check.py -- --out <dir> --reference <model.glb>
```

## Every starter

Each starter's first docstring paragraph. The docstring itself gives the numbers measuring it should report.

| Id | What it holds |
| --- | --- |
| `apply-stretched` | Three boxes shaped in Object Mode, each with a Bevel modifier. |
| `bake-stone` | A sculpted stone with a low-poly copy to bake onto, and a plank of procedural wood. |
| `blocky-character` | A low-poly character 1.8 m tall in a T pose, with or without a rig. |
| `bounce-even` | A ball dropped from 3 m that bounces three times, every bounce 24 frames. |
| `broken-crate` | The lesson 27 crate with four common faults in it, for lesson 34, Checking your model. |
| `cart-turret` | A cart that drives past, a target that moves, and a camera and a turret to aim. |
| `chest-unwrapped` | A chest unwrapped into seven islands that still need arranging. |
| `cleanup-mess` | A block that should be a plain box, with four things to clean up. |
| `cloth-table` | A low-poly table with a flat tablecloth held above it, for a cloth drape. |
| `coin-spout` | A treasure chest, a floor and a small plane where coins will pour from. |
| `copy-reference` | A model to copy, beside an empty space to build in. |
| `crate-cart` | A hand cart that tips back, with six crates stacked on its bed. |
| `curve-pieces` | Three Bézier curves to turn into a rope, a pipe and a rail. |
| `curve-trace` | Two flat shapes on the ground to trace with Bézier curves, seen from the top. |
| `dense-rock` | A rock of about 2,000 triangles to make lower levels of detail from. |
| `door-lamp` | A door that swings open and a hanging lamp that swings once. |
| `driver-cart` | A cart that rolls 8 m along X, with four wheels that do not turn yet. |
| `empty-scene` | Blender's default scene: the cube, the camera and the light. |
| `export-kit` | Four building-kit pieces in a "Kit" collection, ready for an export script. |
| `fix-ngons` | A stool with three mistakes to fix. |
| `flipped-faces` | A crate and a barrel with faces turned the wrong way, for lesson 31, Normals. |
| `godot-material-faults` | Three props whose materials go wrong in Godot. |
| `grid-ground` | A flat patch of ground to shape, for lesson 29, Proportional editing. |
| `hinged-door` | A door in a frame, with its origin on the hinge, ready to animate. |
| `holes-to-fill` | Three objects with holes to fill, for lesson 26, Filling faces. |
| `house-block` | A small house block, one mesh with no material, ready for material slots. |
| `house-plot` | An empty 6 x 6 m plot to build a house on, with a figure for scale. |
| `import-practice` | An empty scene with two model files beside it to import, one at the wrong size. |
| `knife-wall` | A plain wall to cut into, for lesson 28, The knife tool. |
| `light-stage` | A crate and a barrel on a floor, with a camera and no lights. |
| `loop-shapes` | Four meshes with coloured targets for loop, ring, path and linked selection. |
| `material-spheres` | Six smooth spheres in a row on a checked floor, waiting for materials. |
| `messy-scene` | A market corner with every object left under its default name. |
| `missing-textures` | A crate and a barrel whose two texture images have been moved. |
| `mushroom-parts` | A mushroom's cap and stem as two separate objects that overlap. |
| `navigation-letters` | Six props on a 20 m floor, each with one letter on a face only one view shows. |
| `ngon-lamp` | A table lamp with n-gons in the right and wrong places, for lesson 33, Quads, triangles and n-gons. |
| `not-game-ready` | Three props that break five game-ready rules between them. |
| `origins-wrong` | A crate, a lamp and a door whose origins are in the wrong places. |
| `palette-barrel` | A grey barrel and a palette image, ready to be coloured with one material. |
| `parent-car` | A block car in loose parts, ready to be parented. |
| `pivot-planks` | Twelve planks to turn into a ring, and a tilted sign to slide. |
| `props-library` | A small library file of three props to append, link and mark as assets. |
| `reference-images` | Front and side reference pictures set up for blocking out. |
| `reference-pictures` | Blender's default scene, with reference pictures saved beside it. |
| `render-stage` | Three low-poly props on a curved backdrop, lit by three area lights, with a camera. |
| `rigify-body` | A 1.7 m low-poly body in an A pose, ready for a Rigify meta-rig. |
| `scatter-hill` | A low-poly hill to scatter on, and a rock and a tree to scatter. |
| `sculpt-ball` | A ball with even, dense topology, ready to sculpt. |
| `sculpted-stone` | A sculpted stone of 20,480 triangles to retopologise. |
| `selection-yard` | A yard of 30 props of five kinds, for practising selection. |
| `separate-lamp` | A lamp to take apart and a pile of rocks to put together, for lesson 30, Separate and join. |
| `shading-barrel` | Two flat-shaded barrels to shade two ways, for lesson 32, Flat and smooth shading. |
| `snapping-blocks` | Three blocks to stack and five posts to set out, for practising snapping. |
| `textured-wall` | A brick wall waiting for its texture set: three images in the file, none connected. |
| `transform-targets` | Eight blocks, each to be moved, turned or scaled into a wire outline. |
| `tree-grey` | A grey low-poly tree to colour with vertex paint. |
| `turntable` | The render stage's props on a round plinth that turns once, for a turntable. |
| `unapplied-scale` | A shelf board scaled in Object Mode, with a Bevel modifier. |
| `unwrap-props` | A crate, a barrel and a rock with a test grid but no UV maps, ready to unwrap. |
| `uv-three-props` | Three props with ready-made UV maps and a test grid, for reading UV maps. |
