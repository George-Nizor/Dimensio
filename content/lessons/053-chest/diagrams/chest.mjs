// The chest from this lesson, built from real geometry. Not a diagram itself.
// body(): a 1.2 by 0.8 by 0.6 m box, its top face inset 12% and extruded 0.45 m down to hollow it.
// lid(): half of a 12-sided cylinder lying along X, radius 0.4 m and 1.2 m long, its ends closed
// with triangle fans and its bottom with two faces, standing on the body's top.
// band(x): a metal band round the lid at x, a slightly larger half ring 0.1 m wide.
// Each returns { mesh, parts } where parts maps 'wood', 'metal' and 'inside' to face indices.
import { box, facesWhere, inset, extrude, mesh, orientOutward, rotate, translate, join } from '../../../diagrams/mesh.mjs';

export const SIZE = { width: 1.2, depth: 0.8, height: 0.6 };

export function body() {
  let m = box({ size: [SIZE.width, SIZE.depth, SIZE.height], center: [0, 0, SIZE.height / 2] });
  const top = facesWhere(m, (c, n) => n[2] > 0.9)[0];
  const ins = inset(m, top, 0.12);
  const ex = extrude(ins.mesh, [ins.face], -0.45);
  m = ex.mesh;
  // Extruding down by a negative distance leaves the new walls facing into the hollow.
  const walls = m.faces.map((f, i) => i).slice(ins.mesh.faces.length);
  const inside = [ins.face, ...walls];
  const wood = m.faces.map((f, i) => i).filter((i) => !inside.includes(i));
  return { mesh: m, parts: { wood, metal: [], inside } };
}

// Half a ring of `segments` faces round the X axis from y = -r to y = r over the top, between x0
// and x1, closed at the ends with triangle fans and underneath with two faces.
function halfCylinder(x0, x1, r, z, segments = 6) {
  const verts = [];
  const faces = [];
  const arc = (x) => Array.from({ length: segments + 1 }, (_, i) => {
    const a = Math.PI - (Math.PI * i) / segments;
    return verts.push([x, Math.cos(a) * r, z + Math.sin(a) * r]) - 1;
  });
  const a0 = arc(x0);
  const a1 = arc(x1);
  const c0 = verts.push([x0, 0, z]) - 1;
  const c1 = verts.push([x1, 0, z]) - 1;
  for (let i = 0; i < segments; i += 1) faces.push([a0[i], a0[i + 1], a1[i + 1], a1[i]]);
  for (let i = 0; i < segments; i += 1) {
    faces.push([c0, a0[i + 1], a0[i]]);
    faces.push([c1, a1[i], a1[i + 1]]);
  }
  faces.push([a0[0], c0, c1, a1[0]], [c0, a0[segments], a1[segments], c1]);
  return orientOutward(mesh(verts, faces));
}

export function lid() {
  const m = halfCylinder(-SIZE.width / 2, SIZE.width / 2, SIZE.depth / 2, SIZE.height);
  return { mesh: m, parts: { wood: m.faces.map((f, i) => i), metal: [], inside: [] } };
}

// A thin half ring between radius r0 and r1 round the X axis, from x0 to x1: a metal band.
function halfRing(x0, x1, r0, r1, z, segments = 6) {
  const verts = [];
  const ring = (x, r) => Array.from({ length: segments + 1 }, (_, i) => {
    const a = Math.PI - (Math.PI * i) / segments;
    return verts.push([x, Math.cos(a) * r, z + Math.sin(a) * r]) - 1;
  });
  const in0 = ring(x0, r0);
  const out0 = ring(x0, r1);
  const in1 = ring(x1, r0);
  const out1 = ring(x1, r1);
  const faces = [];
  for (let i = 0; i < segments; i += 1) {
    faces.push([out0[i], out0[i + 1], out1[i + 1], out1[i]]);
    faces.push([in0[i], in1[i], in1[i + 1], in0[i + 1]]);
    faces.push([in0[i], in0[i + 1], out0[i + 1], out0[i]]);
    faces.push([in1[i], out1[i], out1[i + 1], in1[i + 1]]);
  }
  faces.push([in0[0], out0[0], out1[0], in1[0]], [in0[segments], in1[segments], out1[segments], out0[segments]]);
  // Faces point away from the ring's axis line at the band's middle, which is right for a band
  // this thin except for the inner surface, which the lid hides.
  const m = mesh(verts, faces);
  const mid = [(x0 + x1) / 2, 0, z];
  m.faces = m.faces.map((f) => {
    const c = f.reduce((s, i) => s.map((v, k) => v + verts[i][k] / f.length), [0, 0, 0]);
    const n = (() => { const nn = [0, 0, 0]; for (let i = 0; i < f.length; i += 1) { const a = verts[f[i]]; const b = verts[f[(i + 1) % f.length]]; nn[0] += (a[1] - b[1]) * (a[2] + b[2]); nn[1] += (a[2] - b[2]) * (a[0] + b[0]); nn[2] += (a[0] - b[0]) * (a[1] + b[1]); } return nn; })();
    const d = c.map((v, k) => v - mid[k]);
    return n[0] * d[0] + n[1] * d[1] + n[2] * d[2] < 0 ? [...f].reverse() : f;
  });
  return m;
}

export function band(x, width = 0.1) {
  const m = halfRing(x - width / 2, x + width / 2, SIZE.depth / 2, SIZE.depth / 2 + 0.035, SIZE.height);
  return { mesh: m, parts: { wood: [], metal: m.faces.map((f, i) => i), inside: [] } };
}

export function lock() {
  const m = box({ size: [0.18, 0.06, 0.2], center: [0, -SIZE.depth / 2 - 0.03, SIZE.height - 0.02] });
  return { mesh: m, parts: { wood: [], metal: m.faces.map((f, i) => i), inside: [] } };
}

// Turns a part about the hinge, the lid's back bottom edge, by `degrees` on X. Negative opens it.
export function openOnHinge(part, degrees) {
  const hinge = [0, SIZE.depth / 2, SIZE.height];
  const moved = translate(rotate(translate(part.mesh, hinge.map((v) => -v)), 'x', degrees), hinge);
  return { mesh: moved, parts: part.parts };
}

// Draws parts one after another, each sorted on its own, so parts that touch never cut into each
// other. Give them back to front.
export function drawParts(kit, v, parts, draw, options = {}) {
  return parts.map((p) => draw(kit, p.mesh, v, classOf(p.parts), { width: 1.4, darken: p.parts.inside, ...options }));
}

// Several parts as one mesh, their face lists shifted to match.
export function combine(...parts) {
  const out = { mesh: join(...parts.map((p) => p.mesh)), parts: { wood: [], metal: [], inside: [] } };
  let offset = 0;
  for (const p of parts) {
    for (const key of ['wood', 'metal', 'inside']) out.parts[key].push(...(p.parts[key] || []).map((i) => i + offset));
    offset += p.mesh.faces.length;
  }
  return out;
}

export const COLOURS = { wood: 'd-face-sel', metal: 'd-face-2', inside: 'd-face-3' };

export function classOf(parts) {
  const map = new Map();
  for (const key of ['inside', 'metal', 'wood']) for (const f of parts[key]) map.set(f, COLOURS[key]);
  return (f) => map.get(f) || COLOURS.wood;
}
