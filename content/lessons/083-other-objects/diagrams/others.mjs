// Left, a point cloud: loose points with no edges or faces. Right, a volume: a grid of densities,
// drawn as dots that grow with the density, thick in the middle and thin at the edge, like smoke.
import { random } from '../../../diagrams/lib.mjs';
import { panel } from './shapes.mjs';

export default (kit) => {
  const next = random(11);
  const dots = [];
  while (dots.length < 140) {
    const x = (next() - 0.5) * 180;
    const y = (next() - 0.5) * 120;
    if ((x / 90) ** 2 + (y / 60) ** 2 < 1) dots.push(kit.dot(132 + x, 94 + y, { r: 2 }));
  }
  const cells = [];
  for (let i = 0; i < 18; i += 1) {
    for (let j = 0; j < 12; j += 1) {
      const x = -90 + i * 10 + 5;
      const y = -60 + j * 10 + 5;
      const d = 1 - Math.hypot(x / 90, y / 62) + 0.15 * Math.sin(i * 1.7 + j * 2.3);
      if (d < 0.05) continue;
      cells.push(kit.dot(388 + x, 94 + y, { r: Math.min(4.6, 0.6 + d * 5) }));
    }
  }
  return kit.svg({ width: 520, height: 200 },
    panel(kit, 14, 14, 236, 160, 'point cloud: points only'),
    dots,
    panel(kit, 270, 14, 236, 160, 'volume: a grid of densities'),
    cells,
  );
};
