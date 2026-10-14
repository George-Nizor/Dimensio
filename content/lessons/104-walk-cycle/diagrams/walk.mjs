// The four key poses of a walk in place, seen from the right with the figure facing right, as
// this lesson's diagrams draw them. Not a diagram itself. Points are offsets in diagram units
// from a spot on the ground under the hips, y up. The near (left) leg leads at contact; the
// planted foot slides back from +32 to -32 over one step, as feet do in a walk in place.

export const POSES = {
  contact: { hip: [0, 68], chest: [3, 112], head: [5, 130], near: { foot: [32, 4], toe: [41, 13], hand: [-18, 62] }, far: { foot: [-32, 9], toe: [-23, 1], hand: [20, 64] } },
  down: { hip: [0, 62], chest: [4, 106], head: [6, 124], near: { foot: [16, 4], toe: [26, 1], hand: [-12, 58] }, far: { foot: [-30, 16], toe: [-22, 7], hand: [14, 58] } },
  passing: { hip: [0, 72], chest: [2, 116], head: [4, 134], near: { foot: [0, 4], toe: [10, 1], hand: [-3, 60] }, far: { foot: [4, 22], toe: [13, 20], hand: [5, 60] } },
  up: { hip: [0, 75], chest: [3, 119], head: [5, 137], near: { foot: [-16, 9], toe: [-7, 1], hand: [12, 66] }, far: { foot: [26, 14], toe: [35, 17], hand: [-14, 66] } },
};

// The same pose with the legs and arms swapped: what Paste Pose Flipped gives on frame 13.
export const flip = (pose) => ({ ...pose, near: pose.far, far: pose.near });

// A pose placed on the page: ground spot at (x, y), `s` units per pose unit, y flipped to screen.
export function place(pose, x, y, s = 1) {
  const at = ([u, v]) => [x + u * s, y - v * s];
  const side = (p) => ({ foot: at(p.foot), toe: at(p.toe), hand: at(p.hand) });
  return { hip: at(pose.hip), chest: at(pose.chest), head: at(pose.head), near: side(pose.near), far: side(pose.far) };
}

export const KEYS = [[1, 'contact'], [4, 'down'], [7, 'passing'], [10, 'up'], [13, 'contact'], [16, 'down'], [19, 'passing'], [22, 'up'], [25, 'contact']];

// A pose part way from a to b (t from 0 to 1), for frames between the keys.
export function mix(a, b, t) {
  const m = (p, q) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const side = (p, q) => ({ foot: m(p.foot, q.foot), toe: m(p.toe, q.toe), hand: m(p.hand, q.hand) });
  return { hip: m(a.hip, b.hip), chest: m(a.chest, b.chest), head: m(a.head, b.head), near: side(a.near, b.near), far: side(a.far, b.far) };
}
