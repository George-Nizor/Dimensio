// The Multiresolution modifier after Subdivide was clicked twice: Viewport, Sculpt and Render all at
// level 2. Alt+1 and Alt+2 step down and up a level while sculpting.
import { keycap } from '../../../diagrams/mesh.mjs';
import { propRow } from './props.mjs';

export default (kit) => {
  const button = (x, y, w, label, mark) => [
    `<rect x="${x}" y="${y}" width="${w}" height="22" rx="3" class="${mark ? 'd-ui-mark' : 'd-key'}" stroke-width="1.2"/>`,
    kit.text(x + w / 2, y + 15, label, { anchor: 'middle', size: 11, cls: 'd-key-text' }),
  ];
  return kit.svg({ width: 480, height: 240 },
    `<rect x="16" y="14" width="300" height="212" rx="6" class="d-paper" stroke-width="1.2"/>`,
    kit.text(28, 36, 'Multiresolution', { size: 12 }),
    propRow(kit, 26, 48, 'Levels Viewport', '2', { width: 280, split: 0.5 }),
    propRow(kit, 26, 72, 'Sculpt', '2', { width: 280, split: 0.5 }),
    propRow(kit, 26, 96, 'Render', '2', { width: 280, split: 0.5 }),
    button(28, 130, 132, 'Subdivide', true), button(166, 130, 64, 'Simple'), button(236, 130, 68, 'Linear'),
    button(28, 158, 136, 'Unsubdivide'), button(168, 158, 136, 'Delete Higher'),
    button(28, 186, 136, 'Apply Base'), button(168, 186, 136, 'Conform Base'),
    keycap(kit, 370, 90, 'Alt+1', { size: 12 }), kit.text(410, 95, 'down', { size: 12 }),
    keycap(kit, 370, 140, 'Alt+2', { size: 12 }), kit.text(410, 145, 'up', { size: 12 }),
  );
};
