// The door in the NLA editor before any changes: its orange Action Track holds open, the active
// action, with the Push Down button beside it picked out. Below, a muted [Action Stash] track holds
// close as a dashed strip.
import { nla } from '../../092-drivers/diagrams/animkit.mjs';

export default (kit) => {
  const n = nla(kit, 14, 14, 492, [
    { name: 'Door', kind: 'object' },
    { name: 'open', kind: 'action', pushDown: 'mark', strips: [] },
    { name: '[Action Stash]', kind: 'stash', mute: true, strips: [[1, 24, 'close']] },
  ]);
  return kit.svg({ width: 520, height: n.bottom + 40 },
    n.svg,
    kit.text(n.at(30), 77, 'the active action', { size: 12 }),
    kit.text(150, n.bottom + 24, 'Push Down', { anchor: 'end', size: 12 }),
    kit.line(152, n.bottom + 14, 140, 70, { cls: 'd-guide', width: 1 }),
  );
};
