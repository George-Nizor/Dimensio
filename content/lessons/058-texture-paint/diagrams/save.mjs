// The Image Editor's Image menu after painting: an asterisk on Image means unsaved changes, and
// Save As is picked out.
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const items = [['New', 'Alt+N'], ['Open...', 'Alt+O'], ['Save', 'Alt+S'], ['Save As...', 'Shift+Alt+S'], ['Save All Images', '']];
  const out = [
    `<rect x="14" y="14" width="66" height="22" rx="3" class="d-ui-mark" stroke-width="1"/>`,
    kit.text(47, 29, 'Image*', { size: 12, anchor: 'middle' }),
    `<rect x="14" y="40" width="230" height="${items.length * 21 + 10}" rx="5" class="d-paper" stroke-width="1.4"/>`,
  ];
  items.forEach(([label, key], i) => {
    const y = 45 + i * 21;
    if (label === 'Save As...') out.push(`<rect x="18" y="${y}" width="222" height="20" rx="3" class="d-ui-mark" stroke-width="1"/>`);
    out.push(kit.text(28, y + 14, label, { size: 11 }));
    if (key) out.push(kit.text(234, y + 14, key, { size: 10, anchor: 'end', cls: 'd-label' }));
  });
  out.push(kit.text(260, 30, 'unsaved changes', { size: 12 }));
  return kit.svg({ width: 380, height: 170 }, out);
};
