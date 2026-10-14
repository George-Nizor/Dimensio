// The open action: the lid shut at frame 1 and turned -100 degrees about X at frame 12, seen from
// the side, with the action's name in the Action Editor's header.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { actionHeader, key } from '../../092-drivers/diagrams/animkit.mjs';
import { body, lid, frame } from './chestkit.mjs';

export default (kit) => {
  const cell = (x, angle, label) => {
    const v = views.right({ at: [x + 100, 196], scale: 120, target: [0, 0, 0.3] });
    return [
      frame(kit, x, 60, 200, 186),
      drawMesh(kit, body(), v, { width: 1.2 }),
      drawMesh(kit, lid(angle), v, { width: 1.2 }),
      key(kit, x + 30, 84, { mark: true }),
      kit.text(x + 44, 89, label, { size: 12 }),
    ];
  };
  return kit.svg({ width: 460, height: 260 },
    actionHeader(kit, 14, 20, { name: 'open', mark: 'name', slot: 'lid' }).svg,
    cell(14, 0, 'frame 1: 0°'),
    cell(246, -100, 'frame 12: -100°'),
  );
};
