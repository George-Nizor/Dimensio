// Shapes and interface pieces shared by this lesson's diagrams. Not a diagram itself.
import { mesh, orientOutward, normal, centroid } from '../../../diagrams/mesh.mjs';

const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

// A rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}

// A cone or a frustum standing on its axis, like Add > Mesh > Cone: `r1` at the bottom, `r2` at
// the top (0 for a point), one n-gon cap at each closed end.
export function cone({ vertices = 8, r1 = 1, r2 = 0, depth = 2, center = [0, 0, 0] } = {}) {
  const verts = [];
  const ring = (r, z) => Array.from({ length: vertices }, (_, i) => {
    const t = (i / vertices) * Math.PI * 2;
    return verts.push([center[0] + Math.cos(t) * r, center[1] + Math.sin(t) * r, center[2] + z]) - 1;
  });
  const bottom = ring(r1, -depth / 2);
  const faces = [bottom];
  if (r2 > 0) {
    const top = ring(r2, depth / 2);
    for (let i = 0; i < vertices; i += 1) faces.push([bottom[i], bottom[(i + 1) % vertices], top[(i + 1) % vertices], top[i]]);
    faces.push(top);
  } else {
    const tip = verts.push([center[0], center[1], center[2] + depth / 2]) - 1;
    for (let i = 0; i < vertices; i += 1) faces.push([bottom[i], bottom[(i + 1) % vertices], tip]);
  }
  return orientOutward(mesh(verts, faces));
}

// An icosphere with one subdivision, like Add > Mesh > Ico Sphere with Subdivisions 1: 12 corners,
// 20 triangles.
export function icosphere({ radius = 1, center = [0, 0, 0] } = {}) {
  const t = (1 + Math.sqrt(5)) / 2;
  const raw = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
  const verts = raw.map((p) => { const l = Math.hypot(...p); return [center[0] + (p[0] / l) * radius, center[1] + (p[1] / l) * radius, center[2] + (p[2] / l) * radius]; });
  const faces = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  return orientOutward(mesh(verts, faces));
}

// A mesh drawn solid in one colour class (d-gizmo-x red, d-gizmo-y green, d-gizmo-z blue or
// d-mark-fill orange) over the usual light and shade, for diagrams about materials.
export function drawColoured(kit, m, v, fill, { width = 1.6, light = [-0.4, -0.6, 0.7], strength = 0.75 } = {}) {
  const l = Math.hypot(...light);
  const lightDir = light.map((c) => c / l);
  const facing = (f) => dot3(normal(m, f), v.eye ? sub(v.eye, centroid(m, f)) : v.toward) > 1e-6;
  const order = m.faces.map((f) => ({ f, d: Math.max(...f.map((j) => v.depth(m.verts[j]))) * 0.25 + f.reduce((s, j) => s + v.depth(m.verts[j]), 0) / f.length }))
    .filter(({ f }) => facing(f)).sort((a, b) => a.d - b.d);
  const out = [];
  for (const { f } of order) {
    const lit = dot3(normal(m, f), lightDir);
    const tone = lit > 0.45 ? 'd-face-1' : lit > -0.1 ? 'd-face-2' : 'd-face-3';
    const pts = f.map((i) => v.project(m.verts[i]));
    const d = `M ${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ')} Z`;
    out.push(`<path d="${d}" class="${tone}"/>`);
    out.push(`<path d="${d}" class="${fill}" stroke-width="0" opacity="${(strength * (lit > 0.45 ? 0.85 : lit > -0.1 ? 1 : 1)).toFixed(2)}"/>`);
    out.push(kit.polyline([...pts, pts[0]], { cls: 'd-ink', width }));
  }
  return out;
}

// A row of key caps, left to right from x, centred on y. Returns the markup and the right edge.
export function keyRow(kit, x, y, labels, { size = 12, gap = 6, mark = [] } = {}) {
  const out = [];
  let at = x;
  for (const label of labels) {
    if (label === '+') {
      out.push(kit.text(at + 5, y + 5, '+', { anchor: 'middle', size: 13 }));
      at += 10 + gap;
      continue;
    }
    const w = Math.max(size * 2, label.length * size * 0.62 + size);
    const on = mark.includes(label);
    out.push(`<rect x="${at.toFixed(1)}" y="${(y - size).toFixed(1)}" width="${w.toFixed(1)}" height="${size * 2}" rx="5" class="${on ? 'd-key-mark' : 'd-key'}" stroke-width="1.4"/>`);
    out.push(kit.text(at + w / 2, y + size * 0.36, label, { anchor: 'middle', size, cls: on ? 'd-key-text d-key-text-mark' : 'd-key-text' }));
    at += w + gap;
  }
  return { svg: out, right: at - gap };
}

