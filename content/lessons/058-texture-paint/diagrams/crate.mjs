// A crate with paint on it, for this lesson's diagrams. Not a diagram itself. The crate is a 1 m
// cube in a wood colour, orange darkened a little; paint lies on its faces as shapes given in each face's own (s, t)
// coordinates, 0 to 1, from its lower left corner as you look at it.
import { cube, view, normal, centroid } from '../../../diagrams/mesh.mjs';

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const d = (pts) => `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z`;

// Darkens in both themes: d-face-3 is dark in the dark theme, d-dot in the light one.
export const DIRT = (path, opacity = 1) => [
  `<path d="${path}" class="d-face-3" stroke-width="0" opacity="${opacity}" style="mix-blend-mode:multiply"/>`,
  `<path d="${path}" class="d-dot" stroke-width="0" opacity="${(0.45 * opacity).toFixed(2)}" style="mix-blend-mode:multiply"/>`,
];
export const WEAR = (path, opacity = 0.7) => `<path d="${path}" class="d-gizmo-text" stroke-width="0" opacity="${opacity}"/>`;

// For each visible face, a function from (s, t) to the screen. s runs along the face's first edge,
// t along its last, so (0, 0) is the face's first corner.
function faceMaps(m, v) {
  return m.faces.map((f, i) => ({ i, f, n: normal(m, f), map: (s, t) => {
    const p0 = m.verts[f[0]];
    const p1 = m.verts[f[1]];
    const p3 = m.verts[f[3]];
    return v.project([0, 1, 2].map((k) => p0[k] + (p1[k] - p0[k]) * s + (p3[k] - p0[k]) * t));
  } })).filter(({ n }) => dot(n, v.toward) > 1e-6).sort((a, b) => v.depth(centroid(m, a.f)) - v.depth(centroid(m, b.f)));
}

// paint(faceInfo) returns the SVG to lay on a face; faceInfo has the face's map, normal and index.
export function crate(kit, { at = [150, 140], scale = 90, paint = () => [] } = {}) {
  const m = cube(1);
  const v = view({ at, scale });
  const out = [];
  for (const face of faceMaps(m, v)) {
    const corners = [face.map(0, 0), face.map(1, 0), face.map(1, 1), face.map(0, 1)];
    out.push(`<path d="${d(corners)}" class="d-mark-fill" stroke-width="0"/>`, ...DIRT(d(corners), face.n[2] > 0.5 ? 0.15 : face.n[0] > 0.5 ? 0.5 : 0.3));
    const clip = `crate-${Math.round(at[0])}-${Math.round(at[1])}-${face.i}`;
    out.push(`<clipPath id="${clip}"><path d="${d(corners)}"/></clipPath>`);
    out.push(`<g clip-path="url(#${clip})">${[paint(face)].flat(Infinity).join('')}</g>`);
    out.push(kit.polyline([...corners, corners[0]], { cls: 'd-ink', width: 1.6 }));
  }
  return out;
}

// Dirt along the bottom of a side face: a band with a ragged top edge, darker at the very bottom.
export function dirt(face, { height = 0.28, seed = 3 } = {}) {
  if (Math.abs(face.n[2]) > 0.5) return [];
  let state = seed + face.i * 7;
  const next = () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296; };
  // Which corner is low: find t direction with s along the bottom edge.
  const edge = [];
  for (let k = 0; k <= 12; k += 1) edge.push([k / 12, height * (0.7 + 0.6 * next())]);
  const lowAlong = face.map(0, 0)[1] > face.map(0, 1)[1];
  const pt = (s, h) => (lowAlong ? face.map(s, h) : face.map(s, 1 - h));
  const band = [pt(0, 0), pt(1, 0), ...edge.reverse().map(([s, h]) => pt(s, h))];
  const low = [pt(0, 0), pt(1, 0), pt(1, height * 0.35), pt(0, height * 0.35)];
  return [...DIRT(d(band), 0.8), ...DIRT(d(low), 0.6)];
}

// Light wear along the edges of a face: thin strips at its borders, broken in places.
export function wear(face, { width = 0.05, seed = 5 } = {}) {
  let state = seed + face.i * 13;
  const next = () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296; };
  const out = [];
  for (const side of [0, 1, 2, 3]) {
    for (let k = 0; k < 4; k += 1) {
      if (next() < 0.35) continue;
      const a = k / 4 + 0.02;
      const b = (k + 1) / 4 - 0.02;
      const w = width * (0.6 + 0.8 * next());
      const rect = side === 0 ? [[a, 0], [b, 0], [b, w], [a, w]] : side === 1 ? [[1 - w, a], [1, a], [1, b], [1 - w, b]] : side === 2 ? [[a, 1 - w], [b, 1 - w], [b, 1], [a, 1]] : [[0, a], [w, a], [w, b], [0, b]];
      out.push(WEAR(d(rect.map(([s, t]) => face.map(s, t)))));
    }
  }
  return out;
}
