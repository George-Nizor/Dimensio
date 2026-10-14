// The mushroom after the lesson: cap and stem remeshed into one surface you can sculpt across.
import { view, transform, join, cylinder, translate, scale } from '../../../diagrams/mesh.mjs';
import { ball, drawSculpt } from './sculpt.mjs';

export default (kit) => {
  let cap = transform(ball({ segments: 32, rings: 16 }), ([x, y, z]) => [x, y, z < -0.2 ? -0.2 : z]);
  cap = scale(cap, [1.2, 1.2, 0.6]);
  const stem = translate(cylinder({ vertices: 16, radius: 0.32, depth: 1.2 }), [0, 0, -0.75]);
  const v = view({ at: [240, 92], scale: 80, elevation: 18 });
  return kit.svg({ width: 480, height: 240 },
    drawSculpt(kit, stem, v),
    drawSculpt(kit, translate(cap, [0, 0, 0.1]), v),
  );
};
