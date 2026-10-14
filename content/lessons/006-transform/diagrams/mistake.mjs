// Wrong: a block moved freely with G looks right from the front but has drifted backwards, seen
// from the top. Right: the same move locked to X lines up from the front and the top.
import { views, drawMesh, translate } from '../../../diagrams/mesh.mjs';
import { panel } from './parts.mjs';
import { block } from './block.mjs';

export default (kit) => {
  const target = translate(block(), [1.2, 0, 0]);
  const pair = (x, moved, tag, tone) => {
    const front = views.front({ at: [x + 54, 100], scale: 62, target: [0.6, 0, 0.5] });
    const top = views.top({ at: [x + 166, 100], scale: 62, target: [0.6, 0.55, 0] });
    return [
      panel(kit, x, 30, 108, 140, 'front'),
      drawMesh(kit, target, front, { mode: 'wire', cls: 'd-guide', width: 1.2 }),
      drawMesh(kit, moved, front, { width: 1.6 }),
      panel(kit, x + 112, 30, 108, 140, 'top'),
      drawMesh(kit, target, top, { mode: 'wire', cls: 'd-guide', width: 1.2 }),
      drawMesh(kit, moved, top, { width: 1.6 }),
      kit.tag(x + 110, 214, tag, { tone }),
    ];
  };
  return kit.svg({ width: 500, height: 228 },
    pair(14, translate(block(), [1.2, 1.1, 0]), 'moved freely: drifted back', 'bad'),
    pair(266, target, 'locked to X: in line'),
  );
};
