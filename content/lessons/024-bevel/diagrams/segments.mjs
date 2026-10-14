// One bevelled edge seen end on, as a corner of the box's outline. Left, one segment: a single flat
// cut. Right, three segments: the corner rounded off in three cuts.
import { mouse } from '../../../diagrams/mesh.mjs';
import { panel } from './helpers.mjs';

// The outline of a corner (the box's top right in side view), bevelled `w` with `n` segments on a
// round profile, in pixels from (x, y) with `s` pixels per metre.
function corner(kit, x, y, s, w, n) {
  const pts = [[x - 1.2 * s, y + 1.2 * s], [x - 1.2 * s, y]];
  for (let i = 0; i <= n; i += 1) {
    const a = (Math.PI / 2) * (i / n);
    pts.push([x - w * s + Math.sin(a) * w * s, y + w * s - Math.cos(a) * w * s]);
  }
  pts.push([x, y + 1.2 * s]);
  return [
    `<path d="M ${pts.map(([px, py]) => `${px.toFixed(1)} ${py.toFixed(1)}`).join(' L ')} Z" class="d-face-1"/>`,
    kit.polyline(pts.slice(1), { cls: 'd-ink', width: 1.8 }),
    pts.slice(2, -1).map(([px, py]) => kit.dot(px, py, { r: 2.6 })),
  ];
}

export default (kit) => kit.svg({ width: 510, height: 240 },
  panel(kit, 14, 14, 200, 180, '1 segment'),
  corner(kit, 170, 50, 100, 0.6, 1),
  mouse(kit, 256, 104, { button: 'wheel', size: 0.6 }),
  panel(kit, 296, 14, 200, 180, '3 segments'),
  corner(kit, 452, 50, 100, 0.6, 3),
);
