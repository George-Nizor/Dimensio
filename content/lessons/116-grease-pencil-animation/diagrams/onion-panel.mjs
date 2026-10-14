// The Onion Skinning panel in the Object Data properties: Mode Keyframes, one keyframe before and
// after, and Show Start Frame turned on for a loop.
import { area, field, check } from '../../115-grease-pencil/diagrams/ui-kit.mjs';

export default (kit) => kit.svg({ width: 380, height: 230 },
  area(kit, 20, 14, 340, 202, { title: 'Onion Skinning' }),
  field(kit, 170, 44, 'Mode', 'Keyframes', { width: 160 }),
  field(kit, 170, 68, 'Opacity', '0.5', { width: 160 }),
  field(kit, 170, 92, 'Keyframes Before', '1', { width: 160 }),
  field(kit, 170, 116, 'Keyframes After', '1', { width: 160 }),
  kit.text(36, 156, 'Display', { size: 11, cls: 'd-label' }),
  check(kit, 170, 146, 'Fade', true),
  check(kit, 170, 174, 'Show Start Frame', true, { mark: true }),
);
