// A box whose front is two faces. Both selected and extruded 1 m with E: they move as one region,
// so the new block has one wall all round and none between the two faces.
import { box, facesWhere, extrude, view, drawMesh, arrow } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const start = box({ size: [2, 2, 2], segments: [2, 1, 1] });
  const front = facesWhere(start, (c, n) => n[1] < -0.9);
  const { mesh } = extrude(start, front, 1);
  const v = view({ at: [190, 130], scale: 40, target: [0, -0.5, 0] });
  return kit.svg({ width: 400, height: 250 },
    drawMesh(kit, mesh, v, { width: 1.5, select: { faces: front } }),
    arrow(kit, v, [0, -2.1, 0], [0, -2.9, 0]),
  );
};
