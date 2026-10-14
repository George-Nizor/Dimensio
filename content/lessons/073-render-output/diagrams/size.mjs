// Output Properties > Format: Resolution 1920 by 1080, with % set to 50 for a test render half the
// size and the same shape.
import { propRow } from './stage.mjs';

export default (kit) => kit.svg({ width: 500, height: 170 },
  `<rect x="14" y="14" width="220" height="110" rx="6" class="d-paper" stroke-width="1.2"/>`,
  kit.text(26, 36, 'Format', { size: 12 }),
  propRow(kit, 24, 48, 'Resolution X', '1920 px', { width: 200, split: 0.5 }),
  propRow(kit, 24, 72, 'Y', '1080 px', { width: 200, split: 0.5 }),
  propRow(kit, 24, 96, '%', '50%', { width: 200, split: 0.5, mark: true }),
  `<rect x="260" y="14" width="224" height="126" class="d-sunk" stroke-width="1.2"/>`,
  kit.text(372, 156, '1920 by 1080', { anchor: 'middle', size: 11, cls: 'd-label' }),
  `<rect x="260" y="77" width="112" height="63" class="d-ui-mark" stroke-width="1.6"/>`,
  kit.text(316, 113, '960 by 540', { anchor: 'middle', size: 11 }),
);
