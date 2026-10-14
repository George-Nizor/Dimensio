// Add > Grease Pencil with the three Line Art entries, Collection Line Art picked out.
import { keycap } from '../../../diagrams/mesh.mjs';
import { menu } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const main = menu(kit, 70, 20, ['Mesh', 'Curve', 'Surface', 'Metaball', 'Text', 'Point Cloud', 'Volume', { label: 'Grease Pencil', mark: true, arrow: true }, 'Armature'], { width: 150, title: 'Add' });
  const row = main.row('Grease Pencil');
  const sub = menu(kit, 226, row.y - 5, ['Blank', 'Stroke', 'Monkey', '-', 'Scene Line Art', { label: 'Collection Line Art', mark: true }, 'Object Line Art'], { width: 170 });
  return kit.svg({ width: 420, height: 340 },
    keycap(kit, 36, 34, 'Shift+A', { size: 11 }),
    main.svg, sub.svg,
  );
};
