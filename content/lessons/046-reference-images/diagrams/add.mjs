// The front view just after Add > Image > Reference: the picture faces the view, centred on the
// 3D cursor at the origin, half of it below the ground.
import { views } from '../../../diagrams/mesh.mjs';
import { picture } from './shapes.mjs';

export default (kit) => {
  const v = views.front({ at: [210, 120], scale: 170, target: [0, 0, 0] });
  const [cx, cy] = v.project([0, 0, 0]);
  return kit.svg({ width: 420, height: 250 },
    picture(kit, v, { lift: -0.5 }),
    kit.line(20, cy, 400, cy, { cls: 'd-axis-x', width: 1.4 }),
    kit.circle(cx, cy, 8, { cls: 'd-bad', width: 2, dash: '3 3' }),
    kit.line(cx - 13, cy, cx + 13, cy, { cls: 'd-ink', width: 1.2 }), kit.line(cx, cy - 13, cx, cy + 13, { cls: 'd-ink', width: 1.2 }),
    kit.text(330, cy - 8, 'ground', { size: 12 }),
    kit.text(210, 240, 'centred on the 3D cursor', { anchor: 'middle', size: 12 }),
  );
};
