// Shared by this lesson's diagrams: a dense ball, ways to push its surface in and out the way
// brushes do, and the brush cursor. Not a diagram itself.
import { uvSphere, transform, drawMesh, edges, normal } from '../../../diagrams/mesh.mjs';

const len = (a) => Math.hypot(...a);
const unit = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

// The starter's ball: dense enough to sculpt, 1 m across here for drawing.
export function ball({ segments = 28, rings = 14 } = {}) {
  return uvSphere({ segments, rings, radius: 1 });
}

// Pushes the surface out along the sphere's normal near `toward` (a direction from the middle),
// falling off smoothly over `radius` radians, by `height` metres; a negative height dents it.
export function bump(m, toward, radius, height) {
  const t = unit(toward);
  return transform(m, (p) => {
    const n = unit(p);
    const angle = Math.acos(Math.max(-1, Math.min(1, n[0] * t[0] + n[1] * t[1] + n[2] * t[2])));
    const k = angle < radius ? 0.5 + 0.5 * Math.cos((Math.PI * angle) / radius) : 0;
    const r = len(p) + height * k;
    return [n[0] * r, n[1] * r, n[2] * r];
  });
}

// Lumps all over, from a few seeded waves, as broad Draw and Clay Strips strokes leave them.
export function lumpy(m, seed = 1, amount = 0.12) {
  let s = seed;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const waves = Array.from({ length: 6 }, () => ({ d: unit([rnd() - 0.5, rnd() - 0.5, rnd() - 0.5]), f: 2 + rnd() * 3, p: rnd() * 6 }));
  return transform(m, (p) => {
    const n = unit(p);
    const h = waves.reduce((sum, w) => sum + Math.sin((n[0] * w.d[0] + n[1] * w.d[1] + n[2] * w.d[2]) * w.f * Math.PI + w.p), 0) / waves.length;
    const r = len(p) * (1 + h * amount);
    return [n[0] * r, n[1] * r, n[2] * r];
  });
}

// The brush cursor seen on screen: the outer ring is the size, the inner ring the strength.
export function brushCursor(kit, x, y, r, { strength = 0.6, cls = 'd-mark' } = {}) {
  return [kit.circle(x, y, r, { cls, width: 2 }), kit.circle(x, y, r * strength, { cls, width: 1.2, dash: '3 3' })];
}

// Draws a sculpt the way it reads in Solid view: shaded faces with no wireframe, and an outline
// where the surface turns away from you.
export function drawSculpt(kit, m, v, { width = 1.8, select } = {}) {
  const facing = (f) => { const n = normal(m, m.faces[f]); return n[0] * v.toward[0] + n[1] * v.toward[1] + n[2] * v.toward[2] > 0; };
  const outline = edges(m).filter((e) => e.faces.length === 2 && facing(e.faces[0]) !== facing(e.faces[1])).map((e) => {
    const a = v.project(m.verts[e.a]);
    const b = v.project(m.verts[e.b]);
    return kit.line(a[0], a[1], b[0], b[1], { cls: 'd-ink', width });
  });
  return [drawMesh(kit, m, v, { width: 0.45, cls: 'd-guide', select }), outline];
}
