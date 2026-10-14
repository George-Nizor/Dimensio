// The cube from the front with a loop cut down the middle, and every vertex left of it selected,
// ready to delete.
import { box, vertsWhere, facesWhere, views, drawMesh } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const m = box({ size: [2, 2, 2], segments: [2, 1, 1] });
  const v = views.front({ at: [180, 115], scale: 70 });
  return kit.svg({ width: 360, height: 240 },
    drawMesh(kit, m, v, { width: 1.8, select: { faces: facesWhere(m, (c) => c[0] < -0.1), verts: vertsWhere(m, (p) => p[0] < -0.5) } }),
    kit.line(180, 30, 180, 200, { cls: 'd-guide', width: 1.2, dash: '5 5' }),
    kit.text(110, 226, 'select, then X > Vertices', { anchor: 'middle', size: 12 }),
    kit.text(250, 226, 'keep', { anchor: 'middle', size: 12 }),
  );
};
