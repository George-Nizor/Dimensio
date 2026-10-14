// The Comb brush: dragging across strands bends them the way you drag, each keeping its length.
import { tuft, tile } from './strands.mjs';
import { push, panel } from './helpers.mjs';

export default (kit) => kit.svg({ width: 480, height: 214 },
  panel(kit, 10, 14, 220, 150, 'before'),
  tile(kit, 30, 130, 180),
  [60, 110, 160].map((x, i) => tuft(kit, x, 130, { seed: i + 4, length: 52 })),
  panel(kit, 250, 14, 220, 150, 'after Comb'),
  tile(kit, 270, 130, 180),
  [300, 350, 400].map((x, i) => tuft(kit, x, 130, { seed: i + 4, length: 52, lean: 40 })),
  push(kit, 290, 40, 440, 40, { width: 2 }),
  kit.text(240, 204, 'drag the way the strands should lie', { anchor: 'middle', size: 12 }),
);
