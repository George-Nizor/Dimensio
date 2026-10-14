// Light icons and the exercise's props for this lesson's diagrams. Not a diagram itself.
import { box, mesh, normal, centroid } from '../../../diagrams/mesh.mjs';

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export const crate = () => box({ size: [0.7, 0.7, 0.7], center: [0, 0, 0.35] });

// A 16-sided barrel 0.85 m tall, wider in the middle.
export function barrel() {
  const segments = 16;
  const profile = [[0.27, 0], [0.31, 0.2], [0.33, 0.425], [0.31, 0.65], [0.27, 0.85]];
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
  m.faces = m.faces.map((f) => (dot(normal(m, f), sub(centroid(m, f), [0, 0, 0.42])) < 0 ? [...f].reverse() : f));
  return m;
}

// A point light: a dot with rays all round.
export function point(kit, x, y, { r = 7, cls = 'd-mark' } = {}) {
  const out = [kit.circle(x, y, r, { cls, width: 1.8 })];
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    out.push(kit.line(x + Math.cos(a) * (r + 3), y + Math.sin(a) * (r + 3), x + Math.cos(a) * (r + 9), y + Math.sin(a) * (r + 9), { cls, width: 1.6 }));
  }
  return out;
}

// An area light seen edge on from above: a short bar with a line showing which way it faces.
export function area(kit, x, y, angle, { size = 26, cls = 'd-mark' } = {}) {
  const dx = Math.cos(angle + Math.PI / 2) * size / 2;
  const dy = Math.sin(angle + Math.PI / 2) * size / 2;
  return [
    kit.line(x - dx, y - dy, x + dx, y + dy, { cls, width: 4 }),
    kit.line(x, y, x + Math.cos(angle) * 30, y + Math.sin(angle) * 30, { cls, width: 1.4, dash: '4 4' }),
    kit.arrowhead(x + Math.cos(angle) * 30, y + Math.sin(angle) * 30, angle, { cls, size: 7 }),
  ];
}

// A camera seen from above: a small box with its lens cone.
export function camera(kit, x, y, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const p = (u, v) => [x + u * c - v * s, y + u * s + v * c];
  return [
    kit.polyline([p(-10, -8), p(6, -8), p(6, 8), p(-10, 8), p(-10, -8)], { cls: 'd-ink', width: 1.6 }),
    kit.polyline([p(6, -4), p(16, -10), p(16, 10), p(6, 4)], { cls: 'd-ink', width: 1.6 }),
  ];
}

// A rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}
