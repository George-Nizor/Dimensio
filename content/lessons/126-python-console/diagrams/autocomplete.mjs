// Autocomplete in the Python Console: C.object.loc typed, Tab pressed, and the console finishing
// it as C.object.location.
import { keycap } from '../../../diagrams/mesh.mjs';
import { area, code } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => kit.svg({ width: 480, height: 150 },
  area(kit, 10, 14, 190, 70, { title: 'before' }),
  code(kit, 20, 62, ['>>> C.object.loc'], { size: 12 }),
  keycap(kit, 240, 50, 'Tab', { size: 13 }),
  area(kit, 280, 14, 190, 70, { title: 'after' }),
  code(kit, 290, 62, ['>>> C.object.location'], { size: 12, mark: [0], width: 172 }),
  kit.text(240, 120, 'Tab finishes a name, or lists what could come next', { anchor: 'middle', size: 12 }),
);
