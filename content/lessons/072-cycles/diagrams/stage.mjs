// Shapes shared by this lesson's diagrams. Not a diagram itself.
// The render-stage starter as simple meshes (a crate with a lantern on it, and a barrel), Blender's
// camera symbol in 3D, and a camera-view panel with its frame and passepartout.
import { cube, box, cylinder, translate, rotate, join, view, drawMesh } from '../../../diagrams/mesh.mjs';

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

// The props, in metres, where the starter puts them.
export function crate() { return translate(rotate(cube(0.7), 'z', 20), [-0.55, 0.2, 0.35]); }
export function lantern() { return translate(box({ size: [0.22, 0.22, 0.3] }), [-0.55, 0.2, 0.85]); }
export function barrel() { return translate(cylinder({ vertices: 12, radius: 0.31, depth: 0.85 }), [0.55, -0.1, 0.425]); }
export function props() { return join(crate(), lantern(), barrel()); }

// The middle of the group, which the starter's camera and lights aim at.
export const AIM = [0, 0.05, 0.45];

// A view through a camera at `from` looking at `target`, as azimuth, elevation and distance for the
// mesh kit's view(). `scale` is pixels per metre at the target.
export function lookFrom(from, target = AIM, { at, scale, perspective = true } = {}) {
  const d = sub(from, target);
  const distance = Math.hypot(...d);
  const azimuth = (Math.atan2(d[0], -d[1]) * 180) / Math.PI;
  const elevation = (Math.asin(d[2] / distance) * 180) / Math.PI;
  return view({ azimuth, elevation, target, at, scale, distance: perspective ? distance : 0 });
}

// Blender's camera symbol: a pyramid from the camera's position to a 16:9 frame, with a triangle on
// the frame's top edge showing which way is up. `size` is the pyramid's depth in metres.
export function cameraSymbol(kit, v, from, target, { size = 0.9, cls = 'd-ink', width = 1.6, active = true, dash } = {}) {
  const f = norm(sub(target, from));
  const r = norm(cross(f, [0, 0, 1]));
  const u = cross(r, f);
  const c = add(from, mul(f, size));
  const w = size * 0.55;
  const h = w * (9 / 16);
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => add(add(c, mul(r, a * w)), mul(u, b * h)));
  const p = (q) => v.project(q);
  const apex = p(from);
  const out = corners.map((q) => { const s = p(q); return kit.line(apex[0], apex[1], s[0], s[1], { cls, width, dash }); });
  const ring = corners.map(p);
  out.push(kit.polyline([...ring, ring[0]], { cls, width, dash }));
  const tri = [add(add(c, mul(u, h * 1.15)), mul(r, -w * 0.45)), add(add(c, mul(u, h * 1.15)), mul(r, w * 0.45)), add(c, mul(u, h * 1.15 + w * 0.4))].map(p);
  out.push(`<path d="M ${tri.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z" class="${active ? (cls === 'd-mark' ? 'd-mark-fill' : 'd-dot') : 'd-paper'}" stroke-width="0"/>`);
  out.push(kit.polyline([...tri, tri[0]], { cls, width: width * 0.8, dash }));
  return out;
}

// A camera-view panel: the viewport (darkened by the passepartout) with the camera's frame inside it.
// Returns the drawing and the frame's rectangle, so a diagram can draw the shot inside it.
export function cameraPanel(kit, x, y, w, h, { frame = 0.8, locked = false, label, clip } = {}) {
  const fw = w * frame;
  const fh = fw * (9 / 16);
  const fx = x + (w - fw) / 2;
  const fy = y + (h - fh) / 2;
  return {
    svg: [
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-sunk" stroke-width="1"/>`,
      `<rect x="${fx.toFixed(1)}" y="${fy.toFixed(1)}" width="${fw.toFixed(1)}" height="${fh.toFixed(1)}" class="d-paper" stroke-width="0"/>`,
    ],
    border: kit.path(`M ${fx} ${fy} H ${fx + fw} V ${fy + fh} H ${fx} Z`, { cls: locked ? 'd-mark' : 'd-ink', width: locked ? 2 : 1.2, dash: '6 4' }),
    label: label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
    frame: [fx, fy, fw, fh],
    // Wraps drawing so it is cut off at the frame's edge, as a render is. `clip` must be an id no
    // other diagram uses.
    inside: (...children) => clip
      ? [`<clipPath id="${clip}"><rect x="${fx.toFixed(1)}" y="${fy.toFixed(1)}" width="${fw.toFixed(1)}" height="${fh.toFixed(1)}"/></clipPath>`, `<g clip-path="url(#${clip})">`, children, '</g>']
      : children,
  };
}

// A plain rounded panel with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}

// One row of a Properties panel: a label on the left and a value box on the right. `mark` picks
// the row out; `tick` draws a checkbox instead of a value.
export function propRow(kit, x, y, label, value, { width = 220, split = 0.5, mark = false, tick } = {}) {
  const vx = x + width * split;
  const out = [kit.text(vx - 8, y + 13, label, { anchor: 'end', size: 11 })];
  if (tick !== undefined) {
    out.push(`<rect x="${vx}" y="${y + 2}" width="14" height="14" rx="3" class="${tick ? 'd-ui-mark' : 'd-key'}" stroke-width="1.2"/>`);
    if (tick) out.push(kit.path(`M ${vx + 3} ${y + 9} L ${vx + 6} ${y + 12} L ${vx + 11} ${y + 5}`, { cls: 'd-ink', width: 2 }));
    if (value) out.push(kit.text(vx + 20, y + 13, value, { size: 11 }));
  } else {
    out.push(`<rect x="${vx}" y="${y}" width="${width * (1 - split)}" height="18" rx="3" class="${mark ? 'd-ui-mark' : 'd-key'}" stroke-width="1.2"/>`);
    out.push(kit.text(vx + (width * (1 - split)) / 2, y + 13, value, { anchor: 'middle', size: 11, cls: 'd-key-text' }));
  }
  return out;
}

// The view a camera at `from` gives inside a panel's frame: a 36 mm wide sensor behind a `lens` mm
// lens, or an orthographic camera `ortho` metres across, aimed at `target` in the frame's middle.
// `at` moves where the target lands, to place it off-centre.
export function shot(frame, from, { lens = 50, ortho = 0, target = AIM, at: place } = {}) {
  const [fx, fy, fw, fh] = frame;
  const at = place || [fx + fw / 2, fy + fh / 2];
  const distance = Math.hypot(...sub(from, target));
  const across = ortho || (distance * 36) / lens;
  return lookFrom(from, target, { at, scale: fw / across, perspective: !ortho });
}

// The stage through the starter's camera, filling a w-wide 16:9 area. `grain` scatters that many
// specks over it, the noise of a render with too few samples. `clip` must be unique.
export function render(kit, x, y, w, { grain = 0, seed = 3, clip }) {
  const p = cameraPanel(kit, x, y, w, (w * 9) / 16, { frame: 1, clip });
  const [fx, fy, fw, fh] = p.frame;
  const next = kit.random(seed);
  const specks = [];
  for (let i = 0; i < grain; i += 1) {
    specks.push(`<circle cx="${(fx + next() * fw).toFixed(1)}" cy="${(fy + next() * fh).toFixed(1)}" r="${(0.6 + next() * 0.9).toFixed(2)}" class="${next() > 0.5 ? 'd-dot' : 'd-mark-fill'}" opacity="${(0.25 + next() * 0.45).toFixed(2)}"/>`);
  }
  return [p.svg, p.inside(drawMesh(kit, props(), shot(p.frame, [3.4, -5.0, 1.9]), { width: 1.2 }), specks)];
}
