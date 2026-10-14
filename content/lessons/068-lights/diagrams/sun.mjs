// A Sun light: moved anywhere it lights the same, because only its rotation sets the direction.
// All shadows fall the same way.
import { view, drawMesh, translate } from '../../../diagrams/mesh.mjs';
import { crate } from './lights.mjs';

export default (kit) => {
  const v = view({ azimuth: 20, elevation: 30, scale: 70, at: [250, 150], target: [0, 0, 0.3] });
  const shadow = (x) => {
    const pts = [[x - 0.35, -0.35], [x + 0.35, -0.35], [x + 0.35 + 0.9, 0.35 + 0.5], [x - 0.35 + 0.9, 0.35 + 0.5]].map(([a, b]) => v.project([a, b, 0]));
    return `<path d="M ${pts.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(' L ')} Z" class="d-face-3" stroke-width="0"/>`;
  };
  const rays = [];
  for (const [x, y] of [[90, 20], [180, 20], [300, 20], [400, 20]]) {
    rays.push(kit.line(x, y, x + 34, y + 44, { cls: 'd-mark', width: 1.6 }), kit.arrowhead(x + 34, y + 44, Math.atan2(44, 34), { size: 7 }));
  }
  return kit.svg({ width: 500, height: 240 },
    rays,
    shadow(-1.3), shadow(1.3),
    drawMesh(kit, translate(crate(), [-1.3, 0, 0]), v, { width: 1.3 }),
    drawMesh(kit, translate(crate(), [1.3, 0, 0]), v, { width: 1.3 }),
    kit.text(250, 228, 'one direction, parallel shadows', { size: 12, anchor: 'middle' }),
  );
};
