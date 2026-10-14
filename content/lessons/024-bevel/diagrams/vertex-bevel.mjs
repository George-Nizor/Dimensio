// The cube with its top front right vertex bevelled with Shift+Ctrl+B: a small triangle cuts off the
// corner, and the edges between the corners stay sharp.
import { view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { cornerBevel } from './shapes.mjs';

export default (kit) => {
  const { mesh, triangle } = cornerBevel(0.6);
  const v = view({ at: [180, 134], scale: 58 });
  return kit.svg({ width: 400, height: 260 },
    drawMesh(kit, mesh, v, { width: 1.6, select: { faces: [triangle] } }),
    keycap(kit, 336, 130, 'Shift+Ctrl+B', { size: 10 }),
  );
};
