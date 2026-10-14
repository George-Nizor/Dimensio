// The Snap pie that Shift+S opens, laid out as Blender lays it out, with Selection to Cursor,
// Cursor to Selected and Cursor to World Origin picked out.
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const items = [
    ['Cursor to Grid', -1, 0], ['Selection to Grid', 1, 0], ['Cursor to Selected', 0, 1], ['Selection to Cursor', 0, -1],
    ['Selection to Cursor (Keep Offset)', -0.72, -0.62], ['Selection to Active', 0.72, -0.62], ['Cursor to World Origin', -0.72, 0.62], ['Cursor to Active', 0.72, 0.62],
  ];
  const marks = ['Selection to Cursor', 'Cursor to Selected', 'Cursor to World Origin'];
  const cx = 310;
  const cy = 150;
  const out = [kit.circle(cx, cy, 14, { cls: 'd-guide', width: 5 }), kit.dot(cx, cy, { r: 2.5, cls: 'd-mark-fill' }), keycap(kit, 46, 30, 'Shift+S', { size: 11 })];
  for (const [label, dx, dy] of items) {
    const x = cx + dx * 200;
    const y = cy + dy * 118;
    const w = label.length * 6.2 + 20;
    out.push(`<rect x="${(x - w / 2).toFixed(1)}" y="${y - 12}" width="${w.toFixed(1)}" height="24" rx="12" class="${marks.includes(label) ? 'd-ui-mark' : 'd-paper'}" stroke-width="1.2"/>`);
    out.push(kit.text(x, y + 4, label, { anchor: 'middle', size: 11 }));
  }
  return kit.svg({ width: 620, height: 300 }, out);
};
