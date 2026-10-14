// The shoulder used by this lesson's diagrams, seen from the front. Not a diagram itself. A block
// of torso and an arm made of rings along X, drawn in page units. weights() gives the upper arm's
// weight on each ring; the arm turns about the shoulder joint by those weights.
import { limb2d, drawWeights } from '../../097-character-modelling/diagrams/charkit.mjs';

export const RINGS = [0, 10, 22, 36, 54, 82, 110, 140];

// Draws the torso block and the arm at (x, y), the arm turned `deg` degrees (positive turns it
// down), with the upper arm's weights per ring. `torso` is the weight shown on the torso block.
export function shoulder(kit, x, y, { weights, deg = 0, torso = 0, width = 1.2, zero = false } = {}) {
  const at = ([px, py]) => [x + px, y + py];
  const arm = limb2d({ rings: RINGS, half: 13, weights, joint: [6, 0], deg, at });
  const block = [[-56, -13], [0, -13], [0, 64], [-56, 64]].map(at);
  return [
    drawWeights(kit, [{ pts: block, weight: torso }], { width }),
    drawWeights(kit, arm.quads, { width, zero }),
  ];
}

// A rounded frame with a label under it.
export function frame(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}
