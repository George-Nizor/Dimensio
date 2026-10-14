// The props from this lesson's exercise file (blender/starters/unwrap-props.py), with their seams
// and UV maps. Not a diagram itself.
import { cube, mesh, edges, normal, centroid } from '../../../diagrams/mesh.mjs';
import { boxUVs } from './uv.mjs';

// The crate's seams: its four upright edges and three of its four top edges, so it opens like a
// cardboard box with its lid still hinged at the back.
export function crate() {
  const m = cube(1);
  const seams = edges(m).filter(({ a, b }) => {
    const p = m.verts[a];
    const q = m.verts[b];
    const upright = p[0] === q[0] && p[1] === q[1];
    const top = p[2] > 0 && q[2] > 0;
    const hinge = top && p[1] > 0 && q[1] > 0;
    return upright || (top && !hinge);
  }).map(({ a, b }) => [a, b]);
  const unfold = { '-z': [0.4, 0.3, 0.2, 0.2], '-y': [0.4, 0.1, 0.2, 0.2], '+y': [0.4, 0.5, 0.2, 0.2], '-x': [0.2, 0.3, 0.2, 0.2], '+x': [0.6, 0.3, 0.2, 0.2], '+z': [0.4, 0.7, 0.2, 0.2] };
  return { mesh: m, seams, uvs: boxUVs(m, unfold) };
}

// The barrel: rings of 12, wider in the middle, with fan ends. Seams down its back and round both
// ends give a strip and two discs; `sideSeam: false` leaves the side closed, and its UVs come out
// as a squashed ring.
export function barrel({ sideSeam = true } = {}) {
  const n = 12;
  const heights = [0, 0.3, 0.6, 0.9, 1.2];
  const radii = [0.4, 0.43, 0.44, 0.43, 0.4];
  const verts = [];
  heights.forEach((z, r) => { for (let i = 0; i < n; i += 1) verts.push([radii[r] * Math.cos((2 * Math.PI * i) / n), radii[r] * Math.sin((2 * Math.PI * i) / n), z]); });
  const at = (r, i) => r * n + (i % n);
  const bottom = verts.push([0, 0, 0]) - 1;
  const top = verts.push([0, 0, 1.2]) - 1;
  const faces = [];
  const uvs = [];
  const strip = 0.9;
  for (let r = 0; r < 4; r += 1) {
    for (let i = 0; i < n; i += 1) {
      faces.push([at(r, i), at(r, i + 1), at(r + 1, i + 1), at(r + 1, i)]);
      if (sideSeam) {
        const u = (k) => 0.05 + (strip * k) / n;
        const v = (k) => 0.3 + 0.08 * k;
        uvs.push([[u(i), v(r)], [u(i + 1), v(r)], [u(i + 1), v(r + 1)], [u(i), v(r + 1)]]);
      } else {
        // No seam down the side: the tube can only lie flat as a ring, small inside, big outside.
        const p = (ring, k) => {
          const rad = 0.08 + 0.09 * ring;
          const a = (2 * Math.PI * k) / n;
          return [0.5 + rad * Math.cos(a), 0.5 + rad * Math.sin(a)];
        };
        uvs.push([p(r, i), p(r, i + 1), p(r + 1, i + 1), p(r + 1, i)]);
      }
    }
  }
  const disc = (k, cu, cv) => [cu + verts[k][0] * 0.32, cv + verts[k][1] * 0.32];
  for (let i = 0; i < n; i += 1) {
    faces.push([at(0, i + 1), at(0, i), bottom]);
    uvs.push(sideSeam ? [at(0, i + 1), at(0, i), bottom].map((k) => disc(k, 0.25, 0.14)) : [[0.5, 0.5], [0.5, 0.5], [0.5, 0.5]]);
    faces.push([at(4, i), at(4, i + 1), top]);
    uvs.push(sideSeam ? [at(4, i), at(4, i + 1), top].map((k) => disc(k, 0.75, 0.82)) : [[0.5, 0.5], [0.5, 0.5], [0.5, 0.5]]);
  }
  const m = mesh(verts, faces);
  const back = (k) => verts[k][1] > 0.3 && Math.abs(verts[k][0]) < 1e-9;
  const seams = edges(m).filter(({ a, b }) => {
    const p = verts[a];
    const q = verts[b];
    const end = (p[2] === 0 && q[2] === 0 || p[2] === 1.2 && q[2] === 1.2) && a !== bottom && b !== bottom && a !== top && b !== top;
    return end || (sideSeam && back(a) && back(b));
  }).map(({ a, b }) => [a, b]);
  return { mesh: m, seams, uvs };
}

// The rock: an 80-face icosphere pushed in and out from a fixed seed and squashed.
export function rock() {
  const t = (1 + Math.sqrt(5)) / 2;
  let verts = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
  let faces = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  const mids = new Map();
  const mid = (a, b) => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (!mids.has(key)) mids.set(key, verts.push(verts[a].map((x, k) => (x + verts[b][k]) / 2)) - 1);
    return mids.get(key);
  };
  faces = faces.flatMap(([a, b, c]) => { const ab = mid(a, b); const bc = mid(b, c); const ca = mid(c, a); return [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]]; });
  let seed = 55;
  const next = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  verts = verts.map((p) => { const l = Math.hypot(...p); const s = (0.5 / l) * (0.85 + 0.3 * next()); return [p[0] * s, p[1] * s, p[2] * s * 0.75]; });
  const m = mesh(verts, faces);
  return { mesh: m, uvs: cubeProject(m) };
}

// Each face projected along the axis it faces most and the six groups set side by side, as Cube
// Projection does; Smart UV Project cuts a rock into similar pieces.
export function cubeProject(m) {
  const cells = { '+x': [0.02, 0.52], '-x': [0.35, 0.52], '+y': [0.68, 0.52], '-y': [0.02, 0.19], '+z': [0.35, 0.19], '-z': [0.68, 0.19] };
  return m.faces.map((f) => {
    const n = normal(m, f);
    const k = n.map(Math.abs).indexOf(Math.max(...n.map(Math.abs)));
    const key = `${n[k] > 0 ? '+' : '-'}${'xyz'[k]}`;
    const [a, b] = [0, 1, 2].filter((x) => x !== k);
    const [u0, v0] = cells[key];
    return f.map((i) => [u0 + 0.15 + m.verts[i][a] * 0.28, v0 + 0.15 + m.verts[i][b] * 0.28]);
  });
}

// Seam edges in Blender's red: solid where the edge is in view, dashed where it is behind.
export function drawSeams(kit, m, v, seams, { width = 2.6 } = {}) {
  const list = edges(m);
  const faceOf = new Map(list.map((e) => [`${e.a}-${e.b}`, e.faces]));
  const facing = (f) => normal(m, m.faces[f]).reduce((s, x, k) => s + x * (v.eye ? v.eye[k] - centroid(m, m.faces[f])[k] : v.toward[k]), 0) > 1e-6;
  return seams.map(([a, b]) => {
    const fs = faceOf.get(a < b ? `${a}-${b}` : `${b}-${a}`) || [];
    const seen = fs.some(facing);
    const p = v.project(m.verts[a]);
    const q = v.project(m.verts[b]);
    return kit.line(p[0], p[1], q[0], q[1], seen ? { cls: 'd-axis-x', width } : { cls: 'd-axis-x', width: width * 0.6, dash: '4 4' });
  });
}
