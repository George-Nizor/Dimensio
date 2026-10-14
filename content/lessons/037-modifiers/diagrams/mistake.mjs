// Wrong: applying Subdivision Surface while Bevel sits above it. Blender applies it as if it were
// first, so the mesh becomes a ball and the bevel has nothing left to do. Right: applying Bevel,
// the top of the stack, keeps the rounded box the viewport showed.
import { cube, bevelledBox, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { subdivide, modPanel, panel } from './modkit.mjs';

export default (kit) => {
  const side = (x, applied, m, tag, tone) => [
    panel(kit, x, 14, 254, 224),
    modPanel(kit, x + 12, 24, { w: 230, name: 'Bevel', mark: applied === 0 ? 'menu' : undefined, s: 0.9 }).svg,
    modPanel(kit, x + 12, 52, { w: 230, name: 'Subdivision', mark: applied === 1 ? 'menu' : undefined, s: 0.9 }).svg,
    kit.text(x + 127, 100, applied === 0 ? 'Apply on the top panel' : 'Apply on the second panel', { anchor: 'middle', size: 12 }),
    drawMesh(kit, m, view({ at: [x + 127, 174], scale: 26 }), { width: 0.5 }),
    kit.tag(x + 127, 260, tag, { tone }),
  ];
  return kit.svg({ width: 540, height: 272 },
    side(10, 1, subdivide(cube(), 2), 'applied out of order', 'bad'),
    side(276, 0, subdivide(bevelledBox({ size: [2, 2, 2], width: 0.1 }), 2), 'applied from the top'),
  );
};
