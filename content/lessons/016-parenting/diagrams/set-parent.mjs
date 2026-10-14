// The Set Parent To menu after Ctrl+P with Object picked out, and the Outliner afterwards: Body
// with the cabin and the four wheels indented under it.
import { keycap } from '../../../diagrams/mesh.mjs';
import { menu, outliner } from './helpers.mjs';

export default (kit) => kit.svg({ width: 470, height: 230 },
  keycap(kit, 48, 36, 'Ctrl+P'),
  menu(kit, 14, 66, { title: 'Set Parent To', items: ['Object', '~one', '~two', '~three'], pick: 'Object', width: 170 }),
  kit.line(198, 110, 238, 110, { cls: 'd-mark', width: 2 }), kit.arrowhead(238, 110, 0, { size: 8 }),
  outliner(kit, 254, 40, 200, [
    { name: 'Body', icon: 'mesh', depth: 0, eye: true },
    { name: 'Cabin', icon: 'mesh', depth: 1, eye: true },
    { name: 'Wheel BL', icon: 'mesh', depth: 1, eye: true },
    { name: 'Wheel BR', icon: 'mesh', depth: 1, eye: true },
    { name: 'Wheel FL', icon: 'mesh', depth: 1, eye: true },
    { name: 'Wheel FR', icon: 'mesh', depth: 1, eye: true },
  ]),
  kit.text(354, 212, 'the Outliner afterwards', { anchor: 'middle', size: 12 }),
);
