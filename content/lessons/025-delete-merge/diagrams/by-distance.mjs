// Left, a box whose left end is a separate face: each of its four corners is two vertices in the
// same place. Right, after Merge by Distance: the end is welded to the box, one vertex per corner.
import { box, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel } from './helpers.mjs';

export default (kit) => {
  const m = box({ size: [2, 1, 1], center: [0, 0, 0.5] });
  const corners = [[-1, -0.5, 0], [-1, 0.5, 0], [-1, -0.5, 1], [-1, 0.5, 1]];
  const left = view({ at: [126, 112], scale: 56, azimuth: 300, target: [0, 0, 0.5] });
  const right = view({ at: [384, 112], scale: 56, azimuth: 300, target: [0, 0, 0.5] });
  return kit.svg({ width: 510, height: 240 },
    panel(kit, 14, 14, 224, 190, '4 doubled vertices'),
    drawMesh(kit, m, left, { width: 1.4 }),
    corners.map((p) => { const [x, y] = left.project(p); return [kit.circle(x, y, 7, { cls: 'd-bad', width: 1.6 }), kit.dot(x - 2.2, y, { r: 2.3 }), kit.dot(x + 2.2, y, { r: 2.3 })]; }),
    panel(kit, 272, 14, 224, 190, 'welded'),
    drawMesh(kit, m, right, { width: 1.4 }),
    corners.map((p) => { const [x, y] = right.project(p); return kit.dot(x, y, { r: 2.6 }); }),
  );
};
