// The exercise finished: the lamp's base and pole as one object, the shade as its own object
// (outlined, selected), and the five rocks joined into one pile with its origin at the big rock.
import { view, join } from '../../../diagrams/mesh.mjs';
import { lamp, shade, rocks, ROCKS } from './props.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const v = view({ azimuth: 18, elevation: 20, at: [250, 128], scale: 170, target: [0.95, 0, 0.25] });
  const [ox, oy] = v.project(ROCKS[0].at);
  const [lx] = v.project([0, 0, 0]);
  return kit.svg({ width: 500, height: 240 },
    paint(kit, lamp(), v, { width: 1.2 }),
    paint(kit, shade(), v, { width: 1.2, inside: true, rim: 'd-mark' }),
    paint(kit, join(...rocks()), v, { width: 1.2 }),
    kit.dot(ox, oy, { r: 4, cls: 'd-mark-fill' }),
    kit.text(lx, 226, 'Lamp and Shade', { anchor: 'middle', size: 12 }),
    kit.text(ox, 226, 'Rock 1', { anchor: 'middle', size: 12 }),
  );
};
