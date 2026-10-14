// The cube with its top and front faces extruded with Alt+E > Extrude Individual Faces: each one
// moved 0.8 m along its own normal into a block of its own.
import { cube, facesWhere, extrude, view, drawMesh } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  let m = cube();
  const top = facesWhere(m, (c, n) => n[2] > 0.9);
  const front = facesWhere(m, (c, n) => n[1] < -0.9);
  m = extrude(m, top, 0.8).mesh;
  m = extrude(m, front, 0.8).mesh;
  const v = view({ at: [190, 140], scale: 46, target: [0, -0.3, 0.3] });
  return kit.svg({ width: 400, height: 260 },
    drawMesh(kit, m, v, { width: 1.5, select: { faces: [...top, ...front] } }),
    kit.text(190, 248, 'Alt+E > Extrude Individual Faces', { anchor: 'middle', size: 12 }),
  );
};
