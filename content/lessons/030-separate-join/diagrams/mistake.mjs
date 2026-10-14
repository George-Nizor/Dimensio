// The joined rock pile turning round its origin. Wrong: Rock 5, a small rock at the edge, was
// active, so the origin and the turn sit off to one side. Right: Rock 1 was active, so the pile
// turns round its middle.
import { view, join } from '../../../diagrams/mesh.mjs';
import { rocks, ROCKS } from './props.mjs';
import { paint, panel } from './paint.mjs';

export default (kit) => {
  const left = view({ azimuth: 24, elevation: 26, at: [124, 112], scale: 120, target: [1.5, 0, 0.15] });
  const right = view({ azimuth: 24, elevation: 26, at: [376, 112], scale: 120, target: [1.5, 0, 0.15] });
  const pile = join(...rocks());
  const turn = (v, at, bad) => {
    const pts = [...Array(33).keys()].map((i) => v.project([at[0] + Math.cos((i * Math.PI) / 16) * 0.6, at[1] + Math.sin((i * Math.PI) / 16) * 0.6, 0]));
    const [x, y] = v.project(at);
    return [kit.polyline(pts, { cls: bad ? 'd-bad' : 'd-guide', width: 1.3, dash: '5 5' }), kit.dot(x, y, { r: 4.5, cls: 'd-mark-fill' })];
  };
  return kit.svg({ width: 500, height: 240 },
    panel(kit, 14, 14, 220, 184),
    paint(kit, pile, left, { width: 1.1, rim: 'd-mark' }),
    turn(left, ROCKS[4].at, true),
    kit.tag(124, 224, 'origin at the edge', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 184),
    paint(kit, pile, right, { width: 1.1, rim: 'd-mark' }),
    turn(right, ROCKS[0].at, false),
    kit.tag(376, 224, 'origin in the middle'),
  );
};
