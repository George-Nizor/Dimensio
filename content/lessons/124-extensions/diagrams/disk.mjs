// The menu at the top right of Get Extensions: Refresh Remote and Install Available Updates for
// updating, and Install from Disk for a downloaded .zip, picked out.
import { menu } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => {
  const m = menu(kit, 20, 16, ['Visit Extensions Platform', '-', { label: 'Refresh Remote', mark: true }, 'Refresh Local', '-', { label: 'Install Available Updates', mark: true }, { label: 'Install from Disk...', mark: true }], { width: 230, title: 'Extension Settings' });
  return kit.svg({ width: 420, height: 210 },
    m.svg,
    kit.text(262, m.row('Refresh Remote').y + 15, 'look for updates', { size: 11 }),
    kit.text(262, m.row('Install Available Updates').y + 15, 'install them', { size: 11 }),
    kit.text(262, m.row('Install from Disk...').y + 15, 'a .zip you downloaded', { size: 11 }),
  );
};
