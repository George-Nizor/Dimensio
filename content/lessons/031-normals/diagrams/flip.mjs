// Alt+N, Flip on one face. Left, a ground plane seen from above shows red because its normal
// points down. Right, flipped, its normal points up and it shows its front.
import { view, plane, arrow } from '../../../diagrams/mesh.mjs';
import { paint, panel, step } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 30, elevation: 32, at: [124, 120], scale: 60, target: [0, 0, 0] });
  const right = view({ azimuth: 30, elevation: 32, at: [376, 120], scale: 60, target: [0, 0, 0] });
  const up = plane({ size: [2, 2] });
  const down = { verts: up.verts, faces: up.faces.map((f) => [...f].reverse()) };
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 220, 180, 'normal down: red'),
    paint(kit, down, left, { width: 1.6, fill: (i, back) => (back ? 'd-key-bad' : null), fillOpacity: 0.75 }),
    arrow(kit, left, [0, 0, 0], [0, 0, -1.2], { cls: 'd-mark', width: 2 }),
    step(kit, 240, 104, 260),
    kit.text(250, 84, 'Flip', { anchor: 'middle', size: 12 }),
    panel(kit, 266, 14, 220, 180, 'normal up'),
    paint(kit, up, right, { width: 1.6 }),
    arrow(kit, right, [0, 0, 0], [0, 0, 1.2], { cls: 'd-mark', width: 2 }),
  );
};
