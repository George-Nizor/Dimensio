// The Add brush: each click plants Count strands of the set Length on the surface under the
// brush circle. The header shows Count, and Curve Shape holds the Length.
import { tuft, tile } from './strands.mjs';
import { field, push } from './helpers.mjs';
import { cursor } from '../../../diagrams/mesh.mjs';

export default (kit) => kit.svg({ width: 500, height: 200 },
  tile(kit, 20, 150, 260),
  tuft(kit, 70, 150, { seed: 3, length: 40 }),
  tuft(kit, 150, 150, { seed: 5, length: 40 }),
  kit.ellipse(230, 150, 30, 8, { cls: 'd-mark', width: 2, dash: '5 4' }),
  cursor(kit, 232, 146),
  tuft(kit, 230, 150, { seed: 9, length: 40, cls: 'd-mark', n: 10 }),
  kit.text(150, 186, 'click to plant a tuft', { anchor: 'middle', size: 12 }),
  `<rect x="300" y="40" width="190" height="96" rx="6" class="d-ui" stroke-width="1"/>`,
  kit.text(310, 58, 'Add brush', { size: 11 }),
  field(kit, 306, 68, 178, 'Count', '10', { on: true, labelWidth: 0.48 }),
  field(kit, 306, 98, 178, 'Length', '0.15 m', { on: true, labelWidth: 0.48 }),
);
