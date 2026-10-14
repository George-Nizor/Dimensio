// The cube in X-Ray after Alt+Z: the hidden back edges show dashed, and a vertex at the back is
// selected through the front of the mesh.
import { cube, view, drawMesh, keycap, vertsWhere } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const m = cube();
  const v = view({ at: [170, 120], scale: 58 });
  const back = vertsWhere(m, (p) => p[0] < -0.9 && p[1] > 0.9 && p[2] < -0.9);
  const dots = m.verts.map((p) => v.project(p));
  return kit.svg({ width: 420, height: 250 },
    drawMesh(kit, m, v, { mode: 'xray', width: 1.6, select: { verts: back } }),
    dots.map(([x, y], i) => (back.includes(i) ? '' : kit.dot(x, y, { r: 2.6 }))),
    keycap(kit, 360, 110, 'Alt+Z'),
    kit.text(360, 146, 'X-Ray', { anchor: 'middle', size: 12 }),
  );
};
