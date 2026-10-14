// L with the mouse over the lamp's shade in Edit Mode: every face connected to it is selected,
// and nothing else.
import { view, keycap, cursor, join } from '../../../diagrams/mesh.mjs';
import { lamp, shade } from './props.mjs';
import { paint } from './paint.mjs';

export default (kit) => {
  const v = view({ azimuth: 24, elevation: 22, at: [190, 196], scale: 330, target: [0, 0, 0] });
  const all = join(lamp(), shade());
  const first = lamp().faces.length;
  const [cx, cy] = v.project([0.08, -0.14, 0.44]);
  return kit.svg({ width: 460, height: 230 },
    paint(kit, all, v, { width: 1.4, inside: true, fill: (i) => (i >= first ? 'd-face-sel' : null) }),
    cursor(kit, cx, cy),
    keycap(kit, 370, 100, 'L'),
    kit.text(370, 134, 'select the part', { anchor: 'middle', size: 12 }),
    kit.text(370, 150, 'under the mouse', { anchor: 'middle', size: 12 }),
  );
};
