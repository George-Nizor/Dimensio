// Props, node boxes and helpers for this lesson's diagrams. Not a diagram itself.
import { box, mesh, normal, centroid } from '../../../diagrams/mesh.mjs';

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export const crate = () => box({ size: [0.7, 0.7, 0.7], center: [0, 0, 0.35] });

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

// A shader node: a box with a title strip, `inputs` on the left and `outputs` on the right, each a
// name. `mark` lists socket names to pick out. Returns the SVG and where each socket is.
export function node(kit, x, y, w, title, { inputs = [], outputs = [], fields = [], mark = [] } = {}) {
  const rows = Math.max(inputs.length + fields.length, 1) + outputs.length;
  const h = 34 + rows * 20;
  const out = [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-paper" stroke-width="1.4"/>`,
    `<rect x="${x}" y="${y}" width="${w}" height="24" rx="6" class="d-sunk" stroke-width="1"/>`,
    kit.text(x + 8, y + 16, title, { size: 11 }),
  ];
  const at = {};
  outputs.forEach((name, i) => {
    const sy = y + 40 + i * 20;
    out.push(kit.text(x + w - 12, sy + 4, name, { size: 10, anchor: 'end' }), kit.dot(x + w, sy, { r: 4.5, cls: mark.includes(name) ? 'd-mark-fill' : 'd-dot' }));
    at[`out:${name}`] = [x + w, sy];
  });
  fields.forEach((text, i) => {
    const sy = y + 40 + (outputs.length + i) * 20;
    out.push(`<rect x="${x + 8}" y="${sy - 9}" width="${w - 16}" height="16" rx="3" class="${mark.includes(text) ? 'd-ui-mark' : 'd-ui'}" stroke-width="1"/>`, kit.text(x + 14, sy + 3, text, { size: 10 }));
  });
  inputs.forEach((name, i) => {
    const sy = y + 40 + (outputs.length + fields.length + i) * 20;
    out.push(kit.dot(x, sy, { r: 4.5, cls: mark.includes(name) ? 'd-mark-fill' : 'd-dot' }), kit.text(x + 10, sy + 4, name, { size: 10 }));
    at[`in:${name}`] = [x, sy];
  });
  return { svg: out, at };
}

// A link between two sockets.
export const link = (kit, [x1, y1], [x2, y2]) => kit.path(`M ${x1} ${y1} C ${x1 + 40} ${y1} ${x2 - 40} ${y2} ${x2} ${y2}`, { cls: 'd-mark', width: 2 });

// A rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}
