// The front and side pictures next to each other with a line through the blade's tip. Wrong: the
// side picture is smaller and lower, so its tip misses the line. Right: same Size and Offset, and
// the tips line up.
import { views } from '../../../diagrams/mesh.mjs';
import { picture } from './shapes.mjs';
import { panel } from '../../037-modifiers/diagrams/modkit.mjs';

export default (kit) => {
  const pair = (x, size) => {
    const vf = views.front({ at: [x + 66, 206], scale: 170, target: [0, 0, 0] });
    const vs = views.right({ at: [x + 170, 206], scale: 170, target: [0, 0, 0] });
    const [, ty] = vf.project([0, 0, 1]);
    return [
      panel(kit, x, 14, 232, 210),
      picture(kit, vf),
      picture(kit, vs, { side: true, size }),
      kit.line(x + 8, ty, x + 224, ty, { cls: size === 1 ? 'd-mark' : 'd-bad', width: 1.4, dash: '6 4' }),
    ];
  };
  return kit.svg({ width: 510, height: 262 },
    pair(14, 0.82), kit.tag(130, 250, 'different sizes', { tone: 'bad' }),
    pair(264, 1), kit.tag(380, 250, 'same Size and Offset'),
  );
};
