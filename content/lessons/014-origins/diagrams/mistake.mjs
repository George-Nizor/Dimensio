// Wrong: with Affect Only Origins still on, G moves only the orange dot and the crate stays
// behind. Right: with it off, the crate and its origin move together.
import { view, drawMesh, translate } from '../../../diagrams/mesh.mjs';
import { panel, origin } from './parts.mjs';
import { crate } from './props.mjs';

export default (kit) => {
  const cell = (x, moves, tag, tone) => {
    const v = view({ at: [x + 90, 122], scale: 44, target: [0.6, 0, 0.5] });
    const [ax, ay] = v.project([0, 0, 0]);
    const [bx, by] = v.project([1.6, 0, 0]);
    return [
      panel(kit, x, 14, 220, 176),
      moves ? drawMesh(kit, crate(), v, { mode: 'wire', cls: 'd-guide', width: 1.1 }) : drawMesh(kit, crate(), v, { width: 1.6 }),
      moves ? drawMesh(kit, translate(crate(), [1.6, 0, 0]), v, { width: 1.6, cls: 'd-mark' }) : '',
      kit.line(ax + 8, ay + 4, bx - 8, by - 4, { cls: tone === 'bad' ? 'd-bad' : 'd-mark', width: 2 }),
      kit.arrowhead(bx - 8, by - 4, Math.atan2(by - ay, bx - ax), { cls: tone === 'bad' ? 'd-bad' : 'd-mark', size: 7 }),
      origin(kit, bx, by),
      kit.tag(x + 110, 214, tag, { tone }),
    ];
  };
  return kit.svg({ width: 500, height: 228 },
    cell(14, false, 'only the dot moves', 'bad'),
    cell(266, true, 'crate and origin move'),
  );
};
