// Add > Surface > NURBS Surface gives a 4 by 4 grid of control points. Selecting the middle four
// and moving them up with G Z pulls the smooth sheet into a dome.
import { view, drawMesh, keycap } from '../../../diagrams/mesh.mjs';
import { dome, drawNet, panel } from './shapes.mjs';

export default (kit) => {
  const flat = dome({ lift: 0.25, res: 3 });
  const raised = dome({ lift: 1.2, res: 3 });
  const middle = [[1, 1], [2, 1], [1, 2], [2, 2]];
  const v = (x) => view({ azimuth: 30, elevation: 30, at: [x, 116], scale: 62, target: [0, 0, 0.3] });
  return kit.svg({ width: 540, height: 210 },
    panel(kit, 14, 14, 220, 170, 'NURBS Surface'),
    drawMesh(kit, flat.mesh, v(124), { width: 0.8 }),
    drawNet(kit, v(124), flat.net, { select: middle }),
    keycap(kit, 252, 88, 'G'), keycap(kit, 288, 88, 'Z'),
    kit.line(240, 120, 300, 120, { cls: 'd-mark', width: 2 }), kit.arrowhead(300, 120, 0, { size: 8 }),
    panel(kit, 306, 14, 220, 170, 'middle points raised'),
    drawMesh(kit, raised.mesh, v(416), { width: 0.8 }),
    drawNet(kit, v(416), raised.net, { select: middle }),
  );
};
