// Render Properties > Sampling > Render: Noise Threshold ticked at 0.0100, Max Samples 4096. A pixel
// stops taking samples once its noise is below the threshold.
import { propRow } from './stage.mjs';

export default (kit) => kit.svg({ width: 420, height: 196 },
  `<rect x="20" y="14" width="380" height="168" rx="6" class="d-paper" stroke-width="1.2"/>`,
  kit.text(34, 38, 'Sampling > Render', { size: 12 }),
  `<rect x="26" y="50" width="368" height="26" rx="3" class="d-ui-mark" stroke-width="1"/>`,
  kit.text(170, 67, 'Noise Threshold', { anchor: 'end', size: 11 }),
  `<rect x="182" y="55" width="14" height="14" rx="3" class="d-paper" stroke-width="1.2"/>`,
  kit.path('M 185 62 L 188 65 L 193 58', { cls: 'd-ink', width: 2 }),
  `<rect x="204" y="54" width="180" height="18" rx="3" class="d-key" stroke-width="1.2"/>`,
  kit.text(294, 67, '0.0100', { anchor: 'middle', size: 11, cls: 'd-key-text' }),
  propRow(kit, 30, 86, 'Max Samples', '4096', { width: 354, split: 0.49 }),
  propRow(kit, 30, 112, 'Min Samples', '0', { width: 354, split: 0.49 }),
  propRow(kit, 30, 138, 'Time Limit', '0 s', { width: 354, split: 0.49 }),
);
