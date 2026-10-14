---
needs: [mirror, reference-images, loop-cuts]
exercise: model-character
watch: [ryan-king-low-poly-characters, grant-abbitt-ps1-character]
sources:
  - Blender 5.2 Manual, "Mirror Modifier", Axis, Clipping and Merge (https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/mirror.html), read 2026-10-15
  - Blender 5.2 Manual, "Extrude Faces" with E, extruding limbs for characters (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/face/extrude_faces.html), read 2026-10-15
  - Blender 5.2 Manual, "Loop Cut and Slide" with Ctrl-R and the wheel for more cuts (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/edge/loopcut_slide.html), read 2026-10-15
  - Blender 5.2 Manual, "Empties", image empties for reference pictures (https://docs.blender.org/manual/en/5.2/modeling/empties.html), read 2026-10-15
  - Blender 5.2 Manual, "Apply" transforms, apply before rigging (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/apply.html), read 2026-10-15
  - Blender 5.2 Manual, "Viewport Overlays", Statistics (https://docs.blender.org/manual/en/5.2/editors/3dview/display/overlays.html), read 2026-10-15
  - Kenney, "Mini Characters", CC0, the character in the reference pictures (https://kenney.nl/assets/mini-characters), read 2026-10-15
  - docs/course/research/04-game-assets.md, section 10, the 2,000-triangle budget for a character, set at about twice Kenney's
---

# Character modelling

A game character can start as a single cube. In this lesson you'll model half a character with the Mirror modifier, extrude its arms and legs from the body, and add loops where the joints will bend. The next lessons rig it, so it stands with its arms out and its feet at the origin.

![A low-poly character from the front, arms straight out. The half on the right is solid, the modelled half; the other half, made by the Mirror modifier, is faint, with the mirror line down the middle.](example)

## Steps

1. **Fit the cube to the torso.** The exercise opens with the reference pictures behind the default cube. In Edit Mode, scale and move the cube to cover the torso in the front view (`Numpad 1`), then in the side view (`Numpad 3`).

   ![The cube scaled to the torso inside faint outlines of the character, in the front view and in the side view.](reference)

2. **Mirror one half.** Press `Ctrl+R` to cut a loop down the middle and delete the vertices on its -X side. In the Modifiers tab, add Generate > Mirror with axis X and tick Clipping, so the middle vertices stay on the mirror line.

   ![Half a torso with the Mirror modifier: the half you edit, its faint mirrored copy, and the vertices on the mirror line picked out.](mirror)

3. **Extrude the limbs.** Select the face under the hip and press `E` to pull a leg down to the knee, then again to the ankle. Pull the arm out along X from the shoulder's side face, then the neck and head up from the top.

   ![The half torso with a leg extruded down from the hip in two steps and an arm extruded out from the shoulder, with arrows for each.](extrude)

4. **Add loops at the joints.** A limb bends only where it has edge loops. Put one ring below each shoulder and hip, and three close together at each elbow and knee: press `Ctrl+R` and scroll up to add more cuts.

   ![The character from the front with the joint loops picked out: one ring at each shoulder and hip, three at each elbow and knee.](loops)

5. **Shape it from the side.** In the side view, move vertices to follow the reference: give the head and chest their depth and push the feet forward along -Y. Keep the arms straight out to the sides, as in the pictures.

6. **Stand it at the origin.** In Object Mode, put the feet on the floor at Z 0 and the origin between them, where a game will place the character. Apply its scale with `Ctrl+A` > Scale.

   ![The character from the side, 1.8 m tall, feet on the floor and its origin on the floor between them.](origin)

## Common mistake

![Left, a middle vertex dragged off the mirror line, leaving a gap down the seam. Right, with Clipping on, the halves meet.](mistake)

The Mirror modifier joins the halves only where vertices sit on the mirror line. Drag a middle vertex off it and a gap or an overlap opens down the seam. Tick Clipping before you start, and those vertices can't leave the line.

## Checking your model

Turn on Statistics in the Overlays popover and check:

1. The two halves meet with no gap down the middle.
2. Each elbow and knee has three loops close together.
3. The feet stand on the floor, with the origin between them.
4. Statistics shows under 2,000 triangles.
5. Scale reads 1, 1, 1 in Object Mode.
