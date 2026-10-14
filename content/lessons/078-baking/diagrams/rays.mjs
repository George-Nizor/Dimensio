// The Bake panel set to Normal, Selected to Active ticked with Extrusion and Max Ray Distance. Cut
// through the stones: rays start a little outside the low-poly surface (Extrusion) and travel inward
// up to Max Ray Distance to find the sculpt.
import { propRow } from './props.mjs';

export default (kit) => {
  const cx = 360;
  const cy = 120;
  const low = Array.from({ length: 9 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return [cx + Math.cos(a) * 84, cy + Math.sin(a) * 64]; });
  const high = Array.from({ length: 121 }, (_, i) => {
    const a = (i / 120) * Math.PI * 2;
    const r = 1 + 0.07 * Math.sin(a * 11) + 0.04 * Math.sin(a * 23 + 1);
    return [cx + Math.cos(a) * 82 * r, cy + Math.sin(a) * 62 * r];
  });
  const cage = low.map(([x, y]) => [cx + (x - cx) * 1.2, cy + (y - cy) * 1.2]);
  const rays = [0.5, 1.5, 2.6, 3.7, 4.6, 5.6].map((a) => {
    const from = [cx + Math.cos(a) * 84 * 1.17, cy + Math.sin(a) * 64 * 1.17];
    const to = [cx + Math.cos(a) * 84 * 0.8, cy + Math.sin(a) * 64 * 0.8];
    return [kit.line(from[0], from[1], to[0], to[1], { cls: 'd-mark', width: 1.6 }), kit.arrowhead(to[0], to[1], Math.atan2(to[1] - from[1], to[0] - from[0]), { size: 6, width: 1.6 })];
  });
  return kit.svg({ width: 500, height: 240 },
    `<rect x="14" y="14" width="230" height="164" rx="6" class="d-paper" stroke-width="1.2"/>`,
    kit.text(26, 36, 'Bake', { size: 12 }),
    propRow(kit, 22, 46, 'Bake Type', 'Normal', { width: 214, split: 0.5 }),
    propRow(kit, 22, 74, '', 'Selected to Active', { width: 214, split: 0.06, tick: true }),
    propRow(kit, 22, 100, 'Extrusion', '0.03 m', { width: 214, split: 0.5, mark: true }),
    propRow(kit, 22, 124, 'Max Ray Distance', '0.06 m', { width: 214, split: 0.5, mark: true }),
    `<rect x="66" y="150" width="130" height="22" rx="4" class="d-key-mark" stroke-width="1"/>`,
    kit.text(131, 165, 'Bake', { anchor: 'middle', size: 12, cls: 'd-key-text d-key-text-mark' }),
    kit.polyline(cage, { cls: 'd-guide', width: 1.4, dash: '5 4' }),
    kit.smooth(high, { cls: 'd-guide', width: 2, closed: true }),
    kit.polyline(low, { cls: 'd-ink', width: 2.2 }),
    rays,
    kit.text(cx, 228, 'low poly (solid), sculpt (grey), ray start (dashed)', { anchor: 'middle', size: 11, cls: 'd-label' }),
  );
};
