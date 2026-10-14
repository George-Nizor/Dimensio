// Small schematics of .blend files and their contents, for the linking and asset lessons. Not a
// diagram itself.
import { box } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

// A file card: a folded corner, the file name, and a list of what it holds.
export function fileCard(kit, x, y, name, items = [], { w = 150, mark = [] } = {}) {
  const h = 34 + items.length * 20;
  const out = [
    kit.path(`M ${x} ${y} H ${x + w - 14} L ${x + w} ${y + 14} V ${y + h} H ${x} Z`, { cls: 'd-ink', width: 1.4 }),
    `<path d="M ${x} ${y} H ${x + w - 14} L ${x + w} ${y + 14} V ${y + h} H ${x} Z" class="d-paper"/>`,
    kit.path(`M ${x} ${y} H ${x + w - 14} L ${x + w} ${y + 14} V ${y + h} H ${x} Z`, { cls: 'd-ink', width: 1.4 }),
    kit.path(`M ${x + w - 14} ${y} V ${y + 14} H ${x + w}`, { cls: 'd-ink', width: 1.2 }),
    kit.text(x + 10, y + 20, name, { size: 12, cls: 'd-key-text' }),
  ];
  items.forEach((item, i) => {
    const iy = y + 30 + i * 20;
    if (mark.includes(item)) out.push(box(x + 6, iy, w - 12, 18, { cls: 'd-ui-mark', rx: 3 }));
    out.push(kit.text(x + 14, iy + 13, item, { size: 11 }));
  });
  return { svg: out, h, right: [x + w, y + h / 2], left: [x, y + h / 2] };
}

// The chain icon Blender shows beside linked data.
export function chain(kit, x, y, { cls = 'd-ink' } = {}) {
  return [
    `<rect x="${x - 7}" y="${y - 3.5}" width="9" height="7" rx="3.5" class="${cls}" fill="none" stroke-width="1.5"/>`,
    `<rect x="${x - 2}" y="${y - 3.5}" width="9" height="7" rx="3.5" class="${cls}" fill="none" stroke-width="1.5"/>`,
  ];
}
