// Interpolate Sequence between the drawings on frames 1 and 4: the two drawn flames at the ends and
// the in-betweens Blender makes on frames 2 and 3, blending one shape into the next.
import { keycap } from '../../../diagrams/mesh.mjs';
import { flame, mix, KEYS } from './flame.mjs';

export default (kit) => kit.svg({ width: 480, height: 240 },
  keycap(kit, 240, 24, 'Shift+Ctrl+E', { size: 12 }),
  [0, 1 / 3, 2 / 3, 1].map((t, i) => {
    const cx = 75 + i * 110;
    const ends = i === 0 || i === 3;
    return [
      flame(kit, cx, 190, mix(KEYS[0], KEYS[1], t), { size: 30, cls: ends ? 'd-ink' : 'd-guide', width: ends ? 2.4 : 1.8, fill: ends ? 'd-face-sel' : 'd-face-2' }),
      kit.text(cx, 222, `frame ${i + 1}`, { anchor: 'middle', size: 12, cls: ends ? 'd-label' : 'd-tag' }),
    ];
  }),
);
