// Shared by this lesson's diagrams: a Bézier curve drawn as Blender's Edit Mode shows it, with its
// control points and the handles either side of each. Not a diagram itself.
// A point is { p: [x, y], l: [x, y], r: [x, y] }: its position and its left and right handle ends.

const f = (n) => n.toFixed(1);

// The curve itself, through every point, shaped by the handles.
export function curvePath(points, closed = false) {
  let d = `M ${f(points[0].p[0])} ${f(points[0].p[1])}`;
  const segs = closed ? points.length : points.length - 1;
  for (let i = 0; i < segs; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    d += ` C ${f(a.r[0])} ${f(a.r[1])} ${f(b.l[0])} ${f(b.l[1])} ${f(b.p[0])} ${f(b.p[1])}`;
  }
  return d;
}

export function drawCurve(kit, points, { closed = false, width = 2.4, cls = 'd-ink', handles = true, select = [], dash } = {}) {
  const out = [kit.path(curvePath(points, closed), { cls, width, dash })];
  if (!handles) return out;
  points.forEach((pt, i) => {
    const on = select.includes(i);
    for (const h of [pt.l, pt.r]) {
      if (!h) continue;
      out.push(kit.line(pt.p[0], pt.p[1], h[0], h[1], { cls: on ? 'd-mark' : 'd-guide', width: 1.4 }));
      out.push(kit.circle(h[0], h[1], 3.2, { cls: on ? 'd-mark' : 'd-guide', width: 1.4 }));
    }
    out.push(kit.dot(pt.p[0], pt.p[1], { r: 4.4, cls: on ? 'd-mark-fill' : 'd-dot' }));
  });
  return out;
}

// A point with handles pointing along `angle` (radians), `len` pixels each side.
export function pt(x, y, angle = 0, len = 30, lenLeft = len) {
  return { p: [x, y], l: [x - Math.cos(angle) * lenLeft, y - Math.sin(angle) * lenLeft], r: [x + Math.cos(angle) * len, y + Math.sin(angle) * len] };
}
