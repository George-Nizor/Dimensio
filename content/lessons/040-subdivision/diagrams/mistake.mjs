// The top of an 8-sided cylinder under Subdivision Surface at level 2. Wrong: the cap is one n-gon,
// and it subdivides into a star of long, thin faces. Right: the cap filled with four quads by
// Grid Fill subdivides into an even grid.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { subdivide, panel } from '../../037-modifiers/diagrams/modkit.mjs';

function cylinder8(gridCap) {
  const verts = [];
  for (const z of [-0.6, 0.6]) for (let i = 0; i < 8; i += 1) { const t = (i / 8) * Math.PI * 2; verts.push([Math.cos(t), Math.sin(t), z]); }
  const faces = [];
  for (let i = 0; i < 8; i += 1) { const j = (i + 1) % 8; faces.push([i, j, 8 + j, 8 + i]); }
  faces.push([7, 6, 5, 4, 3, 2, 1, 0]);
  if (gridCap) {
    const c = verts.push([0, 0, 0.6]) - 1;
    for (let k = 0; k < 8; k += 2) faces.push([8 + k, 8 + k + 1, 8 + ((k + 2) % 8), c]);
  } else faces.push([8, 9, 10, 11, 12, 13, 14, 15]);
  return { verts, faces };
}

export default (kit) => {
  const v1 = view({ at: [130, 112], scale: 70, elevation: 62 });
  const v2 = view({ at: [380, 112], scale: 70, elevation: 62 });
  return kit.svg({ width: 510, height: 250 },
    panel(kit, 14, 14, 232, 200),
    drawMesh(kit, subdivide(cylinder8(false), 2), v1, { width: 0.6 }),
    kit.tag(130, 240, 'n-gon cap', { tone: 'bad' }),
    panel(kit, 264, 14, 232, 200),
    drawMesh(kit, subdivide(cylinder8(true), 2), v2, { width: 0.6 }),
    kit.tag(380, 240, 'quads from Grid Fill'),
  );
};
