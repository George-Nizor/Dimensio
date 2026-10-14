// Coins pouring from just in front of a treasure chest's lid and settling in a heap on the floor.
import { view, drawMesh, box, plane, cylinder, translate, join } from '../../../diagrams/mesh.mjs';
import { random } from '../../../diagrams/lib.mjs';

export default (kit) => {
  const v = view({ azimuth: 50, elevation: 22, at: [250, 170], scale: 260, target: [0, -0.3, 0.2] });
  const next = random(12);
  const coin = (x, y, z) => translate(cylinder({ vertices: 10, radius: 0.04, depth: 0.008 }), [x, y, z]);
  const landed = Array.from({ length: 40 }, () => coin((next() - 0.5) * 0.3, -0.4 + (next() - 0.5) * 0.3, 0.004));
  const falling = Array.from({ length: 9 }, (_, i) => coin((next() - 0.5) * 0.24, -0.4 + (next() - 0.5) * 0.24, 0.05 + i * 0.05));
  return kit.svg({ width: 500, height: 260 },
    drawMesh(kit, plane({ size: [1.6, 1.6] }), v, { width: 1 }),
    drawMesh(kit, box({ size: [0.8, 0.5, 0.5], center: [0, 0, 0.25] }), v, { width: 1.4 }),
    drawMesh(kit, join(...landed, ...falling), v, { width: 0.8 }),
  );
};
