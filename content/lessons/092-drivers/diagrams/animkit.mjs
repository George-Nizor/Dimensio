// Helpers shared by the diagrams of lessons 92 to 96 (drivers, shape keys, actions, the NLA editor
// and the animated chest). Not a diagram itself. Interface pieces are plain schematics drawn with
// the kit's classes; models are built from real geometry with the mesh kit.
import { box, cylinder, join, translate, rotate, drawMesh } from '../../../diagrams/mesh.mjs';

// ---- Frames, fields and menus ------------------------------------------------------------------

// A rounded frame for one small view or panel, with an optional label under it.
export function frame(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}

// A field or button: a box with text in it. `mark` picks it out in the selection colour.
export function field(kit, x, y, w, text, { mark = false, h = 22, anchor = 'middle', size = 12, bad = false } = {}) {
  const cls = bad ? 'd-key-bad' : mark ? 'd-ui-mark' : 'd-key';
  const tx = anchor === 'middle' ? x + w / 2 : anchor === 'start' ? x + 7 : x + w - 7;
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" class="${cls}" stroke-width="${mark || bad ? 1.6 : 1}"/>`,
    text ? kit.text(tx, y + h / 2 + size * 0.36, text, { anchor, size, cls: bad ? 'd-key-text d-key-text-mark' : 'd-label' }) : '',
  ];
}

// A labelled row, as in a Properties panel: the label right-aligned, then its field.
export function row(kit, x, y, labelW, fieldW, label, value, options = {}) {
  return [
    kit.text(x + labelW - 8, y + 15, label, { anchor: 'end', size: 12 }),
    field(kit, x + labelW, y, fieldW, value, options),
  ];
}

// A menu: a column of items, each a string or [label, shortcut]. `mark` names the item picked out.
export function menu(kit, x, y, items, { w = 170, mark, title, itemH = 22 } = {}) {
  const top = title ? 24 : 0;
  const h = top + items.length * itemH + 8;
  const out = [`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" class="d-paper" stroke-width="1"/>`];
  if (title) out.push(kit.text(x + 10, y + 17, title, { size: 12 }), kit.line(x + 6, y + top, x + w - 6, y + top, { cls: 'd-guide', width: 1 }));
  items.forEach((item, i) => {
    const [label, keys] = Array.isArray(item) ? item : [item, ''];
    const iy = y + top + 4 + i * itemH;
    if (label === mark) out.push(`<rect x="${x + 4}" y="${iy}" width="${w - 8}" height="${itemH - 2}" rx="3" class="d-ui-mark" stroke-width="1.2"/>`);
    out.push(kit.text(x + 12, iy + itemH / 2 + 3, label, { size: 12 }));
    if (keys) out.push(kit.text(x + w - 10, iy + itemH / 2 + 3, keys, { anchor: 'end', size: 11, cls: 'd-key-text' }));
  });
  return out;
}

// A tick box with a label after it.
export function checkbox(kit, x, y, on, label, { mark = false } = {}) {
  const out = [`<rect x="${x}" y="${y}" width="14" height="14" rx="3" class="${mark ? 'd-ui-mark' : 'd-key'}" stroke-width="1.3"/>`];
  if (on) out.push(kit.polyline([[x + 3, y + 7.5], [x + 6, y + 10.5], [x + 11.5, y + 3.5]], { cls: 'd-ink', width: 1.8 }));
  if (label) out.push(kit.text(x + 21, y + 11.5, label, { size: 12 }));
  return out;
}

// A plain arrow from one point to another on the page.
export function pageArrow(kit, x1, y1, x2, y2, { cls = 'd-mark', width = 2 } = {}) {
  return [kit.line(x1, y1, x2, y2, { cls, width }), kit.arrowhead(x2, y2, Math.atan2(y2 - y1, x2 - x1), { cls, width })];
}

// ---- Time --------------------------------------------------------------------------------------

// Maps a frame number to an x position across a ruler from `x` to `x + w`.
export const timeScale = (x, w, from, to) => (frame) => x + ((frame - from) / (to - from)) * w;

