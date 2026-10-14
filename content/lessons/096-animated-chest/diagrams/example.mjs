// The chest with its lid open on its hinge, beside the two animations it carries to Godot: open
// and close.
import { view, drawMesh } from '../../../diagrams/mesh.mjs';
import { menu } from '../../092-drivers/diagrams/animkit.mjs';
import { body, lid, frame } from './chestkit.mjs';

export default (kit) => {
  const v = view({ at: [150, 150], scale: 150, azimuth: 35, elevation: 22, target: [0, 0, 0.4] });
  return kit.svg({ width: 480, height: 270 },
    frame(kit, 14, 14, 280, 240),
    drawMesh(kit, body(), v, { width: 1.4 }),
    drawMesh(kit, lid(-100), v, { width: 1.4 }),
    menu(kit, 314, 60, ['close', 'open'], { w: 150, title: 'AnimationPlayer' }),
    kit.text(389, 166, 'in Godot', { anchor: 'middle', size: 12 }),
  );
};
