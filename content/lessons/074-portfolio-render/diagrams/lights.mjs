// Seen from above: the arranged props, the camera in front, and three area lights round them, a key
// to the front left, a fill to the front right and a rim behind.
import { drawMesh, views } from '../../../diagrams/mesh.mjs';
import { assets } from './assets.mjs';

const area = (kit, x, y, toward, label) => {
  const a = Math.atan2(toward[1] - y, toward[0] - x);
  const ex = x + Math.cos(a) * 34;
  const ey = y + Math.sin(a) * 34;
  return [
    kit.group({ rotate: [(a * 180) / Math.PI + 90, x, y] }, `<rect x="${x - 14}" y="${y - 5}" width="28" height="10" rx="2" class="d-mark-fill"/>`),
    kit.line(x, y, ex, ey, { cls: 'd-mark', width: 1.6, dash: '4 3' }), kit.arrowhead(ex, ey, a, { size: 7, width: 1.6 }),
    kit.text(x + (x > 240 ? 26 : -26), y + (y > 120 ? 30 : -14), label, { anchor: 'middle', size: 12 }),
  ];
};

export default (kit) => {
  const v = views.top({ at: [240, 112], scale: 52 });
  const centre = [240, 112];
  return kit.svg({ width: 480, height: 250 },
    assets().map((m) => drawMesh(kit, m, v, { width: 1.1 })),
    area(kit, 96, 196, centre, 'key'),
    area(kit, 396, 186, centre, 'fill'),
    area(kit, 330, 28, centre, 'rim'),
    `<rect x="${226}" y="${206}" width="28" height="18" rx="3" class="d-key" stroke-width="1.4"/>`,
    kit.path('M 240 206 L 232 196 L 248 196 Z', { cls: 'd-ink', width: 1.2 }),
    kit.text(240, 242, 'camera', { anchor: 'middle', size: 12 }),
  );
};
