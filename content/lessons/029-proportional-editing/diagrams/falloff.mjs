// One row of grid vertices seen from the side after the same 1 m move with four falloffs. The
// moved vertex is in the middle; the circle reaches 2 m either side.
import { panel } from './paint.mjs';
import { FALLOFF } from './ground.mjs';

export default (kit) => {
  const names = [['Smooth', 'smooth'], ['Sphere', 'sphere'], ['Sharp', 'sharp'], ['Constant', 'constant']];
  return kit.svg({ width: 540, height: 170 }, names.map(([label, key], i) => {
    const x0 = 14 + i * 132;
    const ground = 112;
    const pts = [];
    for (let k = -12; k <= 12; k += 1) {
      const d = Math.abs(k / 4);
      const z = d < 2 ? FALLOFF[key](1 - d / 2) : 0;
      pts.push([x0 + 60 + k * 4.4, ground - z * 62]);
    }
    return [
      panel(kit, x0, 20, 120, 112, label),
      kit.line(x0 + 8, ground, x0 + 112, ground, { cls: 'd-guide', width: 1, dash: '4 4' }),
      kit.polyline(pts, { cls: 'd-ink', width: 1.8 }),
      pts.map(([x, y]) => kit.dot(x, y, { r: 1.8, cls: 'd-dot' })),
    ];
  }));
};
