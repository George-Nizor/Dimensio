// Wrong: Empty Hair added with nothing selected, so the Curves object has no Surface and the
// Add brush plants nothing. Right: the tile selected first, so it is the Surface and the brush
// plants strands on it.
import { tuft, tile } from './strands.mjs';
import { panel, field } from './helpers.mjs';
import { cursor } from '../../../diagrams/mesh.mjs';

export default (kit) => kit.svg({ width: 480, height: 230 },
  panel(kit, 10, 14, 220, 180),
  tile(kit, 30, 120, 180),
  kit.ellipse(120, 120, 30, 8, { cls: 'd-bad', width: 2, dash: '5 4' }), cursor(kit, 122, 116),
  field(kit, 24, 154, 196, 'Surface', 'none', { labelWidth: 0.4 }),
  kit.tag(120, 220, 'nothing selected', { tone: 'bad' }),
  panel(kit, 250, 14, 220, 180),
  tile(kit, 270, 120, 180),
  tuft(kit, 360, 120, { seed: 2, length: 40, n: 10 }),
  field(kit, 264, 154, 196, 'Surface', 'Tile', { on: true, labelWidth: 0.4 }),
  kit.tag(360, 220, 'tile selected first'),
);
