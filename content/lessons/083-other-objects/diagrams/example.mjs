// The exercise's two shapes before converting: a slime of four metaballs flowed together, and a
// dome made by raising the middle of a NURBS surface, its control points dashed around it.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { drawBlob, ballRing, dome, drawNet, panel } from './shapes.mjs';

export default (kit) => {
  const balls = [{ x: 104, y: 124, r: 32 }, { x: 156, y: 130, r: 28 }, { x: 64, y: 140, r: 18 }, { x: 196, y: 144, r: 14 }, { x: 128, y: 90, r: 20 }];
  const { net, mesh } = dome({ res: 3 });
  const v = view({ azimuth: 30, elevation: 26, at: [388, 120], scale: 54, target: [0, 0, 0.2] });
  return kit.svg({ width: 520, height: 210 },
    panel(kit, 14, 14, 236, 170, 'metaball slime'),
    drawBlob(kit, balls, [20, 20, 244, 180]),
    balls.map((b) => ballRing(kit, b)),
    panel(kit, 270, 14, 236, 170, 'NURBS dome'),
    drawMesh(kit, mesh, v, { width: 0.9 }),
    drawNet(kit, v, net),
  );
};
