// The Object Constraints tab: Add Object Constraint opens a menu in four columns; Track To is under
// Tracking. A new constraint's icon is red until it has a target.
export default (kit) => {
  const cols = [['Motion Tracking', ['Camera Solver', 'Follow Track', 'Object Solver']], ['Transform', ['Copy Location', 'Copy Rotation', 'Copy Scale', 'Limit Rotation']], ['Tracking', ['Damped Track', 'Locked Track', 'Stretch To', 'Track To']], ['Relationship', ['Action', 'Child Of', 'Floor', 'Follow Path']]];
  return kit.svg({ width: 540, height: 200 },
    `<rect x="10" y="12" width="170" height="26" rx="5" class="d-key" stroke-width="1.2"/>`,
    kit.text(95, 30, 'Add Object Constraint', { anchor: 'middle', size: 12 }),
    `<rect x="10" y="44" width="520" height="${cols[1][1].length * 24 + 40}" rx="5" class="d-paper" stroke-width="1.2"/>`,
    cols.map(([head, items], c) => {
      const x = 20 + c * 128;
      return [
        kit.text(x, 64, head, { size: 11.5 }),
        items.map((name, i) => {
          const y = 76 + i * 24;
          return [name === 'Track To' ? `<rect x="${x - 6}" y="${y}" width="120" height="22" rx="3" class="d-ui-mark" stroke-width="1"/>` : '', kit.text(x, y + 15, name, { size: 12, cls: 'd-key-text' })];
        }),
      ];
    }),
    kit.text(270, 194, 'a short list from each column', { anchor: 'middle', size: 11 }),
  );
};
