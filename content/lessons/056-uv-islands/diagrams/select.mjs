// Selecting an island: with the mouse over the lid's end, L selects the whole island, ready for G,
// R and S.
import { keycap, cursor } from '../../../diagrams/mesh.mjs';
import { uvSquare, drawUVs, toSquare } from './uv.mjs';
import { even } from './chestuv.mjs';

export default (kit) => {
  const { uvs, islands } = even();
  const at = toSquare(30, 20, 220);
  const c = uvs[islands.endR[2]][0];
  const [cx, cy] = at([c[0] + 0.05, c[1] + 0.04]);
  return kit.svg({ width: 470, height: 270 },
    uvSquare(kit, 30, 20, 220, { labels: false }),
    drawUVs(kit, uvs, 30, 20, 220, { select: islands.endR }),
    cursor(kit, cx, cy),
    keycap(kit, 330, 70, 'L'), kit.text(356, 75, 'select the island', { size: 12 }),
    keycap(kit, 316, 130, 'G'), keycap(kit, 352, 130, 'R'), keycap(kit, 388, 130, 'S'),
    kit.text(352, 166, 'move, rotate, scale', { anchor: 'middle', size: 12 }),
  );
};
