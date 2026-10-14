// The Spreadsheet: one row per vertex of the result, with its Position. Along the first row of the
// grid X steps by 0.1 m and Z follows the wave. Values read from Blender 5.2.2.
export default (kit) => {
  const rows = [[0, -2.0, -2.0, 0.056], [1, -1.9, -2.0, 0.11], [2, -1.8, -2.0, 0.155], [3, -1.7, -2.0, 0.185], [4, -1.6, -2.0, 0.199], [5, -1.5, -2.0, 0.196]];
  const cols = [70, 180, 290, 400];
  return kit.svg({ width: 500, height: 210 },
    `<rect x="20" y="14" width="460" height="186" rx="6" class="d-ui" stroke-width="1"/>`,
    `<rect x="20" y="14" width="460" height="28" rx="6" class="d-sunk" stroke-width="1"/>`,
    kit.text(cols[0], 33, '', { size: 12 }),
    kit.text(cols[1], 33, 'Position X', { anchor: 'end', size: 12 }), kit.text(cols[2], 33, 'Y', { anchor: 'end', size: 12 }),
    `<rect x="${cols[3] - 74}" y="18" width="80" height="20" rx="3" class="d-ui-mark" stroke-width="1"/>`,
    kit.text(cols[3], 33, 'Z', { anchor: 'end', size: 12 }),
    rows.map(([i, x, y, z], r) => {
      const yy = 62 + r * 24;
      return [
        kit.text(cols[0] - 30, yy, String(i), { size: 11 }),
        kit.text(cols[1], yy, x.toFixed(3), { anchor: 'end', size: 12, cls: 'd-key-text' }),
        kit.text(cols[2], yy, y.toFixed(3), { anchor: 'end', size: 12, cls: 'd-key-text' }),
        kit.text(cols[3], yy, z.toFixed(3), { anchor: 'end', size: 12, cls: 'd-key-text' }),
      ];
    }),
    kit.text(452, 112, '1,681', { anchor: 'end', size: 11 }), kit.text(452, 126, 'rows', { anchor: 'end', size: 11 }),
  );
};
