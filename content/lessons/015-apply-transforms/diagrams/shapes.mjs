// The boxes from this lesson's exercise, shared by its diagrams. Not a diagram itself.
import { bevelledBox, scale, translate } from '../../../diagrams/mesh.mjs';

// The bench before applying: Blender's 2 m cube with a 0.08 m bevel, then stretched by the
// object's scale (1, 0.25, 0.25), so the bevel stretches with it. Standing on the ground.
export const benchBefore = () => translate(scale(bevelledBox({ size: [2, 2, 2], width: 0.08 }), [1, 0.25, 0.25]), [0, 0, 0.25]);

// The bench after applying: the same size, with the bevel worked out on the real 2 x 0.5 x 0.5 m mesh.
export const benchAfter = () => bevelledBox({ size: [2, 0.5, 0.5], width: 0.08, center: [0, 0, 0.25] });
