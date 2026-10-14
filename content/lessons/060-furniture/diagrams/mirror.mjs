// The table seen from the top. One leg is modelled under the +X +Y corner (picked out); the
// Mirror modifier, on X and Y with Bisect on, makes the other three (dashed) across the red and
// green lines through the origin.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { tableTop, tableLeg } from './parts.mjs';

export default (kit) => {
  const v = views.top({ scale: 230, at: [200, 122], target: [0, 0, 0] });
  const p = (x, y) => v.project([x, y, 0]);
  const square = (sx, sy) => {
    const pts = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => p(sx * 0.62 + a * 0.035, sy * 0.32 + b * 0.035));
    return pts;
  };
  const out = [drawMesh(kit, tableTop(), v, { mode: 'wire', width: 1.4 })];
  for (const [sx, sy] of [[-1, 1], [1, -1], [-1, -1]]) {
    const pts = square(sx, sy);
    out.push(kit.polyline([...pts, pts[0]], { cls: 'd-guide', width: 1.4, dash: '4 4' }));
  }
  const leg = square(1, 1);
  out.push(`<path d="M ${leg.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z" class="d-face-sel" stroke-width="0"/>`);
  out.push(kit.polyline([...leg, leg[0]], { cls: 'd-mark', width: 2 }));
  const [x0, y0] = p(0, 0);
  out.push(kit.line(x0 - 190, y0, x0 + 190, y0, { cls: 'd-axis-x', width: 1.4, dash: '6 4' }));
  out.push(kit.line(x0, y0 - 108, x0, y0 + 108, { cls: 'd-axis-y', width: 1.4, dash: '6 4' }));
  out.push(kit.text(x0 + 182, y0 - 6, 'X', { cls: 'd-label d-axis-x-text', size: 13 }));
  out.push(kit.text(x0 + 8, y0 - 98, 'Y', { cls: 'd-label d-axis-y-text', size: 13 }));
  out.push(drawMesh(kit, tableLeg(1, 1), v, { mode: 'wire', width: 0.01 }));
  out.push(kit.text(200, 250, 'one leg modelled, three mirrored', { size: 12, anchor: 'middle' }));
  return kit.svg({ width: 400, height: 262 }, out);
};
