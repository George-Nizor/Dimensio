// Shift+N (Recalculate Outside) on the inside-out barrel. Left, red all over with every face
// selected. Right, every face pointing out, so no red.
import { view, keycap } from '../../../diagrams/mesh.mjs';
import { barrel, red } from './shapes.mjs';
import { paint, panel, step } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 28, elevation: 24, at: [114, 108], scale: 116, target: [0, 0, 0.5] });
  const right = view({ azimuth: 28, elevation: 24, at: [386, 108], scale: 116, target: [0, 0, 0.5] });
  return kit.svg({ width: 500, height: 230 },
    panel(kit, 14, 14, 200, 180, 'all selected'),
    paint(kit, barrel(true), left, { width: 1.4, fill: red, fillOpacity: 0.75, rim: 'd-mark' }),
    keycap(kit, 250, 84, 'Shift+N', { size: 11 }),
    step(kit, 224, 110, 276),
    panel(kit, 286, 14, 200, 180, 'pointing out'),
    paint(kit, barrel(false), right, { width: 1.4, rim: 'd-mark' }),
  );
};
