// Helpers shared by the diagrams of lessons 37 to 47, the Modifiers part. Not a diagram itself.
// Each one builds real geometry the way the modifier does, so a picture of a subdivided cube or a
// solidified plane shows the faces Blender would make.

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const avg = (points) => mul(points.reduce((s, p) => add(s, p), [0, 0, 0]), 1 / points.length);
const ekey = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);

function faceNormal(m, face) {
  const n = [0, 0, 0];
  for (let i = 0; i < face.length; i += 1) {
    const a = m.verts[face[i]];
    const b = m.verts[face[(i + 1) % face.length]];
    n[0] += (a[1] - b[1]) * (a[2] + b[2]);
    n[1] += (a[2] - b[2]) * (a[0] + b[0]);
    n[2] += (a[0] - b[0]) * (a[1] + b[1]);
  }
  return unit(n);
}

// ---- Frames and labels ------------------------------------------------------------------------

// A rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}

// A plain arrow from one point to another on the page.
export function pageArrow(kit, x1, y1, x2, y2, { cls = 'd-mark', width = 2 } = {}) {
  return [kit.line(x1, y1, x2, y2, { cls, width }), kit.arrowhead(x2, y2, Math.atan2(y2 - y1, x2 - x1), { cls, width })];
}

// ---- Flat shapes with a thickness ---------------------------------------------------------------

// A flat shape drawn in the front view and given a depth along Y, like a board or a blade.
// `points` are [x, z] pairs and `faces` lists them counter-clockwise as seen from the front.
export function slab(points, faces, depth, { y = 0 } = {}) {
  const n = points.length;
  const verts = [...points.map(([x, z]) => [x, y - depth / 2, z]), ...points.map(([x, z]) => [x, y + depth / 2, z])];
  const out = [...faces.map((f) => [...f]), ...faces.map((f) => [...f].reverse().map((i) => i + n))];
  const count = new Map();
  faces.forEach((f) => f.forEach((a, i) => { const k = ekey(a, f[(i + 1) % f.length]); count.set(k, (count.get(k) || 0) + 1); }));
  faces.forEach((f) => f.forEach((a, i) => {
    const b = f[(i + 1) % f.length];
    if (count.get(ekey(a, b)) === 1) out.push([a, a + n, b + n, b]);
  }));
  return { verts, faces: out };
}

// ---- Subdivision Surface ----------------------------------------------------------------------

// Catmull-Clark subdivision, the rule the Subdivision Surface modifier uses. `creases` lists edges
// as [a, b] vertex pairs with a crease of 1 (Shift+E, 1): they stay sharp. Open edges count as
// sharp too. Returns the new mesh and the creased edges in it.
export function subdivide(m, levels = 1, { creases = [] } = {}) {
  let cur = { verts: m.verts.map((v) => [...v]), faces: m.faces.map((f) => [...f]) };
  let sharp = new Set(creases.map(([a, b]) => ekey(a, b)));
  for (let level = 0; level < levels; level += 1) {
    const V = cur.verts;
    const F = cur.faces;
    const edgeMap = new Map();
    F.forEach((f, fi) => f.forEach((a, i) => {
      const b = f[(i + 1) % f.length];
      const k = ekey(a, b);
      if (!edgeMap.has(k)) edgeMap.set(k, { a: Math.min(a, b), b: Math.max(a, b), faces: [] });
      edgeMap.get(k).faces.push(fi);
    }));
    const isSharp = (e) => e.faces.length < 2 || sharp.has(ekey(e.a, e.b));
    const facePoints = F.map((f) => avg(f.map((i) => V[i])));
    const verts = [];
    // New positions for the old vertices.
    const vEdges = V.map(() => []);
    const vFaces = V.map(() => []);
    for (const e of edgeMap.values()) { vEdges[e.a].push(e); vEdges[e.b].push(e); }
    F.forEach((f, fi) => f.forEach((i) => vFaces[i].push(fi)));
    V.forEach((p, i) => {
      const hard = vEdges[i].filter(isSharp);
      if (hard.length >= 3 || !vEdges[i].length) verts.push([...p]);
      else if (hard.length === 2) {
        const [o1, o2] = hard.map((e) => V[e.a === i ? e.b : e.a]);
        verts.push(mul(add(add(mul(p, 6), o1), o2), 1 / 8));
      } else {
        const n = vEdges[i].length;
        const fAvg = avg(vFaces[i].map((fi) => facePoints[fi]));
        const rAvg = avg(vEdges[i].map((e) => mul(add(V[e.a], V[e.b]), 0.5)));
        verts.push(mul(add(add(fAvg, mul(rAvg, 2)), mul(p, n - 3)), 1 / n));
      }
    });
    const edgeIndex = new Map();
    for (const [k, e] of edgeMap) {
      const mid = mul(add(V[e.a], V[e.b]), 0.5);
      const point = isSharp(e) ? mid : mul(add(add(V[e.a], V[e.b]), add(facePoints[e.faces[0]], facePoints[e.faces[1]])), 0.25);
      edgeIndex.set(k, verts.push(point) - 1);
    }
    const faceIndex = facePoints.map((p) => verts.push(p) - 1);
    const faces = [];
    F.forEach((f, fi) => f.forEach((v, i) => {
      const next = f[(i + 1) % f.length];
      const prev = f[(i - 1 + f.length) % f.length];
      faces.push([v, edgeIndex.get(ekey(v, next)), faceIndex[fi], edgeIndex.get(ekey(prev, v))]);
    }));
    const nextSharp = new Set();
    for (const k of sharp) {
      const e = edgeMap.get(k);
      if (!e) continue;
      const mid = edgeIndex.get(k);
      nextSharp.add(ekey(e.a, mid));
      nextSharp.add(ekey(mid, e.b));
    }
    sharp = nextSharp;
    cur = { verts, faces };
  }
  return cur;
}

