// A strip with Blend In and Blend Out of 6 frames: its influence, drawn over the strip, ramps from
// 0 up to 1 over its first 6 frames and back down over its last 6.
import { frame, row, nla } from '../../092-drivers/diagrams/animkit.mjs';

export default (kit) => {
  const n = nla(kit, 14, 120, 492, [
    { name: 'open', kind: 'track', strips: [[20, 60, '']] },
  ], { rowH: 60 });
  const base = 120 + 26 + 52;
  const topY = 120 + 26 + 12;
  return kit.svg({ width: 520, height: n.bottom + 14 },
    frame(kit, 14, 14, 300, 94),
    kit.text(28, 36, 'Active Strip', { size: 13 }),
    row(kit, 20, 48, 120, 160, 'Blend In', '6', { mark: true }),
    row(kit, 20, 74, 120, 160, 'Out', '6', { mark: true }),
    n.svg,
    kit.polyline([[n.at(20), base], [n.at(26), topY], [n.at(54), topY], [n.at(60), base]], { cls: 'd-mark', width: 2.2 }),
    kit.text(n.at(40), topY + 26, 'influence', { anchor: 'middle', size: 12 }),
  );
};
