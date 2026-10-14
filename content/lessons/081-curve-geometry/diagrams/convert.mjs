// Object > Convert > Mesh: the curve with its control points and Depth becomes a mesh of vertices
// and faces in the same shape.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { DEFAULT_CURVE, drawPath, pathPoints, tube, panel } from './curves.mjs';

export default (kit) => {
  const left = view({ azimuth: 0, elevation: 50, at: [125, 92], scale: 92 });
  const right = view({ azimuth: 0, elevation: 50, at: [395, 92], scale: 92 });
  const mesh = tube(pathPoints(DEFAULT_CURVE, 4), 0.15, 6);
  return kit.svg({ width: 520, height: 210 },
    panel(kit, 14, 14, 222, 156, 'curve: points and handles'),
    drawMesh(kit, mesh, left, { mode: 'xray', width: 0.6, cls: 'd-guide' }),
    drawPath(kit, left, DEFAULT_CURVE, { handles: true, width: 2.2 }),
    kit.line(250, 92, 288, 92, { cls: 'd-mark', width: 2 }), kit.arrowhead(288, 92, 0, { size: 8 }),
    panel(kit, 284, 14, 222, 156, 'mesh: vertices and faces'),
    drawMesh(kit, mesh, right, { width: 1 }),
    mesh.verts.map((p) => { const [x, y] = right.project(p); return kit.dot(x, y, { r: 1.8 }); }),
    kit.text(260, 200, 'Object > Convert > Mesh', { anchor: 'middle', size: 12, cls: 'd-tag' }),
  );
};
