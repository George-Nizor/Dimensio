// Painting with the Paint brush at Weight 1.0. Left, a drag over the arm's first rings raises them
// to full weight. Right, the same drag with Ctrl held paints the opposite weight, 0, and takes the
// weight away.
import { keycap } from '../../../diagrams/mesh.mjs';
import { shoulder, frame } from './shoulder.mjs';

export default (kit) => {
  const brush = (x, y) => [kit.circle(x, y, 26, { cls: 'd-ink', width: 1.4 }), kit.dot(x, y, { r: 2 })];
  return kit.svg({ width: 520, height: 230 },
    frame(kit, 12, 14, 244, 184),
    shoulder(kit, 84, 70, { weights: [0.2, 1, 1, 1, 1, 1, 1, 1] }),
    brush(100, 70),
    kit.text(134, 176, 'drag: adds weight', { anchor: 'middle', size: 12 }),
    frame(kit, 264, 14, 244, 184),
    shoulder(kit, 336, 70, { weights: [0, 0, 0, 0.3, 1, 1, 1, 1] }),
    brush(370, 70),
    keycap(kit, 418, 120, 'Ctrl', { size: 12 }),
    kit.text(386, 176, 'Ctrl and drag: takes it away', { anchor: 'middle', size: 12 }),
  );
};
