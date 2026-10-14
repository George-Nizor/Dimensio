// The cube's top face after I: a ring of four new faces round a smaller face, which stays selected.
import { cube, view, drawMesh, facesWhere, keycap } from '../../../diagrams/mesh.mjs';
import { insetEven } from './helpers.mjs';

export default (kit) => {
  const start = cube();
  const [top] = facesWhere(start, (c, n) => n[2] > 0.9);
  const { mesh } = insetEven(start, top, 0.35);
  const v = view({ at: [180, 140], scale: 58 });
  return kit.svg({ width: 400, height: 270 },
    drawMesh(kit, mesh, v, { width: 1.5, select: { faces: [top] } }),
    keycap(kit, 350, 130, 'I'),
  );
};
