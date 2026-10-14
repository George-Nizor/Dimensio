// The tower this lesson builds. Not a diagram itself: three copies of the default 2 m cube, scaled
// 1, 0.7 and 0.4 and moved up 0, 1.7 and 2.8 m, so each sits on the one below.
import { cube, scale, translate, join } from '../../../diagrams/mesh.mjs';

export const COPIES = [[1, 0], [0.7, 1.7], [0.4, 2.8]];
export const tower = (copies = COPIES) => join(...copies.map(([s, z]) => translate(scale(cube(), [s, s, s]), [0, 0, z])));
