---
needs: [install-blender]
exercise: rearrange-layout
watch: [cgcookie-editors-windows, grant-abbitt-interface]
sources:
  - Blender 5.2 Manual, "Window System Introduction" (https://docs.blender.org/manual/en/5.2/interface/window_system/introduction.html), read 2026-10-15
  - Blender 5.2 Manual, "Areas" (https://docs.blender.org/manual/en/5.2/interface/window_system/areas.html), read 2026-10-15
  - Blender 5.2 Manual, "Regions" (https://docs.blender.org/manual/en/5.2/interface/window_system/regions.html), read 2026-10-15
  - Blender 5.2 Manual, "Workspaces" (https://docs.blender.org/manual/en/5.2/interface/window_system/workspaces.html), read 2026-10-15
  - Blender 5.2 Manual, "Status Bar" (https://docs.blender.org/manual/en/5.2/interface/window_system/status_bar.html), read 2026-10-15
  - Blender 5.2 Manual, "Editors" (https://docs.blender.org/manual/en/5.2/editors/index.html), read 2026-10-15
  - Blender 5.2 Manual, "Topbar", Menu Search (https://docs.blender.org/manual/en/5.2/interface/window_system/topbar.html), read 2026-10-15
  - Blender 5.2 Manual, "Common Shortcuts" for F3 (https://docs.blender.org/manual/en/5.2/interface/keymap/blender_default.html), read 2026-10-15
---

# The interface

Blender's window is divided into areas, and each area holds an editor, such as the 3D Viewport or the Outliner. In this lesson you'll learn what each part of the window is for, how to change and rearrange areas, and how to find any command by its name.

![The Layout workspace with each part labelled: the Topbar, the 3D Viewport, the Outliner, the Properties editor, the Timeline and the Status Bar.](example)

## Steps

1. **Name the parts.** The Topbar runs along the top, with the menus and the workspace tabs. The Status Bar along the bottom shows what each mouse button does right now. Between them are the areas. The Layout workspace has four of them.

   ![The Layout workspace with the Topbar and the Status Bar picked out, and its four areas between them.](parts)

2. **Change an editor.** Every area has a header with the Editor Type button at its left end. Click it and choose another editor, such as the Shader Editor, to change what that area shows.

   ![An area's header with the Editor Type button at its left end picked out, and its list of editors open below it.](editor-type)

3. **Resize, split and join.** Drag the border between two areas to resize them. Put the mouse in an area's corner until it turns into a cross, then drag inwards to split the area, or drag into the next area to join them.

   ![Two areas side by side: an arrow dragging the border between them, and an arrow dragging out from a corner to split one.](split-join)

4. **Show the Toolbar and Sidebar.** With the mouse over the 3D Viewport, press `T` to show or hide the Toolbar on the left and `N` to show or hide the Sidebar on the right.

   ![The 3D Viewport with the Toolbar on its left edge and the Sidebar on its right edge picked out, beside the keys T and N.](toolbar-sidebar)

5. **Maximize an area.** Press `Ctrl+Space` over an area to make it fill the window, and press it again to put it back. `Ctrl+Alt+Space` is Focus Mode, which also hides the Topbar and the Status Bar.

   ![Left, the Layout workspace with the 3D Viewport picked out. Right, the 3D Viewport filling the whole window after Ctrl+Space.](maximize)

6. **Search for a command.** Press `F3` to open Menu Search and type part of a command's name, such as "smooth". It finds the menu item for you, and clicking it runs the command.

   ![The Menu Search box after pressing F3, with "smooth" typed and Object > Shade Smooth and Object > Shade Auto Smooth listed below it.](search)

## Common mistake

![Left, the mouse over the Outliner when Ctrl+J is pressed, and nothing happens. Right, the mouse over the 3D Viewport, where Ctrl+J joins the objects.](mistake)

Many shortcuts only work in the editor under the mouse. `Ctrl+J` joins objects in the 3D Viewport but does nothing over the Outliner, even with the objects selected there. Move the mouse over the editor you mean before you press a key.

## Checking your work

When the exercise is done, check each of these:

1. The Layout workspace shows its four areas, as it did at the start.
2. `T` and `N` show and hide the Toolbar and the Sidebar.
3. `Ctrl+Space` fills the window with the area under the mouse, and puts it back.
4. `F3` finds Save As and Shade Smooth by name.

If a layout gets too tangled to fix, File > New > General starts a fresh file with the usual layout.
