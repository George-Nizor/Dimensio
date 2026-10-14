// The Apply menu after Ctrl+A in Object Mode, with Rotation & Scale picked out.
import { keycap } from '../../../diagrams/mesh.mjs';
import { menu } from './helpers.mjs';

export default (kit) => kit.svg({ width: 360, height: 250 },
  keycap(kit, 60, 40, 'Ctrl+A'),
  menu(kit, 130, 14, {
    title: 'Apply',
    items: ['Location', 'Rotation', 'Scale', 'All Transforms', 'Rotation & Scale', '-', '~deltas', '~deltas two', '~more'],
    pick: 'Rotation & Scale',
    width: 200,
  }),
);
