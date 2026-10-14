// The same weights in two poses. Left, painted in the rest pose: with the arm out the weights look
// tidy, but lowering the arm folds the shoulder into a sharp crease. Right, painted with the arm
// lowered: the fold shows while you paint, and the weights fade so the shoulder bends in a curve.
import { shoulder, frame } from './shoulder.mjs';

export default (kit) => kit.svg({ width: 520, height: 300 },
  frame(kit, 12, 14, 244, 240),
  shoulder(kit, 80, 44, { weights: [0, 1, 1, 1, 1, 1, 1, 1], width: 0.8 }),
  shoulder(kit, 80, 150, { weights: [0, 1, 1, 1, 1, 1, 1, 1], deg: 55 }),
  kit.text(196, 122, 'rest pose: looks fine', { anchor: 'middle', size: 12 }),
  kit.text(196, 162, 'lowered: creases', { anchor: 'middle', size: 12 }),
  kit.tag(134, 280, 'painted in the rest pose', { tone: 'bad' }),
  frame(kit, 264, 14, 244, 240),
  shoulder(kit, 332, 100, { weights: [0, 0.3, 0.6, 0.85, 1, 1, 1, 1], deg: 55 }),
  kit.text(386, 50, 'arm lowered first', { anchor: 'middle', size: 12 }),
  kit.tag(386, 280, 'painted in a pose'),
);
