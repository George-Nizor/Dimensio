// The File Browser after Ctrl+S on a new file: a folder chosen, potion.blend typed as the name, and
// the Save button picked out.
import { keycap } from '../../../diagrams/mesh.mjs';
import { file } from './files.mjs';

export default (kit) => kit.svg({ width: 500, height: 250 },
  keycap(kit, 40, 24, 'Ctrl+S', { size: 11 }),
  `<rect x="14" y="46" width="472" height="196" rx="6" class="d-ui" stroke-width="1"/>`,
  `<rect x="24" y="56" width="452" height="22" rx="4" class="d-sunk" stroke-width="1"/>`,
  kit.text(34, 71, 'C:\\Users\\you\\Documents\\Blender\\', { size: 11, cls: 'd-key-text' }),
  file(kit, 34, 90, 'crate.blend', { w: 38 }),
  file(kit, 104, 90, 'stool.blend', { w: 38 }),
  `<rect x="24" y="206" width="300" height="24" rx="4" class="d-ui-mark" stroke-width="1"/>`,
  kit.text(34, 222, 'potion.blend', { size: 12, cls: 'd-key-text' }),
  `<rect x="336" y="206" width="66" height="24" rx="4" class="d-key-mark" stroke-width="1"/>`,
  kit.text(369, 222, 'Save', { anchor: 'middle', size: 12, cls: 'd-key-text d-key-text-mark' }),
  `<rect x="410" y="206" width="66" height="24" rx="4" class="d-key" stroke-width="1"/>`,
  kit.text(443, 222, 'Cancel', { anchor: 'middle', size: 12 }),
);
