// In Godot: the chest opened as a New Inherited scene. Its Scene dock lists the root, the body,
// the lid and an AnimationPlayer, which is selected. The Animation panel at the bottom has open
// picked in its list and the Play from beginning button picked out, with Shift+D beside it.
import { keycap } from '../../../diagrams/mesh.mjs';
import { field } from '../../092-drivers/diagrams/animkit.mjs';
import { frame } from './chestkit.mjs';

export default (kit) => {
  const nodes = [['chest', 0], ['chest body', 1], ['lid', 1], ['AnimationPlayer', 1]];
  return kit.svg({ width: 480, height: 270 },
    frame(kit, 14, 14, 200, 150),
    kit.text(26, 36, 'Scene', { size: 13 }),
    nodes.map(([name, depth], i) => [
      i === 3 ? `<rect x="22" y="${48 + i * 26}" width="184" height="22" rx="3" class="d-ui-mark" stroke-width="1.2"/>` : '',
      kit.text(32 + depth * 18, 63 + i * 26, name, { size: 12 }),
    ]),
    frame(kit, 14, 180, 452, 76),
    kit.text(26, 202, 'Animation', { size: 13 }),
    field(kit, 26, 214, 34, '▶', { mark: true, size: 13 }),
    field(kit, 70, 214, 120, 'open', { anchor: 'start' }),
    kit.text(200, 230, 'close, open', { size: 12 }),
    keycap(kit, 420, 225, 'Shift+D', { size: 12 }),
    kit.text(250, 80, 'Scene > Open Scene,', { size: 12 }),
    kit.text(250, 100, 'then New Inherited', { size: 12 }),
  );
};
