// Edit > Preferences with its shortcut, Ctrl and comma, and the Preferences search field with
// "numpad" typed in to find a setting by name.
import { menu, box } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const edit = menu(kit, 16, 16, ['Undo', 'Redo', '-', 'Adjust Last Operation...', 'Menu Search...', 'Rename Active Item...', '-', { label: 'Preferences...', mark: true, key: 'Ctrl ,' }], { width: 220, title: 'Edit' });
  return kit.svg({ width: 460, height: 230 },
    edit.svg,
    box(270, 40, 170, 24, { cls: 'd-ui-mark', rx: 12 }),
    kit.text(284, 56, 'numpad', { size: 12, cls: 'd-key-text' }),
    kit.text(270, 86, 'search the Preferences', { size: 11 }),
    kit.text(270, 102, 'by name', { size: 11 }),
  );
};
