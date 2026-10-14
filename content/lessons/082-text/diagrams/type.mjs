// Typing: a new text object reads "Text". Tab enters Edit Mode, where Backspace deletes and typing
// adds letters at the cursor. Tab again leaves.
import { keycap } from '../../../diagrams/mesh.mjs';
import { panel } from './letters.mjs';

export default (kit) => {
  const big = (x, y, s, cls = 'd-key-text') => `<text x="${x}" y="${y}" class="${cls}" text-anchor="middle" font-size="34" font-weight="700" style="font-family: var(--font-ui, sans-serif)">${s}</text>`;
  return kit.svg({ width: 540, height: 170 },
    panel(kit, 12, 14, 140, 110, 'Add > Text'),
    big(82, 82, 'Text'),
    keycap(kit, 176, 69, 'Tab'),
    panel(kit, 200, 14, 140, 110, 'Edit Mode: type'),
    big(262, 82, 'INN'),
    kit.line(296, 54, 296, 90, { cls: 'd-mark', width: 2.4 }),
    keycap(kit, 364, 69, 'Tab'),
    panel(kit, 388, 14, 140, 110, 'Object Mode'),
    big(458, 82, 'INN'),
  );
};
