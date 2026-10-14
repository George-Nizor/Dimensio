// The 15-bone armature inside the character, front view: five down the middle and five on each
// side, the sides named .L and .R.
import { silhouette, bone, panel } from './helpers.mjs';
import { BONES, front, parts } from './figure.mjs';
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const s = 128;
  const p = front(150, 250, s);
  const label = (name, dx, dy, anchor = 'start') => {
    const [, h, t] = BONES.find(([n]) => n === name);
    const [x, y] = p([(h[0] + t[0]) / 2, (h[1] + t[1]) / 2]);
    return kit.text(x + dx, y + dy, name, { anchor, size: 10 });
  };
  return kit.svg({ width: 480, height: 280 },
    panel(kit, 20, 14, 260, 252),
    silhouette(kit, parts(p, s), { width: 1.2 }),
    BONES.map(([, h, t]) => bone(kit, p(h), p(t), { width: 1.2 })),
    label('head', 16, 0),
    label('forearm.L', 4, -12), label('forearm.R', -4, -12, 'end'), label('shin.L', 12, 0), label('shin.R', -12, 0, 'end'),
    keycap(kit, 380, 110, 'Ctrl+P', { size: 13 }),
    kit.text(380, 146, 'With Automatic', { anchor: 'middle', size: 12 }),
    kit.text(380, 162, 'Weights', { anchor: 'middle', size: 12 }),
  );
};
