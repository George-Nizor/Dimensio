// File > External Data, the menu this lesson works through: packing, relative paths, and reporting
// and finding missing files.
import { menu } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const file = menu(kit, 16, 16, ['Save', 'Save As...', '-', 'Import', 'Export', '-', { label: 'External Data', mark: true, arrow: true }, { label: 'Clean Up', arrow: true }, '-', 'Defaults', 'Quit'], { width: 160, title: 'File' });
  const row = file.row('External Data');
  const sub = menu(kit, 182, row.y - 70, ['Automatically Pack Resources', { label: 'Pack Resources', mark: true }, 'Unpack Resources', '-', 'Pack Linked Libraries', 'Unpack Linked Libraries', '-', { label: 'Make Paths Relative', mark: true }, 'Make Paths Absolute', '-', { label: 'Report Missing Files', mark: true }, { label: 'Find Missing Files...', mark: true }], { width: 230 });
  return kit.svg({ width: 430, height: 330 }, file.svg, sub.svg);
};
