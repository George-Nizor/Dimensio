// Drawing helpers shared by this lesson's diagrams: panels, simple interface pieces, a jointed
// figure for poses, bones, a timeline, node boxes and arrows for forces. Not a diagram itself.
// The same file sits in each of lessons 103 to 114, so a lesson never imports from another.

const r2 = (v) => Number(v.toFixed(2));

// A rounded frame for one small view, with an optional label under it.
export function panel(kit, x, y, w, h, label, { tone } = {}) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="${tone === 'mark' ? 'd-ui-mark' : 'd-ui'}" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}

// ---- Interface pieces ----------------------------------------------------------------------

// A row of the Properties editor: a label on the left and a field on the right.
export function field(kit, x, y, w, label, value, { on = false, labelWidth = 0.45, size = 11 } = {}) {
  const lx = x + w * labelWidth;
  return [
    kit.text(lx - 8, y + 14, label, { anchor: 'end', size }),
    `<rect x="${r2(lx)}" y="${y}" width="${r2(w - w * labelWidth)}" height="20" rx="4" class="${on ? 'd-ui-mark' : 'd-sunk'}" stroke-width="1"/>`,
    kit.text(lx + 8, y + 14, value, { size, cls: on ? 'd-label' : 'd-label' }),
  ];
}

// A checkbox with its label to the right.
export function checkbox(kit, x, y, label, on, { size = 11, tone } = {}) {
  const cls = tone === 'bad' ? 'd-key-bad' : on ? 'd-key-mark' : 'd-key';
  const out = [`<rect x="${x}" y="${y}" width="14" height="14" rx="3" class="${cls}" stroke-width="1.4"/>`];
  if (on) out.push(kit.polyline([[x + 3, y + 7.5], [x + 6, y + 10.5], [x + 11, y + 3.5]], { cls: 'd-ink', width: 2 }));
  out.push(kit.text(x + 22, y + 11.5, label, { size }));
  return out;
}

// A button, picked out when `on`.
export function button(kit, x, y, w, label, { on = false, size = 11, h = 22 } = {}) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" class="${on ? 'd-ui-mark' : 'd-ui'}" stroke-width="1.2"/>`,
    kit.text(x + w / 2, y + h / 2 + 4, label, { anchor: 'middle', size }),
  ];
}

// A menu path written as boxes joined by small arrows: ['Object', 'Rigid Body', 'Add Active'].
export function menuPath(kit, x, y, items, { size = 11, gap = 16, last = true } = {}) {
  const out = [];
  let cx = x;
  items.forEach((item, i) => {
    const w = item.length * size * 0.56 + 16;
    const on = last && i === items.length - 1;
    out.push(`<rect x="${r2(cx)}" y="${y}" width="${r2(w)}" height="22" rx="4" class="${on ? 'd-ui-mark' : 'd-ui'}" stroke-width="1"/>`);
    out.push(kit.text(cx + w / 2, y + 15, item, { anchor: 'middle', size }));
    cx += w;
    if (i < items.length - 1) {
      out.push(kit.line(cx + 3, y + 11, cx + gap - 4, y + 11, { cls: 'd-guide', width: 1.4 }));
      out.push(kit.arrowhead(cx + gap - 4, y + 11, 0, { size: 5, cls: 'd-guide', width: 1.4 }));
      cx += gap;
    }
  });
  return { svg: out, width: cx - x };
}

// ---- A jointed figure, seen from the side or the front -------------------------------------

// The middle joint of a two-part limb from `a` to `c`, with parts `l1` and `l2` long, bending
// towards `side` (+1 or -1 about the line from a to c, in screen space).
export function joint(a, c, l1, l2, side = 1) {
  const dx = c[0] - a[0];
  const dy = c[1] - a[1];
  let d = Math.hypot(dx, dy);
  d = Math.min(d, l1 + l2 - 0.001);
  const along = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(l1 * l1 - along * along, 0));
  const ux = dx / (Math.hypot(dx, dy) || 1);
  const uy = dy / (Math.hypot(dx, dy) || 1);
  return [a[0] + ux * along - uy * h * side, a[1] + uy * along + ux * h * side];
}

