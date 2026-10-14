// The car with the wheels and the cabin selected first and the body selected last. The body is the
// active object, so it becomes the parent.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { badge } from './helpers.mjs';
import { car } from './shapes.mjs';

export default (kit) => {
  const { mesh: m, ranges } = car();
  const v = view({ azimuth: 38, elevation: 26, at: [210, 140], scale: 56, target: [0, 0, 0.6] });
  const all = Object.values(ranges).flat();
  const at = (p) => v.project(p);
  const marks = [['Wheel FR', [0.95, -1.15, 0.35]], ['Wheel BR', [0.95, 1.15, 0.35]], ['Wheel FL', [-0.95, -1.15, 0.35]], ['Wheel BL', [-0.95, 1.15, 0.35]], ['Cabin', [0, 0.25, 1.55]]];
  const body = at([0.8, -0.6, 0.75]);
  return kit.svg({ width: 440, height: 270 },
    drawMesh(kit, m, v, { width: 1.3, select: { faces: all } }),
    marks.map(([, p], i) => { const [x, y] = at(p); return badge(kit, x + (i === 2 || i === 3 ? -16 : 14), y - 14, i + 1); }),
    badge(kit, body[0] + 20, body[1] + 6, 6, { mark: true }),
    kit.line(body[0] + 30, body[1] + 6, 330, 236, { cls: 'd-guide', width: 1.2 }),
    kit.text(334, 240, 'Body, clicked last: active', { size: 12 }),
  );
};
