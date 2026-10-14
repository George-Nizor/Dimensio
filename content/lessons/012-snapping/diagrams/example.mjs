// The exercise done: three blocks stacked corner to corner into a tower, beside five posts standing
// 2 m apart along a strip of ground.
import { cube, box, plane, translate, view, drawMesh, dimension } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const v = view({ azimuth: 18, elevation: 24, at: [256, 150], scale: 38, target: [3.2, 0, 1] });
  const strip = translate(plane({ size: [10, 1] }), [5, 0, 0]);
  const blocks = [0.5, 1.5, 2.5].map((z) => translate(cube(1), [-1.8, -1.2, z]));
  const posts = [0, 2, 4, 6, 8].map((x) => box({ size: [0.2, 0.2, 1.2], center: [x, 0, 0.6] }));
  return kit.svg({ width: 500, height: 240 },
    drawMesh(kit, strip, v, { width: 1.2 }),
    [...posts].reverse().map((p) => drawMesh(kit, p, v, { width: 1.4 })),
    blocks.map((b) => drawMesh(kit, b, v, { width: 1.6 })),
    dimension(kit, v, [6, 0, 0], [8, 0, 0], { offset: [0, -1.4, 0] }),
  );
};
