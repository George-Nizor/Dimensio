// Shared by this lesson's diagrams: the sculpted stone and a low-poly stone wrapped onto it. Both
// sit on the same lumpy, squashed surface, so the low-poly one's vertices lie on the sculpt the way
// the Shrinkwrap modifier puts them. Not a diagram itself.
import { uvSphere, box, transform, scale } from '../../../diagrams/mesh.mjs';
import { lumpy } from './sculpt.mjs';

const SQUASH = [1.25, 1.0, 0.78];
const onSphere = (m) => transform(m, (p) => { const l = Math.hypot(...p) || 1; return [p[0] / l, p[1] / l, p[2] / l]; });
const onStone = (m) => scale(lumpy(onSphere(m), 7, 0.14), SQUASH);

export function sculpt() { return onStone(uvSphere({ segments: 40, rings: 20 })); }
export function cutCube(cuts = 3) { return box({ size: [2, 2, 2], segments: [cuts + 1, cuts + 1, cuts + 1] }); }
export function lowStone(cuts = 3) { return onStone(cutCube(cuts)); }
export function stoneScale(m) { return scale(m, SQUASH); }
