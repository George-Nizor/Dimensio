// The exercise's two shapes, sculpted from the starter's ball: a lumpy stone and a mushroom cap.
import { view, scale, translate, transform } from '../../../diagrams/mesh.mjs';
import { ball, lumpy, bump, drawSculpt } from './sculpt.mjs';

export default (kit) => {
  const stone = scale(lumpy(ball({ segments: 32, rings: 16 }), 4, 0.15), [1.15, 0.9, 0.62]);
  let cap = ball({ segments: 32, rings: 16 });
  cap = transform(cap, ([x, y, z]) => [x, y, z < -0.15 ? -0.15 + (z + 0.15) * 0.1 : z]);
  cap = bump(scale(cap, [1.2, 1.2, 0.75]), [0, 0, 1], 0.6, 0.1);
  const v = view({ at: [270, 120], scale: 64, elevation: 22 });
  return kit.svg({ width: 540, height: 220 },
    drawSculpt(kit, translate(stone, [-2.0, 0, 0]), v),
    drawSculpt(kit, translate(cap, [1.7, 0, 0.1]), v),
    kit.text(150, 210, 'a lumpy stone', { anchor: 'middle', size: 12 }),
    kit.text(390, 210, 'a mushroom cap', { anchor: 'middle', size: 12 }),
  );
};
