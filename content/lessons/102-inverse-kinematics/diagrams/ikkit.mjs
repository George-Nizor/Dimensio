// Two-bone IK for this lesson's diagrams. Not a diagram itself. It solves a leg of the character in
// charkit.mjs the way an IK constraint with Chain Length 2 does: the hips move, the ankle stays on
// its target, and the knee bends towards the pole in front of it (-Y). The solve is in the side
// plane (Y, Z), where the leg lies.
import { skeleton } from '../../097-character-modelling/diagrams/charkit.mjs';

const deg = (r) => (r * 180) / Math.PI;
const angle = (y, z) => Math.atan2(z, y);

// Returns pose turns for the thigh, shin and foot of one side ('.L' or '.R') so that, with the
// hips moved by `drop` metres down, the ankle stays where it was and the foot keeps its angle.
export function legIK(side, drop) {
  const bones = new Map(skeleton().map((b) => [b.name, b]));
  const thigh = bones.get(`thigh${side}`);
  const shin = bones.get(`shin${side}`);
  const hip = [thigh.head[1], thigh.head[2] - drop];
  const ankle = [shin.tail[1], shin.tail[2]];
  const l1 = Math.hypot(thigh.tail[1] - thigh.head[1], thigh.tail[2] - thigh.head[2]);
  const l2 = Math.hypot(shin.tail[1] - shin.head[1], shin.tail[2] - shin.head[2]);
  const dy = ankle[0] - hip[0];
  const dz = ankle[1] - hip[1];
  const d = Math.min(Math.hypot(dy, dz), l1 + l2 - 1e-6);
  const toAnkle = angle(dy, dz);
  // The knee sits on the side of the hip-ankle line towards -Y.
  const bend = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
  const thighDir = toAnkle - bend;
  const knee = [hip[0] + Math.cos(thighDir) * l1, hip[1] + Math.sin(thighDir) * l1];
  const shinDir = angle(ankle[0] - knee[0], ankle[1] - knee[1]);
  const restThigh = angle(thigh.tail[1] - thigh.head[1], thigh.tail[2] - thigh.head[2]);
  const restShin = angle(shin.tail[1] - shin.head[1], shin.tail[2] - shin.head[2]);
  const a1 = deg(thighDir - restThigh);
  const a2 = deg(shinDir - restShin) - a1;
  return {
    [`thigh${side}`]: [[1, 0, 0], a1],
    [`shin${side}`]: [[1, 0, 0], a2],
    [`foot${side}`]: [[1, 0, 0], -(a1 + a2)],
  };
}

// The knee pole bone of one side: half a metre in front of the knee, pointing forward.
export function poleBone(side) {
  const x = side === '.L' ? 0.1175 : -0.1175;
  return { name: `knee${side}`, head: [x, -0.5, 0.51], tail: [x, -0.62, 0.51], parent: null };
}

// A rounded frame with a label under it.
export function frame(kit, x, y, w, h, label) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" class="d-ui" stroke-width="1"/>`,
    label ? kit.text(x + w / 2, y + h + 16, label, { anchor: 'middle', size: 12 }) : '',
  ];
}

// Only the faces of a character mesh owned by the named bones, for a close view of one limb.
export function partMesh(c, names) {
  return { verts: c.mesh.verts, faces: c.mesh.faces.filter((_, i) => names.includes(c.owner[i])) };
}
