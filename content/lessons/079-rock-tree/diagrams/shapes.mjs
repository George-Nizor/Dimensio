// Shared by this lesson's diagrams: an ico sphere like Add > Mesh > Ico Sphere, lumps pushed into
// it the way the Displace modifier does, and the finished low-poly rock and tree. Not a diagram
// itself.
import { cylinder, transform, translate, scale, join } from '../../../diagrams/mesh.mjs';

const unit = (p) => { const l = Math.hypot(...p) || 1; return [p[0] / l, p[1] / l, p[2] / l]; };

// Subdivisions 1 is the 20-sided icosahedron; each step splits every triangle in four.
export function icoSphere(subdivisions = 2) {
  const t = (1 + Math.sqrt(5)) / 2;
  let verts = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map(unit);
  let faces = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  for (let s = 1; s < subdivisions; s += 1) {
    const mid = new Map();
    const middle = (a, b) => {
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!mid.has(k)) mid.set(k, verts.push(unit(verts[a].map((v, i) => (v + verts[b][i]) / 2))) - 1);
      return mid.get(k);
    };
    faces = faces.flatMap(([a, b, c]) => { const ab = middle(a, b); const bc = middle(b, c); const ca = middle(c, a); return [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]]; });
  }
  return { verts, faces };
}

// Pushes each vertex in or out along its direction by a seeded amount, as Displace with a Clouds
// texture does.
export function displace(m, strength = 0.2, seed = 5) {
  let s = seed;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const amounts = m.verts.map(() => (rnd() - 0.5) * 2 * strength);
  return { verts: m.verts.map((p, i) => { const n = unit(p); const r = Math.hypot(...p) + amounts[i]; return [n[0] * r, n[1] * r, n[2] * r]; }), faces: m.faces.map((f) => [...f]) };
}

// The finished rock: a squashed, roughened ico sphere sitting on the ground.
export function rock() { return translate(scale(displace(icoSphere(2), 0.16, 3), [0.42, 0.36, 0.26]), [0, 0, 0.24]); }

// The finished tree: a six-sided trunk, narrower at the top, and lumpy leaves above it.
export function trunk() {
  return transform(cylinder({ vertices: 6, radius: 0.08, depth: 0.8, center: [0, 0, 0.4] }), ([x, y, z]) => (z > 0.5 ? [x * 0.6, y * 0.6, z] : [x, y, z]));
}
export function leaves() { return translate(scale(displace(icoSphere(2), 0.14, 9), [0.45, 0.45, 0.58]), [0, 0, 1.15]); }
export function tree() { return join(trunk(), leaves()); }
