// Wrong: the cork added while the 3D cursor was off to one side appears beside the body. Right:
// with the cursor back at the centre, the cork sits on the neck.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel, cursor3d } from './parts.mjs';
import { body, neck, cork } from './bottle.mjs';

export default (kit) => {
  const half = (x, corkAt, cursorAt, tag, tone) => {
    const v = views.front({ at: [x + 96, 128], scale: 300, target: [0.1, 0, 0.12] });
    const [cx, cy] = v.project(cursorAt);
    return [
      panel(kit, x, 14, 220, 176),
      drawMesh(kit, body(), v, { width: 1.3 }),
      drawMesh(kit, neck(), v, { width: 1.3 }),
      drawMesh(kit, cork(corkAt), v, { width: 1.8, cls: 'd-mark' }),
      cursor3d(kit, cx, cy, { r: 8 }),
      kit.tag(x + 110, 214, tag, { tone }),
    ];
  };
  return kit.svg({ width: 500, height: 228 },
    half(14, [0.32, 0, 0.34], [0.32, 0, 0], 'cursor off to one side', 'bad'),
    half(266, [0, 0, 0.34], [0, 0, 0], 'cursor at the centre'),
  );
};
