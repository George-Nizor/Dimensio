// Animation editors for the animation lessons' diagrams. Not a diagram itself. A strip is a
// Timeline: frame numbers along the top, keyframes as diamonds, and the blue playhead with the
// current frame in a box. Rows are the Dope Sheet: a channel list on the left and a row of keys for
// each channel. A graph is the Graph Editor: time across, value up, each F-curve drawn the way its
// interpolation and handles shape it.

// A keyframe diamond, picked out when selected.
export function diamond(kit, x, y, { sel = false, size = 6 } = {}) {
  return `<path d="M ${x} ${y - size} L ${x + size} ${y} L ${x} ${y + size} L ${x - size} ${y} Z" class="${sel ? 'd-key-mark' : 'd-key'}" stroke-width="1.3"/>`;
}

// The playhead: a blue line with the frame number in a box at the top.
export function playhead(kit, x, top, bottom, frame) {
  const label = String(frame);
  const w = 10 + label.length * 7;
  return [
    kit.line(x, top + 9, x, bottom, { cls: 'd-axis-z', width: 2 }),
    `<rect x="${x - w / 2}" y="${top}" width="${w}" height="16" rx="4" class="d-gizmo-z" stroke-width="1"/>`,
    kit.text(x, top + 12, label, { anchor: 'middle', size: 10.5, cls: 'd-gizmo-text' }),
  ];
}

// Frame numbers every `every` frames along the top of [x, x + w], for frames start to end.
// A number under the playhead's box is left out, as the box covers it in Blender.
function ruler(kit, x, y, w, start, end, every, frame) {
  const fx = (f) => x + ((f - start) / (end - start)) * w;
  const out = [`<rect x="${x - 6}" y="${y}" width="${w + 12}" height="18" rx="3" class="d-ui" stroke-width="0"/>`];
  for (let f = Math.ceil(start / every) * every; f <= end; f += every) {
    if (frame !== undefined && Math.abs(fx(f) - fx(frame)) < 22) continue;
    out.push(kit.text(fx(f), y + 13, String(f), { anchor: 'middle', size: 10 }));
  }
  return { out, fx };
}

// The Timeline: one row of keys under a ruler.
export function strip(kit, { x, y, w, h = 56, start = 0, end = 50, every = 10, frame, keys = [], sel = [] }) {
  const { out, fx } = ruler(kit, x, y, w, start, end, every, frame);
  const svg = [`<rect x="${x - 6}" y="${y}" width="${w + 12}" height="${h}" rx="4" class="d-sunk" stroke-width="1"/>`, ...out];
  for (const k of keys) svg.push(diamond(kit, fx(k), y + 18 + (h - 18) / 2, { sel: sel.includes(k) }));
  if (frame !== undefined) svg.push(playhead(kit, fx(frame), y + 1, y + h, frame));
  return { svg, fx };
}

// The Dope Sheet: channel names on the left, a row of keys for each. A channel is { label, keys,
// sel, indent }.
export function sheet(kit, { x, y, w, list = 120, start = 0, end = 100, every = 10, frame, channels = [], row = 22 }) {
  const gx = x + list;
  const gw = w - list - 12;
  const h = 18 + channels.length * row + 6;
  const { out, fx } = ruler(kit, gx + 6, y, gw - 6, start, end, every, frame);
  const svg = [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" class="d-sunk" stroke-width="1"/>`,
    `<rect x="${x}" y="${y}" width="${list}" height="${h}" rx="4" class="d-ui" stroke-width="1"/>`,
    ...out,
  ];
  channels.forEach((c, i) => {
    const cy = y + 18 + i * row + row / 2 + 2;
    svg.push(kit.text(x + 8 + (c.indent || 0) * 10, cy + 4, c.label, { size: 11 }));
    if (i > 0) svg.push(kit.line(gx, cy - row / 2, x + w, cy - row / 2, { cls: 'd-guide', width: 0.5 }));
    for (const k of c.keys || []) svg.push(diamond(kit, fx(k), cy, { sel: (c.sel || []).includes(k), size: 5.5 }));
  });
  if (frame !== undefined) svg.push(playhead(kit, fx(frame), y + 1, y + h, frame));
  return { svg, fx, rowY: (i) => y + 18 + i * row + row / 2 + 2, h };
}

