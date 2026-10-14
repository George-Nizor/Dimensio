// The Bevel panel at the bottom left of the viewport after a bevel: Width 0.02 m and Segments 1,
// with the Clamp Overlap checkbox below them.
import { field, checkbox } from './helpers.mjs';

export default (kit) => kit.svg({ width: 320, height: 170 },
  `<rect x="20" y="14" width="280" height="142" rx="5" class="d-ui" stroke-width="1"/>`,
  kit.text(34, 36, 'Bevel', { size: 12, cls: 'd-key-text' }),
  field(kit, 34, 52, 'Width', '0.02 m', { width: 250, labelWidth: 96, mark: true }),
  field(kit, 34, 76, 'Segments', '1', { width: 250, labelWidth: 96, mark: true }),
  checkbox(kit, 130, 112, false),
  kit.text(148, 121, 'Clamp Overlap', { size: 11, cls: 'd-key-text' }),
);
