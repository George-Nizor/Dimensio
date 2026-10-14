// Helpers shared by the diagrams of lessons 97 to 102, the character lessons. Not a diagram itself.
// The character is the blocky one the blocky-character starter builds: 1.8 m tall in a T pose,
// facing -Y, with the same 15 bones. Each body part is a box with its edge loops, owned by one
// bone, so a pose turns the parts with their bones the way a rigid rig does. Bones are drawn as
// Blender's octahedral bones, built as real meshes.
import { box, join, drawMesh } from '../../../diagrams/mesh.mjs';

// ---- Vectors and rotations ---------------------------------------------------------------------

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

// Rodrigues' rotation of point p about a unit axis through the origin by `deg` degrees.
export function turn(p, axis, deg) {
  const k = unit(axis);
  const t = (deg * Math.PI) / 180;
  const c = Math.cos(t);
  const s = Math.sin(t);
  return add(add(mul(p, c), mul(cross(k, p), s)), mul(k, dot(k, p) * (1 - c)));
}

// ---- The skeleton ------------------------------------------------------------------------------

const LEG_X = 0.1175;
const MIDDLE = [
  ['hips', [0, 0, 0.95], [0, 0, 1.08], null],
  ['spine', [0, 0, 1.08], [0, 0, 1.22], 'hips'],
  ['chest', [0, 0, 1.22], [0, 0, 1.45], 'spine'],
  ['neck', [0, 0, 1.45], [0, 0, 1.54], 'chest'],
  ['head', [0, 0, 1.54], [0, 0, 1.8], 'neck'],
];
const SIDE = [
  ['upper_arm', [0.22, 0, 1.38], [0.47, 0, 1.38], 'chest'],
  ['forearm', [0.47, 0, 1.38], [0.8, 0, 1.38], 'upper_arm'],
  ['thigh', [LEG_X, 0, 0.92], [LEG_X, -0.02, 0.51], 'hips'],
  ['shin', [LEG_X, -0.02, 0.51], [LEG_X, 0, 0.08], 'thigh'],
  ['foot', [LEG_X, 0, 0.08], [LEG_X, -0.2, 0.04], 'shin'],
];

// The 15 bones: { name, head, tail, parent }.
export function skeleton() {
  const bones = MIDDLE.map(([name, head, tail, parent]) => ({ name, head, tail, parent }));
  for (const [suffix, s] of [['.L', 1], ['.R', -1]]) {
    for (const [name, head, tail, parent] of SIDE) {
      bones.push({
        name: name + suffix,
        head: [head[0] * s, head[1], head[2]],
        tail: [tail[0] * s, tail[1], tail[2]],
        parent: parent === 'chest' || parent === 'hips' ? parent : parent + suffix,
      });
    }
  }
  return bones;
}

// ---- The body ------------------------------------------------------------------------------------

// Each part: the bone that owns it, and a box from low to high corner with its loop segments.
function parts(half = false) {
  const p = [
    ['hips', [-0.19, -0.11, 0.95], [0.19, 0.11, 1.08], [3, 1, 1]],
    ['spine', [-0.19, -0.11, 1.08], [0.19, 0.11, 1.22], [3, 1, 1]],
    ['chest', [-0.19, -0.11, 1.22], [0.19, 0.11, 1.45], [3, 1, 2]],
    ['neck', [-0.045, -0.06, 1.45], [0.045, 0.06, 1.54], [1, 1, 1]],
    ['head', [-0.12, -0.115, 1.54], [0.12, 0.115, 1.8], [1, 1, 1]],
  ];
  if (half) {
    // One half for the Mirror modifier: the middle parts cut at X 0, and the left limbs only.
    for (const part of p) {
      part[1] = [0, part[1][1], part[1][2]];
      part[3] = [Math.max(1, Math.round(part[3][0] / 2)), part[3][1], part[3][2]];
    }
  }
  for (const [suffix, s] of half ? [['.L', 1]] : [['.L', 1], ['.R', -1]]) {
    const x = (a, b) => (s > 0 ? [a, b] : [-b, -a]);
    const [ua0, ua1] = x(0.19, 0.47);
    const [fa0, fa1] = x(0.47, 0.84);
    const [lg0, lg1] = x(0.045, 0.19);
    p.push(
      ['upper_arm' + suffix, [ua0, -0.06, 1.31], [ua1, 0.06, 1.45], [3, 1, 1]],
      ['forearm' + suffix, [fa0, -0.06, 1.31], [fa1, 0.06, 1.45], [3, 1, 1]],
      ['thigh' + suffix, [lg0, -0.11, 0.51], [lg1, 0.11, 0.95], [1, 1, 3]],
      ['shin' + suffix, [lg0, -0.11, 0.1], [lg1, 0.11, 0.51], [1, 1, 3]],
      ['foot' + suffix, [lg0, -0.25, 0], [lg1, 0.11, 0.1], [1, 2, 1]],
    );
  }
  return p.map(([bone, lo, hi, segments]) => ({
    bone,
    mesh: box({ size: sub(hi, lo), segments, center: mul(add(lo, hi), 0.5) }),
  }));
}

