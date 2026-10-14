---
needs: [navigation]
exercise: letters-on-a-laptop
watch: [ryan-king-without-numpad, surfaced-studio-no-mouse-numpad]
sources:
  - Blender 5.2 Manual, "Input", Emulate Numpad, Emulate 3 Button Mouse and its warning, Multi-touch Gestures (https://docs.blender.org/manual/en/5.2/editors/preferences/input.html), read 2026-10-15
  - Blender 5.2 Manual, "Configuring Peripherals", mouse button emulation table, numpad emulation, supported multi-touch gestures (https://docs.blender.org/manual/en/5.2/getting_started/configuration/hardware.html), read 2026-10-15
  - Blender 5.2 Manual, "Navigating", Navigation Gizmo and its four buttons (https://docs.blender.org/manual/en/5.2/editors/3dview/navigate/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Default Keymap", AccentGrave for the navigation pie menu (https://docs.blender.org/manual/en/5.2/interface/keymap/blender_default.html), read 2026-10-15
  - Blender 5.2 Manual, "Transform Pivot Point", Period opens the pivot point menu (https://docs.blender.org/manual/en/5.2/editors/3dview/controls/pivot_point/index.html), read 2026-10-15
  - Blender 5.2.2, the View pie's items (5.2/scripts/startup/bl_ui/space_view3d.py, VIEW3D_MT_view_pie) and Multi-touch Gestures on in a factory start, checked 2026-10-15
  - Blender 5.2 source, numpad emulation turns the number row, minus, equals and backslash into numpad keys but leaves the period key alone (source/blender/windowmanager/intern/wm_event_system.cc), read 2026-10-15
  - Ryan King Art, "How to Use Blender Without a Numpad (7 Methods)" (https://www.youtube.com/watch?v=6tYuNEDjgnQ), read 2026-10-15
---

# Navigating on a laptop

Lesson 3 used a middle mouse button and a numpad, and many laptops have neither. In this lesson you'll set Blender up so the number row works as a numpad and `Alt` with the left button works as a middle button. You'll also orbit, pan and zoom with two fingers on a touchpad.

![A laptop keyboard and touchpad. The 1, 3 and 7 keys on the number row are picked out, and two fingers drag on the touchpad.](example)

## Steps

1. **Emulate the numpad.** Open Edit > Preferences > Input and tick Emulate Numpad. The number row along the top of the keyboard now does the numpad's job: `1` for the front, `3` for the right, `7` for the top and `5` to switch the projection.

   ![The number row with 1, 3, 5 and 7 picked out, each matched to the same key on the numpad.](number-row)

2. **Emulate the middle button.** In the same window, tick Emulate 3 Button Mouse. A left drag with `Alt` held now orbits. Add `Shift` to pan or `Ctrl` to zoom. A few `Alt` shortcuts stop working, such as changing a value on all selected objects.

   ![Alt with a left drag to orbit, Shift and Alt with a left drag to pan, and Ctrl and Alt with a left drag to zoom.](emulate-mouse)

3. **Use two fingers.** Drag two fingers on the touchpad to orbit. Hold `Shift` while you drag to pan, or `Ctrl` to zoom, and tap with two fingers to right click. These need Multi-touch Gestures, under Touchpad in the same window, which starts on.

   ![A touchpad with two fingers dragging: on their own they orbit, with Shift they pan, with Ctrl they zoom.](touchpad)

4. **Use the gizmo's buttons.** Under the navigation gizmo are four buttons. Drag the magnifying glass to zoom and the hand to pan. The camera button looks through the camera, and the grid button switches between perspective and orthographic.

   ![The navigation gizmo with its four buttons below it, the magnifying glass and the hand picked out.](gizmo-buttons)

5. **Open the View pie.** Press `` ` ``, next to `1`. A pie menu, a ring of choices around the mouse, offers the six side views, View Camera and View Selected. View Selected frames the selection, which `Numpad .` did.

   ![The View pie around the mouse: Left, Right, Bottom, Top, Front, Back, View Camera and View Selected, with View Selected picked out.](view-pie)

Ryan King Art shows seven ways to work without a numpad, the pie menu among them.

## Common mistake

![Left, the . key pressed on a laptop: the Pivot Point pie opens and the view stays put. Right, View Selected chosen in the View pie: the object fills the view.](mistake)

Emulate Numpad doesn't change `.` on the main keyboard. Pressing `.` to frame the selection opens the Pivot Point pie instead, and the view doesn't move. Press `Esc` to close that pie, then use View Selected in the `` ` `` pie.

## Checking your work

Go back over the exercise file and check:

1. Edit > Preferences > Input shows Emulate Numpad and Emulate 3 Button Mouse ticked.
2. The number row's `1`, `3` and `7` show the front, right and top.
3. You found all six letters without a numpad or a middle button.
4. View Selected in the `` ` `` pie framed the small crate, Prop 1.

To go back to a mouse and numpad later, untick both options in the same window.