// ---- Lathe, Spin and Screw --------------------------------------------------------------------

// Turns a profile around the Z axis, as the Screw modifier and the Spin tool do. The profile is
// [[r, z], ...] in the XZ plane, from the bottom of the axis outwards, up and back in, so the
// faces point out. A point with r 0 is on the axis and becomes one vertex (Merge on). `screw`
// raises each turn by that many metres and `turns` is Iterations; `closed` joins the last profile
// point to the first, for a circle profile.
export function lathe(profile, segments = 12, { sweep = 360, screw = 0, turns = 1, closed = false, centre = [0, 0, 0], caps = false } = {}) {
  const full = sweep >= 360 && !screw;
  const steps = full ? segments : segments * turns;
  const columns = full ? segments : steps + 1;
  const verts = [];
  const index = profile.map(([r, z]) => {
    if (Math.abs(r) < 1e-9) return Array(columns).fill(verts.push([centre[0], centre[1], centre[2] + z]) - 1);
    return Array.from({ length: columns }, (_, j) => {
      const t = ((full ? j / segments : j / segments) * sweep * Math.PI) / 180;
      return verts.push([centre[0] + Math.cos(t) * r, centre[1] + Math.sin(t) * r, centre[2] + z + (screw * j) / segments]) - 1;
    });
  });
  const faces = [];
  const rows = closed ? profile.length : profile.length - 1;
  for (let i = 0; i < rows; i += 1) {
    const a = index[i];
    const b = index[(i + 1) % profile.length];
    for (let j = 0; j < (full ? segments : steps); j += 1) {
      const j2 = full ? (j + 1) % segments : j + 1;
      const quad = [a[j], a[j2], b[j2], b[j]];
      const face = quad.filter((v, k) => quad.indexOf(v) === k);
      if (face.length >= 3) faces.push(face);
    }
  }
  // caps: close the first and last rings with one face each, the way Add > Mesh > Cylinder does.
  if (caps && full) {
    faces.push([...index[0]].reverse(), [...index[profile.length - 1]]);
  }
  return { verts, faces };
}

// ---- Solidify ---------------------------------------------------------------------------------

