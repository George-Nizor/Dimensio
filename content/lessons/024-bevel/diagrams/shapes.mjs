// Cubes with one edge or one corner bevelled, built vertex by vertex the way Ctrl+B and
// Shift+Ctrl+B leave them with one segment. Not a diagram itself.
import { mesh, orientOutward } from '../../../diagrams/mesh.mjs';

// The default cube with its top front edge bevelled `w` metres. The two end faces get a fifth
// corner each, as they do in Blender.
export function edgeBevel(w = 0.4) {
  const verts = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, 1, 1], [1, 1, 1],
    [-1, -1 + w, 1], [1, -1 + w, 1], [-1, -1, 1 - w], [1, -1, 1 - w]];
  const faces = [[0, 3, 2, 1], [0, 1, 9, 8], [6, 7, 5, 4], [8, 9, 7, 6], [2, 3, 4, 5], [0, 8, 6, 4, 3], [1, 2, 5, 7, 9]];
  return { mesh: orientOutward(mesh(verts, faces)), chamfer: 3 };
}

// The default cube with its top front right corner bevelled `w` metres: a triangle in its place.
export function cornerBevel(w = 0.6) {
  const verts = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, 1, 1], [-1, 1, 1],
    [1 - w, -1, 1], [1, -1 + w, 1], [1, -1, 1 - w]];
  const faces = [[0, 3, 2, 1], [4, 7, 8, 5, 6], [0, 1, 9, 7, 4], [1, 2, 5, 8, 9], [2, 3, 6, 5], [0, 4, 6, 3], [7, 9, 8]];
  return { mesh: orientOutward(mesh(verts, faces)), triangle: 6 };
}
