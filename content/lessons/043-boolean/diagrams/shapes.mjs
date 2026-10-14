// Shapes shared by this lesson's diagrams. Not a diagram itself.
import { box, join, view } from '../../../diagrams/mesh.mjs';
import { faceNormal } from '../../037-modifiers/diagrams/modkit.mjs';

// The wall from the exercise, 4 m long, 0.2 m thick and 2.5 m tall, with the window's opening:
// 1 m wide and 1.2 m tall, its bottom 0.8 m up. `faces` chooses how the front and back are cut up:
// 'ngon' is what the Boolean leaves, 'tidy' what Ctrl+T then Alt+J make of it.
export function wallWithWindow(faces = 'ngon') {
  const outer = [[-2, 0], [2, 0], [2, 2.5], [-2, 2.5]];
  const hole = [[0, 0.8], [1, 0.8], [1, 2], [0, 2]];
  const pts = [...outer, ...hole];
  const verts = [...pts.map(([x, z]) => [x, -0.1, z]), ...pts.map(([x, z]) => [x, 0.1, z])];
  // Faces of the front, as seen from the front (counter-clockwise).
  const front = faces === 'ngon'
    ? [[5, 1, 2, 6], [6, 2, 3, 0, 1, 5, 4, 7]]
    : [[2, 6, 5, 1], [4, 7, 3, 0], [7, 6, 2], [0, 1, 4], [1, 5, 4], [7, 2, 3]];
  const fixed = front.map((f) => (faceNormal({ verts }, f)[1] < 0 ? f : [...f].reverse()));
  const out = [...fixed, ...fixed.map((f) => [...f].reverse().map((i) => i + 8))];
  const ring = (ids, inward) => ids.forEach((a, i) => {
    const b = ids[(i + 1) % ids.length];
    const f = [a, b, b + 8, a + 8];
    out.push(inward ? [...f].reverse() : f);
  });
  ring([0, 1, 2, 3], false);
  ring([4, 5, 6, 7], true);
  const m = { verts, faces: out };
  // Outer walls face out and the window's sides face into the opening.
  m.faces = m.faces.map((f) => {
    const n = faceNormal(m, f);
    const c = f.reduce((s, i) => [s[0] + m.verts[i][0] / f.length, s[1], s[2] + m.verts[i][2] / f.length], [0, 0, 0]);
    if (Math.abs(n[1]) > 0.9) return f;
    const inHole = c[0] > -0.01 && c[0] < 1.01 && c[2] > 0.79 && c[2] < 2.01;
    const away = inHole ? [0.5 - c[0], 0, 1.4 - c[2]] : [c[0], 0, c[2] - 1.25];
    return n[0] * away[0] + n[2] * away[2] < 0 ? [...f].reverse() : f;
  });
  return m;
}

// The window's cutter: a box the size of the opening, deeper than the wall.
export const cutter = () => box({ size: [1, 0.6, 1.2], center: [0.5, 0, 1.4] });

// Two 2 m cubes, the second moved 1 m right, 1 m towards the front and 1 m up, combined three ways.

// The overlap is the octant x 0 to 1, y -1 to 0, z 0 to 1.
const inOverlap = (c) => c[0] > -1e-6 && c[0] < 1 + 1e-6 && c[1] > -1 - 1e-6 && c[1] < 1e-6 && c[2] > -1e-6 && c[2] < 1 + 1e-6;

function cubeAt(centre, cut) {
  const m = box({ size: [2, 2, 2], segments: [2, 2, 2], center: centre });
  return { verts: m.verts, faces: m.faces.filter((f) => !cut(centreOf(m, f))) };
}
const centreOf = (m, f) => [0, 1, 2].map((k) => f.reduce((s, i) => s + m.verts[i][k], 0) / f.length);

export function difference() {
  const m = cubeAt([0, 0, 0], inOverlap);
  const o = m.verts.push([0, 0, 0]) - 1;
  const id = (p) => m.verts.findIndex((v) => v.every((x, k) => Math.abs(x - p[k]) < 1e-6));
  const facing = (f, n) => (faceNormal(m, f).reduce((s, x, k) => s + x * n[k], 0) < 0 ? [...f].reverse() : f);
  // The three walls of the notch, facing into it.
  m.faces.push(facing([o, id([0, -1, 0]), id([0, -1, 1]), id([0, 0, 1])], [1, 0, 0]));
  m.faces.push(facing([o, id([0, 0, 1]), id([1, 0, 1]), id([1, 0, 0])], [0, -1, 0]));
  m.faces.push(facing([o, id([1, 0, 0]), id([1, -1, 0]), id([0, -1, 0])], [0, 0, 1]));
  return m;
}

export function union() {
  return join(cubeAt([0, 0, 0], inOverlap), cubeAt([1, -1, 1], inOverlap));
}

export const intersect = () => box({ size: [1, 1, 1], center: [0.5, -0.5, 0.5] });

// The view of the wall the diagrams share: from the front, a little to the right and above.
export const wallView = (at, scale) => view({ at, scale, azimuth: 24, elevation: 14, target: [0, 0, 1.25] });
