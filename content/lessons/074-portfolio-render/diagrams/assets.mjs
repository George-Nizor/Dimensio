// Shared by this lesson's diagrams: simple stand-ins for the course's game assets (a crate, a barrel,
// a sword, a chest, a table and a chair) arranged on a floor, and the popover schematics. Not a
// diagram itself.
import { cube, box, cylinder, plane, translate, rotate, join, view, drawMesh } from '../../../diagrams/mesh.mjs';

const legs = (w, d, h, t) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => box({ size: [t, t, h], center: [a * (w / 2 - t / 2), b * (d / 2 - t / 2), h / 2] }));

export function crate() { return translate(cube(0.6), [0, 0, 0.3]); }
export function barrel() { return translate(cylinder({ vertices: 12, radius: 0.28, depth: 0.8 }), [0, 0, 0.4]); }
export function chest() { return join(box({ size: [0.8, 0.5, 0.35], center: [0, 0, 0.175] }), translate(rotate(cylinder({ vertices: 8, radius: 0.25, depth: 0.8 }), 'y', 90), [0, 0, 0.35])); }
export function table() { return join(box({ size: [1.2, 0.7, 0.06], center: [0, 0, 0.72] }), ...legs(1.1, 0.6, 0.69, 0.07)); }
export function chair() { return join(box({ size: [0.45, 0.45, 0.05], center: [0, 0, 0.45] }), ...legs(0.42, 0.42, 0.43, 0.05), box({ size: [0.45, 0.05, 0.5], center: [0, 0.2, 0.72] })); }
export function sword() { return translate(rotate(join(box({ size: [0.07, 0.015, 0.75], center: [0, 0, 0.5] }), box({ size: [0.24, 0.04, 0.04], center: [0, 0, 0.11] }), box({ size: [0.035, 0.035, 0.14], center: [0, 0, 0.03] })), 'y', -15), [0, 0, 0]); }

// The six assets in a loose group on the floor, as an arranged portfolio scene: one mesh each.
export function assets() {
  return [
    translate(rotate(table(), 'z', -10), [0.1, 0.5, 0]),
    translate(rotate(chair(), 'z', 25), [-0.95, 0.5, 0]),
    translate(rotate(crate(), 'z', 15), [1.15, -0.1, 0]),
    translate(barrel(), [-1.05, -0.45, 0]),
    translate(rotate(chest(), 'z', -20), [0.05, -0.55, 0]),
    translate(sword(), [0.6, -0.95, 0.02]),
  ];
}
export function group() { return join(...assets()); }

// Draws meshes one at a time from the furthest to the nearest, so one never shows through another.
export function drawAll(kit, meshes, v, options = {}) {
  const middle = (m) => m.verts.reduce((s, p) => s + v.depth(p), 0) / m.verts.length;
  return [...meshes].sort((a, b) => middle(a) - middle(b)).map((m) => drawMesh(kit, m, v, typeof options === 'function' ? options(m) : options));
}

export function floor() { return plane({ size: [4.4, 3.2] }); }

// The view the diagrams look at the group from.
export const shotView = (at, scale, distance = 9) => view({ azimuth: 28, elevation: 24, target: [0, 0, 0.4], at, scale, distance });

// A popover: a box with a title and rows of [label, value] or [label, true/false] for a checkbox.
// `mark` lists the labels to pick out.
export function popover(kit, x, y, w, title, rows, { mark = [] } = {}) {
  const out = [
    `<rect x="${x}" y="${y}" width="${w}" height="${34 + rows.length * 24}" rx="6" class="d-paper" stroke-width="1.2"/>`,
    kit.text(x + 12, y + 22, title, { size: 12 }),
  ];
  rows.forEach(([label, value], i) => {
    const ry = y + 32 + i * 24;
    if (mark.includes(label)) out.push(`<rect x="${x + 6}" y="${ry}" width="${w - 12}" height="22" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    if (typeof value === 'boolean') {
      out.push(`<rect x="${x + 14}" y="${ry + 4}" width="14" height="14" rx="3" class="d-paper" stroke-width="1.2"/>`);
      if (value) out.push(kit.path(`M ${x + 17} ${ry + 11} L ${x + 20} ${ry + 14} L ${x + 25} ${ry + 7}`, { cls: 'd-ink', width: 2 }));
      out.push(kit.text(x + 36, ry + 16, label, { size: 11 }));
    } else {
      out.push(kit.text(x + w * 0.42, ry + 16, label, { anchor: 'end', size: 11 }));
      out.push(`<rect x="${x + w * 0.46}" y="${ry + 2}" width="${w * 0.48}" height="18" rx="3" class="d-key" stroke-width="1.2"/>`);
      out.push(kit.text(x + w * 0.7, ry + 15, value, { anchor: 'middle', size: 11, cls: 'd-key-text' }));
    }
  });
  return out;
}

// The arranged group drawn inside a 16:9 frame at (x, y), `w` wide. `wire` adds every edge on
// top, as the Wireframe overlay does; `grid` adds the floor grid and axes a viewport render picks up.
export function shot(kit, x, y, w, { wire = false, grid = false, tint = false, clip } = {}) {
  const h = (w * 9) / 16;
  const v = shotView([x + w / 2, y + h * 0.56], w / 3.4);
  const out = [`<rect x="${x}" y="${y}" width="${w}" height="${h.toFixed(1)}" class="d-sunk" stroke-width="1"/>`];
  const inner = [];
  if (grid) {
    for (let k = -6; k <= 6; k += 1) {
      const a = v.project([k * 0.5, -3, 0]); const b = v.project([k * 0.5, 3, 0]);
      const c = v.project([-3, k * 0.5, 0]); const d = v.project([3, k * 0.5, 0]);
      inner.push(kit.line(a[0], a[1], b[0], b[1], { cls: 'd-guide', width: 0.8 }), kit.line(c[0], c[1], d[0], d[1], { cls: 'd-guide', width: 0.8 }));
    }
    const ax = [v.project([-3, 0, 0]), v.project([3, 0, 0])];
    const ay = [v.project([0, -3, 0]), v.project([0, 3, 0])];
    inner.push(kit.line(ax[0][0], ax[0][1], ax[1][0], ax[1][1], { cls: 'd-axis-x', width: 1.4 }), kit.line(ay[0][0], ay[0][1], ay[1][0], ay[1][1], { cls: 'd-axis-y', width: 1.4 }));
  } else {
    const corners = floor().verts.map((p) => v.project(p));
    const ring = [corners[0], corners[1], corners[3], corners[2]];
    inner.push(`<path d="M ${ring.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(' L ')} Z" class="d-face-3"/>`);
  }
  const list = assets();
  // Clay shows shape by shading alone; the wireframe adds every edge; colour tints some assets.
  inner.push(drawAll(kit, list, v, (m) => ({
    width: wire ? 1 : tint ? 0.8 : 0.7,
    cls: wire || tint ? 'd-ink' : 'd-guide',
    select: tint && [0, 2, 4].includes(list.indexOf(m)) ? { faces: m.faces.map((_, i) => i) } : {},
  })));
  if (grid) {
    const [cx, cy] = v.project([0, 0, 0]);
    inner.push(kit.circle(cx, cy, 6, { cls: 'd-bad', width: 1.6, dash: '3 3' }));
  }
  const id = clip || `portfolio-${x}-${y}`;
  out.push(`<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h.toFixed(1)}"/></clipPath>`, `<g clip-path="url(#${id})">`, inner, '</g>');
  return out;
}
