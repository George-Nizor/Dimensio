// The barrel with a Smooth by Angle modifier, as Godot draws it. Wrong: exported with Apply
// Modifiers off, the modifier is left out and every edge shades smooth, blurring the bands.
// Right: with it on, the bands stay crisp. Checked with Blender 5.2.2's glTF exporter.
import { view } from '../../../diagrams/mesh.mjs';
import { barrel } from './barrel.mjs';
const SIDE = [-0.9, -0.3, 0.3];
import { paint, panel } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 20, elevation: 22, at: [124, 104], scale: 100, target: [0, 0, 0.6] });
  const right = view({ azimuth: 20, elevation: 22, at: [376, 104], scale: 100, target: [0, 0, 0.6] });
  return kit.svg({ width: 500, height: 240 },
    panel(kit, 14, 14, 220, 180),
    paint(kit, barrel(), left, { light: SIDE, outward: false, width: 1.1, smooth: () => true, sharp: 180, edges: 'shape' }),
    kit.tag(124, 222, 'Apply Modifiers off', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 180),
    paint(kit, barrel(), right, { light: SIDE, outward: false, width: 1.1, smooth: () => true, sharp: 40, edges: 'shape' }),
    kit.tag(376, 222, 'Apply Modifiers on'),
  );
};
