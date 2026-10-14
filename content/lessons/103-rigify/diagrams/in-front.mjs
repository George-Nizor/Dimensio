// The meta-rig standing in the body, unscaled. Left, In Front off: the body hides the bones and
// only the head bone shows above it. Right, In Front on: every bone shows through the body.
import { silhouette, bone, panel } from './helpers.mjs';
import { front, metaBones, bodyParts } from './rig.mjs';

export default (kit) => {
  const draw = (x, through) => {
    const p = front(x, 236, 106);
    const bones = metaBones(p);
    const out = [silhouette(kit, bodyParts(p), { width: 1.4 })];
    for (const [name, h, t] of bones) {
      if (through || ['spine.005', 'spine.006'].includes(name)) out.push(bone(kit, h, t, { width: 1.2 }));
    }
    return out;
  };
  return kit.svg({ width: 460, height: 280 },
    panel(kit, 20, 10, 190, 236, 'In Front off'),
    draw(115, false),
    panel(kit, 250, 10, 190, 236, 'In Front on', { tone: 'mark' }),
    draw(345, true),
  );
};
