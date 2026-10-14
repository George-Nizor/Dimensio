// Both views look at the back of the wall. Wrong: the doorway was cut without C, so the back is
// whole. Right: cut with C, the outline goes through to the back too.
import { view } from '../../../diagrams/mesh.mjs';
import { wall, back, cut, DOOR } from './wall.mjs';
import { paint, panel } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 200, elevation: 14, at: [124, 106], scale: 52, target: [0, 0, 1.25] });
  const right = view({ azimuth: 200, elevation: 14, at: [376, 106], scale: 52, target: [0, 0, 1.25] });
  return kit.svg({ width: 500, height: 240 },
    panel(kit, 14, 14, 220, 180),
    paint(kit, wall(), left, { width: 1.5 }),
    kit.tag(124, 222, 'without C: back whole', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 180),
    paint(kit, wall(), right, { width: 1.5 }),
    cut(kit, right, DOOR, { side: back, width: 1.8 }),
    kit.tag(376, 222, 'with C: cut through'),
  );
};
