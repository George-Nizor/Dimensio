// Keys for moving through time: Space plays and stops, Left and Right move one frame, Up jumps to the
// previous keyframe and Down to the next (swapped in Blender 5.0).
import { keycap } from '../../../diagrams/mesh.mjs';
import { strip } from './anim.mjs';

export default (kit) => {
  const t = strip(kit, { x: 30, y: 108, w: 470, h: 40, start: 0, end: 50, every: 10, keys: [1, 24, 48], frame: 30 });
  const [x24, x48, x30] = [t.fx(24), t.fx(48), t.fx(30)];
  return kit.svg({ width: 530, height: 200 },
    keycap(kit, 44, 30, 'Space'), kit.text(78, 35, 'play, stop', { size: 12 }),
    keycap(kit, 190, 30, 'Left'), keycap(kit, 248, 30, 'Right'), kit.text(282, 35, 'one frame', { size: 12 }),
    keycap(kit, 418, 30, 'Up'), keycap(kit, 470, 30, 'Down'),
    kit.arcArrow(x30, 102, x24, 102, { lift: -16 }), kit.text((x24 + x30) / 2, 76, 'Up', { anchor: 'middle', size: 12, cls: 'd-tag' }),
    kit.arcArrow(x30, 102, x48, 102, { lift: 16 }), kit.text((x48 + x30) / 2, 76, 'Down', { anchor: 'middle', size: 12, cls: 'd-tag' }),
    t.svg,
    kit.text(265, 188, 'Up: previous keyframe. Down: next keyframe.', { anchor: 'middle', size: 12 }),
  );
};
