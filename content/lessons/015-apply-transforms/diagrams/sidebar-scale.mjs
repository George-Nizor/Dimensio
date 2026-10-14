// The Sidebar's Item tab for the stretched bench: Scale 1, 0.25, 0.25 picked out, and Dimensions
// 2 m, 0.5 m, 0.5 m below it.
import { keycap } from '../../../diagrams/mesh.mjs';
import { vectorFields } from './helpers.mjs';

export default (kit) => kit.svg({ width: 380, height: 300 },
  `<rect x="150" y="14" width="210" height="272" rx="5" class="d-ui" stroke-width="1"/>`,
  `<rect x="150" y="14" width="210" height="26" rx="5" class="d-sunk" stroke-width="1"/>`,
  kit.text(170, 32, 'Item', { size: 11, cls: 'd-key-text' }),
  kit.text(212, 32, 'Tool', { size: 11 }),
  kit.text(254, 32, 'View', { size: 11 }),
  vectorFields(kit, 170, 52, 'Scale', ['1.000', '0.250', '0.250'], { width: 170, mark: true }),
  vectorFields(kit, 170, 150, 'Dimensions', ['2 m', '0.5 m', '0.5 m'], { width: 170 }),
  keycap(kit, 70, 60, 'N'),
  kit.text(70, 96, 'Sidebar', { anchor: 'middle', size: 12 }),
);
