// The cube after one extrusion: the top face moved up 1 m along its normal, still selected.
import { cube, facesWhere, extrude, view, drawMesh, arrow, keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const start = cube();
  const top = facesWhere(start, (c, n) => n[2] > 0.9);
  const { mesh } = extrude(start, top, 1);
  const v = view({ at: [170, 168], scale: 45, target: [0, 0, 0.5] });
  return kit.svg({ width: 380, height: 280 },
    drawMesh(kit, mesh, v, { select: { faces: top } }),
    arrow(kit, v, [0, 0, 2.05], [0, 0, 2.9]),
    keycap(kit, 320, 140, 'E'),
  );
};
