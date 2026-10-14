// The default cube with each side measured at 2 m, as the Sidebar's Dimensions read it.
import { cube, translate, view, drawMesh, dimension } from '../../../diagrams/mesh.mjs';
import { field } from './parts.mjs';

export default (kit) => {
  const v = view({ at: [140, 140], scale: 46, target: [0, 0, 1] });
  return kit.svg({ width: 480, height: 250 },
    drawMesh(kit, translate(cube(2), [0, 0, 1]), v, { width: 1.8 }),
    dimension(kit, v, [-1, -1, 0], [1, -1, 0], { offset: [0, -0.5, 0] }),
    dimension(kit, v, [1, -1, 0], [1, 1, 0], { offset: [0.5, 0, 0] }),
    dimension(kit, v, [-1, -1, 0], [-1, -1, 2], { offset: [-0.5, 0, 0] }),
    kit.text(300, 80, 'Dimensions', { size: 12 }),
    field(kit, 290, 104, 'X', '2 m', { labelWidth: 30, width: 120 }),
    field(kit, 290, 128, 'Y', '2 m', { labelWidth: 30, width: 120 }),
    field(kit, 290, 152, 'Z', '2 m', { labelWidth: 30, width: 120 }),
  );
};
