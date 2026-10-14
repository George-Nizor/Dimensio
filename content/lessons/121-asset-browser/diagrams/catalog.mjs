// Making a catalog: the + button above the catalog list, a new catalog named Props, and the crate
// tile being dragged onto it.
import { box } from '../../115-grease-pencil/diagrams/ui-kit.mjs';
import { tile } from './assets.mjs';

export default (kit) => kit.svg({ width: 440, height: 200 },
  box(16, 16, 408, 170, { cls: 'd-ui', rx: 5 }),
  box(26, 26, 30, 22, { cls: 'd-key-mark', rx: 3, stroke: 1.2 }),
  kit.text(41, 42, '+', { anchor: 'middle', size: 15, cls: 'd-key-text d-key-text-mark' }),
  kit.text(66, 41, 'new catalog', { size: 11, cls: 'd-tag' }),
  kit.text(30, 72, 'All', { size: 12 }),
  box(26, 80, 120, 22, { cls: 'd-ui-mark', rx: 3 }),
  kit.text(40, 95, 'Props', { size: 12, cls: 'd-key-text' }),
  kit.line(82, 85, 82, 98, { cls: 'd-ink', width: 1.2 }),
  kit.text(30, 124, 'Unassigned', { size: 12 }),
  kit.line(160, 26, 160, 178, { cls: 'd-guide', width: 1 }),
  tile(kit, 300, 50, 'Crate', { mark: true }),
  kit.arcArrow(296, 86, 152, 92, { lift: -20 }),
  kit.text(225, 150, 'drag onto the catalog', { anchor: 'middle', size: 11 }),
);