// Gives an open surface a thickness, as the Solidify modifier does in Simple mode. Offset -1 (the
// default) grows the thickness behind the faces, 1 in front of them, 0 on both sides. `even`
// keeps the wall the same thickness at corners; `rim` closes the open edges (Fill Rim).
export function solidify(m, thickness, { offset = -1, even = false, rim = true } = {}) {
  const fn = m.faces.map((f) => faceNormal(m, f));
  const vn = m.verts.map(() => [0, 0, 0]);
  const touching = m.verts.map(() => []);
  m.faces.forEach((f, fi) => f.forEach((i) => { vn[i] = add(vn[i], fn[fi]); touching[i].push(fi); }));
  const dirs = vn.map((n, i) => {
    const u = unit(n);
    if (!even) return u;
    const c = Math.min(...touching[i].map((fi) => dot(u, fn[fi])));
    return mul(u, 1 / Math.max(c, 0.2));
  });
  const outer = m.verts.map((v, i) => add(v, mul(dirs[i], (thickness * (1 + offset)) / 2)));
  const inner = m.verts.map((v, i) => sub(v, mul(dirs[i], (thickness * (1 - offset)) / 2)));
  const n = m.verts.length;
  const faces = [...m.faces.map((f) => [...f]), ...m.faces.map((f) => [...f].reverse().map((i) => i + n))];
  if (rim) {
    const count = new Map();
    m.faces.forEach((f) => f.forEach((a, i) => { const k = ekey(a, f[(i + 1) % f.length]); count.set(k, (count.get(k) || 0) + 1); }));
    m.faces.forEach((f) => f.forEach((a, i) => {
      const b = f[(i + 1) % f.length];
      if (count.get(ekey(a, b)) === 1) faces.push([a, a + n, b + n, b]);
    }));
  }
  return { verts: [...outer, ...inner], faces };
}

// ---- Deforming --------------------------------------------------------------------------------

const moveVerts = (m, fn) => ({ verts: m.verts.map((v) => fn([...v])), faces: m.faces.map((f) => [...f]) });

// Simple Deform, Twist around Z: each vertex turns by its height's share of `degrees`, from
// `base` (where nothing turns) up to `top`.
export function twist(m, degrees, { base = 0, top = 1 } = {}) {
  return moveVerts(m, ([x, y, z]) => {
    const t = (((z - base) / (top - base)) * degrees * Math.PI) / 180;
    return [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t), z];
  });
}

// Simple Deform, Bend around Z: a bar lying along X curls into an arc, its ends toward +Y. The
// middle (X 0) stays put; `degrees` is the whole arc.
export function bend(m, degrees, length) {
  const angle = (degrees * Math.PI) / 180;
  const radius = length / angle;
  return moveVerts(m, ([x, y, z]) => {
    const phi = x / radius;
    return [(radius - y) * Math.sin(phi), radius - (radius - y) * Math.cos(phi), z];
  });
}

// A lattice of 2 x 2 x 2 points around a box from `low` to `high`, and the shape it gives a mesh
// inside it when its points move. `points` lists the eight corners in x, then y, then z order.
export function latticeCorners(low, high) {
  const out = [];
  for (const z of [low[2], high[2]]) for (const y of [low[1], high[1]]) for (const x of [low[0], high[0]]) out.push([x, y, z]);
  return out;
}

export function latticeDeform(m, low, high, points) {
  return moveVerts(m, (p) => {
    const t = [0, 1, 2].map((i) => (p[i] - low[i]) / (high[i] - low[i]));
    let out = [0, 0, 0];
    for (let k = 0; k < 8; k += 1) {
      const bx = k & 1;
      const by = (k >> 1) & 1;
      const bz = (k >> 2) & 1;
      const w = (bx ? t[0] : 1 - t[0]) * (by ? t[1] : 1 - t[1]) * (bz ? t[2] : 1 - t[2]);
      out = add(out, mul(points[k], w));
    }
    return out;
  });
}

// The lattice cage itself, as a mesh, for drawing in wire.
export function latticeMesh(points) {
  return { verts: points.map((p) => [...p]), faces: [[0, 1, 3, 2], [4, 6, 7, 5], [0, 4, 5, 1], [2, 3, 7, 6], [0, 2, 6, 4], [1, 5, 7, 3]] };
}

