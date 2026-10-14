---
needs: [first-material]
exercise: light-three-ways
watch: [cgcookie-lighting, blender-three-point-lighting]
sources:
  - Blender 5.2 Manual, "Light Objects", Point, Spot (Beam Shape Angle and Blend), Area and Sun, Power, Strength, Radius and Angle (https://docs.blender.org/manual/en/5.2/render/lights/light_object.html), read 2026-10-15
  - Blender 5.2 Manual, "Viewport Shading", Rendered, and Material Preview's Scene Lights option (https://docs.blender.org/manual/en/5.2/editors/3dview/display/shading.html), read 2026-10-15
  - Blender 5.2 Manual, "Light Settings (EEVEE)" (https://docs.blender.org/manual/en/5.2/render/eevee/light_settings.html), read 2026-10-15
  - Blender 5.2.2, defaults checked 2026-10-15, a new light's Power is 10 W and Material Preview starts with Scene Lights off
  - Wikipedia, "Three-point lighting", key, fill at up to half the key's brightness, and back light (https://en.wikipedia.org/wiki/Three-point_lighting), read 2026-10-15
  - Blender Foundation, "Three Point Lighting - Blender 2.80 Fundamentals" (https://www.youtube.com/watch?v=RDbrOpnIY7Q), checked 2026-10-15
  - CG Cookie, "Lighting in Blender - BLENDER 4.5 BASICS (part 19)" (https://www.youtube.com/watch?v=E3d7R7BNr_4), checked 2026-10-15
---

# Lights

The same model can look flat or solid depending on how you light it. In this lesson you'll add Blender's four kinds of light and set their power and colour. Then you'll light a prop with three lights: a key, a fill and a rim.

![The exercise's three-light setup from above: the crate and barrel in the middle, the camera in front, a key front left, a smaller fill front right and a rim behind.](example)

## Steps

1. **Look in Rendered view.** Press `Z` and choose Rendered. Solid view uses its own studio lighting, and Material Preview leaves your lights out until you tick Scene Lights, so Rendered is the view that shows them.

   ![The Z pie menu with Wireframe, Solid, Material Preview and Rendered, Rendered picked out.](rendered)

2. **Add a light.** In Object Mode, press `Shift+A` > Light and choose Point, Sun, Spot or Area. Its settings are in the Properties editor's Object Data tab: Color, and Power in watts, which starts at 10 W.

   ![The Add > Light menu with its four kinds, and the light's Object Data tab with Color and Power, which reads 10 W.](add)

3. **Know the four kinds.** A Point shines all round, like a bulb; a larger Radius softens its shadows. A Spot is a cone, shaped by Angle and Blend under Beam Shape. An Area is a glowing square or disk. A Sun shines from one direction.

   ![The four kinds of light: a point with rays all round, a spot's cone, an area light shining down from a square, and a sun's parallel rays.](kinds)

4. **Set up three lights.** Put the key, the brightest light, in front and to one side. Put a fill on the other side at half the key's power or less, to lift the shadows. Put a rim behind the prop to light its edges.

   ![From above: the key front left, the fill front right and the rim behind the crate, with each one's job written beside it.](three-point)

5. **Aim the sun.** Rotate a Sun to aim it. Moving it changes nothing, because only its direction counts. It has Strength instead of Power; about 4 suits this scene. An Angle above 0 softens its shadows.

   ![Sun rays all coming from the same direction, and two crates casting shadows that point the same way.](sun)

The Blender Foundation's short Three Point Lighting video walks through the same arrangement.

## Common mistake

![The crate lit two ways. Left, the fill as bright as the key: every side equally bright and the crate flat. Right, the fill at half the key or less: one side darker.](mistake)

With the fill as bright as the key, both sides get equal light, so the prop has no darker side and looks flat. Keep the fill at half the key's power or less, so one side stays in shade.

## Checking your work

Look through the camera (`Numpad 0`) in Rendered view and check:

1. With one Sun, every shadow falls the same way.
2. In the three-light setup, one side of each prop is darker than the other.
3. The rim light draws a bright line along the props' edges.
4. At night, the lamp's light fades into darkness away from it.
