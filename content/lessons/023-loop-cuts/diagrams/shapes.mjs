// Boxes with loops where this lesson's diagrams need them, and a preview line drawn the way the
// loop cut shows it before the click. Not a diagram itself.
import { normal, centroid } from '../../../diagrams/mesh.mjs';
import { cutBox, extrudeNormals, allEdges } from './helpers.mjs';

// The edges of the loops that run round a box at heights `zs`.
export const loopsAt = (m, zs) => allEdges(m).filter(([a, b]) => zs.some((z) => Math.abs(m.verts[a][2] - z) < 1e-6 && Math.abs(m.verts[b][2] - z) < 1e-6));

// The exercise's planks: the default cube with loops at the thirds and one 10 cm under each, and
// both strips pushed in 5 cm along their normals.
export function planks() {
  const lines = [-1 / 3, 1 / 3];
  const m = cutBox({ cuts: { z: [lines[0] - 0.1, lines[0], lines[1] - 0.1, lines[1]] } });
  const strips = m.faces.map((f, i) => [f, i]).filter(([f]) => {
    const c = centroid(m, f);
    const n = normal(m, f);
    return Math.abs(n[2]) < 0.1 && lines.some((z) => c[2] < z && c[2] > z - 0.1);
  }).map(([, i]) => i);
  return extrudeNormals(m, strips, -0.05);
}

// A preview loop at height z round a box of half-size h, drawn dashed on the sides that face the
// view and left out behind.
export function previewLoop(kit, v, z, { h = 1, axis = 'z' } = {}) {
  const corners = axis === 'z'
    ? [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]]
    : [[z, -h, -h], [z, -h, h], [z, h, h], [z, h, -h]];
  const out = [];
  for (let i = 0; i < 4; i += 1) {
    const a = corners[i];
    const b = corners[(i + 1) % 4];
    const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
    const facing = mid[0] * v.toward[0] + mid[1] * v.toward[1] + mid[2] * v.toward[2] > 0;
    if (!facing) continue;
    const p = v.project(a);
    const q = v.project(b);
    out.push(kit.line(p[0], p[1], q[0], q[1], { cls: 'd-mark', width: 2.4, dash: '6 4' }));
  }
  return out;
}
