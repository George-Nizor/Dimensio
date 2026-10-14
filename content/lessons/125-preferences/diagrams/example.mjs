// The Preferences window on its Interface section: the search field and section list on the left,
// and the Display panel with Resolution Scale set to 1.2.
import { prefs, area, field, check } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const p = prefs(kit, 10, 10, 480, 320, { section: 'Interface' });
  const [cx, cy, cw] = p.content;
  return kit.svg({ width: 500, height: 340 },
    p.svg,
    area(kit, cx + 10, cy + 10, cw - 20, 140, { title: 'Display' }),
    field(kit, cx + 140, cy + 40, 'Resolution Scale', '1.200', { width: 180, mark: true }),
    field(kit, cx + 140, cy + 64, 'Line Width', 'Auto', { width: 180 }),
    check(kit, cx + 140, cy + 92, 'Splash Screen', true),
    check(kit, cx + 140, cy + 116, 'Tooltips', true),
  );
};
