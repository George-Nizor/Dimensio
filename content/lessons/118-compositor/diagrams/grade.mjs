// The Color Balance node's three wheels: Lift for the shadows nudged towards blue, Gamma for the
// middle tones left alone, Gain for the highlights nudged towards orange.
import { box } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const wheel = (cx, label, part, dx, dy, mark) => [
    kit.circle(cx, 100, 46, { cls: 'd-ink', width: 1.4 }),
    kit.line(cx - 46, 100, cx + 46, 100, { cls: 'd-guide', width: 0.8 }),
    kit.line(cx, 54, cx, 146, { cls: 'd-guide', width: 0.8 }),
    `<circle cx="${cx + dx}" cy="${100 + dy}" r="6" class="${mark ? 'd-key-mark' : 'd-key'}" stroke-width="1.4"/>`,
    kit.text(cx, 172, label, { anchor: 'middle', size: 13 }),
    kit.text(cx, 190, part, { anchor: 'middle', size: 11 }),
  ];
  return kit.svg({ width: 460, height: 210 },
    box(14, 14, 432, 186, { cls: 'd-paper', rx: 6, stroke: 1.2 }),
    box(14, 14, 432, 22, { cls: 'd-sunk', rx: 6 }),
    kit.text(24, 30, 'Color Balance', { size: 12 }),
    wheel(85, 'Lift', 'shadows, a little blue', -12, -14, true),
    wheel(230, 'Gamma', 'middle tones, left alone', 0, 0, false),
    wheel(375, 'Gain', 'highlights, a little orange', 16, -8, true),
  );
};
