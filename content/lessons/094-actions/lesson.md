---
needs: [dope-sheet]
exercise: door-actions
watch: [southern-shotty-actions, blender-manual-editors-dope-sheet-modes-action]
sources:
  - Blender 5.2 Manual, "Actions", actions as data-blocks, slots, manual assignment (https://docs.blender.org/manual/en/5.2/animation/actions.html), read 2026-10-15
  - Blender 5.2 Manual, "Action Editor", the Action and Slot selectors, Stash Action, New Action stashing the previous action (https://docs.blender.org/manual/en/5.2/editors/dope_sheet/modes/action.html), read 2026-10-15
  - Blender 5.2 Manual, "Dope Sheet" introduction, the mode menu in the header (https://docs.blender.org/manual/en/5.2/editors/dope_sheet/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Editing Keyframes", hovering over a property and pressing I (https://docs.blender.org/manual/en/5.2/animation/keyframes/editing.html), read 2026-10-15
  - Blender 5.2 Manual, "glTF 2.0", Animation mode Actions exports the active action and stashed ones (https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html), read 2026-10-15
  - Blender 5.2 source, editors/space_action/action_data.cc, New Action copies the current action and stashes it; unlinking an action with one user warns that it will not be saved (https://projects.blender.org/blender/blender/src/branch/blender-v5.2-release/source/blender/editors/space_action/action_data.cc), read 2026-10-15
  - Checked in Blender 5.2.2 on 2026-10-15, the Animation workspace's bottom area is a Dope Sheet, and the first keyframe on an object makes an action named after it, such as DoorAction
---

# Actions

An action is one named animation. An object plays one action at a time, but a game needs several: a door that opens, and the same door closing. In this lesson you'll keep two animations of one door as two actions and switch between them.

![Two actions for one door, seen from above: open turns it on its hinge from 0° to -100°, and close turns it back from -100° to 0°.](example)

## Steps

1. **Open the Action Editor.** Click the Animation workspace tab. In the header of the Dope Sheet along the bottom, set the mode menu to Action Editor. It shows the keyframes of the active object's one action, with the action's name in the header.

   ![The Dope Sheet's header with its mode menu open and Action Editor picked out.](mode)

2. **Animate the opening.** At frame 1, hover over the door's Z rotation in the Object tab and press `I`. At frame 24, type -100 there and press `I`. Blender stores the keyframes in an action, DoorAction. Double click its name and type open.

   ![The Action Editor's header with the action renamed open, above the door seen from above at frame 1 and at frame 24, and the Z rotation channel with a keyframe at each.](keys)

3. **Make a second action.** Click New Action beside the name. Blender stashes open, keeping it on a muted NLA track, and gives you a copy. Rename it close, then insert -100° at frame 1 and 0° at frame 24 over the copied keyframes.

   ![New Action picked out in the header, then the copy renamed close, and open kept on a muted Action Stash track in the NLA editor.](newaction)

4. **Switch between them.** Click the shield beside close first. This Fake User keeps an action saved when nothing plays it. Then click the browse button left of the name and choose open. The door plays whichever action is active.

   ![The header with close's Fake User shield pressed, and the browse list open with close and open in it and open picked out.](switch)

5. **Keep actions for export.** The glTF exporter takes the active action and every stashed one, each as its own animation. Action > Stash Action stashes the active one. The slot beside the name lets one action animate several objects; a door needs one.

## Common mistake

![Left, the X beside open clicked: open has no users and is gone when the file is reopened. Right, New Action clicked: open is stashed on a muted track and kept.](mistake)

Clicking the X beside an action to start a fresh one unlinks it. Nothing uses it any more, so Blender warns that saving will drop it, and it's gone when you reopen the file. Click New Action instead, which stashes the old one.

## Checking your work

Save the file, reopen it and check:

1. The browse list shows open and close.
2. With open active, the door turns from 0° to -100°.
3. With close active, it turns back from -100° to 0°.
4. close has its Fake User shield pressed.
