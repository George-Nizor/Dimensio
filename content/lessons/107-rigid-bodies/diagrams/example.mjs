// A wall of blocks knocked over by a ball: the ball has passed through and the blocks lie
// tumbled on the ground behind it, with a few still standing.
import { view, drawMesh, join } from '../../../diagrams/mesh.mjs';
import { knocked, ball, ground } from './scene.mjs';

export default (kit) => {
  const v = view({ azimuth: -35, elevation: 22, at: [250, 140], scale: 60, target: [1, 0, 0.3] });
  return kit.svg({ width: 500, height: 250 },
    drawMesh(kit, ground(4.4), v, { width: 1.2 }),
    drawMesh(kit, join(knocked(), ball(3)), v, { width: 1.5 }),
  );
};
