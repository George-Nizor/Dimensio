// A low-poly character seen from the front and its 15-bone armature, for this lesson's diagrams.
// Not a diagram itself. Positions are in metres, X across and Z up; the character is 1.7 m tall.

const rad = (d) => (d * Math.PI) / 180;
const arm = (side) => {
  const at = (d) => [side * (0.17 + Math.cos(rad(30)) * d), 1.4 - Math.sin(rad(30)) * d];
  return { shoulder: at(0), elbow: at(0.28), wrist: at(0.52), hand: at(0.62) };
};
const L = arm(1);
const R = arm(-1);

// The body as capsules [[a, b], radius].
export const BODY = [
  [[0, 0.95], [0, 1.1], 0.15], [[0, 1.1], [0, 1.3], 0.14], [[0, 1.3], [0, 1.4], 0.16],
  [[0, 1.4], [0, 1.5], 0.05], [[0, 1.56], [0, 1.64], 0.095],
  [L.shoulder, R.shoulder, 0.06], [[0.11, 0.92], [-0.11, 0.92], 0.08],
  [L.shoulder, L.elbow, 0.06], [L.elbow, L.wrist, 0.046], [L.wrist, L.hand, 0.042],
  [R.shoulder, R.elbow, 0.06], [R.elbow, R.wrist, 0.046], [R.wrist, R.hand, 0.042],
  [[0.11, 0.9], [0.11, 0.48], 0.072], [[0.11, 0.48], [0.11, 0.085], 0.055], [[0.11, 0.085], [0.11, 0.04], 0.045],
  [[-0.11, 0.9], [-0.11, 0.48], 0.072], [[-0.11, 0.48], [-0.11, 0.085], 0.055], [[-0.11, 0.085], [-0.11, 0.04], 0.045],
];

// The 15 bones: hips, spine, chest, neck and head, then upper arm, forearm, thigh, shin and foot
// on each side.
export const BONES = [
  ['hips', [0, 0.9], [0, 1.05]], ['spine', [0, 1.05], [0, 1.22]], ['chest', [0, 1.22], [0, 1.42]],
  ['neck', [0, 1.42], [0, 1.52]], ['head', [0, 1.52], [0, 1.7]],
  ...[['L', L, 1], ['R', R, -1]].flatMap(([s, a, side]) => [
    [`upper_arm.${s}`, a.shoulder, a.elbow], [`forearm.${s}`, a.elbow, a.wrist],
    [`thigh.${s}`, [0.11 * side, 0.9], [0.11 * side, 0.48]], [`shin.${s}`, [0.11 * side, 0.48], [0.11 * side, 0.085]],
    [`foot.${s}`, [0.11 * side, 0.085], [0.11 * side, 0.03]],
  ]),
];

export const front = (x, y, s) => ([px, pz]) => [x + px * s, y - pz * s];
export const parts = (p, s) => BODY.map(([a, b, r]) => [p(a), p(b), r * s]);
