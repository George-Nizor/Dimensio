// Ctrl+B and 0.01 with every face selected: each edge becomes a face 1 cm wide and each corner a
// small triangle, all selected. The right panel is a close-up of the top front corner.
import { view } from '../../../diagrams/mesh.mjs';
import { crate } from './crate.mjs';
import { paint, panel } from './paint.mjs';

export default (kit) => {
  const { mesh, picked } = crate('chamfer');
  const whole = view({ azimuth: 34, elevation: 26, at: [124, 104], scale: 220, target: [0, 0, 0.25] });
  const close = view({ azimuth: 34, elevation: 26, at: [376, 104], scale: 3000, target: [0.25, -0.25, 0.5] });
  const pick = (i) => (picked.includes(i) ? 'd-face-sel' : null);
  const [cx, cy] = whole.project([0.25, -0.25, 0.5]);
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 220, 180, 'every edge chamfered'),
    paint(kit, mesh, whole, { outward: false, width: 1.3, fill: pick }),
    kit.circle(cx, cy, 9, { cls: 'd-mark', width: 1.6 }),
    panel(kit, 266, 14, 220, 180, 'close up: faces 1 cm wide'),
    `<clipPath id="chamfer-close"><rect x="267" y="15" width="218" height="178" rx="6"/></clipPath>`,
    kit.group({ cls: undefined }, `<g clip-path="url(#chamfer-close)">`, paint(kit, mesh, close, { outward: false, width: 1.6, fill: pick }), '</g>'),
  );
};
