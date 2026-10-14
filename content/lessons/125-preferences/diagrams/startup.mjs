// File > Defaults with Save Startup File picked out, above Load Factory Settings.
import { menu } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const file = menu(kit, 16, 16, ['New', 'Open...', '-', 'Save', 'Save As...', '-', 'External Data', 'Clean Up', '-', { label: 'Defaults', mark: true, arrow: true }, 'Quit'], { width: 150, title: 'File' });
  const row = file.row('Defaults');
  const sub = menu(kit, 172, row.y - 5, [{ label: 'Save Startup File', mark: true }, 'Load Factory Settings'], { width: 190 });
  return kit.svg({ width: 380, height: 290 }, file.svg, sub.svg);
};
