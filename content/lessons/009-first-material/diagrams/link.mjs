// Three objects selected first and a red one selected last, so it is active. Ctrl+L, Link
// Materials, gives all of them its material.
import { cube, translate, view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { drawColoured } from './parts.mjs';
import { RED } from './shapes.mjs';

export default (kit) => {
  const v = view({ azimuth: 8, elevation: 20, at: [240, 128], scale: 44, target: [0, 0, 0.6] });
  const xs = [-3.6, -1.4, 0.8];
  const [ax, ay] = v.project([3.2, 0, 1.3]);
  return kit.svg({ width: 480, height: 240 },
    xs.map((x) => drawMesh(kit, translate(cube(1.2), [x, 0, 0.6]), v, { width: 1.8, cls: 'd-mark' })),
    drawColoured(kit, translate(cube(1.2), [3.2, 0, 0.6]), v, RED, { width: 2.6 }),
    xs.map((x) => { const [px, py] = v.project([x + 0.3, 0, 1.3]); return kit.arcArrow(ax - 6, ay - 8, px + 4, py - 8, { lift: -30, width: 1.6 }); }),
    kit.text(ax, ay + 96, 'active', { anchor: 'middle', size: 13, cls: 'd-tag' }),
    keycap(kit, 60, 214, 'Ctrl+L', { size: 11 }),
    kit.text(96, 219, 'Link Materials', { size: 12 }),
  );
};
