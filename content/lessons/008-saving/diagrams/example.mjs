// A folder holding potion_01.blend, potion_02.blend and potion_02.blend1, beside the File > Recover
// menu with Last Session and Auto Save.
import { file } from './files.mjs';
import { menu } from './parts.mjs';

export default (kit) => kit.svg({ width: 540, height: 190 },
  `<rect x="14" y="20" width="342" height="156" rx="8" class="d-ui" stroke-width="1"/>`,
  kit.text(28, 40, 'your folder', { size: 12 }),
  file(kit, 44, 58, 'potion_01.blend'),
  file(kit, 156, 58, 'potion_02.blend'),
  file(kit, 268, 58, 'potion_02.blend1', { faint: true }),
  kit.text(376, 40, 'File > Recover', { size: 12 }),
  menu(kit, 376, 50, ['Last Session', 'Auto Save...'], { width: 150, row: 26 }),
);
