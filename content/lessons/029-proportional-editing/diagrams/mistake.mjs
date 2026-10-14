// One top corner of a cube moved 0.6 m sideways. Wrong: proportional editing left on, with a 3 m
// circle, so the other corners move too and the whole cube leans. Right: off, so only that corner
// moves.
import { view, cube, transform } from '../../../diagrams/mesh.mjs';
import { FALLOFF } from './ground.mjs';
import { paint, panel } from './paint.mjs';

const corner = [1, -1, 1];
const move = (m, radius) => transform(m, ([x, y, z]) => {
  const d = Math.hypot(x - corner[0], y - corner[1], z - corner[2]);
  const w = d < 1e-6 ? 1 : radius && d < radius ? FALLOFF.smooth(1 - d / radius) : 0;
  return [x + 0.6 * w, y, z];
});

export default (kit) => {
  const left = view({ azimuth: 30, elevation: 22, at: [124, 106], scale: 44, target: [0, 0, 0] });
  const right = view({ azimuth: 30, elevation: 22, at: [376, 106], scale: 44, target: [0, 0, 0] });
  const pick = (m) => [m.verts.findIndex((p) => Math.abs(p[1] + 1) < 1e-6 && Math.abs(p[2] - 1) < 1e-6 && p[0] > 1)];
  const wrong = move(cube(2), 3);
  const good = move(cube(2), 0);
  return kit.svg({ width: 500, height: 240 },
    panel(kit, 14, 14, 220, 180),
    paint(kit, wrong, left, { width: 1.6, select: { verts: pick(wrong) } }),
    kit.tag(124, 222, 'left on: the cube leans', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 180),
    paint(kit, good, right, { width: 1.6, select: { verts: pick(good) } }),
    kit.tag(376, 222, 'off: one corner moves'),
  );
};
