// The lesson 36 barrel twice. Left, Shade Flat: each side its own tone. Right, Shade Auto Smooth at
// 40 degrees: the sides blend round, while the bands, rims and lid stay crisp.
import { view, translate } from '../../../diagrams/mesh.mjs';
import { barrel } from './barrel.mjs';
const SIDE = [-0.9, -0.3, 0.3];
import { paint } from './paint.mjs';

export default (kit) => {
  const v = view({ azimuth: 20, elevation: 22, at: [250, 118], scale: 117, target: [0, 0, 0.6] });
  return kit.svg({ width: 500, height: 240 },
    paint(kit, translate(barrel(), [-0.8, 0, 0]), v, { light: SIDE, outward: false, width: 1.1 }),
    paint(kit, translate(barrel(), [0.8, 0, 0]), v, { light: SIDE, outward: false, width: 1.1, smooth: () => true, sharp: 40, edges: 'shape' }),
    kit.text(v.project([-0.8, -0.7, 0])[0], 232, 'Shade Flat', { anchor: 'middle', size: 12 }),
    kit.text(v.project([0.8, -0.7, 0])[0], 232, 'Shade Auto Smooth', { anchor: 'middle', size: 12 }),
  );
};
