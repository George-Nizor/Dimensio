// Left, a click on a barrel selects it. Right, a click on empty space selects nothing.
import { cursor } from '../../../diagrams/mesh.mjs';
import { panel } from './parts.mjs';
import { yardView, drawYard, B, C } from './yard.mjs';

export default (kit) => {
  const left = yardView({ at: [124, 108], scale: 30 });
  const right = yardView({ at: [376, 108], scale: 30 });
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 220, 176, 'click a barrel'),
    drawYard(kit, left, [C(-1.5, 0.8), B(0.2, 0, 'active'), C(1.6, -0.6)]),
    cursor(kit, ...left.project([0.2, 0, 0.6])),
    panel(kit, 266, 14, 220, 176, 'click empty space'),
    drawYard(kit, right, [C(-1.5, 0.8), B(0.2, 0), C(1.6, -0.6)]),
    cursor(kit, 300, 150),
  );
};
