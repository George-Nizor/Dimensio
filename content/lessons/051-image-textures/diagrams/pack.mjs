// File > External Data > Pack Resources, with the submenu open and Pack Resources picked out. The
// File menu's upper items are left out; the submenu's items are Blender 5.2.2's, without the last
// two.
const ROW = 19;

function menu(kit, x, y, w, items, mark) {
  const out = [`<rect x="${x}" y="${y}" width="${w}" height="${items.length * ROW + 10}" rx="5" class="d-paper" stroke-width="1.4"/>`];
  items.forEach(([label, sub], i) => {
    const top = y + 5 + i * ROW;
    if (label === mark) out.push(`<rect x="${x + 4}" y="${top}" width="${w - 8}" height="${ROW - 1}" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    out.push(kit.text(x + 12, top + 13, label, { size: 11 }));
    if (sub) out.push(kit.path(`M ${x + w - 16} ${top + 5} L ${x + w - 12} ${top + 9} L ${x + w - 16} ${top + 13}`, { cls: 'd-ink', width: 1.3 }));
  });
  return out;
}

export default (kit) => kit.svg({ width: 470, height: 250 },
  `<rect x="14" y="14" width="44" height="20" rx="3" class="d-ui-mark" stroke-width="1"/>`,
  kit.text(36, 28, 'File', { size: 12, anchor: 'middle' }),
  menu(kit, 14, 38, 150, [['...', 0], ['Import', 1], ['Export', 1], ['External Data', 1], ['Clean Up', 1]], 'External Data'),
  menu(kit, 168, 94, 280, [['Automatically Pack Resources', 0], ['Pack Resources', 0], ['Unpack Resources', 0], ['Pack Linked Libraries', 0], ['Unpack Linked Libraries', 0], ['Make Paths Relative', 0], ['Make Paths Absolute', 0]], 'Pack Resources'),
);
