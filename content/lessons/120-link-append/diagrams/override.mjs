// The 3D Viewport's Object menu with Library Override open and Make picked out, and below it the
// Relations submenu's Make Local, the way to cut the link for good.
import { menu } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const obj = menu(kit, 16, 20, ['Transform', 'Set Origin', '-', 'Asset', 'Collection', '-', { label: 'Library Override', mark: true, arrow: true }, { label: 'Relations', arrow: true }, 'Parent'], { width: 170, title: 'Object' });
  const lo = obj.row('Library Override');
  const sub = menu(kit, 192, lo.y - 5, [{ label: 'Make', mark: true }, 'Reset', 'Clear'], { width: 110 });
  const rel = obj.row('Relations');
  const sub2 = menu(kit, 192, rel.y + 70, [{ label: 'Make Local', mark: true, arrow: true }, 'Make Single User'], { width: 160 });
  return kit.svg({ width: 460, height: 330 },
    obj.svg, sub.svg, sub2.svg,
    kit.line(186, rel.y + 11, 186, rel.y + 80, { cls: 'd-guide', width: 1, dash: '3 3' }),
    kit.text(310, lo.y + 17, 'edit it here', { size: 11, cls: 'd-tag' }),
    kit.text(360, rel.y + 92, 'cut the link', { size: 11, cls: 'd-tag' }),
  );
};
