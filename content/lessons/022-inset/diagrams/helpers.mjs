// Helpers shared by this lesson's diagrams: interface pieces drawn as plain schematics, and mesh
// operations the mesh kit does not have. Not a diagram itself.
import { normal, centroid, mesh, edges } from '../../../diagrams/mesh.mjs';

const fmt = (n) => Number(n.toFixed(2));

// ---- Interface pieces ---------------------------------------------------------------------------

// A rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}

// A pop-up menu: a title, then its items. '-' is a separator, and an item starting with '~' is
// drawn as a plain grey bar (an item the picture does not need to name). `pick` is picked out.
export function menu(kit, x, y, { title, items, pick, width = 170, row = 20 }) {
  const height = 30 + items.reduce((h, item) => h + (item === '-' ? 8 : row), 0) + 4;
  const out = [`<rect x="${fmt(x)}" y="${fmt(y)}" width="${width}" height="${fmt(height)}" rx="5" class="d-paper" stroke-width="1.2"/>`];
  out.push(kit.text(x + 10, y + 18, title, { size: 11, cls: 'd-label' }));
  out.push(kit.line(x + 6, y + 26, x + width - 6, y + 26, { cls: 'd-guide', width: 1 }));
  let ry = y + 30;
  for (const item of items) {
    if (item === '-') {
      out.push(kit.line(x + 8, ry + 4, x + width - 8, ry + 4, { cls: 'd-guide', width: 1 }));
      ry += 8;
      continue;
    }
    if (item === pick) out.push(`<rect x="${fmt(x + 4)}" y="${fmt(ry)}" width="${width - 8}" height="${row - 2}" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    if (item.startsWith('~')) out.push(kit.line(x + 14, ry + row / 2, x + 14 + (width - 40) * (0.4 + (item.length % 4) * 0.12), ry + row / 2, { cls: 'd-guide', width: 5 }));
    else out.push(kit.text(x + 14, ry + row / 2 + 4, item, { size: 11, cls: 'd-key-text' }));
    ry += row;
  }
  return out;
}

// Small icons for Outliner rows, drawn at (x, y) as the icon's middle.
function icon(kit, kind, x, y) {
  if (kind === 'mesh') return kit.path(`M ${x - 5} ${y + 4} L ${x} ${y - 5} L ${x + 5} ${y + 4} Z`, { cls: 'd-ink', width: 1.3 });
  if (kind === 'light') return [kit.circle(x, y, 3, { cls: 'd-ink', width: 1.3 }), kit.line(x - 6, y, x - 4.5, y, { width: 1.2 }), kit.line(x + 4.5, y, x + 6, y, { width: 1.2 }), kit.line(x, y - 6, x, y - 4.5, { width: 1.2 }), kit.line(x, y + 4.5, x, y + 6, { width: 1.2 })];
  if (kind === 'empty') return [kit.line(x - 5, y, x + 5, y, { width: 1.3 }), kit.line(x, y - 5, x, y + 5, { width: 1.3 }), kit.line(x - 3, y + 3, x + 3, y - 3, { width: 1.1 })];
  if (kind === 'camera') return kit.path(`M ${x - 5} ${y - 3} L ${x + 2} ${y - 3} L ${x + 2} ${y + 3} L ${x - 5} ${y + 3} Z M ${x + 2} ${y - 1} L ${x + 6} ${y - 4} L ${x + 6} ${y + 4} L ${x + 2} ${y + 1}`, { cls: 'd-ink', width: 1.2 });
  if (kind === 'collection') return kit.path(`M ${x - 6} ${y + 4} L ${x - 6} ${y - 4} L ${x - 2} ${y - 4} L ${x - 0.5} ${y - 2} L ${x + 6} ${y - 2} L ${x + 6} ${y + 4} Z`, { cls: 'd-ink', width: 1.3 });
  if (kind === 'scene') return kit.path(`M ${x - 5} ${y + 4} L ${x - 5} ${y - 4} L ${x + 5} ${y - 4} L ${x + 5} ${y + 4} Z M ${x - 5} ${y} L ${x + 5} ${y}`, { cls: 'd-ink', width: 1.2 });
  return '';
}

// The eye toggle at (x, y): open, or closed (a lid line with lashes).
export function eye(kit, x, y, open = true, { mark = false } = {}) {
  const cls = mark ? 'd-mark' : 'd-ink';
  if (!open) return [kit.path(`M ${x - 6} ${y - 1} Q ${x} ${y + 5} ${x + 6} ${y - 1}`, { cls, width: 1.4 }), kit.line(x - 3, y + 2, x - 4, y + 5, { cls, width: 1.1 }), kit.line(x + 3, y + 2, x + 4, y + 5, { cls, width: 1.1 })];
  return [kit.path(`M ${x - 6} ${y} Q ${x} ${y - 6} ${x + 6} ${y} Q ${x} ${y + 6} ${x - 6} ${y} Z`, { cls, width: 1.4 }), `<circle cx="${x}" cy="${y}" r="2" class="${mark ? 'd-mark-fill' : 'd-dot'}"/>`];
}

// A checkbox at (x, y), its top left corner.
export function checkbox(kit, x, y, on = true, { mark = false, size = 10 } = {}) {
  return [
    `<rect x="${fmt(x)}" y="${fmt(y)}" width="${size}" height="${size}" rx="2" class="${mark ? 'd-ui-mark' : 'd-key'}" stroke-width="1.3"/>`,
    on ? kit.path(`M ${x + 2} ${y + size / 2} L ${x + size * 0.42} ${y + size - 2.5} L ${x + size - 2} ${y + 2.5}`, { cls: mark ? 'd-mark' : 'd-ink', width: 1.6 }) : '',
  ];
}

// The Outliner: rows of { name, depth, icon, eye, check, pick, grey }. eye is true (open), false
// (closed) or left out; check is the collection checkbox, true, false or left out.
export function outliner(kit, x, y, w, rows, { row = 20, markEye, markCheck } = {}) {
  const out = [`<rect x="${fmt(x)}" y="${fmt(y)}" width="${w}" height="${rows.length * row + 8}" rx="4" class="d-ui" stroke-width="1"/>`];
  rows.forEach((r, i) => {
    const ry = y + 4 + i * row;
    const ix = x + 16 + (r.depth || 0) * 16;
    if (r.pick) out.push(`<rect x="${fmt(x + 3)}" y="${fmt(ry)}" width="${w - 6}" height="${row - 2}" rx="3" class="d-ui-mark" stroke-width="0"/>`);
    if (r.check !== undefined) out.push(checkbox(kit, ix - 6, ry + row / 2 - 6, r.check, { mark: markCheck === r.name }));
    const iconX = r.check !== undefined ? ix + 14 : ix;
    out.push(icon(kit, r.icon, iconX, ry + row / 2 - 1));
    if (r.edit) {
      out.push(`<rect x="${fmt(iconX + 10)}" y="${fmt(ry + 2)}" width="${fmt(w - (iconX - x) - 40)}" height="${row - 5}" rx="3" class="d-paper" stroke-width="1.2"/>`);
      out.push(kit.text(iconX + 15, ry + row / 2 + 3, r.name, { size: 11, cls: 'd-key-text' }));
      const caret = iconX + 17 + r.name.length * 6.7;
      out.push(kit.line(caret, ry + 5, caret, ry + row - 6, { cls: 'd-ink', width: 1.3 }));
    } else {
      out.push(kit.text(iconX + 11, ry + row / 2 + 3, r.name, { size: 11, cls: r.grey ? 'd-label' : 'd-key-text' }));
    }
    if (r.grey) out.push(kit.line(iconX + 11, ry + row / 2 - 1, iconX + 11, ry + row / 2 - 1, { cls: 'd-guide', width: 0 }));
    if (r.eye !== undefined) out.push(eye(kit, x + w - 16, ry + row / 2 - 1, r.eye, { mark: markEye === r.name }));
  });
  return out;
}

// One field of the Sidebar or a panel: a label on the left, a value box on the right.
export function field(kit, x, y, label, value, { width = 150, labelWidth = 70, mark = false, h = 18 } = {}) {
  return [
    kit.text(x + labelWidth - 6, y + h / 2 + 4, label, { anchor: 'end', size: 10 }),
    `<rect x="${fmt(x + labelWidth)}" y="${fmt(y)}" width="${width - labelWidth}" height="${h}" rx="3" class="${mark ? 'd-ui-mark' : 'd-key'}" stroke-width="1.1"/>`,
    kit.text(x + labelWidth + (width - labelWidth) / 2, y + h / 2 + 4, value, { anchor: 'middle', size: 10, cls: 'd-key-text' }),
  ];
}

// A Sidebar block: a heading, then X, Y and Z fields. `mark` picks the block out.
export function vectorFields(kit, x, y, heading, values, { width = 150, mark = false, axes = ['X', 'Y', 'Z'] } = {}) {
  const out = [kit.text(x, y + 10, heading, { size: 11 })];
  if (mark) out.push(`<rect x="${fmt(x - 6)}" y="${fmt(y - 4)}" width="${width + 12}" height="${3 * 21 + 22}" rx="5" class="d-mark" fill="none" stroke-width="1.8"/>`);
  values.forEach((value, i) => out.push(field(kit, x, y + 16 + i * 21, axes[i], value, { width, labelWidth: 22, mark })));
  return out;
}

// A number in a small circle, for the order things are clicked in.
export function badge(kit, x, y, n, { mark = false } = {}) {
  return [
    `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="9" class="${mark ? 'd-key-mark' : 'd-key'}" stroke-width="1.3"/>`,
    kit.text(x, y + 4, String(n), { anchor: 'middle', size: 11, cls: mark ? 'd-key-text d-key-text-mark' : 'd-key-text' }),
  ];
}

// An object's origin: a small ringed dot, as Blender draws it.
export function originDot(kit, v, p, { cls = 'd-mark-fill' } = {}) {
  const [x, y] = v.project(p);
  return [`<circle cx="${fmt(x)}" cy="${fmt(y)}" r="4.5" class="d-paper" stroke-width="1.2"/>`, kit.dot(x, y, { r: 3, cls })];
}

// Vertex dots at every vertex of a mesh, the way Edit Mode shows them in Vertex select mode.
// Only vertices on faces that face the viewer are drawn, unless `all` is set.
export function vertexDots(kit, m, v, { all = false, r = 2.4, skip = [] } = {}) {
  const shown = new Set();
  m.faces.forEach((f) => {
    if (all || facingView(m, f, v)) f.forEach((i) => shown.add(i));
  });
  return [...shown].filter((i) => !skip.includes(i)).map((i) => {
    const [x, y] = v.project(m.verts[i]);
    return kit.dot(x, y, { r });
  });
}

function facingView(m, f, v) {
  const n = normal(m, f);
  const c = centroid(m, f);
  const to = v.eye ? [v.eye[0] - c[0], v.eye[1] - c[1], v.eye[2] - c[2]] : v.toward;
  return n[0] * to[0] + n[1] * to[1] + n[2] * to[2] > 1e-6;
}

// A solid drawing that also shows faces seen from behind, darker, so an open mesh shows its inside.
export function drawOpen(kit, m, v, { select = {}, width = 2 } = {}) {
  const sel = new Set(select.faces || []);
  const order = m.faces.map((f, i) => ({ f, i, d: f.reduce((s, j) => s + v.depth(m.verts[j]), 0) / f.length })).sort((a, b) => a.d - b.d);
  const light = [-0.4, -0.6, 0.7];
  const ll = Math.hypot(...light);
  const out = [];
  for (const { f, i } of order) {
    const n = normal(m, f);
    const front = facingView(m, f, v);
    const lit = (n[0] * light[0] + n[1] * light[1] + n[2] * light[2]) / ll;
    const tone = sel.has(i) ? 'd-face-sel' : !front ? 'd-face-3' : lit > 0.45 ? 'd-face-1' : lit > -0.1 ? 'd-face-2' : 'd-face-3';
    const pts = f.map((j) => v.project(m.verts[j]));
    out.push(`<path d="M ${pts.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join(' L ')} Z" class="${tone}"/>`);
    out.push(kit.polyline([...pts, pts[0]], { cls: 'd-ink', width }));
  }
  for (const [a, b] of select.edges || []) {
    const p = v.project(m.verts[a]);
    const q = v.project(m.verts[b]);
    out.push(kit.line(p[0], p[1], q[0], q[1], { cls: 'd-mark', width: width * 1.8 }));
  }
  return out;
}

// A three-axis arrow set for an object's own axes: `dirs` are the X, Y and Z directions.
export function localAxes(kit, v, origin, dirs, { length = 0.6, width = 2 } = {}) {
  return ['x', 'y', 'z'].flatMap((name, i) => {
    const d = dirs[i];
    const end = [origin[0] + d[0] * length, origin[1] + d[1] * length, origin[2] + d[2] * length];
    const [x, y] = v.project(end);
    const o = v.project(origin);
    const angle = Math.atan2(y - o[1], x - o[0]);
    return [
      kit.line(o[0], o[1], x, y, { cls: `d-axis-${name}`, width }),
      kit.arrowhead(x, y, angle, { cls: `d-axis-${name}`, width, size: 7 }),
      kit.text(x + Math.cos(angle) * 10, y + Math.sin(angle) * 10 + 4, name.toUpperCase(), { cls: `d-label d-axis-${name}-text`, anchor: 'middle', size: 11 }),
    ];
  });
}

// ---- Mesh operations the kit does not have ---------------------------------------------------------

export const copyMesh = (m) => mesh(m.verts, m.faces);

// Moves the chosen vertices by a vector.
export function moveVerts(m, ids, by) {
  const out = copyMesh(m);
  for (const i of ids) out.verts[i] = [out.verts[i][0] + by[0], out.verts[i][1] + by[1], out.verts[i][2] + by[2]];
  return out;
}

// Scales the chosen vertices about their middle, the way S does with the median point as pivot.
export function scaleVerts(m, ids, s) {
  const out = copyMesh(m);
  const c = [0, 1, 2].map((k) => ids.reduce((sum, i) => sum + m.verts[i][k], 0) / ids.length);
  const f = Array.isArray(s) ? s : [s, s, s];
  for (const i of ids) out.verts[i] = [0, 1, 2].map((k) => c[k] + (m.verts[i][k] - c[k]) * f[k]);
  return out;
}

export const vertsOfFaces = (m, faces) => [...new Set(faces.flatMap((f) => m.faces[f]))];

// The edges of one face, as [a, b] pairs, for select.edges.
export const faceEdges = (m, f) => m.faces[f].map((a, i) => [a, m.faces[f][(i + 1) % m.faces[f].length]]);

// Extrudes faces as one region along a fixed vector, as E then an axis key does.
export function extrudeAlong(m, faceIndices, by) {
  const out = copyMesh(m);
  const count = new Map();
  const key = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);
  for (const f of faceIndices) m.faces[f].forEach((a, i) => { const b = m.faces[f][(i + 1) % m.faces[f].length]; count.set(key(a, b), (count.get(key(a, b)) || 0) + 1); });
  const moved = new Map();
  const copy = (i) => { if (!moved.has(i)) moved.set(i, out.verts.push([m.verts[i][0] + by[0], m.verts[i][1] + by[1], m.verts[i][2] + by[2]]) - 1); return moved.get(i); };
  for (const f of faceIndices) {
    const face = m.faces[f];
    face.forEach((a, i) => { const b = face[(i + 1) % face.length]; if (count.get(key(a, b)) === 1) out.faces.push([a, b, copy(b), copy(a)]); });
    out.faces[f] = face.map(copy);
  }
  return out;
}

// Extrudes faces as one region, moving each vertex along the normals of the region's faces it
// touches, the way Extrude Faces Along Normals does with Offset Even on a box. Negative goes in.
export function extrudeNormals(m, faceIndices, distance) {
  const out = copyMesh(m);
  const offsets = new Map();
  for (const f of faceIndices) {
    const n = normal(m, m.faces[f]).map((c) => Math.round(c * 1e6) / 1e6);
    for (const i of m.faces[f]) {
      if (!offsets.has(i)) offsets.set(i, new Map());
      offsets.get(i).set(n.join(','), n);
    }
  }
  const count = new Map();
  const key = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);
  for (const f of faceIndices) m.faces[f].forEach((a, i) => { const b = m.faces[f][(i + 1) % m.faces[f].length]; count.set(key(a, b), (count.get(key(a, b)) || 0) + 1); });
  const moved = new Map();
  const copy = (i) => {
    if (!moved.has(i)) {
      const d = [...offsets.get(i).values()].reduce((s, n) => [s[0] + n[0], s[1] + n[1], s[2] + n[2]], [0, 0, 0]);
      moved.set(i, out.verts.push([m.verts[i][0] + d[0] * distance, m.verts[i][1] + d[1] * distance, m.verts[i][2] + d[2] * distance]) - 1);
    }
    return moved.get(i);
  };
  for (const f of faceIndices) {
    const face = m.faces[f];
    face.forEach((a, i) => { const b = face[(i + 1) % face.length]; if (count.get(key(a, b)) === 1) out.faces.push([a, b, copy(b), copy(a)]); });
    out.faces[f] = face.map(copy);
  }
  return out;
}

// Extrudes one edge along a vector into a new face, as E does on an edge.
export function extrudeEdge(m, a, b, by) {
  const out = copyMesh(m);
  const a2 = out.verts.push([m.verts[a][0] + by[0], m.verts[a][1] + by[1], m.verts[a][2] + by[2]]) - 1;
  const b2 = out.verts.push([m.verts[b][0] + by[0], m.verts[b][1] + by[1], m.verts[b][2] + by[2]]) - 1;
  out.faces.push([a, b, b2, a2]);
  return { mesh: out, edge: [a2, b2], face: out.faces.length - 1 };
}

// Removes faces, keeping every vertex, as X > Only Faces would; with `loose` false, vertices no
// face uses any more are dropped too, as X > Faces does.
export function deleteFaces(m, faceIndices) {
  const drop = new Set(faceIndices);
  return mesh(m.verts, m.faces.filter((_, i) => !drop.has(i)));
}

// A box like the kit's, but cut at given coordinates along each axis instead of evenly: cuts
// { x: [...], y: [...], z: [...] } in metres from the box's middle.
export function cutBox({ size = [2, 2, 2], center = [0, 0, 0], cuts = {} } = {}) {
  const half = size.map((s) => s / 2);
  const coords = [0, 1, 2].map((k) => [-half[k], ...((cuts[['x', 'y', 'z'][k]]) || []), half[k]].sort((a, b) => a - b));
  const verts = [];
  const index = new Map();
  const at = (p) => {
    const k = p.map((c) => c.toFixed(5)).join(',');
    if (!index.has(k)) { index.set(k, verts.length); verts.push(p.map((c, j) => c + center[j])); }
    return index.get(k);
  };
  const faces = [];
  for (const axis of [0, 1, 2]) {
    const [u, w] = [0, 1, 2].filter((a) => a !== axis);
    for (const side of [-1, 1]) {
      for (let i = 0; i < coords[u].length - 1; i += 1) {
        for (let j = 0; j < coords[w].length - 1; j += 1) {
          const corner = (a, b) => { const p = [0, 0, 0]; p[axis] = side * half[axis]; p[u] = coords[u][i + a]; p[w] = coords[w][j + b]; return at(p); };
          let face = [corner(0, 0), corner(1, 0), corner(1, 1), corner(0, 1)];
          const m0 = { verts, faces: [face] };
          const n = normal(m0, face);
          if (n[axis] * side < 0) face = face.reverse();
          faces.push(face);
        }
      }
    }
  }
  return { verts, faces };
}

// A cylinder with rows: `sides` around, `rows` bands up its height, with triangle-fan caps.
export function tube({ sides = 12, rows = 6, radius = 0.5, height = 2, base = 0 } = {}) {
  const verts = [];
  for (let r = 0; r <= rows; r += 1) {
    for (let i = 0; i < sides; i += 1) {
      const t = (i / sides) * Math.PI * 2;
      verts.push([Math.cos(t) * radius, Math.sin(t) * radius, base + (height * r) / rows]);
    }
  }
  const at = (r, i) => r * sides + (i % sides);
  const faces = [];
  for (let r = 0; r < rows; r += 1) for (let i = 0; i < sides; i += 1) faces.push([at(r, i), at(r, i + 1), at(r + 1, i + 1), at(r + 1, i)]);
  const bottom = verts.push([0, 0, base]) - 1;
  const top = verts.push([0, 0, base + height]) - 1;
  for (let i = 0; i < sides; i += 1) {
    faces.push([at(0, i + 1), at(0, i), bottom]);
    faces.push([at(rows, i), at(rows, i + 1), top]);
  }
  return { verts, faces, ring: (r) => Array.from({ length: sides }, (_, i) => at(r, i)), at };
}

// Every edge of a mesh as [a, b] pairs, for picking with a test.
export const allEdges = (m) => edges(m).map((e) => [e.a, e.b]);

// Draws `content` inside a rounded frame and cuts off whatever runs past it, for a close-up of
// part of a model. `id` must be unique on the page, so it names the lesson and the diagram.
export function closeUp(kit, id, x, y, w, h, label, ...content) {
  return [
    `<clipPath id="${id}"><rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="6"/></clipPath>`,
    `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="6" class="d-ui" stroke-width="1"/>`,
    `<g clip-path="url(#${id})">`, content, '</g>',
    `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="6" class="d-ink" fill="none" stroke-width="0" />`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}

// A label with a short leader line to the point it names.
export function callout(kit, x, y, tx, ty, text, { anchor = 'start', cls = 'd-mark' } = {}) {
  return [kit.line(tx, ty, x, y, { cls, width: 1.4 }), kit.dot(tx, ty, { r: 2.4, cls: 'd-mark-fill' }), kit.text(x + (anchor === 'end' ? -4 : anchor === 'middle' ? 0 : 4), y + 4, text, { anchor, size: 12 })];
}

// Insets one face by a fixed border width `t` in metres, the way I does with Offset Even: each
// corner moves inward along the bisector of its two edges. Returns the mesh and the inner face.
export function insetEven(m, faceIndex, t) {
  const out = copyMesh(m);
  const face = m.faces[faceIndex];
  const unit = (a) => { const l = Math.hypot(...a) || 1; return a.map((c) => c / l); };
  const inner = face.map((vi, i) => {
    const p = m.verts[vi];
    const prev = m.verts[face[(i + face.length - 1) % face.length]];
    const next = m.verts[face[(i + 1) % face.length]];
    const a = unit([prev[0] - p[0], prev[1] - p[1], prev[2] - p[2]]);
    const b = unit([next[0] - p[0], next[1] - p[1], next[2] - p[2]]);
    const half = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))) / 2;
    const d = unit([a[0] + b[0], a[1] + b[1], a[2] + b[2]]).map((c) => (c * t) / Math.sin(half));
    return out.verts.push([p[0] + d[0], p[1] + d[1], p[2] + d[2]]) - 1;
  });
  face.forEach((a, i) => { const j = (i + 1) % face.length; out.faces.push([a, face[j], inner[j], inner[i]]); });
  out.faces[faceIndex] = inner;
  return { mesh: out, face: faceIndex };
}
