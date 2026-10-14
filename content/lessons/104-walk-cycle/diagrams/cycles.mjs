// The Graph Editor: the hips' height over frames 1 to 25, low at 4 and 16, high at 10 and 22.
// A Cycles modifier repeats the curve before and after (dashed), so the walk never ends.
import { menuPath } from './helpers.mjs';

export default (kit) => {
  const x0 = 150;
  const w = 220;
  const fx = (f) => x0 + ((f - 1) / 24) * w;
  const keys = [[1, 0.46], [4, 0], [7, 0.77], [10, 1], [13, 0.46], [16, 0], [19, 0.77], [22, 1], [25, 0.46]];
  const fy = (v) => 140 - v * 70;
  const curve = (shift) => {
    const pts = [];
    for (let i = 0; i < keys.length - 1; i += 1) {
      const [f1, v1] = keys[i];
      const [f2, v2] = keys[i + 1];
      for (let k = 0; k < 8; k += 1) {
        const t = k / 8;
        const e = (1 - Math.cos(t * Math.PI)) / 2;
        pts.push([fx(f1 + (f2 - f1) * t) + shift, fy(v1 + (v2 - v1) * e)]);
      }
    }
    pts.push([fx(25) + shift, fy(0.46)]);
    return pts;
  };
  const m = menuPath(kit, 34, 186, ['Channel', 'Add F-Curve Modifier', 'Cycles']);
  return kit.svg({ width: 520, height: 222 },
    `<rect x="10" y="10" width="500" height="160" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.line(fx(1), 30, fx(1), 160, { cls: 'd-guide', width: 1 }), kit.line(fx(25), 30, fx(25), 160, { cls: 'd-guide', width: 1 }),
    kit.text(fx(1), 26, '1', { anchor: 'middle', size: 11 }), kit.text(fx(25), 26, '25', { anchor: 'middle', size: 11 }),
    kit.polyline(curve(-w).filter(([x]) => x > 14), { cls: 'd-guide', width: 2, dash: '5 4' }),
    kit.polyline(curve(w).filter(([x]) => x < 506), { cls: 'd-guide', width: 2, dash: '5 4' }),
    kit.polyline(curve(0), { cls: 'd-mark', width: 2.4 }),
    keys.map(([f, v]) => kit.dot(fx(f), fy(v), { r: 3.4 })),
    kit.text(30, 52, 'hips up and down', { size: 11 }),
    m.svg,
  );
};
