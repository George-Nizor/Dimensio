// The New Image dialog from the UV Editor's header, with Generated Type set to UV Grid. Its Color,
// Alpha and other rows are left out.
export default (kit) => {
  const rows = [['Name', 'Untitled'], ['Width', '1024 px'], ['Height', '1024 px'], ['Generated Type', 'UV Grid']];
  const out = [`<rect x="20" y="14" width="300" height="${rows.length * 26 + 56}" rx="6" class="d-paper" stroke-width="1.4"/>`];
  rows.forEach(([label, value], i) => {
    const y = 26 + i * 26;
    const mark = label === 'Generated Type';
    if (mark) out.push(`<rect x="26" y="${y - 3}" width="288" height="24" rx="4" class="d-ui-mark" stroke-width="1"/>`);
    out.push(kit.text(132, y + 13, label, { size: 11, anchor: 'end' }));
    out.push(`<rect x="140" y="${y}" width="166" height="18" rx="3" class="${value === null ? 'd-dot' : 'd-sunk'}" stroke-width="1"/>`);
    if (value) out.push(kit.text(148, y + 13, value, { size: 11, cls: 'd-key-text' }));
  });
  const by = 26 + rows.length * 26 + 6;
  out.push(`<rect x="200" y="${by}" width="106" height="22" rx="4" class="d-key-mark" stroke-width="1.2"/>`, kit.text(253, by + 15, 'OK', { size: 12, anchor: 'middle', cls: 'd-key-text d-key-text-mark' }));
  return kit.svg({ width: 340, height: by + 40 }, out);
};
