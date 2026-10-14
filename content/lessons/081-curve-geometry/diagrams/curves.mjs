// Curves for this lesson's diagrams. Not a diagram itself. A Bézier path is a list of segments,
// each [point, handle out, handle in, next point], evaluated the way Blender evaluates a curve with
// a given Resolution Preview U. A tube is that path swept with a ring of points, the mesh a curve
// with Bevel Depth gives once it is converted.

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

// A point on one cubic Bézier segment at t (0 to 1).
export function bezierAt([p0, h0, h1, p1], t) {
  const u = 1 - t;
  return [0, 1, 2].map((i) => u * u * u * p0[i] + 3 * u * u * t * h0[i] + 3 * u * t * t * h1[i] + t * t * t * p1[i]);
}

// Every evaluated point of a path: `resolution` steps per segment, as Resolution Preview U.
export function pathPoints(segments, resolution = 12) {
  const out = [];
  segments.forEach((segment, s) => {
    for (let i = s === 0 ? 0 : 1; i <= resolution; i += 1) out.push(bezierAt(segment, i / resolution));
  });
  return out;
}

// A path through points with automatic handles, a third of the way to each neighbour, the shape
// Blender's Auto handles give.
export function autoPath(points) {
  const tangent = (i) => mul(sub(points[Math.min(i + 1, points.length - 1)], points[Math.max(i - 1, 0)]), i === 0 || i === points.length - 1 ? 1 / 3 : 1 / 6);
  return points.slice(0, -1).map((p, i) => [p, add(p, tangent(i)), sub(points[i + 1], tangent(i + 1)), points[i + 1]]);
}

// A sweep: `profile` (points [u, v] around the path, in metres) carried along `points`. Faces are
// quads between neighbouring rings; `caps` closes each end with one face. Frames are carried along
// the path without twisting, as Blender's Minimum twist does.
export function sweep(points, profile, { caps = false } = {}) {
  const tangents = points.map((p, i) => norm(sub(points[Math.min(i + 1, points.length - 1)], points[Math.max(i - 1, 0)])));
  let up = Math.abs(tangents[0][2]) > 0.9 ? [0, 1, 0] : [0, 0, 1];
  let n = norm(sub(up, mul(tangents[0], dot(up, tangents[0]))));
  const verts = [];
  points.forEach((p, i) => {
    const t = tangents[i];
    n = norm(sub(n, mul(t, dot(n, t))));
    const b = cross(t, n);
    for (const [u, v] of profile) verts.push(add(p, add(mul(b, u), mul(n, v))));
  });
  const k = profile.length;
  const faces = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    for (let j = 0; j < k; j += 1) {
      const a = i * k + j;
      const c = i * k + ((j + 1) % k);
      let face = [a, c, c + k, a + k];
      // Face away from the path.
      const centre = mul(face.reduce((s, f) => add(s, verts[f]), [0, 0, 0]), 0.25);
      const fn = cross(sub(verts[face[1]], verts[face[0]]), sub(verts[face[2]], verts[face[0]]));
      const out = sub(centre, mul(add(points[i], points[i + 1]), 0.5));
      if (dot(fn, out) < 0) face = face.reverse();
      faces.push(face);
    }
  }
  if (caps) {
    const first = [...Array(k).keys()];
    const last = first.map((j) => (points.length - 1) * k + j);
    const facing = (ring, dir) => {
      const fn = cross(sub(verts[ring[1]], verts[ring[0]]), sub(verts[ring[2]], verts[ring[0]]));
      return dot(fn, dir) >= 0 ? ring : [...ring].reverse();
    };
    faces.push(facing(first, mul(tangents[0], -1)), facing(last, tangents[points.length - 1]));
  }
  return { verts, faces };
}

// A round cross-section with `sides` points, as Bevel Round makes: 4 + 2 x Resolution.
export function ring(radius, sides) {
  return Array.from({ length: sides }, (_, i) => {
    const a = (i / sides) * Math.PI * 2 + Math.PI / sides;
    return [Math.cos(a) * radius, Math.sin(a) * radius];
  });
}

// A tube along a path, `radius` metres, `sides` around.
export const tube = (points, radius, sides, options) => sweep(points, ring(radius, sides), options);

// Draws a path as a line through its evaluated points, with its control points, and its handles
// when `handles` is set.
export function drawPath(kit, v, segments, { resolution = 12, cls = 'd-ink', width = 2, handles = false, points = true } = {}) {
  const pts = pathPoints(segments, resolution).map((p) => v.project(p));
  const out = [kit.polyline(pts, { cls, width })];
  if (handles) {
    for (const [p0, h0, h1, p1] of segments) {
      for (const [a, b] of [[p0, h0], [p1, h1]]) {
        const [ax, ay] = v.project(a);
        const [bx, by] = v.project(b);
        out.push(kit.line(ax, ay, bx, by, { cls: 'd-guide', width: 1.2 }), kit.circle(bx, by, 3, { cls: 'd-guide', width: 1.2 }));
      }
    }
  }
  if (points) {
    const ends = [segments[0][0], ...segments.map((s) => s[3])];
    for (const p of ends) {
      const [x, y] = v.project(p);
      out.push(kit.dot(x, y, { r: 3.6, cls: 'd-mark-fill' }));
    }
  }
  return out;
}

// A rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}

// The three pieces of the exercise, as in the curve-pieces starter: a rope sagging between two
// posts, a pipe that runs along the ground and bends up, and a handrail with a gentle bend.
export const ROPE = autoPath([[-1.5, -2.5, 1.3], [0, -2.5, 0.85], [1.5, -2.5, 1.3]]);
export const PIPE = [[[-1, 0, 0.15], [-0.67, 0, 0.15], [-0.25, 0, 0.15], [0, 0, 0.15]], [[0, 0, 0.15], [0.17, 0, 0.15], [0.3, 0, 0.28], [0.3, 0, 0.45]], [[0.3, 0, 0.45], [0.3, 0, 0.75], [0.3, 0, 1.05], [0.3, 0, 1.35]]];
export const RAIL = autoPath([[-2, 2.5, 1], [0, 2.85, 1], [2, 2.5, 1]]);

// Blender's default Bézier curve (Add > Curve > Bézier): two points 2 m apart with tilted handles.
export const DEFAULT_CURVE = [[[-1, 0, 0], [-0.5, 0.5, 0], [0, 0, 0], [1, 0, 0]]];

// A rectangle profile `w` by `h` metres, centred, as a list of [u, v] points.
export const rectangle = (w, h) => [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]];
