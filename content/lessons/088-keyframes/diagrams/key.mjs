// With the mouse over the 3D Viewport, I keys location, rotation and scale at once. A diamond
// appears in the Timeline on the current frame.
import { keycap, view, drawMesh, cursor } from '../../../diagrams/mesh.mjs';
import { coin } from './coin.mjs';
import { strip, panel } from './anim.mjs';

export default (kit) => {
  const v = view({ azimuth: 10, elevation: 12, at: [110, 100], scale: 90 });
  const t = strip(kit, { x: 250, y: 60, w: 250, h: 44, start: 0, end: 50, every: 10, keys: [1], sel: [1], frame: 1 });
  return kit.svg({ width: 520, height: 180 },
    panel(kit, 14, 14, 190, 140, '3D Viewport'),
    drawMesh(kit, coin(0, 0), v, { width: 1.3 }),
    cursor(kit, 150, 60),
    keycap(kit, 226, 84, 'I'),
    t.svg,
    kit.text(375, 132, 'Location, Rotation and Scale keyed', { anchor: 'middle', size: 12 }),
  );
};
