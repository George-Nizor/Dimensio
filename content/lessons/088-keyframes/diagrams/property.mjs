// Pressing I over one field keys only that value: here Rotation Z in the Sidebar's Item tab.
import { keycap, cursor } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const rows = [['Location', ['0 m', '0 m', '0.3 m']], ['Rotation', ['90°', '0°', '180°']], ['Scale', ['1', '1', '1']]];
  const out = [];
  rows.forEach(([label, values], r) => {
    const y = 40 + r * 78;
    out.push(kit.text(40, y + 14, label, { size: 12 }));
    values.forEach((value, i) => {
      const yy = y + 4 + i * 22 - 4;
      const on = label === 'Rotation' && i === 2;
      out.push(`<rect x="110" y="${yy}" width="150" height="20" rx="4" class="${on ? 'd-ui-mark' : 'd-sunk'}" stroke-width="1"/>`,
        kit.text(120, yy + 14, ['X', 'Y', 'Z'][i], { size: 11 }), kit.text(250, yy + 14, value, { anchor: 'end', size: 11, cls: 'd-key-text' }));
    });
  });
  return kit.svg({ width: 440, height: 276 },
    `<rect x="24" y="14" width="260" height="250" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(36, 30, 'Item', { size: 12 }),
    out,
    cursor(kit, 176, 166),
    keycap(kit, 350, 166, 'I'),
    kit.text(350, 206, 'keys Rotation Z only', { anchor: 'middle', size: 12 }),
  );
};
