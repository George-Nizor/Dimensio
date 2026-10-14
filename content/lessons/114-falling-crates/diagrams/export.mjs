// The glTF export settings for the fall: Animation Mode set to Active actions merged and Merged
// Animation Name set to fall, so every crate and the cart go into one animation, with Selected
// Objects ticked under Include.
import { field } from './helpers.mjs';

export default (kit) => kit.svg({ width: 500, height: 170 },
  `<rect x="10" y="10" width="480" height="150" rx="6" class="d-ui" stroke-width="1"/>`,
  `<rect x="20" y="20" width="460" height="22" rx="4" class="d-sunk" stroke-width="1"/>`,
  kit.text(30, 35, 'Animation', { size: 11 }),
  field(kit, 30, 54, 440, 'Animation Mode', 'Active actions merged', { on: true, labelWidth: 0.4 }),
  field(kit, 30, 84, 440, 'Merged Animation Name', 'fall', { on: true, labelWidth: 0.4 }),
  kit.text(30, 136, 'Include: Selected Objects ticked, with the cart, crates and ground selected', { size: 11 }),
);
