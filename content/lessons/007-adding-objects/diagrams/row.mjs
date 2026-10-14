// The exercise's five shapes, each 1 m tall and standing on the grid. Not a diagram itself.
import { cube, cylinder, uvSphere, translate } from '../../../diagrams/mesh.mjs';
import { cone, icosphere } from './parts.mjs';

export const shapes = () => [
  translate(cube(1), [0, 0, 0.5]),
  cylinder({ vertices: 8, radius: 0.5, depth: 1, center: [2, 0, 0.5] }),
  cone({ vertices: 6, r1: 0.5, depth: 1, center: [4, 0, 0.5] }),
  uvSphere({ segments: 12, rings: 6, radius: 0.5, center: [6, 0, 0.5] }),
  icosphere({ radius: 0.5, center: [8, 0, 0.5] }),
];
