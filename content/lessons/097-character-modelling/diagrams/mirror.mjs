// One half of the torso with the Mirror modifier: the solid half is the mesh you edit, the faint
// half is the modifier's copy. With Clipping on, the vertices on the mirror line (picked out) stay
// on it, so the halves always meet.
import { views, drawMesh, box, mirror, vertsWhere } from '../../../diagrams/mesh.mjs';
import { frame } from './charkit.mjs';

export default (kit) => {
  const half = box({ size: [0.19, 0.22, 0.5], segments: [1, 1, 2], center: [0.095, 0, 1.2] });
  const v = views.front({ at: [230, 130], scale: 300, target: [0, 0, 1.2] });
  const seam = vertsWhere(half, (p) => Math.abs(p[0]) < 1e-6);
  return kit.svg({ width: 460, height: 260 },
    frame(kit, 14, 14, 432, 230),
    drawMesh(kit, mirror(half, 'x'), v, { mode: 'wire', cls: 'd-guide', width: 1 }),
    drawMesh(kit, half, v, { mode: 'xray', width: 1.6, select: { verts: seam } }),
    kit.line(230, 30, 230, 228, { cls: 'd-mark', width: 1.4, dash: '6 5' }),
    kit.text(110, 230, 'the Mirror copy', { anchor: 'middle', size: 12 }),
    kit.text(350, 230, 'the half you edit', { anchor: 'middle', size: 12 }),
    kit.text(240, 46, 'Clipping: these stay on the line', { size: 12 }),
  );
};
