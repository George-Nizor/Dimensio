// The Font panel in the Object Data tab: Regular set to Bfont, Blender's own font, with the folder
// button that loads a font file picked out, and Size under Transform.
export default (kit) => {
  const field = (x, y, w, text, cls = 'd-sunk') => [`<rect x="${x}" y="${y}" width="${w}" height="22" rx="4" class="${cls}" stroke-width="1"/>`, kit.text(x + 10, y + 15, text, { size: 12 })];
  const rows = [['Regular', 'Bfont Regular'], ['Bold', 'Bfont Regular'], ['Italic', 'Bfont Regular'], ['Bold & Italic', 'Bfont Regular']];
  return kit.svg({ width: 520, height: 230 },
    `<rect x="20" y="14" width="480" height="200" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(36, 38, 'Font', { size: 13 }),
    rows.map(([label, value], i) => {
      const y = 50 + i * 30;
      return [
        kit.text(126, y + 15, label, { anchor: 'end', size: 12 }),
        field(136, y, 210, value),
        `<rect x="352" y="${y}" width="26" height="22" rx="4" class="${i === 0 ? 'd-key-mark' : 'd-key'}" stroke-width="1"/>`,
        kit.path(`M 358 ${y + 7} L 363 ${y + 7} L 365 ${y + 9} L 372 ${y + 9} L 372 ${y + 17} L 358 ${y + 17} Z`, { cls: i === 0 ? 'd-paper' : 'd-ink', width: 1.2 }),
      ];
    }),
    kit.text(126, 185, 'Size', { anchor: 'end', size: 12 }),
    field(136, 170, 120, '0.4 m'),
    kit.text(390, 61, 'load a font', { size: 11, cls: 'd-tag' }),
  );
};
