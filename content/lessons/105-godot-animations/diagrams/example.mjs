// Godot with the character opened as an inherited scene: the Scene dock with the AnimationPlayer
// picked out, and the Animation panel listing idle and walk, both looping.
import { sceneDock, playButton, loopSign } from './helpers.mjs';

export default (kit) => kit.svg({ width: 520, height: 230 },
  sceneDock(kit, 10, 10, 200, [[0, 'character', false], [1, 'Skeleton3D', false], [2, 'body', false], [1, 'AnimationPlayer', true]]),
  `<rect x="230" y="10" width="280" height="210" rx="6" class="d-ui" stroke-width="1"/>`,
  kit.text(242, 30, 'Animation', { size: 11 }),
  playButton(kit, 242, 42, { on: true }),
  `<rect x="276" y="42" width="140" height="22" rx="4" class="d-sunk" stroke-width="1"/>`,
  kit.text(284, 57, 'walk', { size: 11 }),
  kit.text(404, 57, 'v', { anchor: 'middle', size: 10 }),
  `<rect x="276" y="70" width="140" height="58" rx="4" class="d-paper" stroke-width="1"/>`,
  kit.text(284, 88, 'idle', { size: 11 }), loopSign(kit, 390, 84),
  `<rect x="278" y="96" width="136" height="20" rx="3" class="d-ui-mark" stroke-width="0"/>`,
  kit.text(284, 110, 'walk', { size: 11 }), loopSign(kit, 390, 106),
  kit.line(242, 160, 498, 160, { cls: 'd-guide', width: 1 }),
  [0, 1, 2, 3, 4, 5].map((i) => [kit.line(250 + i * 48, 156, 250 + i * 48, 164, { cls: 'd-guide', width: 1 }), kit.text(250 + i * 48, 180, `${(i * 0.2).toFixed(1)}`, { anchor: 'middle', size: 10 })]),
  kit.line(330, 150, 330, 200, { cls: 'd-mark', width: 2 }),
);
