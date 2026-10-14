// The same bevelled corner seen end on, with 1, 2 and 3 segments: a flat chamfer, then rounder
// and rounder. Each dot is a new edge along the bevel.
import { panel } from '../../037-modifiers/diagrams/modkit.mjs';

export default (kit) => {
  const corner = (px, n) => {
    const s = 80;
    const w = 0.55;
    const ox = px + 30;
    const oy = 150;
    const P = (x, y) => [ox + x * s, oy - y * s];
    const pts = [P(0, -0.1)];
    for (let k = 0; k <= n; k += 1) {
      const t = (Math.PI / 2) * (k / n);
      pts.push(P(w - w * Math.cos(t), 1 - w + w * Math.sin(t)));
    }
    pts.push(P(1.3, 1));
    return [
      kit.polyline([P(0, 1 - w), P(0, 1), P(w, 1)], { cls: 'd-guide', width: 1.2, dash: '4 4' }),
      kit.polyline(pts, { cls: 'd-ink', width: 2.2 }),
      pts.slice(1, -1).map(([x, y]) => kit.dot(x, y, { r: 3.4, cls: 'd-mark-fill' })),
    ];
  };
  return kit.svg({ width: 490, height: 200 },
    [1, 2, 3].map((n, i) => {
      const px = 14 + i * 158;
      return [panel(kit, px, 14, 146, 156, `Segments ${n}`), corner(px, n)];
    }),
  );
};
