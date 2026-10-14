// The whole export script in the Text Editor, with its name, export.py, in the header and the Run
// Script button.
import { area, code, button } from '../../115-grease-pencil/diagrams/ui-kit.mjs';
import { SCRIPT } from './script.mjs';

export default (kit) => kit.svg({ width: 500, height: 370 },
  area(kit, 10, 10, 480, 352, { title: 'Text Editor', header: 24 }),
  button(kit, 280, 13, 'export.py', { width: 100, height: 18 }),
  button(kit, 390, 13, 'Run Script', { width: 90, height: 18 }),
  code(kit, 18, 54, SCRIPT, { size: 12, lead: 18.5, numbers: true }),
);
