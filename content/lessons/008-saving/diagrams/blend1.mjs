// Each Ctrl+S keeps the file it replaces: potion.blend is the latest save, potion.blend1 the save
// before it.
import { keycap } from '../../../diagrams/mesh.mjs';
import { file } from './files.mjs';

export default (kit) => kit.svg({ width: 420, height: 180 },
  keycap(kit, 210, 22, 'Ctrl+S', { size: 11 }),
  kit.text(210, 56, 'each save', { anchor: 'middle', size: 12 }),
  file(kit, 70, 46, 'potion.blend', { mark: true, w: 54 }),
  kit.text(97, 156, 'the latest save', { anchor: 'middle', size: 12 }),
  file(kit, 296, 46, 'potion.blend1', { faint: true, w: 54 }),
  kit.text(323, 156, 'the save before it', { anchor: 'middle', size: 12 }),
);
