// Seen from the front. Wrong: a post modelled with its origin in its middle is placed by that
// middle, so half of every post sinks below the curve. Right: with the origin at the base, each
// post stands on the curve.
import { views, drawMesh, join, translate } from '../../../diagrams/mesh.mjs';
import { post, panel } from './fence.mjs';

const row = (centred) => join(...[-1.5, 0, 1.5].map((x) => translate(post(centred), [x, 0, 0])));

export default (kit) => {
  const half = (x0, centred, tone) => {
    const v = views.front({ at: [x0 + 110, 112], scale: 40 });
    const [ax, ay] = v.project([-2.2, 0, 0]);
    const [bx] = v.project([2.2, 0, 0]);
    return [drawMesh(kit, row(centred), v, { width: 1.4 }), kit.line(ax, ay, bx, ay, { cls: tone, width: 2.4 }),
      [-1.5, 0, 1.5].map((x) => { const [px, py] = v.project([x, 0, centred ? 0 : 0]); return kit.dot(px, py, { r: 4, cls: 'd-mark-fill' }); })];
  };
  return kit.svg({ width: 500, height: 236 },
    panel(kit, 14, 14, 220, 170, 'origin in the middle'), half(14, true, 'd-bad'),
    kit.tag(124, 222, 'posts half buried', { tone: 'bad' }),
    panel(kit, 266, 14, 220, 170, 'origin at the base'), half(266, false, 'd-ink'),
    kit.tag(376, 222, 'posts on the curve'),
  );
};