// A frame ruler: a line with ticks and numbers every `step` frames.
export function ruler(kit, x, y, w, from, to, step) {
  const at = timeScale(x, w, from, to);
  const out = [kit.line(x, y, x + w, y, { cls: 'd-guide', width: 1 })];
  for (let f = Math.ceil(from / step) * step; f <= to; f += step) {
    const fx = at(f);
    out.push(kit.line(fx, y - 4, fx, y + 4, { cls: 'd-guide', width: 1 }), kit.text(fx, y - 8, String(f), { anchor: 'middle', size: 11 }));
  }
  return out;
}

// A keyframe diamond, as the Dope Sheet draws one.
export function key(kit, x, y, { mark = false, size = 6 } = {}) {
  return `<path d="M ${x} ${y - size} L ${x + size} ${y} L ${x} ${y + size} L ${x - size} ${y} Z" class="${mark ? 'd-mark-fill' : 'd-key'}" stroke-width="1.3"/>`;
}

// The playhead: a vertical line with a frame number in a tab at its top.
export function playhead(kit, x, top, bottom, frameNumber) {
  const label = String(frameNumber);
  const w = Math.max(22, label.length * 8 + 10);
  return [
    kit.line(x, top + 16, x, bottom, { cls: 'd-mark', width: 1.6 }),
    `<rect x="${x - w / 2}" y="${top}" width="${w}" height="16" rx="4" class="d-ui-mark" stroke-width="1.2"/>`,
    kit.text(x, top + 12, label, { anchor: 'middle', size: 11 }),
  ];
}

// An NLA strip: a box from x1 to x2 with its action's name. tone 'mark' is selected, 'muted' is
// drawn dashed as Blender draws a muted strip, 'plain' is a strip at rest.
export function strip(kit, x1, x2, y, text, { tone = 'plain', h = 22 } = {}) {
  const cls = tone === 'mark' ? 'd-ui-mark' : 'd-paper';
  return [
    `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="${h}" rx="3" class="${cls}" stroke-width="1.4"${tone === 'muted' ? ' stroke-dasharray="4 3"' : ''}/>`,
    kit.text((x1 + x2) / 2, y + h / 2 + 4, text, { anchor: 'middle', size: 12 }),
  ];
}

// ---- Models ------------------------------------------------------------------------------------

// The exercise's cart, built as the starter builds it: a 2 x 1.2 x 0.5 m body 0.5 m off the floor
// and four 12-sided wheels 0.4 m in radius with their axles along Y. `turn` is the wheels' Y
// rotation in degrees. Returns the body and the wheels as one mesh, plus each wheel's centre, so a
// diagram can draw a spoke on it.
export function cart({ x = 0, turn = 0 } = {}) {
  const body = box({ size: [2, 1.2, 0.5], center: [x, 0, 0.75] });
  const wheels = [];
  const centres = [];
  for (const wx of [-0.7, 0.7]) {
    for (const wy of [-0.68, 0.68]) {
      let w = rotate(cylinder({ vertices: 12, radius: 0.4, depth: 0.15 }), 'x', 90);
      w = rotate(w, 'y', turn);
      wheels.push(translate(w, [x + wx, wy, 0.4]));
      centres.push([x + wx, wy, 0.4]);
    }
  }
  return { mesh: join(body, ...wheels), centres };
}

// A spoke on a wheel seen from the front: a line from the centre to the rim at `turn` degrees
// clockwise from straight up (positive Y rotation turns a wheel clockwise in the front view), with
// a dot on the rim.
export function spoke(kit, v, centre, turn, { radius = 0.36, cls = 'd-mark' } = {}) {
  const t = (turn * Math.PI) / 180;
  const rim = [centre[0] + Math.sin(t) * radius, centre[1] - 0.2, centre[2] + Math.cos(t) * radius];
  const c = v.project([centre[0], centre[1] - 0.2, centre[2]]);
  const r = v.project(rim);
  return [kit.line(c[0], c[1], r[0], r[1], { cls, width: 2.4 }), kit.dot(r[0], r[1], { r: 3.6, cls: 'd-mark-fill' })];
}

