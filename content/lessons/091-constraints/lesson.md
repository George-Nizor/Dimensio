---
needs: [parenting, keyframes]
exercise: camera-and-turret
watch: [ryan-king-object-constraints, blender-tracking-constraints]
sources:
  - 'Blender 5.2 Manual, "Constraints: Introduction", adding constraints and the visual transform (https://docs.blender.org/manual/en/5.2/animation/constraints/introduction.html), read 2026-10-15'
  - Blender 5.2 Manual, "Constraint Stack" (https://docs.blender.org/manual/en/5.2/animation/constraints/interface/stack.html), read 2026-10-15
  - 'Blender 5.2 Manual, "Constraints: Common", Target and the red icon, Influence (https://docs.blender.org/manual/en/5.2/animation/constraints/interface/common.html), read 2026-10-15'
  - Blender 5.2 Manual, "Track To Constraint" (https://docs.blender.org/manual/en/5.2/animation/constraints/tracking/track_to.html), read 2026-10-15
  - Blender 5.2 Manual, "Damped Track Constraint" (https://docs.blender.org/manual/en/5.2/animation/constraints/tracking/damped_track.html), read 2026-10-15
  - Blender 5.2 Manual, "Copy Location Constraint", Offset (https://docs.blender.org/manual/en/5.2/animation/constraints/transform/copy_location.html), read 2026-10-15
  - Blender 5.2 Manual, "Child Of Constraint", Influence and Set Inverse (https://docs.blender.org/manual/en/5.2/animation/constraints/relationship/child_of.html), read 2026-10-15
  - Blender 5.2 Manual, "Limit Rotation Constraint", Affect Transform (https://docs.blender.org/manual/en/5.2/animation/constraints/transform/limit_rotation.html), read 2026-10-15
  - Blender 5.2 Manual, "Track", Object > Track > Track To Constraint with the active object as target (https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/track.html), read 2026-10-15
  - Blender 5.2 Manual, "Properties Editor", the Object Constraints tab (https://docs.blender.org/manual/en/5.2/editors/properties_editor.html), read 2026-10-15
  - 'Blender 5.2.2, checked 2026-10-15 in a script on the cart-turret starter: Track To defaults to Track Axis -Z and Up Y, which suits a camera; Copy Location with Offset above Track To keeps the camera with the cart and aimed at it, and with Track To above, the aim is 32 degrees off at frames 1 and 120; Damped Track with Track Axis Y aims the turret head''s barrel at the target; rotating a camera that has Track To changes nothing on screen'
---

# Constraints

A constraint makes an object follow, aim at or copy another object, and keeps doing it as both move. In this lesson you'll make a camera follow a cart and keep it in view, aim a turret at a moving target, and carry and limit objects.

![A cart on the ground with a camera aiming at it, and a turret whose barrel aims at a floating target, dashed lines showing where each one points.](example)

## Steps

1. **Add a constraint.** Select the Camera and open the Properties editor's Object Constraints tab. Click Add Object Constraint. The menu has four columns: Motion Tracking, Transform, Tracking and Relationship. Choose Track To, under Tracking.

   ![The Add Object Constraint menu in four columns, Motion Tracking, Transform, Tracking and Relationship, with Track To picked out under Tracking.](add)

2. **Aim the camera.** Set Track To's Target to the Cart. A constraint's icon stays red until it has a target. Now the camera stays where it is and turns, on every frame, to keep the cart in view.

   ![Seen from the top: the cart on frames 1, 60 and 120, and the camera in one place turning to aim at it.](track-to)

3. **Follow the cart.** Add Copy Location with Target set to the Cart and Offset ticked, so the camera moves with the cart at its own distance. Drag it above Track To. Blender runs the stack from the top, so the camera moves first, then aims.

   ![Seen from the top: the camera moving along with the cart on frames 1, 60 and 120, and the stack with Copy Location first and Track To second.](follow)

4. **Aim the turret.** Select Turret head and add Damped Track. Set Target to the Target and Track Axis to Y, the way its barrel points. Damped Track turns the barrel towards the target by the shortest swing, without the up axis Track To uses.

   ![The turret aiming its barrel at the target on its left, then at the target on its right.](damped)

5. **Carry an object.** Child Of makes an object follow its target the way a child follows its parent. Unlike a parent, you can keyframe its Influence to pick something up partway through. If the object jumps when you set the target, click Set Inverse.

6. **Limit a hinge.** Limit Rotation keeps an angle within a range. On a lid, tick Limit X and set Min to 0° and Max to 110°, and it stops at 110°. Tick Affect Transform to stop the Rotation fields there too.

   ![A lid on a hinge seen from the side, opening through an arc from 0° to 110° and stopping, with the Limit Rotation settings beside it.](limit)

## Common mistake

![Seen from the top. Left, R pressed on a camera with Track To, and it still aims at the cart. Right, G moves the camera, and it aims at the cart from its new place.](mistake)

Once Track To aims the camera, rotating it does nothing you can see: its Rotation fields change, but the constraint overrides them. Move it with `G` instead, or lower the constraint's Influence to 0 while you set it up by hand.

## Checking your work

Play the animation from frame 1 and check:

1. The camera keeps the cart near the middle of its view.
2. The camera drives along with the cart, at the same distance.
3. The turret's barrel points at the target on every frame.
4. In the camera's stack, Copy Location sits above Track To.
