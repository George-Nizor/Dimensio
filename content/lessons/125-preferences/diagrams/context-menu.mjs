// Right-clicking a menu item, Object > Shade Auto Smooth: its context menu with Add to Quick
// Favorites and Assign Shortcut picked out.
import { menu } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const obj = menu(kit, 16, 16, ['Shade Smooth', { label: 'Shade Auto Smooth', mark: true }, 'Shade Flat'], { width: 180, title: 'Object' });
  const row = obj.row('Shade Auto Smooth');
  const ctx = menu(kit, 150, row.y + 18, [{ label: 'Add to Quick Favorites', mark: true }, { label: 'Assign Shortcut', mark: true }, '-', 'Online Manual', 'Online Python Reference'], { width: 230 });
  return kit.svg({ width: 400, height: 250 },
    obj.svg, ctx.svg,
    kit.text(16, 236, 'right-click a menu item or button', { size: 11 }),
  );
};
