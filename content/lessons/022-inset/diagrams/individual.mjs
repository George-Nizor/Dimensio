// Two neighbouring faces seen from the front, inset 0.25 m. Left, as one patch: one border round
// the outside of both. Right, as individual faces after I twice: a border round each.
import { box, views, drawMesh, facesWhere, mesh } from '../../../diagrams/mesh.mjs';
import { panel, insetEven } from './helpers.mjs';

export default (kit) => {
  // The patch: the two faces' outline inset as one, with their shared edge carried through.
  const t = 0.25;
  const p = (x, z) => [x, -1, z];
  const verts = [p(-1, -1), p(0, -1), p(1, -1), p(1, 1), p(0, 1), p(-1, 1),
    p(-1 + t, -1 + t), p(0, -1 + t), p(1 - t, -1 + t), p(1 - t, 1 - t), p(0, 1 - t), p(-1 + t, 1 - t)];
  const faces = [[0, 1, 7, 6], [1, 2, 8, 7], [2, 3, 9, 8], [3, 4, 10, 9], [4, 5, 11, 10], [5, 0, 6, 11], [6, 7, 10, 11], [7, 8, 9, 10]];
  const patch = mesh(verts, faces);
  let one = box({ size: [2, 0.2, 2], segments: [2, 1, 1], center: [0, -0.9, 0] });
  const front = facesWhere(one, (c, n) => n[1] < -0.9);
  for (const f of front) one = insetEven(one, f, t).mesh;
  const left = views.front({ at: [126, 104], scale: 66 });
  const right = views.front({ at: [384, 104], scale: 66 });
  return kit.svg({ width: 510, height: 220 },
    panel(kit, 14, 14, 224, 180, 'one patch'),
    drawMesh(kit, patch, left, { width: 1.4, select: { faces: [6, 7] } }),
    panel(kit, 272, 14, 224, 180, 'individual, I twice'),
    drawMesh(kit, one, right, { width: 1.4, select: { faces: front } }),
  );
};
