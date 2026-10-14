// Shift+A opens the Add menu. Its Mesh submenu lists the primitives, with Cylinder picked out.
import { keycap } from '../../../diagrams/mesh.mjs';
import { menu } from './parts.mjs';

export default (kit) => kit.svg({ width: 420, height: 270 },
  keycap(kit, 46, 26, 'Shift+A', { size: 11 }),
  kit.text(20, 66, 'Add', { size: 12 }),
  menu(kit, 20, 76, ['Mesh', 'Curve', 'Surface', 'Metaball', 'Text', 'Volume', 'Grease Pencil', 'Armature'], { width: 130, mark: 'Mesh', row: 20 }),
  kit.line(150, 90, 176, 90, { cls: 'd-guide', width: 1.2 }),
  menu(kit, 176, 40, ['Plane', 'Cube', 'Circle', 'UV Sphere', 'Ico Sphere', 'Cylinder', 'Cone', 'Torus', 'Grid', 'Monkey'], { width: 140, mark: 'Cylinder', row: 21 }),
);
