// Menu Search after F3, with "smooth" typed and the matching Object menu items listed.
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => kit.svg({ width: 420, height: 170 },
  keycap(kit, 40, 40, 'F3'),
  `<rect x="80" y="24" width="300" height="30" rx="5" class="d-paper" stroke-width="1.4"/>`,
  kit.text(94, 44, 'smooth', { size: 13, cls: 'd-key-text' }),
  kit.line(146, 31, 146, 47, { cls: 'd-ink', width: 1.4 }),
  `<rect x="80" y="60" width="300" height="82" rx="5" class="d-paper" stroke-width="1.2"/>`,
  `<rect x="84" y="66" width="292" height="22" rx="3" class="d-ui-mark" stroke-width="1"/>`,
  kit.text(96, 81, 'Object > Shade Smooth', { size: 12 }),
  kit.text(96, 107, 'Object > Shade Auto Smooth', { size: 12 }),
  kit.text(96, 131, 'Object > Shade Flat', { size: 12, cls: 'd-label' }),
);
