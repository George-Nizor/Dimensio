// A crate whose texture is missing, shown pink, and the warning Report Missing Files writes in the
// Info editor with the path Blender looked in.
import { crate } from './crate.mjs';
import { area, code } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => kit.svg({ width: 480, height: 230 },
  crate(kit, [90, 130], { size: 75, missing: true }),
  kit.text(90, 190, 'shows pink', { anchor: 'middle', size: 12 }),
  area(kit, 180, 40, 290, 110, { title: 'Info' }),
  code(kit, 190, 82, ["Path '...\\textures\\", "crate-planks.png' not found"], { size: 11, lead: 18, mark: [0, 1], width: 274 }),
  code(kit, 190, 126, ["Path '...\\textures\\", "barrel-staves.png' not found"], { size: 11, lead: 18 }),
);
