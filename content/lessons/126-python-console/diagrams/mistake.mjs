// Wrong: D.objects["cube"] with a small c, which stops with a KeyError. Right: D.objects["Cube"],
// spelled as the Outliner shows it, which finds the object.
import { area, code } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => kit.svg({ width: 500, height: 222 },
  area(kit, 10, 14, 480, 74, { title: 'Python Console' }),
  code(kit, 22, 54, ['>>> D.objects["cube"]', `KeyError: 'bpy_prop_collection[key]: key "cube" not found'`], { size: 11, lead: 20 }),
  kit.tag(250, 106, 'a small c: not found', { tone: 'bad' }),
  area(kit, 10, 118, 480, 74, { title: 'Python Console' }),
  code(kit, 22, 158, ['>>> D.objects["Cube"]', "bpy.data.objects['Cube']"], { size: 11, lead: 20 }),
  kit.tag(250, 214, 'the name exactly as the Outliner shows it'),
);
