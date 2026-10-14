// The Python Console after three lines: renaming the cube to Crate, moving the active object 1 m up,
// and listing every object's name, with the answer printed below.
import { area, code } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => kit.svg({ width: 480, height: 200 },
  area(kit, 10, 14, 460, 172, { title: 'Python Console' }),
  code(kit, 22, 58, [
    '>>> D.objects["Cube"].name = "Crate"',
    '>>> C.object.location.z = 1',
    '>>> [obj.name for obj in D.objects]',
    "['Camera', 'Crate', 'Light']",
    '>>> ',
  ], { size: 12, lead: 24, mark: [0], width: 440 }),
);
