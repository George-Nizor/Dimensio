// Left, the Basic Human meta-rig fitted inside the body. Right, the rig Rigify generates from it:
// rings for the torso and wrists, boxes under the feet, and the bones that bend the body.
import { silhouette, bone, panel } from './helpers.mjs';
import { front, metaBones, bodyParts, K, fitted } from './rig.mjs';

export default (kit) => {
  const left = front(120, 262, 136);
  const right = front(380, 262, 136);
  const bones = (p) => metaBones(p, { k: K, edit: (n, e, q) => fitted(n, e, q) }).map(([, h, t]) => bone(kit, h, t, { width: 1.2 }));
  const ring = (p, at, rx, ry) => { const [x, y] = p(at); return kit.ellipse(x, y, rx, ry, { cls: 'd-mark', width: 2.2 }); };
  const foot = (p, x) => { const [cx, cy] = p([x, 0, 0.0]); return `<rect x="${cx - 12}" y="${cy - 4}" width="24" height="10" rx="2" class="d-mark" fill="none" stroke-width="2.2"/>`; };
  return kit.svg({ width: 500, height: 300 },
    panel(kit, 20, 10, 200, 262, 'meta-rig'),
    silhouette(kit, bodyParts(left), { width: 1.4 }),
    bones(left),
    panel(kit, 280, 10, 200, 262, 'generated rig'),
    silhouette(kit, bodyParts(right), { width: 1.4 }),
    bones(right),
    ring(right, [0, 0, 1.0], 34, 9), ring(right, [0, 0, 1.3], 30, 8),
    ring(right, [0.62, 0, 1.14], 9, 9), ring(right, [-0.62, 0, 1.14], 9, 9),
    foot(right, 0.11), foot(right, -0.11),
  );
};
