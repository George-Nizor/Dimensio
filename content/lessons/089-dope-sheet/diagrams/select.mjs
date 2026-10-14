// B and a drag box-selects keys: here the last bounce's three keys, picked out, with the dashed box.
import { sheet } from './anim.mjs';
import { EVEN } from './bounce.mjs';
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const picked = [61, 73, 85];
  const s = sheet(kit, { x: 10, y: 40, w: 520, list: 110, start: 0, end: 90, every: 10, channels: [{ label: 'Z Location', keys: EVEN, sel: picked }] });
  const x0 = s.fx(56);
  const x1 = s.fx(89);
  return kit.svg({ width: 540, height: 110 },
    keycap(kit, 40, 20, 'B'), kit.text(64, 25, 'box select', { size: 12 }),
    keycap(kit, 176, 20, 'A'), kit.text(200, 25, 'all', { size: 12 }),
    keycap(kit, 276, 20, 'Shift'), kit.text(312, 25, 'and click: add one', { size: 12 }),
    s.svg,
    `<rect x="${x0}" y="${s.rowY(0) - 13}" width="${x1 - x0}" height="26" rx="2" fill="none" class="d-mark" stroke-width="1.4" stroke-dasharray="4 3"/>`,
  );
};
