// A chest sketched with Grease Pencil: its front drawn on the Front (X-Z) plane and its side on the
// Side (Y-Z) plane, crossing at the origin, seen from above and to one side.
import { view, axes } from '../../../diagrams/mesh.mjs';
import { handStroke, fillShape, chest } from './gp-kit.mjs';

export default (kit) => {
  const v = view({ azimuth: 32, elevation: 18, scale: 210, at: [240, 230] });
  const { front, side } = chest;
  const plane = (pts) => {
    const p = pts.map((q) => v.project(q));
    return kit.polyline([...p, p[0]], { cls: 'd-guide', width: 1, dash: '4 5' });
  };
  return kit.svg({ width: 480, height: 280 },
    plane([[-0.7, 0, 0], [0.7, 0, 0], [0.7, 0, 0.85], [-0.7, 0, 0.85]]),
    plane([[0, -0.5, 0], [0, 0.5, 0], [0, 0.5, 0.85], [0, -0.5, 0.85]]),
    axes(kit, v, { length: 0.8, width: 1.4 }),
    handStroke(kit, v, side.body, { closed: true, seed: 11 }),
    handStroke(kit, v, side.lid, { seed: 12 }),
    handStroke(kit, v, side.band, { seed: 13, width: 1.6 }),
    handStroke(kit, v, front.body, { closed: true, seed: 4 }),
    handStroke(kit, v, front.lid, { seed: 5 }),
    handStroke(kit, v, front.band, { seed: 6, width: 1.6 }),
    fillShape(v, front.lock, { cls: 'd-face-sel' }),
    handStroke(kit, v, front.lock, { closed: true, seed: 7, width: 1.8 }),
    kit.text(30, 262, 'front, on the X-Z plane', { size: 12 }),
    kit.text(300, 40, 'side, on the Y-Z plane', { size: 12 }),
  );
};
