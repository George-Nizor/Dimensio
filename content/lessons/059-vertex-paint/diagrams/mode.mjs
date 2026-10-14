// The mode menu in the 3D Viewport header, open, with Vertex Paint picked out.
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const modes = ['Object Mode', 'Edit Mode', 'Sculpt Mode', 'Vertex Paint', 'Weight Paint', 'Texture Paint'];
  const out = [
    `<rect x="20" y="20" width="400" height="200" rx="4" class="d-ui" stroke-width="1"/>`,
    `<rect x="20" y="20" width="400" height="28" rx="4" class="d-sunk" stroke-width="1"/>`,
    `<rect x="28" y="25" width="118" height="18" rx="3" class="d-key-mark" stroke-width="1"/>`,
    kit.text(38, 38, 'Vertex Paint', { size: 11, cls: 'd-key-text d-key-text-mark' }),
    kit.text(160, 38, 'View   Select   Paint', { size: 11 }),
    `<rect x="28" y="52" width="150" height="${modes.length * 24 + 8}" rx="4" class="d-paper" stroke-width="1.2"/>`,
  ];
  modes.forEach((name, i) => {
    const y = 58 + i * 24;
    if (name === 'Vertex Paint') out.push(`<rect x="32" y="${y - 1}" width="142" height="22" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    out.push(kit.text(42, y + 15, name, { size: 11 }));
  });
  out.push(kit.text(250, 132, 'or the pie menu', { size: 12, anchor: 'middle' }));
  out.push(keycap(kit, 250, 162, 'Ctrl+Tab', { size: 12 }));
  return kit.svg({ width: 440, height: 240 }, out);
};
