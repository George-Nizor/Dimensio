// The Material tab's Settings panel, Surface section: Camera ticked beside Backface Culling.
import { checkboxes } from './shapes.mjs';

export default (kit) => kit.svg({ width: 440, height: 170 },
  `<rect x="20" y="16" width="400" height="140" rx="6" class="d-ui" stroke-width="1"/>`,
  kit.text(34, 38, 'Material  >  Settings  >  Surface', { size: 12 }),
  kit.text(54, 74, 'Backface Culling', { size: 12 }),
  checkboxes(kit, 170, 52, '', [['Camera', true], ['Shadow', false], ['Light Probe Volume', false]], 220).slice(2),
);
