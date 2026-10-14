---
needs: [curve-geometry]
exercise: inn-sign
watch: [ryan-king-text, blender-manual-modeling-texts-properties]
sources:
  - 'Blender 5.2 Manual, "Text: Introduction" (https://docs.blender.org/manual/en/5.2/modeling/texts/introduction.html), read 2026-10-15'
  - Blender 5.2 Manual, "Editing Text Objects", Tab to leave Edit Mode, converting to a mesh (https://docs.blender.org/manual/en/5.2/modeling/texts/editing.html), read 2026-10-15
  - Blender 5.2 Manual, "Text Properties", Font (Bfont, loading a font, Size), Paragraph (Alignment Center), Geometry (Extrude, Bevel follows the letters' outlines) (https://docs.blender.org/manual/en/5.2/modeling/texts/properties.html), read 2026-10-15
  - Blender 5.2 Manual, "Convert", Mesh (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/convert.html), read 2026-10-15
  - Blender 5.2 Manual, "Merge", By Distance (https://docs.blender.org/manual/en/5.2/modeling/meshes/editing/mesh/merge.html), read 2026-10-15
  - 'Blender 5.2.2, checked 2026-10-15 in a script: a new text object reads "Text" and lies flat; Extrude 0.05 m makes letters 10 cm thick; a 0.02 m bevel widens a letter by 4 cm; the word INN converted with Extrude has 96 vertices and Merge by Distance removes 48 of them, leaving 84 triangles and no n-gons'
---

# 3D text

Blender's text object is made of curves, so you can give letters depth the same way you gave a curve depth. In this lesson you'll add text, type your own word, choose a font and give the letters thickness. Then you'll convert them to a clean mesh for a sign.

![An inn sign: a flat board with the word INN standing out from its front in thick block letters.](example)

## Steps

1. **Add text and type.** Add > Text adds the word "Text", lying flat. Press `Tab` to edit it, `Backspace` to delete letters, and type new ones. Press `Tab` again to go back to Object Mode, then `R` `X` and type 90 to stand it up.

   ![Three steps: the word Text after Add > Text, Edit Mode with INN typed and the cursor after it, and INN back in Object Mode, with Tab between them.](type)

2. **Pick a font.** In the Properties editor's Object Data tab, open the Font panel. Blender's own font is Bfont. Click the folder button beside Regular to load a .ttf or .otf file instead. Size, under Transform, sets how tall the letters are.

   ![The Font panel: Regular, Bold, Italic and Bold & Italic all set to Bfont Regular, the folder button beside Regular picked out, and Size set to 0.4 m.](font)

3. **Centre the word.** In the Paragraph panel, set Alignment Horizontal to Center. The origin now sits in the middle of the line, so the word stays centred on the spot where you put it.

   ![The word INN aligned Left, starting at its origin, and aligned Center, with its origin in the middle of the word.](centre)

4. **Give the letters depth.** Under Geometry, raise Extrude: 0.05 m makes letters 10 cm thick. A small Bevel Depth rounds their edges, with Resolution 0 to keep it low-poly. The bevel follows each letter's outline, so it also makes the letters bolder.

   ![The word INN flat with Extrude 0, and as thick block letters with Extrude 0.05 m.](depth)

5. **Convert and merge.** Choose Object > Convert > Mesh. The faces of each letter come out as separate pieces. Press `Tab`, then `A` to select everything, then `M` and choose By Distance. For the word INN, Blender reports 48 vertices removed.

   ![The Merge menu opened with M, By Distance picked out, and the report that 48 vertices were removed for the word INN.](merge)

## Common mistake

![Left, a converted letter I with its front face apart from its sides, because nothing joins them. Right, the same letter after Merge by Distance, its corners shared.](mistake)

A converted letter looks finished in Solid view, so it's easy to skip the merge. Its front, back and sides are still loose pieces with doubled vertices at every corner. Run Merge by Distance straight after you convert text.

## Checking your model

Look at the sign from the front view, `Numpad 1`, and check:

1. The word reads INN, the right way round.
2. The letters stand out from the front of the board.
3. Running Merge by Distance again removes 0 vertices.
4. The Statistics overlay shows under 400 triangles for the sign.
