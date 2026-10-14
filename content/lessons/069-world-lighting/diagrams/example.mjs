// The World around the scene: a dome of light over the props, with the HDRI's sun on it. Light
// reaches the props from every direction, strongest from the sun.
import { view, drawMesh, translate } from '../../../diagrams/mesh.mjs';
import { crate, barrel } from './parts.mjs';

export default (kit) => {
  const v = view({ azimuth: 28, elevation: 16, scale: 80, at: [250, 190], target: [0, 0, 0] });
  const out = [kit.path('M 50 190 A 200 150 0 0 1 450 190', { cls: 'd-guide', width: 1.6, dash: '6 5' })];
  for (let i = 1; i < 8; i += 1) {
    const a = Math.PI - (i / 8) * Math.PI;
    const x = 250 + Math.cos(a) * 200;
    const y = 190 - Math.sin(a) * 150;
    const tx = 250 + Math.cos(a) * 140;
    const ty = 190 - Math.sin(a) * 105;
    out.push(kit.line(x, y, tx, ty, { cls: 'd-guide', width: 1.2 }), kit.arrowhead(tx, ty, Math.atan2(ty - y, tx - x), { cls: 'd-guide', size: 7 }));
  }
  const sx = 250 + Math.cos(Math.PI * 0.7) * 200;
  const sy = 190 - Math.sin(Math.PI * 0.7) * 150;
  out.push(kit.dot(sx, sy, { r: 10, cls: 'd-mark-fill' }), kit.line(sx, sy, sx + 70, sy + 70, { cls: 'd-mark', width: 2.4 }), kit.arrowhead(sx + 70, sy + 70, Math.PI / 4, { size: 9 }));
  out.push(kit.line(40, 190, 460, 190, { cls: 'd-ink', width: 1.2 }));
  out.push(drawMesh(kit, translate(crate(), [-0.5, 0.15, 0]), v, { width: 1.3 }), drawMesh(kit, translate(barrel(), [0.5, -0.1, 0]), v, { width: 1.1 }));
  out.push(kit.text(sx - 14, sy - 16, 'the HDRI\'s sun', { size: 12, anchor: 'end' }));
  return kit.svg({ width: 500, height: 215 }, out);
};
