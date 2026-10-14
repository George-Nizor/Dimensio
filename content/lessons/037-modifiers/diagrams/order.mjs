// The same two modifiers in each order. Bevel first, then Subdivision Surface: a rounded box.
// Subdivision Surface first: a ball, because no edge is left sharp enough for the bevel.
import { cube, bevelledBox, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { subdivide, modPanel, panel } from './modkit.mjs';

export default (kit) => {
  const side = (x, first, second, m, label) => [
    panel(kit, x, 14, 254, 224, label),
    modPanel(kit, x + 12, 24, { w: 230, name: first, s: 0.9 }).svg,
    modPanel(kit, x + 12, 52, { w: 230, name: second, s: 0.9 }).svg,
    drawMesh(kit, m, view({ at: [x + 127, 164], scale: 30 }), { width: 0.5 }),
  ];
  return kit.svg({ width: 540, height: 262 },
    side(10, 'Bevel', 'Subdivision', subdivide(bevelledBox({ size: [2, 2, 2], width: 0.1 }), 2), 'Bevel first: a rounded box'),
    side(276, 'Subdivision', 'Bevel', subdivide(cube(), 2), 'Subdivision first: a ball'),
  );
};
