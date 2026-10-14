---
needs: [keyframes]
exercise: rolling-wheels
watch: [royal-skies-drivers, cg-world-wheel-drivers]
sources:
  - Blender 5.2 Manual, "Animation" introduction, State Colors, purple is controlled by a driver (https://docs.blender.org/manual/en/5.2/animation/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Drivers" introduction (https://docs.blender.org/manual/en/5.2/animation/drivers/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Drivers Usage", Add Driver with Ctrl-D, Copy Driver to Selected, typing # and an expression (https://docs.blender.org/manual/en/5.2/animation/drivers/usage.html), read 2026-10-15
  - Blender 5.2 Manual, "Drivers Panel", Scripted Expression, Transform Channel variables, World Space (https://docs.blender.org/manual/en/5.2/animation/drivers/drivers_panel.html), read 2026-10-15
  - Blender 5.2 Manual, "Drivers Editor" (https://docs.blender.org/manual/en/5.2/editors/drivers_editor.html), read 2026-10-15
  - Blender 5.2 source, editors/animation/drivers.cc, a driver added from a field gets one Transform Channel variable called var (https://projects.blender.org/blender/blender/src/branch/blender-v5.2-release/source/blender/editors/animation/drivers.cc), read 2026-10-15
  - Blender 5.2 source, editors/interface/interface_context_menu.cc, the right-click menu of a driven field (https://projects.blender.org/blender/blender/src/branch/blender-v5.2-release/source/blender/editors/interface/interface_context_menu.cc), read 2026-10-15
  - Blender 5.2 source, editors/space_graph/graph_buttons.cc, a Transform Channel variable's Object, Type and Space fields (https://projects.blender.org/blender/blender/src/branch/blender-v5.2-release/source/blender/editors/space_graph/graph_buttons.cc), read 2026-10-15
  - Clockmender, "Wheel rotation along path", Blender Artists, drivers work in radians and a wheel turns 2π radians per circumference rolled (https://blenderartists.org/t/wheel-rotation-along-path/677009), read 2026-10-15
  - The wheel drivers were built and played in Blender 5.2.2 on the driver-cart starter, 2026-10-15
---

# Drivers

A driver sets one property from another. You animate the cart, and the wheels work out how far to turn on their own. In this lesson you'll add a driver to a wheel's rotation, link it to the cart's position and copy it to the other three wheels.

![The cart seen from the side, faint where it started and solid after rolling 3.77 m to the right. A spoke on each near wheel has turned one and a half turns, from straight up to straight down.](example)

## Steps

1. **Add a driver.** Select one wheel. In the Properties editor's Object tab, hover over the Y field under Rotation and press `Ctrl+D`. The field turns purple and the Edit Driver popover opens beside it.

   ![The Transform panel with the Y field under Rotation picked out and the mouse over it, beside the key Ctrl+D.](add)

2. **Point it at the cart.** The driver has one variable called var, a Transform Channel, which reads one transform value from an object. Set its Object to Cart, Type to X Location and Space to World Space.

   ![The Edit Driver popover filled in: Type Scripted Expression, Expression var / 0.4, and the variable var reading the Cart's X Location in World Space.](popover)

3. **Write the expression.** Replace the text in Expression with var / 0.4. Drivers work in radians, and a wheel 0.4 m in radius turns one radian for every 0.4 m it rolls.

   ![A wheel 0.4 m in radius rolled 0.4 m to the right. The 0.4 m of rim that touched the floor has turned up behind it through one radian.](rolling)

4. **Copy it to the other wheels.** In the Outliner, under Cart, `Ctrl` click the other three wheels, then the driven wheel last so it's active. Right click its Y rotation field and choose Copy Driver to Selected.

   ![The Outliner with three wheels selected and Wheel front left active, beside the right-click menu of the driven field with Copy Driver to Selected picked out.](copy)

5. **Play it.** Press `Space`. Each wheel turns once for every 2.51 m the cart travels, and it slows down and speeds up with the cart. To change a driver, right click its field and choose Edit Driver.

Clockmender sets out the rule on Blender Artists: a wheel turns 2π radians, one full turn, for each circumference it rolls.

## Common mistake

![Left, var / 0.4 * 57.3: after 1.26 m the wheel has spun about 29 turns. Right, var / 0.4: the spoke has turned half a turn, from straight up to straight down.](mistake)

Rotation fields show degrees, so it's tempting to convert with 57.3 or 360. A driver sets the value Blender stores, which is in radians, so var / 0.4 is already right. Converting it again spins the wheels 57 times too far.

## Checking your work

Play the animation from frame 1 and check:

1. All four wheels' Y rotation fields are purple.
2. The wheels turn the way the cart rolls, with no sliding.
3. Each wheel's bar makes one turn per 2.51 m of travel.
4. At frame 96 each wheel's Y rotation reads 1146°.
