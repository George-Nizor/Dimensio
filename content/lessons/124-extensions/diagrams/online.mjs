// The Online Extensions box Get Extensions shows until you choose: Continue Offline, or Allow
// Online Access, picked out.
import { area, button } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => kit.svg({ width: 440, height: 170 },
  area(kit, 16, 14, 408, 142, { title: 'Online Extensions' }),
  kit.text(30, 56, 'Internet access is required to install and', { size: 11 }),
  kit.text(30, 74, 'update online extensions.', { size: 11 }),
  kit.text(30, 96, 'While offline, use "Install from Disk" instead.', { size: 11, cls: 'd-label' }),
  button(kit, 30, 116, 'Continue Offline', { width: 150 }),
  button(kit, 196, 116, 'Allow Online Access', { mark: true, width: 170 }),
);
