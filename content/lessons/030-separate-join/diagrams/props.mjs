// The exercise's lamp and rocks. Not a diagram itself. The lamp is an 8-sided base, a square pole
// and an 8-sided shade open at both ends; the rocks are icosahedra pushed out of shape, the same
// sizes and places as in the starter scene.
import { mesh, cylinder, box, translate, join, scale, rotate, orientOutward } from '../../../diagrams/mesh.mjs';

export const base = () => cylinder({ vertices: 8, radius: 0.16, depth: 0.04, center: [0, 0, 0.02] });
export const pole = () => box({ size: [0.03, 0.03, 0.4], center: [0, 0, 0.24] });
export function shade() {
  const ring = (z, r) => [...Array(8).keys()].map((i) => [Math.cos(((i + 0.5) * Math.PI) / 4) * r, Math.sin(((i + 0.5) * Math.PI) / 4) * r, z]);
  const verts = [...ring(0.31, 0.2), ...ring(0.53, 0.11)];
  const faces = [...Array(8).keys()].map((i) => [i, (i + 1) % 8, 8 + ((i + 1) % 8), 8 + i]);
  return orientOutward(mesh(verts, faces));
}
export const lamp = () => join(base(), pole());

function icosahedron() {
  const t = (1 + Math.sqrt(5)) / 2;
  const verts = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map((p) => { const l = Math.hypot(...p); return p.map((c) => c / l); });
  const faces = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  return mesh(verts, faces);
}

export const ROCKS = [
  { name: 'Rock 1', at: [1.5, 0, 0], size: [0.42, 0.36, 0.3], turn: 0 },
  { name: 'Rock 2', at: [2.0, 0.25, 0], size: [0.2, 0.18, 0.15], turn: 30 },
  { name: 'Rock 3', at: [1.15, 0.35, 0], size: [0.16, 0.14, 0.12], turn: 75 },
  { name: 'Rock 4', at: [1.75, -0.4, 0], size: [0.22, 0.17, 0.14], turn: 140 },
  { name: 'Rock 5', at: [1.05, -0.3, 0], size: [0.13, 0.12, 0.1], turn: 210 },
];

export function rock({ at, size, turn }) {
  let m = icosahedron();
  m.verts = m.verts.map((p, i) => { const k = 0.85 + (0.3 * ((i * 37 + turn) % 11)) / 10; return p.map((c) => c * k); });
  const low = Math.min(...m.verts.map((p) => p[2]));
  m = translate(m, [0, 0, -low]);
  m = rotate(scale(m, size), 'z', turn);
  return orientOutward(translate(m, at));
}
export const rocks = () => ROCKS.map(rock);
