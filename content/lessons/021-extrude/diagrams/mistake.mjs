// Wrong: E then a right click. The new faces stay behind, folded flat on the cube, and its four top
// corners each hold two vertices. Right: Ctrl+Z instead, which leaves the plain cube.
import { cube, view, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel } from './helpers.mjs';

export default (kit) => {
  const m = cube();
  const left = view({ at: [126, 112], scale: 44 });
  const right = view({ at: [384, 112], scale: 44 });
  const tops = m.verts.filter((p) => p[2] > 0.9).map((p) => left.project(p));
  return kit.svg({ width: 510, height: 250 },
    panel(kit, 14, 14, 224, 190, 'Vertices 12'),
    drawMesh(kit, m, left, { width: 1.5 }),
    tops.map(([x, y]) => [kit.circle(x, y, 7, { cls: 'd-bad', width: 1.6 }), kit.dot(x - 2, y, { r: 2.4 }), kit.dot(x + 2, y, { r: 2.4 })]),
    kit.tag(126, 238, 'right click', { tone: 'bad' }),
    panel(kit, 272, 14, 224, 190, 'Vertices 8'),
    drawMesh(kit, m, right, { width: 1.5 }),
    kit.tag(384, 238, 'Ctrl+Z'),
  );
};
