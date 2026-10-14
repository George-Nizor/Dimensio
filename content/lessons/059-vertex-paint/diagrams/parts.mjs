// Shapes and drawing helpers shared by this lesson's diagrams. Not a diagram itself.
import { mesh, cylinder, join, translate, scale, normal, centroid } from '../../../diagrams/mesh.mjs';

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

// An ico sphere like Add > Mesh > Ico Sphere: an icosahedron with each triangle split into four,
// `subdivisions` times, pushed out onto the sphere.
export function icoSphere({ subdivisions = 1, radius = 1, center = [0, 0, 0] } = {}) {
  const t = (1 + Math.sqrt(5)) / 2;
  let verts = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map(unit);
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
  const out = mesh(verts.map((v) => [center[0] + v[0] * radius, center[1] + v[1] * radius, center[2] + v[2] * radius]), faces);
  // Turn every face outwards.
  out.faces = out.faces.map((f) => (dot(normal(out, f), sub(centroid(out, f), center)) < 0 ? [...f].reverse() : f));
  return out;
}

// The exercise's tree: a six-sided trunk and two canopy parts, all one mesh. `part(i)` says
// which part face i belongs to: 'trunk', 'low' or 'top'.
export function tree() {
  const trunk = cylinder({ vertices: 6, radius: 0.11, depth: 1.3, center: [0, 0, 0.65], caps: 'ngon' });
  const low = scale(icoSphere({ subdivisions: 1, radius: 0.7 }), [1, 1, 0.85]);
  const top = icoSphere({ subdivisions: 1, radius: 0.45 });
  const m = join(trunk, translate(low, [0, 0, 1.55]), translate(top, [0.05, -0.03, 2.15]));
  const counts = [trunk.faces.length, low.faces.length];
  const part = (i) => (i < counts[0] ? 'trunk' : i < counts[0] + counts[1] ? 'low' : 'top');
  return { mesh: m, part };
}

// Draws a mesh solid, like drawMesh, but each face takes the class `paint(i)` returns, or the
// usual lit tone when it returns nothing. Used for faces filled with a vertex colour.
export function drawPainted(kit, m, v, paint, { width = 1.6, light = [-0.4, -0.6, 0.7] } = {}) {
  const l = unit(light);
  const facing = (f) => dot(normal(m, f), v.eye ? sub(v.eye, centroid(m, f)) : v.toward) > 1e-6;
  const order = m.faces.map((f, i) => ({ f, i, d: Math.max(...f.map((j) => v.depth(m.verts[j]))) * 0.25 + f.reduce((s, j) => s + v.depth(m.verts[j]), 0) / f.length }))
    .filter(({ f }) => facing(f))
    .sort((a, b) => a.d - b.d);
  const out = [];
  for (const { f, i } of order) {
    const lit = dot(normal(m, f), l);
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
