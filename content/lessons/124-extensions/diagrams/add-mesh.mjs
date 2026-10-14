// What Extra Mesh Objects adds: Add > Mesh now ends with Round Cube and a set of submenus, among
// them Extras with its Rock Generator.
import { menu } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const mesh = menu(kit, 16, 16, ['Plane', 'Cube', 'Circle', 'UV Sphere', 'Ico Sphere', 'Cylinder', 'Cone', 'Torus', '-', 'Grid', 'Monkey', '-', { label: 'Round Cube', mark: true }, '-', { label: 'Single Vert', arrow: true }, { label: 'Torus Objects', arrow: true }, { label: 'Math Functions', arrow: true }, { label: 'Gears', arrow: true }, { label: 'Pipe Joints', arrow: true }, { label: 'Gemstones', arrow: true }, { label: 'Extras', mark: true, arrow: true }], { width: 170, title: 'Mesh', row: 18, size: 11 });
  const row = mesh.row('Extras');
  const sub = menu(kit, 192, row.y - 22, ['Rock Generator', 'Beam Builder', 'Wall Factory', 'Simple Star'].map((label) => (label === 'Rock Generator' ? { label, mark: true } : label)), { width: 150, row: 18, size: 11 });
  const first = mesh.row('Round Cube');
  return kit.svg({ width: 360, height: 430 },
    mesh.svg, sub.svg,
    kit.line(190, first.y + 9, 190, row.y + 9, { cls: 'd-mark', width: 1.4 }),
    kit.line(186, first.y + 9, 190, first.y + 9, { cls: 'd-mark', width: 1.4 }),
    kit.text(196, first.y + 13, 'added by the extension', { size: 11, cls: 'd-tag' }),
  );
};
