// The Sidebar's Strip tab, Action Clip panel, with Repeat set to 3 and picked out, and the strip it
// gives: open played three times in a row, from frame 1 to 70.
import { frame, row, nla } from '../../092-drivers/diagrams/animkit.mjs';

export default (kit) => {
  const n = nla(kit, 14, 172, 492, [
    { name: 'open', kind: 'track', strips: [[1, 70, '']] },
  ]);
  const thirds = [24, 47].map((f) => kit.line(n.at(f), 202, n.at(f), 218, { cls: 'd-ink', width: 1.2, dash: '3 3' }));
  return kit.svg({ width: 520, height: n.bottom + 14 },
    frame(kit, 14, 14, 300, 146),
    kit.text(28, 36, 'Action Clip', { size: 13 }),
    row(kit, 20, 48, 120, 160, 'Frame Start', '1'),
    row(kit, 20, 74, 120, 160, 'End', '24'),
    row(kit, 20, 100, 120, 160, 'Playback Scale', '1.000'),
    row(kit, 20, 126, 120, 160, 'Repeat', '3.000', { mark: true }),
    kit.text(330, 60, 'Sidebar (N)', { size: 12 }),
    kit.text(330, 80, 'Strip tab', { size: 12 }),
    n.svg,
    thirds,
    [12, 36, 59].map((f) => kit.text(n.at(f), 214, 'open', { anchor: 'middle', size: 11 })),
  );
};
