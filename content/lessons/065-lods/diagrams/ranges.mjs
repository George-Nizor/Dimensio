// Visibility ranges for hand-made LODs: Rock_LOD0 shows from 0 to 10 m, Rock_LOD1 from 10 to
// 25 m and Rock_LOD2 from 25 m on, each with a 1 m margin where it hands over.
export default (kit) => {
  const x0 = 120;
  const px = (m) => x0 + m * 11;
  const rows = [['Rock_LOD0', 0, 10], ['Rock_LOD1', 10, 25], ['Rock_LOD2', 25, 34]];
  const out = [];
  rows.forEach(([name, begin, end], i) => {
    const y = 40 + i * 38;
    out.push(kit.text(20, y + 15, name, { size: 12, cls: 'd-key-text' }));
    out.push(`<rect x="${px(begin)}" y="${y}" width="${px(end) - px(begin)}" height="22" rx="4" class="d-ui-mark" stroke-width="1.2"/>`);
  });
  out.push(kit.line(px(0), 160, px(34), 160, { cls: 'd-ink', width: 1.4 }));
  for (const m of [0, 10, 25]) {
    out.push(kit.line(px(m), 154, px(m), 166, { cls: 'd-ink', width: 1.4 }));
    out.push(kit.text(px(m), 184, `${m} m`, { size: 12, anchor: 'middle' }));
  }
  out.push(kit.text(px(34) + 6, 165, 'distance', { size: 12 }));
  return kit.svg({ width: 560, height: 200 }, out);
};
