// Shapes for this lesson's diagrams: the box, the tank and the pipe from the exercise, open and
// closed. Not a diagram itself. The tank's caps are the faces Blender 5.2.2 makes on a 12-sided
// hole: Fill (Alt+F) with Beauty on, and Grid Fill with its default settings.
import { box, cylinder, mesh, rotate, translate, join, normal } from '../../../diagrams/mesh.mjs';

const near = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) < 1e-6;
const find = (m, p) => m.verts.findIndex((q) => near(p, q));
const upward = (m, face) => (normal(m, face)[2] < 0 ? [...face].reverse() : face);

// The box: 1 m, cut once down the middle across X, with its top missing.
export function openBox() {
  const m = box({ size: [1, 1, 1], segments: [2, 1, 1], center: [0, 0, 0.5] });
  m.faces = m.faces.filter((f) => !f.every((i) => m.verts[i][2] > 0.999));
  return m;
}
// The six vertices round the box's top, in order round the rim.
export const boxRim = (m) => [[-0.5, -0.5, 1], [0, -0.5, 1], [0.5, -0.5, 1], [0.5, 0.5, 1], [0, 0.5, 1], [-0.5, 0.5, 1]].map((p) => find(m, p));
export const rimEdges = (rim) => rim.map((a, i) => [a, rim[(i + 1) % rim.length]]);

export function filledBox() {
  const m = openBox();
  m.faces.push(upward(m, boxRim(m)));
  return m;
}
export function splitBox() {
  const m = openBox();
  const [a, b, c, d, e, f] = boxRim(m);
  m.faces.push(upward(m, [a, b, e, f]), upward(m, [b, c, d, e]));
  return m;
}

// The tank: 12 sides, 1 m across and 1 m tall. Ring vertex k sits at 30k degrees.
const ANGLE = (k) => (k * Math.PI) / 6;
export function tank(top = 'open') {
  const m = cylinder({ vertices: 12, radius: 0.5, depth: 1, caps: 'none', center: [0, 0, 0.5] });
  const ring = [...Array(12).keys()].map((k) => 12 + k);
  if (top === 'ngon') m.faces.push(upward(m, ring));
  if (top === 'fill' || top === 'grid') {
    // Blender lists the rim from -150 degrees; rim index i is ring vertex (i + 7) % 12.
    const rim = (i) => ring[(i + 7) % 12];
    if (top === 'fill') {
      for (const t of [[9, 7, 8], [10, 7, 9], [10, 11, 7], [11, 5, 6], [0, 5, 11], [0, 4, 5], [1, 3, 0], [11, 6, 7], [2, 3, 1], [3, 4, 0]]) m.faces.push(upward(m, t.map(rim)));
    } else {
      const inner = [[0.2582, 0.0082], [0.0082, 0.2582], [-0.0082, -0.2582], [-0.2582, -0.0082]].map(([x, y]) => m.verts.push([x, y, 1]) - 1);
      const at = (i) => (i < 12 ? rim(i) : inner[i - 12]);
      for (const q of [[6, 12, 4, 5], [12, 14, 3, 4], [14, 1, 2, 3], [7, 13, 12, 6], [13, 15, 14, 12], [15, 0, 1, 14], [8, 9, 13, 7], [9, 10, 15, 13], [10, 11, 0, 15]]) m.faces.push(upward(m, q.map(at)));
    }
  }
  return m;
}
export const tankRim = () => [...Array(12).keys()].map((k) => 12 + k);

// The pipe: two 8-sided tubes 0.3 m across along X, closed at their outer ends, with a 0.6 m gap.
function tube(x0, x1, closedAt) {
  let m = cylinder({ vertices: 8, radius: 0.15, depth: x1 - x0, caps: 'none' });
  m = translate(rotate(m, 'y', 90), [(x0 + x1) / 2, 0, 0]);
  const end = m.verts.map((p, i) => [p, i]).filter(([p]) => Math.abs(p[0] - closedAt) < 1e-6).map(([, i]) => i);
  const tip = m.verts.push([closedAt, 0, 0]) - 1;
  end.sort((a, b) => Math.atan2(m.verts[a][2], m.verts[a][1]) - Math.atan2(m.verts[b][2], m.verts[b][1]));
  end.forEach((a, i) => {
    const face = [a, end[(i + 1) % end.length], tip];
    m.faces.push(normal(m, face)[0] * Math.sign(closedAt) < 0 ? face.reverse() : face);
  });
  return m;
}
export function pipe(bridged = false) {
  const m = join(tube(-0.9, -0.3, -0.9), tube(0.3, 0.9, 0.9));
  if (bridged) {
    const ring = (x) => m.verts.map((p, i) => [p, i]).filter(([p]) => Math.abs(p[0] - x) < 1e-6).map(([, i]) => i)
      .sort((a, b) => Math.atan2(m.verts[a][2], m.verts[a][1]) - Math.atan2(m.verts[b][2], m.verts[b][1]));
    const a = ring(-0.3);
    const b = ring(0.3);
    a.forEach((v, i) => {
      const j = (i + 1) % a.length;
      const face = [v, a[j], b[j], b[i]];
      const c = [0, (m.verts[v][1] + m.verts[a[j]][1]) / 2, (m.verts[v][2] + m.verts[a[j]][2]) / 2];
      const n = normal(m, face);
      m.faces.push(n[1] * c[1] + n[2] * c[2] < 0 ? face.reverse() : face);
    });
  }
  return m;
}
export const pipeRims = (m) => [-0.3, 0.3].map((x) => m.verts.map((p, i) => [p, i]).filter(([p]) => Math.abs(p[0] - x) < 1e-6).map(([, i]) => i)
  .sort((a, b) => Math.atan2(m.verts[a][2], m.verts[a][1]) - Math.atan2(m.verts[b][2], m.verts[b][1])));

export { mesh };
