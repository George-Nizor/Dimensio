// A corner of the yard with three objects selected: two with orange outlines and the active one,
// the last clicked, filled as well.
import { yardView, drawYard, B, C } from './yard.mjs';

export default (kit) => {
  const v = yardView({ at: [250, 120], scale: 42 });
  return kit.svg({ width: 500, height: 252 },
    drawYard(kit, v, [
      B(-2.6, 1.3), C(-0.9, 1.6, 'selected'), B(0.9, 1.7), C(2.7, 1.1),
      C(-2.9, -0.8, 'selected'), B(-0.7, -0.4, 'active'), C(1.2, -0.6), B(3, -1.1),
    ]),
    kit.text(250, 240, 'orange: selected   filled: the active object', { anchor: 'middle', size: 12 }),
  );
};