// A pose: { boneName: [axis, degrees] }, each turn about the bone's own head in rest space,
// carried down to its children. Returns a function mapping a rest point owned by a bone to where
// the pose puts it, and the posed bones.
export function poser(pose = {}, { move = {} } = {}) {
  const bones = skeleton();
  const byName = new Map(bones.map((b) => [b.name, b]));
  const memo = new Map();
  const transform = (name) => {
    if (memo.has(name)) return memo.get(name);
    const b = byName.get(name);
    const parent = b.parent ? transform(b.parent) : (p) => p;
    const [axis, deg] = pose[name] || [[0, 0, 1], 0];
    const shift = move[name] || [0, 0, 0];
    const f = (p) => parent(add(add(turn(sub(p, b.head), axis, deg), b.head), shift));
    memo.set(name, f);
    return f;
  };
  return {
    at: (name, p) => transform(name)(p),
    bones: bones.map((b) => ({ ...b, head: transform(b.name)(b.head), tail: transform(b.name)(b.tail) })),
  };
}

// The character's mesh in a pose (rest when no pose is given), and which faces belong to which bone.
export function character(pose = {}, options = {}) {
  const P = poser(pose, options);
  const meshes = [];
  const owner = [];
  for (const part of parts(options.half)) {
    meshes.push({ verts: part.mesh.verts.map((v) => P.at(part.bone, v)), faces: part.mesh.faces });
    owner.push(...part.mesh.faces.map(() => part.bone));
  }
  return { mesh: join(...meshes), owner, bones: P.bones };
}

// Faces of a character mesh owned by any of these bones.
export const facesOf = (c, names) => c.owner.map((b, i) => (names.includes(b) ? i : -1)).filter((i) => i >= 0);

// ---- Bones ---------------------------------------------------------------------------------------

// An octahedral bone from head to tail: a point at each end and a square waist a tenth of the way
// along, its width a tenth of the bone's length, as Blender draws one.
export function boneMesh(head, tail) {
  const axis = sub(tail, head);
  const len = Math.hypot(...axis) || 1;
  const d = unit(axis);
  const ref = Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
  const u = unit(cross(d, ref));
  const w = unit(cross(d, u));
  const mid = add(head, mul(d, len * 0.1));
  const r = len * 0.1;
  const ring = [add(mid, mul(u, r)), add(mid, mul(w, r)), add(mid, mul(u, -r)), add(mid, mul(w, -r))];
  const verts = [head, tail, ...ring];
  const faces = [];
  for (let i = 0; i < 4; i += 1) {
    const a = 2 + i;
    const b = 2 + ((i + 1) % 4);
    faces.push([0, b, a], [1, a, b]);
  }
  return { verts, faces };
}

