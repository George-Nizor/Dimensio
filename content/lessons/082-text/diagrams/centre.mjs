// Paragraph > Alignment > Horizontal. Left: the text starts at its origin. Center: the origin sits
// in the middle of the line, so the word stays centred where you put it.
import { panel } from './letters.mjs';

export default (kit) => {
  const big = (x, y, s, anchor) => `<text x="${x}" y="${y}" class="d-key-text" text-anchor="${anchor}" font-size="38" font-weight="700" style="font-family: var(--font-ui, sans-serif)">${s}</text>`;
  const origin = (x, y) => [kit.circle(x, y, 6, { cls: 'd-mark', width: 2 }), kit.dot(x, y, { r: 2.4, cls: 'd-mark-fill' })];
  return kit.svg({ width: 520, height: 180 },
    panel(kit, 14, 14, 236, 120, 'Left'),
    kit.line(60, 30, 60, 118, { cls: 'd-guide', width: 1, dash: '4 4' }),
    big(60, 90, 'INN', 'start'), origin(60, 90),
    panel(kit, 270, 14, 236, 120, 'Center'),
    kit.line(388, 30, 388, 118, { cls: 'd-guide', width: 1, dash: '4 4' }),
    big(388, 90, 'INN', 'middle'), origin(388, 90),
    kit.text(260, 172, 'the orange ring is the origin', { anchor: 'middle', size: 12 }),
  );
};
