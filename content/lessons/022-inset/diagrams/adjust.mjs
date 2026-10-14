// The Inset Faces panel at the bottom left of the viewport after an inset: Thickness 0.2 m, Depth
// 0 m, and Individual ticked.
import { field, checkbox } from './helpers.mjs';

export default (kit) => kit.svg({ width: 320, height: 210 },
  `<rect x="20" y="14" width="280" height="182" rx="5" class="d-ui" stroke-width="1"/>`,
  kit.text(34, 36, 'Inset Faces', { size: 12, cls: 'd-key-text' }),
  field(kit, 34, 52, 'Thickness', '0.2 m', { width: 250, labelWidth: 96, mark: true }),
  field(kit, 34, 76, 'Depth', '0 m', { width: 250, labelWidth: 96, mark: true }),
  [['Outset', false], ['Select Outer', false], ['Individual', true]].map(([name, on], i) => [
    checkbox(kit, 130, 108 + i * 26, on, { mark: name === 'Individual' }),
    kit.text(148, 117 + i * 26, name, { size: 11, cls: 'd-key-text' }),
  ]),
);
