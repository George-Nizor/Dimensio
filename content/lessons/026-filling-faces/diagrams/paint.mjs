// A solid painter for meshes, for diagrams the kit's drawMesh can't draw: faces filled with a
// class of their own (red back faces, picked-out faces), smooth shading, and only the edges a
// shaded model shows. Not a diagram itself. The same file sits in each lesson that uses it.
import { normal, centroid } from '../../../diagrams/mesh.mjs';

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const unit = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const LIGHT = unit([-0.4, -0.6, 0.7]);
const f2 = (x) => x.toFixed(2);

// Faces that share vertices belong to one part; each part's middle decides which way is out.
function parts(m) {
  const parent = m.verts.map((_, i) => i);
  const find = (i) => { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; };
  for (const f of m.faces) for (let i = 1; i < f.length; i += 1) parent[find(f[i])] = find(f[0]);
  const sums = new Map();
  m.verts.forEach((p, i) => { const r = find(i); const s = sums.get(r) || [0, 0, 0, 0]; sums.set(r, [s[0] + p[0], s[1] + p[1], s[2] + p[2], s[3] + 1]); });
  return m.faces.map((f) => { const s = sums.get(find(f[0])); return [s[0] / s[3], s[1] / s[3], s[2] / s[3]]; });
}

export function edgeMap(m) {
  const map = new Map();
  m.faces.forEach((f, fi) => f.forEach((a, i) => {
    const b = f[(i + 1) % f.length];
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (!map.has(k)) map.set(k, { a: Math.min(a, b), b: Math.max(a, b), faces: [] });
    map.get(k).faces.push(fi);
  }));
  return map;
}

