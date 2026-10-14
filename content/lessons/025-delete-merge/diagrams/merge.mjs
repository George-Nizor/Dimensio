// Left, the cube with its two top front vertices selected. Right, after M > At Center: one vertex
// halfway between where they were, so the front and the top become triangles.
import { cube, view, drawMesh, vertsWhere, keycap } from '../../../diagrams/mesh.mjs';
import { panel, copyMesh } from './helpers.mjs';

export default (kit) => {
  const m = cube();
  const pair = vertsWhere(m, (p) => p[1] < -0.9 && p[2] > 0.9);
  const merged = copyMesh(m);
  for (const i of pair) merged.verts[i] = [0, -1, 1];
  const left = view({ at: [126, 108], scale: 46 });
  const right = view({ at: [414, 108], scale: 46 });
  return kit.svg({ width: 540, height: 230 },
    panel(kit, 14, 14, 224, 180, 'two vertices selected'),
    drawMesh(kit, m, left, { width: 1.5, select: { verts: pair } }),
    keycap(kit, 270, 104, 'M'),
    panel(kit, 302, 14, 224, 180, 'At Center'),
    drawMesh(kit, merged, right, { width: 1.5, select: { verts: pair.slice(0, 1) } }),
  );
};
