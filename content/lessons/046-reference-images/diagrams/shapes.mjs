// Shapes shared by this lesson's diagrams. Not a diagram itself.

// The sword in the reference pictures, scaled to 1 m tall, as outlines [across, up] in metres:
// across is X in the front picture and Y in the side picture. Taken from Kenney's Mini Dungeon
// sword: the grip with its flared pommel, the guard, the blade and its point.
export const frontOutline = [[-0.042, 0], [0.042, 0], [0.121, 0.051], [0.1, 0.225], [0.259, 0.225], [0.259, 0.384], [0.154, 0.384], [0.154, 0.88], [0, 1], [-0.154, 0.88], [-0.154, 0.384], [-0.259, 0.384], [-0.259, 0.225], [-0.1, 0.225], [-0.121, 0.051]];
export const sideOutline = [[-0.042, 0], [0.042, 0], [0.121, 0.051], [0.1, 0.225], [0.121, 0.225], [0.121, 0.384], [0.087, 0.384], [0.087, 0.87], [0, 1], [-0.087, 0.87], [-0.087, 0.384], [-0.121, 0.384], [-0.121, 0.225], [-0.1, 0.225], [-0.121, 0.051]];

// The pictures' widths when they are 1 m tall: 416 by 640 and 192 by 640 pixels.
export const frontWidth = 0.65;
export const sideWidth = 0.3;

// Points of a picture standing in the scene: `along` maps the picture's across direction to a
// 3D direction, `up` scales and lifts it, so a picture can be drawn at any size or height.
export function placed(points, { side = false, size = 1, lift = 0, centreX = 0 } = {}) {
  return points.map(([a, z]) => (side ? [centreX, a * size, z * size + lift] : [a * size + centreX, 0, z * size + lift]));
}

// Keeps the part of a closed outline on one side of across = 0: `half` -1 keeps the negative side,
// 1 the positive side (Sutherland-Hodgman clipping against one line).
function clip(points, half) {
  const inside = ([a]) => a * half >= -1e-9;
  const out = [];
  points.forEach((p, i) => {
    const q = points[(i + 1) % points.length];
    if (inside(p)) out.push(p);
    if (inside(p) !== inside(q)) {
      const t = p[0] / (p[0] - q[0]);
      out.push([0, p[1] + (q[1] - p[1]) * t]);
    }
  });
  return out;
}

// A picture drawn in a view: its frame, then the sword filled and outlined. `half` draws only one
// side of the picture's middle line, so two crossing pictures can be drawn back to front.
export function picture(kit, v, { side = false, size = 1, lift = 0, cls = 'd-face-2', half = 0 } = {}) {
  const w = (side ? sideWidth : frontWidth) / 2;
  let frame2d = [[-w, 0], [w, 0], [w, 1], [-w, 1]];
  let sword2d = side ? sideOutline : frontOutline;
  if (half) { frame2d = clip(frame2d, half); sword2d = clip(sword2d, half); }
  const frame = placed(frame2d, { side, size, lift }).map((p) => v.project(p));
  const sword = placed(sword2d, { side, size, lift }).map((p) => v.project(p));
  const path = (pts) => `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z`;
  const outline = half ? kit.polyline(sword.filter((_, i) => !(Math.abs(sword2d[i][0]) < 1e-9 && Math.abs(sword2d[(i + 1) % sword2d.length][0]) < 1e-9)), { cls: 'd-ink', width: 1.3 }) : kit.polyline([...sword, sword[0]], { cls: 'd-ink', width: 1.3 });
  return [
    `<path d="${path(frame)}" class="d-ui" stroke-width="1.2"/>`,
    `<path d="${path(sword)}" class="${cls}"/>`,
    outline,
  ];
}

// Both pictures standing at right angles, drawn back to front for a view from the front right
// (azimuth between 0 and 90):
// the halves behind the crossing line first, then the halves in front of it.
export function bothPictures(kit, v) {
  return [
    picture(kit, v, { half: -1 }),
    picture(kit, v, { side: true, half: 1 }),
    picture(kit, v, { half: 1 }),
    picture(kit, v, { side: true, half: -1 }),
  ];
}

// A settings panel from the Properties editor: a title and rows of [label, value]. A value of
// true or false draws a checkbox.
export function settings(kit, x, y, w, title, rows, { mark } = {}) {
  const rowH = 24;
  const out = [`<rect x="${x}" y="${y}" width="${w}" height="${30 + rows.length * rowH + 6}" rx="5" class="d-ui" stroke-width="1"/>`];
  out.push(kit.path(`M ${x + 10} ${y + 12} L ${x + 14} ${y + 17} L ${x + 18} ${y + 12}`, { cls: 'd-ink', width: 1.4 }), kit.text(x + 26, y + 20, title, { size: 13 }));
  rows.forEach(([label, value, extra], i) => {
    const ry = y + 30 + i * rowH;
    const split = x + w * 0.46;
    if (mark && mark.includes(label)) out.push(`<rect x="${x + 6}" y="${ry - 1}" width="${w - 12}" height="${rowH - 2}" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    if (label) out.push(kit.text(split, ry + 15, label, { anchor: 'end', size: 12 }));
    let vx = split + 10;
    if (value === true || value === false) {
      out.push(`<rect x="${vx}" y="${ry + 3}" width="15" height="15" rx="2" class="${value ? 'd-key-mark' : 'd-key'}" stroke-width="1"/>`);
      if (value) out.push(`<path d="M ${vx + 3} ${ry + 10.5} L ${vx + 6.5} ${ry + 14} L ${vx + 12} ${ry + 6} L ${vx + 13.2} ${ry + 7.2} L ${vx + 6.5} ${ry + 16.2} L ${vx + 1.8} ${ry + 11.7} Z" class="d-key-text-mark"/>`);
      if (extra) out.push(kit.text(vx + 22, ry + 15, extra, { size: 12 }));
    } else {
      out.push(`<rect x="${vx}" y="${ry + 1}" width="${x + w - vx - 10}" height="19" rx="3" class="d-sunk" stroke-width="0.8"/>`);
      out.push(kit.text((vx + x + w - 10) / 2, ry + 15, String(value), { anchor: 'middle', size: 12, cls: 'd-key-text' }));
    }
  });
  return out;
}
