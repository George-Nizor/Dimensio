// The two imports side by side: the lantern at its real 0.6 m, and the crate from the .obj file
// 50 m wide, a hundred times too big, with the Sidebar's Dimensions for the crate.
import { view, box as boxMesh, drawMesh, dimension } from '../../../diagrams/mesh.mjs';
import { area, field } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const v = view({ scale: 2.2, at: [170, 190] });
  const crate = boxMesh({ size: [50, 50, 50], center: [0, 0, 25] });
  const spot = [-40, -32, 0.3];
  const [lx, ly] = v.project(spot);
  return kit.svg({ width: 480, height: 250 },
    drawMesh(kit, crate, v, { width: 1.6 }),
    dimension(kit, v, [25, -25, 0], [25, 25, 0], { offset: [8, 0, 0], label: '50 m' }),
    kit.circle(lx, ly, 6, { cls: 'd-mark', width: 1.6 }),
    kit.text(lx, ly + 24, 'the lantern, 0.6 m', { anchor: 'middle', size: 11 }),
    area(kit, 300, 30, 170, 110, { title: 'Item' }),
    kit.text(312, 66, 'Dimensions', { size: 11, cls: 'd-label' }),
    field(kit, 340, 74, 'X', '50 m', { width: 120, mark: true }),
    field(kit, 340, 96, 'Y', '50 m', { width: 120 }),
    field(kit, 340, 118, 'Z', '50 m', { width: 120 }),
  );
};
