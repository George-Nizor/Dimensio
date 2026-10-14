// Renaming in the Outliner: a double click on Cube.001 opens its name for typing, here changed to
// Crate 1. F2 does the same for the active object in the 3D Viewport.
import { keycap } from '../../../diagrams/mesh.mjs';
import { outliner } from './helpers.mjs';

export default (kit) => kit.svg({ width: 440, height: 170 },
  outliner(kit, 14, 20, 250, [
    { name: 'Collection', icon: 'collection', depth: 0, check: true, eye: true },
    { name: 'Crate 1', icon: 'mesh', depth: 1, edit: true },
    { name: 'Cube.002', icon: 'mesh', depth: 1, eye: true },
    { name: 'Cube.003', icon: 'mesh', depth: 1, eye: true },
  ], { row: 24 }),
  kit.text(140, 140, 'double-click a name in the Outliner', { anchor: 'middle', size: 12 }),
  keycap(kit, 350, 66, 'F2'),
  kit.text(350, 104, 'in the 3D Viewport', { anchor: 'middle', size: 12 }),
);
