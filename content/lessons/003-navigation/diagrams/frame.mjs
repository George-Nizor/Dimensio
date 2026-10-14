// Left, a small object far off in the corner of the view. Right, Numpad . after selecting it: the
// object fills the view.
import { cube, view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { panel } from './shapes.mjs';

export default (kit) => {
  const far = view({ at: [196, 44], scale: 6 });
  const near = view({ at: [396, 98], scale: 34 });
  return kit.svg({ width: 500, height: 210 },
    panel(kit, 14, 14, 200, 170, 'lost in the corner'),
    drawMesh(kit, cube(), far, { width: 1.2, select: { faces: [0, 1, 2, 3, 4, 5] } }),
    keycap(kit, 250, 100, 'Numpad .', { size: 11 }),
    panel(kit, 286, 14, 200, 170, 'framed'),
    drawMesh(kit, cube(), near, { width: 1.8, select: { faces: [0, 1, 2, 3, 4, 5] } }),
  );
};