// Draws bones. marked: names drawn in the selection colour. Each bone gets a dot at its head.
export function drawBones(kit, v, bones, { marked = [], width = 1.2, names = false, size = 11 } = {}) {
  const out = [];
  for (const b of bones) {
    const m = boneMesh(b.head, b.tail);
    const on = marked.includes(b.name);
    out.push(drawMesh(kit, m, v, { width, select: on ? { faces: m.faces.map((_, i) => i) } : {} }));
    const [hx, hy] = v.project(b.head);
    out.push(kit.dot(hx, hy, { r: 2.4, cls: on ? 'd-mark-fill' : 'd-dot' }));
    if (names) {
      const [tx, ty] = v.project(mul(add(b.head, b.tail), 0.5));
      out.push(kit.text(tx + 8, ty - 6, b.name, { size }));
    }
  }
  return out;
}

// A rounded frame with a label under it.
export function frame(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}

// ---- Weights in the front view --------------------------------------------------------------------

// A limb seen from the front as a strip of quads between rings, for weight pictures. rings: x
// positions along the limb (from the body outwards), half: half its height, weights: one weight per
// ring for the moving bone. The moving bone turns `deg` degrees about the joint (jx, jy), and each
// ring follows by its weight, as linear blend skinning mixes two bones. Returns the quads in page
// space with each one's average weight.
export function limb2d({ rings, half, weights, joint, deg = 0, at = ([x, y]) => [x, y] }) {
  const t = (deg * Math.PI) / 180;
  const move = ([x, y], w) => {
    const dx = x - joint[0];
    const dy = y - joint[1];
    const rx = joint[0] + dx * Math.cos(t) - dy * Math.sin(t);
    const ry = joint[1] + dx * Math.sin(t) + dy * Math.cos(t);
    return [x + (rx - x) * w, y + (ry - y) * w];
  };
  const top = rings.map((x, i) => at(move([x, -half], weights[i])));
  const bottom = rings.map((x, i) => at(move([x, half], weights[i])));
  const quads = [];
  for (let i = 0; i < rings.length - 1; i += 1) {
    quads.push({ pts: [top[i], top[i + 1], bottom[i + 1], bottom[i]], weight: (weights[i] + weights[i + 1]) / 2 });
  }
  return { quads, top, bottom };
}

// Draws weight quads: the selection colour, stronger where the weight is higher, as Weight Paint
// mode shows red for 1 and blue for 0. `zero` draws weight-0 quads in the ink colour, as the Zero
// Weights overlay draws them black.
export function drawWeights(kit, quads, { width = 1.2, zero = false } = {}) {
  return quads.map(({ pts, weight }) => {
    const d = `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z`;
    const fill = zero && weight === null
      ? `<path d="${d}" class="d-dot"/>`
      : `<path d="${d}" class="d-face-1"/><path d="${d}" class="d-mark-fill" fill-opacity="${(0.08 + 0.92 * (weight || 0)).toFixed(2)}"/>`;
    return [fill, kit.polyline([...pts, pts[0]], { cls: 'd-ink', width })];
  });
}

// A weight legend: a bar from 0 to 1.
export function weightLegend(kit, x, y, w = 120) {
  const steps = 10;
  const out = [];
  for (let i = 0; i < steps; i += 1) {
    out.push(`<rect x="${(x + (w * i) / steps).toFixed(1)}" y="${y}" width="${(w / steps).toFixed(1)}" height="10" class="d-face-1"/>`);
    out.push(`<rect x="${(x + (w * i) / steps).toFixed(1)}" y="${y}" width="${(w / steps).toFixed(1)}" height="10" class="d-mark-fill" fill-opacity="${(0.08 + (0.92 * i) / (steps - 1)).toFixed(2)}"/>`);
  }
  out.push(kit.polyline([[x, y], [x + w, y], [x + w, y + 10], [x, y + 10], [x, y]], { cls: 'd-guide', width: 1 }));
  out.push(kit.text(x - 6, y + 9, '0', { anchor: 'end', size: 11 }), kit.text(x + w + 6, y + 9, '1', { size: 11 }));
  return out;
}
