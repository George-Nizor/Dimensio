// The World tab in the Properties editor: the Surface panel with a Background shader, its Color and
// its Strength.
export default (kit) => {
  const out = [
    `<rect x="20" y="20" width="320" height="150" rx="5" class="d-ui" stroke-width="1"/>`,
    kit.text(34, 44, 'Surface', { size: 12, cls: 'd-key-text' }),
  ];
  const rows = [['Surface', 'Background'], ['Color', ''], ['Strength', '1.000']];
  rows.forEach(([name, value], i) => {
    const y = 76 + i * 30;
    if (name !== 'Surface') out.push(`<rect x="28" y="${y - 16}" width="304" height="24" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    out.push(kit.text(40, y, name, { size: 12 }));
    if (name === 'Color') out.push(`<rect x="160" y="${y - 12}" width="160" height="16" rx="3" class="d-face-2" stroke-width="0"/>`, kit.polyline([[160, y - 12], [320, y - 12], [320, y + 4], [160, y + 4], [160, y - 12]], { cls: 'd-ink', width: 1 }));
    else out.push(kit.text(320, y, value, { size: 12, anchor: 'end', cls: 'd-key-text' }));
  });
  return kit.svg({ width: 360, height: 190 }, out);
};
