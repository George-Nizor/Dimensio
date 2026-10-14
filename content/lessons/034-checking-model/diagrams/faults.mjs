// The broken-crate starter's faults on the lesson 27 crate, 0.5 m across. Not a diagram itself.
import { normal } from '../../../diagrams/mesh.mjs';
import { crate } from './crate.mjs';

const near = (a, b) => Math.abs(a - b) < 1e-6;

// The crate, optionally missing the chamfer face along its bottom front edge, with its two front
// panels turned inwards.
export function broken({ hole = true, flipped = true } = {}) {
  const { mesh: m, picked } = crate('done');
  let strip = -1;
  // The chamfer face along the bottom front edge: every corner on the crate's front and bottom.
  m.faces.forEach((f, i) => { if (f.length === 4 && f.every((k) => m.verts[k][1] < -0.239 && m.verts[k][2] < 0.011)) strip = i; });
  const frontPanels = picked.filter((i) => normal(m, m.faces[i])[1] < -0.9);
  if (flipped) frontPanels.forEach((i) => { m.faces[i] = [...m.faces[i]].reverse(); });
  const holeEdges = strip >= 0 ? m.faces[strip].map((a, k, f) => [a, f[(k + 1) % f.length]]) : [];
  if (hole) m.faces = m.faces.filter((_, i) => i !== strip);
  return { mesh: m, holeEdges, frontPanels };
}

// The four corners of the crate's top, where the split-off top's vertices sit on the crate's.
export function topCorners(m) {
  return m.verts.map((p, i) => [p, i]).filter(([p]) => near(p[2], 0.5) && near(Math.abs(p[0]), 0.24) && near(Math.abs(p[1]), 0.24)).map(([, i]) => i);
}
export function topSeam(m) {
  const c = topCorners(m);
  const edges = [];
  for (let a = 0; a < c.length; a += 1) for (let b = a + 1; b < c.length; b += 1) {
    const p = m.verts[c[a]];
    const q = m.verts[c[b]];
    if (near(p[0], q[0]) || near(p[1], q[1])) edges.push([c[a], c[b]]);
  }
  return edges;
}
