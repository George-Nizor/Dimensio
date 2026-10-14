// The cart and crates from the crate-cart starter, as real meshes for this lesson's diagrams.
// Not a diagram itself. The cart's origin is on its axle, 0.35 m up; tipping it turns it about X
// so the open back (+Y) drops. Crates are 0.4 m cubes.
import { box, cylinder, join, translate, rotate } from '../../../diagrams/mesh.mjs';

const AXLE = 0.35;

// The cart around its axle, then turned `tip` degrees (negative drops the back) and lifted.
export function cart(tip = 0) {
  const top = 0.78 - AXLE;
  const parts = [
    box({ size: [1.2, 1.8, 0.06], center: [0, 0, top - 0.03] }),
    box({ size: [0.05, 1.79, 0.18], center: [0.57, 0, top + 0.09] }),
    box({ size: [0.05, 1.79, 0.18], center: [-0.57, 0, top + 0.09] }),
    box({ size: [1.08, 0.05, 0.18], center: [0, -0.87, top + 0.09] }),
  ];
  for (const side of [-1, 1]) {
    parts.push(translate(rotate(cylinder({ vertices: 12, radius: 0.35, depth: 0.08 }), 'y', 90), [side * 0.68, 0, 0]));
    parts.push(box({ size: [0.05, 0.8, 0.05], center: [side * 0.5, -1.3, top - 0.03] }));
    parts.push(box({ size: [0.05, 0.05, 0.72], center: [side * 0.5, -0.8, top - 0.06 - 0.36] }));
  }
  return translate(rotate(join(...parts), 'x', tip), [0, 0, AXLE]);
}

export const crate = (x, y, z, turnZ = 0, turnX = 0) => translate(rotate(rotate(box({ size: [0.4, 0.4, 0.4] }), 'z', turnZ), 'x', turnX), [x, y, z]);

// The six crates where the starter stacks them on the bed.
export const stacked = () => join(
  crate(-0.22, 0, 0.985), crate(0.22, 0, 0.985), crate(-0.22, 0.45, 0.985), crate(0.22, 0.45, 0.985),
  crate(-0.22, 0.22, 1.39), crate(0.22, 0.22, 1.39),
);

// Where the crates lie after the fall: tumbled on the ground behind the cart.
export const fallen = () => join(
  crate(-0.21, 1.43, 0.2, 10), crate(0.25, 1.5, 0.2, -12), crate(-0.3, 1.83, 0.2, 25), crate(0.25, 2.11, 0.2, 5),
  crate(-0.26, 3.42, 0.2, -30), crate(0.43, 3.57, 0.2, 40),
);

// Part way: the cart tipping, crates sliding and toppling off the back.
export const sliding = () => join(
  crate(-0.2, 0.63, 0.73, 0, -30), crate(0.22, 0.59, 0.75, 0, -32), crate(-0.24, 1.0, 0.47, 10, -40), crate(0.23, 0.92, 0.52, -8, -36),
  crate(-0.27, 1.07, 0.91, 15, -50), crate(0.23, 1.01, 0.95, -10, -45),
);
