// The exercise's five shapes and their colours. Not a diagram itself.
import { cube, cylinder, uvSphere, translate, mesh, orientOutward } from '../../../diagrams/mesh.mjs';
import { cone } from './parts.mjs';

// A torus lying flat, like Add > Mesh > Torus with fewer segments.
export function torus({ major = 0.75, minor = 0.25, segments = 16, sides = 8, center = [0, 0, 0] } = {}) {
  const verts = [];
  for (let i = 0; i < segments; i += 1) {
    const u = (i / segments) * Math.PI * 2;
    for (let j = 0; j < sides; j += 1) {
      const w = (j / sides) * Math.PI * 2;
      const r = major + minor * Math.cos(w);
      verts.push([center[0] + Math.cos(u) * r, center[1] + Math.sin(u) * r, center[2] + minor * Math.sin(w)]);
    }
  }
  const at = (i, j) => (i % segments) * sides + (j % sides);
  const faces = [];
  for (let i = 0; i < segments; i += 1) for (let j = 0; j < sides; j += 1) faces.push([at(i, j), at(i + 1, j), at(i + 1, j + 1), at(i, j + 1)]);
  return mesh(verts, faces);
}

export const RED = 'd-gizmo-x';
export const GREEN = 'd-gizmo-y';
export const BLUE = 'd-gizmo-z';

export const five = () => [
  [translate(cube(1.4), [0, 0, 0.7]), RED],
  [cylinder({ vertices: 12, radius: 0.6, depth: 1.4, center: [2.2, 0, 0.7] }), BLUE],
  [cone({ vertices: 12, r1: 0.7, depth: 1.4, center: [4.4, 0, 0.7] }), GREEN],
  [uvSphere({ segments: 12, rings: 8, radius: 0.7, center: [6.6, 0, 0.7] }), RED],
  [torus({ center: [8.9, 0, 0.25] }), BLUE],
];
