// The poses used by this lesson's diagrams. Not a diagram itself. Each is a set of bone turns for
// the character in charkit.mjs: [axis, degrees] about the bone's head in its rest position.
export const WAVE = {
  'upper_arm.L': [[0, 1, 0], -60],
  'forearm.L': [[0, 1, 0], -60],
  'upper_arm.R': [[0, 1, 0], -70],
};
export const CROUCH = {
  hips: [[1, 0, 0], 0],
  'thigh.L': [[1, 0, 0], -70],
  'shin.L': [[1, 0, 0], 100],
  'foot.L': [[1, 0, 0], -30],
  'thigh.R': [[1, 0, 0], -70],
  'shin.R': [[1, 0, 0], 100],
  'foot.R': [[1, 0, 0], -30],
  spine: [[1, 0, 0], -20],
  'upper_arm.L': [[0, 1, 0], 60],
  'upper_arm.R': [[0, 1, 0], -60],
};
export const POINT = {
  'upper_arm.L': [[0, 0, 1], -80],
  'upper_arm.R': [[0, 1, 0], -70],
};

// The crouch lowers the hips so the feet stay on the floor.
export const CROUCH_MOVE = { hips: [0, 0, -0.36] };
