// Smoothing the border. Left, a hard step: the arm at full weight right up to the torso, so the
// lowered arm creases sharply at the shoulder. Right, after the Blur brush the weight fades over
// three rings and the lowered arm bends in a curve.
import { shoulder, frame } from './shoulder.mjs';

export default (kit) => kit.svg({ width: 520, height: 260 },
  frame(kit, 12, 14, 244, 214, 'hard edge'),
  shoulder(kit, 84, 66, { weights: [0, 1, 1, 1, 1, 1, 1, 1], deg: 50 }),
  frame(kit, 264, 14, 244, 214, 'after Blur'),
  shoulder(kit, 336, 66, { weights: [0, 0.3, 0.6, 0.85, 1, 1, 1, 1], deg: 50 }),
);
