// A lasso drawn round the dots at the middle of three barrels, which are selected. A crate whose
// edge is inside the lasso but whose dot is outside stays unselected.
import { yardView, drawYard, B, C } from './yard.mjs';

// A closed smooth loop through points, starting halfway between the last point and the first so
// it has no seam.
const loop = (kit, p, options) => {
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const start = mid(p[p.length - 1], p[0]);
  let d = `M ${start[0].toFixed(1)} ${start[1].toFixed(1)}`;
  p.forEach((q, i) => { const m = mid(q, p[(i + 1) % p.length]); d += ` Q ${q[0].toFixed(1)} ${q[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`; });
  return kit.path(d, options);
};

export default (kit) => {
  const v = yardView({ at: [220, 120], scale: 46 });
  const items = [B(-2.4, 0.5, 'selected', true), B(-0.4, 1.3, 'selected', true), B(0, -0.8, 'active', true), C(2.3, 0.2)];
  const [cx, cy] = v.project([2.3, 0.2, 0.42]);
  // The lasso, in page coordinates: round the three barrels and over the crate's near corner.
  const lasso = [[70, 92], [130, 52], [222, 40], [300, 62], [cx - 4, cy - 36], [cx - 10, cy + 2], [cx - 18, cy + 34], [250, 190], [168, 200], [96, 166], [62, 124]];
  return kit.svg({ width: 480, height: 250 },
    drawYard(kit, v, items),
    kit.circle(cx, cy, 4, { cls: 'd-ink', width: 1.6 }),
    loop(kit, lasso, { cls: 'd-mark', width: 2, dash: '7 5' }),
    kit.line(cx + 6, cy + 6, cx + 40, cy + 64, { cls: 'd-guide', width: 1.2 }),
    kit.text(cx + 44, cy + 78, 'dot outside', { size: 12 }),
    kit.text(cx + 44, cy + 94, 'not selected', { size: 12 }),
  );
};
