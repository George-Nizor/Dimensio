// Add > Light with its four kinds, and the light's Object Data tab: Color, and Power starting at
// 10 W.
export default (kit) => {
  const kinds = ['Point', 'Sun', 'Spot', 'Area'];
  const out = [
    `<rect x="14" y="20" width="110" height="${kinds.length * 24 + 34}" rx="5" class="d-paper" stroke-width="1.2"/>`,
    kit.text(24, 40, 'Add > Light', { size: 12, cls: 'd-tag' }),
  ];
  kinds.forEach((name, i) => out.push(kit.text(30, 66 + i * 24, name, { size: 12 })));
  out.push(`<rect x="160" y="20" width="280" height="104" rx="5" class="d-ui" stroke-width="1"/>`);
  out.push(kit.text(172, 42, 'Light', { size: 12, cls: 'd-key-text' }));
  const rows = [['Color', ''], ['Power', '10 W']];
  rows.forEach(([name, value], i) => {
    const y = 72 + i * 26;
    out.push(`<rect x="166" y="${y - 15}" width="268" height="22" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    out.push(kit.text(176, y, name, { size: 12 }));
    if (name === 'Color') out.push(`<rect x="300" y="${y - 12}" width="120" height="16" rx="3" class="d-face-1" stroke-width="1"/>`, kit.polyline([[300, y - 12], [420, y - 12], [420, y + 4], [300, y + 4], [300, y - 12]], { cls: 'd-ink', width: 1 }));
    else out.push(kit.text(420, y, value, { size: 12, anchor: 'end', cls: 'd-key-text' }));
  });
  return kit.svg({ width: 460, height: 170 }, out);
};
