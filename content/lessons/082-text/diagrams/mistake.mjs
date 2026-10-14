// One converted letter I. Wrong: straight after Convert, its front face is a separate piece from its
// sides (drawn pulled apart to show it). Right: after Merge by Distance they share their vertices.
import { view, drawMesh, translate } from '../../../diagrams/mesh.mjs';
import { extrudeOutline, panel } from './letters.mjs';

export default (kit) => {
  const solid = extrudeOutline([[0, 0], [0.22, 0], [0.22, 1], [0, 1]], 0.12);
  const stand = (m) => ({ verts: m.verts.map(([x, y, z]) => [x - 0.11, -z, y]), faces: m.faces });
  const front = stand({ verts: solid.verts, faces: [solid.faces[0]] });
  const rest = stand({ verts: solid.verts, faces: solid.faces.slice(1) });
  const v = (x) => view({ azimuth: 35, elevation: 18, at: [x, 104], scale: 120, target: [0, 0, 0.5] });
  const corners = (m, vv) => m.verts.map((p) => { const [x, y] = vv.project(p); return kit.dot(x, y, { r: 3, cls: 'd-mark-fill' }); });
  return kit.svg({ width: 480, height: 230 },
    panel(kit, 14, 14, 210, 170),
    drawMesh(kit, rest, v(110), { width: 1.4 }),
    drawMesh(kit, translate(front, [0, -0.25, 0]), v(110), { width: 1.4 }),
    kit.tag(119, 210, 'faces not joined', { tone: 'bad' }),
    panel(kit, 256, 14, 210, 170),
    drawMesh(kit, stand(solid), v(361), { width: 1.4 }),
    corners(stand(solid), v(361)),
    kit.tag(361, 210, 'merged by distance'),
  );
};
