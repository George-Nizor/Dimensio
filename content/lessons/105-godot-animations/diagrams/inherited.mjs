// Opening the .glb in Godot with Scene > Open Scene: the dialog for an imported scene with New
// Inherited picked out, and the new scene's tree with its AnimationPlayer.
import { menuPath, button, sceneDock, push } from './helpers.mjs';

export default (kit) => kit.svg({ width: 520, height: 210 },
  menuPath(kit, 10, 12, ['Scene', 'Open Scene']).svg,
  kit.text(170, 27, 'character.glb', { size: 12 }),
  `<rect x="10" y="50" width="250" height="110" rx="6" class="d-ui" stroke-width="1"/>`,
  kit.text(22, 74, 'Scene was automatically imported,', { size: 11 }),
  kit.text(22, 92, 'so it can\'t be modified.', { size: 11 }),
  button(kit, 22, 120, 100, 'Open Anyway'),
  button(kit, 134, 120, 112, 'New Inherited', { on: true }),
  push(kit, 270, 120, 300, 120, { width: 2 }),
  sceneDock(kit, 310, 50, 200, [[0, 'character', false], [1, 'Skeleton3D', false], [2, 'body', false], [1, 'AnimationPlayer', true]]),
);
