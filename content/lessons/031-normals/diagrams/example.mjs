// The exercise before and after, with Face Orientation on. Left, the crate's top and front faces
// and every face of the barrel show their red backs. Right, after Shift+N, no red.
import { view, translate } from '../../../diagrams/mesh.mjs';
import { crate, barrel, red } from './shapes.mjs';
import { paint, panel, step } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 28, elevation: 22, at: [124, 112], scale: 70, target: [0, 0, 0.5] });
  const right = view({ azimuth: 28, elevation: 22, at: [386, 112], scale: 70, target: [0, 0, 0.5] });
  const draw = (v, fixed) => [
    paint(kit, translate(crate(!fixed), [-0.75, 0, 0]), v, { width: 1.4, fill: red, fillOpacity: 0.75 }),
    paint(kit, translate(barrel(!fixed), [0.75, 0, 0]), v, { width: 1.4, fill: red, fillOpacity: 0.75 }),
  ];
  return kit.svg({ width: 520, height: 230 },
    panel(kit, 14, 14, 220, 180, 'faces pointing in'),
    draw(left, false),
    step(kit, 244, 104, 280),
    panel(kit, 286, 14, 220, 180, 'after Shift+N'),
    draw(right, true),
  );
};
