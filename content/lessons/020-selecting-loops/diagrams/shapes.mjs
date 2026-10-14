// The Pipe and the Floor from the loop-shapes starter, and the picks this lesson's diagrams make
// on them. Not a diagram itself.
import { plane } from '../../../diagrams/mesh.mjs';
import { tube } from './helpers.mjs';

// The Pipe: 12 sides, six rows of faces, 1 m across and 2 m tall.
export const pipe = () => tube({ sides: 12, rows: 6, radius: 0.5, height: 2 });

// The horizontal edge loop at row line `r`, the faces of row `r`, the vertical edges in row `r`
// (an edge ring) and the vertical edges in column `k` (a vertical loop).
export const loopAt = (t, r) => Array.from({ length: 12 }, (_, i) => [t.at(r, i), t.at(r, i + 1)]);
export const bandAt = (r) => Array.from({ length: 12 }, (_, i) => r * 12 + i);
export const ringAt = (t, r) => Array.from({ length: 12 }, (_, i) => [t.at(r, i), t.at(r + 1, i)]);
export const columnAt = (t, k) => Array.from({ length: 6 }, (_, r) => [t.at(r, k), t.at(r + 1, k)]);

// The Floor: a 2 m grid of 8 by 8 faces. face(i, j) is column i, row j.
export const floor = (n = 8) => plane({ size: [2, 2], segments: [n, n] });
export const face = (i, j, n = 8) => j * n + i;
// A staircase of faces from one corner to the other, each step sharing an edge with the last.
export const staircase = (n = 8) => Array.from({ length: 2 * n - 1 }, (_, s) => face(Math.ceil(s / 2), Math.floor(s / 2), n));
