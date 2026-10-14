// Meshes for this lesson's diagrams. Not a diagram itself.
import { mesh, box, cylinder, normal, centroid } from '../../../diagrams/mesh.mjs';

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export const crate = () => box({ size: [0.8, 0.8, 0.8], center: [0, 0, 0.4] });
export const crateCollision = () => box({ size: [0.84, 0.84, 0.82], center: [0, 0, 0.41] });

// A 12-sided barrel 0.9 m tall, wider in the middle.
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
  faces.push([...Array(segments).keys()].reverse(), [...Array(segments).keys()].map((i) => (profile.length - 1) * segments + i));
  const m = mesh(verts, faces);
  m.faces = m.faces.map((f) => (dot(normal(m, f), sub(centroid(m, f), [0, 0, 0.45])) < 0 ? [...f].reverse() : f));
  return m;
}

// The barrel's collision: a cylinder with 8 vertices around it.
export const barrelCollision = () => cylinder({ vertices: 8, radius: 0.35, depth: 0.92, center: [0, 0, 0.46] });

// A rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}
