// Three selected objects: two drawn with orange edges, and the last one clicked with Shift, the
// active object, filled as well.
import { keycap, cursor } from '../../../diagrams/mesh.mjs';
import { yardView, drawYard, B, C } from './yard.mjs';

export default (kit) => {
  const v = yardView({ at: [230, 110], scale: 36 });
  const [ax, ay] = v.project([2.2, -0.4, 0.8]);
  return kit.svg({ width: 460, height: 230 },
    drawYard(kit, v, [C(-2.4, 0.4, 'selected'), B(0, 0.6, 'selected'), C(2.2, -0.4, 'active')]),
    cursor(kit, ax - 6, ay - 4),
    keycap(kit, 46, 200, 'Shift'), kit.text(76, 205, '+ click', { size: 12 }),
    kit.line(ax + 26, ay + 30, ax + 70, ay + 70, { cls: 'd-guide', width: 1.2 }),
    kit.text(ax + 74, ay + 84, 'active', { size: 13, cls: 'd-tag' }),
  );
};