// A walking figure seen from the right side, facing right, drawn with thick round strokes like
// a wooden mannequin. Points are in diagram units with y down. `pose` gives:
//   hip [x, y], chest [x, y] (top of the spine), head [x, y],
//   near and far: { foot: [x, y], toe: [x, y], hand: [x, y] }.
// The near side is ink, the far side grey, so the two legs read apart.
export function walker(kit, pose, { s = 1, leg = [37, 37], arm = [27, 26], width = 7, mark } = {}) {
  const out = [];
  const limb = (from, to, lens, bend, cls, w) => {
    const knee = joint(from, to, lens[0] * s, lens[1] * s, bend);
    return [kit.polyline([from, knee, to], { cls, width: w })];
  };
  const side = (which, cls) => {
    const p = pose[which];
    const shoulder = [pose.chest[0], pose.chest[1] + 6 * s];
    return [
      limb(pose.hip, p.foot, leg, -1, cls === 'd-ink' && mark === which ? 'd-mark' : cls, width * s),
      p.toe ? kit.line(p.foot[0], p.foot[1], p.toe[0], p.toe[1], { cls: cls === 'd-ink' && mark === which ? 'd-mark' : cls, width: width * 0.8 * s }) : '',
      limb(shoulder, p.hand, arm, 1, cls, width * 0.8 * s),
    ];
  };
  out.push(side('far', 'd-guide'));
  out.push(kit.line(pose.hip[0], pose.hip[1], pose.chest[0], pose.chest[1], { cls: 'd-ink', width: width * 1.5 * s }));
  out.push(`<circle cx="${r2(pose.head[0])}" cy="${r2(pose.head[1])}" r="${r2(9 * s)}" class="d-face-2"/>`);
  out.push(kit.circle(pose.head[0], pose.head[1], 9 * s, { cls: 'd-ink', width: 2 * s }));
  out.push(side('near', 'd-ink'));
  return out;
}

