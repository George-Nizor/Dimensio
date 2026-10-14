// The Outliner before and after renaming with F2: Cube.001, Cylinder and Cube.002 become Crate,
// Barrel and Chair, the names Godot gives their nodes.
import { keycap } from '../../../diagrams/mesh.mjs';

const outliner = (kit, x, names) => [
  `<rect x="${x}" y="30" width="150" height="${names.length * 26 + 16}" rx="4" class="d-ui" stroke-width="1"/>`,
  ...names.map((name, i) => [
    `<rect x="${x + 12}" y="${44 + i * 26}" width="12" height="12" rx="2" class="d-key" stroke-width="1.2"/>`,
    kit.text(x + 32, 55 + i * 26, name, { size: 12, cls: 'd-key-text' }),
  ]),
];

export default (kit) => kit.svg({ width: 440, height: 150 },
  outliner(kit, 20, ['Cube.001', 'Cylinder', 'Cube.002']),
  keycap(kit, 220, 80, 'F2'),
  outliner(kit, 270, ['Crate', 'Barrel', 'Chair']),
);