// Draws a mesh shaded. Options:
//   fill(i)     a class to lay over face i ('d-face-sel', 'd-key-bad'), or null
//   fillOpacity opacity of that layer (default 1)
//   smooth(i)   true to shade face i smooth
//   outward     true: a face is seen from whichever side faces the eye, as Blender draws it with
//               Backface Culling off; its stored normal only decides fill(i). false: faces whose
//               normal points away are not drawn, as with Backface Culling on.
//   edges       'all' every edge of a seen face; 'shape' only outline, sharp and flat edges
//   sharp       the angle in degrees above which an edge between smooth faces stays sharp
//   select      { edges: [[a, b]], verts: [i] } drawn on top in the selection colour
//   inside      true to draw faces seen from behind too, dark, as the inside of an open shape
//   rim         a class for the outline of the shape, as Object Mode outlines a selected object
//   light       the direction light comes from (default: front left, above)
export function paint(kit, m, v, {
  fill = () => null, fillOpacity = 1, smooth = () => false, outward = true, edges = 'all', sharp = 30,
  width = 1.8, select = {}, steps = 6, cls = 'd-ink', inside = false, rim = null, light = null,
} = {}) {
  const lightDir = light ? unit(light) : LIGHT;
  const middles = parts(m);
  const stored = m.faces.map((f) => normal(m, f));
  const toEye = (i) => (v.eye ? sub(v.eye, centroid(m, m.faces[i])) : v.toward);
  // Which way is out: away from the middle of the face's part. A flat part, such as a plane, has
  // no inside, so Blender shows whichever side faces you.
  const seenNormal = stored.map((n, i) => {
    if (!outward) return n;
    const away = dot(n, sub(centroid(m, m.faces[i]), middles[i]));
    if (Math.abs(away) < 1e-6) return dot(n, toEye(i)) < 0 ? mul(n, -1) : n;
    return away < 0 ? mul(n, -1) : n;
  });
  const front = m.faces.map((_, i) => dot(seenNormal[i], toEye(i)) > 1e-6);
  const visible = m.faces.map((_, i) => inside || front[i]);
  const backSide = m.faces.map((_, i) => dot(stored[i], toEye(i)) <= 1e-6);
  const map = edgeMap(m);
  const cosSharp = Math.cos((sharp * Math.PI) / 180);
  const smoothEdge = (e) => e.faces.length === 2 && smooth(e.faces[0]) && smooth(e.faces[1]) && dot(seenNormal[e.faces[0]], seenNormal[e.faces[1]]) > cosSharp;

  // A smooth face's corner normal: the faces round that vertex it blends with.
  const around = m.verts.map(() => []);
  m.faces.forEach((f, i) => f.forEach((j) => around[j].push(i)));
  const cornerNormal = (fi, j) => unit(around[j].filter((g) => g === fi || (smooth(g) && dot(seenNormal[g], seenNormal[fi]) > cosSharp)).reduce((s, g) => add(s, seenNormal[g]), [0, 0, 0]));
  const tone = (n) => Math.max(0, Math.min(1, 0.5 + 0.55 * dot(n, lightDir)));
  const shadePath = (pts, n, crisp) => {
    const d = `M ${pts.map(([x, y]) => `${f2(x)} ${f2(y)}`).join(' L ')} Z`;
    const dark = 1 - tone(n);
    return `<path d="${d}" class="d-face-3" fill-opacity="${dark.toFixed(3)}" stroke="none"${crisp ? ' shape-rendering="crispEdges"' : ''}/>`;
  };

  const order = m.faces.map((f, i) => ({ f, i, d: Math.max(...f.map((j) => v.depth(m.verts[j]))) * 0.25 + f.reduce((s, j) => s + v.depth(m.verts[j]), 0) / f.length }))
    .filter(({ i }) => visible[i]).sort((a, b) => a.d - b.d);
  const out = [];
  for (const { f, i } of order) {
    const pts = f.map((j) => v.project(m.verts[j]));
    out.push(`<path d="M ${pts.map(([x, y]) => `${f2(x)} ${f2(y)}`).join(' L ')} Z" class="d-face-1"/>`);
    if (smooth(i) && (f.length === 3 || f.length === 4)) {
      // Smooth shading: split the face into a small grid and shade each cell from blended normals.
      const quad = f.length === 4 ? f : [f[0], f[1], f[2], f[2]];
      const ns = quad.map((j) => cornerNormal(i, j));
      const ps = quad.map((j) => m.verts[j]);
      const at = (u, w, arr) => add(add(mul(arr[0], (1 - u) * (1 - w)), mul(arr[1], u * (1 - w))), add(mul(arr[2], u * w), mul(arr[3], (1 - u) * w)));
      for (let a = 0; a < steps; a += 1) {
        for (let b = 0; b < steps; b += 1) {
          const u0 = a / steps; const u1 = (a + 1) / steps; const w0 = b / steps; const w1 = (b + 1) / steps;
          const cell = [[u0, w0], [u1, w0], [u1, w1], [u0, w1]].map(([u, w]) => v.project(at(u, w, ps)));
          out.push(shadePath(cell, unit(at((u0 + u1) / 2, (w0 + w1) / 2, ns)), true));
        }
      }
    } else {
      out.push(shadePath(pts, front[i] ? seenNormal[i] : [0, 0, -1], false));
    }
    const layer = fill(i, backSide[i]);
    if (layer) out.push(`<path d="M ${pts.map(([x, y]) => `${f2(x)} ${f2(y)}`).join(' L ')} Z" class="${layer}" fill-opacity="${fillOpacity}" stroke="none"/>`);
    f.forEach((a, k) => {
      const b = f[(k + 1) % f.length];
      const e = map.get(a < b ? `${a}-${b}` : `${b}-${a}`);
      const silhouette = e.faces.length < 2 || e.faces.some((g) => !front[g]);
      if (edges === 'shape' && !silhouette && smoothEdge(e)) return;
      if (edges === 'shape' && !silhouette && e.faces.length === 2 && dot(seenNormal[e.faces[0]], seenNormal[e.faces[1]]) > 0.9999) return;
      const p = v.project(m.verts[a]);
      const q = v.project(m.verts[b]);
      const outline = rim && (e.faces.length < 2 || e.faces.some((g) => !front[g]));
      out.push(kit.line(p[0], p[1], q[0], q[1], outline ? { cls: rim, width: width * 1.6 } : { cls, width }));
    });
  }
  for (const [a, b] of select.edges || []) {
    const e = map.get(a < b ? `${a}-${b}` : `${b}-${a}`);
    const hidden = e && !e.faces.some((g) => visible[g]);
    const p = v.project(m.verts[a]);
    const q = v.project(m.verts[b]);
    out.push(kit.line(p[0], p[1], q[0], q[1], hidden ? { cls: 'd-mark', width: width * 0.9, dash: '4 5' } : { cls: 'd-mark', width: width * 1.8 }));
  }
  for (const j of select.verts || []) {
    const [x, y] = v.project(m.verts[j]);
    out.push(kit.dot(x, y, { r: width * 1.9, cls: 'd-mark-fill' }));
  }
  return out;
}

// A rounded frame round one small view, with a label under it, as lesson 3's diagrams use.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}

// An arrow from one panel to the next, with an optional key or label above it.
export function step(kit, x1, y, x2) {
  return [kit.line(x1, y, x2, y, { cls: 'd-mark', width: 2 }), kit.arrowhead(x2, y, 0, { size: 8 })];
}
