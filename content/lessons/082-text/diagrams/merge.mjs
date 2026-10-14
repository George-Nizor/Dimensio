// In Edit Mode with everything selected, M opens the Merge menu; By Distance merges the doubled
// vertices that Convert leaves where each letter's faces meet.
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const items = ['At Center', 'At Cursor', 'Collapse', 'By Distance'];
  return kit.svg({ width: 420, height: 190 },
    keycap(kit, 50, 40, 'M'),
    `<rect x="90" y="24" width="190" height="${items.length * 26 + 30}" rx="5" class="d-paper" stroke-width="1.2"/>`,
    kit.text(104, 44, 'Merge', { size: 12, cls: 'd-label' }),
    items.map((name, i) => {
      const y = 54 + i * 26;
      return [
        name === 'By Distance' ? `<rect x="94" y="${y}" width="182" height="22" rx="3" class="d-ui-mark" stroke-width="1"/>` : '',
        kit.text(106, y + 16, name, { size: 12 }),
      ];
    }),
    kit.text(300, 112, 'Removed 48', { size: 12, cls: 'd-tag' }),
    kit.text(300, 130, 'vertices, for', { size: 12, cls: 'd-tag' }),
    kit.text(300, 148, 'the word INN', { size: 12, cls: 'd-tag' }),
  );
};
