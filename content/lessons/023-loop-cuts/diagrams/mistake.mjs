// Wrong: the pointer on a horizontal edge, so the preview loop runs up and over the cube. Right: the
// pointer on a vertical edge, so the loop runs round the sides, as wanted.
import { cube, view, drawMesh, cursor } from '../../../diagrams/mesh.mjs';
import { panel } from './helpers.mjs';
import { previewLoop } from './shapes.mjs';

export default (kit) => {
  const left = view({ at: [126, 110], scale: 46 });
  const right = view({ at: [384, 110], scale: 46 });
  const [lx, ly] = left.project([0.45, -1, 1]);
  const [rx, ry] = right.project([1, -1, 0.35]);
  return kit.svg({ width: 510, height: 250 },
    panel(kit, 14, 14, 224, 190),
    drawMesh(kit, cube(), left, { width: 1.5 }),
    previewLoop(kit, left, 0, { axis: 'x' }),
    cursor(kit, lx, ly),
    kit.tag(126, 232, 'on a horizontal edge', { tone: 'bad' }),
    panel(kit, 272, 14, 224, 190),
    drawMesh(kit, cube(), right, { width: 1.5 }),
    previewLoop(kit, right, 0),
    cursor(kit, rx, ry),
    kit.tag(384, 232, 'on a vertical edge'),
  );
};
