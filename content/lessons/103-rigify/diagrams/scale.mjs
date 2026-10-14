// The meta-rig scaled from 1.98 m to the body's 1.7 m: a dashed line where its head was, the
// new height measured beside the body, and the keys S and Ctrl+A.
import { silhouette, bone, panel, push } from './helpers.mjs';
import { front, metaBones, bodyParts, K } from './rig.mjs';
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const p = front(170, 262, 118);
  const top = p([0, 0, 1.98]);
  const fit = p([0, 0, 1.7]);
  return kit.svg({ width: 460, height: 290 },
    panel(kit, 30, 14, 280, 260),
    silhouette(kit, bodyParts(p), { width: 1.4 }),
    metaBones(p, { k: K }).map(([, h, t]) => bone(kit, h, t, { width: 1.2 })),
    kit.line(120, top[1], 220, top[1], { cls: 'd-guide', width: 1.4, dash: '5 5' }),
    kit.text(226, top[1] + 4, '1.98 m', { size: 12 }),
    push(kit, 236, top[1] + 8, 236, fit[1] - 6, { width: 1.8, size: 7 }),
    kit.line(120, fit[1], 250, fit[1], { cls: 'd-mark', width: 1.6 }),
    kit.text(256, fit[1] + 4, '1.7 m', { size: 12 }),
    keycap(kit, 370, 110, 'S', { size: 13 }),
    kit.text(370, 142, 'scale by 0.86', { anchor: 'middle', size: 12 }),
    keycap(kit, 370, 190, 'Ctrl+A', { size: 13 }),
    kit.text(370, 222, 'apply the scale', { anchor: 'middle', size: 12 }),
  );
};
