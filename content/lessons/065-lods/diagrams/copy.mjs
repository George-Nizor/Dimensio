// Shift+D, then Esc, leaves a copy on top of the rock. The Outliner lists the three versions.
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const names = ['Rock_LOD0', 'Rock_LOD1', 'Rock_LOD2'];
  return kit.svg({ width: 460, height: 160 },
    keycap(kit, 50, 70, 'Shift+D', { size: 12 }),
    kit.text(100, 75, 'then', { size: 12, anchor: 'middle' }),
    keycap(kit, 140, 70, 'Esc', { size: 12 }),
    kit.text(95, 112, 'the copy stays in place', { size: 12, anchor: 'middle' }),
    `<rect x="230" y="26" width="200" height="${names.length * 26 + 16}" rx="4" class="d-ui" stroke-width="1"/>`,
    names.map((name, i) => [
      i > 0 ? `<rect x="236" y="${36 + i * 26}" width="188" height="22" rx="3" class="d-ui-mark" stroke-width="1"/>` : '',
      `<rect x="244" y="${42 + i * 26}" width="10" height="10" rx="2" class="d-key" stroke-width="1"/>`,
      kit.text(262, 52 + i * 26, name, { size: 12, cls: 'd-key-text' }),
    ]),
    keycap(kit, 300, 132, 'F2', { size: 11 }), kit.text(326, 136, 'renames', { size: 12 }),
  );
};
