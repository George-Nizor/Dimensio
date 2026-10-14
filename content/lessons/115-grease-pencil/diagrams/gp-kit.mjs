// Hand-drawn strokes for the Grease Pencil diagrams (lessons 115 to 117). A stroke is a list of
// points in metres, in Blender's axes, so a drawing on the Front (X-Z) plane really lies on that
// plane and turns with the view. Not a diagram itself.

const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

// Points along a polyline, `steps` between each pair, so the wobble below has somewhere to go.
function resample(points, steps, closed) {
  const pts = closed ? [...points, points[0]] : points;
  const out = [];
  for (let i = 0; i < pts.length - 1; i += 1) {
    for (let s = 0; s < steps; s += 1) out.push(lerp(pts[i], pts[i + 1], s / steps));
  }
  out.push(pts[pts.length - 1]);
  return out;
}

// A stroke as a hand draws it: projected with the view `v`, nudged a little off the line, smoothed.
export function handStroke(kit, v, points, { closed = false, seed = 3, wobble = 0.8, steps = 4, cls = 'd-ink', width = 2.2 } = {}) {
  const next = kit.random(seed);
  const flat = resample(points, steps, closed).map((p) => v.project(p)).map(([x, y]) => [x + (next() - 0.5) * wobble * 2, y + (next() - 0.5) * wobble * 2]);
  return kit.smooth(flat, { cls, width });
}

// The area inside a stroke, filled in one of the face tones (or the selection tone).
export function fillShape(v, points, { cls = 'd-face-2' } = {}) {
  const pts = points.map((p) => v.project(p));
  return `<path d="M ${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ')} Z" class="${cls}"/>`;
}

// A chest drawn from two sides, the course's own prop. Front (X-Z) is the front view's outline at
// Y = 0; side (Y-Z) is the right view's outline at X = 0. Metres.
const arc = (cx, cz, rx, rz, from, to, n, plane) => Array.from({ length: n + 1 }, (_, i) => {
  const t = from + ((to - from) * i) / n;
  const a = cx + Math.cos(t) * rx;
  const b = cz + Math.sin(t) * rz;
  return plane === 'front' ? [a, 0, b] : [0, a, b];
});

export const chest = {
  front: {
    body: [[-0.5, 0, 0], [0.5, 0, 0], [0.5, 0, 0.45], [-0.5, 0, 0.45]],
    lid: [[-0.5, 0, 0.45], [-0.5, 0, 0.66], [-0.46, 0, 0.7], [0.46, 0, 0.7], [0.5, 0, 0.66], [0.5, 0, 0.45]],
    lock: [[-0.06, 0, 0.34], [0.06, 0, 0.34], [0.06, 0, 0.5], [-0.06, 0, 0.5]],
    band: [[-0.5, 0, 0.12], [0.5, 0, 0.12]],
  },
  side: {
    body: [[0, -0.3, 0], [0, 0.3, 0], [0, 0.3, 0.45], [0, -0.3, 0.45]],
    lid: arc(0, 0.45, 0.3, 0.25, 0, Math.PI, 12, 'side'),
    band: [[0, -0.3, 0.12], [0, 0.3, 0.12]],
  },
};

// Turns every point of a drawing about the Z axis, as if it had been drawn on a turned plane.
export const turnZ = (points, degrees) => {
  const a = (degrees * Math.PI) / 180;
  return points.map(([x, y, z]) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z]);
};
