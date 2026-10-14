// U > Smart UV Project lays the low-poly stone's faces out flat as islands inside the square that
// the baked image will fill.
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const next = kit.random(11);
  const islands = [[30, 30, 70, 60], [112, 26, 64, 74], [186, 34, 58, 56], [34, 104, 80, 66], [124, 112, 56, 58], [190, 100, 54, 74]].map(([x, y, w, h]) => {
    const pts = [];
    for (let i = 0; i < 9; i += 1) {
      const a = (i / 9) * Math.PI * 2;
      const r = 0.8 + next() * 0.2;
      pts.push([170 + x + w / 2 + Math.cos(a) * (w / 2) * r, 10 + y + h / 2 + Math.sin(a) * (h / 2) * r]);
    }
    return [`<path d="M ${pts.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(' L ')} Z" class="d-face-sel"/>`, kit.polyline([...pts, pts[0]], { cls: 'd-ink', width: 1.4 })];
  });
  return kit.svg({ width: 460, height: 220 },
    keycap(kit, 40, 40, 'U'),
    kit.text(70, 45, 'Smart UV Project', { size: 12 }),
    `<rect x="190" y="20" width="250" height="180" class="d-paper" stroke-width="1.4"/>`,
    islands,
    kit.text(315, 214, 'the UV map: every face laid flat', { anchor: 'middle', size: 12, cls: 'd-label' }),
  );
};
