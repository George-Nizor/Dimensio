// Emulate 3 Button Mouse: Alt with a left drag orbits, Shift and Alt with a left drag pans, Ctrl and
// Alt with a left drag zooms.
import { mouse } from '../../../diagrams/mesh.mjs';
import { keyRow } from './parts.mjs';

export default (kit) => {
  const rows = [[['Alt'], 'orbit'], [['Shift', '+', 'Alt'], 'pan'], [['Ctrl', '+', 'Alt'], 'zoom']];
  return kit.svg({ width: 440, height: 220 },
    rows.map(([keys, label], i) => {
      const y = 40 + i * 70;
      const row = keyRow(kit, 20, y, keys, { size: 12 });
      return [
        row.svg,
        kit.text(row.right + 14, y + 5, '+', { anchor: 'middle', size: 13 }),
        mouse(kit, row.right + 46, y, { button: 'left', size: 0.62 }),
        kit.text(row.right + 76, y - 4, 'drag', { size: 12 }),
        kit.line(row.right + 120, y, row.right + 158, y, { cls: 'd-mark', width: 2 }),
        kit.arrowhead(row.right + 158, y, 0, { size: 8 }),
        kit.text(row.right + 170, y + 5, label, { size: 14, cls: 'd-tag' }),
      ];
    }),
  );
};
