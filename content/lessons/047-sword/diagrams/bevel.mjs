// The blade cut across and seen from above. After Solidify its cross-section is a thin rectangle;
// the Bevel modifier, last in the stack, cuts each long corner, so a narrow face runs along every
// edge.
import { panel, pageArrow } from '../../037-modifiers/diagrams/modkit.mjs';

export default (kit) => {
  const s = 560;
  const w = 0.155;
  const t = 0.03;
  const c = 0.015;
  const shape = (cx, cy, pts) => {
    const xy = pts.map(([x, y]) => [cx + x * s, cy - y * s]);
    return [`<path d="M ${xy.map((p) => p.join(' ')).join(' L ')} Z" class="d-face-2"/>`, kit.polyline([...xy, xy[0]], { cls: 'd-ink', width: 1.8 })];
  };
  const rect = [[w, -t], [w, t], [-w, t], [-w, -t]];
  const oct = [[w, -t + c], [w, t - c], [w - c, t], [-w + c, t], [-w, t - c], [-w, -t + c], [-w + c, -t], [w - c, -t]];
  return kit.svg({ width: 480, height: 150 },
    panel(kit, 14, 14, 200, 100, 'Solidify'),
    shape(114, 64, rect),
    pageArrow(kit, 224, 64, 256, 64),
    panel(kit, 266, 14, 200, 100, 'Bevel, Amount 0.015 m'),
    shape(366, 64, oct),
  );
};
