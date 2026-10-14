// Hiding: the Reference collection's eye is closed, and its objects are greyed out. In the 3D
// Viewport, H hides the selection, Shift+H hides everything else and Alt+H shows all again.
import { keycap } from '../../../diagrams/mesh.mjs';
import { outliner } from './helpers.mjs';

export default (kit) => kit.svg({ width: 480, height: 190 },
  outliner(kit, 14, 20, 230, [
    { name: 'Props', icon: 'collection', depth: 0, check: true, eye: true },
    { name: 'Lights', icon: 'collection', depth: 0, check: true, eye: true },
    { name: 'Reference', icon: 'collection', depth: 0, check: true, eye: false },
    { name: 'Figure', icon: 'mesh', depth: 1, eye: true, grey: true },
    { name: 'Pole', icon: 'mesh', depth: 1, eye: true, grey: true },
  ], { row: 24, markEye: 'Reference' }),
  keycap(kit, 300, 40, 'H', { size: 12 }), kit.text(330, 44, 'hide selected', { size: 12 }),
  keycap(kit, 300, 84, 'Shift+H', { size: 12 }), kit.text(340, 88, 'hide the rest', { size: 12 }),
  keycap(kit, 300, 128, 'Alt+H', { size: 12 }), kit.text(334, 132, 'show all', { size: 12 }),
);
