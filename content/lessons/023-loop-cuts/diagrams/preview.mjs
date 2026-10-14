// Ctrl+R with the pointer on a vertical edge of the cube: a dashed preview line runs across that
// edge and round the cube's sides.
import { cube, view, drawMesh, cursor, keycap } from '../../../diagrams/mesh.mjs';
import { previewLoop } from './shapes.mjs';

export default (kit) => {
  const v = view({ at: [180, 136], scale: 62 });
  const [x, y] = v.project([1, -1, 0.35]);
  return kit.svg({ width: 400, height: 270 },
    drawMesh(kit, cube(), v, { width: 1.6 }),
    previewLoop(kit, v, 0),
    cursor(kit, x, y),
    keycap(kit, 350, 130, 'Ctrl+R', { size: 12 }),
  );
};
