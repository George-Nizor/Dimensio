// The Sidebar's Item tab: Location, Rotation, Scale and Dimensions, each with X, Y and Z fields.
import { field } from './parts.mjs';

export default (kit) => {
  const groups = [
    ['Location', ['0 m', '0 m', '0.5 m']],
    ['Rotation', ['0°', '0°', '45°']],
    ['Scale', ['1.000', '1.000', '1.000']],
    ['Dimensions', ['0.5 m', '0.5 m', '1 m']],
  ];
  const height = groups.length * 86 + 30;
  const out = [`<rect x="20" y="14" width="300" height="${height}" rx="4" class="d-ui" stroke-width="1"/>`];
  ['Item', 'Tool', 'View'].forEach((tab, i) => {
    const y = 18 + i * 62;
    out.push(`<rect x="324" y="${y}" width="22" height="58" rx="3" class="${i === 0 ? 'd-ui-mark' : 'd-ui'}" stroke-width="1"/>`);
    out.push(kit.group({ rotate: [90, 335, y + 29] }, kit.text(335, y + 33, tab, { anchor: 'middle', size: 11 })));
  });
  groups.forEach(([name, values], g) => {
    const y = 38 + g * 86;
    out.push(kit.text(34, y + 4, name, { size: 12 }));
    ['X', 'Y', 'Z'].forEach((axis, i) => out.push(field(kit, 70, y + 22 + i * 22, axis, values[i], { labelWidth: 40, width: 150, mark: g === 1 && i === 2 })));
  });
  return kit.svg({ width: 370, height: height + 26 }, out);
};
