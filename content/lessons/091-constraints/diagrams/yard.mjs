// The cart-turret starter's objects, for this lesson's diagrams. Not a diagram itself. 3D meshes for
// the cart, the turret and the target, and a camera as a pyramid pointing where it looks; plus top
// view symbols for the camera and the cart.
import { box, cylinder, uvSphere, join, translate, rotate } from '../../../diagrams/mesh.mjs';

const wheel = (x, y) => translate(rotate(cylinder({ vertices: 8, radius: 0.2, depth: 0.08 }), 'x', 90), [x, y, 0.2]);
export const cart = (x = 0) => translate(join(box({ size: [1.2, 0.8, 0.4], center: [0, 0, 0.45] }), wheel(-0.4, -0.45), wheel(0.4, -0.45), wheel(-0.4, 0.45), wheel(0.4, 0.45)), [x, 0, 0]);

// The turret at `at`, its head turned `yaw` degrees about Z and its barrel along the head's +Y.
export function turret(at, yaw) {
  const barrel = translate(rotate(cylinder({ vertices: 8, radius: 0.07, depth: 0.8 }), 'x', 90), [0, 0.55, 0.15]);
  const head = rotate(join(box({ size: [0.5, 0.5, 0.3], center: [0, 0, 0.15] }), barrel), 'z', yaw);
  return join(translate(cylinder({ vertices: 12, radius: 0.45, depth: 0.5, center: [0, 0, 0.25] }), at), translate(head, [at[0], at[1], at[2] + 0.5]));
}

export const target = (at) => uvSphere({ segments: 10, rings: 6, radius: 0.2, center: at });

// A camera as a pyramid: its point at `at`, opening towards `look`.
export function camera(at, look, size = 0.7) {
  const d = look.map((v, i) => v - at[i]);
  const l = Math.hypot(...d);
  const f = d.map((v) => v / l);
  const r0 = [f[1], -f[0], 0];
  const rl = Math.hypot(...r0) || 1;
  const r = r0.map((v) => v / rl);
  const u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
  const c = at.map((v, i) => v + f[i] * size);
  const corner = (a, b) => c.map((v, i) => v + r[i] * a * size * 0.5 + u[i] * b * size * 0.35);
  const verts = [at, corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)];
  return { verts, faces: [[0, 2, 1], [0, 3, 2], [0, 4, 3], [0, 1, 4], [1, 2, 3, 4]] };
}

// Top view: a camera body with its lens pointing along `angle` (radians, screen space), drawn
// faint when `ghost`.
export function cameraIcon(kit, x, y, angle, { ghost = false } = {}) {
  const cls = ghost ? 'd-face-2 d-guide' : 'd-face-1 d-ink';
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const pt = (u, v) => `${(x + u * c - v * s).toFixed(1)} ${(y + u * s + v * c).toFixed(1)}`;
  return [
    `<path d="M ${pt(-14, -9)} L ${pt(4, -9)} L ${pt(4, 9)} L ${pt(-14, 9)} Z" class="${cls}" stroke-width="1.8"/>`,
    `<path d="M ${pt(4, -4)} L ${pt(16, -10)} L ${pt(16, 10)} L ${pt(4, 4)} Z" class="${cls}" stroke-width="1.8"/>`,
  ];
}

// Top view: the cart as a rectangle with its wheels.
export function cartIcon(kit, x, y, { ghost = false } = {}) {
  return [
    `<rect x="${x - 18}" y="${y - 12}" width="36" height="24" rx="2" class="${ghost ? 'd-face-2 d-guide' : 'd-face-1 d-ink'}" stroke-width="1.6"/>`,
    [-10, 10].flatMap((dx) => [-15, 15].map((dy) => `<rect x="${x + dx - 5}" y="${y + dy - 2}" width="10" height="4" rx="1" class="d-dot"/>`)),
  ];
}

// A rounded frame for one small view, with a label under it.
export function panel(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}
