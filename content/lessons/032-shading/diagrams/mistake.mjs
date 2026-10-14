// A 1 m box. Wrong: Shade Smooth blends the light round every corner, so the flat sides shade
// unevenly. Right: Shade Flat gives each side one tone.
import { view, cube } from '../../../diagrams/mesh.mjs';
const SIDE = [-0.9, -0.3, 0.3];
import { paint, panel } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 30, elevation: 24, at: [124, 106], scale: 60, target: [0, 0, 0] });
  const right = view({ azimuth: 30, elevation: 24, at: [376, 106], scale: 60, target: [0, 0, 0] });
  return kit.svg({ width: 500, height: 240 },
    panel(kit, 14, 14, 220, 184),
    paint(kit, cube(2), left, { light: SIDE, width: 1.5, smooth: () => true, sharp: 180, edges: 'shape', steps: 10 }),
    kit.tag(124, 224, 'Shade Smooth: dented', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 184),
    paint(kit, cube(2), right, { light: SIDE, width: 1.5 }),
    kit.tag(376, 224, 'Shade Flat: clean'),
  );
};
