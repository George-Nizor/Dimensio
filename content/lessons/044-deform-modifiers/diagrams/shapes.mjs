// Shapes shared by this lesson's diagrams. Not a diagram itself.
import { box, join, translate } from '../../../diagrams/mesh.mjs';
import { twist, bend, alongCurve } from '../../037-modifiers/diagrams/modkit.mjs';

// A column 0.6 m square and 3 m tall, its origin at the base, with 11 loop cuts up its height,
// twisted 90 degrees by Simple Deform around Z.
export const column = (degrees = 90) => twist(box({ size: [0.6, 0.6, 3], segments: [1, 1, 12], center: [0, 0, 1.5] }), degrees, { base: 0, top: 3 });

// A sign 2 m long along X, 0.1 m deep and 0.6 m tall, with `cuts` loop cuts across it, bent
// 90 degrees by Simple Deform around Z.
export const sign = (cuts = 10, degrees = 90) => bend(box({ size: [2, 0.1, 0.6], segments: [cuts + 1, 1, 1], center: [0, 0, 0.3] }), degrees, 2);

// The Path, 4 m long from X -2 to 2, with its middle point moved down: a gentle sag.
export const path = () => Array.from({ length: 41 }, (_, i) => {
  const x = -2 + i * 0.1;
  return [x, -0.25 * Math.cos((Math.PI * x) / 4) ** 2];
});

// Twelve planks 0.2 m wide in a row (an Array, Offset X 1.6), laid along the path by the Curve
// modifier. Each plank is cut across so it can follow the curve.
export function plankRow() {
  const plank = box({ size: [0.2, 1, 0.05], segments: [2, 1, 1], center: [0.1, 0, 0] });
  const row = join(...Array.from({ length: 12 }, (_, i) => translate(plank, [i * 0.32, 0, 0])));
  return alongCurve(translate(row, [-2, 0, 0]), path(), { start: -2 });
}
