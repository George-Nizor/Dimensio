// The finished door in the NLA editor: one track with two strips, open from frame 1 to 24 and
// close from 60 to 83. Under it, the door's angle over time: it opens, holds at -100 degrees while
// no strip plays, then closes.
import { nla } from '../../092-drivers/diagrams/animkit.mjs';

export default (kit) => {
  const n = nla(kit, 14, 14, 492, [
    { name: 'Door', kind: 'object' },
    { name: 'open', kind: 'track', strips: [[1, 24, 'open'], [60, 83, 'close']] },
  ]);
  const top = n.bottom + 24;
  const y = (deg) => top + (-deg / 100) * 70;
  const pts = [];
  for (let f = 1; f <= 100; f += 1) {
    let deg = 0;
    if (f <= 24) { const t = (f - 1) / 23; deg = -100 * t * t * (3 - 2 * t); }
    else if (f < 60) deg = -100;
    else if (f <= 83) { const t = (f - 60) / 23; deg = -100 * (1 - t * t * (3 - 2 * t)); }
    pts.push([n.at(f), y(deg)]);
  }
  return kit.svg({ width: 520, height: top + 100 },
    n.svg,
    kit.line(n.at(0), y(0), n.at(100), y(0), { cls: 'd-guide', width: 1 }),
    kit.text(150, y(0) + 4, '0°', { anchor: 'end', size: 11 }),
    kit.text(150, y(-100) + 4, '-100°', { anchor: 'end', size: 11 }),
    kit.polyline(pts, { cls: 'd-mark', width: 2 }),
    kit.text(n.at(42), y(-100) - 8, 'held open', { anchor: 'middle', size: 12 }),
  );
};
