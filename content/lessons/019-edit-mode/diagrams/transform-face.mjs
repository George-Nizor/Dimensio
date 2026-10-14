// Two cubes with their top face selected. Left, the top face scaled to half its size with S and 0.5.
// Right, the top face moved 1 m along X with G X 1.
import { cube, view, drawMesh, facesWhere } from '../../../diagrams/mesh.mjs';
import { panel, scaleVerts, moveVerts, vertsOfFaces } from './helpers.mjs';

export default (kit) => {
  const m = cube();
  const top = facesWhere(m, (c, n) => n[2] > 0.9);
  const ids = vertsOfFaces(m, top);
  const tapered = scaleVerts(m, ids, 0.5);
  const leaning = moveVerts(m, ids, [1, 0, 0]);
  const left = view({ at: [126, 110], scale: 40 });
  const right = view({ at: [380, 110], scale: 40, target: [0.5, 0, 0] });
  return kit.svg({ width: 520, height: 220 },
    panel(kit, 14, 14, 224, 170, 'S 0.5'),
    drawMesh(kit, tapered, left, { width: 1.6, select: { faces: top } }),
    panel(kit, 270, 14, 236, 170, 'G X 1'),
    drawMesh(kit, leaning, right, { width: 1.6, select: { faces: top } }),
  );
};
