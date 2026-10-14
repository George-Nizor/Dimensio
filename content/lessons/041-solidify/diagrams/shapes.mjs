// Shapes shared by this lesson's diagrams. Not a diagram itself.
import { uvSphere, translate } from '../../../diagrams/mesh.mjs';

// The bottom half of a 16 by 8 UV sphere: the top half's vertices deleted, leaving an open bowl.
export function openBowl(radius = 1) {
  const s = uvSphere({ segments: 16, rings: 8, radius });
  const keep = s.verts.map((v) => v[2] <= 1e-6);
  const map = new Map();
  const verts = [];
  s.verts.forEach((v, i) => { if (keep[i]) map.set(i, verts.push(v) - 1); });
  const faces = s.faces.filter((f) => f.every((i) => keep[i])).map((f) => f.map((i) => map.get(i)));
  return translate({ verts, faces }, [0, 0, radius]);
}

// A plane standing up, facing the front: `w` wide and `h` tall, its normal toward -Y.
export function standingPlane(w, h, segments = 1) {
  const verts = [];
  for (let j = 0; j <= 1; j += 1) for (let i = 0; i <= segments; i += 1) verts.push([-w / 2 + (w * i) / segments, 0, j * h]);
  const faces = [];
  for (let i = 0; i < segments; i += 1) faces.push([i, i + 1, segments + 2 + i, segments + 1 + i]);
  return { verts, faces };
}

// An L-shaped wall surface: 4 m along X, then 3 m along Y, 2.5 m tall, normals facing out of the L.
export function lWall() {
  const verts = [[0, 0, 0], [4, 0, 0], [4, 0, 2.5], [0, 0, 2.5], [4, 3, 0], [4, 3, 2.5]];
  return { verts, faces: [[0, 1, 2, 3], [1, 4, 5, 2]] };
}

// Both sides of an open surface, so a diagram shows its inside too.
export function twoSided(m) {
  return { verts: m.verts, faces: [...m.faces, ...m.faces.map((f) => [...f].reverse())] };
}
