// Two cuts at once: scrolling the mouse wheel before the click sets the number, and Blender spaces
// the loops evenly, splitting each side into three bands.
import { view, drawMesh, mouse } from '../../../diagrams/mesh.mjs';
import { cutBox } from './helpers.mjs';
import { loopsAt } from './shapes.mjs';

export default (kit) => {
  const m = cutBox({ cuts: { z: [-1 / 3, 1 / 3] } });
  const v = view({ at: [180, 136], scale: 62 });
  return kit.svg({ width: 400, height: 270 },
    drawMesh(kit, m, v, { width: 1.6, select: { edges: loopsAt(m, [-1 / 3, 1 / 3]) } }),
    mouse(kit, 348, 120, { button: 'wheel', size: 0.7, label: '2 cuts' }),
  );
};
