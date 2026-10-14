// A crate whose origin floats above and behind it. The Location fields give the position of the
// dot, not of the crate.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { origin, field } from './parts.mjs';
import { crate } from './props.mjs';

export default (kit) => {
  const v = view({ at: [150, 160], scale: 60, target: [0, 0, 0.6] });
  const [ox, oy] = v.project([1.2, 1.6, 1.7]);
  const [cx, cy] = v.project([0, 0, 0.5]);
  return kit.svg({ width: 480, height: 240 },
    kit.line(ox, oy, cx, cy, { cls: 'd-guide', width: 1, dash: '3 5' }),
    drawMesh(kit, crate(), v, { width: 1.6, cls: 'd-mark' }),
    origin(kit, ox, oy),
    kit.text(ox - 12, oy - 12, 'origin', { anchor: 'end', size: 12 }),
    kit.text(320, 132, 'Location', { size: 12 }),
    field(kit, 310, 156, 'X', '1.2 m', { labelWidth: 30, width: 120, mark: true }),
    field(kit, 310, 180, 'Y', '1.6 m', { labelWidth: 30, width: 120, mark: true }),
    field(kit, 310, 204, 'Z', '1.7 m', { labelWidth: 30, width: 120, mark: true }),
  );
};
