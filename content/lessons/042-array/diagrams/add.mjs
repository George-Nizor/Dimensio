// One plank, then the plank with a new Array modifier: Count 3, each copy touching the last along X.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel, pageArrow, modPanel } from '../../037-modifiers/diagrams/modkit.mjs';
import { plank, line } from './shapes.mjs';

export default (kit) => {
  const p = modPanel(kit, 286, 18, { w: 200, name: 'Array', rows: [['Shape', 'Line'], ['Count', '3']], s: 0.9 });
  return kit.svg({ width: 500, height: 240 },
    panel(kit, 14, 14, 200, 200, 'one plank'),
    drawMesh(kit, plank(), view({ at: [114, 180], scale: 130 }), { width: 1.4 }),
    pageArrow(kit, 226, 120, 274, 120),
    p.svg,
    drawMesh(kit, line(plank(), 3, 1), view({ at: [356, 220], scale: 120 }), { width: 1.4 }),
  );
};
