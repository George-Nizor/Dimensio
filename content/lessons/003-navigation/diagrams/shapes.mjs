// Shapes shared by this lesson's diagrams. Not a diagram itself.
import { box, facesWhere, extrude } from '../../../diagrams/mesh.mjs';

// An L-shaped block: a 2 by 1 by 1 m base with its left half raised another metre, so the front,
// right and top views all look different.
export function lBlock() {
  const base = box({ size: [2, 1, 1], segments: [2, 1, 1], center: [0, 0, 0.5] });
  const left = facesWhere(base, (c, n) => n[2] > 0.9 && c[0] < 0);
  return extrude(base, left, 1).mesh;
}

// A panel: a rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}
