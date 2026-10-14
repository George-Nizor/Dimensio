// After the click, the new loop follows the mouse. Here it has slid up towards the top; a click
// leaves it there, a right click puts it back in the middle.
import { view, drawMesh, arrow } from '../../../diagrams/mesh.mjs';
import { cutBox } from './helpers.mjs';
import { loopsAt } from './shapes.mjs';

export default (kit) => {
  const m = cutBox({ cuts: { z: [0.55] } });
  const v = view({ at: [170, 136], scale: 62 });
  return kit.svg({ width: 400, height: 270 },
    drawMesh(kit, m, v, { width: 1.6, select: { edges: loopsAt(m, [0.55]) } }),
    arrow(kit, v, [1.12, -1.12, 0.35], [1.12, -1.12, 0.9]),
    arrow(kit, v, [1.12, -1.12, 0.2], [1.12, -1.12, -0.35]),
    kit.text(330, 120, 'click: keep it', { anchor: 'middle', size: 12 }),
    kit.text(330, 140, 'right click: middle', { anchor: 'middle', size: 12 }),
  );
};
