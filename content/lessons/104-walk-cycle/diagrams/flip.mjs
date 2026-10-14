// Copy the pose on frame 1 and paste it flipped on frame 13: the legs and arms swap sides, so
// the far leg now leads. The keys are Ctrl+C, then Shift+Ctrl+V.
import { walker, ground, push } from './helpers.mjs';
import { POSES, flip, place } from './walk.mjs';
import { keycap } from '../../../diagrams/mesh.mjs';

export default (kit) => {
  const a = place(POSES.contact, 110, 190, 1.3);
  const b = place(flip(POSES.contact), 410, 190, 1.3);
  return kit.svg({ width: 520, height: 230 },
    ground(kit, 30, 190, 190), ground(kit, 330, 490, 190),
    walker(kit, a, { s: 1.2, mark: 'near' }),
    walker(kit, b, { s: 1.2 }),
    kit.text(110, 214, 'frame 1', { anchor: 'middle', size: 12 }),
    kit.text(410, 214, 'frame 13', { anchor: 'middle', size: 12 }),
    keycap(kit, 260, 70, 'Ctrl+C', { size: 12 }),
    push(kit, 210, 110, 312, 110, { width: 2 }),
    keycap(kit, 260, 150, 'Shift+Ctrl+V', { size: 12 }),
  );
};
