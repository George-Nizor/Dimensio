// The half board from the front with Clipping on. The vertices on the middle line can slide up and
// down it but cannot cross it.
import { views, drawMesh, vertsWhere } from '../../../diagrams/mesh.mjs';
import { halfBoard, mirrored } from './shapes.mjs';

export default (kit) => {
  const half = halfBoard();
  const v = views.front({ at: [190, 120], scale: 150 });
  const middle = vertsWhere(half, (p) => Math.abs(p[0]) < 1e-6 && p[1] < 0);
  const [x, y] = v.project([0, -0.05, -0.2]);
  return kit.svg({ width: 400, height: 254 },
    drawMesh(kit, mirrored(half), v, { mode: 'wire', width: 1.3, cls: 'd-guide' }),
    drawMesh(kit, half, v, { width: 1.8, select: { verts: middle } }),
    kit.line(190, 18, 190, 222, { cls: 'd-mark', width: 1.4, dash: '6 5' }),
    kit.line(x, y, x - 46, y, { cls: 'd-bad', width: 2 }), kit.arrowhead(x - 46, y, Math.PI, { cls: 'd-bad' }),
    kit.line(x - 4, y - 14, x - 4, y + 14, { cls: 'd-bad', width: 3 }),
    kit.line(x + 10, y, x + 10, y - 60, { cls: 'd-mark', width: 2 }), kit.arrowhead(x + 10, y - 60, -Math.PI / 2),
    kit.text(200, 240, 'with Clipping, middle vertices stay on the line', { anchor: 'middle', size: 12 }),
  );
};
