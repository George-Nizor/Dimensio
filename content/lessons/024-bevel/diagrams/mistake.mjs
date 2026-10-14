// One corner of a box 2 by 0.6 m from above, close up, after a 10 cm bevel. Wrong: the box was scaled
// in Object Mode, so the bevel is 10 cm along X and 3 cm along Y. Right: scale applied first, so
// the bevel is 10 cm both ways.
import { bevelledBox, scale, views, drawMesh, dimension } from '../../../diagrams/mesh.mjs';
import { closeUp } from './helpers.mjs';

export default (kit) => {
  const stretched = scale(bevelledBox({ size: [2, 2, 2], width: 0.1 }), [1, 0.3, 0.12]);
  const even = bevelledBox({ size: [2, 0.6, 0.24], width: 0.1 });
  const opts = { scale: 480, target: [0.8875, -0.2167, 0] };
  const left = views.top({ ...opts, at: [126, 100] });
  const right = views.top({ ...opts, at: [384, 100] });
  const dims = (v, wy) => [
    dimension(kit, v, [0.9, -0.3, 0.12], [1, -0.3, 0.12], { offset: [0, -0.06, 0], label: '10 cm' }),
    dimension(kit, v, [0.78, -0.3, 0.12], [0.78, -0.3 + wy, 0.12], { offset: [0.05, 0, 0], label: `${Math.round(wy * 100)} cm` }),
  ];
  return kit.svg({ width: 510, height: 240 },
    closeUp(kit, 'd024-mistake-a', 14, 14, 224, 180, '', drawMesh(kit, stretched, left, { width: 1.4 }), dims(left, 0.03)),
    kit.tag(126, 222, 'scaled in Object Mode', { tone: 'bad' }),
    closeUp(kit, 'd024-mistake-b', 272, 14, 224, 180, '', drawMesh(kit, even, right, { width: 1.4 }), dims(right, 0.1)),
    kit.tag(384, 222, 'scale applied first'),
  );
};
