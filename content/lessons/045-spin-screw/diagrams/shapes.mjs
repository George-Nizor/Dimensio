// Shapes shared by this lesson's diagrams. Not a diagram itself.
import { lathe } from '../../037-modifiers/diagrams/modkit.mjs';

// Half the outline of a goblet 1 m tall, as [r, z] pairs: from the middle of the base out along
// the foot, up the stem and the cup to the rim, then down the inside of the cup back to the axis.
export const goblet = [[0, 0], [0.35, 0], [0.35, 0.05], [0.06, 0.08], [0.05, 0.5], [0.3, 0.65], [0.4, 1], [0.36, 1], [0.26, 0.7], [0, 0.62]];

// The goblet as the Screw modifier makes it: the outline turned 360 degrees in 12 steps.
export const gobletMesh = (steps = 12, shift = 0) => lathe(goblet.map(([r, z]) => [r + shift, z]), steps);

// A spring: a circle 10 cm across, 0.3 m from the axis, turned 5 times with Screw 0.2 m.
export function spring() {
  const ring = Array.from({ length: 8 }, (_, i) => {
    const t = (i / 8) * Math.PI * 2;
    return [0.3 + 0.05 * Math.cos(t), 0.05 * Math.sin(t)];
  });
  return lathe(ring, 12, { screw: 0.2, turns: 5, closed: true });
}
