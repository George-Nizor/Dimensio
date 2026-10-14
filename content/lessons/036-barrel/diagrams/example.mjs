// The finished barrel after Shade Auto Smooth at 40 degrees: 12 sides blending round, crisp bands,
// rims and lid.
import { view } from '../../../diagrams/mesh.mjs';
import { barrel } from './barrel.mjs';
import { paint } from './paint.mjs';

const SIDE = [-0.9, -0.3, 0.3];
export default (kit) => {
  const v = view({ azimuth: 22, elevation: 24, at: [250, 124], scale: 150, target: [0, 0, 0.6] });
  return kit.svg({ width: 500, height: 250 }, paint(kit, barrel('done'), v, { light: SIDE, outward: false, width: 1.2, smooth: () => true, sharp: 40, edges: 'shape' }));
};
