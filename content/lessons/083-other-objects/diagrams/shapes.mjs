// Shapes for this lesson's diagrams. Not a diagram itself.
//
// Metaballs: each ball adds r^2 / d^2 to a field, and the surface is where the field reaches 1, so
// a ball on its own is a circle of radius r and two close balls flow into one shape. The outline
// is traced with marching squares, the way a metaball becomes a mesh at a given resolution.
//
// NURBS: a 4 by 4 grid of control points evaluated as a smooth patch that ends at the corner points
// and is pulled toward the inner ones, like Add > Surface > NURBS Surface with its middle raised.

export function field(balls) {
  return (x, y) => balls.reduce((s, b) => s + (b.r * b.r) / Math.max((x - b.x) ** 2 + (y - b.y) ** 2, 1e-6), 0);
}

// Closed outlines where f(x, y) = 1 inside the box [x0, y0, x1, y1], traced on a grid of `step`.
export function outlines(f, [x0, y0, x1, y1], step = 2) {
  const nx = Math.ceil((x1 - x0) / step);
  const ny = Math.ceil((y1 - y0) / step);
  const v = (i, j) => f(x0 + i * step, y0 + j * step) - 1;
  const lerp = (a, b, va, vb) => a + ((b - a) * va) / (va - vb);
  const segments = [];
  for (let i = 0; i < nx; i += 1) {
    for (let j = 0; j < ny; j += 1) {
      const c = [v(i, j), v(i + 1, j), v(i + 1, j + 1), v(i, j + 1)];
      const p = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]].map(([a, b]) => [x0 + a * step, y0 + b * step]);
      const cross = [];
      for (let k = 0; k < 4; k += 1) {
        const a = k;
        const b = (k + 1) % 4;
        if ((c[a] > 0) !== (c[b] > 0)) cross.push([lerp(p[a][0], p[b][0], c[a], c[b]), lerp(p[a][1], p[b][1], c[a], c[b])]);
      }
      if (cross.length === 2) segments.push(cross);
      if (cross.length === 4) segments.push([cross[0], cross[1]], [cross[2], cross[3]]);
    }
  }
  // Chain the segments into loops.
  const key = ([x, y]) => `${x.toFixed(3)},${y.toFixed(3)}`;
  const ends = new Map();
  segments.forEach((s, i) => s.forEach((p) => { const k = key(p); if (!ends.has(k)) ends.set(k, []); ends.get(k).push(i); }));
  const used = new Set();
  const loops = [];
  for (let start = 0; start < segments.length; start += 1) {
    if (used.has(start)) continue;
    used.add(start);
    const loop = [...segments[start]];
    for (;;) {
      const next = (ends.get(key(loop[loop.length - 1])) || []).find((i) => !used.has(i));
      if (next === undefined) break;
      used.add(next);
      const [a, b] = segments[next];
      loop.push(key(a) === key(loop[loop.length - 1]) ? b : a);
    }
    loops.push(loop);
  }
  return loops;
}

// A filled metaball outline.
export function drawBlob(kit, balls, box, { cls = 'd-face-1', width = 2 } = {}) {
  return outlines(field(balls), box).map((loop) => `<path d="M ${loop.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z" class="${cls} d-ink" stroke-width="${width}" stroke-linejoin="round"/>`);
}

// The selection ring Blender draws around each metaball element.
export const ballRing = (kit, b) => kit.circle(b.x, b.y, b.r * 0.55, { cls: 'd-mark', width: 1.4, dash: '3 3' });

// A NURBS-like patch: a cubic Bézier patch on a 4 by 4 net, 2 m square, with the middle four
// points raised by `lift` metres. Returns the net and a mesh with 4 x res - 1 faces along each side, as Resolution Preview U and V = res give.
export function dome({ lift = 1.2, res = 3, size = 2 } = {}) {
  const net = [];
  for (let j = 0; j < 4; j += 1) {
    net.push([]);
    for (let i = 0; i < 4; i += 1) {
      const inner = i > 0 && i < 3 && j > 0 && j < 3;
      net[j].push([(-0.5 + i / 3) * size, (-0.5 + j / 3) * size, inner ? lift : 0]);
    }
  }
  const b = (t) => [(1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t * t, t ** 3];
  const at = (u, v) => {
    const bu = b(u);
    const bv = b(v);
    const p = [0, 0, 0];
    for (let j = 0; j < 4; j += 1) for (let i = 0; i < 4; i += 1) for (let k = 0; k < 3; k += 1) p[k] += bu[i] * bv[j] * net[j][i][k];
    return p;
  };
  const n = 4 * res - 1; // as many faces per side as Blender gives a 4-point surface at this resolution
  const verts = [];
  for (let j = 0; j <= n; j += 1) for (let i = 0; i <= n; i += 1) verts.push(at(i / n, j / n));
  const faces = [];
  for (let j = 0; j < n; j += 1) for (let i = 0; i < n; i += 1) faces.push([j * (n + 1) + i, j * (n + 1) + i + 1, (j + 1) * (n + 1) + i + 1, (j + 1) * (n + 1) + i]);
  return { net, mesh: { verts, faces } };
}

// The control net: dashed lines between neighbouring points, a dot on each point.
export function drawNet(kit, v, net, { select = [] } = {}) {
  const out = [];
  for (let j = 0; j < 4; j += 1) {
    for (let i = 0; i < 4; i += 1) {
      const [x, y] = v.project(net[j][i]);
      if (i < 3) { const [x2, y2] = v.project(net[j][i + 1]); out.push(kit.line(x, y, x2, y2, { cls: 'd-guide', width: 1.2, dash: '4 3' })); }
      if (j < 3) { const [x2, y2] = v.project(net[j + 1][i]); out.push(kit.line(x, y, x2, y2, { cls: 'd-guide', width: 1.2, dash: '4 3' })); }
    }
  }
  for (let j = 0; j < 4; j += 1) {
    for (let i = 0; i < 4; i += 1) {
      const [x, y] = v.project(net[j][i]);
      const on = select.some(([a, b]) => a === i && b === j);
      out.push(kit.dot(x, y, { r: on ? 4 : 3, cls: on ? 'd-mark-fill' : 'd-dot' }));
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
