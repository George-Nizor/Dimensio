// Motion paths for the left foot over the whole walk, one dot a frame: it slides back along the
// ground from frame 1 to 13, then lifts and swings forward to land on frame 25. A smooth loop
// with no kinks is what to look for.
import { walker, ground } from './helpers.mjs';
import { POSES, flip, place } from './walk.mjs';
import { menuPath } from './helpers.mjs';

export default (kit) => {
  const x = 200;
  const y = 196;
  const s = 2;
  // The near foot's ankle on each key, from walk.mjs: forward, sliding back, then swinging.
  const keys = [[1, [32, 4]], [4, [16, 4]], [7, [0, 4]], [10, [-16, 6]], [13, [-32, 9]], [16, [-30, 16]], [19, [4, 22]], [22, [26, 14]], [25, [32, 4]]];
  const pts = [];
  for (let i = 0; i < keys.length - 1; i += 1) {
    const [, a] = keys[i];
    const [, b] = keys[i + 1];
    const [, before] = keys[(i - 1 + 8) % 8];
    const [, after] = keys[(i + 2) % 8];
    for (let k = 0; k < 3; k += 1) {
      const t = k / 3;
      // Catmull-Rom through the keys, for a smooth path like Blender's.
      const c = (p0, p1, p2, p3) => 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
      pts.push([x + c(before[0], a[0], b[0], after[0]) * s, y - c(before[1], a[1], b[1], after[1]) * s]);
    }
  }
  const pose = place(POSES.passing, x, y, s * 0.55);
  return kit.svg({ width: 480, height: 222 },
    ground(kit, 60, 340, y + 6),
    `<g opacity="0.35">`, walker(kit, pose, { s: 1.1 }), `</g>`,
    kit.polyline([...pts, pts[0]], { cls: 'd-mark', width: 1.8 }),
    pts.map(([px, py]) => kit.dot(px, py, { r: 2.6, cls: 'd-mark-fill' })),
    kit.text(x + 70, y - 2, '1', { size: 11 }),
    kit.text(x - 84, y - 24, '13', { size: 11 }),
    menuPath(kit, 196, 20, ['Pose', 'Motion Paths', 'Calculate']).svg,
  );
};
