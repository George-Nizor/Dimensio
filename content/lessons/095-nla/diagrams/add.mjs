// Adding close: the open track selected, the playhead on frame 60 and Shift+A pressed over the
// strips. close lands on the same track from frame 60 to 83.
import { keycap } from '../../../diagrams/mesh.mjs';
import { nla } from '../../092-drivers/diagrams/animkit.mjs';

export default (kit) => {
  const n = nla(kit, 14, 14, 492, [
    { name: 'Door', kind: 'object' },
    { name: 'open', kind: 'track', mark: true, strips: [[1, 24, 'open'], [60, 83, 'close', 'mark']] },
    { name: '[Action Stash]', kind: 'stash', mute: true, strips: [[1, 24, 'close']] },
  ], { playheadAt: 60 });
  return kit.svg({ width: 520, height: n.bottom + 50 },
    n.svg,
    keycap(kit, 330, n.bottom + 24, 'Shift+A', { size: 13 }),
    kit.text(380, n.bottom + 29, 'Action: close', { size: 12 }),
  );
};