// A pie menu around (cx, cy): items placed W, E, S, N, NW, NE, SW, SE, as Blender lays them out.
// `mark` is the label to pick out.
export function pie(kit, cx, cy, items, { mark, radius = 78, width = 92, size = 11, title } = {}) {
  const spots = [[-1, 0], [1, 0], [0, 1], [0, -1], [-0.72, -0.62], [0.72, -0.62], [-0.72, 0.62], [0.72, 0.62]];
  const out = [
    kit.circle(cx, cy, 14, { cls: 'd-guide', width: 5 }),
    kit.dot(cx, cy, { r: 2.5, cls: 'd-mark-fill' }),
  ];
  if (title) out.push(kit.text(cx, cy - radius - 26, title, { anchor: 'middle', size: 12 }));
  items.forEach((label, i) => {
    if (!label) return;
    const [dx, dy] = spots[i];
    const x = cx + dx * radius;
    const y = cy + dy * radius * 0.62;
    const on = label === mark;
    out.push(`<rect x="${(x - width / 2).toFixed(1)}" y="${(y - 11).toFixed(1)}" width="${width}" height="22" rx="11" class="${on ? 'd-ui-mark' : 'd-paper'}" stroke-width="1.2"/>`);
    out.push(kit.text(x, y + 4, label, { anchor: 'middle', size }));
  });
  return out;
}

// A labelled field, as in the Sidebar or a properties panel: the label on the left and the value
// in a sunken box on the right.
export function field(kit, x, y, label, value, { labelWidth = 70, width = 90, mark = false, size = 11 } = {}) {
  return [
    kit.text(x + labelWidth - 8, y + 4, label, { anchor: 'end', size }),
    `<rect x="${x + labelWidth}" y="${y - 10}" width="${width}" height="20" rx="4" class="${mark ? 'd-ui-mark' : 'd-sunk'}" stroke-width="1"/>`,
    kit.text(x + labelWidth + width / 2, y + 4, value, { anchor: 'middle', size, cls: 'd-key-text' }),
  ];
}

// A list of menu items in a box, with one picked out.
export function menu(kit, x, y, items, { width = 150, mark, size = 11, row = 21 } = {}) {
  const out = [`<rect x="${x}" y="${y}" width="${width}" height="${items.length * row + 8}" rx="5" class="d-paper" stroke-width="1.2"/>`];
  items.forEach((label, i) => {
    const ry = y + 4 + i * row;
    if (label === mark) out.push(`<rect x="${x + 4}" y="${ry}" width="${width - 8}" height="${row - 2}" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    out.push(kit.text(x + 12, ry + row / 2 + 3, label, { size }));
  });
  return out;
}

// An object's origin: the small dot Blender draws at it, with a ring so it reads at any size.
export function origin(kit, x, y) {
  return [kit.circle(x, y, 6, { cls: 'd-ink', width: 1.4 }), kit.dot(x, y, { r: 3.4, cls: 'd-mark-fill' })];
}

// The 3D cursor: a red and white dashed ring with cross hairs.
export function cursor3d(kit, x, y, { r = 12 } = {}) {
  return [
    kit.circle(x, y, r, { cls: 'd-guide', width: 3 }),
    kit.circle(x, y, r, { cls: 'd-axis-x', width: 3, dash: '4.7 4.7' }),
    kit.line(x - r - 6, y, x - r + 4, y, { cls: 'd-ink', width: 1.4 }),
    kit.line(x + r - 4, y, x + r + 6, y, { cls: 'd-ink', width: 1.4 }),
    kit.line(x, y - r - 6, x, y - r + 4, { cls: 'd-ink', width: 1.4 }),
    kit.line(x, y + r - 4, x, y + r + 6, { cls: 'd-ink', width: 1.4 }),
  ];
}

// A straight arrow between two points on the page.
export function pageArrow(kit, x1, y1, x2, y2, { cls = 'd-mark', width = 2 } = {}) {
  return [kit.line(x1, y1, x2, y2, { cls, width }), kit.arrowhead(x2, y2, Math.atan2(y2 - y1, x2 - x1), { cls, width })];
}
