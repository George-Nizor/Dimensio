// After Push Down: the Action Track is empty, and open is a strip from frame 1 to 24 on a new track
// called open, which is active. close is still on the muted stash track.
import { nla } from '../../092-drivers/diagrams/animkit.mjs';

export default (kit) => {
  const n = nla(kit, 14, 14, 492, [
    { name: 'Door', kind: 'object' },
    { name: '(no action)', kind: 'action', strips: [] },
    { name: 'open', kind: 'track', mark: true, strips: [[1, 24, 'open', 'mark']] },
    { name: '[Action Stash]', kind: 'stash', mute: true, strips: [[1, 24, 'close']] },
  ]);
  return kit.svg({ width: 520, height: n.bottom + 14 }, n.svg);
};
