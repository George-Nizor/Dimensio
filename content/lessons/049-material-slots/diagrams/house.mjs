// The house block from this lesson's exercise file (blender/starters/house-block.py), built from the
// same vertices and faces. Not a diagram itself. Walls 2 m by 2 m and 1.6 m tall, a gabled roof
// with its ridge at 2.6 m along X, and a door 0.6 m wide and 1.1 m tall in the middle of the front
// (-Y) wall. The walls are cut by one loop at the door's height and two at its sides, so every
// face is a quad or a triangle and every edge joins two faces. `parts` says which faces are walls,
// roof and door.
import { mesh, orientOutward } from '../../../diagrams/mesh.mjs';

export function house() {
  const xs = [-1, -0.3, 0.3, 1];
  const zs = [0, 1.1, 1.6];
  const verts = [];
  const at = ([x, y, z]) => {
    const i = verts.findIndex((p) => p[0] === x && p[1] === y && p[2] === z);
    return i >= 0 ? i : verts.push([x, y, z]) - 1;
  };
  const faces = [];
  const parts = { walls: [], roof: [], door: [] };
  const add = (part, ...corners) => { parts[part].push(faces.length); faces.push(corners.map(at)); };
  for (const y of [-1, 1]) {
    for (let r = 0; r < 2; r += 1) {
      for (let c = 0; c < 3; c += 1) {
        add(y < 0 && r === 0 && c === 1 ? 'door' : 'walls', [xs[c], y, zs[r]], [xs[c + 1], y, zs[r]], [xs[c + 1], y, zs[r + 1]], [xs[c], y, zs[r + 1]]);
      }
    }
    for (let c = 0; c < 3; c += 1) add('walls', [xs[c], y, 1.6], [xs[c + 1], y, 1.6], [0, y, 2.6]);
  }
  for (const x of [-1, 1]) {
    for (let r = 0; r < 2; r += 1) add('walls', [x, -1, zs[r]], [x, 1, zs[r]], [x, 1, zs[r + 1]], [x, -1, zs[r + 1]]);
  }
  for (let c = 0; c < 3; c += 1) add('walls', [xs[c], -1, 0], [xs[c + 1], -1, 0], [xs[c + 1], 1, 0], [xs[c], 1, 0]);
  add('roof', [-1, -1, 1.6], [0, -1, 2.6], [0, 1, 2.6], [-1, 1, 1.6]);
  add('roof', [1, -1, 1.6], [1, 1, 1.6], [0, 1, 2.6], [0, -1, 2.6]);
  return { mesh: orientOutward(mesh(verts, faces)), parts };
}

// The class each part wears once it has its material: pale walls, a red roof, a blue door.
export const COLOURS = { walls: 'd-face-1', roof: 'd-gizmo-x', door: 'd-gizmo-z' };

export function partOf(parts) {
  const map = new Map();
  for (const [part, list] of Object.entries(parts)) for (const f of list) map.set(f, part);
  return (f) => map.get(f);
}
