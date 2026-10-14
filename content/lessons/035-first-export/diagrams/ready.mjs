// The crate ready to export: its origin at the middle of its base, and its front facing -Y, the side
// the front view (Numpad 1) looks at and the side Godot treats as the front.
import { view, axes, arrow } from '../../../diagrams/mesh.mjs';
import { crateAt } from './godot.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const v = view({ azimuth: 30, elevation: 24, at: [170, 132], scale: 230, target: [0, 0, 0.1] });
  const [ox, oy] = v.project([0, 0, 0]);
  const [fx, fy] = v.project([0, -0.62, 0]);
  return kit.svg({ width: 460, height: 250 },
    paint(kit, crateAt(0), v, { outward: false, width: 1.2 }),
    axes(kit, v, { origin: [0, 0, 0], length: 0.18, width: 1.6 }),
    arrow(kit, v, [0, -0.27, 0], [0, -0.6, 0], { cls: 'd-mark', width: 2.2 }),
    kit.text(fx - 14, fy + 4, 'front: -Y', { anchor: 'end', size: 12 }),
    kit.dot(ox, oy, { r: 4.5, cls: 'd-mark-fill' }),
    kit.line(ox + 6, oy + 2, 320, 200, { cls: 'd-guide', width: 1 }),
    kit.text(324, 198, 'origin at the', { size: 12 }),
    kit.text(324, 214, 'middle of the base', { size: 12 }),
  );
};
