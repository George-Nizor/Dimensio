// Left, the cube with its top face selected. Right, after X > Faces: the top is gone, and you can
// see into the open box.
import { cube, view, drawMesh, facesWhere, keycap } from '../../../diagrams/mesh.mjs';
import { panel, drawOpen, deleteFaces } from './helpers.mjs';

export default (kit) => {
  const m = cube();
  const top = facesWhere(m, (c, n) => n[2] > 0.9);
  const left = view({ at: [126, 108], scale: 42, elevation: 34 });
  const right = view({ at: [414, 108], scale: 42, elevation: 34 });
  return kit.svg({ width: 540, height: 230 },
    panel(kit, 14, 14, 224, 180, 'top face selected'),
    drawMesh(kit, m, left, { width: 1.5, select: { faces: top } }),
    keycap(kit, 270, 104, 'X'),
    panel(kit, 302, 14, 224, 180, 'after X > Faces'),
    drawOpen(kit, deleteFaces(m, top), right, { width: 1.5 }),
  );
};
