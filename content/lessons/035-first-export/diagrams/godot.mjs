// Pieces for this lesson's Godot pictures. Not a diagram itself. Godot works in metres with a grid
// of 1 m squares; the crate is the lesson 27 crate, 0.5 m across.
import { translate, uvSphere } from '../../../diagrams/mesh.mjs';
import { crate } from './crate.mjs';
import { paint } from './paint.mjs';

// The ground grid, `size` metres a side, centred on the origin.
export function grid(kit, v, size = 4) {
  const out = [];
  for (let k = -size / 2; k <= size / 2; k += 1) {
    const a = v.project([k, -size / 2, 0]); const b = v.project([k, size / 2, 0]);
    const c = v.project([-size / 2, k, 0]); const d = v.project([size / 2, k, 0]);
    out.push(kit.line(a[0], a[1], b[0], b[1], { cls: 'd-guide', width: 1 }), kit.line(c[0], c[1], d[0], d[1], { cls: 'd-guide', width: 1 }));
  }
  return out;
}

export const crateAt = (x, y = 0) => translate(crate('done').mesh, [x, y, 0]);
export const drawCrate = (kit, v, x, y = 0, width = 1) => paint(kit, crateAt(x, y), v, { outward: false, width });
export const ball = (x, y = 0) => uvSphere({ segments: 12, rings: 6, radius: 0.3, center: [x, y, 0.3] });

// A dock: a titled box.
export function dock(kit, x, y, w, h, title, mark = false) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" class="${mark ? 'd-ui-mark' : 'd-ui'}" stroke-width="1"/>`,
    kit.text(x + 8, y + 15, title, { size: 11 }),
  ];
}
export function row(kit, x, y, w, label, { mark = false, indent = 0 } = {}) {
  return [
    `<rect x="${x + 4 + indent}" y="${y}" width="${w - 8 - indent}" height="17" rx="3" class="${mark ? 'd-ui-mark' : 'd-ui'}" stroke-width="0.8"/>`,
    kit.text(x + 10 + indent, y + 12.5, label, { size: 10.5 }),
  ];
}
