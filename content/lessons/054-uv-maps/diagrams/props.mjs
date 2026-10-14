// The three props from this lesson's exercise file (blender/starters/uv-three-props.py), with the
// same faces and UVs. Not a diagram itself. A metre is a quarter of the image on every prop.
import { cube, mesh } from '../../../diagrams/mesh.mjs';
import { boxUVs, CROSS } from './uv.mjs';

const UNIT = 0.25;

// Prop 1: a 1 m cube in a cross layout.
export function crate() {
  const m = cube(1);
  return { mesh: m, uvs: boxUVs(m, CROSS) };
}

// Prop 2: a 12-sided barrel. With `bad` its ends are projected from the front and lie flat as
// lines; without it they are discs, as an unwrap with seams gives.
export function barrel({ bad = true } = {}) {
  const n = 12;
  const r = 0.4;
  const h = 1;
  const verts = [];
  for (const z of [0, h]) for (let i = 0; i < n; i += 1) verts.push([r * Math.cos((2 * Math.PI * i) / n), r * Math.sin((2 * Math.PI * i) / n), z]);
  const bc = verts.push([0, 0, 0]) - 1;
  const tc = verts.push([0, 0, h]) - 1;
  const faces = [];
  const uvs = [];
  const side = 2 * r * Math.sin(Math.PI / n);
  const start = (1 - n * side * UNIT) / 2;
  for (let i = 0; i < n; i += 1) {
    const j = (i + 1) % n;
    faces.push([i, j, n + j, n + i]);
    const u0 = start + i * side * UNIT;
    const u1 = start + (i + 1) * side * UNIT;
    uvs.push([[u0, 0.4], [u1, 0.4], [u1, 0.4 + h * UNIT], [u0, 0.4 + h * UNIT]]);
  }
  const front = (p, v) => [0.375 + (p[0] + r) * UNIT, v];
  const disc = (p, cu, cv) => [cu + p[0] * UNIT, cv + p[1] * UNIT];
  for (let i = 0; i < n; i += 1) {
    const j = (i + 1) % n;
    faces.push([j, i, bc]);
    uvs.push([j, i, bc].map((k) => (bad ? front(verts[k], 0.2) : disc(verts[k], 0.3, 0.17))));
    faces.push([n + i, n + j, tc]);
    uvs.push([n + i, n + j, tc].map((k) => (bad ? front(verts[k], 0.8) : disc(verts[k], 0.7, 0.83))));
  }
  return { mesh: mesh(verts, faces), uvs };
}

// Prop 3: a ramp 1 m wide and deep, 1.5 m tall at the back. Its slope was projected from above,
// so its UVs are too short along the slope.
export function ramp() {
  const verts = [[-0.5, -0.5, 0], [0.5, -0.5, 0], [0.5, 0.5, 0], [-0.5, 0.5, 0], [-0.5, 0.5, 1.5], [0.5, 0.5, 1.5]];
  const faces = [[0, 3, 2, 1], [3, 4, 5, 2], [0, 1, 5, 4], [0, 4, 3], [1, 2, 5]];
  const U = UNIT;
  const uvs = [
    [[0.05, 0.05], [0.05, 0.05 + U], [0.05 + U, 0.05 + U], [0.05 + U, 0.05]],
    [[0.35 + U, 0.05], [0.35 + U, 0.05 + 1.5 * U], [0.35, 0.05 + 1.5 * U], [0.35, 0.05]],
    [[0.65, 0.05], [0.65 + U, 0.05], [0.65 + U, 0.05 + U], [0.65, 0.05 + U]],
    [[0.05, 0.55], [0.05 + U, 0.55 + 1.5 * U], [0.05 + U, 0.55]],
    [[0.35, 0.55], [0.35 + U, 0.55], [0.35 + U, 0.55 + 1.5 * U]],
  ];
  return { mesh: mesh(verts, faces), uvs, slope: 2 };
}