// The door from lessons 94 and 95, seen from above: a 1 x 0.08 m slab hinged at X -0.5, turned
// `angle` degrees about Z, and the frame's two posts.
export function doorTop(angle = 0) {
  const slab = rotate(box({ size: [1, 0.08, 2], center: [0.5, 0, 1] }), 'z', angle);
  return translate(slab, [-0.5, 0, 0]);
}
export function doorPosts() {
  return join(box({ size: [0.1, 0.12, 2.2], center: [-0.65, 0, 1.1] }), box({ size: [0.1, 0.12, 2.2], center: [0.65, 0, 1.1] }));
}

// Draws a mesh, so a diagram can pass styles through one helper.
export const draw = (kit, m, v, options) => drawMesh(kit, m, v, options);

// A circular arrow around (cx, cy) at radius r, from angle a1 to a2 in degrees, measured clockwise
// from straight up, with an arrowhead at a2.
export function turnArrow(kit, cx, cy, r, a1, a2, { cls = 'd-mark', width = 2 } = {}) {
  const pts = [];
  const steps = Math.max(8, Math.round(Math.abs(a2 - a1) / 6));
  for (let i = 0; i <= steps; i += 1) {
    const t = ((a1 + ((a2 - a1) * i) / steps) * Math.PI) / 180;
    pts.push([cx + Math.sin(t) * r, cy - Math.cos(t) * r]);
  }
  const [x2, y2] = pts[pts.length - 1];
  const [x1, y1] = pts[pts.length - 2];
  return [kit.smooth(pts, { cls, width }), kit.arrowhead(x2, y2, Math.atan2(y2 - y1, x2 - x1), { cls, width })];
}

// ---- The Action Editor's header ------------------------------------------------------------------

// Small icon buttons as Blender draws them beside a data-block name: browse (a list), new (two
// sheets), unlink (an X) and the Fake User shield.
function iconButton(kit, x, y, kind, mark) {
  const out = [`<rect x="${x}" y="${y}" width="24" height="22" rx="4" class="${mark ? 'd-ui-mark' : 'd-key'}" stroke-width="${mark ? 1.6 : 1}"/>`];
  const cx = x + 12;
  const cy = y + 11;
  if (kind === 'browse') {
    for (const dy of [-4, 0, 4]) out.push(kit.line(cx - 5, cy + dy, cx + 5, cy + dy, { cls: 'd-ink', width: 1.4 }));
  } else if (kind === 'new') {
    out.push(`<rect x="${cx - 6}" y="${cy - 6}" width="8" height="10" rx="1" class="d-key" stroke-width="1.2"/>`);
    out.push(`<rect x="${cx - 2}" y="${cy - 3}" width="8" height="10" rx="1" class="d-key" stroke-width="1.2"/>`);
  } else if (kind === 'unlink') {
    out.push(kit.line(cx - 4, cy - 4, cx + 4, cy + 4, { cls: 'd-ink', width: 1.6 }), kit.line(cx + 4, cy - 4, cx - 4, cy + 4, { cls: 'd-ink', width: 1.6 }));
  } else if (kind === 'fake') {
    out.push(kit.path(`M ${cx} ${cy - 6} L ${cx + 5} ${cy - 4} L ${cx + 5} ${cy} Q ${cx + 5} ${cy + 4} ${cx} ${cy + 7} Q ${cx - 5} ${cy + 4} ${cx - 5} ${cy} L ${cx - 5} ${cy - 4} Z`, { cls: 'd-ink', width: 1.3 }));
  }
  return out;
}

// The Action Editor's action and slot selectors: browse, the action's name, New Action, unlink,
// the Fake User shield and the slot. `mark` picks out one of 'browse', 'name', 'new', 'unlink',
// 'fake'. Returns the svg and where each part sits.
export function actionHeader(kit, x, y, { name = 'open', mark, slot = 'Door', fake = false } = {}) {
  const at = { browse: [x, y], name: [x + 26, y], new: [x + 140, y], unlink: [x + 166, y], fake: [x + 192, y], slot: [x + 226, y] };
  const svg = [
    iconButton(kit, x, y, 'browse', mark === 'browse'),
    field(kit, x + 26, y, 112, name, { mark: mark === 'name', anchor: 'start' }),
    iconButton(kit, x + 140, y, 'new', mark === 'new'),
    iconButton(kit, x + 166, y, 'unlink', mark === 'unlink'),
    iconButton(kit, x + 192, y, 'fake', mark === 'fake' || fake),
    field(kit, x + 226, y, 70, slot, { anchor: 'start' }),
  ];
  return { svg, at };
}

