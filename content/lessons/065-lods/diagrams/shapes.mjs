// Meshes and drawing helpers for this lesson's diagrams. Not a diagram itself.
import { mesh, box, normal, centroid } from '../../../diagrams/mesh.mjs';

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

// An ico sphere with `subdivisions` levels, radius 1 at the origin.
function ico(subdivisions) {
  const t = (1 + Math.sqrt(5)) / 2;
  const verts = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map(unit);
  let faces = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  for (let s = 0; s < subdivisions; s += 1) {
    const cache = new Map();
    const mid = (a, b) => {
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!cache.has(k)) cache.set(k, verts.push(unit([(verts[a][0] + verts[b][0]) / 2, (verts[a][1] + verts[b][1]) / 2, (verts[a][2] + verts[b][2]) / 2])) - 1);
      return cache.get(k);
    };
    faces = faces.flatMap(([a, b, c]) => { const ab = mid(a, b); const bc = mid(b, c); const ca = mid(c, a); return [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]]; });
  }
  return { verts, faces };
}

// A lumpy rock: an ico sphere pushed in and out by a few overlapping waves, stretched, and
// flattened at the base. Fewer subdivisions stand in for a lighter level of detail.
export function rock(subdivisions = 3) {
  const { verts, faces } = ico(subdivisions);
  const bump = ([x, y, z]) => 1 + 0.16 * Math.sin(3.1 * x + 1.3) * Math.cos(2.7 * y + 0.4) + 0.1 * Math.sin(5.3 * z + 2.1 * x) + 0.06 * Math.cos(7.1 * y - 1.9 * z);
  const m = mesh(verts.map((v) => {
    const k = bump(v) * 0.5;
    return [v[0] * k * 1.6, v[1] * k * 1.2, Math.max(v[2] * k, -0.3) + 0.3];
  }), faces);
  m.faces = m.faces.map((f) => (dot(normal(m, f), sub(centroid(m, f), [0, 0, 0.3])) < 0 ? [...f].reverse() : f));
  return m;
}

export const crate = () => box({ size: [0.8, 0.8, 0.8], center: [0, 0, 0.4] });

// Draws a mesh solid, back faces included, so you can see into a mesh with faces missing.
export function drawOpen(kit, m, v, { width = 1.4 } = {}) {
  const l = unit([-0.4, -0.6, 0.7]);
  const order = m.faces.map((f) => ({ f, d: f.reduce((s, j) => s + v.depth(m.verts[j]), 0) / f.length })).sort((a, b) => a.d - b.d);
  const out = [];
  for (const { f } of order) {
    const n = normal(m, f);
    const back = dot(n, v.toward) < 0;
    const lit = dot(back ? n.map((x) => -x) : n, l);
    const tone = back ? 'd-face-3' : lit > 0.45 ? 'd-face-1' : 'd-face-2';
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
