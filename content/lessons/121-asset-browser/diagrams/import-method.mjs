// The Asset Browser's Import Method menu: Follow Asset or Preferences, Link, Append (picked out),
// Append (Reuse Data) and Pack, with what each gives you.
import { menu } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const m = menu(kit, 16, 16, ['Follow Asset or Preferences', 'Link', { label: 'Append', mark: true }, 'Append (Reuse Data)', 'Pack'], { width: 210, title: 'Import Method', row: 26 });
  const note = (label, text) => kit.text(240, m.row(label).y + 17, text, { size: 11 });
  return kit.svg({ width: 470, height: 190 },
    m.svg,
    note('Link', 'read only, follows the library'),
    note('Append', 'a copy you can edit'),
    note('Append (Reuse Data)', 'copies that share their mesh'),
    note('Pack', 'read only, stored in this file'),
  );
};
