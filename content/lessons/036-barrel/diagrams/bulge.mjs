// The four inner rings selected and scaled by 1.15 with S and Shift+Z: wider in the middle, the
// height unchanged.
import { view } from '../../../diagrams/mesh.mjs';
import { barrel } from './barrel.mjs';
import { ringEdges } from './rings.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const v = view({ azimuth: 22, elevation: 20, at: [200, 126], scale: 150, target: [0, 0, 0.6] });
  return kit.svg({ width: 460, height: 250 },
    paint(kit, barrel('bulge'), v, { width: 1.4, select: { edges: ringEdges([1, 2, 3, 4]) } }),
    kit.text(380, 112, 'S, Shift+Z', { anchor: 'middle', size: 12 }),
    kit.text(380, 130, '1.15', { anchor: 'middle', size: 12 }),
  );
};
