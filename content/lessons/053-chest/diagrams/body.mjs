// The body in two steps. Left, a box with its top face inset (I), the inner face selected. Right,
// that face extruded 0.45 m down (E), which hollows the chest out.
import { box, facesWhere, inset, extrude, view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { SIZE } from './chest.mjs';

export default (kit) => {
  const start = box({ size: [SIZE.width, SIZE.depth, SIZE.height], center: [0, 0, SIZE.height / 2] });
  const top = facesWhere(start, (c, n) => n[2] > 0.9)[0];
  const ins = inset(start, top, 0.12);
  const ex = extrude(ins.mesh, [ins.face], -0.45);
  const left = view({ at: [120, 120], scale: 130, azimuth: 30, elevation: 32, target: [0, 0, 0.3] });
  const right = view({ at: [370, 120], scale: 130, azimuth: 30, elevation: 32, target: [0, 0, 0.3] });
  return kit.svg({ width: 490, height: 230 },
    drawMesh(kit, ins.mesh, left, { width: 1.4, select: { faces: [ins.face] } }),
    keycap(kit, 120, 214, 'I'), kit.text(140, 219, 'inset', { size: 12 }),
    drawMesh(kit, ex.mesh, right, { width: 1.4, select: { faces: [ins.face] } }),
    keycap(kit, 352, 214, 'E'), kit.text(372, 219, 'down 0.45 m', { size: 12 }),
  );
};