// The Curve modifier along a curve in the XZ plane, given as points [[x, z], ...]: X along the
// mesh becomes distance along the curve from its first point, and Z becomes height above it.
export function alongCurve(m, curve, { start = curve[0][0] } = {}) {
  const lengths = [0];
  for (let i = 1; i < curve.length; i += 1) lengths.push(lengths[i - 1] + Math.hypot(curve[i][0] - curve[i - 1][0], curve[i][1] - curve[i - 1][1]));
  const at = (s) => {
    let i = 1;
    while (i < curve.length - 1 && lengths[i] < s) i += 1;
    const [ax, az] = curve[i - 1];
    const [bx, bz] = curve[i];
    const seg = lengths[i] - lengths[i - 1] || 1;
    const u = (s - lengths[i - 1]) / seg;
    const tx = (bx - ax) / seg;
    const tz = (bz - az) / seg;
    return { x: ax + (bx - ax) * u, z: az + (bz - az) * u, tx, tz };
  };
  return moveVerts(m, ([x, y, z]) => {
    const c = at(x - start);
    return [c.x - c.tz * z, y, c.z + c.tx * z];
  });
}

// ---- The Properties editor --------------------------------------------------------------------

// One modifier panel in the Properties editor: the header with its name and buttons, and rows of
// settings under it. mark picks out one part: 'editmode', 'viewport', 'render', 'menu', 'grip',
// 'close', or a row's label. `s` scales the whole panel.
export function modPanel(kit, x, y, { w = 300, name, mark, rows = [], s = 1 } = {}) {
  const h = 28 * s;
  const rowH = 24 * s;
  const body = rows.length ? rows.length * rowH + 10 * s : 0;
  const out = [
    `<rect x="${x}" y="${y}" width="${w}" height="${h + body}" rx="${5 * s}" class="d-ui" stroke-width="1"/>`,
    kit.path(`M ${x + 9 * s} ${y + 11 * s} L ${x + 13 * s} ${y + 16 * s} L ${x + 17 * s} ${y + 11 * s}`, { cls: 'd-ink', width: 1.4 }),
    kit.text(x + 26 * s, y + 18.5 * s, name, { size: 12 * s }),
  ];
  const at = {};
  const b = 19 * s;
  const gap = 24 * s;
  const right = x + w;
  const by = y + (h - b) / 2;
  const button = (key, bx, glyph) => {
    at[key] = [bx + b / 2, by + b / 2];
    out.push(`<rect x="${bx}" y="${by}" width="${b}" height="${b}" rx="${3 * s}" class="${mark === key ? 'd-ui-mark' : 'd-key'}" stroke-width="${mark === key ? 1.8 : 1}"/>`);
    out.push(glyph(bx, by, b / 19));
  };
  const pos = (n) => right - 8 * s - n * gap - b;
  // Edit Mode: a square with a vertex at its corner. Realtime: a screen. Render: a camera.
  button('editmode', pos(5), (bx, by2, k) => [
    kit.path(`M ${bx + 4 * k} ${by2 + 6 * k} L ${bx + 13 * k} ${by2 + 6 * k} L ${bx + 13 * k} ${by2 + 14 * k} L ${bx + 4 * k} ${by2 + 14 * k} Z`, { cls: 'd-ink', width: 1.1 }),
    kit.dot(bx + 13 * k, by2 + 6 * k, { r: 2.3 * k }),
  ]);
  button('viewport', pos(4), (bx, by2, k) => [
    kit.path(`M ${bx + 3 * k} ${by2 + 4 * k} L ${bx + 16 * k} ${by2 + 4 * k} L ${bx + 16 * k} ${by2 + 12 * k} L ${bx + 3 * k} ${by2 + 12 * k} Z`, { cls: 'd-ink', width: 1.2 }),
    kit.path(`M ${bx + 6.5 * k} ${by2 + 15.5 * k} L ${bx + 12.5 * k} ${by2 + 15.5 * k} M ${bx + 9.5 * k} ${by2 + 12 * k} L ${bx + 9.5 * k} ${by2 + 15.5 * k}`, { cls: 'd-ink', width: 1.2 }),
  ]);
  button('render', pos(3), (bx, by2, k) => [
    kit.path(`M ${bx + 3 * k} ${by2 + 6 * k} L ${bx + 16 * k} ${by2 + 6 * k} L ${bx + 16 * k} ${by2 + 15 * k} L ${bx + 3 * k} ${by2 + 15 * k} Z`, { cls: 'd-ink', width: 1.2 }),
    kit.circle(bx + 9.5 * k, by2 + 10.5 * k, 2.6 * k, { cls: 'd-ink', width: 1.2 }),
  ]);
  const cx = (n) => pos(n) + b / 2;
  const cy = by + b / 2;
  at.menu = [cx(2), cy];
  if (mark === 'menu') out.push(`<rect x="${pos(2)}" y="${by}" width="${b}" height="${b}" rx="${3 * s}" class="d-ui-mark" stroke-width="1.8"/>`);
  out.push(kit.path(`M ${cx(2) - 4 * s} ${cy - 2 * s} L ${cx(2)} ${cy + 3 * s} L ${cx(2) + 4 * s} ${cy - 2 * s}`, { cls: 'd-ink', width: 1.4 }));
  at.close = [cx(1), cy];
  out.push(kit.path(`M ${cx(1) - 4 * s} ${cy - 4 * s} L ${cx(1) + 4 * s} ${cy + 4 * s} M ${cx(1) + 4 * s} ${cy - 4 * s} L ${cx(1) - 4 * s} ${cy + 4 * s}`, { cls: mark === 'close' ? 'd-mark' : 'd-ink', width: 1.5 }));
  at.grip = [cx(0), cy];
  for (const gy of [-4, 0, 4]) for (const gx of [-2, 2]) out.push(kit.dot(cx(0) + gx * s, cy + gy * s, { r: 1.2 * s, cls: mark === 'grip' ? 'd-mark-fill' : 'd-dot' }));
  rows.forEach(([label, value], i) => {
    const ry = y + h + 6 * s + i * rowH;
    if (mark === label) out.push(`<rect x="${x + 6 * s}" y="${ry - 2 * s}" width="${w - 12 * s}" height="${rowH - 2 * s}" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    const split = x + w * 0.44;
    out.push(kit.text(split, ry + 14 * s, label, { anchor: 'end', size: 12 * s }));
    if (value === true || value === false) {
      const bx = split + 10 * s;
      const k = s;
      out.push(`<rect x="${bx}" y="${ry + 2 * k}" width="${15 * k}" height="${15 * k}" rx="2" class="${value ? 'd-key-mark' : 'd-key'}" stroke-width="1"/>`);
      if (value) out.push(`<path d="M ${bx + 3 * k} ${ry + 9.5 * k} L ${bx + 6.5 * k} ${ry + 13 * k} L ${bx + 12 * k} ${ry + 5 * k} L ${bx + 13.2 * k} ${ry + 6.2 * k} L ${bx + 6.5 * k} ${ry + 15.2 * k} L ${bx + 1.8 * k} ${ry + 10.7 * k} Z" class="d-key-text-mark"/>`);
    } else if (value !== undefined && value !== '') {
      const vw = w * 0.56 - 18 * s;
      out.push(`<rect x="${split + 10 * s}" y="${ry}" width="${vw}" height="${19 * s}" rx="3" class="d-sunk" stroke-width="0.8"/>`);
      out.push(kit.text(split + 10 * s + vw / 2, ry + 14 * s, String(value), { anchor: 'middle', size: 12 * s, cls: 'd-key-text' }));
    }
  });
  return { svg: out, height: h + body, at };
}

// A drop-down menu: a list of items, one picked out. An item is a label or [label, keys].
export function menu(kit, x, y, items, { w = 150, mark, size = 12 } = {}) {
  const row = size * 1.8;
  const out = [`<rect x="${x}" y="${y}" width="${w}" height="${items.length * row + 8}" rx="4" class="d-paper" stroke-width="1.2"/>`];
  items.forEach((item, i) => {
    const iy = y + 4 + i * row;
    const [label, keys] = Array.isArray(item) ? item : [item, ''];
    if (label === mark) out.push(`<rect x="${x + 4}" y="${iy}" width="${w - 8}" height="${row - 1}" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    out.push(kit.text(x + 12, iy + row * 0.68, label, { size }));
    if (keys) out.push(kit.text(x + w - 10, iy + row * 0.68, keys, { size: size - 1, anchor: 'end', cls: 'd-key-text' }));
  });
  return out;
}

export { add, sub, mul, unit, cross, dot, faceNormal };
