// The Outliner after appending the crate and linking the barrel: the crate is an ordinary object,
// the barrel carries the chain icon of linked data.
import { area, box } from '../../115-grease-pencil/diagrams/ui-kit.mjs';
import { chain } from './files.mjs';

export default (kit) => {
  const row = (y, name, indent, icon, mark) => [
    mark ? box(24, y - 13, 372, 20, { cls: 'd-ui-mark', rx: 3 }) : '',
    kit.text(30 + indent, y + 1, name, { size: 12 }),
    icon || '',
  ];
  return kit.svg({ width: 420, height: 190 },
    area(kit, 16, 14, 388, 160, { title: 'Outliner' }),
    row(56, 'Scene Collection', 0),
    row(80, 'Collection', 16),
    row(104, 'Camera', 32),
    row(128, 'Crate', 32),
    row(152, 'Barrel', 32, chain(kit, 120, 148, { cls: 'd-mark' }), true),
    kit.text(140, 156, 'linked from props-library.blend', { size: 11, cls: 'd-tag' }),
  );
};
