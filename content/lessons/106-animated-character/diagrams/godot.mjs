// The character in Godot as an inherited scene, with idle set to Autoplay on Load and walk
// playing from the Animation panel.
import { sceneDock, playButton, loopSign } from './helpers.mjs';

export default (kit) => kit.svg({ width: 500, height: 170 },
  sceneDock(kit, 10, 10, 200, [[0, 'character', false], [1, 'Skeleton3D', false], [2, 'body', false], [1, 'AnimationPlayer', true]]),
  `<rect x="230" y="30" width="260" height="96" rx="6" class="d-ui" stroke-width="1"/>`,
  playButton(kit, 242, 44, { on: true }),
  `<rect x="276" y="44" width="150" height="22" rx="4" class="d-sunk" stroke-width="1"/>`,
  kit.text(284, 59, 'walk', { size: 11 }), loopSign(kit, 404, 55),
  `<rect x="276" y="76" width="150" height="22" rx="4" class="d-sunk" stroke-width="1"/>`,
  kit.text(284, 91, 'A', { size: 11, cls: 'd-tag' }), kit.text(298, 91, 'idle', { size: 11 }), loopSign(kit, 404, 87),
  kit.text(242, 150, 'idle plays when the game starts', { size: 11 }),
);
