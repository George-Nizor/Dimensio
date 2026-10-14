// Preferences > Get Extensions with "extra mesh" searched for, and Extra Mesh Objects listed with
// its Install button.
import { prefs, box, button } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const p = prefs(kit, 10, 10, 480, 320, { section: 'Get Extensions' });
  const [cx, cy, cw] = p.content;
  return kit.svg({ width: 500, height: 340 },
    p.svg,
    box(cx + 12, cy + 12, cw - 24, 22, { cls: 'd-sunk', rx: 11 }),
    kit.text(cx + 26, cy + 27, 'extra mesh', { size: 11, cls: 'd-key-text' }),
    box(cx + 12, cy + 46, cw - 24, 48, { cls: 'd-ui-mark', rx: 4 }),
    kit.text(cx + 22, cy + 66, 'Extra Mesh Objects', { size: 12 }),
    kit.text(cx + 22, cy + 84, 'Add extra mesh object types', { size: 10 }),
    button(kit, cx + cw - 82, cy + 58, 'Install', { mark: true, width: 60 }),
    box(cx + 12, cy + 102, cw - 24, 48, { cls: 'd-paper', rx: 4 }),
    kit.text(cx + 22, cy + 122, 'another extension', { size: 12, cls: 'd-label' }),
    button(kit, cx + cw - 82, cy + 114, 'Install', { width: 60 }),
  );
};
