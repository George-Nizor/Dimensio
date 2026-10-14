// The Pose menu's last entry, Create Pose Asset, picked out, and the asset shelf along the bottom
// of the 3D Viewport with three saved poses: wave, crouch and point. Click one to apply it.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { menu } from '../../092-drivers/diagrams/animkit.mjs';
import { character, frame } from '../../097-character-modelling/diagrams/charkit.mjs';
import { WAVE, CROUCH, CROUCH_MOVE, POINT } from './poses.mjs';

export default (kit) => {
  const thumbs = [['wave', WAVE, {}], ['crouch', CROUCH, CROUCH_MOVE], ['point', POINT, {}]];
  return kit.svg({ width: 480, height: 300 },
    menu(kit, 20, 14, ['Clear Transform', 'Copy Pose', 'Paste Pose', 'Paste Pose Flipped', 'Create Pose Asset...'], { w: 200, mark: 'Create Pose Asset...', title: 'Pose' }),
    `<rect x="14" y="160" width="452" height="128" rx="5" class="d-sunk" stroke-width="1"/>`,
    kit.text(26, 178, 'asset shelf', { size: 12 }),
    thumbs.map(([name, pose, move], i) => {
      const x = 170 + i * 110;
      const v = views.front({ at: [x, 226], scale: 34, target: [0, 0, 0.9] });
      return [
        `<rect x="${x - 50}" y="168" width="100" height="112" rx="4" class="d-paper" stroke-width="1"/>`,
        drawMesh(kit, character(pose, { move }).mesh, v, { width: 0.4 }),
        kit.text(x, 274, name, { anchor: 'middle', size: 12 }),
      ];
    }),
    kit.text(250, 60, 'Library: Current File', { size: 12 }),
    kit.text(250, 80, 'Pose Name: wave', { size: 12 }),
  );
};
