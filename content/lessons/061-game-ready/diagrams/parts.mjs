// Shapes and helpers shared by this lesson's diagrams. Not a diagram itself.
import { mesh, box, join, translate, normal, centroid } from '../../../diagrams/mesh.mjs';

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const slab = (x0, y0, z0, x1, y1, z1) => box({ size: [x1 - x0, y1 - y0, z1 - z0], center: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2] });

// A 1 m crate standing on the ground, its origin at the base centre.
export const crate = () => box({ size: [1, 1, 1], center: [0, 0, 0.5] });

// A 12-sided barrel 0.9 m tall, wider in the middle, with fan caps, standing on the ground.
export function barrel() {
  const segments = 12;
  const profile = [[0.26, 0], [0.30, 0.25], [0.32, 0.45], [0.30, 0.65], [0.26, 0.9]];
  const verts = [];
  profile.forEach(([r, z]) => { for (let i = 0; i < segments; i += 1) { const t = (i / segments) * Math.PI * 2; verts.push([Math.cos(t) * r, Math.sin(t) * r, z]); } });
  const faces = [];
  for (let k = 0; k < profile.length - 1; k += 1) {
    for (let i = 0; i < segments; i += 1) {
      const j = (i + 1) % segments;
      faces.push([k * segments + i, k * segments + j, (k + 1) * segments + j, (k + 1) * segments + i]);
    }
  }
  const bottom = verts.push([0, 0, 0]) - 1;
  const top = verts.push([0, 0, 0.9]) - 1;
  const last = (profile.length - 1) * segments;
  for (let i = 0; i < segments; i += 1) {
    const j = (i + 1) % segments;
    faces.push([j, i, bottom], [last + i, last + j, top]);
  }
  const m = mesh(verts, faces);
  m.faces = m.faces.map((f) => (dot(normal(m, f), sub(centroid(m, f), [0, 0, 0.45])) < 0 ? [...f].reverse() : f));
  return m;
}

// A chair whose open front faces -Y (its back is on the +Y side), standing on the ground.
export function chair() {
  const parts = [slab(-0.225, -0.225, 0.40, 0.225, 0.225, 0.45)];
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) parts.push(slab(sx * 0.19 - 0.025, sy * 0.19 - 0.025, 0, sx * 0.19 + 0.025, sy * 0.19 + 0.025, 0.40));
    parts.push(slab(sx * 0.19 - 0.025, 0.165, 0.45, sx * 0.19 + 0.025, 0.215, 0.9));
  }
  parts.push(slab(-0.165, 0.17, 0.72, 0.165, 0.21, 0.86));
  return join(...parts);
}

// Turns a mesh inside out, as flipping every normal does.
export const insideOut = (m) => ({ verts: m.verts, faces: m.faces.map((f) => [...f].reverse()) });

export { translate };

// A rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}

// An object's origin: the small dot Blender draws, in the selection colour.
export const origin = (kit, x, y) => [kit.dot(x, y, { r: 5, cls: 'd-mark-fill' }), kit.circle(x, y, 5, { cls: 'd-ink', width: 1.2 })];

// Draws a mesh with Face Orientation on: faces whose front is towards you blue, backs red.
export function drawFacing(kit, m, v, { width = 1.4 } = {}) {
  const eyeDir = v.toward;
  const order = m.faces.map((f, i) => ({ f, i, d: f.reduce((s, j) => s + v.depth(m.verts[j]), 0) / f.length })).sort((a, b) => a.d - b.d);
  const out = [];
  for (const { f } of order) {
    const front = dot(normal(m, f), eyeDir) > 0;
    const pts = f.map((j) => v.project(m.verts[j]));
    out.push(`<path d="M ${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ')} Z" class="${front ? 'd-gizmo-z' : 'd-gizmo-x'}" stroke-width="0"/>`);
    out.push(kit.polyline([...pts, pts[0]], { cls: 'd-ink', width }));
  }
  return out;
}
