---
needs: [interface]
exercise: recover-a-change
watch: [cgcookie-blender-files, blender-manual-files-blend-open-save]
sources:
  - Blender 5.2 Manual, "Opening & Saving", Save (Ctrl+S), Save Incremental (Ctrl+Alt+S), File > Recover > Last Session and Auto Save (https://docs.blender.org/manual/en/5.2/files/blend/open_save.html), read 2026-10-15
  - Blender 5.2 Manual, "Recovering Data", the .blend1 backup, quit.blend, auto save every 2 minutes (https://docs.blender.org/manual/en/5.2/troubleshooting/recover.html), read 2026-10-15
  - Blender 5.2 Manual, "Undo & Redo", Ctrl+Z, Shift+Ctrl+Z, Edit > Undo History, the history lost on quitting (https://docs.blender.org/manual/en/5.2/interface/undo_redo.html), read 2026-10-15
  - Blender 5.2 Manual, "Save & Load" preferences, Save Versions, Auto Save and its timer (https://docs.blender.org/manual/en/5.2/editors/preferences/save_load.html), read 2026-10-15
  - Blender 5.2.2, factory preferences, 1 save version, auto save every 2 minutes, 32 undo steps; File > Open hides .blend1 files; Save Incremental turns potion_01.blend into potion_02.blend and carries on in it, checked 2026-10-15
  - CG Cookie, "Working with Blender Files" (https://www.youtube.com/watch?v=5dRvcq0rLzU), read 2026-10-15
---

# Saving and undo

Blender keeps several backups of your work, each for a different accident. In this lesson you'll save files and numbered copies, step back through undo, and recover work after Blender closes without saving or crashes.

![A folder holding potion_01.blend, potion_02.blend and potion_02.blend1, beside the File > Recover menu with Last Session and Auto Save.](example)

## Steps

1. **Save.** Press `Ctrl+S`. The first time, Blender opens the File Browser: choose a folder, type a name and click Save. After that, `Ctrl+S` saves over the same file without asking.

   ![The File Browser for saving, with a folder chosen, potion.blend typed as the name, and the Save button picked out.](save)

2. **Keep the last save.** Each time you save, Blender keeps the file you are replacing, renamed to end in .blend1, in the same folder. File > Open doesn't list .blend1 files, so rename one to end in .blend before you open it.

   ![potion.blend, the latest save, beside potion.blend1, the save before it.](blend1)

3. **Save numbered copies.** File > Save Incremental, or `Ctrl+Alt+S`, saves under the next number: potion_01.blend becomes potion_02.blend, and you carry on working in the new file. The older numbers stay as they were.

   ![potion_01.blend, then potion_02.blend and potion_03.blend, each made by one Ctrl+Alt+S.](incremental)

4. **Undo and redo.** `Ctrl+Z` undoes the last action and `Shift+Ctrl+Z` redoes it. Edit > Undo History lists the recent actions; click one to go back to that point. Blender keeps 32 steps and forgets them all when it closes, even if you saved.

   ![Edit > Undo History, newest first: Duplicate Objects, Scale, Move, Add Cylinder and Original. A dot marks the current step, and the mouse is on Move.](undo-history)

5. **Recover lost work.** File > Recover > Last Session opens the scene as it was when Blender last closed, even if you chose Don't Save. After a crash, File > Recover > Auto Save finds the copy Blender saves every 2 minutes.

   ![The File menu open at Recover, with Last Session and Auto Save picked out.](recover)

## Common mistake

![Left, one file, potion.blend, saved over all afternoon, with only potion.blend1 behind it. Right, potion_01 to potion_04, one for each stage of the model.](mistake)

Saving over one file all day leaves little to go back to. If the model went wrong an hour ago, undo may not reach that far, and the .blend1 holds only the save before. Save a numbered copy with `Ctrl+Alt+S` at each stage instead.

## Checking your work

When the exercise is done, check:

1. The folder holds recover-test.blend and recover-test.blend1.
2. The cone you never saved is back in the scene.
3. The file you saved with Save As opens with both the cylinder and the cone.

A restart can delete the files in the temporary folder that holds Last Session and Auto Save, so recover your work before you restart.
