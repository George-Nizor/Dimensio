// The body and the meta-rig the diagrams in this lesson draw, and where fitting moves the
// meta-rig's joints. Not a diagram itself.
// BODY is the starter's stick figure (blender/starters/rigify-body.py): joint positions in
// metres (X across, Z up) with the skin radius across. META is Rigify's Basic Human meta-rig as
// Blender 5.2.2 adds it, head and tail of each bone in metres (X, Y, Z), 1.98 m tall.

const arm = (side) => {
  const drop = (30 * Math.PI) / 180;
  const at = (d) => [side * (0.17 + Math.cos(drop) * d), 1.4 - Math.sin(drop) * d];
  return [[at(0), at(0.28), 0.06], [at(0.28), at(0.52), 0.046], [at(0.52), at(0.62), 0.042]];
};
const leg = (side) => {
  const x = 0.11 * side;
  return [[[x, 0.9], [x, 0.48], 0.072], [[x, 0.48], [x, 0.085], 0.055], [[x, 0.085], [x, 0.04], 0.045]];
};

export const BODY = [
  [[0, 0.95], [0, 1.1], 0.15], [[0, 1.1], [0, 1.3], 0.14], [[0, 1.3], [0, 1.4], 0.16],
  [[0, 1.4], [0, 1.5], 0.05], [[0, 1.56], [0, 1.64], 0.095],
  [[0.17, 1.4], [-0.17, 1.4], 0.06], [[0.11, 0.92], [-0.11, 0.92], 0.08],
  ...arm(1), ...arm(-1), ...leg(1), ...leg(-1),
];

export const META = {
  spine: [[0, 0.055, 1.01], [0, 0.017, 1.157]],
  'spine.001': [[0, 0.017, 1.157], [0, 0, 1.293]],
  'spine.002': [[0, 0, 1.293], [0, 0.006, 1.466]],
  'spine.003': [[0, 0.006, 1.466], [0, 0.011, 1.658]],
  'spine.004': [[0, 0.011, 1.658], [0, -0.013, 1.72]],
  'spine.005': [[0, -0.013, 1.72], [0, -0.025, 1.781]],
  'spine.006': [[0, -0.025, 1.781], [0, -0.025, 1.98]],
  'shoulder.L': [[0.018, -0.068, 1.605], [0.169, 0.021, 1.605]],
  'upper_arm.L': [[0.195, 0.027, 1.585], [0.442, 0.089, 1.449]],
  'forearm.L': [[0.442, 0.089, 1.449], [0.659, 0.049, 1.306]],
  'hand.L': [[0.659, 0.049, 1.306], [0.723, 0.041, 1.258]],
  'pelvis.L': [[0, 0.055, 1.01], [0.111, -0.045, 1.153]],
  'thigh.L': [[0.098, 0.012, 1.072], [0.098, -0.029, 0.537]],
  'shin.L': [[0.098, -0.029, 0.537], [0.098, 0.016, 0.085]],
  'foot.L': [[0.098, 0.016, 0.085], [0.098, -0.093, 0.017]],
  'toe.L': [[0.098, -0.093, 0.017], [0.098, -0.161, 0.017]],
};
// The right side mirrors the left across X.
for (const [name, [h, t]] of Object.entries({ ...META })) {
  if (name.endsWith('.L')) META[name.replace('.L', '.R')] = [[-h[0], h[1], h[2]], [-t[0], t[1], t[2]]];
}

// Front view: metres to screen, with the feet at (x, y) and `s` pixels per metre.
export const front = (x, y, s) => (p) => (p.length === 3 ? [x + p[0] * s, y - p[2] * s] : [x + p[0] * s, y - p[1] * s]);

// Bones as [head, tail] in screen space, scaled by `k` about the origin and moved by `edit`
// (a function that may move a point, for fitting).
export function metaBones(project, { k = 1, edit = (name, end, p) => p } = {}) {
  return Object.entries(META).map(([name, [h, t]]) => {
    const sh = edit(name, 'head', h.map((v) => v * k));
    const st = edit(name, 'tail', t.map((v) => v * k));
    return [name, project(sh), project(st)];
  });
}

// The body's parts in screen space.
export const bodyParts = (project) => BODY.map(([a, b, r]) => [project(a), project(b), r * Math.abs(project([1, 0])[0] - project([0, 0])[0])]);

// Fitting. K scales the 1.98 m meta-rig to the 1.7 m body. FIT says where each fitted bone end
// of the left side goes, in metres (X, Y, Z); the right side mirrors it. Anything not listed
// keeps its scaled place.
export const K = 1.7 / 1.98;

const FIT = {
  'shoulder.L:tail': [0.16, 0.02, 1.38],
  'upper_arm.L:head': [0.19, 0.02, 1.39],
  'upper_arm.L:tail': [0.41, 0.05, 1.26],
  'forearm.L:head': [0.41, 0.05, 1.26],
  'forearm.L:tail': [0.62, 0.0, 1.14],
  'hand.L:head': [0.62, 0.0, 1.14],
  'hand.L:tail': [0.7, 0.0, 1.095],
  'thigh.L:head': [0.11, 0.0, 0.9],
  'thigh.L:tail': [0.11, -0.03, 0.48],
  'shin.L:head': [0.11, -0.03, 0.48],
  'shin.L:tail': [0.11, 0.0, 0.085],
  'foot.L:head': [0.11, 0.0, 0.085],
  'foot.L:tail': [0.11, -0.09, 0.02],
  'toe.L:head': [0.11, -0.09, 0.02],
  'toe.L:tail': [0.11, -0.15, 0.02],
  'pelvis.L:tail': [0.11, -0.04, 1.0],
};

export function fitted(name, end, p) {
  const key = `${name.replace('.R', '.L')}:${end}`;
  const f = FIT[key];
  if (!f) return p;
  return name.endsWith('.R') ? [-f[0], f[1], f[2]] : f;
}
