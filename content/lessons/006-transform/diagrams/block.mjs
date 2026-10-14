// The exercise's block, 0.5 by 0.5 by 1 m, standing on the grid. Not a diagram itself.
import { box } from '../../../diagrams/mesh.mjs';

export const block = (at = [0, 0, 0.5]) => box({ size: [0.5, 0.5, 1], center: at });
