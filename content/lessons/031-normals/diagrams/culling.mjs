// The Viewport Shading popover with Backface Culling ticked, and the exercise's crate as it then
// draws: its top and front point inwards, so their backs face you and they are hidden. Their
// edges are dashed here. With the inner sides hidden too, you see straight through the crate.
import { view, normal } from '../../../diagrams/mesh.mjs';
import { crate, checkboxes } from './shapes.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const v = view({ azimuth: 30, elevation: 26, at: [150, 120], scale: 120, target: [0, 0, 0.5] });
  const m = crate(true);
  const right = crate(false);
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const hidden = [];
  m.faces.forEach((f, i) => {
    if (dot(normal(m, f), v.toward) > 0 || dot(normal(right, right.faces[i]), v.toward) <= 0) return;
    f.forEach((a, k) => { const p = v.project(m.verts[a]); const q = v.project(m.verts[f[(k + 1) % f.length]]); hidden.push(kit.line(p[0], p[1], q[0], q[1], { cls: 'd-guide', width: 1.2, dash: '5 4' })); });
  });
  return kit.svg({ width: 500, height: 240 },
    hidden,
    paint(kit, m, v, { width: 1.6, outward: false }),
    checkboxes(kit, 290, 70, 'Viewport Shading', [['Backface Culling', true], ['Outline', false]]),
  );
};
