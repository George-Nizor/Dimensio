// The exercise's lamp, as the ngon-lamp starter builds it, and ways to rebuild its faces. Not a
// diagram itself. The base is an 8-sided disc with flat 8-sided caps; the shade has eight sides,
// each one six-sided face bent across a ring of vertices half way up.
import { mesh, cylinder, box, join, normal } from '../../../diagrams/mesh.mjs';

const RINGS = [[0.25, 0.17], [0.35, 0.14], [0.45, 0.08]];
const at = (z, r, i) => [Math.cos(((i + 0.5) * Math.PI) / 4) * r, Math.sin(((i + 0.5) * Math.PI) / 4) * r, z];

// The shade. mode 'ngon' (eight bent hexagons), 'quads' (sixteen quads split at the middle ring)
// or 'tris' (each hexagon split into four triangles, as Ctrl+T does).
export function shade(mode = 'ngon') {
  const verts = RINGS.flatMap(([z, r]) => [...Array(8).keys()].map((i) => at(z, r, i)));
  const faces = [];
  for (let i = 0; i < 8; i += 1) {
    const j = (i + 1) % 8;
    const [b0, b1, m0, m1, t0, t1] = [i, j, 8 + i, 8 + j, 16 + i, 16 + j];
    if (mode === 'ngon') faces.push([b0, b1, m1, t1, t0, m0]);
    if (mode === 'quads') faces.push([b0, b1, m1, m0], [m0, m1, t1, t0]);
    if (mode === 'tris') faces.push([b0, b1, m1], [b0, m1, m0], [m0, m1, t1], [m0, t1, t0]);
  }
  return outward(mesh(verts, faces));
}

// Faces of the open shade turned to face away from its axis.
function outward(m) {
  m.faces = m.faces.map((f) => {
    const n = normal(m, f);
    const c = f.reduce((s, i) => [s[0] + m.verts[i][0], s[1] + m.verts[i][1]], [0, 0]);
    return n[0] * c[0] + n[1] * c[1] < 0 ? [...f].reverse() : f;
  });
  return m;
}

export const base = () => cylinder({ vertices: 8, radius: 0.16, depth: 0.04, center: [0, 0, 0.02] });
export const pole = () => box({ size: [0.03, 0.03, 0.35], center: [0, 0, 0.215] });
export const lamp = (mode = 'ngon') => join(base(), pole(), shade(mode));

// Every face split into a fan of triangles from its first corner, as triangulating everything does.
export function triangulated(m) {
  return { verts: m.verts, faces: m.faces.flatMap((f) => f.slice(1, -1).map((_, k) => [f[0], f[k + 1], f[k + 2]])) };
}
