// The Overlays popover in Weight Paint mode with Zero Weights set to All, and a leg whose loop below
// the hip has no weight in any group. Blender draws that loop black; here it is hatched, so it reads
// the same in light and dark themes.
import { field } from '../../092-drivers/diagrams/animkit.mjs';
import { drawWeights } from '../../097-character-modelling/diagrams/charkit.mjs';
import { frame } from './shoulder.mjs';

export default (kit) => {
  const ring = (y0, y1, weight) => ({ pts: [[280, y0], [340, y0], [340, y1], [280, y1]], weight });
  return kit.svg({ width: 460, height: 250 },
    frame(kit, 14, 14, 240, 110),
    kit.text(28, 38, 'Weight Paint Overlays', { size: 13 }),
    kit.text(28, 76, 'Zero Weights', { size: 12 }),
    field(kit, 112, 60, 44, 'None', { size: 11 }),
    field(kit, 158, 60, 44, 'Active', { size: 11 }),
    field(kit, 204, 60, 40, 'All', { mark: true, size: 11 }),
    drawWeights(kit, [{ pts: [[260, 20], [360, 20], [360, 50], [260, 50]], weight: 0.6 }]),
    `<rect x="280" y="50" width="60" height="16" class="d-sunk" stroke-width="1"/>`,
    [0, 1, 2, 3, 4, 5].map((i) => kit.line(282 + i * 10, 64, 292 + i * 10, 52, { cls: 'd-ink', width: 1.2 })),
    drawWeights(kit, [ring(66, 140, 1), ring(140, 220, 0.6)]),
    kit.line(346, 58, 372, 58, { cls: 'd-guide', width: 1 }),
    kit.text(376, 62, 'no weight', { size: 12 }),
    kit.text(376, 78, 'at all', { size: 12 }),
  );
};
