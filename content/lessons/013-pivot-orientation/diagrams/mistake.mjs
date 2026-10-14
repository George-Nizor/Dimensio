// Seen from the top. Wrong: a block rotated while the pivot point is still on 3D Cursor swings away
// around the cursor. Right: the same rotation with Median Point turns it where it stands.
import { box, rotate, translate, views, drawMesh } from '../../../diagrams/mesh.mjs';
import { panel, cursor3d } from './parts.mjs';

export default (kit) => {
  const block = box({ size: [1, 0.5, 1], center: [0, 0, 0.5] });
  const placed = translate(block, [1.6, 0.6, 0]);
  return kit.svg({ width: 500, height: 228 },
    panel(kit, 14, 14, 220, 176),
    (() => {
      const v = views.top({ at: [80, 140], scale: 40 });
      const [cx, cy] = v.project([0, 0, 0]);
      const [ax, ay] = v.project([1.6, 0.6, 0]);
      const [bx, by] = v.project(rotate({ verts: [[1.6, 0.6, 0]], faces: [] }, 'z', 70).verts[0]);
      return [
        drawMesh(kit, placed, v, { mode: 'wire', cls: 'd-guide', width: 1.2 }),
        drawMesh(kit, rotate(placed, 'z', 70), v, { width: 1.6, cls: 'd-bad' }),
        cursor3d(kit, cx, cy, { r: 8 }),
        kit.arcArrow(ax + 4, ay - 18, bx + 18, by + 6, { lift: -16, cls: 'd-bad' }),
      ];
    })(),
    kit.tag(124, 214, 'pivot left on 3D Cursor', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 176),
    (() => {
      const v = views.top({ at: [376, 102], scale: 60, target: [1.6, 0.6, 0] });
      return [
        drawMesh(kit, placed, v, { mode: 'wire', cls: 'd-guide', width: 1.2 }),
        drawMesh(kit, translate(rotate(block, 'z', 70), [1.6, 0.6, 0]), v, { width: 1.6, cls: 'd-mark' }),
      ];
    })(),
    kit.tag(376, 214, 'Median Point: turns in place'),
  );
};
