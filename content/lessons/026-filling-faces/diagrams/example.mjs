// The exercise finished: the box's top closed and split into two quads, the tank's top grid
// filled, and the two halves of the pipe bridged into one tube.
import { view, translate } from '../../../diagrams/mesh.mjs';
import { splitBox, tank, pipe } from './shapes.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const v = view({ azimuth: 24, elevation: 30, at: [282, 118], scale: 96, target: [0.2, 0, 0.5] });
  return kit.svg({ width: 540, height: 230 },
    paint(kit, translate(splitBox(), [-1.9, 0, 0]), v, { width: 1.5 }),
    paint(kit, translate(tank('grid'), [-0.3, 0, 0]), v, { width: 1.5 }),
    paint(kit, translate(pipe(true), [1.6, 0, 0.5]), v, { width: 1.5 }),
  );
};
