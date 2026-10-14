// A surface seen edge on, with its normal pointing up, and where the thickness goes for Offset -1,
// 0 and 1: behind the face, split across it, or in front of it.
import { panel } from '../../037-modifiers/diagrams/modkit.mjs';

export default (kit) => {
  const cell = (x, offset) => {
    const top = 60;
    const t = 40;
    const y0 = 104;
    const below = (t * (1 - offset)) / 2;
    const above = (t * (1 + offset)) / 2;
    return [
      panel(kit, x, 14, 150, 160, `Offset ${offset}`),
      `<rect x="${x + 20}" y="${y0 - above}" width="110" height="${t}" class="d-face-sel" stroke-width="0"/>`,
      kit.line(x + 20, y0 - above, x + 130, y0 - above, { cls: 'd-ink', width: 1.4 }),
      kit.line(x + 20, y0 + below, x + 130, y0 + below, { cls: 'd-ink', width: 1.4 }),
      kit.line(x + 14, y0, x + 136, y0, { cls: 'd-mark', width: 2.4, dash: '6 4' }),
      kit.line(x + 75, y0, x + 75, top - 24, { cls: 'd-mark', width: 1.6 }),
      kit.arrowhead(x + 75, top - 24, -Math.PI / 2, { size: 7 }),
    ];
  };
  return kit.svg({ width: 500, height: 224 },
    cell(14, -1), cell(176, 0), cell(338, 1),
    kit.text(250, 216, 'dashed line: the face, arrow: its normal', { anchor: 'middle', size: 12 }),
  );
};