// One of Blender's octahedral bones from head to tail, in screen space: a long thin diamond
// with its widest point a tenth of the way along, and a small ball at each end.
export function bone(kit, head, tail, { cls = 'd-ink', width = 1.4, fat = 0.1, fill = 'd-face-1' } = {}) {
  const dx = tail[0] - head[0];
  const dy = tail[1] - head[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const wx = head[0] + dx * 0.1;
  const wy = head[1] + dy * 0.1;
  const w = Math.min(len * fat, 7);
  const pts = [head, [wx + nx * w, wy + ny * w], tail, [wx - nx * w, wy - ny * w]];
  return [
    `<path d="M ${pts.map(([x, y]) => `${r2(x)} ${r2(y)}`).join(' L ')} Z" class="${fill}"/>`,
    kit.polyline([...pts, pts[0]], { cls, width }),
    kit.circle(head[0], head[1], Math.max(w * 0.45, 1.6), { cls, width: width * 0.9 }),
  ];
}

// ---- Time ----------------------------------------------------------------------------------

// A Timeline strip from frame `start` to `end`: ticks, keyframe diamonds at `keys`, and labels
// under chosen frames. `marked` keys are drawn in the accent colour.
export function timeline(kit, x, y, w, { start = 1, end = 25, keys = [], marked = [], labels = [], range, current } = {}) {
  const fx = (f) => x + ((f - start) / (end - start)) * w;
  const out = [`<rect x="${x - 8}" y="${y - 14}" width="${w + 16}" height="28" rx="5" class="d-sunk" stroke-width="1"/>`];
  if (range) out.push(`<rect x="${r2(fx(range[0]))}" y="${y - 14}" width="${r2(fx(range[1]) - fx(range[0]))}" height="28" class="d-ui-mark" stroke-width="0" opacity="0.6"/>`);
  for (let f = start; f <= end; f += 1) out.push(kit.line(fx(f), y + 8, fx(f), y + (f % 6 === 1 ? 14 : 11), { cls: 'd-guide', width: 1 }));
  for (const f of keys) {
    const on = marked.includes(f);
    const px = fx(f);
    out.push(`<path d="M ${r2(px)} ${y - 7} L ${r2(px + 6)} ${y - 1} L ${r2(px)} ${y + 5} L ${r2(px - 6)} ${y - 1} Z" class="${on ? 'd-key-mark' : 'd-key'}" stroke-width="1.3"/>`);
  }
  if (current !== undefined) out.push(kit.line(fx(current), y - 18, fx(current), y + 18, { cls: 'd-mark', width: 2 }));
  for (const [f, label] of labels) out.push(kit.text(fx(f), y + 30, label, { anchor: 'middle', size: 11 }));
  return { svg: out, fx };
}

// ---- Nodes ---------------------------------------------------------------------------------

// A node box in a node editor: a title bar and sockets. inputs and outputs are names; each
// socket's position comes back in `at` so links can be drawn between them.
export function node(kit, x, y, w, title, { inputs = [], outputs = [], tone, size = 11, rows } = {}) {
  const rowH = 18;
  const n = rows ?? Math.max(inputs.length + outputs.length, 1);
  const h = 24 + n * rowH + 6;
  const out = [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" class="${tone === 'mark' ? 'd-ui-mark' : 'd-paper'}" stroke-width="1.3"/>`,
    `<rect x="${x}" y="${y}" width="${w}" height="22" rx="5" class="d-sunk" stroke-width="1.3"/>`,
    kit.text(x + 8, y + 15, title, { size, cls: 'd-label' }),
  ];
  if (tone === 'bad') out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" class="d-bad" fill="none" stroke-width="2"/>`);
  const at = {};
  outputs.forEach((name, i) => {
    const sy = y + 24 + rowH * (i + 0.6);
    at[`out:${name}`] = [x + w, sy];
    out.push(kit.text(x + w - 10, sy + 4, name, { anchor: 'end', size: size - 1 }));
    out.push(`<circle cx="${x + w}" cy="${r2(sy)}" r="4" class="d-key" stroke-width="1.3"/>`);
  });
  inputs.forEach((name, i) => {
    const sy = y + 24 + rowH * (outputs.length + i + 0.6);
    at[`in:${name}`] = [x, sy];
    out.push(kit.text(x + 10, sy + 4, name, { size: size - 1 }));
    out.push(`<circle cx="${x}" cy="${r2(sy)}" r="4" class="d-key" stroke-width="1.3"/>`);
  });
  return { svg: out, at, h };
}

// A link between two sockets, as a node editor draws it.
export function link(kit, a, b, { cls = 'd-ink', width = 1.6, dash } = {}) {
  const mx = (a[0] + b[0]) / 2;
  return kit.path(`M ${r2(a[0])} ${r2(a[1])} C ${r2(mx)} ${r2(a[1])} ${r2(mx)} ${r2(b[1])} ${r2(b[0])} ${r2(b[1])}`, { cls, width, dash });
}

// ---- Forces and motion ---------------------------------------------------------------------

// A straight arrow in screen space.
export function push(kit, x1, y1, x2, y2, { cls = 'd-mark', width = 2, size = 8, dash } = {}) {
  return [kit.line(x1, y1, x2, y2, { cls, width, dash }), kit.arrowhead(x2, y2, Math.atan2(y2 - y1, x2 - x1), { cls, width, size })];
}

// A small leaf seen from above or the side: a pointed oval turned by `angle` degrees.
export function leaf(kit, x, y, { size = 7, angle = 0, cls = 'd-ink' } = {}) {
  const a = (angle * Math.PI) / 180;
  const p = (u, v) => [x + Math.cos(a) * u - Math.sin(a) * v, y + Math.sin(a) * u + Math.cos(a) * v];
  const [x0, y0] = p(-size, 0);
  const [x1, y1] = p(size, 0);
  const [c1x, c1y] = p(0, -size * 0.7);
  const [c2x, c2y] = p(0, size * 0.7);
  return `<path d="M ${r2(x0)} ${r2(y0)} Q ${r2(c1x)} ${r2(c1y)} ${r2(x1)} ${r2(y1)} Q ${r2(c2x)} ${r2(c2y)} ${r2(x0)} ${r2(y0)} Z" class="d-face-sel ${cls}" stroke-width="1.3"/>`;
}

// A ground line with short hatching under it.
export function ground(kit, x1, x2, y, { step = 14 } = {}) {
  const out = [kit.line(x1, y, x2, y, { cls: 'd-ink', width: 2 })];
  for (let x = x1 + 6; x < x2; x += step) out.push(kit.line(x, y + 2, x - 6, y + 8, { cls: 'd-guide', width: 1.2 }));
  return out;
}

// ---- Bodies made of capsules ---------------------------------------------------------------

// One capsule from a to b with radius r, as a path (screen space).
function capsulePath(a, b, r) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * r;
  const ny = (dx / len) * r;
  return `M ${r2(a[0] + nx)} ${r2(a[1] + ny)} L ${r2(b[0] + nx)} ${r2(b[1] + ny)} A ${r2(r)} ${r2(r)} 0 0 0 ${r2(b[0] - nx)} ${r2(b[1] - ny)} L ${r2(a[0] - nx)} ${r2(a[1] - ny)} A ${r2(r)} ${r2(r)} 0 0 0 ${r2(a[0] + nx)} ${r2(a[1] + ny)} Z`;
}

