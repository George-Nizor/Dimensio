// The Outliner with Barrel 1 clicked and Barrel 6 clicked with Shift held: every name between them
// is selected.
import { cursor, keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const names = ['Barrel 1', 'Barrel 2', 'Barrel 3', 'Barrel 4', 'Barrel 5', 'Barrel 6', 'Camera', 'Crate 1', 'Crate 2'];
  const row = 22;
  const out = [
    `<rect x="20" y="16" width="230" height="${names.length * row + 40}" rx="4" class="d-ui" stroke-width="1"/>`,
    `<rect x="20" y="16" width="230" height="26" rx="4" class="d-sunk" stroke-width="1"/>`,
    kit.text(32, 34, 'Outliner', { size: 11 }),
  ];
  names.forEach((name, i) => {
    const y = 48 + i * row;
    if (i < 6) out.push(`<rect x="24" y="${y}" width="222" height="${row - 2}" rx="3" class="d-ui-mark" stroke-width="${i === 5 ? 1.6 : 0.6}"/>`);
    out.push(`<rect x="34" y="${y + 5}" width="10" height="10" rx="2" class="d-key" stroke-width="1"/>`);
    out.push(kit.text(52, y + 15, name, { size: 12 }));
  });
  out.push(cursor(kit, 120, 48 + 5 * row + 8));
  out.push(kit.text(270, 63, 'click', { size: 12 }));
  out.push(kit.line(266, 59, 240, 59, { cls: 'd-guide', width: 1.2 }));
  out.push(keycap(kit, 300, 48 + 5 * row + 11, 'Shift', { size: 11 }));
  out.push(kit.text(330, 48 + 5 * row + 15, '+ click', { size: 12 }));
  return kit.svg({ width: 400, height: names.length * row + 70 }, out);
};
