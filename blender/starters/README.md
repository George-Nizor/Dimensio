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
