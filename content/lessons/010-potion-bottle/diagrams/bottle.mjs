// The bottle's three parts, built with the lesson's settings, and the front outline of Kenney's
// potion measured in Blender. Not a diagram itself.
import { uvSphere, cylinder, translate, scale } from '../../../diagrams/mesh.mjs';
import { cone } from './parts.mjs';

// UV sphere: Segments 8, Rings 6, Radius 0.16 m, Location Z 0.12 m, then S Z 0.75 around its middle.
export const bodyAsAdded = () => uvSphere({ segments: 8, rings: 6, radius: 0.16, center: [0, 0, 0.12] });
export const body = () => translate(scale(uvSphere({ segments: 8, rings: 6, radius: 0.16 }), [1, 1, 0.75]), [0, 0, 0.12]);
// Cylinder: Vertices 8, Radius 0.11 m, Depth 0.06 m, Location Z 0.25 m.
export const neck = () => cylinder({ vertices: 8, radius: 0.11, depth: 0.06, center: [0, 0, 0.25] });
// Cone: Vertices 8, Radius 1 0.07 m, Radius 2 0.09 m, Depth 0.12 m, Location Z 0.34 m.
export const cork = (at = [0, 0, 0.34]) => cone({ vertices: 8, r1: 0.07, r2: 0.09, depth: 0.12, center: at });

// Half of each front outline, from the base up, as (x, z) in metres. Kenney's comes from the widest
// vertex at each height of models/kenney-dungeon-potion; the bottle's from the settings above.
export const kenneyHalf = [[0.118, 0], [0.164, 0.059], [0.148, 0.152], [0.088, 0.236], [0.111, 0.236], [0.111, 0.295], [0.07, 0.295], [0.087, 0.382], [0.069, 0.402], [0, 0.402]];
const ring = (lat) => [0.16 * Math.cos((lat * Math.PI) / 180), 0.12 + 0.75 * 0.16 * Math.sin((lat * Math.PI) / 180)];
export const bottleHalf = [[0, 0], ring(-60), ring(-30), ring(0), ring(30), [0.11, 0.22], [0.11, 0.28], [0.07, 0.28], [0.09, 0.4], [0, 0.4]];

// A closed outline on the page from a half outline, mirrored about x = 0.
export function outline(half, toPage) {
  const right = half.map(([x, z]) => toPage(x, z));
  const left = [...half].reverse().map(([x, z]) => toPage(-x, z));
  return [...right, ...left];
}
