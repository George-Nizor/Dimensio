// Meshes for this lesson's diagrams, matching the exercise's three props. Not a diagram itself.
import { mesh, box, join, translate, normal, centroid } from '../../../diagrams/mesh.mjs';

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

// The sign: a post and a board. `isBoard(i)` says whether face i belongs to the board.
export function sign() {
  const post = box({ size: [0.08, 0.08, 1.2], center: [0, 0, 0.6] });
  const board = box({ size: [0.8, 0.05, 0.4], center: [0, -0.05, 1.05] });
  return { mesh: join(post, board), isBoard: (i) => i >= post.faces.length };
}

export const crate = () => box({ size: [0.8, 0.8, 0.8], center: [0, 0, 0.4] });

// An ico sphere bush, one subdivision, 0.9 m across.
export function bush() {
  const t = (1 + Math.sqrt(5)) / 2;
  let verts = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map(unit);
  let faces = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  const cache = new Map();
  const mid = (a, b) => {
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (!cache.has(k)) cache.set(k, verts.push(unit([(verts[a][0] + verts[b][0]) / 2, (verts[a][1] + verts[b][1]) / 2, (verts[a][2] + verts[b][2]) / 2])) - 1);
    return cache.get(k);
  };
  faces = faces.flatMap(([a, b, c]) => { const ab = mid(a, b); const bc = mid(b, c); const ca = mid(c, a); return [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]]; });
  const m = mesh(verts.map((v) => [v[0] * 0.45, v[1] * 0.45, v[2] * 0.45 + 0.45]), faces);
  m.faces = m.faces.map((f) => (dot(normal(m, f), sub(centroid(m, f), [0, 0, 0.45])) < 0 ? [...f].reverse() : f));
  return m;
}

export { translate };

// Draws a mesh solid with a class per face from `paint(i)`, or the lit tone when it returns
// nothing. `cull` false draws back faces too, the way a double-sided material does.
export function drawPainted(kit, m, v, paint, { width = 1.4, cull = true } = {}) {
  const l = unit([-0.4, -0.6, 0.7]);
  const order = m.faces.map((f, i) => ({ f, i, d: Math.max(...f.map((j) => v.depth(m.verts[j]))) * 0.25 + f.reduce((s, j) => s + v.depth(m.verts[j]), 0) / f.length }))
    .filter(({ f }) => !cull || dot(normal(m, f), v.toward) > 1e-6)
    .sort((a, b) => a.d - b.d);
  const out = [];
  for (const { f, i } of order) {
    const n = normal(m, f);
    const lit = dot(dot(n, v.toward) > 0 ? n : n.map((x) => -x), l);
    const tone = paint(i) || (lit > 0.45 ? 'd-face-1' : lit > -0.1 ? 'd-face-2' : 'd-face-3');
    const pts = f.map((j) => v.project(m.verts[j]));
    out.push(`<path d="M ${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ')} Z" class="${tone}" stroke-width="0"/>`);
    out.push(kit.polyline([...pts, pts[0]], { cls: 'd-ink', width }));
  }
  return out;
}

// A rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}
