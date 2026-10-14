// The crates in Godot as an inherited scene: the AnimationPlayer holds one animation, fall,
// five seconds long, which moves every crate and the cart.
import { sceneDock, playButton } from './helpers.mjs';

export default (kit) => kit.svg({ width: 510, height: 220 },
  sceneDock(kit, 10, 10, 190, [[0, 'crates', false], [1, 'Cart', false], [1, 'Crate.001', false], [1, 'Crate.002', false], [1, '...', false], [1, 'AnimationPlayer', true]]),
  `<rect x="220" y="30" width="280" height="110" rx="6" class="d-ui" stroke-width="1"/>`,
  playButton(kit, 232, 44, { on: true }),
  `<rect x="266" y="44" width="150" height="22" rx="4" class="d-sunk" stroke-width="1"/>`,
  kit.text(274, 59, 'A', { size: 11, cls: 'd-tag' }), kit.text(288, 59, 'fall', { size: 11 }),
  kit.line(232, 100, 488, 100, { cls: 'd-guide', width: 1 }),
  [0, 1, 2, 3, 4, 5].map((i) => [kit.line(240 + i * 48, 96, 240 + i * 48, 104, { cls: 'd-guide', width: 1 }), kit.text(240 + i * 48, 120, `${i}`, { anchor: 'middle', size: 10 })]),
  kit.text(232, 168, 'one animation, 5 seconds, every crate', { size: 11 }),
);
