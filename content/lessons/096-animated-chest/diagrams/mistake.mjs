// Wrong: the lid's origin in its middle. Turned there, the lid spins in place and its back half
// cuts down into the box. Right: the origin on the hinge, and the lid swings up and back clear of
// the box. Both seen from the side, the lid turned -100 degrees.
import { views, drawMesh } from '../../../diagrams/mesh.mjs';
import { body, lid, frame, HINGE } from './chestkit.mjs';

export default (kit) => {
  const side = (x, pivot, tag, tone) => {
    const v = views.right({ at: [x + 122, 186], scale: 130, target: [0, 0, 0.3] });
    const [px, py] = v.project([pivot[0], pivot[1], pivot[2]]);
    return [
      frame(kit, x, 14, 244, 210),
      drawMesh(kit, body(), v, { width: 1.2 }),
      drawMesh(kit, lid(0), v, { mode: 'wire', cls: 'd-guide', width: 1 }),
      drawMesh(kit, lid(-100, pivot), v, { mode: 'xray', width: 1.4 }),
      kit.dot(px, py, { r: 5, cls: 'd-mark-fill' }),
      kit.tag(x + 122, 250, tag, { tone }),
    ];
  };
  return kit.svg({ width: 520, height: 264 },
    side(12, [0, 0, 0.6], 'origin in the middle', 'bad'),
    side(264, HINGE, 'origin on the hinge'),
  );
};
