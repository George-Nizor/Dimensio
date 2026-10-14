// Left, the barrel's origin at its middle. Right, after Cursor to Selected on the bottom face and
// Origin to 3D Cursor, the origin sits at the centre of its base.
import { view, drawMesh, cursor as pointer } from '../../../diagrams/mesh.mjs';
import { barrel, panel, origin } from './parts.mjs';

// Blender's 3D cursor: a red and white ring with cross hairs.
const cursor3d = (kit, x, y) => [
  kit.circle(x, y, 9, { cls: 'd-axis-x', width: 2.2, dash: '4 3' }),
  kit.line(x - 15, y, x - 5, y, { cls: 'd-ink', width: 1.2 }), kit.line(x + 5, y, x + 15, y, { cls: 'd-ink', width: 1.2 }),
  kit.line(x, y - 15, x, y - 5, { cls: 'd-ink', width: 1.2 }), kit.line(x, y + 5, x, y + 15, { cls: 'd-ink', width: 1.2 }),
];

export default (kit) => {
  const left = view({ azimuth: 20, elevation: 20, scale: 160, at: [125, 120], target: [0, 0, 0.45] });
  const right = view({ azimuth: 20, elevation: 20, scale: 160, at: [375, 120], target: [0, 0, 0.45] });
  void pointer;
  return kit.svg({ width: 500, height: 250 },
    panel(kit, 14, 14, 222, 200, 'origin at the middle'),
    drawMesh(kit, barrel(), left, { width: 1.3 }),
    origin(kit, ...left.project([0, 0, 0.45])),
    panel(kit, 264, 14, 222, 200, 'origin at the base centre'),
    drawMesh(kit, barrel(), right, { width: 1.3 }),
    cursor3d(kit, ...right.project([0, 0, 0])),
    origin(kit, ...right.project([0, 0, 0])),
  );
};
