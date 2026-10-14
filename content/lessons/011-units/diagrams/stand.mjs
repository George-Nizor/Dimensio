// Left, a door just added at the centre of the world, half below the grid. Right, the same door
// moved up 1.05 m with G and Z, so it stands on the grid.
import { box, views, drawMesh, dimension } from '../../../diagrams/mesh.mjs';
import { panel } from './parts.mjs';

export default (kit) => {
  const door = (z) => box({ size: [0.9, 0.1, 2.1], center: [0, 0, z] });
  const cell = (x, z, label) => {
    const v = views.front({ at: [x + 100, 130], scale: 46, target: [0, 0, 0.5] });
    const [g0] = v.project([-1.6, 0, 0]);
    const [g1, gy] = v.project([1.6, 0, 0]);
    return [
      panel(kit, x, 14, 200, 210, label),
      kit.line(g0, gy, g1, gy, { cls: 'd-guide', width: 1.6 }),
      drawMesh(kit, door(z), v, { width: 1.6, cls: z > 0 ? 'd-mark' : 'd-ink' }),
      z > 0 ? dimension(kit, v, [0.45, 0, 0], [0.45, 0, 1.05], { offset: [0.35, 0, 0], label: '1.05 m' }) : '',
    ];
  };
  return kit.svg({ width: 460, height: 252 },
    cell(14, 0, 'as added'),
    cell(246, 1.05, 'G, Z, 1.05'),
  );
};
