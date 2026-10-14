// Object > Asset > Mark as Asset in the 3D Viewport, with the selected props behind it.
import { menu } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const obj = menu(kit, 20, 20, ['Transform', 'Set Origin', '-', { label: 'Asset', mark: true, arrow: true }, 'Collection', '-', 'Library Override', 'Relations'], { width: 160, title: 'Object' });
  const row = obj.row('Asset');
  const sub = menu(kit, 186, row.y - 5, [{ label: 'Mark as Asset', mark: true }, 'Clear Asset', 'Clear Asset (Set Fake User)'], { width: 210 });
  return kit.svg({ width: 410, height: 210 }, obj.svg, sub.svg);
};
