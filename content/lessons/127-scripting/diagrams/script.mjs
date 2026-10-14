// The export script as it reads in the Text Editor, with line numbers. Not a diagram itself: the
// lines are shared by the diagrams that show the script, and checked in Blender 5.2.2.
export const SCRIPT = [
  'import bpy',
  'import os',
  '',
  'folder = bpy.path.abspath("//export")',
  'os.makedirs(folder, exist_ok=True)',
  '',
  'for obj in bpy.data.collections["Kit"].objects:',
  '    bpy.ops.object.select_all(action="DESELECT")',
  '    obj.select_set(True)',
  '    place = obj.location.copy()',
  '    obj.location = (0, 0, 0)',
  '    path = os.path.join(folder, obj.name + ".glb")',
  '    bpy.ops.export_scene.gltf(filepath=path,',
  '        use_selection=True, export_apply=True)',
  '    obj.location = place',
  '    print("Saved", path)',
];
