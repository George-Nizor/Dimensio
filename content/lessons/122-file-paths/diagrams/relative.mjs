// A relative path: the image's path starting with //, which stands for the folder the .blend file
// is in, shown beside that folder and what it holds.
import { field } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => kit.svg({ width: 470, height: 220 },
  field(kit, 60, 24, 'Path', '//Moved textures\\crate-planks.png', { width: 330, mark: true }),
  kit.path('M 72 52 Q 72 70 96 70 L 140 70', { cls: 'd-mark', width: 1.6 }),
  kit.arrowhead(140, 70, 0, { size: 7 }),
  kit.text(146, 74, '// is the folder this .blend file is in', { size: 12 }),
  kit.text(40, 120, 'Course', { size: 12, cls: 'd-key-text' }),
  kit.line(46, 128, 46, 190, { cls: 'd-guide', width: 1 }),
  kit.line(46, 146, 62, 146, { cls: 'd-guide', width: 1 }),
  kit.text(68, 150, 'find-and-pack.blend', { size: 12, cls: 'd-key-text' }),
  kit.line(46, 172, 62, 172, { cls: 'd-guide', width: 1 }),
  kit.text(68, 176, 'Moved textures', { size: 12, cls: 'd-key-text' }),
  kit.line(80, 182, 80, 200, { cls: 'd-guide', width: 1 }),
  kit.line(80, 200, 96, 200, { cls: 'd-guide', width: 1 }),
  kit.text(102, 204, 'crate-planks.png', { size: 12, cls: 'd-key-text' }),
  kit.text(350, 160, 'move the whole Course folder', { anchor: 'middle', size: 12 }),
  kit.text(350, 178, 'and the path still works', { anchor: 'middle', size: 12 }),
);