// A body silhouette from capsules [[a, b, r], ...]: one outline round the whole shape, no lines
// where the parts overlap. `fill` is a face class; `edge` the outline's stroke class.
export function silhouette(kit, parts, { fill = 'd-face-2', edge = 'd-ink', width = 2.2 } = {}) {
  const d = parts.map(([a, b, r]) => capsulePath(a, b, r)).join(' ');
  return [
    `<path d="${d}" class="${fill} ${edge}" stroke-width="${width * 2}" stroke-linejoin="round"/>`,
    `<path d="${d}" class="${fill}"/>`,
  ];
}

// ---- Godot's editor, as plain schematics ---------------------------------------------------

// A Scene dock: rows of [depth, name, picked out?]. Node icons are small squares.
export function sceneDock(kit, x, y, w, rows, { title = 'Scene' } = {}) {
  const out = [
    `<rect x="${x}" y="${y}" width="${w}" height="${30 + rows.length * 22}" rx="6" class="d-ui" stroke-width="1"/>`,
    kit.text(x + 10, y + 19, title, { size: 11 }),
  ];
  rows.forEach(([depth, name, on], i) => {
    const ry = y + 28 + i * 22;
    out.push(`<rect x="${x + 6}" y="${ry}" width="${w - 12}" height="20" rx="3" class="${on ? 'd-ui-mark' : 'd-ui'}" stroke-width="${on ? 1 : 0}"/>`);
    out.push(`<rect x="${x + 12 + depth * 16}" y="${ry + 5}" width="10" height="10" rx="2" class="d-key" stroke-width="1.2"/>`);
    out.push(kit.text(x + 28 + depth * 16, ry + 14, name, { size: 11 }));
  });
  return out;
}

// The play button: a small triangle in a key-cap box.
export function playButton(kit, x, y, { on = false } = {}) {
  return [
    `<rect x="${x}" y="${y}" width="24" height="22" rx="4" class="${on ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`,
    `<path d="M ${x + 9} ${y + 6} L ${x + 17} ${y + 11} L ${x + 9} ${y + 16} Z" class="${on ? 'd-paper' : 'd-face-3'}"/>`,
  ];
}

// The loop sign, a small circle with an arrowhead, after an animation's name.
export function loopSign(kit, x, y, { cls = 'd-mark' } = {}) {
  return [kit.path(`M ${x + 5} ${y - 4} A 5 5 0 1 0 ${x + 5.5} ${y + 3}`, { cls, width: 1.5 }), kit.arrowhead(x + 5, y - 4, -0.3, { size: 4, cls, width: 1.5 })];
}

// Two axes seen flat on, as in a top view: X to the right and Y up, in Blender's colours.
export function axes2d(kit, x, y, { length = 36, labels = ['X', 'Y'], names = ['x', 'y'] } = {}) {
  const [a, b] = names;
  return [
    kit.line(x, y, x + length, y, { cls: `d-axis-${a}`, width: 2 }), kit.arrowhead(x + length, y, 0, { cls: `d-axis-${a}`, size: 7, width: 2 }),
    kit.text(x + length + 10, y + 4, labels[0], { cls: `d-label d-axis-${a}-text`, anchor: 'middle', size: 12 }),
    kit.line(x, y, x, y - length, { cls: `d-axis-${b}`, width: 2 }), kit.arrowhead(x, y - length, -Math.PI / 2, { cls: `d-axis-${b}`, size: 7, width: 2 }),
    kit.text(x, y - length - 8, labels[1], { cls: `d-label d-axis-${b}-text`, anchor: 'middle', size: 12 }),
  ];
}
