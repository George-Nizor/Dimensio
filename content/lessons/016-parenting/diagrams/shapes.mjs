// The block car from the parent-car starter, shared by this lesson's diagrams. Not a diagram itself.
import { box, cylinder, rotate, translate, join } from '../../../diagrams/mesh.mjs';

const WHEELS = [['Wheel FL', -0.8, -1.15], ['Wheel FR', 0.8, -1.15], ['Wheel BL', -0.8, 1.15], ['Wheel BR', 0.8, 1.15]];

// One wheel: a 12-sided cylinder 0.7 m across and 0.3 m wide, its axle along X, centred on its
// origin. `turn` spins it about its axle in degrees, as R X does.
export function wheel(x, y, turn = 0) {
  const w = rotate(cylinder({ vertices: 12, radius: 0.35, depth: 0.3, caps: 'fan' }), 'y', 90);
  return translate(turn ? rotate(w, 'x', turn) : w, [x, y, 0.35]);
}

// The car's parts as one mesh, with the face range of each part so a diagram can pick parts out.
// `shift` moves the whole car; `turn` spins the named wheel.
export function car({ shift = [0, 0, 0], turn = {} } = {}) {
  const parts = [
    ['Body', box({ size: [1.6, 3.6, 0.7], center: [0, 0, 0.7] })],
    ['Cabin', box({ size: [1.4, 1.8, 0.5], center: [0, 0.25, 1.3] })],
    ...WHEELS.map(([name, x, y]) => [name, wheel(x, y, turn[name] || 0)]),
  ];
  const ranges = {};
  let start = 0;
  for (const [name, m] of parts) {
    ranges[name] = Array.from({ length: m.faces.length }, (_, i) => start + i);
    start += m.faces.length;
  }
  return { mesh: translate(join(...parts.map(([, m]) => m)), shift), ranges };
}

// A Plain Axes empty: six lines from its middle along X, Y and Z, drawn on top.
export function plainAxes(kit, v, at, size = 0.6, cls = 'd-ink') {
  return [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map((d) => {
    const a = v.project([at[0] - d[0] * size, at[1] - d[1] * size, at[2] - d[2] * size]);
    const b = v.project([at[0] + d[0] * size, at[1] + d[1] * size, at[2] + d[2] * size]);
    return kit.line(a[0], a[1], b[0], b[1], { cls, width: 1.8 });
  });
}
