// The torch, tub and domains this lesson's diagrams draw, and simple flame, smoke and water
// shapes. Not a diagram itself. Meshes are real; flames and water are drawn shapes, since a
// simulation's voxels are not a mesh the kit can draw.
import { box, cylinder, join, mesh } from '../../../diagrams/mesh.mjs';

// A torch: a 0.8 m handle with a small cube on top, the cube being the flame's flow object.
export const handle = () => cylinder({ vertices: 8, radius: 0.05, depth: 0.8, center: [0, 0, 0.4] });
export const flowCube = () => box({ size: [0.16, 0.16, 0.16], center: [0, 0, 0.88] });
export const torch = () => join(handle(), flowCube());

// An open tub with walls 0.1 m thick: outer wall, rim, inner wall and floor, each face wound so
// its normal points out of the solid wall.
export function tub(radius = 0.6, depth = 0.5, n = 16) {
  const inner = radius - 0.1;
  const verts = [];
  const ring = (r, z) => { const start = verts.length; for (let i = 0; i < n; i += 1) { const t = (i / n) * Math.PI * 2; verts.push([Math.cos(t) * r, Math.sin(t) * r, z]); } return start; };
  const ob = ring(radius, 0);
  const ot = ring(radius, depth);
  const it = ring(inner, depth);
  const ib = ring(inner, 0.08);
  const faces = [];
  for (let i = 0; i < n; i += 1) {
    const j = (i + 1) % n;
    faces.push([ob + i, ob + j, ot + j, ot + i]);
    faces.push([ot + i, ot + j, it + j, it + i]);
    faces.push([it + i, it + j, ib + j, ib + i]);
  }
  faces.push([...Array(n).keys()].map((i) => ib + i));
  faces.push([...Array(n).keys()].map((i) => ob + n - 1 - i));
  return mesh(verts, faces);
}

// A domain: a box drawn as a wire frame.
export const domain = (size, center) => box({ size, center });

// A flame rising from (x, y), `h` pixels tall: a flickering teardrop.
export function flame(kit, x, y, h, { cls = 'd-mark' } = {}) {
  const w = h * 0.32;
  const d = `M ${x} ${y} C ${x - w * 1.4} ${y - h * 0.3} ${x - w * 0.2} ${y - h * 0.62} ${x - w * 0.5} ${y - h} C ${x + w * 0.1} ${y - h * 0.7} ${x + w * 1.3} ${y - h * 0.55} ${x + w * 0.4} ${y - h * 0.78} C ${x + w * 1.6} ${y - h * 0.4} ${x + w * 1.1} ${y - h * 0.1} ${x} ${y} Z`;
  return `<path d="${d}" class="d-face-sel ${cls}" stroke-width="2" stroke-linejoin="round"/>`;
}

// A puff of smoke: overlapping circles.
export const puff = (kit, x, y, r) => [[0, 0], [r * 0.8, -r * 0.4], [-r * 0.7, -r * 0.5], [r * 0.1, -r * 1]].map(([dx, dy], i) => `<circle cx="${x + dx}" cy="${y + dy}" r="${r * (1 - i * 0.12)}" class="d-face-3 d-guide" stroke-width="1"/>`);
