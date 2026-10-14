// Wrong: the same Draw stroke on a ball with few faces pulls out a spike. Right: on the dense ball
// it makes a smooth bump.
import { view, uvSphere } from '../../../diagrams/mesh.mjs';
import { ball, bump, drawSculpt } from './sculpt.mjs';

export default (kit) => {
  const coarse = bump(uvSphere({ segments: 8, rings: 4 }), [1, 0, 0], 0.5, 0.6);
  const dense = bump(ball({ segments: 32, rings: 16 }), [1, 0, 0], 0.5, 0.3);
  return kit.svg({ width: 480, height: 220 },
    drawSculpt(kit, coarse, view({ at: [110, 104], scale: 60 })),
    kit.tag(120, 206, 'too few faces: a spike', { tone: 'bad' }),
    drawSculpt(kit, dense, view({ at: [350, 104], scale: 60 })),
    kit.tag(360, 206, 'dense ball: a smooth bump'),
  );
};
