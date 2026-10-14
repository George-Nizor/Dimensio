// Ctrl+Space over the 3D Viewport: the viewport grows to fill the window, and the same keys put it
// back.
import { blenderWindow, keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const before = blenderWindow(kit, { x: 10, y: 30, width: 196, height: 130, highlight: ['viewport'], labels: false });
  return kit.svg({ width: 520, height: 190 },
    before.svg,
    keycap(kit, 260, 72, 'Ctrl+Space', { size: 11 }),
    kit.line(216, 100, 300, 100, { cls: 'd-mark', width: 2 }), kit.arrowhead(300, 100, 0, { size: 8 }),
    `<rect x="314" y="30" width="196" height="7" rx="1" class="d-ui" stroke-width="1"/>`,
    `<rect x="314" y="39" width="196" height="114" rx="2" class="d-ui-mark" stroke-width="1.2"/>`,
    `<rect x="314" y="155" width="196" height="5" rx="1" class="d-ui" stroke-width="1"/>`,
    kit.text(412, 100, '3D Viewport', { anchor: 'middle', size: 12 }),
    kit.text(108, 182, 'before', { anchor: 'middle', size: 12 }), kit.text(412, 182, 'after', { anchor: 'middle', size: 12 }),
  );
};
