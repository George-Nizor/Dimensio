// Godot's Editor Settings at FileSystem > Import > Blender, with the Blender Path field picked out.
import { dock, option } from './godot.mjs';

export default (kit) => kit.svg({ width: 520, height: 170 },
  dock(kit, { x: 14, y: 14, w: 490, h: 140, title: 'Editor Settings' }),
  kit.text(28, 60, 'FileSystem', { size: 11, cls: 'd-key-text' }),
  kit.text(40, 82, 'Import', { size: 11, cls: 'd-key-text' }),
  `<rect x="44" y="92" width="110" height="20" rx="3" class="d-ui-mark" stroke-width="1"/>`,
  kit.text(54, 106, 'Blender', { size: 11, cls: 'd-key-text' }),
  kit.line(170, 44, 170, 146, { cls: 'd-guide', width: 1 }),
  option(kit, 176, 82, 320, 'Blender Path', 'C:/.../blender.exe', { mark: true }),
);