// Slopes for automatic, clamped handles: flat at the ends and at every peak or dip, otherwise
// following the line between the two neighbours.
function slopes(keys) {
  return keys.map(([, v], i) => {
    if (i === 0 || i === keys.length - 1) return 0;
    const [f0, v0] = keys[i - 1];
    const [f1, v1] = keys[i + 1];
    if ((v - v0) * (v1 - v) <= 0) return 0;
    return (v1 - v0) / (f1 - f0);
  });
}

// The value of one segment from key a to key b at t (0 to 1), for each interpolation.
function segment(a, b, sa, sb, interp, t) {
  const [fa, va] = a;
  const [fb, vb] = b;
  const d = fb - fa;
  if (interp === 'constant') return [fa + d * t, va];
  if (interp === 'linear') return [fa + d * t, va + (vb - va) * t];
  if (interp === 'ease-in') return [fa + d * t, va + (vb - va) * t * t];
  if (interp === 'ease-out') return [fa + d * t, va + (vb - va) * (1 - (1 - t) * (1 - t))];
  // Bézier with handles a third of the way along.
  const p = [[fa, va], [fa + d / 3, va + (sa * d) / 3], [fb - d / 3, vb - (sb * d) / 3], [fb, vb]];
  const u = 1 - t;
  const w = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [0, 1].map((k) => p.reduce((s, q, i) => s + q[k] * w[i], 0));
}

// Points along an F-curve. `interp` is one interpolation or a list, one per segment; `vector` lists
// key indices whose handles are Vector (pointing straight at the neighbour).
export function curvePoints(keys, { interp = 'bezier', vector = [], steps = 24 } = {}) {
  const s = slopes(keys);
  const out = [];
  for (let i = 0; i < keys.length - 1; i += 1) {
    const mode = Array.isArray(interp) ? interp[i] : interp;
    const d = keys[i + 1][0] - keys[i][0];
    const toNext = (keys[i + 1][1] - keys[i][1]) / d;
    const sa = vector.includes(i) ? toNext : s[i];
    const sb = vector.includes(i + 1) ? toNext : s[i + 1];
    for (let j = i === 0 ? 0 : 1; j <= steps; j += 1) out.push(segment(keys[i], keys[i + 1], sa, sb, mode, j / steps));
  }
  return out;
}

// The Graph Editor's view: a box with a grid, frame numbers along the bottom, and a mapping from
// [frame, value] to the drawing.
export function graph(kit, { x, y, w, h, f0, f1, v0, v1, every = 10, frame }) {
  const map = ([f, v]) => [x + ((f - f0) / (f1 - f0)) * w, y + h - ((v - v0) / (v1 - v0)) * h];
  const svg = [`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" class="d-sunk" stroke-width="1"/>`];
  for (let f = Math.ceil(f0 / every) * every; f <= f1; f += every) {
    const [gx] = map([f, v0]);
    svg.push(kit.line(gx, y + 2, gx, y + h - 2, { cls: 'd-guide', width: 0.5 }), kit.text(gx, y + h + 14, String(f), { anchor: 'middle', size: 10 }));
  }
  if (frame !== undefined) svg.push(playhead(kit, map([frame, v0])[0], y - 14, y + h, frame));
  const draw = (keys, { cls = 'd-mark', width = 2.2, dash, sel = [], handles = false, ...options } = {}) => {
    const out = [kit.polyline(curvePoints(keys, options).map(map), { cls, width, dash })];
    if (handles) {
      const s = slopes(keys);
      keys.forEach(([f, v], i) => {
        const left = i > 0 ? (f - keys[i - 1][0]) / 3 : 0;
        const right = i < keys.length - 1 ? (keys[i + 1][0] - f) / 3 : 0;
        const slope = (options.vector || []).includes(i) && i < keys.length - 1 ? (keys[i + 1][1] - v) / (keys[i + 1][0] - f) : s[i];
        const a = map([f - left, v - slope * left]);
        const b = map([f + right, v + slope * right]);
        const c = map([f, v]);
        out.push(kit.line(a[0], a[1], b[0], b[1], { cls: 'd-guide', width: 1.2 }), kit.circle(a[0], a[1], 3, { cls: 'd-guide', width: 1.2 }), kit.circle(b[0], b[1], 3, { cls: 'd-guide', width: 1.2 }), kit.dot(c[0], c[1], { r: 0 }));
      });
    }
    keys.forEach((k, i) => { const [px, py] = map(k); out.push(kit.dot(px, py, { r: 4, cls: sel.includes(i) ? 'd-mark-fill' : 'd-dot' })); });
    return out;
  };
  return { svg, map, draw };
}

// A rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}
