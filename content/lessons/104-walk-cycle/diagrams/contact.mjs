// The contact pose on frame 1: the near (left) leg forward with its heel down, the far leg back
// on its toes, and the near arm swung back. The key I keys every selected bone.
import { walker, ground } from './helpers.mjs';
import { POSES, place } from './walk.mjs';
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const p = place(POSES.contact, 170, 214, 1.4);
  return kit.svg({ width: 440, height: 236 },
    ground(kit, 40, 300, 214),
    walker(kit, p, { s: 1.25, mark: 'near' }),
    kit.text(p.near.toe[0] + 10, p.near.toe[1] - 8, 'heel down', { size: 12 }),
    kit.text(p.far.toe[0] - 64, p.far.toe[1] - 26, 'toe down', { size: 12 }),
    kit.text(p.near.hand[0] - 74, p.near.hand[1] + 4, 'arm back', { size: 12 }),
    keycap(kit, 370, 90, 'A', { size: 13 }),
    kit.text(370, 122, 'select all', { anchor: 'middle', size: 12 }),
    keycap(kit, 370, 158, 'I', { size: 13 }),
    kit.text(370, 190, 'key frame 1', { anchor: 'middle', size: 12 }),
  );
};
