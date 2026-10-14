// The Grow/Shrink brush with Ctrl held: strands under the brush get shorter and keep their
// shape. Without Ctrl it makes them longer.
import { tuft, tile } from './strands.mjs';
import { panel } from './helpers.mjs';
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => kit.svg({ width: 480, height: 200 },
  panel(kit, 10, 14, 180, 150, 'before'),
  tile(kit, 26, 130, 148),
  [56, 100, 144].map((x, i) => tuft(kit, x, 130, { seed: i + 7, length: 70, lean: 10 })),
  keycap(kit, 240, 70, 'Ctrl', { size: 13 }),
  kit.text(240, 104, 'Grow/Shrink', { anchor: 'middle', size: 11 }),
  panel(kit, 290, 14, 180, 150, 'shrunk'),
  tile(kit, 306, 130, 148),
  [336, 380, 424].map((x, i) => tuft(kit, x, 130, { seed: i + 7, length: 32, lean: 5 })),
);
