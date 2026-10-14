// Object > Shade Auto Smooth: the barrel with round sides and crisp bands, and the Smooth by Angle
// modifier it adds, with Angle set to 40 degrees.
import { view } from '../../../diagrams/mesh.mjs';
import { barrel } from './barrel.mjs';
const SIDE = [-0.9, -0.3, 0.3];
import { paint } from './paint.mjs';

export default (kit) => {
  const v = view({ azimuth: 20, elevation: 22, at: [130, 118], scale: 133, target: [0, 0, 0.6] });
  return kit.svg({ width: 500, height: 240 },
    paint(kit, barrel(), v, { light: SIDE, outward: false, width: 1.2, smooth: () => true, sharp: 40, edges: 'shape' }),
    `<rect x="270" y="70" width="200" height="96" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(284, 94, 'Smooth by Angle', { size: 13 }),
    kit.text(284, 126, 'Angle', { size: 12 }),
    `<rect x="340" y="110" width="116" height="24" rx="4" class="d-ui-mark" stroke-width="1"/>`,
    kit.text(398, 127, '40°', { anchor: 'middle', size: 12 }),
    kit.text(284, 154, 'Ignore Sharpness', { size: 11 }),
  );
};
