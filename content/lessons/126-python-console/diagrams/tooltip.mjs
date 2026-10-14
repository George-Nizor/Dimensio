// The tooltip over Location X with Python Tooltips turned on: below the usual text, the Python
// name of the setting and its full path for the selected object.
import { field, box, code } from '../../115-grease-pencil/diagrams/ui-kit.mjs';
import { cursor } from '../../../diagrams/mesh.mjs';

export default (kit) => kit.svg({ width: 470, height: 190 },
  kit.text(20, 30, 'Location', { size: 11, cls: 'd-label' }),
  field(kit, 60, 40, 'X', '0 m', { width: 150, mark: true }),
  cursor(kit, 120, 50),
  box(110, 76, 350, 96, { cls: 'd-paper', rx: 5, stroke: 1.2 }),
  kit.text(124, 98, 'Location of the object', { size: 12 }),
  code(kit, 124, 126, ['Python: Object.location', 'bpy.data.objects["Cube"].location[0]'], { size: 11, lead: 22, mark: [1], width: 330 }),
);
