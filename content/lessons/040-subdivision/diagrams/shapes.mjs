// Shapes shared by this lesson's diagrams. Not a diagram itself.
import { orientOutward } from '../../../diagrams/mesh.mjs';

// A box whose faces are cut where `cuts` says: [[x...], [y...], [z...]] lists the coordinates of
// every edge loop along each axis, ends included, so loops can sit close to the corners.
export function loopBox(cuts) {
  const verts = [];
  const index = new Map();
  const at = (p) => {
    const k = p.map((v) => v.toFixed(5)).join(',');
    if (!index.has(k)) { index.set(k, verts.length); verts.push(p); }
    return index.get(k);
  };
  const faces = [];
  for (const axis of [0, 1, 2]) {
    const [u, v] = [0, 1, 2].filter((a) => a !== axis);
    for (const side of [cuts[axis][0], cuts[axis][cuts[axis].length - 1]]) {
      for (let i = 0; i < cuts[u].length - 1; i += 1) {
        for (let j = 0; j < cuts[v].length - 1; j += 1) {
          const corner = (a, b) => { const p = [0, 0, 0]; p[axis] = side; p[u] = cuts[u][i + a]; p[v] = cuts[v][j + b]; return at(p); };
          faces.push([corner(0, 0), corner(1, 0), corner(1, 1), corner(0, 1)]);
        }
      }
    }
  }
  return orientOutward({ verts, faces });
}
