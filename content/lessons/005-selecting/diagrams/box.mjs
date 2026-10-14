// A box dragged across part of the yard: the objects it touches are selected, the rest are not.
import { cursor } from '../../../diagrams/mesh.mjs';
import { yardView, drawYard, B, C } from './yard.mjs';

export default (kit) => {
  const v = yardView({ at: [250, 120], scale: 30 });
  return kit.svg({ width: 500, height: 240 },
    drawYard(kit, v, [
      C(-4, 1.6), B(-2.4, 2.2), C(-0.6, 1.8, 'selected'), B(1.4, 2.0, 'selected'), C(3.6, 1.4),
      B(-3.6, -1.2), C(-1.4, -0.6, 'selected'), B(0.8, -0.8, 'active'), C(3, -1.4),
    ]),
    `<rect x="186" y="46" width="146" height="128" class="d-ui-mark" stroke-width="1.6" stroke-dasharray="6 5" fill-opacity="0.25"/>`,
    cursor(kit, 330, 172),
  );
};
