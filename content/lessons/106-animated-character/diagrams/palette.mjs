// One palette material: a texture of colour squares, with each part's UV islands moved onto its
// colour (shown as small outlines on the squares), so the whole character uses one material.
import { panel } from './helpers.mjs';

export default (kit) => {
  const tones = ['d-face-1', 'd-face-2', 'd-face-3', 'd-face-sel'];
  const cells = [];
  for (let r = 0; r < 4; r += 1) for (let c = 0; c < 4; c += 1) {
    cells.push(`<rect x="${40 + c * 40}" y="${30 + r * 40}" width="40" height="40" class="${tones[(r + c) % 4]}" stroke-width="0"/>`);
  }
  const island = (x, y) => kit.polyline([[x, y], [x + 18, y + 2], [x + 16, y + 18], [x + 2, y + 16], [x, y]], { cls: 'd-mark', width: 1.6 });
  return kit.svg({ width: 470, height: 230 },
    panel(kit, 30, 20, 180, 180, 'palette texture, UV Editor'),
    cells,
    `<rect x="40" y="30" width="160" height="160" class="d-ink" fill="none" stroke-width="1.4"/>`,
    island(51, 41), island(131, 81), island(91, 121), island(171, 161),
    kit.text(250, 70, 'skin, shirt, trousers, shoes:', { size: 12 }),
    kit.text(250, 90, 'each part\'s islands sit', { size: 12 }),
    kit.text(250, 110, 'on one colour square', { size: 12 }),
    `<rect x="250" y="136" width="190" height="26" rx="4" class="d-ui-mark" stroke-width="1"/>`,
    kit.text(260, 153, 'Material slots: 1', { size: 12 }),
  );
};
