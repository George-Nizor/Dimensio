// The P menu in Edit Mode, with its three ways to separate.
export default (kit) => {
  const rows = [['Selection', 'the selected part'], ['By Material', 'one object per material slot'], ['By Loose Parts', 'one object per loose part']];
  return kit.svg({ width: 440, height: 170 },
    `<rect x="20" y="20" width="170" height="${34 + rows.length * 30}" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(34, 42, 'Separate', { size: 13 }),
    rows.map(([name, note], i) => [
      `<rect x="28" y="${52 + i * 30}" width="154" height="26" rx="4" class="d-ui" stroke-width="0.8"/>`,
      kit.text(40, 70 + i * 30, name, { size: 12 }),
      kit.line(196, 65 + i * 30, 222, 65 + i * 30, { cls: 'd-guide', width: 1.2 }),
      kit.text(230, 69 + i * 30, note, { size: 12 }),
    ]),
  );
};
