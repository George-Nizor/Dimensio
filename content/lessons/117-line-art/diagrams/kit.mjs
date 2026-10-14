// A few pieces standing on the ground, like a small building kit: a wall, an eight-sided pillar and
// a crate, all in metres. Not a diagram itself.
import { box, cylinder, translate } from '../../../diagrams/mesh.mjs';

export const wall = () => box({ size: [2, 0.3, 1.6], center: [-0.6, 0.4, 0.8] });
export const pillar = () => translate(cylinder({ vertices: 8, radius: 0.32, depth: 1.8 }), [0.85, 0.2, 0.9]);
export const crate = () => box({ size: [0.6, 0.6, 0.6], center: [0.1, -0.5, 0.3] });
export const pieces = () => [wall(), pillar(), crate()];
