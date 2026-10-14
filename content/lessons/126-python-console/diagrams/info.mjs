// The Info editor after moving the cube and adding a new one: each command as a line of Python,
// the Add Cube line selected, and Ctrl+C to copy it.
import { keycap } from '../../../diagrams/mesh.mjs';
import { area, code } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => kit.svg({ width: 500, height: 190 },
  area(kit, 10, 14, 480, 132, { title: 'Info' }),
  code(kit, 22, 56, [
    'bpy.ops.transform.translate(value=(0, 0, 1), ...)',
    'bpy.ops.mesh.primitive_cube_add(enter_editmode=False,',
    "    align='WORLD', location=(0, 0, 0), scale=(1, 1, 1))",
  ], { size: 11, lead: 22, mark: [1, 2], width: 460 }),
  keycap(kit, 250, 170, 'Ctrl+C', { size: 12 }),
);