// A door seen from above at `angle` degrees with a dashed arc for its swing from `from` degrees.
export function doorSwing(kit, v, angle, { from = null, cls = 'd-mark' } = {}) {
  const out = [];
  if (from !== null) {
    out.push(drawMesh(kit, doorTop(from), v, { mode: 'wire', cls: 'd-guide', width: 1 }));
    const pts = [];
    const steps = 16;
    for (let i = 0; i <= steps; i += 1) {
      const a = ((from + ((angle - from) * i) / steps) * Math.PI) / 180;
      pts.push(v.project([-0.5 + Math.cos(a) * 0.95, Math.sin(a) * 0.95, 2.1]));
    }
    out.push(kit.polyline(pts, { cls: 'd-guide', width: 1.2, dash: '4 4' }));
    const [x2, y2] = pts[pts.length - 1];
    const [x1, y1] = pts[pts.length - 2];
    out.push(kit.arrowhead(x2, y2, Math.atan2(y2 - y1, x2 - x1), { cls, size: 7 }));
  }
  out.push(drawMesh(kit, doorPosts(), v, { width: 1.2 }), drawMesh(kit, doorTop(angle), v, { width: 1.4 }));
  return out;
}

// ---- The NLA editor ------------------------------------------------------------------------------

// A schematic of the NLA editor: track names on the left, strips on the right against frames.
// tracks: [{ name, kind: 'object' | 'action' | 'track' | 'stash', strips: [[from, to, label, tone]],
// mute, pushDown, mark }]. Returns the svg and the frame-to-x mapping.
export function nla(kit, x, y, w, tracks, { from = 0, to = 100, playheadAt, step = 20, rowH = 30, names = 150 } = {}) {
  const sx = x + names;
  const sw = w - names;
  const at = timeScale(sx + 8, sw - 16, from, to);
  const h = tracks.length * rowH + 26;
  const out = [`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" class="d-ui" stroke-width="1"/>`];
  for (let f = Math.ceil(from / step) * step; f <= to; f += step) {
    if (f === 0) continue;
    out.push(kit.text(at(f), y + 16, String(f), { anchor: 'middle', size: 11 }), kit.line(at(f), y + 22, at(f), y + h - 4, { cls: 'd-guide', width: 0.6, dash: '2 4' }));
  }
  tracks.forEach((t, i) => {
    const ty = y + 26 + i * rowH;
    const cls = t.kind === 'action' ? 'd-ui-mark' : t.kind === 'object' ? 'd-sunk' : t.mark ? 'd-ui-mark' : 'd-paper';
    out.push(`<rect x="${x + 4}" y="${ty + 2}" width="${names - 8}" height="${rowH - 4}" rx="3" class="${cls}" stroke-width="1"/>`);
    out.push(kit.text(x + (t.kind === 'object' ? 12 : 26), ty + rowH / 2 + 4, t.name, { size: 12 }));
    if (t.kind === 'track' || t.kind === 'stash') out.push(checkbox(kit, x + 8, ty + rowH / 2 - 7, !t.mute));
    if (t.pushDown) {
      const bx = x + names - 30;
      out.push(`<rect x="${bx}" y="${ty + 5}" width="22" height="${rowH - 10}" rx="3" class="${t.pushDown === 'mark' ? 'd-key-mark' : 'd-key'}" stroke-width="1.2"/>`);
      out.push(kit.line(bx + 11, ty + 9, bx + 11, ty + rowH - 11, { cls: 'd-ink', width: 1.6 }), kit.arrowhead(bx + 11, ty + rowH - 10, Math.PI / 2, { cls: 'd-ink', size: 5, width: 1.6 }));
    }
    for (const [a, b, label, tone] of t.strips || []) out.push(strip(kit, at(a), at(b), ty + 4, label, { tone: tone || (t.kind === 'stash' || t.mute ? 'muted' : 'plain'), h: rowH - 8 }));
  });
  if (playheadAt !== undefined) out.push(playhead(kit, at(playheadAt), y + 2, y + h, playheadAt));
  return { svg: out, at, bottom: y + h };
}
