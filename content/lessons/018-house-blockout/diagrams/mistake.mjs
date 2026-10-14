// A back corner from above (Numpad 7), close up. Wrong: walls moved by eye, with a gap at the
// corner. Right: walls snapped corner to corner, meeting exactly.
import { views, drawMesh, box } from '../../../diagrams/mesh.mjs';
import { closeUp } from './helpers.mjs';

export default (kit) => {
  const back = () => box({ size: [5, 0.2, 2.5], center: [0, 1.9, 1.45] });
  const left = views.top({ at: [150, 50], scale: 150, target: [2.5, 2.0, 0] });
  const right = views.top({ at: [408, 50], scale: 150, target: [2.5, 2.0, 0] });
  const gap = left.project([2.43, 1.78, 2.7]);
  return kit.svg({ width: 520, height: 240 },
    closeUp(kit, 'd018-mistake-a', 14, 14, 232, 180, '', drawMesh(kit, back(), left, { width: 1.4 }),
      drawMesh(kit, box({ size: [0.2, 3.6, 2.5], center: [2.46, -0.1, 1.45] }), left, { width: 1.4 }),
      kit.circle(gap[0], gap[1], 13, { cls: 'd-bad', width: 1.8 })),
    kit.tag(130, 222, 'placed by eye', { tone: 'bad' }),
    closeUp(kit, 'd018-mistake-b', 274, 14, 232, 180, '', drawMesh(kit, back(), right, { width: 1.4 }),
      drawMesh(kit, box({ size: [0.2, 3.6, 2.5], center: [2.4, 0, 1.45] }), right, { width: 1.4 })),
    kit.tag(390, 222, 'snapped'),
  );
};
