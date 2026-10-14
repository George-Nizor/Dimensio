// The Text Editor's Text menu with New (Alt+N) picked out, and the header after it, where the new
// text has been renamed export.py.
import { menu, button, box } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const m = menu(kit, 20, 60, [{ label: 'New', mark: true, key: 'Alt N' }, { label: 'Open...', key: 'Alt O' }, '-', 'Save', 'Save As...', '-', { label: 'Run Script', key: 'Alt P' }], { width: 200, title: 'Text' });
  return kit.svg({ width: 460, height: 260 },
    box(20, 14, 420, 30, { cls: 'd-sunk', rx: 4 }),
    kit.text(32, 34, 'View   Text   Edit   Select', { size: 11 }),
    button(kit, 230, 19, 'export.py', { mark: true, width: 100 }),
    button(kit, 340, 19, 'Run Script', { width: 92 }),
    m.svg,
    kit.text(240, 120, 'rename the text in the', { size: 12 }),
    kit.text(240, 138, "header's name field", { size: 12 }),
  );
};
